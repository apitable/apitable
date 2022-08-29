package com.vikadata.api.modular.wechat.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.WechatAuthorizationEntity;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 微信-授权方信息表 Mapper 接口
 * </p>
 *
 * @author Benson Cheung
 * @since 2020-02-25
 */
public interface AuthorizationMapper extends BaseMapper<WechatAuthorizationEntity> {

    /**
     * 查询授权账号APPID是否存在
     *
     * @param authorizerAppid 授权方账号APPID
     * @return 数量
     * @author BensonCheung
     * @date 2020/07/28
     */
    Integer countByAuthorizerAppid(@Param("authorizerAppid") String authorizerAppid);

    /**
     * 查询授权方账号APPID查询详情
     *
     * @param authorizerAppid 授权方账号APPID
     * @return 授权方账号信息
     * @author BensonCheung
     * @date 2020/07/28
     */
    WechatAuthorizationEntity findByAuthorizerAppid(@Param("authorizerAppid") String authorizerAppid);
}
