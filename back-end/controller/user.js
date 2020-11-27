const UserModel = require("../model/UserModel");
const Response = require("../tool/Response");
const jwt = require("../tool/jwt");

class User {
  constructor() {
    this.routes = [
      { url: '/user/register', method: 'post', handle: this.register },
      { url: '/user/login', method: 'post', handle: this.login }
    ]
  }

  /**
   * /user/login
   * @query {name}
   * @query {password}
   */
  async login(req, res) {
    const { name, password } = req.body;
 
    // check name if exist
    const name_exist = await UserModel.nameIsExist(name);
    if (!name_exist) {
      res.send( Response(1, `The user doesn't exist`, {}) );
      return;
    } 

    // check password
    const password_is_right = await UserModel.passwordIsRight(name, password);
    if (!password_is_right) {
      res.send( Response(1. `the password is not right`, {}) );
      return;
    }

    // get the user basic info and write it in jwt.
    const user_info = await UserModel.getUserInfo(name);
    const signature = jwt.Signature(user_info);

    const data = Object.assign({ signature }, user_info);
    res.send( Response(0, 'login successfully', data));    
  }

  /**
   * /user/register
   * @query {name} 
   * @query {email}
   * @query {password}
   */
  async register(req, res) {
    const { name, password, email } = req.body;
    
    // check email format
    const reg = /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
    if (!reg.test(email)) {
      res.send( Response(1, 'The mailbox format is incorrect', {}) );
      return;
    } 
    
    // check email if exist
    const email_exist = await UserModel.emailIsExist(email);
    if (email_exist) {
      res.send( Response(1, 'the email already exists', {}) );
      return;
    }

    // check name if exist
    const name_exist = await UserModel.nameIsExist(name);
    if (name_exist) {
      res.send( Response(1, 'the name already exists', {}) );
      return;
    }

    // register new user
    const register_res = await UserModel.register(name, email, password);
    if (register_res) {
      res.send( Response(0, `register successfully!`, {}) );
    } else {
      res.send( Response(1, `register failly!`, {}) );
    }
    
  }
}

module.exports = new User();