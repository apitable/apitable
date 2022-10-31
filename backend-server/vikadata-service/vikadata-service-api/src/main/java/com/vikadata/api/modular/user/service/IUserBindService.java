package com.vikadata.api.modular.user.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.UserBindEntity;

public interface IUserBindService extends IService<UserBindEntity> {

    /**
     * get user id from external key
     * @param externalKey external key from outside system
     * @return user id
     */
    Long getUserIdByExternalKey(String externalKey);

    /**
     * create user bind
     * @param userId user ID
     * @param externalKey external key from outside system
     */
    void create(Long userId, String externalKey);
}
