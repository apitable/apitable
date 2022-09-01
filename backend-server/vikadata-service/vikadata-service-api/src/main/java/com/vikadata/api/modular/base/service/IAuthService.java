package com.vikadata.api.modular.base.service;

import com.vikadata.api.cache.bean.SocialAuthInfo;
import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.model.dto.user.UserLoginResult;
import com.vikadata.api.model.dto.user.UserRegisterResult;
import com.vikadata.api.model.ro.user.LoginRo;
import com.vikadata.entity.UserEntity;

import java.util.List;

/**
 * <p>
 * 授权相关服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/27 14:33
 */
public interface IAuthService {

    /**
     * 登录请求
     *
     * @param loginRo 请求参数
     * @return Long 用户ID
     * @author Shawn Deng
     * @date 2019/10/27 15:38
     */
    @Deprecated
    Long loginByPassword(LoginRo loginRo);

    /**
     * 密码方式登录，只登录存在的用户，不需要自动注册账号
     * @param loginRo 请求参数
     * @return user id
     */
    Long loginUsingPassword(LoginRo loginRo);

    /**
     * 短信验证码方式登录
     *
     * @param loginRo 请求参数
     * @return result
     * @author Chambers
     * @date 2020/8/26
     */
    @Deprecated
    UserLoginResult loginBySmsCode(LoginRo loginRo);

    /**
     * 手机验证码方式登录，不存在则自动注册账号
     * @param loginRo 请求参数
     * @return user id
     */
    UserLoginResult loginUsingSmsCode(LoginRo loginRo);

    /**
     * 邮箱验证码方式登录
     *
     * @param loginRo 请求参数
     * @return result
     * @author Chambers
     * @date 2020/11/19
     */
    @Deprecated
    UserLoginResult loginByEmailCode(LoginRo loginRo);

    /**
     * 邮箱方式登录，只登录存在的用户，不需要自动注册账号
     * @param loginRo 请求参数
     * @return user id
     */
    UserLoginResult loginUsingEmailCode(LoginRo loginRo);

    /**
     * 邀请码注册新用户
     *
     * @param token      令牌
     * @param inviteCode 邀请码
     * @return result
     * @author Chambers
     * @date 2020/8/27
     */
    @Deprecated
    UserRegisterResult signUpByInviteCode(String token, String inviteCode);

    /**
     * 保存用户授权信息到缓存
     *
     * @param authInfo 用户授权信息
     * @return token
     * @author Chambers
     * @date 2020/8/27
     */
    String saveAuthInfoToCache(SocialAuthInfo authInfo);

    /**
     * 从缓存中获取用户信息
     *
     * @param token 令牌
     * @return UserAuthInfo
     * @author zoe zheng
     * @date 2021/5/10 7:09 下午
     */
    SocialAuthInfo getAuthInfoFromCache(String token);

    /**
     * 官方邀请码奖励
     *
     * @param registerUserId    注册用户ID
     * @author Chambers
     * @date 2021/11/3
     */
    void officialInvitedReward(Long registerUserId);

    /**
     * 个人邀请码奖励
     *
     * @param registerUserId    注册用户ID
     * @param registerUserName  注册用户昵称
     * @param inviteUserId      邀请者用户ID
     * @author Chambers
     * @date 2021/6/30
     */
    void personalInvitedReward(Long registerUserId, String registerUserName, Long inviteUserId);

    /**
     * 邀请新用户附件容量奖励
     *
     * @param userId   成员ID
     * @param userName 成员名称
     * @param spaceId  空间ID
     * @author liuzijing
     * @date 2022/8/19
     */
    void checkSpaceRewardCapacity(Long userId, String userName, String spaceId);
}
