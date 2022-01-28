import { existsSync, unlinkSync, writeFileSync } from "fs";
import selectRoles from "../../database/models/menuRoles";
import selectMenus from "../../database/models/menus";
import { cyan, green, yellow, gray } from "colors"
import Tips from "../../database/models/tips";


export default async function updateJson(jsonName: string, schema: "selectRoles" | "selectMenus" | "padrinhos" | "tips"): Promise<void> {
    try {
        const hasFile = await existsSync(`src/json/${jsonName}`)
        let Schema

        switch (schema) {
            case "selectMenus": Schema = selectMenus; break;
            case "selectRoles": Schema = selectRoles; break;
            case "tips": Schema = Tips; break;
        }

        if (hasFile) unlinkSync(`src/json/${jsonName}`)

        const data = await Schema?.find()

        await writeFileSync(`src/json/${jsonName}.json`, JSON.stringify(data))

        return console.log(cyan('[SYSTEM]') + green(` O arquivo json ${gray(jsonName)} foi carregado com sucesso!`))
    } catch (err) {
        return console.error(cyan('[SYSTEM]') + yellow(' Ocorreu algum erro ao carregar o json ') + gray(jsonName) + " :" + err)
    }
}