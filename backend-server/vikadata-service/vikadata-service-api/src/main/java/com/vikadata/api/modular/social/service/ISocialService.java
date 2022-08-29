package com.vikadata.api.modular.social.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import com.vikadata.api.modular.social.model.DingTalkContactDTO;
import com.vikadata.api.modular.social.model.FeishuTenantDetailVO;
import com.vikadata.api.modular.social.model.TenantDetailVO;
import com.vikadata.api.modular.social.model.TenantDetailVO.Space;

/**
 * 第三方集成 服务接口
 *
 * @author Shawn Deng
 * @date 2020-12-02 18:04:09
 */
public interface ISocialService {

    /**
     * 用户激活空间成员
     * @param userId 用户ID
     * @param spaceId 空间ID
     * @param openId openId
     * @param mobile 手机号
     */
    Long activeSpaceByMobile(Long userId, String spaceId, String openId, String mobile);

    /**
     * 校验用户是否是租户的管理员
     * @param userId 用户ID
     * @param tenantKey 租户标识
     * @author Shawn Deng
     * @date 2021/7/21 14:53
     */
    void checkUserIfInTenant(Long userId, String appId, String tenantKey);

    /**
     * 获取企业的空间信息
     * @param appId 应用标识
     * @param tenantKey 飞书企业标识
     * @return FeishuTenantInfoVO
     * @author Shawn Deng
     * @date 2021/7/21 14:40
     */
    FeishuTenantDetailVO getFeishuTenantInfo(String appId, String tenantKey);

    /**
     * 获取企业的空间信息
     *
     * @param tenantKey 企业标识
     * @param appId 应用标识
     * @return TenantDetailVO
     * @author zoe zheng
     * @date 2021/9/23 14:10
     */
    TenantDetailVO getTenantInfo(String tenantKey, String appId);

    /**
     * 获取企业的空间信息
     *
     * @param tenantKey 企业标识
     * @param appId 应用标识
     * @return List<Space>
     * @author zoe zheng
     * @date 2021/9/23 14:10
     */
    List<Space> getTenantBindSpaceInfo(String tenantKey, String appId);

    /**
     * 更换主管理员
     * @param spaceId 空间ID
     * @param memberId 成员ID
     * @author Shawn Deng
     * @date 2021/8/18 20:50
     */
    void changeMainAdmin(String spaceId, Long memberId);

    /**
     * 获取空间绑定集成的禁止资源
     *
     * @param spaceId 空间ID
     * @return 空间权限资源禁止列表
     * @author Shawn Deng
     * @date 2020/12/18 12:21
     */
    List<String> getSocialDisableRoleGroupCode(String spaceId);

    /**
     * 钉钉绑定空间以及同步通讯录
     *
     * @param agentId 企业应用唯一标识
     * @param spaceId    空间ID
     * @param operatorOpenId 操作用户的openId
     * @param contact 应用可见范围
     * @return 绑定成功的钉钉用户ID
     * @author zoe zheng
     * @date 2021/5/11 11:51 上午
     */
    Set<String> connectDingTalkAgentAppContact(String spaceId, String agentId, String operatorOpenId,
            LinkedHashMap<Long, DingTalkContactDTO> contact);
}
