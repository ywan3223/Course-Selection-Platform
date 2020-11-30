const express = require('express');
const app = express();
const port = 3003;
const path = require("path");
const bodyParser = require('body-parser');

const registerRoutes = (routes) => {
  routes.forEach(route => {
    app[route.method](route.url, route.handle);
  });
}

// midwares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//设置跨域访问
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Access-Token,Authorization");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json");
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'));
});

const userController = require("./controller/user");
registerRoutes(userController.routes);

const courseController = require("./controller/course");
registerRoutes(courseController.routes);

const scheduleController = require("./controller/schedule");
registerRoutes(scheduleController.routes);

app.listen(port, () => console.log(`the server started at port ${port}`));


