const options = ["first_option", "second_option", "third_option", "fourth_option", "fifth_option", "sixth_option", "seventh_option", "eighth_option", "ninth_option", "tenth_option", "eleventh_option", "twelfth_option", "thirteenth_option", "fourteenth_option", "fifteenth_option", "sixteenth_option", "seventeenth_option", "eighteenth_option", "nineteenth_option", "twentieth_option", "twenty_first_option", "twenty_second_option", "twenty_third_option", "twenty_fourth_option", "twenty_fifth_option", "twenty_sixth_option"];

export function CTO(data: string): number {
    return options.indexOf(data);
}

export function OTC(data: number): string {
    return options[data];
}