package com.vikadata.api.user.strategey;

import com.vikadata.api.user.model.User;

/**
 * <p>
 * Create Social User Policy Interface Class
 * </p>
 */
public interface CreateSocialUserStrategey {

    /**
     * Create User
     *
     * @param user User
     * @return user id
     */
    Long createSocialUser(User user);

}
