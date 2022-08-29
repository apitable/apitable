package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.node.NodeRelDTO;
import com.vikadata.entity.NodeRelEntity;

/**
 * <p>
 * 工作台-节点关联表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/11/10
 */
public interface NodeRelMapper extends BaseMapper<NodeRelEntity> {

    /**
     * 批量查询主节点ID
     *
     * @param relNodeIds 关联节点ID 列表
     * @return MainNodeIds
     * @author Chambers
     * @date 2021/1/13
     */
    List<String> selectMainNodeIdsByRelNodeIds(@Param("list") List<String> relNodeIds);

    /**
     * 查询实体
     *
     * @param relNodeId 关联节点ID
     * @return entity
     * @author Chambers
     * @date 2020/11/12
     */
    NodeRelEntity selectByRelNodeId(@Param("relNodeId") String relNodeId);

    /**
     * 查询实体列表
     *
     * @param relNodeIds 关联节点ID 列表
     * @return entities
     * @author Chambers
     * @date 2020/11/17
     */
    List<NodeRelEntity> selectByRelNodeIds(@Param("list") Collection<String> relNodeIds);

    /**
     * 节点关联表DTO
     *
     * @param mainNodeId 主节点ID
     * @return BaseNodeInfo
     * @author Chambers
     * @date 2020/11/12
     */
    List<NodeRelDTO> selectNodeRelDTO(@Param("mainNodeId") String mainNodeId);

    /**
     * 新增节点关联
     *
     * @param entities 实体列表
     * @return 执行结果数
     * @author Chambers
     * @date 2020/11/10
     */
    int insertBatch(@Param("entities") List<NodeRelEntity> entities);
}
