class AsyncQueue {
  /**
   * 任务队列
   * @type {Array}
   */
  queue = [];

  /**
   * 当前是否有任务在执行
   * @type {Boolean}
   */
  running = false;

  constructor() {}

  push(func) {
    return new Promise((resolve, reject) => {
      // 将传入的方法添加到任务队列中
      this.queue.push(async () => {
        this.running = true;

        try {
          const response = await func();
          resolve(response);
        } catch (error) {
          reject(error);
        }

        this.running = false;

        // 当上一个任务执行完，取出任务队列中的第一个任务进行执行
        const secondFunc = this.queue.shift();
        if (secondFunc) {
          secondFunc();
        }
      });

      // 判断当前是否有任务在执行，如果没有，则取出任务队列中的第一个任务进行执行
      if (!this.running) {
        const secondFunc = this.queue.shift();
        if (secondFunc) {
          secondFunc();
        }
      }
    });
  }
}

export default AsyncQueue;
