/*
 * AppHook模块的单元测试
 *
 * @Author: Kelly Peilin Chan (kelly@vikadata.com)
 * @Date: 2020-03-09 19:46:02
 * @Last Modified by: Kelly Peilin Chan (kelly@vikadata.com)
 * @Last Modified time: 2020-03-19 14:28:14
 */
import { IFilter, ICondition, IRule, ITrigger, AppHook } from '..';

class TestCondition implements ICondition {
  doCheck(): boolean {
    return true;
  }
}

describe('test appHook', () => {
  it('should call trigger event ok', () => {
    const apphook = new AppHook();

    expect(apphook.hasAnyTriggers('test_trigger_event')).toBe(false);

    const rule: IRule = {
      condition: new TestCondition(),
      args: [],
    };

    let triggerResult = false;

    const trigger: ITrigger = apphook.addTrigger(
      'test_trigger_event',
      (hookState, _args) => {
        expect(hookState).toBe(123);
        triggerResult = true;
      },
      [],
      rule);

    expect(apphook.hasAnyTriggers('test_trigger_event')).toBe(true);

    apphook.doTriggers('test_trigger_event', 123);

    expect(triggerResult.toString()).toBe('true');
    expect(trigger.hook).toBe('test_trigger_event');

    // test catch erro 这个测试会打印红色错误，需要时再启动吧
    // apphook.addTrigger(
    //     'test_error_event', (state, _args) => {
    //         expect(state).toBe(321);
    //         throw new Error('TestError');
    //     },
    //     [],
    //     rule,
    //     0,
    //     true);
    // apphook.doTriggers('test_error_event', 321);
  });

  it('should call filter event ok', () => {
    const apphook = new AppHook();

    expect(apphook.hasAnyFilters('get_test_name')).toBe(false);

    const rule: IRule = {
      condition: {
        doCheck: () => true,
      },
      args: [],
    };

    // 单层过滤
    const filter1: IFilter = apphook.addFilter('get_test_name',
      defaultValue => (defaultValue + ' Filtered1'),
      [],
      rule);
    expect(filter1.hook).toBe('get_test_name');

    const filterd1 = apphook.applyFilters('get_test_name', 'Test Name');
    expect(filterd1).toBe('Test Name Filtered1');

    // 双重过滤
    const filter2: IFilter = apphook.addFilter('get_test_name',
      defaultValue => (defaultValue + ' Filtered2'),
      [],
      rule);
    expect(filter2.hook).toBe('get_test_name');

    const filterd2 = apphook.applyFilters('get_test_name', 'Test Name');
    expect(filterd2).toBe('Test Name Filtered2 Filtered1');

    // 第三个过滤器
    const filter3: IFilter = apphook.addFilter('get_test_name',
      defaultValue => (defaultValue + ' Filtered3'),
      [],
      rule, 999);
    expect(filter3.hook).toBe('get_test_name');

    const filterd3 = apphook.applyFilters('get_test_name', 'Test Name');
    expect(filterd3).toBe('Test Name Filtered2 Filtered1 Filtered3');

    // 删除过滤器
    apphook.removeFilter(filter1);

    const filterd4 = apphook.applyFilters('get_test_name', 'Test Name');
    expect(filterd4).toBe('Test Name Filtered2 Filtered3');

    expect(apphook.hasAnyFilters('get_test_name')).toBe(true);
  });
});
