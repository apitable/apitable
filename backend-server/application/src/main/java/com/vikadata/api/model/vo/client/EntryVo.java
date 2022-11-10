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
public class EntryVo {

    private String version;

    private String userInfoVo;

    private String metaContent;

    /**
     * Return to the client's current environment
     */
    private String env;

    private String wizards;

    private String locale;
}
