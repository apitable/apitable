package com.vikadata.api.model.ro.player;

import java.util.List;

import javax.validation.constraints.NotBlank;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.constants.NotificationConstants;

/** 
* <p> 
* 撤销通知参数
* </p> 
* @author zoe zheng 
* @date 2021/3/2 3:38 下午
*/
@Data
@ApiModel("撤销通知参数")
public class NotificationRevokeRo {

    @ApiModelProperty(value = "被通知用户的uuid(可选)", position = 1 )
    private List<String> uuid;

    @ApiModelProperty(value = "空间ID(可选, uuid和空间ID二选一)", example = "spcHKrd0liUcl", position = 5)
    protected String spaceId = null;

    @NotBlank(message = "模版ID不能为空")
    @ApiModelProperty(value = "模版ID", example = "user_filed", required = true,
            position = 2)
    private String templateId;

    @ApiModelProperty(value = "版本号(可选)", example = "v0.12.1.release", position = 3)
    private String version;

    @ApiModelProperty(value = "过期时间(可选)精确到毫秒", example = "1614587900000", position = 4)
    private String expireAt;

    @ApiModelProperty(value = "撤销类型:1 已读，2 删除,默认已读", example = "1614587900000", position = 5)
    private int revokeType = 1;
}
