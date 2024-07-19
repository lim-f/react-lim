/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
const { transformReact, isLimReact } = require('../react-lim.min.cjs');
const path = require('path');
const fs = require('fs');

function plugin () {
    return {
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
    };
};
module.exports = plugin;
module.exports.default = plugin;
