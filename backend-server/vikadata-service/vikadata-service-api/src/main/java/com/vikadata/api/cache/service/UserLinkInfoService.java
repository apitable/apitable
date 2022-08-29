package com.vikadata.api.cache.service;

import com.vikadata.api.cache.bean.UserLinkInfo;

/**
 * <p>
 * 用户关联信息 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/26
 */
public interface UserLinkInfoService {

    /**
     * 获取用户关联信息
     *
     * @param userId 用户ID
     * @return UserLinkInfo
     * @author Chambers
     * @date 2020/8/26
     */
    UserLinkInfo getUserLinkInfo(Long userId);

    /**
     * 删除缓存
     *
     * @param userId 用户ID
     * @author Chambers
     * @date 2020/8/26
     */
    void delete(Long userId);
}
