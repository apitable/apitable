package com.vikadata.api.modular.social.service;

import java.util.HashMap;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialUserBindEntity;

/**
 * 第三方平台集成-用户绑定 服务接口
 *
 * @author Shawn Deng
 * @date 2020-12-08 16:21:26
 */
public interface ISocialUserBindService extends IService<SocialUserBindEntity> {

    /**
     * 创建用户绑定第三方账户
     *
     * @param userId  用户ID
     * @param unionId 第三方用户标识
     * @author Shawn Deng
     * @date 2020/12/14 15:20
     */
    void create(Long userId, String unionId);

    /**
     * 查询用户绑定的unionId
     * @param userId 用户标识
     * @return unionIds
     */
    List<String> getUnionIdsByUserId(Long userId);

    /**
     * 获取绑定的用户ID
     *
     * @param unionId 第三方平台用户标识
     * @return 用户ID
     * @author Shawn Deng
     * @date 2020/12/14 15:21
     */
    Long getUserIdByUnionId(String unionId);

    /**
     * 获取租户的对应open_id
     * @param appId 应用标识
     * @param tenantId 租户标识
     * @param userId 用户ID
     * @return open id
     * @author Shawn Deng
     * @date 2021/8/16 23:40
     */
    String getOpenIdByTenantIdAndUserId(String appId, String tenantId, Long userId);

    /**
     * 根据UnionId获取实体
     *
     * @param unionIds 第三方平台用户标识
     * @return SocialUserBindEntity List
     * @author Shawn Deng
     * @date 2020/12/22 16:18
     */
    List<SocialUserBindEntity> getEntitiesByUnionId(List<String> unionIds);

    /**
     * 批量删除
     *
     * @param unionIds 第三方平台用户标识
     * @author Shawn Deng
     * @date 2020/12/22 00:23
     */
    void deleteBatchByUnionId(List<String> unionIds);

    /**
     * 根据用户ID物理删除用户第三方信息.
     * @param userId
     */
    void deleteByUserId(Long userId);

    /**
     * 检查unionId是否绑定
     *
     * @param unionId 第三方平台用户唯一标识
     * @param userId 用户维格账号ID
     * @return boolean
     * @author zoe zheng
     * @date 2021/5/20 5:47 下午
     */
    Boolean isUnionIdBind(Long userId, String unionId);

    /**
     * 根据unionId获取用户名称
     *
     * @param unionIds 第三方平台用户标识
     * @return unionId->userName
     * @author zoe zheng
     * @date 2021/11/11 15:10
     */
    HashMap<String, String> getUserNameByUnionIds(List<String> unionIds);
}
