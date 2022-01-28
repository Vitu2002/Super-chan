import { SuperChanTypes } from "../../types/Client";
import updateJson from "../../utils/functions/updateJsons"

export default async function updateJsons(SuperChan: SuperChanTypes) {
    await updateJson('select-roles', 'selectRoles');
    SuperChan.selectRoles = require('../../json/select-roles.json');
    await updateJson('select-menus', 'selectMenus');
    SuperChan.selectMenus = require('../../json/select-menus.json');
    await updateJson("tips", "tips")

}