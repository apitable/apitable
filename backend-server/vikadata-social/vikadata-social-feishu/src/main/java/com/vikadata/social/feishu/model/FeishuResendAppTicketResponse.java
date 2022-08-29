package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 主动触发重新推送 app_ticket 的结果
 * app_ticket 在事件里接收
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/23 12:31
 */
@Setter
@Getter
@ToString
public class FeishuResendAppTicketResponse extends BaseResponse {
}
