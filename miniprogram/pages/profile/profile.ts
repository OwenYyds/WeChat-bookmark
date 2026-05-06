import { ensureOpenId } from "../../utils/cloud";

Page({
  data: {
    openid: "",
    maskedOpenid: "",
  },

  async onShow() {
    const openid = await ensureOpenId();
    this.setData({
      openid,
      maskedOpenid: `${openid.slice(0, 6)}...${openid.slice(-6)}`,
    });
  },

  onCopyOpenid() {
    wx.setClipboardData({
      data: this.data.openid,
    });
  },
});
