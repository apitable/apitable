/*
 * AppHook Module Unit Tests
 *
 * @Author: Kelly Peilin Chan (kelly@apitable.com)
 * @Date: 2020-03-09 19:46:02
 * @Last Modified by: Kelly Peilin Chan (kelly@apitable.com)
 * @Last Modified time: 2022-10-19 14:26:00
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

    // test catch erro (red error)
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

    // Single layer filter
    const filter1: IFilter = apphook.addFilter('get_test_name',
      defaultValue => (defaultValue + ' Filtered1'),
      [],
      rule);
    expect(filter1.hook).toBe('get_test_name');

    const filterd1 = apphook.applyFilters('get_test_name', 'Test Name');
    expect(filterd1).toBe('Test Name Filtered1');

    // Double layer filter
    const filter2: IFilter = apphook.addFilter('get_test_name',
      defaultValue => (defaultValue + ' Filtered2'),
      [],
      rule);
    expect(filter2.hook).toBe('get_test_name');

    const filterd2 = apphook.applyFilters('get_test_name', 'Test Name');
    expect(filterd2).toBe('Test Name Filtered2 Filtered1');

    // third layer filter
    const filter3: IFilter = apphook.addFilter('get_test_name',
      defaultValue => (defaultValue + ' Filtered3'),
      [],
      rule, 999);
    expect(filter3.hook).toBe('get_test_name');

    const filterd3 = apphook.applyFilters('get_test_name', 'Test Name');
    expect(filterd3).toBe('Test Name Filtered2 Filtered1 Filtered3');

    // delete filter
    apphook.removeFilter(filter1);

    const filterd4 = apphook.applyFilters('get_test_name', 'Test Name');
    expect(filterd4).toBe('Test Name Filtered2 Filtered3');

    expect(apphook.hasAnyFilters('get_test_name')).toBe(true);
  });
});
