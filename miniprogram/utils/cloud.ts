const OPENID_STORAGE_KEY = "wechat-bookmark-openid";

type LoginResult = {
  openid: string;
};

type AppWithGlobalData = {
  globalData: {
    openid: string;
    cloudReady: boolean;
  };
};

export async function ensureOpenId(): Promise<string> {
  const app = getApp() as AppWithGlobalData;
  if (app.globalData.openid) {
    return app.globalData.openid;
  }

  const cached = wx.getStorageSync(OPENID_STORAGE_KEY) as string | undefined;
  if (cached) {
    app.globalData.openid = cached;
    return cached;
  }

  const result = (await wx.cloud.callFunction({
    name: "login",
  })) as unknown as { result: LoginResult };

  const openid = (result.result as LoginResult).openid;
  app.globalData.openid = openid;
  wx.setStorageSync(OPENID_STORAGE_KEY, openid);
  return openid;
}
