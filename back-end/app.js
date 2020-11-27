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

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'));
});

const userController = require("./controller/user");
registerRoutes(userController.routes);

app.listen(port, () => console.log(`the server started at port ${port}`));


