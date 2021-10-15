import { Schema, model } from 'mongoose'

const schema = new Schema({
    id: {
        type: String,
        unique: true
    },
    value: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    donatorSince: {
        type: String,
        default: "2021-01-01-00-00-01"
    },
    isDonator: {
        type: Boolean,
        default: true
    },
    donateHistory: Array, // { date: String, value: Number }
})

const Model = model('padrinhos', schema)

export default Model