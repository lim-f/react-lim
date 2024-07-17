/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:03:05
 * @Description: Coding something
 */


import { transformReact } from '../src/index';

// const input = `
// function App() {
//   let count = 1;
//   const inc = () => {
//     count++;
//   };
//   return /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV("button", { onClick: inc, children: [
//     "count is ",
//     count
//   ] }, void 0, true, {
//     fileName: "/Users/bytedance/code/tack/react-lim-template/src/App.tsx",
//     lineNumber: 16,
//     columnNumber: 7
//   }, this) }, void 0, false, {
//     fileName: "/Users/bytedance/code/tack/react-lim-template/src/App.tsx",
//     lineNumber: 15,
//     columnNumber: 10
//   }, this);
// }
// `;

const input = `
function App () {
  const person = {
      name: 'Jack',
      age: 18,
  };
  const addAge = (data) => data.age += 1;
  return <>
      <div>age = {person.age}</div>
      <button onClick={() => addAge(person)}>Add Age</button>
  </>;
}
`;

const output = transformReact(input);

console.log(output);