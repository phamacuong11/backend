const dotenv = require("dotenv").config()
const express = require('express')
const connectDB = require('./config/connectDB')
const mongoose = require('mongoose')
const Task = require("./model/TaskModel")
const router = require("./routers/Rourtes")
const bodyParser = require('body-parser');

const app = express()
const PORT = 3000
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router)

let data = [
    { id: 1, name: 'Phạm A Cương' }
]

app.get('/', (req, res) => {
    res.send("Hello Word!")
})
// app.get('/todo', (req, res) => {
//     res.json(data)
// })

// app.delete('/todo/:name', async (req, res) => {

//     const name = req.params.name
//     const task = await Task.deleteOne({ name: name })
//     res.json(task)

//     // const deleteName = req.params.name
//     // const newData = data.filter((item) => item.name !== deleteName)
//     // console.log(newData);
//     // data = newData
//     // res.json(data)
// })


// app.post('/todo', (req, res) => {
//     const newData = data.concat({ name: req.body.name })
//     data = newData
//     res.send(data)
// })

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            { console.log("Example app listener on ", PORT) }
        })
    })

// const startServer = async () => {
//     try {
//         await connectDB()
//         app.listen(PORT, () => { console.log("Example app listener on ", PORT) } )
//     } catch (error) {
//         console.log(error)
//     }
// }

// startServer()