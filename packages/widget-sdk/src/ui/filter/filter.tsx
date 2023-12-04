import { FilterContext } from './filter_context';
import { WidgetContext } from 'context';
import { useContext } from 'react';
import { injectStore, IOpenFilterConditionGroup, IReduxState, parseFilterExpressByOpenFilter, parseOpenFilterByExpress } from '@apitable/core';
import React from 'react';
import { FilterBase } from './filter_base';
import { Store } from 'redux';
import { useSelector } from 'react-redux';
import { getSnapshot } from 'store';
import { FieldIconMap, FieldIconMapFieldType } from './field_select';
export { FieldIconMap, FieldIconMapFieldType };

interface IFilterProps {
  filter?: IOpenFilterConditionGroup;
  datasheetId: string;
  onChange?: (filter: IOpenFilterConditionGroup) => void;
}

export const Filter: React.FC<IFilterProps> = props => {
  const { widgetStore } = useContext(WidgetContext);
  const { datasheetId, onChange } = props;
  const snapshot = useSelector(state => getSnapshot(state, datasheetId));

  if (!snapshot) {
    return <>{`${datasheetId} datasheet is loading`}</>;
  }

  const expressFilter = parseFilterExpressByOpenFilter(props.filter || {}, {
    fieldMap: snapshot.meta.fieldMap,
    state: widgetStore.getState() as any as IReduxState
  }) || undefined;

  injectStore(widgetStore);
  return (
    <FilterContext.Provider value={{
      store: widgetStore as any as Store<IReduxState>
    }}>
      <FilterBase {...props} filter={expressFilter?.value} onChange={(value) => {
        const filter = parseOpenFilterByExpress(value, {
          meta: snapshot.meta,
          state: widgetStore.getState() as any as IReduxState
        }) as any;
        onChange && onChange(filter);
      }} />
    </FilterContext.Provider>
  );
};
