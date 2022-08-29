package com.vikadata.api.modular.user.strategey;

import com.vikadata.api.modular.user.User;

/**
 * <p>
 * 创建SocialUser策略接口类
 * </p>
 *
 * @author Pengap
 * @date 2021/8/23 11:18:59
 */
public interface CreateSocialUserStrategey {

    /**
     * 创建用户
     * @param user 用户
     * @return user id
     * @author Shawn Deng
     * @date 2021/7/7 15:01
     */
    Long createSocialUser(User user);

}
