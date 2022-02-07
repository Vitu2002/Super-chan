import createBotConnect from '../../../functions/createBotConnection';
import { connect } from 'mongoose';

const Client = createBotConnect({
    moduleName: "slashs",
    commands: false,
    buttons: false,
    selects: false,
    slashs: true
});

connect(`${process.env.MONGO_URI}`).then(() => { console.log("Database ligada com sucesso!") });
