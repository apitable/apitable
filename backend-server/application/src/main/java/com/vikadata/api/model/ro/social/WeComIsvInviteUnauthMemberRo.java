package com.vikadata.api.model.ro.social;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.validation.annotation.Validated;

/**
 * <p>
 * 邀请未授权的用户
 * </p>
 */
@ApiModel("邀请未授权的用户")
@Setter
@Getter
@Builder
@ToString
@EqualsAndHashCode
@Validated
public class WeComIsvInviteUnauthMemberRo {

    @ApiModelProperty(value = "空间站 ID", required = true)
    @NotBlank
    private String spaceId;

    @ApiModelProperty(value = "选择邀请的成员票据列表", required = true)
    @NotEmpty
    private List<String> selectedTickets;

}
