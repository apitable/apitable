package com.vikadata.scheduler.space.mapper.workspace;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.scheduler.space.model.NodeDto;

/**
 * <p>
 * Node Mapper
 * </p>
 */
public interface NodeMapper {

    /**
     * Get node id list
     *
     * @param spaceIds space id list
     * @param type     node type（no require）
     * @return node id list
     */
    List<String> selectNodeIdBySpaceIds(@Param("list") List<String> spaceIds, @Param("type") Integer type);

    /**
     * Get node information
     * After specifying the changeset table id, the data changed and was not deleted
     *
     * @param changesetId changeset table id
     * @return NodeDto List
     */
    List<NodeDto> findChangedNodeIds(@Param("changesetId") Long changesetId);

}
