const jws = require("jws");

const signature = jws.sign({
  header: { alg: 'HS256' },
  payload: {
    role: 'admin'
  },
  secret: 'dqwdq'
});

const UserModel = require("./model/UserModel");
UserModel.emailIsExist('dwqdq').then(res => {
  console.log(res)
})
