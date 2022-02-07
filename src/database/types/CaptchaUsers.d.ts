export default interface UsersCaptchaTypes {
    id: string;
    fails: {
        timestamp: number;
        correct: string;
        selected: string;
    }[];
}