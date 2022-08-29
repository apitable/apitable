ALTER TABLE `vika_datasheet_changeset` ADD UNIQUE INDEX `uk_dst_message_id`(`dst_id`, `message_id`) USING BTREE;
ALTER TABLE `vika_datasheet_changeset` ADD UNIQUE INDEX `uk_dst_revision`(`dst_id`, `revision`) USING BTREE;
