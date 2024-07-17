/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:03:05
 * @Description: Coding something
 */


import { transformReact } from '../src/index';

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