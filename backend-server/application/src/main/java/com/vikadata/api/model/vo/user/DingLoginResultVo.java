package com.vikadata.api.model.vo.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
* <p>
* DingTalk Scan Code Login Return Result vo
* </p>
*/
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("DingTalk Scan Code Login Return Result vo")
public class DingLoginResultVo {

    @ApiModelProperty(value = "Whether the vika account has been bound", example = "false", position = 1)
    private Boolean isBind;

    @ApiModelProperty(value = "Nickname", example = "Zhang San", position = 2)
    private String nick;

    @ApiModelProperty(value = "Unique identification within open applications", example = "liSii8KC", position = 3)
    private String openId;

    @ApiModelProperty(value = "Unique ID in the developer enterprise", example = "PiiiPyQqBNBii0HnCJ3zljcuAiEiE", position = 4)
    private String unionId;
}
