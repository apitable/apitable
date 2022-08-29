package com.vikadata.api.modular.workspace.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.dto.node.NodeDescParseDTO;
import com.vikadata.entity.NodeDescEntity;

/**
 * <p>
 * 工作台-节点描述表 服务类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-03-17
 */
public interface INodeDescService extends IService<NodeDescEntity> {

    /**
     * 编辑节点描述
     *
     * @param nodeId 节点ID
     * @param desc   节点描述
     * @author Chambers
     * @date 2020/3/18
     */
    void edit(String nodeId, String desc);

    /**
     * 复制节点描述
     *
     * @param newNodeMap 原节点ID - 新创建节点ID MAP
     * @author Chambers
     * @date 2020/4/16
     */
    void copyBatch(Map<String, String> newNodeMap);

    /**
     * 批量查询
     *
     * @param nodeIds 节点ID列表
     * @return map
     * @author Chambers
     * @date 2020/5/9
     */
    Map<String, String> getNodeIdToDescMap(List<String> nodeIds);

    /**
     * 批量新增
     *
     * @param nodeDescList 实体列表
     * @author Chambers
     * @date 2020/5/11
     */
    void insertBatch(List<NodeDescEntity> nodeDescList);

    /**
     * 解析节点的描述desc
     *
     * @param destDstId 节点ID
     * @return NodeDescParseDTO
     * @author zoe zheng
     * @date 2020/5/19 3:17 下午
     */
    NodeDescParseDTO parseNodeDescByNodeId(String destDstId);
}
