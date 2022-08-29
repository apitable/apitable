package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 搜索成员结果视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/8 11:41
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@ApiModel("搜索成员结果视图")
public class SearchMemberResultVo {

    @ApiModelProperty(value = "成员ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "成员姓名", example = "张三", position = 2)
    private String memberName;

    @ApiModelProperty(value = "成员姓名(不加高亮标签)", example = "张三", position = 2)
    private String originName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "头像", example = "https://...", position = 3)
    private String avatar;

    @ApiModelProperty(value = "所属部门", example = "技术组", position = 4)
    private String team;

    @ApiModelProperty(value = "用户（user）是否修改过昵称", position = 5)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "成员（member）是否修改过昵称", position = 6)
    private Boolean isMemberNameModified;

}
