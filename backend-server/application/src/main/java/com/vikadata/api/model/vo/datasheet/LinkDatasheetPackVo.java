package com.vikadata.api.model.vo.datasheet;

import com.vikadata.api.model.ro.datasheet.SnapshotMapRo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * <p>
 * 关联数据的Datapack数据集合的操作返回参数
 * </p>
 *
 * @author Benson Cheung
 * @since 2020/01/20
 */
@ApiModel("关联数表DataPack数据集合的操作返回参数")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Accessors(chain = true)
@Builder(toBuilder = true)
public class LinkDatasheetPackVo implements Serializable {

    @ApiModelProperty(value = "关联数表Snapshot集合", position = 2)
    private SnapshotMapRo snapshot;

    @ApiModelProperty(value = "关联数表基本信息", position = 3)
    private DataSheetInfoVo datasheet;

}
