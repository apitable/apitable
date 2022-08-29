package com.vikadata.social.service.dingtalk.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.social.service.dingtalk.entity.DingTalkOpenSyncBizDataEntity;
import com.vikadata.social.service.dingtalk.model.dto.SocialTenantBizDataDto;

/**
 * <p> 
 * 第三方集成 - 高优先级推送接口
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/25 15:29
 */
public interface IDingTalkOpenSyncBizDataService extends IService<DingTalkOpenSyncBizDataEntity> {
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

    /**
     * 获取事件数据
     * @param subscribeId 订阅ID
     * @param bizType 类目类型
     * @param corpId 租户ID
     * @return List<SocialTenantBizDataDto>
     * @author zoe zheng
     * @date 2022/6/1 11:30
     */
    List<SocialTenantBizDataDto> getBySubscribeIdAndBizTypes(String subscribeId, String corpId, List<Integer> bizType);
}
