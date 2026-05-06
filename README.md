# WeChat-bookmark

一个基于微信云开发的记账小程序（TypeScript + 原生小程序）。

## 功能

- 微信身份登录（基于云函数获取 OpenID）
- 不同微信账号数据隔离（每个用户只能看到自己的账单）
- 账单新增、编辑、删除
- 按月查看收支与结余
- 跨设备同步（同一微信号）

## 技术栈

- 小程序原生框架（兼容性最好）
- TypeScript（严格模式）
- 微信云开发：Cloud Functions + Cloud Database

## 快速开始

1. 安装依赖

```bash
npm install
```

2. 打开微信开发者工具，导入本项目目录。

3. 创建云开发环境并替换 [miniprogram/app.ts](miniprogram/app.ts) 中的 `YOUR_ENV_ID`。

4. 在云开发数据库中新建集合 `transactions`，权限建议为：

```json
{
  "read": "auth != null",
  "write": "auth != null"
}
```

5. 在开发者工具中上传并部署云函数 [cloudfunctions/login](cloudfunctions/login)。

6. 编译运行。

## 目录结构

```text
.
├── cloudfunctions
│   └── login
├── miniprogram
│   ├── pages
│   │   ├── add
│   │   ├── index
│   │   └── profile
│   ├── types
│   └── utils
├── package.json
└── project.config.json
```

## 后续可扩展

- 预算管理、分类自定义
- 账单导出 CSV
- 图表可视化
