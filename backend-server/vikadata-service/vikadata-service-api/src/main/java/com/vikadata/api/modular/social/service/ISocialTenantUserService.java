package com.vikadata.api.modular.social.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialTenantUserEntity;

/**
 * 第三方平台集成-企业租户用户 服务接口
 *
 * @author Shawn Deng
 * @date 2020-12-18 00:27:36
 */
public interface ISocialTenantUserService extends IService<SocialTenantUserEntity> {

    /**
     * 创建
     *
     * @param tenantId 租户标识
     * @param openId   租户用户标识
     * @param unionId  租户用户唯一标识
     * @author Shawn Deng
     * @date 2020/12/14 23:36
     */
    void create(String appId, String tenantId, String openId, String unionId);

    /**
     * 批量插入
     *
     * @param entities 实体列表
     * @author Shawn Deng
     * @date 2020/12/14 23:36
     */
    void createBatch(List<SocialTenantUserEntity> entities);

    /**
     * 获取租户下的所有用户openId
     *
     * @param tenantId 租户标识
     * @return openIds
     * @author Shawn Deng
     * @date 2020/12/22 15:36
     */
    List<String> getOpenIdsByTenantId(String appId, String tenantId);

    /**
     * 获取租户下用户绑定的openId
     *
     * @param tenantId 租户标识
     * @param userId   用户ID
     * @return unionId
     * @author Shawn Deng
     * @date 2020/12/22 15:36
     */
    String getOpenIdByTenantIdAndUserId(String appId, String tenantId, Long userId);

    /**
     * 获取租户下的openId
     * @param appId 应用ID
     * @param tenantId 租户ID
     * @return openId list
     */
    List<String> getOpenIdsByAppIdAndTenantId(String appId, String tenantId);

    /**
     * 根据openId 获取 unionId
     * @param tenantId 租户ID
     * @param openId 租户下用户标识
     * @return UnionId
     * @author Shawn Deng
     * @date 2020/12/22 12:56
     */
    String getUnionIdByOpenId(String appId, String tenantId, String openId);

    /**
     * 租户的用户是否存在
     *
     * @param tenantId 租户标识
     * @param openId   租户下用户标识
     * @return TRUE | FALSE
     * @author Shawn Deng
     * @date 2020/12/22 12:14
     */
    boolean isTenantUserOpenIdExist(String appId, String tenantId, String openId);

    /**
     * 租户的用户是否存在
     *
     * @param tenantId 租户标识
     * @param openId   租户下用户标识
     * @param unionId 开发者账号下用户唯一标识
     * @return TRUE | FALSE
     * @author zoe zheng
     * @date 2022/2/15 15:55
     */
    boolean isTenantUserUnionIdExist(String appId, String tenantId, String openId, String unionId);

    /**
     * 删除租户的用户记录
     *
     * @param tenantId 租户标识
     * @author Shawn Deng
     * @date 2020/12/15 10:29
     */
    void deleteByTenantId(String appId, String tenantId);

    /**
     * 删除租户的用户记录
     *
     * @param openIds 租户下用户标识
     * @author Shawn Deng
     * @date 2020/12/15 10:29
     */
    void deleteByFeishuOpenIds(String appId, String tenantId, List<String> openIds);

    /**
     * 移除租户用户记录
     *
     * @param tenantId 租户标识
     * @param openId   租户下用户标识
     * @author Shawn Deng
     * @date 2020/12/22 12:48
     */
    void deleteByTenantIdAndOpenId(String appId, String tenantId, String openId);

    /**
     * 删除钉钉应用绑定的用户
     *
     * @param tenantId 租户标识
     * @param openIds 应用下用户的唯一标识
     * @author zoe zheng
     * @date 2021/5/20 4:21 下午
     */
    void deleteByTenantIdAndOpenIds(String appId, String tenantId, List<String> openIds);

    /**
     * 根据应用ID和租户ID删除
     * @param appId 应用id
     * @param tenantId 租户ID
     */
    void deleteByAppIdAndTenantId(String appId, String tenantId);

    /**
     * 根据unionId查询用户ID
     *
     * @param unionId 钉钉平台租户用户唯一标识
     * @return 用户ID
     * @author zoe zheng
     * @date 2021/9/13 3:49 下午
     */
    Long getUserIdByDingTalkUnionId(String unionId);

    /**
     * 通过tenantId获取openId->unionIds的map
     * @param tenantId 租户ID
     * @return Map<String, List < String>>
     * @author zoe zheng
     * @date 2022/2/15 14:37
     */
    Map<String, List<String>> getOpenIdMapByTenantId(String appId, String tenantId);
}
