const express = require('express')
var CryptoJS = require("crypto-js");
const Task = require('../model/TaskModel')
const END_POINT = 'https://sand-payment.9pay.vn';
var checksum_key = "bg8GwM3SqcDfG61tCOwiDBHSFEl1b5Wd";
const router = express.Router()



router.get('/todo', async (req, res) => {
    try {
        const dataa = await Task.find()
        res.json(dataa)
    } catch (error) {
        res.status(500).json({ msg: error.message })

    }
})

router.post('/todo', async (req, res) => {
    try {
        const dataa = await Task.create({ name: req.body.name })
        res.status(200).json(dataa)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }

    // const newData = data.concat({ name: req.body.name })
    // console.log(newData)
    // data = newData
    // res.json(data)
})
router.delete('/todo/:_id', async (req, res) => {

    const _id = req.params._id
    const task = await Task.deleteOne({ _id: _id })
    res.json(task)

    // const deleteName = req.params.name
    // const newData = data.filter((item) => item.name !== deleteName)
    // console.log(newData);
    // data = newData
    // res.json(data)
})
router.patch('/todo/:_id', async (req, res) => {
    try {
        const id = req.params._id
        const completed = req.body.completed
        await Task.findByIdAndUpdate(id, { completed: completed })
        console.log(completed);
    } catch (error) {
        console.log(error);
    }
})
var result = "eyJhbW91bnQiOjU1MDAwLCJhbW91bnRfZm9yZWlnbiI6bnVsbCwiYW1vdW50X29yaWdpbmFsIjpudWxsLCJhbW91bnRfcmVxdWVzdCI6NTUwMDAsImJhbmsiOm51bGwsImNhcmRfYnJhbmQiOiJTTUwiLCJjYXJkX2luZm8iOnsiY2FyZF9uYW1lIjoiTkdVWUVOIFZBTiBBIiwiaGFzaF9jYXJkIjoiNTUwNGI5ODA4Y2RhYmU3YmRkMWQ4NWI0MDM5MjBiMjUiLCJjYXJkX2JyYW5kIjoiU01MIiwiY2FyZF9udW1iZXIiOiI5NzA0MDB4eHh4eHgwMDE4In0sImNyZWF0ZWRfYXQiOiIyMDIyLTA0LTEyVDAwOjI2OjAwLjAwMDAwMFoiLCJjdXJyZW5jeSI6IlZORCIsImRlc2NyaXB0aW9uIjoiVGhhbmggVG_DoW4gVGnhu4FuIFPDoWNoICIsImV4Y19yYXRlIjpudWxsLCJmYWlsdXJlX3JlYXNvbiI6bnVsbCwiZm9yZWlnbl9jdXJyZW5jeSI6bnVsbCwiaW52b2ljZV9ubyI6IjYyNTUyOTA5YTZmOWNmYmRmMDdkMDJlZCIsImxhbmciOm51bGwsIm1ldGhvZCI6IkFUTV9DQVJEIiwicGF5bWVudF9ubyI6Mjk0MDE5ODk2MzMxLCJzdGF0dXMiOjUsInRlbm9yIjpudWxsfQ";
var checksum = "bg8GwM3SqcDfG61tCOwiDBHSFEl1b5Wd";

router.post('/payment/success', (req, res) => {
    const { result, checksum } = req.body;
    const ipnData = req.body;
    console.log('Received IPN:', ipnData);
    // Phản hồi cho ngân hàng để xác nhận đã nhận được IPN
    res.send('IPN received and processed successfully');
    const sha256Data = Buffer.from(result, 'base64').toString('utf-8');
    const secretKey = 'gnlUmdLVCSqTk8eKrGhfCPZYDog39I3ZmkE';
    const hash = crypto.createHash('sha256').update(result + secretKey).digest('hex');
    if (hash === checksum) {
        // checksum hợp lệ, xử lý dữ liệu đã giải mã ở đây
        console.log('Dữ liệu đã giải mã:', sha256Data);
        res.sendStatus(200);
    } else {
        // checksum không hợp lệ
        console.log('Checksum không hợp lệ, xác thực không thành công');
        res.sendStatus(400);
    }

    // const sha256Data = CryptoJS.SHA256(result + checksum_key);
    // console.log(sha256Data);
    // console.log(result);
    // console.log(checksum);
    // let buff = Buffer.from(result, 'base64');
    // let text = buff.toString('ascii');
    // console.log(text);

})
// router.post('/payment/success', (req, res) => {
//     // Xử lý dữ liệu IPN ở đây
//     const ipnData = req.body;
//     console.log('Received IPN:', ipnData);

//     // Phản hồi cho ngân hàng để xác nhận đã nhận được IPN
//     res.send('IPN received and processed successfully');
// });



const MERCHANT_KEY = 'MWdplL';
const MERCHANT_SECRET_KEY = 'gnlUmdLVCSqTk8eKrGhfCPZYDog39I3ZmkE';

var time = Math.round(Date.now() / 1000);
var invoiceNo = getInvoiceNo(8);
let amount = 15000 // This value is better than 3000 VND. We only use currency is "VND"
// console.log(amount);
var description = "This is description";
var returnUrl = "";
let parameters = {
    "merchantKey": MERCHANT_KEY,
    "time": time,
    "invoice_no": invoiceNo,
    "amount": amount,
    "description": description,
    "return_url": returnUrl,
    "back_url": returnUrl,
};
console.log(parameters);

var httpQuery = buildHttpQuery(parameters);
var message = "POST" + "\n" + END_POINT + "/payments/create" + "\n" + time + "\n" + httpQuery;
var signature = buildSignature(message, MERCHANT_SECRET_KEY);
var baseEncode = Buffer.from(JSON.stringify(parameters)).toString('base64');
var httpBuild = {
    "baseEncode": baseEncode,
    "signature": signature
};


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


router.post('/paymentUrl', (req, res) => {
    const newAmount = req.body.amount
    const newDescription = req.body.description
    parameters['amount'] = newAmount;
    httpBuild['amount'] = newAmount;
    parameters['description'] = newDescription;
    httpBuild['description'] = newDescription;
    amount = newAmount
    var httpQuery = buildHttpQuery(parameters)
    var message = "POST" + "\n" + END_POINT + "/payments/create" + "\n" + time + "\n" + httpQuery;
    var signature = buildSignature(message, MERCHANT_SECRET_KEY);
    var baseEncode = Buffer.from(JSON.stringify(parameters)).toString('base64');
    httpBuild = {
        "baseEncode": baseEncode,
        "signature": signature
    };
    var directUrl = END_POINT + "/portal?" + buildHttpQuery(httpBuild);
    // console.log(directUrl);
    res.json(directUrl)
    // res.json('https://sand-payment.9pay.vn/portal?baseEncode=eyJtZXJjaGFudEtleSI6Imp1QU94TCIsInRpbWUiOjE3MDY4MDI5MTAsImludm9pY2Vfbm8iOiIyTFVkek81QSIsImFtb3VudCI6MTAwMDAsImRlc2NyaXB0aW9uIjoiVGhpcyBpcyBkZXNjcmlwdGlvbiIsInJldHVybl91cmwiOiJodHRwOi8vZmNkY2M0NzY3YWNiLm5ncm9rLmlvLyIsImJhY2tfdXJsIjoiaHR0cDovL2ZjZGNjNDc2N2FjYi5uZ3Jvay5pby8ifQ%3D%3D&signature=P%2BEBez6lOF3LSI7xq2NPuo5Xe%2F4Xb3z6isgZRXUekKo%3D')
})

module.exports = router