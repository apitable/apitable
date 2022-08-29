package com.vikadata.api.model.vo.template;

import com.vikadata.api.cache.bean.Banner;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * 模板中心 - 热门推荐视图
 * </p>
 *
 * @author Chambers
 * @date 2020/7/9
 */
@Data
@ApiModel("热门推荐视图")
public class RecommendVo {

    @ApiModelProperty(value = "顶部轮播图", position = 1)
    private List<Banner> top;

    @ApiModelProperty(value = "自定义分组", position = 1)
    private List<CustomCategoryVo> categories;
}
