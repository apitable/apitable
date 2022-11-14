package com.vikadata.api.enterprise.billing.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import cn.hutool.core.date.DatePattern;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * Order Detail View
 * </p>
 */
@Data
@ApiModel("Order Detail View")
public class OrderDetailVo {

    @ApiModelProperty(value = "order no", example = "20220215185035483353")
    private String orderNo;

    @ApiModelProperty(value = "original price (unit: yuan)", example = "19998.21")
    private BigDecimal priceOrigin;

    @ApiModelProperty(value = "payment amount (unit: yuan)", example = "18998.11")
    private BigDecimal pricePaid;

    @ApiModelProperty(value = "pay status", dataType = "java.lang.String", example = "Canceled")
    private String status;

    @ApiModelProperty(value = "pay channel type", dataType = "java.lang.String", example = "wx_pub_qr")
    private String payChannel;

    @ApiModelProperty(value = "created time", dataType = "java.lang.String", example = "2022-02-15 10:25:20")
    @JsonFormat(pattern = DatePattern.NORM_DATETIME_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdTime;

    @ApiModelProperty(value = "paid time", dataType = "java.lang.String", example = "2022-02-15 10:29:20")
    @JsonFormat(pattern = DatePattern.NORM_DATETIME_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime paidTime;

    @ApiModelProperty(value = "finish time", dataType = "java.lang.String", example = "2022-02-15 10:29:20")
    @JsonFormat(pattern = DatePattern.NORM_DATETIME_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime finishTime;
}
