package com.vikadata.social.service.dingtalk.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.social.service.dingtalk.entity.DingTalkOpenSyncBizDataEntity;
import com.vikadata.social.service.dingtalk.model.dto.SocialTenantBizDataDto;

/**
 * Third-party platform integration - high-priority push data mapper interface
 */
public interface DingTalkOpenSyncBizDataMapper extends BaseMapper<DingTalkOpenSyncBizDataEntity> {

    /**
     * Get event data
     * @param subscribeId Subscription ID
     * @param bizTypes category type
     * @param corpId Tenant ID
     * @return List<SocialTenantBizDataDto>
     */
    List<SocialTenantBizDataDto> selectBySubscribeIdAndCorpIdAndBizTypes(@Param("subscribeId") String subscribeId,
            @Param("corpId") String corpId, @Param("bizTypes") List<Integer> bizTypes);
}
