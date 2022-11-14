package com.vikadata.api.workspace.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.vikadata.api.workspace.enums.ResourceType;
import com.vikadata.api.workspace.dto.NodeDescParseDTO;

public interface IResourceMetaService {

    /**
     * batch copy resource metadata
     *
     * @param userId user id
     * @param originResourceId Original resource node ID list
     * @param newResourceMap   Original node ID-newly created node ID MAP
     */
    void copyBatch(Long userId, Collection<String> originResourceId, Map<String, String> newResourceMap);

    /**
     * @param userId user id
     * @param resourceId    resourceId
     * @param resourceType  resourceType
     * @param metaData      metaData
     */
    void create(Long userId, String resourceId, Integer resourceType, String metaData);

    /**
     * copy resource metadata configuration
     *
     * @param userId user id
     * @param spaceId space id
     * @param originRscId   source resource id
     * @param destRscId     target resource id
     * @param type          resource type
     */
    void copyResourceMeta(Long userId, String spaceId, String originRscId, String destRscId, ResourceType type);

    /**
     * batch replication resource metadata configuration
     *
     * @param userId user id
     * @param spaceId space id
     * @param originRscIds  source resource id list
     * @param newNodeMap    Source node ID-newly created node ID MAP
     * @param type          resource type
     */
    void batchCopyResourceMeta(Long userId, String spaceId, List<String> originRscIds, Map<String, String> newNodeMap, ResourceType type);

    /**
     * parse form description
     *
     * @param formId formId
     * @return NodeDescParseDTO
     */
    NodeDescParseDTO parseFormDescByFormId(String formId);
}
