package com.vikadata.api.model.vo.node;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.api.modular.organization.model.MemberTeamPathInfo;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 节点角色所属组织单元
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/7/16 09:49
 */
@Data
@ApiModel("节点角色所属组织单元")
public class NodeRoleUnit {

    @ApiModelProperty(value = "组织单元ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "组织单元名称", example = "研发部｜张三", position = 2)
    private String unitName;

    @ApiModelProperty(value = "类型：1-部门，2-标签，3-成员", example = "1", position = 3)
    private Integer unitType;

    @ApiModelProperty(value = "部门的成员数量，类型为部门时返回", example = "3", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer memberCount;

    @ApiModelProperty(value = "头像，类型为成员时返回", example = "http://www.vikadata.com/image.png", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "所属部门，类型为成员时返回", example = "运营部｜产品部｜研发部", position = 6)
    private String teams;

    @ApiModelProperty(value = "角色", example = "manager", position = 7)
    private String role;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 8)
    private List<MemberTeamPathInfo> teamData;
}
