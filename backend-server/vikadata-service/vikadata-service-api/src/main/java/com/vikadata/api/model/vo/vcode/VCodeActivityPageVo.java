package com.vikadata.api.model.vo.vcode;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.vikadata.api.model.vo.wechat.QrCodeBaseInfo;
import com.vikadata.api.support.serializer.NullArraySerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;

import static com.vikadata.api.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * V码活动分页视图
 * </p>
 *
 * @author Chambers
 * @date 2020/8/15
 */
@Data
@ApiModel("V码活动分页视图")
@EqualsAndHashCode(callSuper = true)
public class VCodeActivityPageVo extends VCodeActivityVo {

    @ApiModelProperty(value = "创建者", dataType = "java.lang.String", example = "张三", position = 4)
    private String creator;

    @ApiModelProperty(value = "创建时间", example = "2019-01-01 10:12:13", position = 4)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "最后修改者", dataType = "java.lang.String", example = "李四", position = 5)
    private String updater;

    @ApiModelProperty(value = "最后修改时间", example = "2019-01-01 10:12:13", position = 5)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime updatedAt;

    @ApiModelProperty(value = "活动二维码信息", position = 6)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<QrCodeBaseInfo> qrCodeList;
}
