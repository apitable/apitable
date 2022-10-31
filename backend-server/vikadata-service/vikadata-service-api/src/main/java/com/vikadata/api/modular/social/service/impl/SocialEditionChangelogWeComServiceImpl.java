package com.vikadata.api.modular.social.service.impl;

import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.enums.exception.SocialException;
import com.vikadata.api.modular.social.mapper.SocialEditionChangelogWeComMapper;
import com.vikadata.api.modular.social.service.ISocialEditionChangelogWeComService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.SocialEditionChangelogWecomEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.WxCpIsvServiceImpl;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo.EditionInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider application version change information
 * </p>
 */
@Service
public class SocialEditionChangelogWeComServiceImpl extends ServiceImpl<SocialEditionChangelogWeComMapper, SocialEditionChangelogWecomEntity>
        implements ISocialEditionChangelogWeComService {

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private ISocialTenantService socialTenantService;

    @Override
    public SocialEditionChangelogWecomEntity createChangelog(String suiteId, String paidCorpId) throws WxErrorException {
        return createChangelog(suiteId, paidCorpId, true);
    }

    @Override
    public SocialEditionChangelogWecomEntity createChangelog(String suiteId, String paidCorpId, boolean fetchEditionInfo)
            throws WxErrorException {
        SocialEditionChangelogWecomEntity entity = SocialEditionChangelogWecomEntity.builder()
                .suiteId(suiteId)
                .paidCorpId(paidCorpId)
                .build();
        if (fetchEditionInfo) {
            // Need to get the enterprise application version information
            SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, paidCorpId);
            ExceptionUtil.isNotNull(socialTenantEntity, SocialException.TENANT_NOT_EXIST);
            ExceptionUtil.isTrue(socialTenantEntity.getStatus(), SocialException.TENANT_DISABLED);
            // Get and fill in the application version information
            WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
            WxCpIsvAuthInfo wxCpIsvAuthInfo = wxCpIsvService.getAuthInfo(paidCorpId, socialTenantEntity.getPermanentCode());
            WxCpIsvAuthInfo.EditionInfo.Agent agent = Optional.ofNullable(wxCpIsvAuthInfo.getEditionInfo())
                    .map(WxCpIsvAuthInfo.EditionInfo::getAgents)
                    .filter(agents -> !agents.isEmpty())
                    .map(agents -> agents.get(0))
                    .orElse(null);
            entity.setEditionInfo(JSONUtil.toJsonStr(agent));
        }
        save(entity);
        return entity;
    }

    @Override
    public SocialEditionChangelogWecomEntity createChangelog(String suiteId, String paidCorpId, EditionInfo.Agent editionInfoAgent) {
        SocialEditionChangelogWecomEntity entity = SocialEditionChangelogWecomEntity.builder()
                .suiteId(suiteId)
                .paidCorpId(paidCorpId)
                .editionInfo(JSONUtil.toJsonStr(editionInfoAgent))
                .build();
        save(entity);
        return entity;
    }

    @Override
    public SocialEditionChangelogWecomEntity getLastChangeLog(String suiteId, String paidCorpId) {
        return getBaseMapper().selectLastChangeLog(suiteId, paidCorpId);
    }

}
