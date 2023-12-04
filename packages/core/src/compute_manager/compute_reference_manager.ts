/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { computeCache } from 'compute_manager/compute_cache_manager';
import { COMPUTE_REF_MAP_CACHE_KEY } from 'compute_manager/helper';
import { parse, TokenType } from 'formula_parser';
import { Field } from 'model/field';
import { LookUpField } from 'model/field/lookup_field';
import { IFieldMap, IReduxState } from '../exports/store/interfaces';
import { FieldType, IField } from 'types';

import {
  getSnapshot,
  getDatasheetPrimaryField,
} from 'modules/database/store/selectors/resource/datasheet/base';
type IRefMap = Map<string, Set<string>>;
// Reference management for computed fields
export class ComputeRefManager {
  public reRefMap: IRefMap; // Back reference, that is, forward dependency. B depends on A, C depends on A. Calculated field as key
  public refMap: IRefMap; // A is referenced by [B,C]. Calculate field value
  private toComputeMap: IRefMap = new Map();

  public getToComputeDsts(dstId: string) {
    return Array.from(this.toComputeMap.get(dstId)?.values() ?? []);
  }

  public setDstComputed(dstId: string) {
    this.toComputeMap.delete(dstId);
  }

  constructor(refMap?: IRefMap, reRefMap?: IRefMap) {
    this.refMap = refMap || new Map();
    this.reRefMap = reRefMap || new Map();
  }

  private addReRef(key: string, value: Set<string>) {
    this.reRefMap.set(key, value);
  }

  private addRef(key: string, value: string) {
    // Simulate adding a new reference relationship
    const ref = this.refMap.get(key);
    if (ref) {
      ref.add(value);
    } else {
      this.refMap.set(key, new Set([value]));
    }
  }

  /**
   * Calculate the datasheetId collection of the forward or reverse dependence of the dimensional table dependence
   * @param dstId
   * @param fieldMap
   * @param refMap
   */
  private getRefDstIds(dstId: string, fieldMap: IFieldMap, refMap: IRefMap): string[] {
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

    const dstSet = new Set(Array.from(allDependenceKeys).map(key => key.split('-')[0]!));
    return Array.from(dstSet);
  }

  // Check if there is a circular reference, if it exists, it will not pass
  public checkRef(key: string, _visitedNode?: Set<string>): boolean {
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
   * TODO: Precisely clean up references.
   * 1. When a calculated field becomes a non-calculated field (deleted or field converted),
   * it is necessary to clean up the side of reRefMap as the key and the side of refMap as the value.
   * 2. Calculated fields are converted into other calculated fields, and formula lookup is converted to each other.
   * Cross-table non-cross-table dependent transformation
   * 3. The calculated field is not converted, but a dependency change has occurred.
   * For example, the formula originally depended on two fields A and B,
   * and later only depended on the A field, then the dependence on B should be removed.
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
   * Clear dependencies and references.
   */
  public clear() {
    this.refMap.clear();
    this.reRefMap.clear();
    this.toComputeMap.clear();
  }

  /*
   * Take the datasheet fieldMap as the entry to calculate the reference relationship of the datasheet,
   * and only calculate the reference relationship of one datasheet at a time
   * a - b - c three-table association,
   * When accessing table a, the server will also return meta and partial data of table b and c. In this case, computeRefMap is called three times.
   * @param fieldMap
   * @param datasheetId
   * @param state
   */
  public computeRefMap(fieldMap: IFieldMap, datasheetId: string, state: IReduxState, shouldSyncCache = true) {
    Object.values(fieldMap)
      .filter(field => Field.bindContext(field, state).isComputed || field.type === FieldType.Link || field.type === FieldType.OneWayLink)
      .forEach((field: IField) => {
        switch (field.type) {
          case FieldType.Formula:
            // formula may parse incorrectly
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
          // The lookup field depends on the link field of the current table and the looked field of the link table
          case FieldType.LookUp:
            const keys = new LookUpField(field, state).getCurrentDatasheetRelatedFieldKeys(datasheetId);
            this.addReRef(`${datasheetId}-${field.id}`, new Set(keys));
            keys.forEach(key => {
              this.addRef(key, `${datasheetId}-${field.id}`);
            });
            break;
          // The link field depends on the first field of the foreign key table
          case FieldType.Link:
          case FieldType.OneWayLink:
            const linkDstId = field.property.foreignDatasheetId;
            const linkSnapshot = getSnapshot(state, linkDstId);
            if (linkSnapshot) {
              const linkPrimaryField = getDatasheetPrimaryField(linkSnapshot);
              const key = `${linkDstId}-${linkPrimaryField!.id}`;
              this.addReRef(`${datasheetId}-${field.id}`, new Set([key]));
              this.addRef(key, `${datasheetId}-${field.id}`);
            } else {
              const list = this.toComputeMap.get(linkDstId) || new Set<string>();
              list.add(`${datasheetId}`);
              this.toComputeMap.set(linkDstId, list);
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
   * Get all fields affected by a field
   */
  public getAllEffectKeysByKey(key: string): {
    hasError: boolean;
    effectedKeys: Set<string>
  } {
    const effectedKeys = new Set<string>();
    const collectEffectedFieldKeys = (refKey: string) => {
      this.refMap.get(refKey)?.forEach((key) => {
        // First check if there is a circular reference.
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
   * Check which table datasheetId collection a table depends on
   * @param dstId
   * @param fieldMap
   */
  public getDependenceByDstIds(dstId: string, fieldMap: IFieldMap): string[] {
    return this.getRefDstIds(dstId, fieldMap, this.reRefMap);
  }

  /**
   * Check which tables a table depends on
   * @param dstId
   * @param fieldMap
   */
  public getDependenceDstIds(dstId: string, fieldMap: IFieldMap): string[] {
    return this.getRefDstIds(dstId, fieldMap, this.refMap);
  }
}
