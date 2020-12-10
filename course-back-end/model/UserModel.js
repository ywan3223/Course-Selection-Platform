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

  async getColumn(target, key, value) {
    const sql = `select ${target} from users where ${key}='${value}'`;
    const res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      return res[0][target];
    } else {
      return null;
    }
  }

  async getUserInfo(name) {
    const sql = `select id, name, email, token, role, state from users where name='${name}'`;
    const res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      return res[0];
    } else {
      return null;
    }
  }

  async getUserNameByEmail(email) {
    const sql = `select name from users where email='${email}'`;
    const res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      return res[0].name;
    }
    return '';
  }

  async getSaltByName(name) {
    return this.getColumn('salt', 'name', name);
  }

  async getHashByName(name) {
    return this.getColumn('hash', 'name', name);
  }

  async passwordIsRight(name, password) {
    // get salt and hash by name
    const salt = await this.getSaltByName(name);
    const hash = await this.getHashByName(name);

    // check password
    const res = mini_crypt.check(password, salt, hash);
    return res;
  }

  async tokenIsExist(token) {
    const sql = `select count(*) as count from users where token='${token}'`;
    const res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      return res[0].count > 0;
    } else {
      return true;
    }
  }

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

  async updatePassword(name, new_password) {
    const [salt, hash] = mini_crypt.hash(new_password);
    const token = md5(name + hash);
    const sql = `update users set salt='${salt}' and token='${token}' where name='${name}'`;
    const res = await exec(sql);
    if (res && res.affectedRows === 1) {
      return true;
    } else {
      return false;
    }
  }

  async updateUserProperty(column, new_value, user_id) {
    const sql = `update users set ${column}='${new_value}' where id=${user_id}`;
    const res = await exec(sql);
    if (res && res.affectedRows === 1) {
      return true;
    } 
    return false;
  }

  async getAllUser() {
    const sql = `select id, name, email, role, state from users where role != 'admin'`;
    const res = await exec(sql);
    if (Array.isArray(res)) {
      return res;
    } else {
      return [];
    }
  }


  async getUserNameById(id) {
    const sql = `select name from users where id = ${id}`;
    const res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      return res[0].name;
    }
    return '';
  }

  async register(name, email, password) {
    const [salt, hash] = mini_crypt.hash(password);
    const token = md5(name + hash);
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