package com.vikadata.api.enterprise.social.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.SocialUserEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Third party platform integration - user mapper
 */
public interface SocialUserMapper extends BaseMapper<SocialUserEntity> {

    /**
     * Quick Bulk Insert
     *
     * @param entities Member List
     * @return Number of execution results
     */
    int insertBatch(@Param("entities") List<SocialUserEntity> entities);

    /**
     * Query according to OPEN ID
     *
     * @param unionId Third party platform user ID
     * @return SocialUserEntity
     */
    SocialUserEntity selectByUnionId(@Param("unionId") String unionId);

    /**
     * Batch Delete Records
     *
     * @param unionIds Third party platform user ID
     * @return Number of execution results
     */
    int deleteByUnionIds(@Param("unionIds") List<String> unionIds);
}
