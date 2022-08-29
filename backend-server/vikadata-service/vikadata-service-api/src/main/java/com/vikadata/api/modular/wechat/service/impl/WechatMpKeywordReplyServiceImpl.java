package com.vikadata.api.modular.wechat.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.api.modular.wechat.mapper.WechatKeywordReplyMapper;
import com.vikadata.api.modular.wechat.service.IWechatMpKeywordReplyService;
import com.vikadata.entity.WechatKeywordReplyEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * <p>
 * 微信公众号关键词自动回复 服务接口
 * </p>
 *
 * @author BensonCheung
 * @date 2020/8/17
 */
@Slf4j
@Service
public class WechatMpKeywordReplyServiceImpl extends ServiceImpl<WechatKeywordReplyMapper, WechatKeywordReplyEntity> implements IWechatMpKeywordReplyService {

    @Resource
    private WechatKeywordReplyMapper keywordReplyMapper;

    @Override
    public List<WechatKeywordReplyEntity> findRepliesByKeyword(String appId, String keyword) {
        log.info("查询关键词回复：{}", keyword);
        return keywordReplyMapper.findRepliesByKeyword(appId, keyword);
    }

}
