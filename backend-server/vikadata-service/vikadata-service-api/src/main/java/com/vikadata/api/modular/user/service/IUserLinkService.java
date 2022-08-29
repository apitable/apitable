package com.vikadata.api.modular.user.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.cache.bean.SocialAuthInfo;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.entity.UserLinkEntity;

/**
 * <p>
 * 基础-帐号关联表 服务类
 * </p>
 *
 * @author Chambers
 * @since 2020-02-22
 */
public interface IUserLinkService extends IService<UserLinkEntity> {

    /**
     * 创建关联
     *
     * @param userId         用户ID
     * @param wechatMemberId 微信会员ID
     * @author Chambers
     * @date 2020/2/25
     */
    void create(Long userId, Long wechatMemberId);

    /**
     * 检查第三方帐号是否关联了其他维格账号
     *
     * @param unionId unionId
     * @param type    第三方关联类型
     * @author Chambers
     * @date 2020/8/26
     */
    void checkThirdPartyLinkOtherUser(String unionId, Integer type);

    /**
     * 创建第三方关联
     *
     * @param userId   用户ID
     * @param authInfo 用户授权信息
     * @param check    检查两者是否关联其他账号
     * @param type     第三方关联类型
     * @author Chambers
     * @date 2020/10/10
     */
    void createUserLink(Long userId, SocialAuthInfo authInfo, boolean check, Integer type);

    /**
     * 创建第三方账号关联
     *
     * @param userId   用户ID
     * @param openId   第三方平台用户ID
     * @param unionId  第三方平台统一ID
     * @param nickName 用户昵称
     * @param type     {@code LinkType} 关联类型
     * @author Shawn Deng
     * @date 2020/12/15 12:44
     */
    void createThirdPartyLink(Long userId, String openId, String unionId, String nickName, int type);

    /**
     * 是否关联第三方账号
     *
     * @param unionId  第三方平台统一ID
     * @param linkType 关联类型
     * @return True | False
     * @author Shawn Deng
     * @date 2020/12/15 12:45
     */
    boolean isUserLink(String unionId, int linkType);

    /**
     * 批量删除
     *
     * @param unionIds 第三方平台用户标识
     * @author Shawn Deng
     * @date 2020/12/22 00:23
     */
    void deleteBatchByUnionId(List<String> unionIds);

    /**
     * 检查用户是否绑定了第三方账号
     *
     * @param userId 用户ID
     * @param unionId 第三方账号唯一ID
     * @param openId 第三方账号ID
     * @return boolean
     * @author zoe zheng
     * @date 2021/5/17 2:35 下午
     */
    Boolean checkUserLinkExists(Long userId, String unionId, String openId);

    /**
     * 批量删除
     *
     * @param openIds 开放应用内的唯一标识
     * @param type 应用用户类型
     * @author zoe zheng
     * @date 2021/5/20 5:03 下午
     */
    void deleteBatchOpenId(List<String> openIds, int type);

    /**
     * 批量删除
     *
     * @param unionId 开放应用内的唯一标识
     * @param openId 开放应用内的唯一标识
     * @param linkType 应用用户类型
     * @author zoe zheng
     * @date 2021/5/20 5:03 下午
     */
    Long getUserIdByUnionIdAndOpenId(String unionId, String openId, LinkType linkType);
}
