package com.vikadata.api.cache.service;

import java.util.List;

/**
 * <p>
 * 用户在空间内最近提及的成员记录缓存 服务类
 * </p>
 *
 * @author Chambers
 * @date 2020/5/27
 */
public interface UserSpaceRemindRecordService {

    /**
     * 获取用户指定空间最近提及的组织单元ID列表
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 成员ID列表
     * @author Chambers
     * @date 2020/5/27
     */
    List<Long> getRemindUnitIds(Long userId, String spaceId);

    /**
     * 刷新缓存
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @param unitIds 组织单元ID列表
     * @author Chambers
     * @date 2020/5/27
     */
    void refresh(Long userId, String spaceId, List<Long> unitIds);
}
