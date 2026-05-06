import { getCurrentMonth } from "../../utils/date";
import { ensureOpenId } from "../../utils/cloud";
import { deleteRecord, listRecords } from "../../utils/ledger";
import type { LedgerRecord } from "../../types/ledger";

type ViewRecord = LedgerRecord & {
  displayAmount: string;
  isExpense: boolean;
};

Page({
  data: {
    month: getCurrentMonth(),
    loading: false,
    records: [] as ViewRecord[],
    incomeTotal: "0.00",
    expenseTotal: "0.00",
    balance: "0.00",
  },

  async onShow() {
    await ensureOpenId();
    await this.fetchRecords();
  },

  async onPullDownRefresh() {
    await this.fetchRecords();
    wx.stopPullDownRefresh();
  },

  async onMonthChange(event: WechatMiniprogram.CustomEvent<{ value: string }>) {
    this.setData({ month: event.detail.value });
    await this.fetchRecords();
  },

  onTapCreate() {
    wx.navigateTo({
      url: "/pages/add/add",
    });
  },

  onTapEdit(event: WechatMiniprogram.BaseEvent) {
    const { id } = event.currentTarget.dataset as { id: string };
    wx.navigateTo({
      url: `/pages/add/add?id=${id}`,
    });
  },

  async onTapDelete(event: WechatMiniprogram.BaseEvent) {
    const { id } = event.currentTarget.dataset as { id: string };

    const modal = await wx.showModal({
      title: "删除记录",
      content: "确认删除这条记录吗？",
      confirmColor: "#ef4444",
    });

    if (!modal.confirm) {
      return;
    }

    await deleteRecord(id);
    await this.fetchRecords();
  },

  async fetchRecords() {
    this.setData({ loading: true });
    try {
      const records = await listRecords(this.data.month);

      let income = 0;
      let expense = 0;
      const mapped: ViewRecord[] = records.map((item) => {
        if (item.type === "income") {
          income += item.amount;
        } else {
          expense += item.amount;
        }

        return {
          ...item,
          displayAmount: item.amount.toFixed(2),
          isExpense: item.type === "expense",
        };
      });

      this.setData({
        records: mapped,
        incomeTotal: income.toFixed(2),
        expenseTotal: expense.toFixed(2),
        balance: (income - expense).toFixed(2),
      });
    } finally {
      this.setData({ loading: false });
    }
  },
});
