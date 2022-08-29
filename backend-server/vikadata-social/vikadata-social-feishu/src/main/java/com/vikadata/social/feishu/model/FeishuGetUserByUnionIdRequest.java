package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * <p>
 * 使用统一 ID 获取用户 ID
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/12/7 11:10
 */
@Getter
@Setter
@ToString
public class FeishuGetUserByUnionIdRequest {

    private List<String> unionIds;
}
