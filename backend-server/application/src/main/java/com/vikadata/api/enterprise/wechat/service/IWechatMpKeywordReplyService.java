package com.vikadata.api.enterprise.wechat.service;

import java.util.List;

import com.vikadata.entity.WechatKeywordReplyEntity;

/**
 * <p>
 * WeChat Mp Keyword Reply Service
 * </p>
 */
public interface IWechatMpKeywordReplyService {

    /**
     * Query the list of auto-responders based on keywords
     */
    List<WechatKeywordReplyEntity> findRepliesByKeyword(String appId, String keyword);
}
