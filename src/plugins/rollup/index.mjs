
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import { transformReact, isLimReact } from '../react-lim.min.mjs';

export default function ()  {
    return {
        name: 'rollup-plugin-react-lim',
        transform (code, id) {
            if (!isLimReact(code, id)) return null;
            return { code: transformReact(code) };
        }
    };
};