const { exec } = require("../tool/database");
class Website {
  constructor() {}

  // get copyright
  async getCopyright() {
    const sql = `select  copyright from copyright where id = 1`;
    const res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      return res[0].copyright;
    }
    return '';
  }

  // set copyright
  async setCopyright(copyright) {
    const sql = `update copyright set copyright='${copyright}' where id=1`;
    const res = await exec(sql);
    return res && res.affectedRows === 1;
  }
}

module.exports = new Website();