package com.vikadata.api.component.http;

import org.springframework.util.MultiValueMap;

/**
 *
 * @author Shawn Deng
 * @date 2021-01-25 20:01:02
 */
public interface VisibleResponse {

    int getStatus();

    String getStatusText();

    MultiValueMap<String, String> getHeaders();

    String getBody();
}
