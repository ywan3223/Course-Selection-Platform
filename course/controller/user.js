
class User {
  constructor() {
    this.routes = [
      { url: '/user/register', method: 'post', handle: this.register }
    ]
  }

  /**
   * /user/register
   * @query {name} 
   * @query {email}
   * @query {password}
   */
  async register(req, res) {
    console.log(req.body)
    res.send('2');
  }
}

module.exports = new User();