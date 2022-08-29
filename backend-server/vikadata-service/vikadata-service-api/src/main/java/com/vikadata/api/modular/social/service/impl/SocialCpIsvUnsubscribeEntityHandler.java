package com.vikadata.api.modular.social.service.impl;

import java.util.Collections;
import java.util.Objects;
import java.util.Optional;

import javax.annotation.Resource;

import cn.hutool.core.lang.Assert;
import cn.hutool.json.JSONUtil;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;

import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvEntityHandler;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpUserBindService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商成员取消关注处理
 * </p>
 * @author 刘斌华
 * @date 2022-01-20 17:33:58
 */
@Service
public class SocialCpIsvUnsubscribeEntityHandler implements ISocialCpIsvEntityHandler, InitializingBean {

    @Resource
    private ApplicationContext applicationContext;

    @Resource
    private IMemberService memberService;

    @Resource
    private ISocialCpUserBindService socialCpUserBindService;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISpaceService spaceService;

    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Override
    public WeComIsvMessageType type() {

        return WeComIsvMessageType.UNSUBSCRIBE;

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException {

        String suiteId = unprocessed.getSuiteId();
        String authCorpId = unprocessed.getAuthCorpId();

        // 1 获取企业已有的租户信息
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        Assert.notNull(socialTenantEntity, () -> new IllegalStateException(String
                .format("没有找到可用的租户信息，tenantId：%s，appId：%s", authCorpId, suiteId)));
        // 2 获取绑定的空间站
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        Assert.notBlank(spaceId, () -> new IllegalStateException(String
                .format("没有找到对应的空间站信息，tenantId：%s，appId：%s", authCorpId, suiteId)));
        // 3 获取成员信息
        WxCpTpXmlMessage wxMessage = JSONUtil.toBean(unprocessed.getMessage(), WxCpTpXmlMessage.class);
        MemberEntity memberEntity = Optional.ofNullable(socialCpUserBindService
                .getUserIdByTenantIdAndAppIdAndCpUserId(authCorpId, suiteId, wxMessage.getFromUserName()))
                .map(userId -> memberService.getByUserIdAndSpaceId(userId, spaceId))
                .orElse(null);
        if (Objects.isNull(memberEntity)) {
            // 3.1 成员信息不存在，直接忽略
            // 将消息改成处理成功状态
            unprocessed.setProcessStatus(SocialCpIsvMessageProcessStatus.SUCCESS.getValue());
            socialCpIsvMessageService.updateById(unprocessed);

            return true;
        }
        // 4 移除成员
        memberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(memberEntity.getId()), false);
        // 5 如果是管理员，则清除空间站的管理员
        if (Boolean.TRUE.equals(memberEntity.getIsAdmin())) {
            spaceService.removeMainAdmin(spaceId);
        }
        // 6 将消息改成处理成功状态
        unprocessed.setProcessStatus(SocialCpIsvMessageProcessStatus.SUCCESS.getValue());
        socialCpIsvMessageService.updateById(unprocessed);

        return true;

    }

    @Override
    public void afterPropertiesSet() {

        this.socialCpIsvMessageService = applicationContext.getBean(ISocialCpIsvMessageService.class);

    }

}
