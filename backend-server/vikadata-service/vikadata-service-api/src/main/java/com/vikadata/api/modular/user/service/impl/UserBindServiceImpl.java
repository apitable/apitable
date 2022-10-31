package com.vikadata.api.modular.user.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.modular.user.mapper.UserBindMapper;
import com.vikadata.api.modular.user.service.IUserBindService;
import com.vikadata.entity.UserBindEntity;

import org.springframework.stereotype.Service;

@Service
public class UserBindServiceImpl extends ServiceImpl<UserBindMapper, UserBindEntity> implements IUserBindService {

    @Override
    public Long getUserIdByExternalKey(String externalKey) {
        return baseMapper.selectByExternalKey(externalKey);
    }

    @Override
    public void create(Long userId, String externalKey) {
        UserBindEntity userBindEntity = new UserBindEntity();
        userBindEntity.setUserId(userId);
        userBindEntity.setExternalKey(externalKey);
        save(userBindEntity);
    }
}
