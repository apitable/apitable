package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 组织单元视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
@ApiModel("组织单元视图")
public class OrganizationUnitVo {

    @ApiModelProperty(value = "ID标识，根据type类型分类，type=1,为部门ID，type=2,为成员ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @ApiModelProperty(value = "名称", example = "研发部 | 张三", position = 2)
    private String name;

    @ApiModelProperty(value = "部门名称(不加高亮标签)", example = "技术组", position = 2)
    private String originName;

    @ApiModelProperty(value = "分类：1-部门，2-成员", example = "1", position = 3)
    private Integer type;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "成员头像，分类为成员时会返回", example = "http://www.vikadata.com/image.png", position = 4)
    private String avatar;

    @ApiModelProperty(value = "成员所属部门，分类为成员时会返回", example = "运营助理", position = 5)
    private String teams;

    @ApiModelProperty(value = "成员是否已激活，分类为成员时会返回", example = "true", position = 5)
    private Boolean isActive;

    @ApiModelProperty(value = "部门简称，分类为部门时会返回", example = "研", position = 6)
    private String shortName;

    @ApiModelProperty(value = "部门成员数量，分类为部门时会返回", example = "3", position = 7)
    private Integer memberCount;

    @ApiModelProperty(value = "是否有子部门，分类为部门时会返回", example = "true", position = 8)
    private Boolean hasChildren;
}
