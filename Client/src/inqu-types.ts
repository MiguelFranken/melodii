/**
 * see https://github.com/SBoudrias/Inquirer.js
 */
export type QuestionTypes = 'input' | 'confirm' | 'list';

export interface IQuestion {
    type: QuestionTypes;
    name: string; // name of the answer prop
    message: string; // shown from inquirer
    choices?: string[]; // type == list : choices is a list of possible selections
    default?: boolean; // type == confirm : default value of input
}
