/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-15 15:10:59
 * @Description: Coding something
 */
import { NodePath } from '@babel/traverse';
import { ArrowFunctionExpression, FunctionDeclaration, Node } from '@babel/types';
import { ArrayFnSet, SetPrefix, getMemberKey, isFromImport, isFunctionDeclaration, isJSXElement, t } from '../utils/ast-utils';
import { JSXParser } from './jsx-parser';

const reactNames = new Set([ 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext' ]);

interface IRefState{
    isModified: boolean;
    isState: boolean;
    name: string;
    refs: NodePath<Node>[];
}

export class ComponentParser {
    path: NodePath<FunctionDeclaration|ArrowFunctionExpression>;

    returnJsx: boolean;

    parent: JSXParser;

    constructor (parent: JSXParser, path: NodePath<FunctionDeclaration|ArrowFunctionExpression>) {
        this.path = path;
        this.parent = parent;
    }

    exit () {
        if (!this.returnJsx) return;

        const body = this.path.node.body;

        if (body.type !== 'BlockStatement') return;
        body.body.forEach(node => {
            if (node.type === 'VariableDeclaration') {

                const declarations = node.declarations;

                declarations.forEach((declaration, index) => {

                    if (isFunctionDeclaration(declaration.init!)) return;

                    // @ts-ignore
                    const name = declaration.id.name;
                    const binding = this.path.scope.getBinding(name);
                    const init = declaration.init;
                    if (!binding || !init) return;

                    if (init.type === 'CallExpression') {
                        // @ts-ignore
                        const callName = init.callee.name;
                        if (reactNames.has(callName)) {
                            if (isFromImport(this.path, callName, 'react')) {
                                return;
                            }
                        }
                    }

                    const state: IRefState = { isModified: false, isState: false, name, refs: [] };

                    binding.referencePaths.forEach(ref => {
                        this.handleReference(ref, state);
                        this.handleState(ref, state);
                    });

                    binding.constantViolations.forEach(ref => this.handleViolation(ref, state));

                    if (state.isModified && state.isState) {
                        this.parent.addImport();
                        state.refs.forEach(ref => {
                            ref.replaceWithSourceString(`${SetPrefix}${state.name}(${ref.toString()})`);
                        });

                        declarations.splice(
                            index, 1,
                            t.variableDeclarator(
                                t.arrayPattern([ t.identifier(name), t.identifier(`_${SetPrefix}${name}`) ]),
                                t.callExpression(t.identifier('useState'), [ declaration.init! ])
                            ),
                            t.variableDeclarator(
                                t.identifier(`${SetPrefix}${name}`),
                                t.arrowFunctionExpression(
                                    [ t.identifier('v') ],
                                    t.sequenceExpression([
                                        t.callExpression(
                                            t.identifier(`_${SetPrefix}${name}`),
                                            [ t.callExpression(t.identifier('__clone'), [ t.identifier(name) ]) ]
                                        ),
                                        t.identifier('v'),
                                    ])
                                )
                            )
                        );
                    }
                });

            }
        });
    }

    private handleViolation (ref: NodePath<Node>, state: IRefState) {
        if (ref.type === 'UpdateExpression' || ref.type === 'CallExpression') return false;
        state.refs.push(ref);
        __DEV__ && console.log(ref?.toString());
        state.isModified = true;
        // ! 有修改视为是state
        state.isState = true;
        return true;
    }

    private handleReference (ref: NodePath<Node>, state: IRefState) {

        const parent = ref.findParent(par => {
            const type = par.type;
            const node = par.node;

            if (type === 'AssignmentExpression' || type === 'UpdateExpression') {
                return true;
            } else if (type === 'UnaryExpression') {
                // @ts-ignore
                if (par.node.operator === 'delete') {
                    return true;
                }
            } else if (type === 'CallExpression') {
                // @ts-ignore
                if (node.callee.type === 'MemberExpression') {
                    // @ts-ignore
                    const object = node.callee.object.name;
                    // @ts-ignore
                    const property = node.callee.property.name;
                    if (
                        // @ts-ignore
                        (object === 'Object' && property === 'assign' && node.arguments[0] === ref.node)
                    ) {
                        return true;
                    }

                    // @ts-ignore
                    if (getMemberKey(node.callee) === ref.node.name) {
                        if (ArrayFnSet.has(property)) return true;

                        if (property === 'map') {
                            state.isModified = true;
                        }
                    }
                }
                // @ts-ignore
                for (const arg of node.arguments) {
                    if (arg.type === 'Identifier') {
                        if (arg.name === state.name) {
                            state.isState = true;
                            return true;
                        }
                    } else if (arg.type === 'MemberExpression') {
                        if (getMemberKey(arg) === state.name) {
                            state.isState = true;
                            return true;
                        }
                    }
                }
            }
            return false;
        });
        if (!parent) return false;


        __DEV__ && console.log(parent, parent?.toString());
        state.refs.push(parent);
        state.isModified = true;
        return true;
    }

    private handleState (ref: NodePath<Node>, state: IRefState) {
        if (state.isState) return;

        const parent = ref.findParent(par => {
            const type = par.type;
            const node = par.node;

            if (type === 'JSXExpressionContainer') return true;
            if (isJSXElement(node)) return true;

            return false;
        });

        if (parent) {
            state.isState = true;
        }

    }
}