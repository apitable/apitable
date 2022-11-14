package com.vikadata.api.enterprise.billing.enums;

/**
 * <p>
 * capacity type
 * </p>
 *
 * @author liuzijing
 */
public enum CapacityType {

    SUBSCRIPTION_PACKAGE_CAPACITY("subscription_package_capacity", 0),

    OFFICIAL_GIFT_CAPACITY("official_gift_capacity", 1),

    PARTICIPATION_CAPACITY("participation_capacity", 2),

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
}
