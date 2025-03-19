/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:03:05
 * @Description: Coding something
 */


import { transformReact } from '../src/index';

const input = {
    demo1: `
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
`,
    demo2: `
function App () {
    let value = 'Hello';
    return <>
        <input onInput={e => value = e.target.value} value={value}/>
        <div> Binding value is {value}</div>
    </>;
}
  `
};

const output = transformReact(input.demo2);

console.log(output);