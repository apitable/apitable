package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
@ApiModel("Space Whitelist Ro")
public class SpaceWhitelistRo {

    @ApiModelProperty(value = "the space id list", required = true, example = "[\"spczJrh2i3tLW\",\"spczdmQDfBAn5\"]", position = 1)
    @NotEmpty(message = "the space id cannot be empty")
    private List<String> spaceIds;

    @ApiModelProperty(value = "the number of members", example = "100", position = 2)
    private Integer memberCount;

    @ApiModelProperty(value = "capacity multiple(*1G)", example = "10", position = 3)
    private Long capacityMultiple;

    @ApiModelProperty(value = "file node amount", example = "10", position = 4)
    private Integer fileCount;

    @ApiModelProperty(value = "sub admin amount", example = "9", position = 5)
    private Integer subAdminCount;

    @ApiModelProperty(value = "effective number of days", example = "9", position = 5)
    private Integer day;
}
