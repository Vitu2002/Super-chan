import { model, Schema } from "mongoose";

const schema = new Schema({
    id: {
        type: String,
        unique: true
    },
    candy: {
        type: Number,
        default: 0
    },
    used: {
        type: Number,
        default: 0
    },
    buyRoleDays: {
        type: Number,
        default: 7
    },
    tickets: {
        type: Number,
        default: 0
    },
    lastDate: {
        type: String,
        default: '2021-01-01-00-00-01'
    },
    buys: Array
})

const Model = model('halloween_members', schema)

export default Model