interface donatesPromps {
    date: string,
    value: number
}

export default interface Padrinhos {
    id: number,
    value: number,
    total: number,
    donatorSince: string,
    isDonator: boolean,
    donateHistory: donatesPromps[],
}