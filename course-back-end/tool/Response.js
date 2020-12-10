
function Response(status, msg, data) {
  return JSON.stringify({
    status,
    msg,
    data
  })
};

module.exports = Response;