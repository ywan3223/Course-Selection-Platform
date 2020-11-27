const c = require("crypto");

class MiniCrypt {
  constructor(its = 1e5, keyL = 64, saltL = 16, digest = "sha256") {
    this.its = its;
    this.keyL = keyL;
    this.saltL = saltL;
    this.digest = digest;
  }

  hash(pw) {
    const salt = c.randomBytes(this.saltL).toString("hex"), // get our new salt for this pw
      hash = c
        .pbkdf2Sync(pw, salt, this.its, this.keyL, this.digest)
        .toString("hex"); // hash the pw
    return [salt, hash]; // return the pair for safe storage
  }

  check(pw, salt, hash) {
    return c.timingSafeEqual(
      c.pbkdf2Sync(pw, salt, this.its, this.keyL, this.digest),
      Buffer.from(hash, "hex")
    );
  }
}

module.exports = MiniCrypt;
