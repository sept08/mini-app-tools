import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64';

// 你下面闷热吗
const key = CryptoJS.enc.Utf8.parse("5L2g5LiL6Z2i6Ze354Ot5ZCX"); // 秘钥
// 凉快
const iv = CryptoJS.enc.Utf8.parse('5YeJ5b+r'); // 默认偏移

/**
 * 基于AES的非对称加密
 * @param info 原文，默认使用时间戳
 * @param offset 偏移量
 * @constructor
 */
function Encrypt(originOffset = '', info?) {
    let word = info;
    if (!word) {
        word = new Date().getTime();
    }
    const offset = CryptoJS.enc.Utf8.parse(originOffset);
    const origin = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(origin, key,{iv: offset || iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
    return encrypted.ciphertext.toString().toUpperCase();
}

function Decrypt(word, offset = '') {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: offset || iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

/**
 * 基于Base64的对称加密
 * @param info 原文，默认使用基于分钟的时间戳
 * @param offset
 * @constructor
 */
function Encrypt_base64(info, offset = 0) {
    let word = info;
    if(!word) {
        word = parseInt(`${new Date().getTime() / 60000}`);
    }
    return Base64.encode(word + offset);

}

function Decrypt_base64(word, offset = 0) {
    const decode = Base64.decode(word);
    return Number(decode) - offset;
}

/**
 * 基于产品需求设计的令人无语的嘤嘤码
 * @param offset
 * @constructor
 */
function EncryptYY() {
    const date = new Date();
    const time = dateFormat('SS,HH,dd,MM', date).split(',');
    let ret:Array<string> = [];
    const key1 = Number(time[0].charAt(1));
    const key2 = Number(time[0].charAt(0)) ^ key1;
    ret.push(time[0]);
    // 时
    const numH = Number(time[1]) ^ key1;
    ret.push(numH < 10 ? `0${numH}` : `${numH}`);
    // 分
    const numM = Number(time[3]) ^ key2;
    ret.push(numM < 10 ? `0${numM}` : `${numM}`);
    // 天
    const numD = Number(time[2]) ^ key2;
    ret.push(numD < 10 ? `0${numD}` : `${numD}`);
    return ret.join('');
}

function DecryptYY(word) {
    if (word.length !== 8) return false;
    const s = word.slice(0, 2);
    const h = word.slice(2, 4);
    const m = word.slice(4, 6);
    const d = word.slice(6, 8);

    const key1 = Number(s.charAt(1));
    const key2 = Number(s.charAt(0)) ^ key1;
    const originH = Number(h) ^ key1;
    const originM = Number(m) ^ key2;
    const originD = Number(d) ^ key2;
    // 添加时间约束
    if (Number(s) > 60) return false;
    if (originH > 24 || originM > 60 || originD > 31) return false;
    // 解码规则
    const curDate = new Date();
    const curH = curDate.getHours();
    const curM = curDate.getMinutes();
    // 跨24小时
    const curTime = curH + curM / 60;
    const originTime = originH + originM / 60;
    if (curTime - originTime < 0) {
        if (curTime + 24 - originTime > 0.5) return false;
    } else if (curTime - originTime > 0.5) {
        return false;
    }
    return true;
}

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}

const CodeTypeEnum = {
    YY: 0,
    Base64: 1,
    AES: 2
};

export default {
    CodeTypeEnum,
    Decrypt,
    Encrypt,
    Encrypt_base64,
    Decrypt_base64,
    EncryptYY,
    DecryptYY,
}
