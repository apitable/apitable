package com.vikadata.api.model.vo.wechat;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Statistical data view of QR code
 * </p>
 */
@Data
@ApiModel("Statistical data view of QR code")
public class QrCodeStatisticsVo {

    @ApiModelProperty(value = "Number of visitors", dataType = "java.lang.Integer", example = "15", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer viewUserCount;

    @ApiModelProperty(value = "Total Visits", dataType = "java.lang.Integer", example = "20", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer viewCount;
}
