import moment from "moment"
import { writeFileSync } from "fs"
moment.locale('pt-br')

export default async function CreateLogError(path: string, err: string) {
    try {
        writeFileSync(`src/errors/${moment().format('YYYY-MM-DD-HH-mm-ss')}`, String(`Arquivo: ${path}\n\n${err}`))
    } catch (err) {
        return new Error(err as string)
    }
}