import { getComputeRefManager } from 'compute_manager';
import { testPath } from 'event_manager/helper';
import { Field } from 'model';
import { IReduxState, Selectors } from 'store';
import { FieldType } from 'types';
import { ResourceType } from 'types/resource_types';
import { IAtomEventType } from '../interface';
import { EventAtomTypeEnums, EventRealTypeEnums, EventSourceTypeEnums, OPEventNameEnums } from './../../const';
import { IEventInstance, IOPBaseContext, IOPEvent, IVirtualAtomEvent } from './../../interface/event.interface';

interface ICellUpdatedContext {
  recordId: string;
  fieldId: string;
  datasheetId: string;
  action: any;
  change: {
    from: any;
    to: any;
  }
}

// @EventMeta(OPEventNameEnums.CellUpdated)
export class OPEventCellUpdated extends IAtomEventType<ICellUpdatedContext> {
  eventName = OPEventNameEnums.CellUpdated;
  realType = EventRealTypeEnums.REAL;
  scope = ResourceType.Datasheet;
  test(opContext: IOPBaseContext) {
    const { action, resourceId, resourceType } = opContext;
    if (resourceType !== ResourceType.Datasheet) {
      return {
        pass: false,
        context: null,
      };
    }
    const { pass, recordId, fieldId } = testPath(action.p, ['recordMap', ':recordId', 'data', ':fieldId']);
    return {
      pass,
      context: {
        recordId,
        fieldId,
        datasheetId: resourceId,
        action,
        change: {
          from: action['od'],
          to: action['oi'],
        }
      }
    };
  }

  /**
   * 实体事件生成虚拟事件，去重。
   * 这里依赖 meta 和 recordMap ，所以需要传入 state。
   */
  computeEvent(eventBuffer: IEventInstance<IOPEvent>[], state: IReduxState): IEventInstance<IVirtualAtomEvent>[] {
    const computeRefManager = getComputeRefManager(state);
    const computeEventContextSet = new Set<string>();
    const addComputeEventContext = (context: string, state: IReduxState) => {
      const [datasheetId, recordId, fieldId] = context.split('-');
      // 1.某个 cell 更新了，这个 cell 对应 field
      const updateCellField = Selectors.getField(state, fieldId, datasheetId);
      if (!updateCellField) {
        return;
      }
      // 2. 依赖这个 field 的全部 field（这些字段全都是计算字段）
      const fieldRefs = computeRefManager.refMap.get(`${datasheetId}-${fieldId}`);
      if (!fieldRefs?.size) {
        return;
      }
      fieldRefs.forEach(refId => {
        const [_datasheetId, _fieldId] = refId.split('-');
        const fieldMap = Selectors.getFieldMap(state, _datasheetId)!;
        // 3. 依赖这个 field 的其中某个 field
        const field = fieldMap[_fieldId];
        // FIXME: 出现了一个 fieldMap 中不存在的 fieldId，该 field 已经被删除，refMap 的引用关系没有及时更新。
        if (!field) return;
        const isEventInSameDatasheet = _datasheetId === datasheetId;
        const snapshot = Selectors.getSnapshot(state, datasheetId)!;
        // 4. 触发事件的表，和依赖这个事件的表，是不同的表，能够产生跨表依赖的，一定是 lookup 或者 link 字段。
        switch (field.type) {
          case FieldType.LookUp:
            // 1. lookup 字段依赖的 link 字段
            const relatedLinkField = Field.bindContext(field, state).getRelatedLinkField();
            if (!relatedLinkField) {
              return;
            }
            let triggerRecIds: string[] = [];
            // 2. 同一张表触发 lookup 更新，一定是自表关联。关联 link 字段的兄弟字段就是自己
            if (isEventInSameDatasheet) {
              // 引起 lookup 字段变化，要么是 link 字段，要么是被 look 的实体字段。
              if (updateCellField.id === relatedLinkField.id) {
                computeEventContextSet.add(`${_datasheetId}-${recordId}-${_fieldId}`);
              } else {
                // 自表关联 look 的实体字段变化。引用了本条 record 的所有 record 的 lookup 字段都要更新。
                triggerRecIds = Object.keys(snapshot.recordMap).reduce((prev, _recordId) => {
                  const linkCellValue = Selectors.getCellValue(state, snapshot, _recordId, relatedLinkField.id);
                  if (linkCellValue && (linkCellValue as string[]).includes(recordId)) {
                    prev.push(_recordId);
                  }
                  return prev;
                }, [] as string[]);
              }
            } else {
              const brotherFieldId = relatedLinkField.property.brotherFieldId!;
              // 3. 本次 cell 更新影响的 recordIds
              triggerRecIds = Selectors.getCellValue(state, snapshot, recordId, brotherFieldId);
            }
            // TODO: link 字段单元格的值一定是 null 或者数组。由于脏数据存在，这里先判断一下是否是数组类型再做处理。清洗完数据后删掉？
            if (triggerRecIds && Array.isArray(triggerRecIds)) {
              (triggerRecIds as string[]).forEach(recId => {
                computeEventContextSet.add(`${_datasheetId}-${recId}-${_fieldId}`);
              });
            }
            break;
          case FieldType.Formula:
            computeEventContextSet.add(`${datasheetId}-${recordId}-${_fieldId}`);
            break;
          case FieldType.Link:
            // LINK 字段不是严格意义的计算字段，这里需要更新 link 字段的 title。暂时当作计算字段处理
            // 此次更新表的中的 link 字段
            const thisLinkFieldId = field.property.brotherFieldId;
            if (!thisLinkFieldId) return;
            // 外键表的哪些记录依赖了此记录
            const linkRecIds = Selectors.getCellValue(state, snapshot, recordId, thisLinkFieldId);
            // FIXME: 这里可能出现不是数组的非空 cv。导致下面代码出问题, 先兼容下。
            if (linkRecIds && Array.isArray(linkRecIds)) {
              linkRecIds.forEach(recId => {
                computeEventContextSet.add(`${_datasheetId}-${recId}-${_fieldId}`);
              });
            }
            break;
          default:
            //  TODO: 将创建时间、创建人、更新时间、更新人、自增数字纳入事件管理。 10.13 上线后修改
            console.warn('! ' + `未知的计算字段类型：${field.type}`);
          // throw new Error(`unsupported field type: ${field.type}`);
        }
      });
    };
    // 实体事件来的上下文
    eventBuffer.forEach(({ context }) => {
      const { datasheetId, recordId, fieldId } = context;
      const key = `${datasheetId}-${recordId}-${fieldId}`;
      addComputeEventContext(key, state);
    });
    // 虚拟事件来的上下文
    computeEventContextSet.forEach(context => {
      addComputeEventContext(context, state);
    });
    // 经过 set 去重后。computeRef 内就是本次实体cell 更新会触发的计算单元格更新。
    /**
     * !!! 集合在循环过程中，继续往集合里面推入新的元素。新元素也会出现在本次循环中。
     * const aset = new Set([1,2,3])
     * aset.forEach(i=> {
     *  console.log(i);
     *  if(i===3){
     *    aset.add(4)
     *  }
     * })
     * output: 1 2 3 4
     * 这里在循环计算信号的时候，会递归的触发事件，事件又会往集合内 push 信号。直到信号为空。
     * 理论上，在没有循环引用的情况下，不会出现死循环的现象。
     */
    const res: IEventInstance<IVirtualAtomEvent>[] = [];
    computeEventContextSet.forEach(context => {
      const [datasheetId, recordId, fieldId] = context.split('-');
      res.push({
        eventName: OPEventNameEnums.CellUpdated,
        context: {
          datasheetId, recordId, fieldId,
        },
        atomType: EventAtomTypeEnums.ATOM,
        realType: EventRealTypeEnums.VIRTUAL,
        sourceType: EventSourceTypeEnums.ALL,
        scope: this.scope,
      });
    });
    return res;
  }
}
