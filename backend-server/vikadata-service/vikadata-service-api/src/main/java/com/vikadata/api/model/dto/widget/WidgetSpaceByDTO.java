package com.vikadata.api.model.dto.widget;

import lombok.Data;

/**
 * <p>
 * 小组件归属空间站信息
 * </p>
 * @author Pengap
 * @date 2021/9/28 16:03:42
 */
@Data
public class WidgetSpaceByDTO {

    /**
     * 空间站Id
     */
    private String spaceId;

    /**
     * 作者名称
     */
    private String authorName;

    /**
     * 作者图标
     */
    private String authorIcon;

    /**
     * 小组件拥有者UUID - 空间站小组件返回
     */
    private String ownerUuid;

    /**
     * 小组件拥有者UserId - 空间站小组件返回
     */
    private String owner;

    /**
     * 小组件拥有者MemberId - 空间站小组件返回
     */
    private String ownerMemberId;

}
