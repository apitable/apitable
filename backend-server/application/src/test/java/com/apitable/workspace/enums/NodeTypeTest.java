package com.apitable.workspace.enums;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

public class NodeTypeTest {

    @Test
    void testAssertRootType() {
        NodeType type = NodeType.ROOT;
        assertThat(type.isRoot()).isTrue();
    }

    @Test
    void testAssertNotRootType() {
        NodeType type = NodeType.FOLDER;
        assertThat(type.isRoot()).isFalse();
    }

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

    @Test
    void testAssertExtentNotFolderType() {
        NodeType type = NodeType.DATASHEET;
        assertThat(type.isNotFolder()).isTrue();
    }
}
