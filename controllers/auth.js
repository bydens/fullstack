module.exports.login = (req, resp) => {
  resp.status(200).json({
    login: {
      email: req.body.email,
      password: req.body.password
    }
    // login: req.body
  })
};

module.exports.register = (req, resp) => {
  resp.status(200).json({
    register: 'Register from controller'
  })
};