import AsyncQueue from "./AsyncQueue";
import { sleep } from "./utils";
import "./style.css";

// 创建一个任务队列实例
const queue = new AsyncQueue();

/**
 * 1. 利用异步队列实现一个倒计时的效果
 */
queue.push(async () => {
  await sleep(1000);
  document.querySelector("#app").innerHTML = `<h1>3</h1>`;
});
queue.push(async () => {
  await sleep(1000);
  document.querySelector("#app").innerHTML = `<h1>2</h1>`;
});
queue.push(async () => {
  await sleep(1000);
  document.querySelector("#app").innerHTML = `<h1>1</h1>`;
});
queue.push(async () => {
  await sleep(1000);
  document.querySelector("#app").innerHTML = ``;
});

/**
 * 2. 利用异步队列实现 box 移动的效果
 */
const box = document.getElementById("box");
const move = (duration, left, top) => {
  Object.assign(box.style, {
    transitionDuration: duration / 1000 + "s",
    left: left + "px",
    top: top + "px",
  });
  return sleep(duration);
};
const actions = [
  [2000, 100, 100],
  [2000, 400, 100],
  [2000, 400, 400],
  [2000, 100, 400],
  [2000, 100, 100],
];
actions.forEach((action) => queue.push(() => move(...action)));

/**
 * 3. 模拟请求接口，访问间隔必须在 2s 以上
 */

// 创建一个新的任务队列实例
const queue2 = new AsyncQueue();

const callApi = (() => {
  let lastTime = 0;
  return async () => {
    if (Date.now() - lastTime < 2000) {
      throw new Error("访问太频繁了");
    }

    lastTime = Date.now();
    return new Date();
  };
})();

// 这里如果直接调用 10 次，只有第一次成功，后面 9 次报错
// new Array(10).fill().forEach(async () => {
//   const response = await callApi();
//   console.log(response);
// });

// 利用异步队列实现，保证每次请求间隔大于 2s
new Array(10).fill().forEach(async (_, index) => {
  const response = await queue2.push(async () => {
    await sleep(2000);
    return await callApi();
  });

  console.log(`第 ${index + 1} 次调用`, response);
});
