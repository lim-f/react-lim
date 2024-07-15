/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:14:56
 * @Description: Coding something
 */

import { IJson } from '../utils/script-util';
import {NodePath} from '@babel/traverse';
import {ArrowFunctionExpression, File, FunctionDeclaration} from '@babel/types';

import {generateCode, parseJS, traverseAst} from '../utils/js-utils';
import { ComponentParser } from './component-parser';
import {isFunctionDeclaration, isReturnJSXElement, t} from '../utils/ast-utils';
import type { ParseResult } from '@babel/parser';

export class JSXParser {
    originCode: string;

    ast: ParseResult<File>;

    components: IJson<ComponentParser> = {};

    componentStack: ComponentParser[] = [];

    constructor (code: string) {
        this.ast = parseJS(code)

        let blockDeep = 0;
        traverseAst(this.ast, {
            BlockStatement: {
                enter () {blockDeep++;},
                exit () {blockDeep--;}
            },
            'FunctionDeclaration|ArrowFunctionExpression': {
                enter: (path: NodePath<FunctionDeclaration|ArrowFunctionExpression>) => {
                    if(blockDeep !== 0) return;
                    // @ts-ignore
                    let name = path.node.id?.name;
                    if(!name) return;
                    this.components[path.node.start!] = new ComponentParser(this, path);
                },
                exit: (path) => {
                    if(blockDeep !== 0) return;
                    // @ts-ignore
                    let name = path.node.id?.name;
                    if(!name) return;
                    let start = path.node.start!;
                    const component = this.components[start];

                    if(!component?.returnJsx){
                        delete this.components[start]
                    }else{
                        component.exit();
                    }
                }
            },
            ReturnStatement: (path) => {
                if(!isReturnJSXElement(path.node)) return;
                const parent = path.findParent(parent => {
                    return isFunctionDeclaration(parent.node);
                })
                if(!parent) return;
                const component = this.components[parent.node.start!]
                component.returnJsx = true;
            },
        });
    }


    toString () {
        return generateCode(this.ast);
    }


    private _added_import = false;
    addImport(){
        if (this._added_import) return;
        this._added_import = true;
        const specifier = t.importSpecifier(t.identifier('useState'), t.identifier('useState'));
        this.ast.program.body.unshift(t.importDeclaration([specifier], t.stringLiteral('react')));
    }
}