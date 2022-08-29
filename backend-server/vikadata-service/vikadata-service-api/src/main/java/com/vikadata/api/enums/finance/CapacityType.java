package com.vikadata.api.enums.finance;

/**
 * <p>
 * 附件容量类型
 * </p>
 *
 * @author liuzijing
 * @date 2022/8/10
 */
public enum CapacityType {

    /**
     * 订阅套餐容量
     */
    SUBSCRIPTION_PACKAGE_CAPACITY("subscription_package_capacity", 0),

    /**
     * 官方赠送容量
     */
    OFFICIAL_GIFT_CAPACITY("official_gift_capacity", 1),

    /**
     * 参与活动赠送容量
     */
    PARTICIPATION_CAPACITY("participation_capacity", 2),

    /**
     * 购买容量
     */
    PURCHASE_CAPACITY("purchase_capacity", 3);

    private final String name;

    private final int type;

    public String getName() {
        return name;
    }

    public int getType() {
        return type;
    }

    CapacityType(String name, int type) {
        this.name = name;
        this.type = type;
    }

    public static CapacityType of(String name) {
        for (CapacityType value : CapacityType.values()) {
            if (value.name().equals(name)) {
                return value;
            }
        }
        return null;
    }

    public static CapacityType ofName(String name) {
        for (CapacityType value : CapacityType.values()) {
            if (value.getName().equals(name)) {
                return value;
            }
        }
        return null;
    }

    public static CapacityType ofType(Integer type) {
        for (CapacityType value : CapacityType.values()) {
            if (value.getType() == type) {
                return value;
            }
        }
        return null;
    }
}
