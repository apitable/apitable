package com.vikadata.api.model.vo.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
* <p>
* 钉钉扫码登陆返回结果vo
* </p>
*
* @author Chambers
* @date 2019/12/5
*/
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("钉钉扫码登陆结果vo")
public class DingLoginResultVo {

    @ApiModelProperty(value = "是否已绑定维格账号", example = "false", position = 1)
    private Boolean isBind;

    @ApiModelProperty(value = "昵称", example = "张三", position = 2)
    private String nick;

    @ApiModelProperty(value = "开放应用内的唯一标识", example = "liSii8KC", position = 3)
    private String openId;

    @ApiModelProperty(value = "开发者企业内的唯一标识", example = "PiiiPyQqBNBii0HnCJ3zljcuAiEiE", position = 4)
    private String unionId;
}
