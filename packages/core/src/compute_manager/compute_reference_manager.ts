import { computeCache, COMPUTE_REF_MAP_CACHE_KEY, parse, TokenType } from 'index';
import { Field, LookUpField } from 'model';
import { IFieldMap, IReduxState, Selectors } from 'store';
import { FieldType, IField } from 'types';

type IRefMap = Map<string, Set<string>>;
// 计算字段的引用管理
export class ComputeRefManager {
  public reRefMap: IRefMap; // 反向引用，即正向依赖。 B 依赖 A， C 依赖 A。 计算字段做 key
  public refMap: IRefMap; // A 被 [B,C] 引用。 计算字段做值

  constructor(refMap?: IRefMap, reRefMap?: IRefMap) {
    this.refMap = refMap || new Map();
    this.reRefMap = reRefMap || new Map();
  }

  private addReRef(key: string, value: Set<string>) {
    this.reRefMap.set(key, value);
  }

  private addRef(key: string, value: string) {
    // 模拟添加新的引用关系
    const ref = this.refMap.get(key);
    if (ref) {
      ref.add(value);
    } else {
      this.refMap.set(key, new Set([value]));
    }
  }

  /**
   * 计算维格表依赖的正向或反向依赖的datasheetId集合
   * @param dstId 
   * @param fieldMap 
   * @param refMap 
   */
  private getRefDstIds(dstId: string, fieldMap: IFieldMap, refMap: IRefMap) {
    const fieldIds = Object.keys(fieldMap);
    const allKeys = fieldIds.map(fid => `${dstId}-${fid}`);
    const allDependenceKeys = new Set<string>();
    const collectDependenceFieldKeys = (refKey: string) => {
      refMap.get(refKey)?.forEach((key) => {
        if (!allDependenceKeys.has(key)) {
          allDependenceKeys.add(key);
          collectDependenceFieldKeys(key);
        }
      });
    };

    const hasErrorKeys: string[] = [];
    allKeys.forEach(key => {
      try {
        collectDependenceFieldKeys(key);
      } catch (error) {
        hasErrorKeys.push(key);
      }
    });

    const dstSet = new Set(Array.from(allDependenceKeys).map(key => key.split('-')[0]));
    return Array.from(dstSet);
  }

  // 检查是否存在循环引用，存在则不通过
  public checkRef(key: string, _visitedNode?: Set<string>) {
    const visitedNode = _visitedNode || new Set<string>();
    if (visitedNode.has(key)) {
      return false;
    }
    const ref = this.reRefMap.get(key);
    visitedNode.add(key);
    if (ref) {
      return Array.from(ref).every(key => this.checkRef(key, new Set(visitedNode)));
    }
    return true;
  }

  /**
   * TODO: 精确清理引用关系。
   * 1. 计算字段变成非计算字段时（被删除或者字段转换），需要清理 reRefMap 作为 key 的一边，也需要清理 refMap 作为值的一边。
   * 2. 计算字段转化成其他计算字段，formula lookup 互相转换。跨表非跨表依赖的转换
   * 3. 计算字段没转换，但是发生了依赖变更。例如本来 formula 依赖 A、B 2个字段，后来只依赖 A 字段，那么对于 B 的依赖应该去掉。
   */
  public cleanFieldRef(fieldId: string, datasheetId: string) {
    const key = `${datasheetId}-${fieldId}`;
    const thisFieldDeps = this.reRefMap.get(key);
    if (thisFieldDeps) {
      thisFieldDeps.forEach(item => {
        const thisFieldDep = this.refMap.get(item);
        thisFieldDep?.delete(key);
        if (thisFieldDep?.size === 0) {
          this.refMap.delete(item);
        }
      });
      this.reRefMap.delete(key);
    }
    console.log(this.reRefMap, this.refMap);
  }

  /**
   * 清空依赖和引用关系。
   */
  public clear() {
    this.refMap.clear();
    this.reRefMap.clear();
  }

  /*
   * 以数表 fieldMap 为入口，计算数表的引用关系，一次只会计算一张数表的引用关系
   * a - b - c 三表关联，
   * 访问 a 表，服务端也会返回 b，c 表的 meta 和部分数据。这种情况下，computeRefMap 会调用三次。
   * @param fieldMap 
   * @param datasheetId 
   * @param state 
   */
  public computeRefMap(fieldMap: IFieldMap, datasheetId: string, state: IReduxState, shouldSyncCache = true) {
    Object.values(fieldMap)
      .filter(field => Field.bindContext(field, state).isComputed || field.type === FieldType.Link)
      .forEach((field: IField) => {
        switch (field.type) {
          case FieldType.Formula:
            // 公式可能会解析错误
            const formulaExpr = parse(field.property.expression, { field, fieldMap, state }, true);
            if ('error' in formulaExpr) {
              break;
            }
            const formulaRelatedFieldIds = new Set<string>();
            if (formulaExpr && formulaExpr.lexer.errors.length === 0) {
              formulaExpr.lexer.matches.forEach(token => {
                switch (token.type) {
                  case TokenType.Value:
                    const fieldId = token.value.slice(1, -1);
                    formulaRelatedFieldIds.add(fieldId);
                    break;
                  case TokenType.PureValue:
                    formulaRelatedFieldIds.add(token.value);
                    break;
                }
              });
            }
            this.addReRef(`${datasheetId}-${field.id}`,
              new Set(Array.from(formulaRelatedFieldIds).map(fid => `${datasheetId}-${fid}`)),
            );
            formulaRelatedFieldIds.forEach(fid => {
              const key = `${datasheetId}-${fid}`;
              this.addRef(key, `${datasheetId}-${field.id}`);
            });
            break;
          // lookup 字段依赖当前表的 link 字段，和 link表的被 look 字段
          case FieldType.LookUp:
            const keys = new LookUpField(field, state).getCurrentDatasheetRelatedFieldKeys(datasheetId);
            this.addReRef(`${datasheetId}-${field.id}`, new Set(keys));
            keys.forEach(key => {
              this.addRef(key, `${datasheetId}-${field.id}`);
            });
            break;
          // link 字段依赖外键表的首字段
          case FieldType.Link:
            const linkDstId = field.property.foreignDatasheetId;
            const linkSnapshot = Selectors.getSnapshot(state, linkDstId);
            if (linkSnapshot) {
              const linkPrimaryField = Selectors.getDatasheetPrimaryField(linkSnapshot);
              const key = `${linkDstId}-${linkPrimaryField.id}`;
              this.addReRef(`${datasheetId}-${field.id}`, new Set([key]));
              this.addRef(key, `${datasheetId}-${field.id}`);
            }
            break;
          default:
            return;
        }
      });

    if (shouldSyncCache) {
      computeCache.set(COMPUTE_REF_MAP_CACHE_KEY, {
        refMap: this.refMap,
        reRefMap: this.reRefMap,
      });
    }
  }

  /**
   * 获取某个字段影响的全部字段
   */
  public getAllEffectKeysByKey(key: string): {
    hasError: boolean;
    effectedKeys: Set<string>
  } {
    const effectedKeys = new Set<string>();
    const collectEffectedFieldKeys = (refKey: string) => {
      this.refMap.get(refKey)?.forEach((key) => {
        // 先检查下是否会出现循环引用。
        if (!effectedKeys.has(key)) {
          effectedKeys.add(key);
          collectEffectedFieldKeys(key);
        }
      });
    };
    try {
      collectEffectedFieldKeys(key);
    } catch (error) {
      return {
        hasError: true,
        effectedKeys
      };
    }
    return {
      hasError: false,
      effectedKeys
    };
  }

  /**
   * 检查某张表依赖的哪些表 datasheetId 集合
   * @param dstId 
   * @param fieldMap 
   */
  public getDependenceByDstIds(dstId: string, fieldMap: IFieldMap): string[] {
    return this.getRefDstIds(dstId, fieldMap, this.reRefMap);
  }

  /**
   * 检查某张表被哪些表依赖
   * @param dstId 
   * @param fieldMap 
   */
  public getDependenceDstIds(dstId: string, fieldMap: IFieldMap): string[] {
    return this.getRefDstIds(dstId, fieldMap, this.refMap);
  }
}