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
 * 用户通知列表参数
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/12 2:27 下午
 */
@Data
@ApiModel("用户通知列表参数")
public class NotificationCreateRo {

    @ApiModelProperty(value = "被通知用户的Id(可选)", position = 1)
    private List<String> toUserId;

    @ApiModelProperty(value = "被通知用户的成员ID和toUserId二选一(可选)", position = 2)
    private List<String> toMemberId;

    @ApiModelProperty(value = "被通知用户的组织单元ID和toUserId二选一(可选)", position = 12)
    private List<String> toUnitId;

    @ApiModelProperty(value = "发送通知用户ID,系统通知用户为0(可选)", example = "1261273764218", position = 3)
    private String fromUserId = "0";

    @ApiModelProperty(value = "节点ID(可选)", example = "nod10", position = 4)
    private String nodeId = null;

    @ApiModelProperty(value = "空间ID(可选)", example = "spcHKrd0liUcl", position = 5)
    private String spaceId = null;

    @NotBlank
    @ApiModelProperty(value = "模版ID", example = "user_filed", required = true, position = 6)
    private String templateId;

    @ApiModelProperty(value = "通知额外字段(可选)" + NotificationConstants.BODY_REQUEST_DESC,
            example = NotificationConstants.BODY_REQUEST_EXAMPLE, position = 7)
    private JSONObject body;

    @ApiModelProperty(value = "版本号(可选)", example = "v0.12.1.release", position = 8)
    private String version;

    @ApiModelProperty(value = "过期时间(可选)精确到毫秒", example = "1614587900000", position = 9)
    private String expireAt;

    @ApiModelProperty(value = "通知ID(可选)", example = "1614587900000", position = 10)
    private String notifyId = null;

    @ApiModelProperty(value = "第三方通知类型(可选)所属平台(1: 企业微信, 2: 钉钉, 3: 飞书)", example = "2", position = 11)
    private Integer socialPlatformType;
}
