package com.vikadata.api.modular.social.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialCpIsvMessageEntity;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用消息通知信息
 * </p>
 * @author 刘斌华
 * @date 2022-01-05 16:57:57
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
