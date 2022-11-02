package com.vikadata.api.model.vo.datasheet;

import cn.hutool.json.JSONObject;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.vikadata.api.model.ro.datasheet.SnapshotMapRo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.Map;

/**
 * <p>
 * 初始化数表操作返回参数
 * </p>
 *
 * @author Benson Cheung
 * @since 2020/01/20
 */
@ApiModel("数表操作返回参数")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Accessors(chain = true)
@Builder(toBuilder = true)
public class DatasheetPackVo implements Serializable {

    @ApiModelProperty(value = "数表Snapshot集合", position = 2)
    private SnapshotMapRo snapshot;

    @ApiModelProperty(value = "数表基本信息", position = 3)
    private DataSheetInfoVo datasheet;

    @ApiModelProperty(value = "关联数表数据集合", position = 4)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private JSONObject foreignDatasheetMap;

    @ApiModelProperty(value = "组织单元Map", position = 5)
    private Map unitMap;
}
