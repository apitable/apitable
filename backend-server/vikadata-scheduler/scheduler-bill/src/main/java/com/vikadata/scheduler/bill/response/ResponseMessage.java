package com.vikadata.scheduler.bill.response;

import lombok.Data;

/**
 *
 * @author Shawn Deng
 * @date 2021-12-29 20:49:14
 */
@Data
public class ResponseMessage {

    private boolean success;

    private Integer code;

    private String message;
}
