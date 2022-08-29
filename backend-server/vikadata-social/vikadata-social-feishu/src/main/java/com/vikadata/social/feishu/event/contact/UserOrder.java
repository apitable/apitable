package com.vikadata.social.feishu.event.contact;

import lombok.Getter;
import lombok.Setter;

/**
 * 用户排序信息
 *
 * @author Shawn Deng
 * @date 2020-12-24 12:06:53
 */
@Setter
@Getter
public class UserOrder {

    private int userOrder;

    private String departmentId;

    private int departmentOrder;
}
