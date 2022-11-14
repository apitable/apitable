package com.vikadata.api.enterprise.wechat.service.impl;

import java.util.List;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.wechat.mapper.WechatKeywordReplyMapper;
import com.vikadata.api.enterprise.wechat.service.IWechatMpKeywordReplyService;
import com.vikadata.entity.WechatKeywordReplyEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * WeChat Mp Keyword Reply Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class WechatMpKeywordReplyServiceImpl implements IWechatMpKeywordReplyService {

    @Resource
    private WechatKeywordReplyMapper keywordReplyMapper;

    @Override
    public List<WechatKeywordReplyEntity> findRepliesByKeyword(String appId, String keyword) {
        log.info("Query keyword「{}」' reply", keyword);
        return keywordReplyMapper.findRepliesByKeyword(appId, keyword);
    }

}
