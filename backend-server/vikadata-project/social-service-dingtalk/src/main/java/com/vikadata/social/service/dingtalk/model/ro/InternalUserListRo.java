package com.vikadata.social.service.dingtalk.model.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p> 
 * 内部接口调用--获取钉钉部门用户详细列表参数
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/15 12:31 下午
 */
@Data
@ApiModel(value = "内部接口调用--获取钉钉部门用户详细列表参数")
public class InternalUserListRo {
    @ApiModelProperty(value = "套件ID", dataType = "java.lang.String", example = "12345", required = true)
    private String suiteId;

    @ApiModelProperty(value = "授权企业ID", dataType = "java.lang.String", example = "corpdfkdaj", required = true)
    private String authCorpId;

    @ApiModelProperty(value = "部门ID", dataType = "java.lang.String", example = "1234L", required = true)
    private Long deptId;

    @ApiModelProperty(value = "分页查询的游标", dataType = "java.lang.Integer", example = "0")
    private Integer cursor = 0;

    @ApiModelProperty(value = "分页大小", dataType = "java.lang.Integer", example = "100")
    private Integer size = 100;
}
