package com.vikadata.api.modular.workspace.service;

import java.util.List;
import java.util.Map;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.datasheet.FieldType;
import com.vikadata.api.model.ro.datasheet.MetaMapRo;
import com.vikadata.api.model.ro.datasheet.RemindMemberRo;
import com.vikadata.api.model.ro.datasheet.SnapshotMapRo;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.entity.DatasheetEntity;

/**
 * <p>
 * 数据表格表 服务类
 * </p>
 *
 * @author Benson Cheung
 * @since 2019-09-20
 */
public interface IDatasheetService extends IService<DatasheetEntity> {

    /**
     * 批量保存
     * @param entities 实体列表
     */
    void batchSave(List<DatasheetEntity> entities);

    /**
     * 新增数表
     *
     * @param spaceId 空间ID
     * @param dstId   数表ID
     * @param dstName 数表名称
     * @param creator 创建者
     * @author Benson Cheung
     * @date 2019/09/20 16:17
     */
    void create(String spaceId, String dstId, String dstName, Long creator);

    /**
     * 创建数表
     *
     * @param userId    用户ID
     * @param spaceId   空间ID
     * @param nodeId    数表对应的节点ID
     * @param name      名称
     * @param metaMapRo meta集合参数
     * @param recordMap record集合参数
     */
    void create(Long userId, String spaceId, String nodeId, String name, MetaMapRo metaMapRo, JSONObject recordMap);

    /**
     * 根据nodeId更新数表名称
     *
     * @param userId  用户ID
     * @param dstId   数表ID
     * @param dstName 数表名称Ω
     * @author Benson Cheung
     * @date 2019/09/20 16:17
     */
    void updateDstName(Long userId, String dstId, String dstName);

    /**
     * 更改逻辑删除状态
     *
     * @param userId  用户ID
     * @param nodeIds 节点ID 集合
     * @param isDel   是否删除（否为恢复）
     * @author Benson Cheung
     * @date 2019/09/20 16:17
     */
    void updateIsDeletedStatus(Long userId, List<String> nodeIds, Boolean isDel);

    /**
     * 复制数表
     *
     * @param userId      用户ID
     * @param spaceId     空间ID
     * @param sourceDstId 原节点ID
     * @param destDstId   新创建节点ID
     * @param destDstName 新创建的节点名称
     * @param options     拷贝属性
     * @param newNodeMap  原节点ID-新创建节点ID MAP（转存的所有节点）
     * @return List<String> 修改的link字段
     * @author Benson Cheung
     * @date 2019/09/20 16:17
     */
    List<String> copy(Long userId, String spaceId, String sourceDstId, String destDstId, String destDstName,
            NodeCopyOptions options, Map<String, String> newNodeMap);

    /**
     * 构建小程序面板
     *
     * @param widgetPanels      源小程序面板
     * @param newWidgetIdMap    小程序ID MAP
     * @return WidgetPanels
     * @author Chambers
     * @date 2022/1/21
     */
    JSONArray generateWidgetPanels(JSONArray widgetPanels, Map<String, String> newWidgetIdMap);

    /**
     * 查询数表ID及对应的关联数表ID
     *
     * @param dstIdList 数表ID列表
     * @param filter    关联数表ID是否过滤 dstIdList
     * @return dstId - 关联数表ID列表 map
     * @author Chambers
     * @date 2020/3/31
     */
    Map<String, List<String>> getForeignDstIds(List<String> dstIdList, boolean filter);

    /**
     * 删除指定关联数表的字段
     *
     * @param userId     用户ID
     * @param dstId      数表ID
     * @param linkDstIds 关联数表ID
     * @param saveDb     是否保存至数据库
     * @return snapshot
     * @author Chambers
     * @date 2020/4/17
     */
    SnapshotMapRo delFieldIfLinkDstId(Long userId, String dstId, List<String> linkDstIds, boolean saveDb);

    /**
     * 获取多个数表及对应的snapshot
     *
     * @param dstIds       数表ID列表
     * @param hasRecordMap 是否包含RecordMap
     * @return dstId - snapshot map
     * @author Chambers
     * @date 2020/4/30
     */
    Map<String, SnapshotMapRo> findSnapshotMapByDstIds(List<String> dstIds, boolean hasRecordMap);

    /**
     * 替换字段属性中的数表ID
     *
     * @param userId       用户ID
     * @param sameSpace    是否是同空间
     * @param metaMapRo    元数据
     * @param newNodeIdMap 原节点ID-新节点ID MAP
     * @return delFieldIds
     * @author Chambers
     * @date 2020/5/9
     */
    List<String> replaceFieldDstId(Long userId, boolean sameSpace, MetaMapRo metaMapRo, Map<String, String> newNodeIdMap);

    /**
     * 成员字段提及他人记录操作
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @param ro      请求参数
     * @author Chambers
     * @date 2020/5/28
     */
    void remindMemberRecOp(Long userId, String spaceId, RemindMemberRo ro);

    /**
     * 转换被删除的关联字段
     *
     * @param userId              用户ID
     * @param dstIdToDelDstIdsMap 数表ID - 被删除的关联数表ID Map
     * @author Chambers
     * @date 2020/6/1
     */
    void transformDeletedLinkField(Long userId, Map<String, List<String>> dstIdToDelDstIdsMap);

    /**
     * 解析数表的单元格数据
     *
     * @param fieldType 字段类型
     * @param property  字段属性
     * @param cellVal   源数据
     * @return value after parse
     * @author Chambers
     * @date 2020/7/8
     */
    String parseCellData(FieldType fieldType, JSONObject property, Object cellVal);

    /**
     * 获取有外关联表的节点信息
     *
     * @param dstIdList 节点ID集合
     * @return 节点关联字段Map
     * @author liuzijing
     * @date 2022/7/21
     */
    Map<String, List<String>> getForeignFieldNames(List<String> dstIdList);
}
