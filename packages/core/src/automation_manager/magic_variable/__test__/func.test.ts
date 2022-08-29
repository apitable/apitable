import { IExpression } from 'automation_manager/interface';
import { runtimeContext } from 'automation_manager/__test__/mock_data';
import { MagicVariableParser } from '../magic_variable_parser';
import { getNodeOutput, getObjectProperty, concatString, newArray, newObject, flatten } from '../sys_functions';
import {
  dynamicArrayExpr, dynamicKeyObjectExpr, dynamicNestedObjectExpr, dynamicObjectExpr,
  getNodeOutputExpr, dynamicStrExpr
} from './mock_data';

describe('测试动态参数渲染', () => {
  const sysFunctions = [getNodeOutput, getObjectProperty, concatString, newArray, newObject, flatten];
  const parser = new MagicVariableParser<typeof runtimeContext>(sysFunctions);

  it('获取节点输出值', () => {
    const res = parser.exec(getNodeOutputExpr as IExpression, runtimeContext);
    expect(res).toEqual('维格表A');
  });

  it('测试字符串拼接', () => {
    const res = parser.exec(dynamicStrExpr as IExpression, runtimeContext);
    expect(JSON.parse(res)).toEqual({
      msgtype: 'link',
      link: {
        text: '维格表A',
        title: 'doge: automation test',
        picUrl: '',
        messageUrl: 'https://vika.cn'
      }
    });
  });

  it('测试动态数组', () => {
    const res = parser.exec(dynamicArrayExpr as IExpression, runtimeContext);
    expect(res).toEqual(['维格表A', '维格表B']);
  });

  it('测试动态对象', () => {
    const res = parser.exec(dynamicObjectExpr as IExpression, runtimeContext);
    expect(res).toEqual({ 维格表A: '维格表A', 维格表B: '维格表B' });
  });

  it('测试动态嵌套对象', () => {
    const res = parser.exec(dynamicNestedObjectExpr as IExpression, runtimeContext);
    expect(res).toEqual({ 维格表A: { 维格表A: '维格表A', 维格表B: '维格表B' }, 维格表B: '维格表B' });
  });

  it('测试动态 key 对象', () => {
    const res = parser.exec(dynamicKeyObjectExpr as IExpression, runtimeContext);
    expect(res).toEqual({ 维格表A: '维格表A Value', 维格表B: '维格表B' });
  });

  it('测试数组套数组', () => {
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