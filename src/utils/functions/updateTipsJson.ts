import { existsSync, unlinkSync, writeFileSync } from "fs";
import { cyan, green, yellow, gray } from "colors"
import Tips from "../../database/models/tips";
import TipsPromps from "../../types/Tips";

export default async function UpdateTipsJson() {
    try {
        const hasFile = await existsSync('src/json/tips.json')

        if (hasFile) unlinkSync('src/json/tips.json')

        const data: TipsPromps[] = await Tips.find()

        await writeFileSync('src/json/tips.json', JSON.stringify(data))

        console.log(cyan('[SYSTEM]') + green(` O arquivo ${gray('tips.json')} foi carregado com sucesso!`))
    } catch (err) {
        console.error(cyan('[SYSTEM]') + yellow(' Ocorreu algum erro ao carregar o ') + gray('tips.json') + " :" + err)
    }
}