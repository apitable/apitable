ALTER TABLE `${table.prefix}node_share_setting`
    ADD UNIQUE INDEX `uk_node_view_id` (`node_id`, `view_id`) USING BTREE;
