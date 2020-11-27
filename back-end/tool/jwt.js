const jws = require("jws");
const secret = require("../secrets.json").secret;

class Jwt {
  constructor() {}

  Signature(payload) {
    const signature = jws.sign({
      header: { alg: 'HS256' },
      payload,
      secret
    });
    return signature;
  }

  verify(signature, secret) {
    return jws.verify(signature, 'HS256', secret);
  }

  decode(signature) {
    return jws.decode(signature);
  }
}

module.exports = new Jwt();