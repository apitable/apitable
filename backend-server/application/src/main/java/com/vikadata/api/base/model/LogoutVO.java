package com.vikadata.api.base.model;

import lombok.Data;

/**
 * @author Shawn Deng
 */
@Data
public class LogoutVO {

    private boolean needRedirect;

    private String redirectUri;
}
