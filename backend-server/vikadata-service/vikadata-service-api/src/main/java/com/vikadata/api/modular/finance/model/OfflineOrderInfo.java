package com.vikadata.api.modular.finance.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.social.feishu.card.Message;

/**
 * @author Shawn Deng
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class OfflineOrderInfo {

    private String orderId;

    private Message message;
}
