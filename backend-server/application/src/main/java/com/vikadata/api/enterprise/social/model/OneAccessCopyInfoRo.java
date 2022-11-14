package com.vikadata.api.enterprise.social.model;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
@ApiModel("Sync organization and user information for OneAccess")
public class OneAccessCopyInfoRo {

    @ApiModelProperty(value = "Link-Id")
    @NotBlank(message = "Share link Id is not allowed to be empty")
    private String linkId;

    @ApiModelProperty(value = "List of people IDs to be synchronized")
    @NotNull(message = "members Field required")
    private List<MemberRo> members;

    @ApiModelProperty(value = "List of group IDs to be synchronized")
    @NotNull(message = "teamIds Field required")
    private List<String> teamIds;

    @Data
    public static class MemberRo {
       // member Id
       private  String memberId;

       private  String unitId;

       private  String teamId = "";
    }

}
