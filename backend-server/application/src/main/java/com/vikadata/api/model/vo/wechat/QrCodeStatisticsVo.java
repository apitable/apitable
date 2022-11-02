package com.vikadata.api.model.vo.wechat;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 二维码的统计数据视图
 * </p>
 *
 * @author Chambers
 * @date 2020/8/24
 */
@Data
@ApiModel("二维码的统计数据视图")
public class QrCodeStatisticsVo {

    @ApiModelProperty(value = "访问人数", dataType = "java.lang.Integer", example = "15", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer viewUserCount;

    @ApiModelProperty(value = "访问总数", dataType = "java.lang.Integer", example = "20", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer viewCount;
}
