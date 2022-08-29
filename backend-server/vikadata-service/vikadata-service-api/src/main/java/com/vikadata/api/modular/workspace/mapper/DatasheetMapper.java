package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.DatasheetEntity;

/**
 * <p>
 * 数据表格表 Mapper 接口
 * </p>
 *
 * @author Benson Cheung
 * @since 2019-09-20
 */
public interface DatasheetMapper extends BaseMapper<DatasheetEntity> {

    /**
     * 批量插入
     *
     * @param entities 实体
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/3/26 18:18
     */
    int insertBatch(@Param("entities") List<DatasheetEntity> entities);

    /**
     * 根据nodeId更新数表名称
     *
     * @param userId  用户ID
     * @param dstId   节点ID
     * @param dstName 数表名称
     * @return 执行结果数
     * @author Benson Cheung
     * @date 2020/04/02
     */
    int updateNameByDstId(@Param("userId") Long userId, @Param("dstId") String dstId, @Param("dstName") String dstName);

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
    int updateIsDeletedByNodeIds(@Param("userId") Long userId, @Param("nodeIds") Collection<String> nodeIds, @Param("isDel") Boolean isDel);

    /**
     * 查询节点数表信息
     *
     * @param nodeId 数表节点ID
     * @return DatasheetEntity
     * @author 胡海平(Humphrey Hu)
     * @date 2022-01-20 11:20:12
     * */
    DatasheetEntity selectByDstId(@Param("nodeId") String nodeId);
}
