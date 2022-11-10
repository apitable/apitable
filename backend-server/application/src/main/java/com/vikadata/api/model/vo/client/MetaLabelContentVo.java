package com.vikadata.api.model.vo.client;

import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * Contents of the first page meta tag
 * </p>
 */
@Data
@Builder
public class MetaLabelContentVo {
    /**
     * Describe
     */
    private String description;
    /**
     * Title
     */
    private String title;
    /**
     * Page Path
     */
    private String pageUrl;
    /**
     * Picture
     */
    private String image;
}
