import { blue, green } from "colors"
import { connect } from "mongoose"

async function Connect() {
    const MongoDB = await connect(`${process.env.MONGO_URI}`)
    console.log(blue('[MongoDB]') + green(' Conectado com sucesso!'))
    return MongoDB
}



export default Connect