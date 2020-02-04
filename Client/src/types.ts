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

import { IOSCArgs } from "./osc/osc-types";

export interface ISettings {
  address: string;
  url: string;
  port: number;
  path: string;
  args: IOSCArgs[];
}
