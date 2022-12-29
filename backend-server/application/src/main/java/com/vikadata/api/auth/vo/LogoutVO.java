package com.vikadata.api.auth.vo;

import lombok.Data;

/**
 * @author Shawn Deng
 */
@Data
public class LogoutVO {

    private boolean needRedirect;

    private String redirectUri;
}
