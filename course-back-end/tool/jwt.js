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

  getPayLoad(signature) {
    try {
      const decode_res = this.decode(signature);
      const payload = JSON.parse(decode_res.payload);
      return payload;
    } catch(err) {
      return {};
    }
    
  }

  resolveHeaderSignature(req) {
    try {
      const authorization = req.headers.authorization;
      const signature = authorization.split(' ')[1];
      return signature;
    } catch(err) {
      return false;
    }
  } 
}

module.exports = new Jwt();