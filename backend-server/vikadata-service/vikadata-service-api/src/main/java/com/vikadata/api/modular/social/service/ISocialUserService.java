package com.vikadata.api.modular.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.cache.bean.SocialAuthInfo;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.dto.user.UserRegisterResult;
import com.vikadata.entity.SocialUserEntity;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;

/**
 * 第三方平台集成-用户 服务接口
 *
 * @author Shawn Deng
 * @date 2020-12-07 11:22:19
 */
public interface ISocialUserService extends IService<SocialUserEntity> {

    /**
     * 批量插入
     *
     * @param entities 实体列表
     * @author Shawn Deng
     * @date 2020/12/14 23:36
     */
    void createBatch(List<SocialUserEntity> entities);

    /**
     * 记录第三方平台用户
     *
     * @param unionId      第三方平台用户标识
     * @param platformType 第三方平台类型
     * @author Shawn Deng
     * @date 2020/12/14 15:34
     */
    void create(String unionId, SocialPlatformType platformType);

    /**
     * 获取第三方平台用户信息
     *
     * @param unionId 第三方平台用户标识
     * @return SocialUserEntity
     * @author Shawn Deng
     * @date 2020/12/15 11:45
     */
    SocialUserEntity getByUnionId(String unionId);

    /**
     * 批量删除
     *
     * @param unionIds 第三方平台用户标识
     * @author Shawn Deng
     * @date 2020/12/22 00:23
     */
    void deleteBatchByUnionId(List<String> unionIds);

    /**
     * 第三方平台应用，用户通过平台绑定的手机号，自动注册维格账号
     *
     * @param authInfo 注册需要的数据
     * @return 默认的空间名称
     * @author zoe zheng
     * @date 2021/5/8 1:41 下午
     */
    Long signUpByMobile(SocialAuthInfo authInfo);


    /**
     * 钉钉应用的用户登录
     *
     * @param userDetail 钉钉应用获取到的用户详细信息
     * @param agentId 授权应用唯一ID
     * @return 用户的userId
     * @author zoe zheng
     * @date 2021/5/8 2:13 下午
     */
    UserRegisterResult dingTalkUserLogin(DingTalkUserDetail userDetail, String agentId);

    /**
     * 成员激活
     *
     * @param userId 用户ID
     * @param spaceId 空间ID
     * @param userDetail 第三方用户详细信息
     * @author zoe zheng
     * @date 2021/5/27 5:34 下午
     */
    void dingTalkActiveMember(Long userId, String spaceId, DingTalkUserDetail userDetail);
}
