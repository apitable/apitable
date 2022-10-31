package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialUserBindEntity;

/**
 * Third party platform integration - user binding mapper
 */
public interface SocialUserBindMapper extends BaseMapper<SocialUserBindEntity> {

    /**
     * Query user ID
     *
     * @param unionId Third party user ID
     * @return User ID
     */
    Long selectUserIdByUnionId(@Param("unionId") String unionId);

    /**
     * Query user ID
     *
     * @param userId User ID
     * @return User ID
     */
    List<String> selectUnionIdByUserId(@Param("userId") Long userId);

    /**
     * Query by Union Id
     *
     * @param unionIds Third party platform user ID
     * @return SocialUserBindEntity List
     */
    List<SocialUserBindEntity> selectByUnionIds(@Param("unionIds") List<String> unionIds);

    /**
     * Batch Delete Records
     *
     * @param unionIds Third party platform user ID
     * @return Number of execution results
     */
    int deleteByUnionIds(@Param("unionIds") List<String> unionIds);

    /**
     * Physical deletion based on user ID
     *
     * @param userId
     * @return Number of execution results
     */
    int deleteByUserId(@Param("userId") Long userId);

    /**
     * Get the user's open ID in the enterprise
     *
     * @param appId Application ID
     * @param tenantId Tenant ID
     * @param userId User
     * @return open id
     */
    String selectOpenIdByTenantIdAndUserId(@Param("appId") String appId, @Param("tenantId") String tenantId, @Param("userId") Long userId);
}
