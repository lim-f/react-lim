/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:14:56
 * @Description: Coding something
 */

import { NodePath } from '@babel/traverse';
import { ArrowFunctionExpression, File, FunctionDeclaration, Identifier, MemberExpression } from '@babel/types';

import { generateCode, parseJS, traverseAst } from '../utils/js-utils';
import { ComponentParser } from './component-parser';
import { SetPrefix, findTopMemberExp, getMemberKey, isFunctionDeclaration, isJSXElement, isSkipNode, isTargetArrayUpdated, isTargetUpdated, skipNode, t } from '../utils/ast-utils';
import type { ParseResult } from '@babel/parser';

export class JSXParser {
    originCode: string;

    ast: ParseResult<File>;

    components: Record<string, ComponentParser> = {};

    current: ComponentParser|null = null;

    constructor (code: string) {
        this.ast = parseJS(code);

        let blockDeep = 0;
        traverseAst(this.ast, {
            BlockStatement: {
                enter () {blockDeep++;},
                exit () {blockDeep--;}
            },
            Identifier: (path) => {
                this.checkListItemUpdated(path);
            },
            // 'JSXAttribute': (path) => {
            // },

            'FunctionDeclaration|ArrowFunctionExpression': {
                enter: (path: NodePath<FunctionDeclaration|ArrowFunctionExpression>) => {
                    if (blockDeep !== 0) return;
                    // @ts-ignore
                    const name = path.node.id?.name;
                    if (!name) return;
                    this.current = this.components[path.node.start!] = new ComponentParser(this, path);
                },
                exit: (path) => {
                    if (blockDeep !== 0) return;
                    // @ts-ignore
                    const name = path.node.id?.name;
                    if (!name) return;
                    const start = path.node.start!;
                    const component = this.components[start];

                    if (!component?.returnJsx) {
                        delete this.components[start];
                    } else {
                        component.exit();
                    }
                    this.current = null;
                }
            },
            ReturnStatement: (path) => {
                if (!isJSXElement(path.node.argument)) return;
                const parent = path.findParent(parent => {
                    return isFunctionDeclaration(parent.node);
                });
                if (!parent) return;
                const component = this.components[parent.node.start!];
                component.returnJsx = true;
            },
        });
    }

    checkListItemUpdated (path: NodePath<Identifier>) {
        if (!this.current) return;

        if (path.listKey !== 'params' && path.key !== 0) return;


        let sourceName = '';
        const varName = path.node.name;

        const parent = path.findParent(item => {
            if (item.type !== 'CallExpression') return false;
            // @ts-ignore
            const callee: MemberExpression = item.node.callee;

            if (callee.type !== 'MemberExpression') return false;

            // @ts-ignore
            const fn = callee.property?.name;

            if (fn !== 'map') return false;

            // ! 原始变量名
            const key = getMemberKey(callee);
            // ! 原始变量binding
            const binding = this.current?.path.scope.getBinding(key);
            if (!binding) {
                return false;
            }
            sourceName = key;
            return true;
        });

        if (!parent) return;

        // debugger;

        const binding = path.scope.getBinding(varName);

        if (!binding) return;
        binding.referencePaths.forEach(ref => {

            // @ts-ignore
            __DEV__ && console.log(ref.parentPath.toString());

            const member = findTopMemberExp(ref);

            if (member) {
                const node = member.parentPath.node;
                if (isTargetUpdated(member) || isTargetArrayUpdated(member)) {
                    if (isSkipNode(node)) return;
                    skipNode(node);
                    __DEV__ && console.log(member.parentPath.toString());
                    // debugger;
                    member.parentPath.replaceInline(
                        // @ts-ignore
                        t.callExpression(t.identifier(`${SetPrefix}${sourceName}`), [ node ])
                    );
                } else {
                    if (member.listKey === 'arguments') {
                        if (isSkipNode(node)) return;
                        skipNode(node);
                        member.parentPath.replaceInline(
                            // @ts-ignore
                            skipNode(t.callExpression(t.identifier(`${SetPrefix}${sourceName}`), [ node ]))
                        );
                    }
                }
            } else {
                if (ref.listKey === 'arguments') {
                    // @ts-ignore
                    const node = ref.parentPath.node;
                    if (isSkipNode(node)) return;
                    skipNode(node);
                    // @ts-ignore
                    ref.parentPath.replaceInline(
                        // @ts-ignore
                        skipNode(t.callExpression(t.identifier(`${SetPrefix}${sourceName}`), [ node ]))
                    );
                }
            }


        });

        if (parent) {
            // debugger;
        }

    }


    toString () {
        return generateCode(this.ast);
    }


    private _added_import = false;
    addImport () {
        if (this._added_import) return;
        this._added_import = true;
        const specifier = t.importSpecifier(t.identifier('useState'), t.identifier('useState'));
        const body = this.ast.program.body;

        for (let i = 0; i < body.length; i++) {
            const node = body[i];
            if (node.type !== 'ImportDeclaration') {
                const ast = parseJS(`var __clone = (v)=> ((v && typeof v === 'object') ? (Array.isArray(v) ? [...v]: {...v}): v);`);
                body.splice(i, 0, ast.program.body[0]);
                break;
            }
        }
        body.unshift(t.importDeclaration([ specifier ], t.stringLiteral('react')));
    }
}