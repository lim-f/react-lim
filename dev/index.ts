/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:03:05
 * @Description: Coding something
 */


import { transformReact } from '../src/index';

const input = `

export function Counter(){
  let b = {a:1}
  b++;
  b.a ++;
  b.a.c ++;
  b = 1;
  b.a = 1;

  Object.assign(b, {a: 2});
  delete b.a;

  b.a.push(3);

  return <div>{b}</div>
}
`;
const output = transformReact(input);

console.log(output);