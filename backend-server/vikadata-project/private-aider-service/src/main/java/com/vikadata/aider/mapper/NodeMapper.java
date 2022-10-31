package com.vikadata.aider.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.aider.model.NodeInfo;

public interface NodeMapper {

    /**
     * select node info which no creator
     *
     * @return NodeInfo List
     * */
    List<NodeInfo> selectNullCreateByNodeInfo();

    /**
     * select parent node info
     *
     * @return NodeInfo
     * */
    NodeInfo selectParentNodeInfo(@Param("spaceId") String spaceId, @Param("id") Long id);

    /**
     * update the parent node creator value as same sa the node creator
     * */
    int updateChildNodeInfo(@Param("parentNodeCreatedBy") Long parentNodeCreatedBy, @Param("childIds") List<Long> childIds);

    /**
     * if node's creator is null, update the value as same as updater.
     * */
    int updatedNullCreatedByNode();
}
