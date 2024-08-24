interface ExecList {
  add(func: (() => Promise<any>) | (() => any), callback: FuncCallback): this;
  run(): Promise<void>;
}
interface FuncCallback {
  (result: any, next: () => void): void;
}
function createExecList(): ExecList {
  const queue: { func: () => Promise<any>; callback: FuncCallback }[] = [];

  return {
    add(func: (() => Promise<any>) | (() => any), callback: FuncCallback) {
      queue.push({
        func: () => (func instanceof Promise ? func : Promise.resolve(func())),
        callback,
      });
      return this;
    },
    async run(): Promise<void> {
      if (queue.length) {
        const { func, callback } = queue.shift()!;
        const result = await func();
        callback(result, () => {
          this.run();
        });
      }
    },
  };
}
