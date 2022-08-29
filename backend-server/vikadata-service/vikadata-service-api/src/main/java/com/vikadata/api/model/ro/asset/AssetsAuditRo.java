package com.vikadata.api.model.ro.asset;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.List;

/**
* <p>
* 附件审核结果ro
* </p>
*
* @author Benson Cheung
* @date 2020/03/23
*/
@Data
@ApiModel("附件人工审核结果ro")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AssetsAuditRo {

    private List<AssetsAuditOpRo> assetlist;

    @NotBlank(message = "审核人userId")
    @ApiModelProperty(value = "审核人userId", example = "0122454826077721", position = 2)
    private String auditorUserId;

    @NotBlank(message = "审核人名称")
    @ApiModelProperty(value = "节点审核人名称", example = "李先生", position = 3)
    private String auditorName;

}
