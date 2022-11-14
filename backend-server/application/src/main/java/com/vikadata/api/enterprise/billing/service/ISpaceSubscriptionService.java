package com.vikadata.api.enterprise.billing.service;


import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.internal.model.InternalSpaceSubscriptionVo;
import com.vikadata.api.space.model.SpaceSubscriptionDto;
import com.vikadata.api.space.model.vo.SpaceCapacityPageVO;
import com.vikadata.api.space.model.vo.SpaceSubscribeVo;
import com.vikadata.api.enterprise.billing.util.model.BillingPlanFeature;
import com.vikadata.api.enterprise.billing.util.model.SubscribePlanInfo;

/**
 * <p>
 * Space Subscription Service
 * </p>
 */
public interface ISpaceSubscriptionService {

    /**
     * Get the specifications of the space station subscription plan in batches
     *
     * @param spaceIds space id list
     * @return spaceId -> BillingPlanFeature
     */
    Map<String, BillingPlanFeature> getSubscriptionFeatureBySpaceIds(List<String> spaceIds);

    /**
     * Get the subscription plan for the specified space station
     *
     * @param spaceId space id
     * @return SubscribePlanInfo
     */
    SubscribePlanInfo getPlanInfoBySpaceId(String spaceId);

    /**
     * Get subscription information for the space station
     *
     * @param spaceId space id
     * @return SpaceSubscribeVo
     */
    SpaceSubscribeVo getSpaceSubscription(String spaceId);

    /**
     * Get the corresponding capacity of the space subscription plan
     *
     * @param spaceId space id
     * @return Numerical value
     */
    long getPlanMaxCapacity(String spaceId);

    /**
     * Get auditable days for a space subscription plan
     *
     * @param spaceId space id
     * @return Numerical value
     */
    long getPlanAuditQueryDays(String spaceId);

    /**
     * Get the maximum storage days of the corresponding recycle bin for the space subscription plan
     *
     * @param spaceId space id
     * @return Numerical value
     */
    long getPlanTrashRemainDays(String spaceId);

    /**
     * Get subscription information for a space
     * * Internal interface
     *
     * @param spaceId space id
     * @return InternalSpaceSubscriptionVo
     */
    InternalSpaceSubscriptionVo getSpaceSubscriptionVo(String spaceId);

    /**
     * Handling expired subscriptions
     *
     * @param spaceId space id
     */
    void handleExpiredSubscription(String spaceId);

    /**
     * Get the capacity of unexpired attachments given by space
     * * Complimentary attachment capacity is an attachment subscription plan
     *
     * @return InternalSpaceSubscriptionVo
     */
    Long getSpaceUnExpireGiftCapacity(String spaceId);

    /**
     * Get space attachment capacity details
     *
     * @param spaceId  space id
     * @param isExpire whether the attachment capacity is invalid
     * @param page     pagination request parameters
     * @return SpaceCapacityPageVO
     */
    IPage<SpaceCapacityPageVO> getSpaceCapacityDetail(String spaceId, Boolean isExpire, Page page);

    /**
     * Process attachment capacity order information
     *
     * @param spaceSubscriptionDtoIPage additional subscription plan order pagination information
     * @param page                      pagination request parameters
     * @return SpaceCapacityPageVO
     */
    IPage<SpaceCapacityPageVO> handleCapacitySubscription(IPage<SpaceSubscriptionDto> spaceSubscriptionDtoIPage, Page page);

    /**
     * Check if the space station is certified to receive the official accessory capacity reward
     *
     * @param spaceId   space id
     * @return SpaceCapacityPageVO
     */
    SpaceCapacityPageVO checkOfficialGiftCapacity(String spaceId);
}
