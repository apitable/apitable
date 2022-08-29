package com.vikadata.api.modular.finance.core;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.Builder;
import lombok.Data;

import com.vikadata.api.context.ClockManager;
import com.vikadata.api.enums.finance.BundleState;
import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.util.billing.model.ProductCategory;
import com.vikadata.api.util.billing.model.ProductEnum;

/**
 * 空间订阅套餐包视图
 * 通常一个空间拥有的订阅产品将有一个Base产品和N个addOn产品
 * 例如： 黄金级100人(BASE) + 50G附件容量包(ADD_ON) + 20万Api用量包(ADD_ON)
 *
 * @author Shawn Deng
 * @date 2022-05-17 17:34:40
 */
@Data
@Builder
public class Bundle {

    /**
     * 空间ID
     */
    private String spaceId;

    /**
     * 订阅捆绑包标识
     */
    private String bundleId;

    /**
     * 订阅捆绑包状态
     */
    private BundleState state;

    /**
     * 开始时间
     */
    private LocalDateTime bundleStartDate;

    /**
     * 结束时间
     */
    private LocalDateTime bundleEndDate;

    /**
     * 订阅条目
     */
    private List<Subscription> subscriptions;

    /**
     * 获取基础类型产品的订阅
     * @return Base Subscription
     */
    public Subscription getBaseSubscription() {
        LocalDateTime todayTime = ClockManager.me().getLocalDateTimeNow();
        List<Subscription> subscriptionList = subscriptions.stream()
                .filter(subscription -> SubscriptionState.ACTIVATED == subscription.getState()
                        && ProductCategory.BASE == subscription.getProductCategory()
                )
                .collect(Collectors.toList());
        return subscriptionList.stream()
                .filter(i -> todayTime.compareTo(i.getStartDate()) >= 0
                        && todayTime.compareTo(i.getExpireDate()) <= 0)
                .findFirst().orElseGet(() -> subscriptionList.get(0));
    }

    public boolean isBaseForFree() {
        Subscription base = getBaseSubscription();
        ProductEnum productEnum = ProductEnum.of(base.getProductName());
        if (productEnum == null) {
            return false;
        }
        return productEnum.isFree();
    }

    public List<Subscription> getAddOnSubscription() {
        return subscriptions.stream()
                .filter(subscription -> SubscriptionState.ACTIVATED == subscription.getState()
                        && ProductCategory.ADD_ON == subscription.getProductCategory())
                .collect(Collectors.toList());
    }
}
