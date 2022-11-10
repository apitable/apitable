package com.vikadata.api.model.vo.wechat;

import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.LocalDateTimeToMilliSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * WeChat member information vo
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("WeChat member information vo")
public class WechatInfoVo {

    @ApiModelProperty(value = "Nickname", example = "This is a nickname", position = 1)
    private String nickName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Avatar", example = "https://wx.qlogo.cn/BRp2a", position = 2)
    private String avatar;

    @ApiModelProperty(value = "Phone number", example = "\"13344445555\"", position = 3)
    private String mobile;

    @ApiModelProperty(value = "Email", example = "admin@vikadata.com", position = 4)
    private String email;

    @ApiModelProperty(value = "Space name", example = "My Workspace", position = 5)
    private String spaceName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Space logo", example = "http://...", position = 6)
    private String spaceLogo;

    @ApiModelProperty(value = "Creator name", example = "Zhang San", position = 7)
    private String creatorName;

    @ApiModelProperty(value = "Space owner name", example = "Li Si", position = 8)
    private String ownerName;

    @ApiModelProperty(value = "Creation timestamp (ms)", example = "1573561644000", position = 9)
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class)
    private LocalDateTime createTime;

    @ApiModelProperty(value = "Number of people on hand", example = "20", position = 10)
    private Long memberNumber;

    @ApiModelProperty(value = "Number of departments", example = "5", position = 11)
    private Long teamNumber;

    @ApiModelProperty(value = "Number of documents", example = "5", position = 12)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long fileNumber;

    @ApiModelProperty(value = "Total Records", example = "5", position = 13)
    private Long recordNumber;

    @ApiModelProperty(value = "Used space (unit: byte)", example = "1024", position = 14)
    private Long usedSpace;

    @ApiModelProperty(value = "Total capacity (unit: byte)", example = "1024", position = 15)
    private Long maxMemory;
}
