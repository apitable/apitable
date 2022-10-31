package com.vikadata.social.feishu.model.v3;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * Department status,
 * New Contacts Events
 */
@Setter
@Getter
public class DeptStatus {

    @JsonProperty("is_deleted")
    private boolean isDeleted;
}
