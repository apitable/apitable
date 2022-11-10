package com.vikadata.api.model.vo.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * Search Results View
 * </p>
 */
@Data
@ApiModel("Search Results View")
public class SearchResultVo {

    @ApiModelProperty(value = "Department List", position = 1)
    private List<SearchTeamResultVo> teams = new ArrayList<>();

    @ApiModelProperty(value = "Member List", position = 2)
    private List<SearchMemberResultVo> members = new ArrayList<>();
}
