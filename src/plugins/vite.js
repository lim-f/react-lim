/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-14 21:41:12
 * @Description: Coding something
 */
import { transformVueSFC, isLimSFC } from './vue-lim.es.min';

export default function ()  {
    return {
        name: 'vite:vue-lim',
        transform (code, id) {
            if (!isLimSFC(code, id)) return null;
            return { code: transformVueSFC(code) };
        }
    };
}