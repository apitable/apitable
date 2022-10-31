package com.vikadata.api.modular.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.UserBindEntity;

public interface UserBindMapper extends BaseMapper<UserBindEntity> {

    /**
     * query by external key
     * @param externalKey external key from outside system
     * @return userId
     */
    Long selectByExternalKey(@Param("externalKey") String externalKey);
}
