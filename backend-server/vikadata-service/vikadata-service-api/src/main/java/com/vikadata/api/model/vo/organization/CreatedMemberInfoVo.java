package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 空间站数据创建人视图
 * </p>
 *
 * @author Pengap
 * @date 2021/7/29 18:23:33
 */
@Data
@ApiModel("数据创建人视图")
public class CreatedMemberInfoVo {

    @ApiModelProperty(value = "节点创建人-名称", position = 8)
    private String memberName;

    @ApiModelProperty(value = "节点创建人-头像", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 9)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

}
