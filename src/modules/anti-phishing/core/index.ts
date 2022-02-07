import createBotConnect from '../../../functions/createBotConnection';
import updateLinks from '../functions/updateLinks';
import { connect } from "mongoose";

const Client = createBotConnect({
    moduleName: "anti-phishing"
});

connect(`${process.env.MONGO_URI}`).then(() => { console.log("Database ligada com sucesso!") });


export async function UpdateLinks() {
    await updateLinks(Client)
}