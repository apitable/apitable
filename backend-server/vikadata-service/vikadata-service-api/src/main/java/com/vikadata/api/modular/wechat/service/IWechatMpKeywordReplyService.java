package com.vikadata.api.modular.wechat.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.WechatKeywordReplyEntity;

import java.util.List;

/**
 * <p>
 * 微信公众号关键词自动回复 服务接口
 * </p>
 *
 * @author BensonCheung
 * @date 2020/8/17
 */
public interface IWechatMpKeywordReplyService extends IService<WechatKeywordReplyEntity> {

    /**
     * 根据关键词查询自动回复列表
     *
     * @param appId   appId
     * @param keyword 关键词
     * @return 关联此回复列表
     * @author BensonCheung
     * @date 2020/8/17
     */
    List<WechatKeywordReplyEntity> findRepliesByKeyword(String appId, String keyword);
}
