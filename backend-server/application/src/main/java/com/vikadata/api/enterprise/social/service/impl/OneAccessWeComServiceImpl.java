package com.vikadata.api.enterprise.social.service.impl;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import me.chanjar.weixin.common.error.WxError;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpOAuth2Service;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.api.impl.WxCpOAuth2ServiceImpl;
import me.chanjar.weixin.cp.api.impl.WxCpServiceImpl;
import me.chanjar.weixin.cp.config.impl.WxCpDefaultConfigImpl;

import com.vikadata.api.shared.config.properties.OneAccessProperties;
import com.vikadata.api.enterprise.social.service.IOneAccessWeComService;
import com.vikadata.core.exception.BusinessException;

import org.springframework.stereotype.Service;

/**
 * OneAccess Wecom service
 */
@Service
public class OneAccessWeComServiceImpl implements IOneAccessWeComService {

    @Resource
    private OneAccessProperties oneAccessProperties;

    private WxCpOAuth2Service wxCpOAuth2Service;

    @PostConstruct
    public void init(){
        if (!oneAccessProperties.isEnabled() || oneAccessProperties.getWeCom() == null) {
            return;
        }
        WxCpDefaultConfigImpl wxCpConfigStorage = new WxCpDefaultConfigImpl();
        wxCpConfigStorage.setBaseApiUrl(oneAccessProperties.getWeCom().getBaseApiUrl());
        wxCpConfigStorage.setCorpId(oneAccessProperties.getWeCom().getCorpid());
        wxCpConfigStorage.setCorpSecret(oneAccessProperties.getWeCom().getSecret());
        wxCpConfigStorage.setAgentId(oneAccessProperties.getWeCom().getAgentId());
        WxCpService wxCpService = new WxCpServiceImpl();
        wxCpService.setWxCpConfigStorage(wxCpConfigStorage);
        wxCpOAuth2Service = new WxCpOAuth2ServiceImpl(wxCpService);
    }


    @Override
    public String getUserIdByOAuth2Code(String code) {
        try {
            return wxCpOAuth2Service.getUserInfo(code).getUserId();
        } catch (WxErrorException e) {
            WxError error = e.getError();
            if (null != error) {
                if (error.getErrorCode() == 40029) {
                    throw new BusinessException("Invalid CODE encoding");
                }
            }
            throw new RuntimeException("Abnormality in Obtaining User Information of  WeCom Application：", e);
        }
    }
}
