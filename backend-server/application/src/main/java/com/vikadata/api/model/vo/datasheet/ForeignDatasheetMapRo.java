package com.vikadata.api.model.vo.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * Foreign Datasheet Map Collection Request Parameter
 */
@ApiModel("Foreign Datasheet Map Collection Request Parameter")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class ForeignDatasheetMapRo {

    @ApiModelProperty(value = "Associated datasheet ID", position = 2)
    private  String datasheetId;

    @ApiModelProperty(value = "DataPack data set of associated data", position = 3)
    private LinkDatasheetPackVo datasheetPackVo;
}
