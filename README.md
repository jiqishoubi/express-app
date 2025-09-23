# Express Admin Backend

基于 Express + TypeScript + TypeORM 的简易后台管理系统，提供用户、文章的增删改查，图片上传以及 JWT 鉴权功能，默认使用 MySQL 作为持久化层。

## 功能概览
- 用户注册、登录，基于角色（`admin`/`editor`/`user`）的权限控制。
- 用户 CRUD 接口（管理员、编辑可查，管理员可增删改）。
- 文章 CRUD 接口，支持封面图上传。
- 本地文件系统图片上传，限制图片类型与大小（5MB）。
- 健康检查 `/health`。

## 环境要求
- Node.js 18+
- 已可访问的 MySQL 实例（建议 5.7+ / 8.x）

## 快速开始
1. 安装依赖：
   ```bash
   npm install
   ```
2. 配置环境：
   ```bash
   cp .env.example .env
   ```
   关键配置项：
   - `JWT_SECRET`：设置足够复杂的随机字符串。
   - `DB_HOST` / `DB_PORT`：MySQL 地址与端口，默认 `localhost:3306`。
   - `DB_USERNAME` / `DB_PASSWORD`：数据库连接账号密码。
   - `DB_NAME`：数据库名称（需提前创建，例如 `express_admin`）。
   - `UPLOAD_DIR`：上传目录，默认 `./uploads`。
3. 初始化数据库：
   ```sql
   CREATE DATABASE IF NOT EXISTS express_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. 启动开发服务器：
   ```bash
   npm run dev
   ```
   或者构建后运行：
   ```bash
   npm run build
   npm start
   ```

默认监听 `http://localhost:3000`，上传目录会在启动时自动创建。

## 接口说明
所有业务接口挂载在 `/api` 下，成功登录后需携带 `Authorization: Bearer <token>` 请求头。

- `POST /api/auth/register`：注册。请求体 `{ email, name, password, role? }`，返回用户信息和 JWT。
- `POST /api/auth/login`：登录。请求体 `{ email, password }`，成功时返回用户信息和 JWT。
- `GET /api/users`：列出用户（需 `admin`/`editor`）。
- `GET /api/users/:id`：用户详情（需 `admin`/`editor`）。
- `POST /api/users`：创建用户（需 `admin`）。
- `PUT /api/users/:id`：更新用户（需 `admin`）。
- `DELETE /api/users/:id`：删除用户（需 `admin`）。
- `GET /api/articles`：文章列表（公开）。
- `GET /api/articles/:id`：文章详情（公开）。
- `POST /api/articles`：创建文章（需 `admin`/`editor`，表单字段 `coverImage` 为文件）。
- `PUT /api/articles/:id`：更新文章（需 `admin`/`editor`）。
- `DELETE /api/articles/:id`：删除文章（需 `admin`）。
- `POST /api/uploads/images`：单图上传（需登录，表单字段 `file`）。

上传成功会返回 `url` 字段，可直接通过 `/uploads/<filename>` 访问。

## 角色与初始化
注册接口默认角色为 `user`。建议在首次部署后：
1. 调整 `.env` 中的 `JWT_SECRET`。
2. 通过数据库手动将目标账号的 `role` 更新为 `admin`。
3. 或临时修改 `register` 接口默认角色为 `admin` 以创建首个管理员，创建完成后改回。

## 目录结构
```
.
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
├── src
│   ├── server.ts
│   ├── app.ts
│   ├── routes
│   ├── config
│   ├── middleware
│   ├── modules
│   ├── utils
│   └── types
└── uploads         # 上传文件目录（可配置）
```

## 常见问题
- **数据库连接失败**：确认 MySQL 运行正常、账号有访问权限、IP 白名单允许当前主机。
- **错误 `JWT_SECRET is not configured`**：请确认 `.env` 已设置并在启动前加载。
- **权限被拒绝**：确保使用 `Authorization: Bearer <token>` 请求头，并确认账号角色。
- **上传失败**：检查表单字段名称是否为 `file`，文件是否为图片且不超过 5MB。

欢迎根据业务需求扩展更多模型与接口。
