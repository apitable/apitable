package com.vikadata.api.model.ro.node;

import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

/**
 * 节点编辑请求参数
 *
 * @author Chambers
 * @since 2019/11/01
 */
@Data
@ApiModel("节点编辑请求参数")
public class NodeUpdateOpRo {

    @ApiModelProperty(value = "名称", example = "这是一个新的节点名称", position = 1)
    @Size(max = 100, message = "名称长度不能超过100位")
    private String nodeName;

    @ApiModelProperty(value = "图标", example = ":smile", position = 2)
    private String icon;

    @ApiModelProperty(value = "封面图，置空（'null' OR 'undefined'）", example = "space/2020/5/19/..", position = 3)
    private String cover;

    @ApiModelProperty(value = "是否显示记录的历史", example = "1", position = 4)
    @Range(min = 0, max = 1, message = "是否显示记录的历史只能为0/1")
    private Integer showRecordHistory;
}
