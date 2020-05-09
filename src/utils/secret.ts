import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64';

// 你下面闷热吗
const key = CryptoJS.enc.Utf8.parse("5L2g5LiL6Z2i6Ze354Ot5ZCX"); // 秘钥
// 凉快
const iv = CryptoJS.enc.Utf8.parse('5YeJ5b+r'); // 默认偏移

function Encrypt(word, offset = '') {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: offset || iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

function Decrypt(word, offset = '') {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: offset || iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

function Encrypt_base64(origin, offset = 0) {
    const word = origin + offset;
    return Base64.encode(word);
}

function Decrypt_base64(word, offset = 0) {
    const decode = Base64.decode(word);
    return Number(decode) - offset;
}

function GenerateOffset(originOffset) {
    return CryptoJS.enc.Utf8.parse(originOffset)
}

export default {
    Decrypt,
    Encrypt,
    GenerateOffset,
    Encrypt_base64,
    Decrypt_base64,
}
