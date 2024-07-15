/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-15 15:10:59
 * @Description: Coding something
 */
import {NodePath} from '@babel/traverse';
import {ArrowFunctionExpression, FunctionDeclaration, MemberExpression, Node, VariableDeclarator} from '@babel/types';
import {getMemberKey, isFunctionDeclaration, isTargetUpdated, t} from '../utils/ast-utils';
import {JSXParser} from './jsx-parser';

const ArrayFnSet = new Set([ 'push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse' ]);

const SetPrefix = '_$';

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

    constructor(parent: JSXParser, path: NodePath<FunctionDeclaration|ArrowFunctionExpression>){
        this.path = path;
        this.parent = parent;
        debugger
    }

    exit(){
        if(!this.returnJsx) return;

        const body = this.path.node.body;

        if(body.type !== 'BlockStatement') return;
        body.body.forEach(node => {
            if(node.type === 'VariableDeclaration') {
                if(node.kind === 'const') return;

                const declarations = node.declarations;

                declarations.forEach((declaration, index) => {

                    if(isFunctionDeclaration(declaration.init!)) return;

                    // @ts-ignore
                    const name = declaration.id.name;
                    const binding = this.path.scope.getBinding(name);
                    if(!binding) return;

                    let state: IRefState = {isModified: false, isState: false, name, refs: []};
                    
                    binding.referencePaths.forEach(ref => this.handleReference(ref, state));

                    binding.constantViolations.forEach(ref => this.handleViolation(ref, state));


                    if(state.isModified && state.isModified) {
                        this.parent.addImport();
                        state.refs.forEach(ref => {
                            ref.replaceWithSourceString(`${SetPrefix}${state.name}(${ref.toString()})`)
                        });

                        declarations.splice(
                            index, 1, 
                            t.variableDeclarator(
                                t.arrayPattern([t.identifier(name), t.identifier(`_${SetPrefix}${name}`)]),
                                t.callExpression(t.identifier('useState'), [declaration.init!])
                            ),
                            t.variableDeclarator(
                                t.identifier(`${SetPrefix}${name}`),
                                t.arrowFunctionExpression(
                                    [t.identifier('v')],
                                    t.sequenceExpression([
                                        t.callExpression(t.identifier(`_${SetPrefix}${name}`), [t.identifier('v')]),
                                        t.identifier('v'),
                                    ])
                                )
                            )
                        )
                    }
                })

            }
        })
    }

    private handleViolation(ref: NodePath<Node>, state: IRefState){
        if(ref.type === 'UpdateExpression' || ref.type === 'CallExpression') return false;
        state.refs.push(ref);
        console.log(ref?.toString())
        state.isModified = true;
        return true;
    }

    private handleReference(ref: NodePath<Node>, state: IRefState){
        
        const parent = ref.findParent(par=>{
            const type = par.type;
            const node = par.node;

            if(type === 'AssignmentExpression' || type === 'UpdateExpression'){
                return true;
            }else if(type === 'UnaryExpression'){
                // @ts-ignore
                if(par.node.operator === 'delete'){
                    return true;
                }
            }else if(type === 'CallExpression'){
                // @ts-ignore
                if(node.callee.type === 'MemberExpression'){
                    // @ts-ignore
                    const object = node.callee.object.name;
                    // @ts-ignore
                    const property = node.callee.property.name
                    if(
                        // @ts-ignore
                        (object === 'Object' && property === 'assign' && node.arguments[0] === ref.node) ||
                        // @ts-ignore
                        (getMemberKey(node.callee) === ref.node.name && ArrayFnSet.has(property))
                    ){
                        return true;
                    }
                }
            }else if(type === 'JSXExpressionContainer'){
                return true;
            }
            return false
        })
        if(!parent) return false;

        if(parent.type === 'JSXExpressionContainer'){
            state.isState = true;
            return false;
        }

        console.log(parent, parent?.toString())
        state.refs.push(parent);
        console.log(parent?.toString())
        state.isModified = true;
        return true;
    }
}