package com.vikadata.api.enterprise.gm.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Migrate wecom isv orders to billing
 * </p>
 */
@Data
@ApiModel("Migrate wecom isv orders to billing")
public class WeComIsvOrderMigrateRo {

    @ApiModelProperty("The wecom isv suite ID")
    @NotBlank
    private String suiteId;

    @ApiModelProperty("The space ID that to be migrated, handle all wecom isv spaces if null")
    private String spaceId;

}
