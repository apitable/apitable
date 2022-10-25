package com.vikadata.api.modular.finance.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.modular.space.model.SpaceSubscriptionDto;
import com.vikadata.api.util.billing.model.ProductCategory;
import com.vikadata.entity.SubscriptionEntity;

/**
 * 订阅计费系统-订阅表 Mapper
 * @author Shawn Deng
 * @date 2022-05-13 16:36:42
 */
public interface SubscriptionMapper extends BaseMapper<SubscriptionEntity> {

    /**
     * 根据订阅条目标识
     * @param subscriptionId 订阅条目标识
     * @return subscription entity
     */
    SubscriptionEntity selectBySubscriptionId(@Param("subscriptionId") String subscriptionId);

    /**
     * 根据空间订阅标识查询
     * @param subscriptionIds 订阅标识列表
     * @return bundle list
     */
    List<SubscriptionEntity> selectBySubscriptionIds(@Param("subscriptionIds") List<String> subscriptionIds);

    /**
     * 根据订阅集合查询
     * @param bundleId 订阅集合标识
     * @return subscription entities
     */
    List<SubscriptionEntity> selectByBundleId(@Param("bundleId") String bundleId);

    /**
     * 批量根据订阅集合查询
     * @param bundleIds 订阅集合标识列表
     * @return subscription entities
     */
    List<SubscriptionEntity> selectByBundleIds(@Param("bundleIds") Collection<String> bundleIds);

    /**
     * 批量获取订阅
     *
     * @param bundleId 订阅集合标识
     * @param state 订阅状态
     * @return List<FinanceSubscriptionEntity>
     * @author zoe zheng
     * @date 2022/5/26 13:24
     */
    List<SubscriptionEntity> selectByBundleIdAndState(@Param("bundleId") String bundleId,
            @Param("state") SubscriptionState state);

    /**
     * 批量更新删除状态
     * @param subscriptionIds 订阅条目
     * @param isDeleted 是否删除
     * @return 影响行数
     * @author zoe zheng
     * @date 2022/6/7 10:27
     */
    Integer updateIsDeletedBySubscriptionIds(@Param("subscriptionIds") List<String> subscriptionIds, @Param(
            "isDeleted") boolean isDeleted);

    /**
     * 查询生效中的附件容量信息
     *
     * @param spaceId 空间ID
     * @param page    分页请求对象
     * @param state   订阅状态
     * @return 结果集合
     * @author liuzijing
     * @date 2022/8/15
     */
    IPage<SpaceSubscriptionDto> selectUnExpireCapacityBySpaceId(@Param("spaceId") String spaceId, Page page, @Param("state") SubscriptionState state);

    /**
     * 查询失效的附件容量信息
     *
     * @param spaceId 空间ID
     * @param page    分页请求对象
     * @return 结果集合
     * @author liuzijing
     * @date 2022/8/15
     */
    IPage<SpaceSubscriptionDto> selectExpireCapacityBySpaceId(@Param("spaceId") String spaceId, Page page);

    /**
     * 查询赠送的未过期的附件容量数量
     *
     * @param spaceId 空间ID
     * @param planId  产品方案Id
     * @param state   订阅状态
     * @return 订阅计划数量
     * @author liuzijing
     * @date 2022/8/16
     */
    Integer selectUnExpireGiftCapacityBySpaceId(@Param("spaceId") String spaceId, @Param("planId") String planId, @Param("state") SubscriptionState state);

    /**
     * 查询空间未过期BASE类型订阅
     *
     * @param spaceId 空间Id
     * @param state   订阅状态
     * @param category 类型
     * @author liuzijing
     * @date 2022/8/25
     */
    Integer selectUnExpireBaseProductBySpaceId(@Param("spaceId") String spaceId, @Param("state") SubscriptionState state, @Param("category") ProductCategory category);


    /**
     * Find the last subscription with a smaller ID than the current one
     * @param spaceId space id
     * @param phase trial,fixedterm
     * @return subscription id
     */
    String selectSubscriptionIdBySpaceIdAndPhaseIgnoreDeleted(@Param("spaceId") String spaceId, @Param("phase") String phase);

    /**
     * get subscription count by bundle id
     * @param bundleIds bundle id list
     * @return count
     */
    Integer selectCountByBundleIds(@Param("bundleIds") List<String> bundleIds);

    /**
     * select subscription's bundle id list
     * @param subscriptionIds subscription id list
     * @return list of bundle id
     */
    List<String> selectBundleIdsBySubscriptionIds(@Param("subscriptionIds") List<String> subscriptionIds);
}
