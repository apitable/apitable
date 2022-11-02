package com.vikadata.api.model.vo.widget;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;

/**
 * <p>
 * 小程序发布版本历史视图
 * </p>
 *
 * @author Pengap
 * @date 2021/7/9
 */
@Data
@ApiModel("小程序发布版本历史视图")
public class WidgetReleaseListVo {

    @ApiModelProperty(value = "发布本Sha值", position = 1)
    private String releaseSha;

    @ApiModelProperty(value = "版本", example = "1.0.0", position = 2)
    private String version;

    @ApiModelProperty(value = "状态(0:待审核,1:审核通过,2:已拒绝)", example = "1", position = 3)
    private Integer status;

    @ApiModelProperty(value = "代码地址", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 4)
    @JsonSerialize(using = ImageSerializer.class)
    private String releaseCodeBundle;

    @ApiModelProperty(value = "源代码地址", example = "https://s1.vika.cn/code/2020/12/23/aqa", position = 5)
    @JsonSerialize(using = ImageSerializer.class)
    private String sourceCodeBundle;

    @ApiModelProperty(value = "当前发布版本", position = 6)
    private Boolean currentVersion;

    @ApiModelProperty(hidden = true)
    @JsonIgnore
    private Long releaseId;

}
