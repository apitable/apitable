package com.vikadata.api.modular.user.service;


import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.config.security.Auth0UserProfile;
import com.vikadata.api.model.ro.user.DtBindOpRo;
import com.vikadata.api.model.ro.user.UserOpRo;
import com.vikadata.api.model.vo.user.UserInfoVo;
import com.vikadata.api.modular.user.SocialUser;
import com.vikadata.api.modular.user.User;
import com.vikadata.api.modular.user.model.UserLangDTO;
import com.vikadata.define.dtos.UserInPausedDto;
import com.vikadata.entity.UserEntity;

/**
 * <p>
 * 用户表 服务类
 * </p>
 *
 * @author Benson Cheung
 * @since 2019-09-16
 */
public interface IUserService extends IService<UserEntity> {

    /**
     * 根据手机号获取用户ID
     * @param mobile 手机号
     * @return User ID
     * @author Chambers
     * @date 2019/11/28
     */
    Long getUserIdByMobile(String mobile);

    /**
     * 根据邮箱地址获取用户ID
     * @param email 邮箱地址
     * @return 用户ID
     */
    Long getUserIdByEmail(String email);

    /**
     * 判断手机号是否已注册
     *
     * @param code   区号
     * @param mobile 手机号
     * @return true/false
     * @author Chambers
     * @date 2019/11/28
     */
    boolean checkByCodeAndMobile(String code, String mobile);

    /**
     * 判断邮箱是否已被绑定
     *
     * @param email 邮箱
     * @return true/false
     * @author Chambers
     * @date 2019/11/28
     */
    boolean checkByEmail(String email);

    /**
     * 获取用户
     *
     * @param code          区号
     * @param mobilePhone   手机号
     * @return UserEntity
     * @author Chambers
     * @date 2021/6/16
     */
    UserEntity getByCodeAndMobilePhone(String code, String mobilePhone);

    /**
     * 获取用户
     *
     * @param code          区号
     * @param mobilePhones  手机号列表
     * @return UserEntity
     * @author Chambers
     * @date 2022/6/25
     */
    List<UserEntity> getByCodeAndMobilePhones(String code, Collection<String> mobilePhones);

    /**
     * 获取用户
     *
     * @param email 邮箱
     * @return UserEntity
     * @author Chambers
     * @date 2021/6/16
     */
    UserEntity getByEmail(String email);

    /**
     * 批量获取用户
     *
     * @param emails 邮箱列表
     * @return UserEntity
     * @author Chambers
     * @date 2021/6/16
     */
    List<UserEntity> getByEmails(Collection<String> emails);

    /**
     * 外部系统连接创建用户
     * @param nickName 昵称
     * @param avatar 头像
     * @param email 邮件
     * @param externalId 外部系统ID
     * @param remark 备注
     * @return user id
     * @author Shawn Deng
     * @date 2021/7/1 16:54
     */
    Long createByExternalSystem(String externalId, String nickName, String avatar, String email, String remark);

    /**
     * 创建用户
     * @param user 用户
     * @return user id
     * @author Shawn Deng 
     * @date 2021/7/7 15:01
     */
    Long createSocialUser(User user);

    /**
     * 创建飞书用户
     * @param user 用户
     * @return user id
     * @author Shawn Deng
     * @date 2021/7/7 15:01
     */
    Long createUser(SocialUser user);

    /**
     * create user
     * @param user user entity
     * @return user id
     */
    boolean saveUser(UserEntity user);

    /**
     * create user by auth0 user profile
     * @param userProfile auth0 user profile
     * @return user id
     */
    Long createUserByAuth0IfNotExist(Auth0UserProfile userProfile);

    /**
     * create user by auth0 user model
     * @param user user info from auth0 model
     * @return user id
     */
    Long createUserByAuth0IfNotExist(com.auth0.json.mgmt.users.User user);

    /**
     * 创建企业微信第三方关联用户
     *
     * @param user 用户信息
     * @return 维格用户 ID
     * @author 刘斌华
     * @date 2022-03-02 16:57:44
     */
    Long createWeComUser(SocialUser user);

    /**
     * 激活指定空间
     * @param userId 用户ID
     * @param spaceId 空间ID
     * @param openId 开放唯一ID
     */
    void activeTenantSpace(Long userId, String spaceId, String openId);

    /**
     * 创建帐号
     *
     * @param areaCode  手机区号
     * @param mobile 手机号
     * @param nickName   第三方用户昵称
     * @param avatar 第三方用户头像
     * @param email  邮箱地址
     * @param spaceName 新建空间站的名字
     * @return userId
     * @author Chambers
     * @date 2020/2/24
     */
    Long create(String areaCode, String mobile, String nickName, String avatar, String email, String spaceName);

    /**
     * 手机号方式创建帐号
     *
     * @param areaCode  手机区号
     * @param mobile 手机号
     * @param nickName   第三方用户昵称
     * @param avatar 第三方用户头像
     * @return user
     * @author Chambers
     * @date 2020/2/24
     */
    UserEntity createUserByMobilePhone(String areaCode, String mobile, String nickName, String avatar);

    /**
     * 邮箱方式创建账号
     * @param email 邮箱地址
     * @return UserEntity
     */
    UserEntity createUserByEmail(String email);

    /**
     * 批量创建马甲号
     * @author Shawn Deng
     * @date 2021/4/1 11:45
     */
    void createUsersByCli();

    /**
     * 创建用户
     * 由CLI工具发起的创建操作，创建用户马甲
     *
     * @param username 用户名（邮箱）
     * @param password 密码
     * @param phone 密码
     * @return user entity
     */
    UserEntity createUserByCli(String username, String password, String phone);

    /**
     * initial new space for new user
     * @param user user entity
     */
    void initialDefaultSpaceForUser(UserEntity user);

    /**
     * active space if user has be invited to another space
     * @param userId user id
     * @param memberIds member id list
     */
    void activeInvitationSpace(Long userId, List<Long> memberIds);

    /**
     * 查询用户是否绑定邮箱
     *
     * @param userId 用户ID
     * @return 是否存在
     * @author Shawn Deng
     * @date 2019/12/30 11:44
     */
    boolean checkUserHasBindEmail(Long userId);

    /**
     * 绑定关联成员邮箱
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @param email   邮箱
     * @author Shawn Deng
     * @date 2019/12/30 17:58
     */
    void bindMemberByEmail(Long userId, String spaceId, String email);

    /**
     * 用户绑定邮箱
     *
     * @param userId 用户ID
     * @param email  邮箱
     * @author Shawn Deng
     * @date 2019/12/30 15:32
     */
    void updateEmailByUserId(Long userId, String email);

    /**
     * 用户解绑邮箱
     *
     * @param userId 用户ID
     * @author Pengap
     * @date 2021/10/20 18:24:09
     */
    void unbindEmailByUserId(Long userId);

    /**
     * 用户修改手机号
     *
     * @param userId 用户ID
     * @param code   区号
     * @param mobile 手机号
     * @author Chambers
     * @date 2020/8/28
     */
    void updateMobileByUserId(Long userId, String code, String mobile);

    /**
     * 用户解绑手机号
     *
     * @param userId    用户Id
     * @author Pengap
     * @date 2021/10/20 18:24:09
     */
    void unbindMobileByUserId(Long userId);

    /**
     * 更新用户登录时间
     *
     * @param userId 用户ID
     * @author Shawn Deng
     * @date 2019/12/25 12:01
     */
    void updateLoginTime(Long userId);

    /**
     * 编辑用户信息
     *
     * @param userId 用户ID
     * @param param  操作参数
     */
    void edit(Long userId, UserOpRo param);

    /**
     * 修改密码
     *
     * @param userId   用户ID
     * @param password 设置的新密码
     */
    void updatePwd(Long userId, String password);

    /**
     * 获取当前用户信息和空间内容
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @param filter  是否过滤空间相关信息
     * @return UserInfoVo
     * @author Chambers
     * @date 2019/11/28
     */
    UserInfoVo getCurrentUserInfo(Long userId, String spaceId, Boolean filter);

    /**
     * 关联钉钉
     *
     * @param opRo 请求参数
     * @author Chambers
     * @date 2019/12/5
     */
    void bindDingTalk(DtBindOpRo opRo);

    /**
     * 关闭用户的多端会话
     *
     * @param userId   用户ID
     * @param isRetain 是否保留当前会话
     * @author Chambers
     * @date 2019/12/17
     */
    void closeMultiSession(Long userId, boolean isRetain);

    /**
     * 解除第三方绑定
     *
     * @param userId    用户ID
     * @param type      第三方类型
     * @author Chambers
     * @date 2021/1/29
     */
    void unbind(Long userId, Integer type);

    /**
     * 获取UUID
     *
     * @param userId    用户ID
     * @return uuid
     * @author Chambers
     * @date 2021/12/7
     */
    String getUuidByUserId(Long userId);

    /**
     * 注销用户账号，进入冷静期。
     * 注销冷静期账号在用户使用角度完全等同于已注销账号，共享链接、邀请链接、个人邀请码等均不可用.
     *
     * @param user 用户
     * */
    void applyForClosingAccount(UserEntity user);

    /**
     * 撤销账号注销，仅适用于注销冷静期账号
     * @param user 用户实体类
     */
    void cancelClosingAccount(UserEntity user);

    /**
     * 正式关闭账号.
     * @param user 用户实体类
     */
    void closeAccount(UserEntity user);

    /**
     * 获取冷静期账号，不包含已注销账号.
     * @param userIds 用户ID列表
     * @return UserInPausedDto List
     */
    List<UserInPausedDto> getPausedUserDtos(List<Long> userIds);

    /**
     * <p>
     *     根据邮件列表获取邮件用户id和用户设置的系统语言。<br/>
     *     数据库中没有email对应记录行，结果列表中依旧存在改email，对应的语言为"浏览器语言"。<br/>
     *     emails最好不包括不存在的email。
     * </p>
     * <br/>
     * <p>
     *     注意：异步方法调用可能异常
     * </p>
     *
     * @param emails 邮件列表
     * @return 带用户id、系统语言、邮件的列表
     * @author Pengap
     * @date 2022/3/22 20:39:32
     */
    List<UserLangDTO> getLangByEmails(List<String> emails);

    /**
     * <p>
     *     根据邮件列表获取邮件用户id和用户设置的系统语言。<br/>
     *     数据库中没有email对应记录行，结果列表中依旧存在改email，对应的语言为expectedLang。<br/>
     *     emails最好不包括不存在的email。
     * </p>
     *
     * @param expectedLang 用户没有设置系统语言，期待的邮件发送语言
     * @param emails 邮件列表
     * @return 带用户id、系统语言、邮件的列表
     * @author wuyitao
     * @date 2022/01/24
     */
    List<UserLangDTO> getLangByEmails(String expectedLang, List<String> emails);

    /**
     * <p>
     *     根据邮件获取系统语言。<br/>
     *     数据库中没有email对应记录行，对应的语言为expectedLang。<br/>
     * </p>
     *
     * @param expectedLang 用户没有设置系统语言，期待的邮件发送语言
     * @param email 邮件
     * @return 系统语言
     * @author wuyitao
     * @date 2022/01/26
     */
    String getLangByEmail(String expectedLang, String email);

    /**
     * 根据userId获取用户语言
     *
     * @param userIds 用户ID
     * @param defaultLocale 缺省语言
     * @return List<UserLangDTO>
     * @author zoe zheng
     * @date 2022/2/24 11:44
     */
    List<UserLangDTO> getLangAndEmailByIds(List<Long> userIds, String defaultLocale);

    void useInviteCodeReward(Long userId, String inviteCode);

    /**
     * 根据uuid获取用户userId
     *
     * @param uuid 用户uuid
     * @return 用户userId
     * @author zoe zheng
     * @date 2022/4/6 17:04
     */
    Long getUserIdByUuid(String uuid);

    /**
     * 根据用户名查询用户
     *
     * @param areaCode  区号（非必须，用户名为手机号时使用）
     * @param username  用户名（邮箱或者手机号）
     * @return UserEntity
     * @author Chambers
     * @date 2022/7/15
     */
    UserEntity getByUsername(String areaCode, String username);
}
