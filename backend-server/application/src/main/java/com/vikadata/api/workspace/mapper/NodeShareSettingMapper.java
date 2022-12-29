package com.vikadata.api.workspace.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.workspace.dto.NodeShareDTO;
import com.vikadata.entity.NodeShareSettingEntity;

public interface NodeShareSettingMapper extends BaseMapper<NodeShareSettingEntity> {

    /**
     * @param shareId sharing node id
     * @return NodeShareSettingEntity
     */
    NodeShareSettingEntity selectByShareId(@Param("shareId") String shareId);

    /**
     * @param userId user id
     * @return NodeShareSettingEntity
     */
    List<NodeShareSettingEntity> selectEnabledByUserId(@Param("userId") Long userId);

    /**
     * query sharing settings
     *
     * @param nodeId node id
     * @return NodeShareSettingEntity
     */
    NodeShareSettingEntity selectByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param shareId sharing node id
     * @return node id
     */
    String selectNodeIdByShareId(@Param("shareId") String shareId);

    /**
     * find the last editor according to the shareid
     *
     * @param shareId shareId
     * @return last editor
     */
    Long selectUpdatedByByShareId(@Param("shareId") String shareId);

    /**
     * batch prohibition of node sharing
     *
     * @param nodeIds node ids
     * @return affected nodes
     */
    int disableByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * @param shareId sharing node id
     * @return space id
     */
    String selectSpaceIdByShareId(@Param("shareId") String shareId);

    /**
     * @param shareId sharing node id
     * @return space id
     */
    String selectSpaceIdByShareIdIncludeDeleted(@Param("shareId") String shareId);

    /**
     * @param shareId sharing id
     * @return NodeShareDTO
     */
    NodeShareDTO selectDtoByShareId(@Param("shareId") String shareId);

    /**
     *
     * @param nodeIds node ids
     * @return NodeShareDTOs
     */
    List<NodeShareDTO> selectDtoByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * Find the list of shared node IDs last modified by the specified member
     *
     * @param updaters last modifier list
     * @param spaceId space id
     * @return node ids
     */
    List<String> selectNodeIdsByUpdatersAndSpaceId(@Param("updaters") List<Long> updaters, @Param("spaceId") String spaceId);

    /**
     * query nodeId and isEnabled
     *
     * @param shareId share id
     * @return NodeShareSettingEntity
     */
    NodeShareSettingEntity selectNodeIdAndEnabledByShareId(@Param("shareId") String shareId);
}
