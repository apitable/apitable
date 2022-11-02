package com.vikadata.api.model.ro.datasheet;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.validation.annotation.Validated;

/**
 * <p>
 * 提及人时获取对指定节点无权限的成员
 * </p>
 */
@ApiModel("提及人时获取对指定节点无权限的成员")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class RemindUnitsNoPermissionRo {

    @ApiModelProperty(value = "节点 ID", required = true)
    @NotBlank
    private String nodeId;

    @ApiModelProperty(value = "组织单元 ID 列表", required = true)
    @NotEmpty
    private List<Long> unitIds;

}
