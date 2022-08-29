package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.datasheet.DatasheetMetaDTO;
import com.vikadata.api.model.vo.datasheet.DatasheetMetaVo;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot;
import com.vikadata.entity.DatasheetMetaEntity;

/**
 * <p>
 * 数表元数据表 Mapper 接口
 * </p>
 *
 * @author Benson Cheung
 * @since 2019-09-23
 */
public interface DatasheetMetaMapper extends BaseMapper<DatasheetMetaEntity> {

    /**
     * 批量插入
     *
     * @param entities 实体
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/3/26 18:18
     */
    int insertBatch(@Param("entities") List<DatasheetMetaEntity> entities);

    /**
     * 根据数表ID查询数表数据源
     * @param dstId 数表ID
     * @return DatasheetSnapshot
     */
    DatasheetSnapshot selectByDstId(@Param("dstId") String dstId);

    /**
     * 根据dstId获取metaData数据
     *
     * @param dstId 数表ID
     * @return DatasheetMetaVo 数表Meta信息
     * @author Benson Cheung
     * @date 2020/06/18
     */
    @Deprecated
    DatasheetMetaVo selectByNodeId(@Param("dstId") String dstId);

    /**
     * 获取meta列表
     *
     * @param dstIdList 数表ID列表
     * @return meta列表
     * @author Chambers
     * @date 2020/4/17
     */
    List<DatasheetMetaDTO> selectDtoByDstIds(@Param("list") List<String> dstIdList);

    /**
     * 新增元数据
     *
     * @param entity 实体
     * @return 执行结果数
     * @author Chambers
     * @date 2020/11/10
     */
    int insertMeta(@Param("entity") DatasheetMetaEntity entity);

    /**
     * 根据dstId更新meta
     *
     * @param userId 用户ID
     * @param dstId  数表ID
     * @param meta   表头meta信息
     * @return 修改数
     * @author Benson Cheung
     * @date 2020/6/18
     */
    int updateByDstId(@Param("userId") Long userId, @Param("meta") String meta, @Param("dstId") String dstId);

    /**
     * 更改逻辑删除状态
     *
     * @param userId  用户ID
     * @param nodeIds 节点ID 列表
     * @param isDel   逻辑删除状态
     * @return 执行结果数
     * @author Chambers
     * @date 2020/8/20
     */
    int updateIsDeletedByNodeId(@Param("userId") Long userId, @Param("nodeIds") Collection<String> nodeIds, @Param("isDel") Boolean isDel);

    /**
     * 统计元数据包含关键词的节点数量
     *
     * @param nodeIds 节点ID 列表
     * @param keyword 搜索关键词
     * @return count
     * @author Chambers
     * @date 2020/10/13
     */
    Integer countByMetaData(@Param("nodeIds") Collection<String> nodeIds, @Param("keyword") String keyword);
}
