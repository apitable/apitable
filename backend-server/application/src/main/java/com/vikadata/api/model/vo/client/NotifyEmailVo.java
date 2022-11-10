package com.vikadata.api.model.vo.client;

import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * Client portal template binding parameters
 * </p>
 */
@Data
@Builder
public class NotifyEmailVo {

    /**
     * Publisher
     */
    private String publishUser;

    private String version;

    private String content;
    /**
     * Particular year
     */
    private int years;
}
