package com.vikadata.api.model.vo.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * 关联数表ForeignDatasheetMap合集请求参数
 *
 * @author Benson Cheung
 * @since 2020/01/20
 */
@ApiModel("关联数表ForeignDatasheetMap合集请求参数")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class ForeignDatasheetMapRo {

    @ApiModelProperty(value = "关联数表ID", position = 2)
    private  String datasheetId;

    @ApiModelProperty(value = "关联数据的Datapack数据集合", position = 3)
    private LinkDatasheetPackVo datasheetPackVo;
}
