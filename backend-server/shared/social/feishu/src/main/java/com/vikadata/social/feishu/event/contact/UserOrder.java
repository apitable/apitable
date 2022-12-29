package com.vikadata.social.feishu.event.contact;

import lombok.Getter;
import lombok.Setter;

/**
 * User Sort Information
 */
@Setter
@Getter
public class UserOrder {

    private int userOrder;

    private String departmentId;

    private int departmentOrder;
}
