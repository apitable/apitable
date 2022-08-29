package com.vikadata.social.service.dingtalk.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.social.service.dingtalk.entity.SocialTenantUserEntity;

/**
 * <p>
 * 第三方平台集成-企业租户用户 Mapper
 * </p>
 * @author zoe zheng
 * @date 2021/8/30 2:44 下午
 */
public interface SocialTenantUserMapper extends BaseMapper<SocialTenantUserEntity> {
    /**
     * 快速批量插入
     *
     * @param entities 列表
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2019/12/17 20:34
     */
    int insertBatch(@Param("entities") List<SocialTenantUserEntity> entities);

    /**
     * 查询租户下的用户是否存在
     *
     * @param tenantId 租户ID
     * @param openId   租户下用户标识
     * @return 总数
     * @author zoe zheng
     * @date 2021/9/18 13:31
     */
    Integer selectCountByTenantIdAndOpenId(@Param("tenantId") String tenantId, @Param("openId") String openId);

    /**
     * 删除租户下用户
     *
     * @param tenantId 租户标识
     * @param openId   租户下用户标识
     * @return 执行结果
     * @author zoe zheng
     * @date 2021/9/22 13:49
     */
    int deleteByTenantIdAndOpenId(@Param("tenantId") String tenantId, @Param("openId") String openId);
}
