/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-14 21:40:16
 * @Description: Coding something
 */
import { transformReact, isLimReact } from '../react-lim.min.mjs';

export default function (this, code)  {
    const id = this.resourcePath;
    if (!isLimReact(code, id)) return code;
    return transformReact(code);
}