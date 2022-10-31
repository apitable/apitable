import { IExpression } from 'automation_manager/interface';
import { runtimeContext } from 'automation_manager/__test__/mock_data';
import { MagicVariableParser } from '../magic_variable_parser';
import { getNodeOutput, getObjectProperty, concatString, newArray, newObject, flatten } from '../sys_functions';
import {
  dynamicArrayExpr, dynamicKeyObjectExpr, dynamicNestedObjectExpr, dynamicObjectExpr,
  getNodeOutputExpr, dynamicStrExpr
} from './mock_data';

describe('dynamic variable render', () => {
  const sysFunctions = [getNodeOutput, getObjectProperty, concatString, newArray, newObject, flatten];
  const parser = new MagicVariableParser<typeof runtimeContext>(sysFunctions);

  it('get output of node', () => {
    const res = parser.exec(getNodeOutputExpr as IExpression, runtimeContext);
    expect(res).toEqual('apitableA');
  });

  it('concat string', () => {
    const res = parser.exec(dynamicStrExpr as IExpression, runtimeContext);
    expect(JSON.parse(res)).toEqual({
      msgtype: 'link',
      link: {
        text: 'apitableA',
        title: 'doge: automation test',
        picUrl: '',
        messageUrl: 'https://example.com'
      }
    });
  });

  it('dynamic array', () => {
    const res = parser.exec(dynamicArrayExpr as IExpression, runtimeContext);
    expect(res).toEqual(['apitableA', 'apitableB']);
  });

  it('dynamic object', () => {
    const res = parser.exec(dynamicObjectExpr as IExpression, runtimeContext);
    expect(res).toEqual({ apitableA: 'apitableA', apitableB: 'apitableB' });
  });

  it('dynamic nested object', () => {
    const res = parser.exec(dynamicNestedObjectExpr as IExpression, runtimeContext);
    expect(res).toEqual({ apitableA: { apitableA: 'apitableA', apitableB: 'apitableB' }, apitableB: 'apitableB' });
  });

  it('dynamic object key', () => {
    const res = parser.exec(dynamicKeyObjectExpr as IExpression, runtimeContext);
    expect(res).toEqual({ apitableA: 'apitableA Value', apitableB: 'apitableB' });
  });

  it('dynamic nested array', () => {
    const res = parser.exec({
      operator: 'flatten',
      operands: [
        {
          type: 'Literal',
          value: [['a', 'b', 'c'], ['d', 'e', 'f']],
        },
      ]
    } as IExpression, runtimeContext);
    expect(res).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });
});