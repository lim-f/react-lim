<!--
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 11:57:26
 * @Description: Coding something
-->
## [React Lim](https://github.com/theajack/react-lim)

让 React 使用起来更简单. （Lim 的含义是 'Less is More'）

**[在线体验](https://theakjack.github.io/react-lim) | [Vue-Lim](https://github.com/theajack/vue-lim) | [English](https://github.com/theajack/react-lim)**


## 一个简单的例子

```jsx
export function Counter() {
    let count = 1
    const increase = ()=> count ++
    return <button onClick={increase}>
        count is {count}
    </button>
}
```

## 快速开始

```
npm create lim
```

然后选择 `react-lim`

## 安装使用

```
npm i react-lim
```

### Vite

```ts
import { defineConfig } from 'vite'
import lim from 'react-lim/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [lim(), react()],
  // ...
})
```

### Rollup

```ts
import lim from 'react-lim/rollup'
export default {
    plugins: [
        lim(),
        // 自定引入react相关插件
    ]
};
```

### Esbuild

```ts
import lim from 'react-lim/esbuild'
import { build } from 'esbuild';

build({
    plugins: [
        lim(),
        // 自定引入react相关插件
    ],
});
```

### Webpack

```ts
module.exports = {
    module: {
        rules: [{
            test: /(\.[tj]sx)$/,
            loader: 'react-lim/webpack',
            exclude: /node_modules/
        }]
        // 自定引入react相关loader
    }
}
```

## 其他

### 编译

当使用 `.lim.tsx` 或者 `.lim.jsx` 作为文件后缀时会开启 lim 的编译

当使用仅 `.tsx` 或者 `.jsx` 时，需要在文件头部添加 `'use lim'` 或者 `// use lim` 来开启 lim编译

### 编译Api

```js
import { transformReact } from 'react-lim';
console.log(transformReact(`// some react code`));
```

该api可以在web环境中使用

```html
<script src='https://cdn.jsdelivr.net/npm/react-lim'></script>
<script>
console.log(ReactLim.transformReact(`// some react code`));
</script>
```



