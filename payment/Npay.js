// install new node module : npm install crypto-js
const MERCHANT_KEY = 'juAOxL';
const MERCHANT_SECRET_KEY = '3Je7RxfgIzbgbTyUX6uIa2FzhcQv1apHdap';
const END_POINT = 'https://sand-payment.9pay.vn';

var time = Math.round(Date.now() / 1000);
var invoiceNo = getInvoiceNo(8);
var amount = 10000; // This value is better than 3000 VND. We only use currency is "VND"
var description = "This is description";
var returnUrl = "http://fcdcc4767acb.ngrok.io/";
var parameters = {
    "merchantKey": MERCHANT_KEY,
    "time": time,
    "invoice_no": invoiceNo,
    "amount": amount,
    "description": description,
    "return_url": returnUrl,
    "back_url": returnUrl,
};
var httpQuery = buildHttpQuery(parameters);
var message = "POST" + "\n" + END_POINT + "/payments/create" + "\n" + time + "\n" + httpQuery;
var signature = buildSignature(message, MERCHANT_SECRET_KEY);
var baseEncode = Buffer.from(JSON.stringify(parameters)).toString('base64');
var httpBuild = {
    "baseEncode": baseEncode,
    "signature": signature
};
var directUrl = END_POINT + "/portal?" + buildHttpQuery(httpBuild);

// This is url use for redirect to 9Pay portal
console.log(directUrl);

function getInvoiceNo(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function buildHttpQuery(data) {
    let httpQuery = new URLSearchParams();

    const ordered = Object.keys(data).sort().reduce(
        (obj, key) => {
            obj[key] = data[key];
            return obj;
        },
        {}
    );

    Object.keys(ordered).forEach(function (parameterName) {
        httpQuery.append(parameterName, ordered[parameterName]);
    });
    return httpQuery.toString();
}

function buildSignature(data, secret) {
    let crypto = require('crypto');
    let token = crypto.createHmac("sha256", secret).update(data).digest().toString('base64');
    return token;
}
module.exports = { buildHttpQuery }