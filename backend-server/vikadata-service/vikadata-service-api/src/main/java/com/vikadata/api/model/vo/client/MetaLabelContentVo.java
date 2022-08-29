package com.vikadata.api.model.vo.client;

import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * 首页meta标签的内容
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/19 12:51 下午
 */
@Data
@Builder
public class MetaLabelContentVo {
    /**
     * 描述
     */
    private String description;
    /**
     * 标题
     */
    private String title;
    /**
     * 页面路径
     */
    private String pageUrl;
    /**
     * 图片
     */
    private String image;
}
