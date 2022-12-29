package com.vikadata.social.service.dingtalk.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.social.service.dingtalk.entity.DingTalkOpenSyncBizDataMediumEntity;

public interface IDingTalkOpenSyncBizDataMediumService extends IService<DingTalkOpenSyncBizDataMediumEntity> {
    
    Boolean create(String subscribeId, String corpId, Integer bizType, String bizId, String bizData);
}
