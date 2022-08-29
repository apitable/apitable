package com.vikadata.api.modular.finance.model;

import lombok.Builder;
import lombok.Data;

/**
* <p> 
* the third party order items
* </p> 
* @author zoe zheng 
* @date 2022/5/18 14:19
*/
@Data
@Builder(toBuilder = true)
class SocialOrderItemDTO {
    private String orderId;
}
