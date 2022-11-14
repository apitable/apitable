package com.vikadata.api.enterprise.wechat.service;

import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.binarywang.wx.miniapp.bean.WxMaPhoneNumberInfo;

import com.vikadata.api.enterprise.wechat.vo.LoginResultVo;
import com.vikadata.api.enterprise.wechat.vo.WechatInfoVo;

/**
 * <p>
 * WeChat Ma Service
 * </p>
 */
public interface IWechatMaService {

    /**
     * Get login result
     */
    LoginResultVo getLoginResult(Long userId, Long wechatMemberId);

    /**
     * Ma login
     */
    LoginResultVo login(WxMaJscode2SessionResult result);

    /**
     * Sign in by wechat phone
     */
    LoginResultVo signIn(Long wechatMemberId, WxMaPhoneNumberInfo phoneNoInfo);

    /**
     * Get user info
     */
    WechatInfoVo getUserInfo(Long userId);
}
