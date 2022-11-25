package com.vikadata.social.feishu.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Shawn Deng
 * @date 2020-11-18 16:50:00
 */
@Setter
@Getter
@ToString
public class BasePageInfo {

    @JsonProperty("has_more")
    private boolean hasMore;

    private String pageToken;
}
