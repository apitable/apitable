package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Actively trigger the result of re-push app_ticket.
 * app_ticket is received in the event
 */
@Setter
@Getter
@ToString
public class FeishuResendAppTicketResponse extends BaseResponse {
}
