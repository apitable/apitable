package com.vikadata.scheduler.bill.request;

import lombok.Data;

/**
 *
 * @author Shawn Deng
 * @date 2021-12-29 20:23:57
 */
@Data
public class CreateSubscriptionRequest {

    private String spaceId;

    private String basePlan;

    private String startDate;

    private Integer months;
}
