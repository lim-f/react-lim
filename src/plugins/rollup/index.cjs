
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
const { transformReact, isLimReact } =  require('../react-lim.min.cjs');

function plugin ()  {

    return {
        name: 'rollup-plugin-react-lim',
        transform (code, id) {
            if (!isLimReact(code, id)) return null;
            return { code: transformReact(code) };
        }
    };
}
module.exports = plugin;
module.exports.default = plugin;