/*
 * @Author: theajack
 * @Date: 2023-04-04 23:20:27
 * @Description: Coding something
 */
import type { LibraryOptions, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';
import { babel } from '@rollup/plugin-babel';

const Mode = {
    Dev: 'dev', // dev/index.ts
    BuildSrc: 'src', // packages/xxx/src/index.ts
};

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(({ mode }: {mode: string}) => {

    const [ buildMode, format ] = mode.split('_');

    console.log('buildMode = ', buildMode);


    const config = {
        [Mode.Dev]: geneDevAppConfig,
        [Mode.BuildSrc]: () => geneBuildLibConfig(format),
    };
    const CommonConfig: UserConfig = {
        define: {
            __DEV__: `false`, // `${buildMode === Mode.Dev}`,
            __APP__: `${buildMode === Mode.Dev}`,
            __VERSION__: `"${getVersion()}"`,
        },
        plugins: [
            // myPlugin(),
        ],
        resolve: {
            alias: {
                // 'src/': '/packages/main/src/',
            },
        },
    };
    return deepAssign(CommonConfig, config[buildMode]());
});

// ! Dev App 时的配置
function geneDevAppConfig (): UserConfig {
    return {
        plugins: [
            legacy({
                targets: [ 'defaults', 'not IE 11' ],
            }),
        ],
        publicDir: './dev/public',
        server: {
            host: '0.0.0.0',
            port: 8091,
            hmr: true,
        },
    };
}

// ! 构建 lib 时的配置
function geneBuildLibConfig (format: string): UserConfig {
    const pkgRoot = resolve(__dirname, `./src`);

    // 取lib包的依赖;
    // const deps = require(resolve(__dirname, './package.json'));
    // ! VITE 文档说明： 注意，在 lib 模式下使用 'es' 时，build.minify 选项不会缩减空格，因为会移除掉 pure 标注，导致破坏 tree-shaking。
    return {
        build: {
            minify: true,
            lib: {
                entry: resolve(pkgRoot, `./index.ts`), // 打包的入口文件
                ...SDKlibConfig(format),
            },
            rollupOptions: {
                // external: format === 'iife' ? [] : [ ...Object.keys(deps.dependencies) ],
                plugins: [
                    babelPlugin(),
                ],
            },
            outDir: resolve(pkgRoot, 'dist'), // 打包后存放的目录文件
        },
    };
}


function getVersion () {
    return require('./package.json').version;
}

const babelPlugin = () => (
    babel({
        exclude: 'node_modules/**',
        extensions: [ '.js', '.ts', 'tsx' ],
        configFile: resolve(__dirname, './build/babel.config.js'),
    })
);
function SDKlibConfig (format: any): Partial<LibraryOptions> {
    return {
        name: 'ReactLim', // 包名
        formats: [ format ], // 打包模式，默认是es和umd都打
        fileName: (format: string) => {
            let prefix = '';
            if (format === 'cjs') {
                prefix = 'c';
            } else if (format === 'es') {
                prefix = 'm';
            }
            return `react-lim.min.${prefix}js`;
        },
    };
}
/*
! test
console.log('-----------------', deepAssign(
    { a: { x: [1], b: 1, f: 'xx' }, c: 1 },
    { a: { x: [2], b: 2 }, x: { a: 1 } },
    { a: { c: 3 }, d: 2 }
));
*/
function deepAssign<T extends Record<string, any>> (...args: T[]): T {
    if (args.length === 0) {throw new Error('deepAssign 必须有值');}
    if (args.length === 1) {return args[0];}
    if (args.length > 2) {
        const head = args.shift() as T;
        return deepAssign(head, deepAssign(...args));
    }
    const assign2 = (o1: T, o2: T): T => {
        const isObj = v => (typeof v === 'object' && v !== null);
        const isArr = v => Array.isArray(v);
        for (const k in o2) {
            const v1 = o1[k], v2 = o2[k];
            if (isArr(v1) && isArr(v2)) {
                // @ts-ignore
                v1.push(...v2);
            } else if (isObj(v1) && isObj(v2)) {
                // @ts-ignore
                o1[k] = deepAssign(v1, v2);
            } else {
                o1[k] = v2;
            }
        }
        return o1;
    };
    const [ head, tail ] = args;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return assign2(assign2({} as T, head), tail);
}