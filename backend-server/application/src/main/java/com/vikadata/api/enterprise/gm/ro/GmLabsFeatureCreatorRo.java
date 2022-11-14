package com.vikadata.api.enterprise.gm.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * GM command creates experimental menu request object
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Experimental menu request object")
public class GmLabsFeatureCreatorRo {

    @ApiModelProperty(value = "Experimental functional level", dataType = "java.lang.String", example = "user|space", position = 1)
    private String scope;

    @ApiModelProperty(value = "Unique identification of laboratory function", dataType = "java.lang.String", example = "render_prompt|async_compute|robot|widget_center", position = 2)
    private String key;

    @ApiModelProperty(value = "Types of laboratory functions on shelves", dataType = "java.lang.String", example = "static|review|normal", position = 3)
    private String type;

    @ApiModelProperty(value = "Lab Function Magic Form Address", dataType = "java.lang.String", position = 4)
    private String url;
}
