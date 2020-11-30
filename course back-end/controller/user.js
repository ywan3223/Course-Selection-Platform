const UserModel = require("../model/UserModel");
const Response = require("../tool/Response");
const jwt = require("../tool/jwt");

class User {
  constructor() {
    this.routes = [
      { url: "/user/register", method: "post", handle: this.register },
      { url: "/user/login", method: "post", handle: this.login },
      { url: "/user/all", method: "get", handle: this.getAllUser },
      { url: "/user/update/role", method: "post", handle: this.updateUserRole },
      {
        url: "/user/update/state",
        method: "post",
        handle: this.updateUserState,
      },
    ];
  }

  /**
   * /user/update/role
   */
  async updateUserRole(req, res) {
    try {
      const { id, new_role } = req.body;
      const update_res = await UserModel.updateUserProperty(
        "role",
        new_role,
        id
      );
      if (update_res) {
        res.send(Response(0, "update role successfully", {}));
      } else {
        res.send(Response(0, "update role failly", {}));
      }
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /user/update/state
   */
  async updateUserState(req, res) {
    try {
      const { id, new_state } = req.body;
      const update_res = await UserModel.updateUserProperty(
        "state",
        new_state,
        id
      );
      if (update_res) {
        res.send(Response(0, "update state successfully", {}));
      } else {
        res.send(Response(0, "update state failly", {}));
      }
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /user/all
   */
  async getAllUser(req, res) {
    try {
      const allUser = await UserModel.getAllUser();
      res.send(Response(0, "ok", allUser));
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /user/login
   * @query {email}
   * @query {password}
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // check email if exist
      const email_exist = await UserModel.emailIsExist(email);
      if (!email_exist) {
        res.send( Response(1, `the email doesn't exist`, {}) );
        return;
      }
      
      // get name by email
      const name = await UserModel.getUserNameByEmail(email);

      // check password
      const password_is_right = await UserModel.passwordIsRight(name, password);
      if (!password_is_right) {
        res.send(Response(1`the password is not right`, {}));
        return;
      }

      // check user is whether activated or deactivated
      const user_info = await UserModel.getUserInfo(name);
      if (user_info.state !== "activated") {
        res.send(
          Response(
            1,
            `you can't login this web, please contact the manager!`,
            {}
          )
        );
        return;
      }

      // get the user basic info and write it in jwt.
      const signature = jwt.Signature(user_info);

      const data = Object.assign({ signature }, user_info);
      res.send(Response(0, "login successfully", data));
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /user/register
   * @query {name}
   * @query {email}
   * @query {password}
   */
  async register(req, res) {
    try {
      const { name, password, email } = req.body;

      // check email format
      const reg = /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
      if (!reg.test(email)) {
        res.send(Response(1, "The mailbox format is incorrect", {}));
        return;
      }

      // check email if exist
      const email_exist = await UserModel.emailIsExist(email);
      if (email_exist) {
        res.send(Response(1, "the email already exists", {}));
        return;
      }

      // check name if exist
      const name_exist = await UserModel.nameIsExist(name);
      if (name_exist) {
        res.send(Response(1, "the name already exists", {}));
        return;
      }

      // register new user
      const register_res = await UserModel.register(name, email, password);
      if (register_res) {
        res.send(Response(0, `register successfully!`, {}));
      } else {
        res.send(Response(1, `register failly!`, {}));
      }
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }
}

module.exports = new User();
