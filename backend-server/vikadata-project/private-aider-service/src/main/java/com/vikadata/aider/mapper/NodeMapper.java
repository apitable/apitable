package com.vikadata.aider.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.aider.model.NodeInfo;

/**
 * <p>
 * NodeMapper
 * </p>
 *
 * @author Chambers
 * @date 2022/1/28
 */
public interface NodeMapper {

    /**
     * 查询创建人为NULL的节点信息
     *
     * @return NodeInfo List
     * */
    List<NodeInfo> selectNullCreateByNodeInfo();

    /**
     * 查询父节点信息
     *
     * @return NodeInfo
     * */
    NodeInfo selectParentNodeInfo(@Param("spaceId") String spaceId, @Param("id") Long id);

    /**
     * 将子节点的创建人信息更新为父节点的信息
     * */
    int updateChildNodeInfo(@Param("parentNodeCreatedBy") Long parentNodeCreatedBy, @Param("childIds") List<Long> childIds);

    /**
     * 将修改人为空的节点的updated_by值更新为created_by
     * */
    int updatedNullCreatedByNode();
}
