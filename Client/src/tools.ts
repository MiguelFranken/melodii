/**
 * just the console output wrapped into two functions
 * 
 * second one if DEBUG is true it gets wrote to the output
 */

const DEBUG = false;
export function logger(msg: string | Object): void {
  console.log(msg);
}

export function loggerD(msg: string | Object): void {
  if (DEBUG) {
    console.log(msg);
  }
}
