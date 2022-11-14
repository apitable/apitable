package com.vikadata.api.enterprise.billing.util.model;

import lombok.Getter;

import static com.vikadata.api.enterprise.billing.util.model.ProductCategory.ADD_ON;
import static com.vikadata.api.enterprise.billing.util.model.ProductCategory.BASE;
import static com.vikadata.api.enterprise.billing.util.model.ProductChannel.ALIYUN;
import static com.vikadata.api.enterprise.billing.util.model.ProductChannel.DINGTALK;
import static com.vikadata.api.enterprise.billing.util.model.ProductChannel.LARK;
import static com.vikadata.api.enterprise.billing.util.model.ProductChannel.VIKA;
import static com.vikadata.api.enterprise.billing.util.model.ProductChannel.WECOM;


/**
 * product
 * @author Shawn Deng
 */
@Getter
public enum ProductEnum {

    BRONZE("Bronze", BASE, VIKA, 1, true),
    SILVER("Silver", BASE, VIKA, 2),
    GOLD("Gold", BASE, VIKA, 3),
    ENTERPRISE("Enterprise", BASE, VIKA, 4),
    API_USAGE("ApiUsage", ADD_ON, VIKA, 0),
    CAPACITY("Capacity", ADD_ON, VIKA, 0),
    DINGTALK_BASE("Dingtalk_Base", BASE, DINGTALK, 1),
    DINGTALK_STANDARD("Dingtalk_Standard", BASE, DINGTALK, 2),
    DINGTALK_ENTERPRISE("Dingtalk_Enterprise", BASE, DINGTALK, 3),
    FEISHU_BASE("Feishu_Base", BASE, LARK, 1),
    FEISHU_STANDARD("Feishu_Standard", BASE, LARK, 2),
    FEISHU_ENTERPRISE("Feishu_Enterprise", BASE, LARK, 3),
    WECOM_BASE("Wecom_Base", BASE, WECOM, 1),
    WECOM_STANDARD("Wecom_Standard", BASE, WECOM, 2),
    WECOM_ENTERPRISE("Wecom_Enterprise", BASE, WECOM, 3),
    PRIVATE_CLOUD("Private_Cloud", BASE, WECOM, 0),

    ATLAS("Atlas", BASE, ALIYUN, 0, true);

    private final String name;

    private final ProductCategory category;

    private final ProductChannel channel;

    private final int rank;

    private final boolean free;

    ProductEnum(String name, ProductCategory category, ProductChannel channel, int rank) {
        this(name, category, channel, rank, false);
    }

    ProductEnum(String name, ProductCategory category, ProductChannel channel, int rank, boolean free) {
        this.name = name;
        this.category = category;
        this.channel = channel;
        this.rank = rank;
        this.free = free;
    }

    public static ProductEnum of(String name) {
        for (ProductEnum value : ProductEnum.values()) {
            if (value.getName().equalsIgnoreCase(name)) {
                return value;
            }
        }
        return null;
    }
}
