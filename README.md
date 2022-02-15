# IoTDB-UI

This project is the front-end of IoTDB-UI. IoTDB-UI is a management system that can deeply manage IoTDB. It provides precise management at the desktop software level. I hope it will be helpful for you when using IoTDB.

## Required:

Node 14.0 or above
Npm 6.0 or above
Nginx

### Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

### Provided Scripts

This project provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm run dev
```

### Build project

```bash
npm run build
```

#### Deployment steps:

1. In the project root directory execute `npm install` to install
2. In the project root directory execute `npm run dev` to startup, 8000 port is used by default
3. In the project root directory execute `npm run build` to build, map the contents in `/dist` to a port through nginx (For example 8040), and map server api to an end-point (For example http://localhost:8080/api/):
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
4. If you enable the websocket feature on nginx, you can get a better user experience. If you do not enable it, it will not affect the use at all;
5. Now use your browser to open the port you previously set (for example http://localhost:8040/ £©, start to enjoy iotdb!
