const WebsiteModel = require("../model/Website");
const Response = require("../tool/Response");
class Website {
  constructor() {
    this.routes = [
      { url: "/copyright/get", method: "get", handle: this.getCopyright },
      { url: "/copyright/set", method: "post", handle: this.setCopyright },
    ];
  }

  /**
   * /copyright/set
   */
  async setCopyright(req, res) {
    try {
      const { copyright } = req.body;
      const set_res = await WebsiteModel.setCopyright(copyright);
      if (set_res) {
        res.send(Response(0, 'update successfully', {}));
      } else {
        res.send(Response(0, 'update failly', {}));
      }
    } catch (err) {
      res.send(Response(1, err.stack, ""));
    }
  }

  /**
   * /copyright/get
   */
  async getCopyright(req, res) {
    try {
      const copyright = await WebsiteModel.getCopyright();
      res.send(Response(0, "ok", copyright));
    } catch (err) {
      res.send(Response(1, err.stack, ""));
    }
  }
}

module.exports = new Website();
