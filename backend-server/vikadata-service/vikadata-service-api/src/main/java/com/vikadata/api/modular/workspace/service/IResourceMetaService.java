package com.vikadata.api.modular.workspace.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.vikadata.api.enums.workbench.ResourceType;
import com.vikadata.api.model.dto.node.NodeDescParseDTO;

/**
 * <p>
 * 资源元数据 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/12/18
 */
public interface IResourceMetaService {

    /**
     * 批量复制资源元数据
     *
     * @param userId           用户ID
     * @param originResourceId 原资源节点ID 列表
     * @param newResourceMap   原节点ID-新创建节点ID MAP
     * @author Chambers
     * @date 2020/12/18
     */
    void copyBatch(Long userId, Collection<String> originResourceId, Map<String, String> newResourceMap);

    /**
     * 创建资源元数据
     *
     * @param userId        用户ID
     * @param resourceId    资源ID
     * @param resourceType  资源类型
     * @param metaData      元数据
     * @author Chambers
     * @date 2021/1/26
     */
    void create(Long userId, String resourceId, Integer resourceType, String metaData);

    /**
     * 复制资源元数据配置
     *
     * @param userId        用户ID
     * @param spaceId       空间ID
     * @param originRscId   源资源ID
     * @param destRscId     目标资源ID
     * @param type          资源类型
     * @author Chambers
     * @date 2021/1/27
     */
    void copyResourceMeta(Long userId, String spaceId, String originRscId, String destRscId, ResourceType type);

    /**
     * 批量复制资源元数据配置
     *
     * @param userId        用户ID
     * @param spaceId       空间ID
     * @param originRscIds  源资源ID 列表
     * @param newNodeMap    源节点ID-新创建节点ID MAP
     * @param type          资源类型
     * @author Chambers
     * @date 2021/1/27
     */
    void batchCopyResourceMeta(Long userId, String spaceId, List<String> originRscIds, Map<String, String> newNodeMap, ResourceType type);

    /**
     * 解析表单描述
     *
     * @param formId 表单ID
     * @return NodeDescParseDTO
     * @author zoe zheng
     * @date 2022/5/17 18:29
     */
    NodeDescParseDTO parseFormDescByFormId(String formId);
}
