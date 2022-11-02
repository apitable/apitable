package com.vikadata.api.model.ro.user;

import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 用户操作请求参数
 *
 * @author Chambers
 * @since 2019/10/4
 */
@Data
@ApiModel("用户操作请求参数")
public class UserOpRo {

    @ApiModelProperty(value = "头像", example = "https://...", position = 4)
    private String avatar;

    @ApiModelProperty(value = "昵称", example = "这是一个昵称", position = 5)
    @Size(max = 32, message = "昵称长度不能超过32位")
    private String nickName;

    @ApiModelProperty(value = "是否是注册初始化昵称", example = "true", position = 5)
    private Boolean init;

    @ApiModelProperty(value = "语言", example = "zh-CN", position = 6)
    private String locale;
}
