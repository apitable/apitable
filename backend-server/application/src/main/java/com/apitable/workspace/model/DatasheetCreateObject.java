package com.apitable.workspace.model;

import cn.hutool.core.util.StrUtil;
import com.apitable.workspace.enums.NodeType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * node create object.
 *
 * @author Shawn Deng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class DatasheetCreateObject {

    private String parentId;

    private NodeType type;

    private String name;

    private String description;

    private DatasheetObject datasheetObject;

    public boolean hasDescription() {
        return StrUtil.isNotBlank(this.description);
    }
}
