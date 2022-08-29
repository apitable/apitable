package com.vikadata.api.modular.workspace.service;

import java.util.List;

import cn.hutool.json.JSONObject;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.datasheet.DatasheetMetaDTO;
import com.vikadata.api.model.ro.datasheet.MetaOpRo;
import com.vikadata.api.model.vo.datasheet.DatasheetMetaVo;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot;
import com.vikadata.entity.DatasheetMetaEntity;

/**
 * <p>
 * 数表元数据表 服务类
 * </p>
 *
 * @author Benson Cheung
 * @since 2019-09-23
 */
public interface IDatasheetMetaService {

    /**
     * 批量保存
     * @param metaEntities 实体列表
     */
    void batchSave(List<DatasheetMetaEntity> metaEntities);

    /**
     * 查询详细
     *
     * @param dstId 数表ID
     * @return DatasheetMetaVo
     * @author Benson Cheung
     * @date 2019/09/20 16:17
     */
    DatasheetMetaVo findByDstId(String dstId);

    /**
     * 批量获取数表元数据
     *
     * @param dstIds 数表 ID 列表
     * @return DatasheetMetaDTO
     * @author Chambers
     * @date 2021/7/7
     */
    List<DatasheetMetaDTO> findMetaDtoByDstIds(@Param("list") List<String> dstIds);

    /**
     * 创建
     *
     * @param userId   用户ID
     * @param dstId    数表ID
     * @param metaData 元数据
     * @author Chambers
     * @date 2019/12/19
     */
    void create(Long userId, String dstId, String metaData);

    /**
     * 编辑
     *
     * @param userId 用户ID
     * @param dstId  数表ID
     * @param meta   请求参数
     * @author Benson Cheung
     * @date 2019/09/20 16:17
     */
    void edit(Long userId, String dstId, MetaOpRo meta);

    /**
     * 检查数表指定视图是否存在
     *
     * @param dstId  数表ID
     * @param viewId 视图ID
     * @author Chambers
     * @date 2020/11/10
     */
    void checkViewIfExist(String dstId, String viewId);

    /**
     * 获取数据表源信息
     * @param dstId 数表ID
     * @return DatasheetSnapshot
     * @author Shawn Deng
     * @date 2021/4/2 17:25
     */
    DatasheetSnapshot getMetaByDstId(String dstId);

    /**
     * 检查字段是否存在表内
     * @param dstId 数表ID
     * @param fieldId 字段ID
     * @author Shawn Deng
     * @date 2021/4/2 17:25
     */
    void checkFieldIfExist(String dstId, String fieldId);

    /**
     * 根据数表ID查询和字段名称查询字段属性
     *
     * @param dstId 数表ID
     * @param fieldName 字段名称
     * @return 字段属性
     * @author zoe zheng
     * @date 2021/8/3 5:49 下午
     */
    JSONObject getFieldPropertyByDstIdAndFieldName(String dstId, String fieldName);
}
