const mongoose = require('mongoose')

const TaskModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add task']
        },
        completed: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamp: true
    }
)
const Task = mongoose.model('Task', TaskModel)
module.exports = Task