package com.vikadata.social.service.dingtalk.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.social.service.dingtalk.entity.DingTalkOpenSyncBizDataMediumEntity;

/**
 * <p> 
 * 第三方集成 - 中优先级推送接口
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/25 15:29
 */
public interface IDingTalkOpenSyncBizDataMediumService extends IService<DingTalkOpenSyncBizDataMediumEntity> {
    /**
     *
     * @param subscribeId 订阅ID
     * @param corpId 授权企业ID
     * @param bizId 类目ID
     * @param bizData 类目数据
     * @author zoe zheng
     * @date 2021/10/25 15:32
     */
    Boolean create(String subscribeId, String corpId, Integer bizType, String bizId, String bizData);
}
