package com.vikadata.scheduler.space.mapper.workspace;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.scheduler.space.model.NodeDto;

/**
 * <p>
 * 工作台-节点表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/3/12
 */
public interface NodeMapper {

    /**
     * 获取节点ID列表
     *
     * @param spaceIds 空间ID列表
     * @param type     节点类型（非必须）
     * @return 节点ID列表
     * @author Chambers
     * @date 2020/3/12
     */
    List<String> selectNodeIdBySpaceIds(@Param("list") List<String> spaceIds, @Param("type") Integer type);

    /**
     * 逻辑删除节点
     *
     * @param spaceIds 空间ID列表
     * @return 修改数
     * @author Chambers
     * @date 2020/3/12
     */
    int updateIsDeletedBySpaceIds(@Param("list") List<String> spaceIds);

    /**
     * 获取指定变更集ID 之后，发生数据变化且未被删除的数表节点ID
     *
     * @param changesetId changeset 表ID
     * @return 节点ID列表
     * @author Chambers
     * @date 2020/4/16
     */
    List<NodeDto> findChangedNodeIds(@Param("changesetId") Long changesetId);

    /**
     * 查询包含附件的回收站节点信息
     *
     * @param deadline 回收的截止时间
     * @param spaceId  空间ID（非必须）
     * @return NodeDto
     * @author Chambers
     * @date 2020/9/21
     */
    List<NodeDto> selectRubbishNodeDto(@Param("deadline") String deadline, @Param("spaceId") String spaceId);

    /**
     * 查询节点所在的空间ID
     *
     * @param nodeId 节点ID
     * @return 空间ID
     * @author Shawn Deng
     * @date 2020/10/16 16:48
     */
    String selectSpaceIdByNodeId(@Param("nodeId") String nodeId);
}
