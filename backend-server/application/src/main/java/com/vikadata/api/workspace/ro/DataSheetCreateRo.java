package com.vikadata.api.workspace.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * Data table creation request parameter
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
@ApiModel("Data table creation request parameter")
public class DataSheetCreateRo {

	@ApiModelProperty(value = "Meter Node Id",example = "nod16fq165m6c", position = 1)
	private String nodeId;

    @ApiModelProperty(value = "Number table name",example = "E-commerce project workbench", position = 2)
    private String name;

    @ApiModelProperty(value = "Space id",example = "spczJrh2i3tLW", position = 9)
    private String spaceId;

}
