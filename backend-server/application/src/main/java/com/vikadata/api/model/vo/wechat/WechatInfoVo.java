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
 * 微信会员信息vo
 * </p>
 *
 * @author Chambers
 * @date 2020/3/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("微信会员信息vo")
public class WechatInfoVo {

    @ApiModelProperty(value = "昵称", example = "这是一个昵称", position = 1)
    private String nickName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "头像", example = "https://wx.qlogo.cn/BRp2a", position = 2)
    private String avatar;

    @ApiModelProperty(value = "手机号码", example = "\"13344445555\"", position = 3)
    private String mobile;

    @ApiModelProperty(value = "邮箱", example = "admin@vikadata.com", position = 4)
    private String email;

    @ApiModelProperty(value = "空间名称", example = "我的工作空间", position = 5)
    private String spaceName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "空间logo", example = "http://...", position = 6)
    private String spaceLogo;

    @ApiModelProperty(value = "创建者名称", example = "张三", position = 7)
    private String creatorName;

    @ApiModelProperty(value = "空间拥有者名称", example = "李四", position = 8)
    private String ownerName;

    @ApiModelProperty(value = "创建时间时间戳(毫秒)", example = "1573561644000", position = 9)
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class)
    private LocalDateTime createTime;

    @ApiModelProperty(value = "现有人数", example = "20", position = 10)
    private Long memberNumber;

    @ApiModelProperty(value = "部门数量", example = "5", position = 11)
    private Long teamNumber;

    @ApiModelProperty(value = "文件数量", example = "5", position = 12)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long fileNumber;

    @ApiModelProperty(value = "总记录数", example = "5", position = 13)
    private Long recordNumber;

    @ApiModelProperty(value = "已用空间(单位：byte)", example = "1024", position = 14)
    private Long usedSpace;

    @ApiModelProperty(value = "总容量(单位：byte)", example = "1024", position = 15)
    private Long maxMemory;
}
