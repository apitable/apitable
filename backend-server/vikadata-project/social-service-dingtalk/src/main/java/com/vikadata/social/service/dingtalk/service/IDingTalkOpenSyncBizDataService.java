package com.vikadata.social.service.dingtalk.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.social.service.dingtalk.entity.DingTalkOpenSyncBizDataEntity;
import com.vikadata.social.service.dingtalk.model.dto.SocialTenantBizDataDto;

public interface IDingTalkOpenSyncBizDataService extends IService<DingTalkOpenSyncBizDataEntity> {
    
    Boolean create(String subscribeId, String corpId, Integer bizType, String bizId, String bizData);

    List<SocialTenantBizDataDto> getBySubscribeIdAndBizTypes(String subscribeId, String corpId, List<Integer> bizType);
}
