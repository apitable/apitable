package com.vikadata.api.model.vo.asset;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * Office Document Preview Result View
 * </p>
 */
@Data
@ApiModel("Office Document Preview Result View")
public class AssetOfficePreviewResult {

    @ApiModelProperty(value = "Preview address after conversion", example = "{'data': 'http://xxx'}", position = 1)
    private Data data;

    @ApiModelProperty(value = "Information prompt of returned results", example = "Operation succeeded", position = 2)
    private String message;

    @ApiModelProperty(value = "code", example = "0", position = 3)
    @JsonProperty("errorcode")
    private Integer errorCode;

    @Setter
    @Getter
    public static class Data {
        private String data;
    }

}
