const SHA256 = require('crypto-js/sha256');

function hash(...data) {
  return SHA256(JSON.stringify(data)).toString();
}

module.exports = hash;
