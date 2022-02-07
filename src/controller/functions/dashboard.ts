import { exec, execSync } from "child_process";
import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from "discord.js";

const values = ["first_option", "second_option", "third_option", "fourth_option", "fifth_option", "sixth_option", "seventh_option", "eighth_option", "ninth_option"]

export async function select() {
    const modules = await list()
    const optionsValues: { module: string, value: string }[] = [];
    const options: MessageSelectOptionData[] = modules.map((module, index) => {
        optionsValues.push({ module: module.name, value: values[index] });
        return {
            value: values[index],
            label: module.name
        }
    });
    const SelectMenu = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setPlaceholder("Selecione o módulo requerido")
        .setOptions(options)
        .setCustomId("dashboard-select")
    )

    return { SelectMenu, optionsValues }
}

export async function restart(module: string) {
    const shellCommand = execSync(`npx pm2 restart ${module}`);
}

export async function start(module: string) {
    const shellCommand = execSync(`npx pm2 start ${module}`);
}

export async function stop(module: string) {
    const shellCommand = execSync(`npx pm2 stop ${module}`);
}

export async function logs(module: string) {
    const shellCommand = execSync(`npx pm2 logs --nostream --lines 2000 ${module}`);
    const output = shellCommand.toString("utf-8");

    return output
}

export async function list() {
    const shellCommand = execSync("npx pm2 list")
    const processes: Processes[] = [];

    let content = shellCommand.toString("utf-8")
    .replace(/[┬,┘,─,└,┴,┤,┼,┌,┐,├,│]/g, "")
    .replace(/\s\s+/g, ' ')
    .replace("↺", "reloaded")
    .split(" ").slice(14);

    for (let i = 0; (content.length / 13) >= 1; i++) {
        processes.push({
            id: content[0],
            name: content[1],
            namespace: content[2],
            version: content[3],
            mode: content[4],
            pid: content[5],
            uptime: content[6],
            reloaded: content[7],
            status: content[8] as any,
            cpu: content[9],
            mem: content[10],
            user: content[11],
            watching: content[12]
        })

        if (content.length > 13)
        content = content.slice(13)
    }

    return processes

}

interface Processes {
    id: string;
    name: string;
    namespace: string;
    version: string;
    mode: string;
    pid: string;
    uptime: string;
    reloaded: string;
    status: "online" | "stopped";
    cpu: string;
    mem: string;
    user: string;
    watching: string;
}