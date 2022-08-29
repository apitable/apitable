package com.vikadata.api.modular.workspace.service;

import java.util.Collection;
import java.util.List;

import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.vo.datasheet.DatasheetRecordMapVo;
import com.vikadata.api.modular.workspace.model.NodeCopyDTO;
import com.vikadata.entity.DatasheetRecordEntity;

/**
 * <p>
 * 数表记录表 服务类
 * </p>
 *
 * @author Benson Cheung
 * @since 2019-09-23
 */
public interface IDatasheetRecordService extends IService<DatasheetRecordEntity> {

    /**
     * 批量保存
     * @param entities 实体列表
     */
    void batchSave(List<DatasheetRecordEntity> entities);

    /**
     * 批量新增多个记录
     *
     * @param userId    用户ID
     * @param recordMap 记录Map Json格式
     * @param dstId     数表ID
     * @author Chambers
     * @date 2019/12/19
     */
    void saveBatch(Long userId, JSONObject recordMap, String dstId);

    /**
     * 复制数表记录
     *
     * @param userId      用户ID
     * @param oDstId      源数表ID
     * @param tDstId      目标数表ID
     * @param nodeCopyDTO 节点复制 DTO
     * @param retain      保留 RecordMeta
     * @author Chambers
     * @date 2019/12/31
     */
    void copyRecords(Long userId, String oDstId, String tDstId, NodeCopyDTO nodeCopyDTO, boolean retain);

    /**
     * 复制某一列的数据到新的一列
     *
     * @param dstId    数表ID
     * @param oFieldId 源列ID
     * @param tFieldId 目标列ID
     * @author Chambers
     * @date 2020/3/31
     */
    void copyFieldData(String dstId, String oFieldId, String tFieldId);

    /**
     * 删除数表记录中指定字段的数据
     *
     * @param dstId       数表ID
     * @param delFieldIds 删除的字段ID列表
     * @param saveDb      是否保存至数据库
     * @return map
     * @author Chambers
     * @date 2020/4/17
     */
    DatasheetRecordMapVo delFieldData(String dstId, List<String> delFieldIds, boolean saveDb);

    /**
     * 获取多个数表的recordMap
     *
     * @param dstIds 数表ID列表
     * @return recordMapVo列表
     * @author Chambers
     * @date 2020/4/30
     */
    List<DatasheetRecordMapVo> findMapByDstIds(Collection<String> dstIds);
}
