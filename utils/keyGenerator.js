const keccak256 = require('js-sha3').keccak256;
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

function generateKeyPair() {
  return ec.genKeyPair();
}

function getPublicKey(key) {
  return key.getPublic('hex');
}

function getPrivateKey(key) {
  return key.getPrivate('hex');
}

function getAddress(publicKey) {
  const publicKeyHash = keccak256(Buffer.from(publicKey, 'hex'));
  const address = '0x' + publicKeyHash.slice(-40);
  return address;
}

const keyPair = generateKeyPair();
const publicKey = getPublicKey(keyPair);
const privateKey = getPrivateKey(keyPair);
const address = getAddress(publicKey);

module.exports = {
  publicKey,
  privateKey,
  address,
  getAddress,
};
