package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 搜索成员结果集视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
@ApiModel("搜索成员结果视图")
public class SearchMemberVo {

	@ApiModelProperty(value = "成员ID", dataType = "java.lang.String", example = "1", position = 1)
	@JsonSerialize(using = ToStringSerializer.class)
	private Long memberId;

	@JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
	@ApiModelProperty(value = "头像地址", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 2)
	private String avatar;

	@ApiModelProperty(value = "成员姓名", example = "张三", position = 3)
	private String memberName;

	@ApiModelProperty(value = "成员姓名(不加高亮标签)", example = "张三", position = 3)
	private String originName;

	@ApiModelProperty(value = "所属部门", example = "运营部｜策划部", position = 4)
	private String team;

	@ApiModelProperty(value = "是否已激活", example = "true", position = 5)
	private Boolean isActive;

	@ApiModelProperty(value = "手机号码", example = "13610102020", position = 6)
	private String mobile;

	@ApiModelProperty(value = "是否已经是管理员", example = "true", position = 7)
	private Boolean isManager;

    @ApiModelProperty(value = "用户（user）是否修改过昵称", position = 8)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "成员（member）是否修改过昵称", position = 9)
    private Boolean isMemberNameModified;

}
