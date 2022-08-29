package com.vikadata.api.model.vo.organization;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 搜索结果视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
@ApiModel("搜索结果视图")
public class SearchResultVo {

    @ApiModelProperty(value = "部门列表", position = 1)
    private List<SearchTeamResultVo> teams = new ArrayList<>();

    @ApiModelProperty(value = "成员列表", position = 2)
    private List<SearchMemberResultVo> members = new ArrayList<>();
}
