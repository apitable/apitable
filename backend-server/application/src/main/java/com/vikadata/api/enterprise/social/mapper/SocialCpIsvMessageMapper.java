package com.vikadata.api.enterprise.social.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialCpIsvMessageEntity;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider application message notification information
 * </p>
 */
@Mapper
public interface SocialCpIsvMessageMapper extends BaseMapper<SocialCpIsvMessageEntity> {
    /**
     * update status by id
     * @param id primary key
     * @param status status
     */
    int updateStatusById(@Param("id") Long id, @Param("status") int status);
}
