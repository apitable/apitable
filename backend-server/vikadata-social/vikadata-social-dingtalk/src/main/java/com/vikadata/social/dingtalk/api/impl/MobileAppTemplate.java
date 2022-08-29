package com.vikadata.social.dingtalk.api.impl;


import java.util.HashMap;

import com.vikadata.social.dingtalk.AbstractDingTalkOperations;
import com.vikadata.social.dingtalk.DingtalkConfig;
import com.vikadata.social.dingtalk.api.MobileAppOperations;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoRequest;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoResponse;
import com.vikadata.social.dingtalk.model.UserInfo;

import org.springframework.web.client.RestTemplate;

/**
 * <p> 
 * 移动接入应用管理接口实现类
 * </p> 
 * @author zoe zheng 
 * @date 2021/4/19 3:31 下午
 */
public class MobileAppTemplate extends AbstractDingTalkOperations implements MobileAppOperations {
    private static final String SNS_GET_USER_INFO_URL = "/sns/getuserinfo_bycode";

    public MobileAppTemplate(RestTemplate restTemplate, DingtalkConfig dingtalkConfig) {
        super(restTemplate, dingtalkConfig);
    }

    @Override
    public UserInfo getUserInfoByCode(String tmpAuthCode) {
        DingtalkConfig.Mobile mobileApp = getDingtalkConfig().getMobile();
        DingTalkUserInfoRequest request = new DingTalkUserInfoRequest();
        request.setTmpAuthCode(tmpAuthCode);
        String url = buildSignatureUrl(SNS_GET_USER_INFO_URL, mobileApp.getAppId(),
                mobileApp.getAppSecret());
        DingTalkUserInfoResponse response = doPost(url, new HashMap<>(1), request, DingTalkUserInfoResponse.class);
        return response.getUserInfo();
    }
}
