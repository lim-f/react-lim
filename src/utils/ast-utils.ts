/*
 * @Author: chenzhongsheng
 * @Date: 2024-06-15 00:43:33
 * @Description: Coding something
 */

import { NodePath } from '@babel/traverse';
import * as T from '@babel/types';
import type { Identifier, STANDARDIZED_TYPES } from '@babel/types';

export const SetPrefix = '_$';
type IAstTypes = (typeof STANDARDIZED_TYPES)[number];

type IAstKey = 'key' | 'value' | 'object' | 'property' | 'left' | 'init' | 'arguments'
    | 'callee' | 'body' | 'id' | 'expression' | 'local' | 'imported' | 'argument';

export const t = T;

export function isFunctionDeclaration (node: T.Node) {
    return node.type === 'FunctionDeclaration' || node.type === 'ArrowFunctionExpression';
}

export function isJSXElement (node: T.Node|null|undefined) {
    if (!node) return false;
    const type = node.type;
    if (type === 'JSXElement' || type === 'JSXFragment') return true;

    if (type === 'CallExpression') {
        return isJSXCallExpression(node);
    }
    return false;
}

export function isJSXCallExpression (arg: T.CallExpression) {
    if (arg.callee.type === 'Identifier') {
        // Vite
        return arg.callee.name === 'jsxDEV';
    } else if (isMemberExp(arg.callee, 'React', 'createElement')) {
        return true;
    }
    return false;
}

export function isMemberExp (node: T.Node, object: string, prop: string) {
    // @ts-ignore
    return node.type === 'MemberExpression' && node.object.name === object && node.property.name === prop;
}

// a.b.c => a
export function getMemberKey (node: T.MemberExpression) {
    let obj = node.object;

    while (obj.type === 'MemberExpression') {
        obj = obj.object;
    }

    if (obj.type === 'Identifier') {
        return obj.name;
    }
    return '';
}


function getNodeInfo (path: NodePath<T.Node>) {
    // @ts-ignore
    const type: IAstTypes = path.container?.type || '';
    // @ts-ignore
    const operator = path.container?.operator;
    const key = path.key as IAstKey;
    const listKey = path.listKey as IAstKey;
    return { type, key, listKey, operator };
}

export function isTargetUpdated (path: NodePath<Identifier|T.MemberExpression>) {
    const { type, key, operator } = getNodeInfo(path);

    return (
        (type === 'AssignmentExpression' && key === 'left') ||
        (type === 'UpdateExpression' && key === 'argument') ||
        (type === 'UnaryExpression' && operator === 'delete') || // delete a.a;
        isObjectAssign(path)
    );

}

export function isObjectAssign (path: NodePath<Identifier|T.MemberExpression>) {
    const parent = path.parentPath;
    if (parent.type === 'CallExpression') {
        const callee = (parent.node as T.CallExpression).callee;

        if (
            callee.type === 'MemberExpression' &&
            (callee.object as T.Identifier)?.name === 'Object' &&
            (callee.property as T.Identifier)?.name === 'assign' &&
            path.key === 0
        ) {
            return true;
        }
    }
    return false;
}
export const ArrayFnSet = new Set([ 'push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse' ]);

export function isTargetArrayUpdated (path: NodePath<T.MemberExpression>) {
    if (path.type !== 'MemberExpression') return false;
    if (path.parent.type === 'CallExpression') {
        // @ts-ignore
        const fn = path.node.property.name;
        if (typeof fn !== 'string') return;

        if (ArrayFnSet.has(fn)) {
            return true;
        }
    }
    return false;
}

export function findNoBindingSource (path: NodePath<T.Node>, name: string) {

    // const binding = path.scope.getBinding(name);
    // if (!binding) return;

    // const

    // console.log(binding.path.parentPath.toString(), name);

    // debugger;

}

export function findTopMemberExp (path: NodePath<T.Node>) {

    let prev: NodePath<T.MemberExpression>|null = null;

    let parent = path.parentPath;

    while (parent && parent.type === 'MemberExpression') {
        // @ts-ignore
        prev = parent;
        parent = parent.parentPath;
    }

    return prev;
}

export function isSkipNode (node: T.Node): boolean {
    // @ts-ignore
    return node.__skip;
}

export function skipNode (node: T.Node) {
    // @ts-ignore
    node.__skip = true;
    return node;
}