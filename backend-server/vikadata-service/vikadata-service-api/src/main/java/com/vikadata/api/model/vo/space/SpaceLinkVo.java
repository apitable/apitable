package com.vikadata.api.model.vo.space;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 空间公开邀请链接vo
 * </p>
 *
 * @author Chambers
 * @date 2020/3/23
 */
@Data
@ApiModel("空间公开邀请链接vo")
public class SpaceLinkVo {

    @ApiModelProperty(value = "部门ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "上级部门名称", example = "研发部", position = 2)
    private String parentTeamName;

    @ApiModelProperty(value = "部门名称", example = "前端组", position = 3)
    private String teamName;

    @ApiModelProperty(value = "邀请令牌", example = "qwe31", position = 4)
    private String token;
}
