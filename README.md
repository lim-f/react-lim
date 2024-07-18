<!--
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 11:57:26
 * @Description: Coding something
-->



## [React Lim](https://github.com/lim-f/react-lim)

<div align='center'>
    <img width='100' src='https://shiyix.cn/images/react.svg'/>
    
### Make React easier to use

Lim means 'Less is More'

**[Playground](https://lim-f.github.io/playground/#8) | [Vue-Lim](https://github.com/lim-f/vue-lim) | [中文](https://github.com/lim-f/react-lim/blob/master/README.cn.md)**

</div>

## A Simple Sample

```jsx
export function Counter() {
    let count = 1
    const increase = ()=> count ++
    return <button onClick={increase}>
        count is {count}
    </button>
}
```

## Quick Use

```
npm create lim
```

then choose `react-lim`

## Install Use

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
        // Introduce react related plug-ins by yourself
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
        // Introduce react related plug-ins by yourself
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
        // Introduce react related loaders by yourself
    }
}
```

## Other

### Compile

When using `.lim.tsx` or `.lim.jsx` as the file suffix, lim compilation will be enabled

When using only `.tsx` or `.jsx`, you need to add `'use lim'` or `// use lim` in the file header to enable lim compilation

### Api

```js
import { transformReact } from 'react-lim';
console.log(transformReact(`// some react code`));
```

This API can be used in a web environment

```html
<script src='https://cdn.jsdelivr.net/npm/react-lim'></script>
<script>
console.log(ReactLim.transformReact(`// some react code`));
</script>
```



