package com.vikadata.api.organization.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Search Member Result Set View
 * </p>
 */
@Data
@ApiModel("Search Member Results View")
public class SearchMemberVo {

	@ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 1)
	@JsonSerialize(using = ToStringSerializer.class)
	private Long memberId;

	@JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
	@ApiModelProperty(value = "Head portrait address", example = "http://wwww.vikadata.com/2019/11/12/17123187253.png", position = 2)
	private String avatar;

	@ApiModelProperty(value = "Member Name", example = "Zhang San", position = 3)
	private String memberName;

	@ApiModelProperty(value = "Member name (not highlighted)", example = "Zhang San", position = 3)
	private String originName;

	@ApiModelProperty(value = "Department", example = "Operation Department | Planning Department", position = 4)
	private String team;

	@ApiModelProperty(value = "Whether activated", example = "true", position = 5)
	private Boolean isActive;

	@ApiModelProperty(value = "Phone number", example = "13610102020", position = 6)
	private String mobile;

	@ApiModelProperty(value = "Is the administrator already", example = "true", position = 7)
	private Boolean isManager;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 8)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 9)
    private Boolean isMemberNameModified;

}
