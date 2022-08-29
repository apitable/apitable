package com.vikadata.social.dingtalk.api;


import com.vikadata.social.dingtalk.model.UserInfo;

/**
 * <p> 
 * 移动接入应用管理接口
 * </p> 
 * @author zoe zheng 
 * @date 2021/4/19 3:31 下午
 */
public interface MobileAppOperations {

    /**
     *  第三方网站登陆：通过临时授权码Code获取用户信息
     *
     * @param tmpAuthCode 临时授权码Code;
     * @return UserInfo
     * @author zoe zheng
     * @date 2021/4/20 6:28 下午
     */
    UserInfo getUserInfoByCode(String tmpAuthCode);
}
