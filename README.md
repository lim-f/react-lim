<!--
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 11:57:26
 * @Description: Coding something
-->

<p align="center">
    <img src='https://shiyix.cn/images/react.svg' width='100px'/>
</p> 

<p align="center">
    <a href="https://www.github.com/lim-f/react-lim/stargazers" target="_black">
        <img src="https://img.shields.io/github/stars/lim-f/react-lim?logo=github" alt="stars" />
    </a>
    <a href="https://www.github.com/lim-f/react-lim/network/members" target="_black">
        <img src="https://img.shields.io/github/forks/lim-f/react-lim?logo=github" alt="forks" />
    </a>
    <a href="https://www.npmjs.com/package/react-lim" target="_black">
        <img src="https://img.shields.io/npm/v/react-lim?logo=npm" alt="version" />
    </a>
    <a href="https://www.npmjs.com/package/react-lim" target="_black">
        <img src="https://img.shields.io/npm/dm/react-lim?color=%23ffca28&logo=npm" alt="downloads" />
    </a>
    <a href="https://www.jsdelivr.com/package/npm/react-lim" target="_black">
        <img src="https://data.jsdelivr.com/v1/package/npm/react-lim/badge" alt="jsdelivr" />
    </a>
    <img src="https://shiyix.cn/api2/util/badge/stat?c=Visitors-reactlim" alt="visitors">
</p>

<p align="center">
    <a href="https://github.com/theajack" target="_black">
        <img src="https://img.shields.io/badge/Author-%20theajack%20-7289da.svg?&logo=github" alt="author" />
    </a>
    <a href="https://www.github.com/lim-f/react-lim/blob/master/LICENSE" target="_black">
        <img src="https://img.shields.io/github/license/lim-f/react-lim?color=%232DCE89&logo=github" alt="license" />
    </a>
    <a href="https://cdn.jsdelivr.net/npm/react-lim"><img src="https://img.shields.io/bundlephobia/minzip/react-lim.svg" alt="Size"></a>
    <a href="https://github.com/lim-f/react-lim/search?l=javascript"><img src="https://img.shields.io/github/languages/top/lim-f/react-lim.svg" alt="TopLang"></a>
    <a href="https://github.com/lim-f/react-lim/issues"><img src="https://img.shields.io/github/issues-closed/lim-f/react-lim.svg" alt="issue"></a>
    <a href="https://www.github.com/lim-f/react-lim"><img src="https://img.shields.io/librariesio/dependent-repos/npm/react-lim.svg" alt="Dependent"></a>
</p>

## [React Lim](https://github.com/lim-f/react-lim): Make React easier to use (Lim means 'Less is More')


**[Docs](https://lim-f.github.io/docs) | [Playground](https://lim-f.github.io/playground/#8) | [Vue-Lim](https://github.com/lim-f/vue-lim) | [中文](https://github.com/lim-f/react-lim/blob/master/README.cn.md)**

React-lim is a compilation tool that allows you to get rid of using the Hooks. Here's a simple example

## [A Simple Sample](https://lim-f.github.io/playground/#8)

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



