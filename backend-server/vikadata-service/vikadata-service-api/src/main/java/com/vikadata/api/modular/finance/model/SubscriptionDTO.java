package com.vikadata.api.modular.finance.model;

import lombok.Builder;
import lombok.Data;

/**
* <p> 
* 订阅条目dto
* </p> 
* @author zoe zheng 
* @date 2022/5/18 14:19
*/
@Data
@Builder(toBuilder = true)
class SubscriptionDTO {
    private String bundleId;

    private String subscriptionId;
}
