const { exec } = require("../tool/database");
const MiniCrypt = require("../tool/miniCrypt");
const mini_crypt = new MiniCrypt();
const md5 = require("js-md5");

const Role = {
  visitor: 'visitor',
  user: 'user',
  admin: 'admin'
}

class UserModel {
  constructor(){}

  async nameIsExist(name) {
    const sql = `select count(*) as count from users where name='${name}'`;
    const res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      return res[0].count > 0;
    } else {
      return true;
    }
  }

  async emailIsExist(email) {
    const sql = `select count(*) as count from users where email='${email}'`;
    const res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      return res[0].count > 0;
    } else {
      return true;
    }
  }

  async register(name, email, password) {
    const [salt, hash] = mini_crypt.hash(password);
    const token = md5(email + hash);
    const role = Role.user;
    const sql = `insert users (name, email, salt, hash, token, role)values(
      '${name}', '${email}', '${salt}', '${hash}', '${token}', '${role}'
    )`;
    const res = await exec(sql);
    if (res && res.affectedRows === 1) {
      return true;
    } else {
      return false;
    }
  }

}

module.exports = new UserModel();