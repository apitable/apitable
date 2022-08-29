package com.vikadata.api.modular.internal.service;

import java.util.List;

import com.vikadata.api.model.vo.node.DatasheetPermissionView;

/**
 * <p>
 * Permission Service
 * </p>
 *
 * @author Chambers
 * @date 2021/12/14
 */
public interface IPermissionService {

    /**
     * 获取数表权限视图信息
     *
     * @param userId    用户ID
     * @param nodeIds   节点ID列表
     * @param shareId   分享ID
     * @return DatasheetPermissionViews
     * @author Chambers
     * @date 2021/12/14
     */
    List<DatasheetPermissionView> getDatasheetPermissionView(Long userId, List<String> nodeIds, String shareId);

    /**
     * 检查成员不是空间的理员
     * @param spaceId 空间站ID
     * @param memberId 成员ID
     * @param resourceGroupCodes 权限
     * @return boolean
     * @author zoe zheng
     * @date 2022/4/6 17:36
     */
    boolean checkMemberIsAdmin(String spaceId, Long memberId, List<String> resourceGroupCodes);
}
