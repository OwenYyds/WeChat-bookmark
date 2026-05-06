import { createRecord, getRecordById, updateRecord } from "../../utils/ledger";
import type { RecordType } from "../../types/ledger";

const CATEGORY_OPTIONS = ["餐饮", "交通", "购物", "娱乐", "工资", "其他"];
const DEFAULT_CATEGORY = "餐饮";

Page({
  data: {
    id: "",
    saving: false,
    isEdit: false,
    type: "expense" as RecordType,
    amount: "",
    category: DEFAULT_CATEGORY,
    categories: CATEGORY_OPTIONS,
    note: "",
    date: new Date().toISOString().slice(0, 10),
  },

  async onLoad(query: Record<string, string | undefined>) {
    const id = query.id;
    if (!id) {
      return;
    }

    const record = await getRecordById(id);
    if (!record) {
      wx.showToast({ title: "记录不存在", icon: "none" });
      return;
    }

    this.setData({
      id,
      isEdit: true,
      type: record.type,
      amount: String(record.amount),
      category: record.category,
      note: record.note ?? "",
      date: record.date,
    });
  },

  onTypeChange(event: WechatMiniprogram.CustomEvent<{ value: RecordType }>) {
    this.setData({ type: event.detail.value });
  },

  onAmountInput(event: WechatMiniprogram.CustomEvent<{ value: string }>) {
    this.setData({ amount: event.detail.value });
  },

  onCategoryChange(event: WechatMiniprogram.CustomEvent<{ value: string }>) {
    const index = Number(event.detail.value);
    const category = this.data.categories[index] ?? DEFAULT_CATEGORY;
    this.setData({ category });
  },

  onNoteInput(event: WechatMiniprogram.CustomEvent<{ value: string }>) {
    this.setData({ note: event.detail.value });
  },

  onDateChange(event: WechatMiniprogram.CustomEvent<{ value: string }>) {
    this.setData({ date: event.detail.value });
  },

  async onSubmit() {
    const amount = Number(this.data.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      wx.showToast({ title: "请输入有效金额", icon: "none" });
      return;
    }

    this.setData({ saving: true });

    try {
      const payload = {
        type: this.data.type,
        amount,
        category: this.data.category,
        note: this.data.note.trim(),
        date: this.data.date,
      };

      if (this.data.isEdit) {
        await updateRecord(this.data.id, payload);
      } else {
        await createRecord(payload);
      }

      wx.showToast({ title: "已保存", icon: "success" });
      wx.navigateBack();
    } finally {
      this.setData({ saving: false });
    }
  },
});
