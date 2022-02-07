import createBotConnect from '../../../functions/createBotConnection';
import updateMenuRoles from '../functions/updateMenuRoles';
import { connect } from 'mongoose';

const Client = createBotConnect({
    moduleName: "roles",
    buttons: true,
    selects: true
});

connect(`${process.env.MONGO_URI}`).then(() => { console.log("Database ligada com sucesso!") });

export async function UpdateMenuRoles() {
    await updateMenuRoles(Client);
};