# IoTDB-UI

该项目是 IoTDB-UI 的前端，IoTDB-UI是一个可以深度管理IoTDB的管理系统，它提供了桌面软件级别的精确管理， 希望它能对您使用 IoTDB 有所帮助。

## 需求

Node 14.0 or above

Npm 6.0 or above

Nginx

### 环境准备

在项目根目录执行:

```bash
npm install
```

以安装 `node_modules`

### 可用脚本

项目提供了一些有用的脚本来帮助您快速启动和构建 Web 项目、代码样式检查和测试。具体位置见 `package.json`。 修改或添加其它脚本是安全的。

### 启动项目

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

#### 部署步骤

1. 在项目根目录执行 `npm install` 以安装
2. 在项目根目录执行  `npm run dev` 以启动，默认使用 8000 端口
3. 在项目根目录执行 `npm run build` 以构建，使用 nginx 映射 `/dist` 中的内容到一个端口 (例如 8040)，然后将 `/api/` 转发到一个地址 (例如 http://localhost:8080/api/)：
```
server {
	listen		8040;
	server_name	localhost;
	location / {
		root	iotdbui-front/dist;
		index	index.html;
	}
	location /api/ {
       proxy_pass    http://localhost:8080/api/;
    }
}
```
4. 如果在 nginx 上启用 websocket 功能，可以获得更好的用户体验。如果不启用 websocket 功能，也不会影响使用
5. 现在在浏览器打开之前设置的端口（如 http://localhost:8040/ ），开始享受 iotdb 的魅力吧！
