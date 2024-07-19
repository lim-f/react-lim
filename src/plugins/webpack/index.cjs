/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-14 21:40:16
 * @Description: Coding something
 */
const { transformReact, isLimReact } = require('../react-lim.min.cjs');

function loader (this, code)  {
    const id = this.resourcePath;
    if (!isLimReact(code, id)) return code;
    return transformReact(code);
}

module.exports = loader;
module.exports.default = loader;