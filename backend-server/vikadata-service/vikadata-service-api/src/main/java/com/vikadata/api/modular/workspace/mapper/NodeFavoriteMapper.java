package com.vikadata.api.modular.workspace.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.NodeFavoriteEntity;

public interface NodeFavoriteMapper extends BaseMapper<NodeFavoriteEntity> {

    /**
     * the favorite node ids in an orderly query
     *
     * @param memberId member id
     * @return node ids
     */
    List<String> selectOrderNodeIdByMemberId(@Param("memberId") Long memberId);

    /**
     * @param memberId member id
     * @return node ids
     */
    List<String> selectNodeIdByMemberId(@Param("memberId") Long memberId);

    /**
     * @param memberId member id
     * @param nodeId node id
     * @return count
     */
    Integer countByMemberIdAndNodeId(@Param("memberId") Long memberId, @Param("nodeId") String nodeId);

    /**
     * @param memberId member id
     * @param nodeId node id
     * @return preNodeId
     */
    String selectPreNodeIdByMemberIdAndNodeId(@Param("memberId") Long memberId, @Param("nodeId") String nodeId);

    /**
     * change pre node id to other value
     *
     * @param newPreNodeId    new pre node id
     * @param originPreNodeId origin pre node id
     * @param memberId member id
     * @return affected rows
     */
    int updatePreNodeIdByMemberIdAndPreNodeId(@Param("newPreNodeId") String newPreNodeId, @Param("originPreNodeId") String originPreNodeId, @Param("memberId") Long memberId);

    /**
     * change the node's pre node id
     *
     * @param preNodeId new pre node id
     * @param memberId member id
     * @param nodeId node id
     * @return affected rows
     */
    int updatePreNodeIdByMemberIdAndNodeId(@Param("preNodeId") String preNodeId, @Param("memberId") Long memberId, @Param("nodeId") String nodeId);

    /**
     * cancel favorite（hard delete）
     *
     * @param memberId member id
     * @param nodeId node id
     * @return affected rows
     */
    int deleteByMemberIdAndNodeId(@Param("memberId") Long memberId, @Param("nodeId") String nodeId);
}
