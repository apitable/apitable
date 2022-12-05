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
}
