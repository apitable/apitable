package com.vikadata.api.enterprise.wechat.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.WechatAuthorizationEntity;

/**
 * <p>
 * Authorization Mapper
 * </p>
 */
public interface AuthorizationMapper extends BaseMapper<WechatAuthorizationEntity> {

    /**
     * Query count
     */
    Integer countByAuthorizerAppid(@Param("authorizerAppid") String authorizerAppid);

    /**
     * Query entity
     */
    WechatAuthorizationEntity findByAuthorizerAppid(@Param("authorizerAppid") String authorizerAppid);
}
