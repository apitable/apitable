package com.vikadata.api.model.vo.space;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 管理员视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
@ApiModel("管理员视图")
public class SpaceRoleVo {

    @ApiModelProperty(value = "角色ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @ApiModelProperty(value = "成员ID", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "头像地址", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 3)
    private String avatar;

    @ApiModelProperty(value = "成员姓名", example = "张三", position = 4)
    private String memberName;

    @ApiModelProperty(value = "所属部门", example = "技术部/研发部", position = 5)
    private String team;

    @ApiModelProperty(value = "手机号码", example = "13610102020", position = 6)
    private String mobile;

    @ApiModelProperty(value = "是否已激活", example = "true", position = 7)
    private Boolean isActive;

    @JsonIgnore
    private String tempResourceGroupCodes;

    @ApiModelProperty(value = "资源组代码列表", example = "[\"MANAGE_SECURITY\",\"MANAGE_TEAM\"]", position = 8)
    private List<String> resourceGroupCodes;

    @Deprecated
    @ApiModelProperty(value = "权限范围(旧)", position = 9)
    private List<RoleResourceVo> resourceScope;

    @ApiModelProperty(value = "创建时间", example = "2020-03-18T15:29:59.000", position = 10)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createTime;

    @ApiModelProperty(value = "创建时间", example = "2020-03-18T15:29:59.000", position = 11)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "用户（user）是否修改过昵称", position = 12)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "成员（member）是否修改过昵称", position = 13)
    private Boolean isMemberNameModified;

}
