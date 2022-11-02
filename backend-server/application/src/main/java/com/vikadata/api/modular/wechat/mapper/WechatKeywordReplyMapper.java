package com.vikadata.api.modular.wechat.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.WechatKeywordReplyEntity;

/**
 * <p>
 * WeChat Keyword Reply Mapper
 * </p>
 */
public interface WechatKeywordReplyMapper {

    /**
     * Clean up all keyword replies
     */
    Integer deleteKeywordReplies(@Param("appId") String appId);

    /**
     * Batch insert
     */
    Integer insertBatchWechatKeywordReply(@Param("appId") String appId, @Param("list") List<WechatKeywordReplyEntity> list);

    /**
     * Query keyword replies
     */
    List<WechatKeywordReplyEntity> findRepliesByKeyword(@Param("appId") String appId, @Param("keyword") String keyword);
}
