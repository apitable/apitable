package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.finance.BundleState;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.entity.BundleEntity;

/**
 * 订阅捆绑包 服务
 * @author Shawn Deng
 * @date 2022-05-16 21:52:39
 */
public interface IBundleService extends IService<BundleEntity> {

    /**
     * 创建订阅集合包
     * @param entity 实体
     */
    void create(BundleEntity entity);

    /**
     * 批量创建订阅集合包
     * @param entities 实体
     */
    void createBatch(List<BundleEntity> entities);

    /**
     * 获取订阅集合包
     * @param bundleId 订阅捆绑包标识
     * @return bundle entity
     */
    BundleEntity getByBundleId(String bundleId);

    /**
     * 获取空间订阅集合
     * @param spaceId 空间ID
     * @return bundle entity list
     */
    List<BundleEntity> getBySpaceId(String spaceId);

    /**
     * 批量获取空间订阅集合
     * @param spaceIds 空间ID列表
     * @return bundle list
     */
    List<BundleEntity> getBySpaceIds(List<String> spaceIds);

    /**
     * 获取空间站激活状态的订阅
     * 只包含激活状态
     * @param spaceId 空间ID
     * @return bundle
     */
    Bundle getActivatedBundleBySpaceId(String spaceId);

    /**
     * get possible active bundle by space id
     * @param spaceId space id
     * @return active bundle
     */
    Bundle getPossibleBundleBySpaceId(String spaceId);

    /**
     * 获取空间站的所有订阅捆绑包
     * 包含所有状态的订阅捆绑包
     * @param spaceId 空间ID
     * @return bundle List
     */
    List<Bundle> getBundlesBySpaceId(String spaceId);

    /**
     * 批量获取空间站激活状态的订阅
     * 只包含激活状态
     * @param spaceIds 空间ID列表
     * @return bundle List
     */
    List<Bundle> getActivatedBundlesBySpaceId(List<String> spaceIds);

    /**
     * 批量获取空间站的所有订阅捆绑包
     * 包含所有状态的订阅捆绑包
     * @param spaceIds 空间ID列表
     * @return bundle list
     */
    List<Bundle> getBundlesBySpaceIds(List<String> spaceIds);

    /**
     * 根据订阅捆绑包标识更新数据库
     * @param bundleId 订阅捆绑包标识
     * @param updatedBundle 更新对象
     */
    void updateByBundleId(String bundleId, BundleEntity updatedBundle);

    /**
     * 批量获取空间订阅集合
     * @param spaceId 空间ID
     * @param state 集合状态
     * @return List<FinanceBundleEntity>
     * @author zoe zheng
     * @date 2022/5/26 11:42
     */
    List<BundleEntity> getBySpaceIdAndState(String spaceId, BundleState state);

    /**
     * 批量删除
     * @param bundleId 订阅捆绑包标识
     * @author zoe zheng
     * @date 2022/6/7 10:19
     */
    void removeBatchByBundleIds(List<String> bundleId);

    /**
     * restore by bundle ids
     * @param bundleIds bundle id
     */
    void restoreByBundleIds(List<String> bundleIds);
}
