package com.vikadata.api.modular.workspace.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 节点分享设置参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/10/16 11:25
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NodeSharePropsDTO {

    /**
     * 仅分享给他人查看
     */
    private Boolean onlyRead;

    /**
     * 分享给他人进行协作编辑
     */
    private Boolean canBeEdited;

    /**
     * 分享给他人另存为副本
     */
    private Boolean canBeStored;
}
