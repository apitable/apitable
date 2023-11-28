package com.apitable.shared.util;

import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.NodeType;
import org.junit.jupiter.api.Test;

public class IdUtilTest {

    @Test
    void testCreateFolderId() {
        String folderId = IdUtil.createNodeId(NodeType.FOLDER);
        assertThat(folderId).isNotBlank().startsWith(IdRulePrefixEnum.FOD.getIdRulePrefixEnum());
    }
}
