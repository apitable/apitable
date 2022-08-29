import { ICollaCommandOptions, ILocalChangeset } from '@vikadata/core';
import { IAuthHeader } from 'interfaces';
import { IAPINode } from 'interfaces/node.interface';
import { IAPISpace } from 'interfaces/space.interface';
import { DatasheetViewDto } from 'model/dto/fusion/datasheet.view.dto';
import { FieldQueryRo } from 'model/ro/fusion/field.query.ro';
import { RecordCreateRo } from 'model/ro/fusion/record.create.ro';
import { RecordQueryRo } from 'model/ro/fusion/record.query.ro';
import { ListVo } from 'model/vo/fusion/list.vo';

export interface IFusionApiInterface {
  /**
   * 数表分页查询
   * @param dstId 数表ID
   * @param query 查询条件
   * @param auth
   * @return Promise<ApiRecordDto[]>
   * @author Zoe Zheng
   * @date 2020/7/28 3:41 下午
   */
  getRecords(dstId: string, query: RecordQueryRo, auth: IAuthHeader): Promise<ListVo | null>;

  /**
   * 添加记录
   * @param dstId 表格ID
   * @param records 创建记录数据
   * @param viewId 视图ID
   * @return
   * @author Zoe Zheng
   * @date 2020/8/5 11:46 上午
   */
  addRecords(dstId: string, records: RecordCreateRo, viewId: string): Promise<ListVo>;

  /**
   * 修改records记录
   * @param dstId 数表ID
   * @param records 更新的records参数
   * @param viewId 视图ID
   * @return 更新的record的数组
   * @author Zoe Zheng
   * @date 2020/8/13 12:42 下午
   */
  updateRecords(dstId: string, records: RecordCreateRo, viewId: string): Promise<ListVo>;

  /**
   * 调用otServer应用changeSet
   * @param dstId 房间ID
   * @param changeSets 变更集数组
   * @param auth 授权信息（开发者的token）
   * @return Promise<IRemoteChangeset>
   * @author Zoe Zheng
   * @date 2020/8/20 8:14 下午
   */
  applyChangeSet(dstId: string, changeSets: ILocalChangeset[], auth: IAuthHeader): Promise<string>;

  /**
   * 删除行
   * @param dstId 数表ID
   * @param recordIds 请求ID数组
   * @return
   * @author Zoe Zheng
   * @date 2020/8/28 7:14 下午
   */
  deleteRecord(dstId: string, recordIds: string[]): Promise<boolean>;

  getViewList(dstId: string): Promise<DatasheetViewDto[] | undefined>;

  /**
   * 获取指定数表的字段 meta 列表
   * @param dstId 数表ID
   * @param query 请求参数
   */
  getFieldList(dstId: string, query: FieldQueryRo);

  getSpaceList(): Promise<IAPISpace[]>;

  /**
   * 获取指定空间站文件节点列表
   */
  getNodeList(spaceId: string): Promise<IAPINode[]>;

  /**
   * 自定义 command
   */
  executeCommand(datasheetId: string, commandBody: ICollaCommandOptions, auth: IAuthHeader): Promise<string>
}
