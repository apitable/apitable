package com.vikadata.api.modular.finance.model;

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
 * 订单详情视图
 * </p> 
 * @author Shawn Deng 
 * @date 2022/2/15 19:13
 */
@Data
@ApiModel("订单详情视图")
public class OrderDetailVo {

    @ApiModelProperty(value = "订单号", example = "20220215185035483353")
    private String orderNo;

    @ApiModelProperty(value = "原价(单位: 元)", example = "19998.21")
    private BigDecimal priceOrigin;

    @ApiModelProperty(value = "支付金额(单位: 元)", example = "18998.11")
    private BigDecimal pricePaid;

    @ApiModelProperty(value = "订单状态", dataType = "java.lang.String", example = "Canceled")
    private String status;

    @ApiModelProperty(value = "支付渠道类型", dataType = "java.lang.String", example = "wx_pub_qr")
    private String payChannel;

    @ApiModelProperty(value = "创建时间", dataType = "java.lang.String", example = "2022-02-15 10:25:20")
    @JsonFormat(pattern = DatePattern.NORM_DATETIME_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdTime;

    @ApiModelProperty(value = "支付时间", dataType = "java.lang.String", example = "2022-02-15 10:29:20")
    @JsonFormat(pattern = DatePattern.NORM_DATETIME_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime paidTime;

    @ApiModelProperty(value = "完成时间", dataType = "java.lang.String", example = "2022-02-15 10:29:20")
    @JsonFormat(pattern = DatePattern.NORM_DATETIME_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime finishTime;
}
