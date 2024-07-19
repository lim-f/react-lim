/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-14 21:41:12
 * @Description: Coding something
 */
import { transformReact, isLimReact } from './react-lim.min.mjs';

export default function ()  {
    return {
        name: 'vite:react-lim',
        transform (code, id) {
            if (!isLimReact(code, id)) return null;
            return { code: transformReact(code) };
        }
    };
}
