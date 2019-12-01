import { IOSCArgs } from "./osc/osc-types";

export interface ISettings {
  address: string;
  url: string;
  port: number;
  path: string;
  args: IOSCArgs[];
}
