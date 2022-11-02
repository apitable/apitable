package com.vikadata.api.modular.base.model;

import lombok.Data;

/**
 * @author Shawn Deng
 */
@Data
public class LogoutVO {

    private boolean needRedirect;

    private String redirectUri;
}
