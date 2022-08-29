package com.vikadata.api.enums.finance;

/** 
* <p> 
* 订单类型
* </p> 
* @author zoe zheng 
* @date 2022/2/25 16:09
*/
public enum OrderType {

    BUY("buy", 0),
    UPGRADE("upgrade", 1),
    RENEW("renew", 2);

    private final String name;

    /**
     * 0: 新购
     * 1：升级
     * 2：续订
     */
    private final int type;

    OrderType(String name, int type) {
        this.name = name;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public int getType() {
        return type;
    }

    public static OrderType ofName(String name) {
        for (OrderType value : OrderType.values()) {
            if (value.getName().equals(name)) {
                return value;
            }
        }
        return null;
    }

    public static OrderType of(String name) {
        for (OrderType value : OrderType.values()) {
            if (value.name().equals(name)) {
                return value;
            }
        }
        return null;
    }

    public static OrderType ofType(Integer type) {
        for (OrderType value : OrderType.values()) {
            if (value.getType() == type) {
                return value;
            }
        }
        return null;
    }
}
