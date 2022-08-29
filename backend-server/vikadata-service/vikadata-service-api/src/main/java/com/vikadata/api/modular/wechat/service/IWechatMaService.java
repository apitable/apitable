package com.vikadata.api.modular.wechat.service;

import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.binarywang.wx.miniapp.bean.WxMaPhoneNumberInfo;
import com.vikadata.api.model.vo.wechat.LoginResultVo;
import com.vikadata.api.model.vo.wechat.WechatInfoVo;

/**
 * <p>
 * 微信小程序 服务类
 * </p>
 *
 * @author Chambers
 * @since 2020-02-22
 */
public interface IWechatMaService {

    /**
     * 获取登陆结果
     *
     * @param userId         用户ID
     * @param wechatMemberId 微信会员ID
     * @return vo
     * @author Chambers
     * @date 2020/2/22
     */
    LoginResultVo getLoginResult(Long userId, Long wechatMemberId);

    /**
     * 微信小程序登录
     *
     * @param result 微信登录返回结果
     * @return vo
     * @author Chambers
     * @date 2020/2/24
     */
    LoginResultVo login(WxMaJscode2SessionResult result);

    /**
     * 使用微信手机号的登录处理
     *
     * @param wechatMemberId 微信会员id
     * @param phoneNoInfo    手机号信息
     * @return vo
     * @author Chambers
     * @date 2020/2/24
     */
    LoginResultVo signIn(Long wechatMemberId, WxMaPhoneNumberInfo phoneNoInfo);

    /**
     * 获取用户信息
     *
     * @param userId 用户ID
     * @return vo
     * @author Chambers
     * @date 2020/3/27
     */
    WechatInfoVo getUserInfo(Long userId);
}
