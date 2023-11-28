package com.apitable.workspace.enums;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

public class NodeTypeTest {

    @Test
    void testAssertFolderType() {
        NodeType type = NodeType.FOLDER;
        assertThat(type.isFolder()).isTrue();
    }

    @Test
    void testAssertNotFolderType() {
        NodeType type = NodeType.DATASHEET;
        assertThat(type.isFolder()).isFalse();
    }
}
