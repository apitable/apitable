package com.vikadata.api.enterprise.billing.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.social.feishu.card.Message;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class OfflineOrderInfo {

    private String orderId;

    private Message message;
}
