package com.vikadata.api.internal.service;

import java.util.List;

import com.vikadata.api.workspace.vo.DatasheetPermissionView;

/**
 * Permission Service
 */
public interface IPermissionService {

    /**
     * Get data table permission view information
     *
     * @param userId    user id
     * @param nodeIds   node id list
     * @param shareId   share id
     * @return DatasheetPermissionViews
     */
    List<DatasheetPermissionView> getDatasheetPermissionView(Long userId, List<String> nodeIds, String shareId);

    /**
     * check that the member is not an admin of the space
     * @param spaceId space id
     * @param memberId member id
     * @param resourceGroupCodes permission
     * @return boolean
     */
    boolean checkMemberIsAdmin(String spaceId, Long memberId, List<String> resourceGroupCodes);
}
