/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-14 21:41:12
 * @Description: Coding something
 */
const { transformReact, isLimReact } = require('../react-lim.min.cjs');

function plugin ()  {
    return {
        name: 'vite:react-lim',
        transform (code, id) {
            if (!isLimReact(code, id)) return null;
            return { code: transformReact(code) };
        }
    };
};

module.exports = plugin;
module.exports.default = plugin;