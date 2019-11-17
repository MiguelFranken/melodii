process.env.NODE_ENV = 'dev';
export function logger(msg: string | Object, options?: { debug?: boolean }): void {
  const str = msg;
  if (options) {
    if (options.debug && options.debug === true && process.env.NODE_ENV === 'debug') {
      console.log(str);
    }
  } else {
    console.log(str);
  }
}
