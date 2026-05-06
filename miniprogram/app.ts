App({
  globalData: {
    openid: "",
    cloudReady: false,
  },

  onLaunch() {
    if (!wx.cloud) {
      wx.showModal({
        title: "基础库版本过低",
        content: "请升级微信后再试。",
      });
      return;
    }

    wx.cloud.init({
      env: "YOUR_ENV_ID",
      traceUser: true,
    });

    this.globalData.cloudReady = true;
  },
});
