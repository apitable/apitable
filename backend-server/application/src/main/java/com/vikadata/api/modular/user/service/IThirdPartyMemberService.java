package com.vikadata.api.modular.user.service;

import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.binarywang.wx.miniapp.bean.WxMaPhoneNumberInfo;
import cn.binarywang.wx.miniapp.bean.WxMaUserInfo;
import me.chanjar.weixin.mp.bean.result.WxMpUser;

import com.vikadata.social.qq.model.TencentUserInfo;
import com.vikadata.social.qq.model.WebAppAuthInfo;

/**
 * <p>
 * Third party system - member information table service interface
 * </p>
 */
public interface IThirdPartyMemberService {

    /**
     * Get unionId
     *
     * @param appId  appId
     * @param openId openId
     * @param type   Type
     * @return unionId
     */
    String getUnionIdByCondition(String appId, String openId, Integer type);

    /**
     * Get third-party nicknames
     *
     * @param appId   appId
     * @param unionId unionId
     * @param type    Type
     * @return nickName
     */
    String getNickNameByCondition(String appId, String unionId, Integer type);

    /**
     * Create a WeChat official account member
     *
     * @param appId    appId
     * @param wxMpUser WeChat User information
     */
    void createMpMember(String appId, WxMpUser wxMpUser);

    /**
     * Create WeChat applet member
     *
     * @param appId  appId
     * @param result WeChat Login Return Results
     * @return ID
     */
    Long createMiniAppMember(String appId, WxMaJscode2SessionResult result);

    /**
     * Update WeChat applet member information
     *
     * @param id          WeChat member ID
     * @param result      WeChat Authorization return result
     * @param phoneNoInfo Mobile number information
     * @param userInfo    User information
     */
    void editMiniAppMember(Long id, WxMaJscode2SessionResult result, WxMaPhoneNumberInfo phoneNoInfo, WxMaUserInfo userInfo);

    /**
     * Create QQ member
     *
     * @param authInfo Authorization information
     * @param userInfo User information
     */
    void createTencentMember(WebAppAuthInfo authInfo, TencentUserInfo userInfo);
}
