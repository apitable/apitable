package com.vikadata.api.modular.user.service;

import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.binarywang.wx.miniapp.bean.WxMaPhoneNumberInfo;
import cn.binarywang.wx.miniapp.bean.WxMaUserInfo;
import me.chanjar.weixin.mp.bean.result.WxMpUser;

import com.vikadata.social.qq.model.TencentUserInfo;
import com.vikadata.social.qq.model.WebAppAuthInfo;

/**
 * <p>
 * 第三方系统-会员信息表 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/10
 */
public interface IThirdPartyMemberService {

    /**
     * 获取 unionId
     *
     * @param appId  appId
     * @param openId openId
     * @param type   类型
     * @return unionId
     * @author Chambers
     * @date 2021/12/8
     */
    String getUnionIdByCondition(String appId, String openId, Integer type);

    /**
     * 获取第三方昵称
     *
     * @param appId   appId
     * @param unionId unionId
     * @param type    类型
     * @return nickName
     * @author Chambers
     * @date 2021/12/8
     */
    String getNickNameByCondition(String appId, String unionId, Integer type);

    /**
     * 创建微信公众号会员
     *
     * @param appId    appId
     * @param wxMpUser 微信用户信息
     * @author Chambers
     * @date 2020/8/10
     */
    void createMpMember(String appId, WxMpUser wxMpUser);

    /**
     * 创建微信小程序会员
     *
     * @param appId  appId
     * @param result 微信登录返回结果
     * @return ID
     * @author Chambers
     * @date 2020/2/22
     */
    Long createMiniAppMember(String appId, WxMaJscode2SessionResult result);

    /**
     * 更新微信小程序会员信息
     *
     * @param id          微信会员ID
     * @param result      微信授权返回结果
     * @param phoneNoInfo 手机号信息
     * @param userInfo    用户信息
     * @author Chambers
     * @date 2020/2/22
     */
    void editMiniAppMember(Long id, WxMaJscode2SessionResult result, WxMaPhoneNumberInfo phoneNoInfo, WxMaUserInfo userInfo);

    /**
     * 创建 QQ 会员
     *
     * @param authInfo 授权信息
     * @param userInfo 用户信息
     * @author Chambers
     * @date 2020/8/10
     */
    void createTencentMember(WebAppAuthInfo authInfo, TencentUserInfo userInfo);
}
