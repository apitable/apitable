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
 * Get members who have no permission on the specified node when mentioning people
 * </p>
 */
@ApiModel("Get members who have no permission on the specified node when mentioning people")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class RemindUnitsNoPermissionRo {

    @ApiModelProperty(value = "Node ID", required = true)
    @NotBlank
    private String nodeId;

    @ApiModelProperty(value = "Organizational Unit ID List", required = true)
    @NotEmpty
    private List<Long> unitIds;

}
