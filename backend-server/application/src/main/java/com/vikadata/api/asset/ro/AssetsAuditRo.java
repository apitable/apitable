package com.vikadata.api.asset.ro;

import java.util.List;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@ApiModel("Attachment manual review results request")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AssetsAuditRo {

    private List<AssetsAuditOpRo> assetlist;

    @NotBlank
    @ApiModelProperty(value = "audit user id", example = "0122454826077721", position = 1)
    private String auditorUserId;

    @NotBlank
    @ApiModelProperty(value = "audit user name", example = "name", position = 2)
    private String auditorName;

}
