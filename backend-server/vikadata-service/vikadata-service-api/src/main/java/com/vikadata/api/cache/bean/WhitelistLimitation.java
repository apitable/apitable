package com.vikadata.api.cache.bean;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.enums.finance.DingTalkSubscriptionType;

/**
 * <p>
 * 空间白名单限制属性
 * </p>
 *
 * @author Chambers
 * @date 2020/12/19
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class WhitelistLimitation {

    /**
     * 空间名称
     */
    private String spaceName;

    /**
     * 席位数
     */
    private Integer memberCount;

    /**
     * 附件容量（单位：byte）
     */
    private Long spaceCapacity;

    /**
     * 文件树
     */
    private Integer fileCount;

    /**
     * 子管理员数
     */
    private Integer subAdminCount;

    // 上面属于线下订单的白名单存储流程，下面是钉钉商品的白名单存储流程

    /**
     * 钉钉商品规格属性：席位
     */
    private Integer seat;

    /**
     * 钉钉商店的商品对应订阅方案，如：dingtalk_standard_200_annual_v1
     * dingtalk_standard_200_annual_v1 = 钉钉标准版200人，按年付
     */
    private String plan;

    /**
     * 钉钉商品规格属性：文件数
     */
    private Integer nodes;

    /**
     * 钉钉规格码
     */
    private String itemCode;

    /**
     * 钉钉商店设置的产品订阅类型：
     * Dingtalk_Base = 钉钉基础版
     * Dingtalk_Basic = 钉钉标准版
     * Dingtalk_Standard = 钉钉标准版本
     * Dingtalk_Enterprise = 钉钉企业版
     * @see DingTalkSubscriptionType
     */
    private DingTalkSubscriptionType subscriptionType;

    /**
     * 钉钉商店的订阅到期时间
     */
    private LocalDateTime expireTime;

    /**
     * 是否是内购商品
     */
    private Boolean internal;

    public WhitelistLimitation(Integer memberCount, Long spaceCapacity, Integer fileCount, Integer subAdminCount) {
        this.memberCount = memberCount;
        this.spaceCapacity = spaceCapacity;
        this.fileCount = fileCount;
        this.subAdminCount = subAdminCount;
    }
}
