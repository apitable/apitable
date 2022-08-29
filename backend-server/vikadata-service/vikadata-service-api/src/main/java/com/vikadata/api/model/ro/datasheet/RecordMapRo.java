package com.vikadata.api.model.ro.datasheet;

import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * 数表记录Record请求参数
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/09/20 11:36
 */
@ApiModel("数表记录Record请求参数")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RecordMapRo {

    @ApiModelProperty(value = "记录ID", position = 2)
    private String id;

    @ApiModelProperty(value = "一行记录的数据（对应每个字段Field）", position = 3)
    private JSONObject data;

    @ApiModelProperty(value = "按排序的历史版本号，是原 Operation 的revision，数组下标是当前 record 的 revision", position = 5)
    private String revisionHistory;

    @ApiModelProperty(value = "版本号", position = 6)
    private Long revision;

    @JsonIgnore
    @TableLogic
    @ApiModelProperty(value = "删除标记(0:否,1:是)", position = 7)
    private Boolean isDeleted;

    @ApiModelProperty(value = "recordMeta fieldUpdatedMap", position = 8)
    private JSONObject fieldUpdatedMap;
}
