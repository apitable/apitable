package com.vikadata.api.user.vo;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import static com.vikadata.api.shared.constants.DateFormatConstants.TIME_NORM_PATTERN;

/**
 * <p>
 * Account association vo
 * </p>
 */
@Data
@ApiModel("Account association vo")
public class UserLinkVo {

    @ApiModelProperty(value = "Association Type：0DingTalk；1WeChat", example = "1", position = 1)
    private Integer type;

    @ApiModelProperty(value = "Account nickname", example = "A short song line", position = 2)
    private String nickName;

    @ApiModelProperty(value = "Binding time", example = "2020/2/2", position = 3)
    @JsonFormat(pattern = TIME_NORM_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createTime;
}
