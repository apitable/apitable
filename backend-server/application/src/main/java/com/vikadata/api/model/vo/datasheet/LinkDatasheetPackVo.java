package com.vikadata.api.model.vo.datasheet;

import com.vikadata.api.model.ro.datasheet.SnapshotMapRo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * <p>
 * Operation return parameters of DataPack data set of associated data
 * </p>
 */
@ApiModel("Operation return parameters of the associated number table Data Pack data set")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Accessors(chain = true)
@Builder(toBuilder = true)
public class LinkDatasheetPackVo implements Serializable {

    @ApiModelProperty(value = "Correlation Number Table Snapshot Set", position = 2)
    private SnapshotMapRo snapshot;

    @ApiModelProperty(value = "Basic information of related number table", position = 3)
    private DataSheetInfoVo datasheet;

}
