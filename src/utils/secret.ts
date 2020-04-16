import CryptoJS from 'crypto-js';
// 你下面闷热吗
const key = CryptoJS.enc.Utf8.parse("5L2g5LiL6Z2i6Ze354Ot5ZCX"); // 秘钥
// 凉快
const iv = CryptoJS.enc.Utf8.parse('5YeJ5b+r'); // 默认偏移

function Decrypt(word, offset = '') {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: offset || iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

function Encrypt(word, offset = '') {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: offset || iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

function GenerateOffset(originOffset) {
    return CryptoJS.enc.Utf8.parse(originOffset)
}

export default {
    Decrypt,
    Encrypt,
    GenerateOffset,
}