const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const hash = require('./hash');

function signTransaction(transaction, privateKey) {
  const key = ec.keyFromPrivate(privateKey);

  const hashTx = hash(
    transaction.fromAddress,
    transaction.toAddress,
    transaction.amount,
    transaction.timestamp,
  );
  const signature = key.sign(hashTx, 'base64');

  return signature.toDER('hex').toString();
}

module.exports = signTransaction;
