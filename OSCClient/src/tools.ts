const DEBUG = true;
export function logger(msg: string | Object): void {
  console.log(msg);
}

export function loggerD(msg: string | Object): void {
  if (DEBUG) {
    console.log(msg);
  }
}
