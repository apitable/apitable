package com.vikadata.api.workspace.service;

import java.util.List;
import java.util.Map;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.workspace.enums.FieldType;
import com.vikadata.api.workspace.ro.MetaMapRo;
import com.vikadata.api.workspace.ro.RemindMemberRo;
import com.vikadata.api.workspace.ro.SnapshotMapRo;
import com.vikadata.api.workspace.dto.NodeCopyOptions;
import com.vikadata.entity.DatasheetEntity;

public interface IDatasheetService extends IService<DatasheetEntity> {

    /**
     * @param entities datasheet
     */
    void batchSave(List<DatasheetEntity> entities);

    /**
     * @param spaceId space id
     * @param dstId datasheet id
     * @param dstName datasheet name
     * @param creator creator
     */
    void create(String spaceId, String dstId, String dstName, Long creator);

    /**
     * create datasheet
     *
     * @param userId user id
     * @param spaceId space id
     * @param nodeId    node id
     * @param name      node name
     * @param metaMapRo meta map
     * @param recordMap record map
     */
    void create(Long userId, String spaceId, String nodeId, String name, MetaMapRo metaMapRo, JSONObject recordMap);

    /**
     * update the datasheet name according to node id
     *
     * @param userId user id
     * @param dstId datasheet id
     * @param dstName datasheet name
     */
    void updateDstName(Long userId, String dstId, String dstName);

    /**
     * @param userId user id
     * @param nodeIds node ids
     * @param isDel   false is recovery
     */
    void updateIsDeletedStatus(Long userId, List<String> nodeIds, Boolean isDel);

    /**
     * copy table
     *
     * @param userId user id
     * @param spaceId space id
     * @param sourceDstId source datasheet id
     * @param destDstId   new datasheet id
     * @param destDstName new datasheet name
     * @param options     copy attribute
     * @param newNodeMap  source node ID - new node ID MAP（all nodes transferred）
     * @return List<String>
     */
    List<String> copy(Long userId, String spaceId, String sourceDstId, String destDstId, String destDstName,
            NodeCopyOptions options, Map<String, String> newNodeMap);

    /**
     *
     * @param widgetPanels      source widget panel
     * @param newWidgetIdMap    widget ID MAP
     * @return WidgetPanels
     */
    JSONArray generateWidgetPanels(JSONArray widgetPanels, Map<String, String> newWidgetIdMap);

    /**
     * the id of the query number table and the id of the corresponding associated number table.
     *
     * @param dstIdList datasheet ids
     * @param filter    whether the associated number table id is filtered dstIdList
     * @return dstId - list of associated number table id map
     */
    Map<String, List<String>> getForeignDstIds(List<String> dstIdList, boolean filter);

    /**
     * Deletes the field of the specified association table
     *
     * @param userId user id
     * @param dstId datasheet id
     * @param linkDstIds associated datasheet id
     * @param saveDb     whether save to database
     * @return snapshot
     */
    SnapshotMapRo delFieldIfLinkDstId(Long userId, String dstId, List<String> linkDstIds, boolean saveDb);

    /**
     * get multiple tables and corresponding snapshot
     *
     * @param dstIds datasheet ids
     * @param hasRecordMap whether record map is included
     * @return dstId - snapshot map
     */
    Map<String, SnapshotMapRo> findSnapshotMapByDstIds(List<String> dstIds, boolean hasRecordMap);

    /**
     * Replace the number table ID in the field attribute.
     *
     * @param userId user id
     * @param sameSpace    is it the same space
     * @param metaMapRo    meta data
     * @param newNodeIdMap original node id - new node id map
     * @return delFieldIds
     */
    List<String> replaceFieldDstId(Long userId, boolean sameSpace, MetaMapRo metaMapRo, Map<String, String> newNodeIdMap);

    /**
     * Member field mentions other people's record operation
     *
     * @param userId user id
     * @param spaceId space id
     * @param ro      request parameters
     */
    void remindMemberRecOp(Long userId, String spaceId, RemindMemberRo ro);

    /**
     * convert the deleted associated field
     *
     * @param userId user id
     * @param dstIdToDelDstIdsMap datasheet id - deleted associated datasheet id map
     */
    void transformDeletedLinkField(Long userId, Map<String, List<String>> dstIdToDelDstIdsMap);

    /**
     * parse the cell data of the number table
     *
     * @param fieldType field type
     * @param property  field properties
     * @param cellVal   source data
     * @return value after parse
     */
    String parseCellData(FieldType fieldType, JSONObject property, Object cellVal);

    /**
     * Get the node information of the external association table.
     *
     * @param dstIdList node ids
     * @return node association field map
     */
    Map<String, List<String>> getForeignFieldNames(List<String> dstIdList);
}
