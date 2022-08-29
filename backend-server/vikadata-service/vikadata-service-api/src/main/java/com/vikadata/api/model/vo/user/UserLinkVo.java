package com.vikadata.api.model.vo.user;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import static com.vikadata.api.constants.DateFormatConstants.TIME_NORM_PATTERN;

/**
 * <p>
 * 帐号关联vo
 * </p>
 *
 * @author Chambers
 * @date 2020/2/28
 */
@Data
@ApiModel("帐号关联vo")
public class UserLinkVo {

    @ApiModelProperty(value = "关联类型：0钉钉；1微信", example = "1", position = 1)
    private Integer type;

    @ApiModelProperty(value = "帐号昵称", example = "短歌行", position = 2)
    private String nickName;

    @ApiModelProperty(value = "绑定时间", example = "2020年2月2日", position = 3)
    @JsonFormat(pattern = TIME_NORM_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createTime;
}
