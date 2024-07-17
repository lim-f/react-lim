
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import { transformReact, isLimReact } from './react-lim.es.min';
import path from 'path';
import fs from 'fs';

export default () => ({
    name: 'react-lim',
    setup (build) {
        build.onResolve({ filter: /\.[tj]sx$/ }, (args) => {
            if (args.resolveDir === '') return;

            return {
                path: path.isAbsolute(args.path)
                    ? args.path
                    : path.join(args.resolveDir, args.path),
                namespace: 'react-lim'
            };
        });

        build.onLoad({ filter: /.*/, namespace: 'react-lim' }, (args) => {
            const id = args.path;
            const code = fs.readFileSync(id, 'utf-8');

            return {
                contents: isLimReact(code, id) ? transformReact(code) : code,
            };
        });
    }
});
