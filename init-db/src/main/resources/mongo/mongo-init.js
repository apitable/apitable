//////////////////////////////////////////////
//                                          //
//  currently only available in unit test   //
//                                          //
//////////////////////////////////////////////
// db = db.getSiblingDB('vikadata');

db.auth(_getEnv('MONGO_INITDB_ROOT_USERNAME'), _getEnv('MONGO_INITDB_ROOT_PASSWORD'));

db = db.getSiblingDB(_getEnv('MONGO_INITDB_DATABASE'));

db.createUser({
  user: _getEnv('MONGO_USERNAME'),
  pwd: _getEnv('MONGO_PASSWORD'),
  roles: [{role: 'readWrite', db: _getEnv('MONGO_INITDB_DATABASE')}]
});

// ----------------------------
// Collection structure for vika_audit_space
// ----------------------------
db.getCollection('vika_audit_space').drop();
db.createCollection('vika_audit_space');
db.getCollection('vika_audit_space').createIndex(
  {
    spaceId: NumberInt('1'),
  },
  {
    name: 'idx_space',
    background: true,
  },
);
db.getCollection('vika_audit_space').createIndex(
  {
    memberId: NumberInt('1'),
  },
  {
    name: 'idx_member',
    background: true,
  },
);
db.getCollection('vika_audit_space').createIndex(
  {
    action: NumberInt('1'),
  },
  {
    name: 'idx_action',
    background: true,
  },
);

// ----------------------------
// Collection structure for vika_data_migration_cursor
// ----------------------------
db.getCollection('vika_data_migration_cursor').drop();
db.createCollection('vika_data_migration_cursor');

// ----------------------------
// Collection structure for vika_data_migration_history
// ----------------------------
db.getCollection('vika_data_migration_history').drop();
db.createCollection('vika_data_migration_history');

// ----------------------------
// Collection structure for vika_data_migration_plan
// ----------------------------
db.getCollection('vika_data_migration_plan').drop();
db.createCollection('vika_data_migration_plan');

// ----------------------------
// Collection structure for vika_datasheet
// ----------------------------
db.getCollection('vika_datasheet').drop();
db.createCollection('vika_datasheet');
db.getCollection('vika_datasheet').createIndex(
  {
    spaceId: NumberInt('1'),
  },
  {
    name: 'idx_spc',
    background: true,
  },
);
db.getCollection('vika_datasheet').createIndex(
  {
    datasheetId: NumberInt('1'),
  },
  {
    name: 'uk_dst',
    background: true,
    unique: true,
  },
);

// ----------------------------
// Collection structure for vika_datasheet_changeset
// ----------------------------
db.getCollection('vika_datasheet_changeset').drop();
db.createCollection('vika_datasheet_changeset');
db.getCollection('vika_datasheet_changeset').createIndex(
  {
    spaceId: NumberInt('1'),
  },
  {
    name: 'idx_spc',
    background: true,
  },
);
db.getCollection('vika_datasheet_changeset').createIndex(
  {
    datasheetId: NumberInt('1'),
    messageId: NumberInt('1'),
  },
  {
    name: 'uk_dst_msg',
    background: true,
    unique: true,
  },
);
db.getCollection('vika_datasheet_changeset').createIndex(
  {
    createdBy: NumberInt('1'),
  },
  {
    name: 'idx_user',
    background: true,
  },
);
db.getCollection('vika_datasheet_changeset').createIndex(
  {
    datasheetId: NumberInt('1'),
    revision: NumberInt('-1'),
  },
  {
    name: 'uk_dst_rvs',
    background: true,
    unique: true,
  },
);

// ----------------------------
// Collection structure for vika_datasheet_cron_job
// ----------------------------
db.getCollection('vika_datasheet_cron_job').drop();
db.createCollection('vika_datasheet_cron_job');
db.getCollection('vika_datasheet_cron_job').createIndex(
  {
    datasheetId: NumberInt('1'),
    fieldId: NumberInt('1'),
  },
  {
    name: 'uk_dst_fld',
    background: true,
    unique: true,
  },
);
db.getCollection('vika_datasheet_cron_job').createIndex(
  {
    nextUpdate: NumberInt('1'),
  },
  {
    name: 'idx_next_update',
    background: true,
  },
);

// ----------------------------
// Collection structure for vika_datasheet_field
// ----------------------------
db.getCollection('vika_datasheet_field').drop();
db.createCollection('vika_datasheet_field');
db.getCollection('vika_datasheet_field').createIndex(
  {
    spaceId: NumberInt('1'),
  },
  {
    name: 'idx_spc',
    background: true,
  },
);
db.getCollection('vika_datasheet_field').createIndex(
  {
    datasheetId: NumberInt('1'),
    fieldId: NumberInt('1'),
  },
  {
    name: 'uk_dst_fld',
    background: true,
    unique: true,
  },
);

// ----------------------------
// Collection structure for vika_datasheet_field_cascader
// ----------------------------
db.getCollection('vika_datasheet_field_cascader').drop();
db.createCollection('vika_datasheet_field_cascader');

// ----------------------------
// Collection structure for vika_datasheet_field_ref
// ----------------------------
db.getCollection('vika_datasheet_field_ref').drop();
db.createCollection('vika_datasheet_field_ref');
db.getCollection('vika_datasheet_field_ref').createIndex(
  {
    fromDstId: NumberInt('1'),
  },
  {
    name: 'idx_from_dst_id',
    background: true,
  },
);
db.getCollection('vika_datasheet_field_ref').createIndex(
  {
    toDstId: NumberInt('1'),
  },
  {
    name: 'idx_to_dst_id',
    background: true,
  },
);
db.getCollection('vika_datasheet_field_ref').createIndex(
  {
    from: NumberInt('1'),
    to: NumberInt('1'),
  },
  {
    name: 'uk_from_to',
    background: true,
    unique: true,
  },
);
db.getCollection('vika_datasheet_field_ref').createIndex(
  {
    to: NumberInt('1'),
    from: NumberInt('1'),
  },
  {
    name: 'uk_to_from',
    background: true,
    unique: true,
  },
);

// ----------------------------
// Collection structure for vika_datasheet_operation
// ----------------------------
db.getCollection('vika_datasheet_operation').drop();
db.createCollection('vika_datasheet_operation');
db.getCollection('vika_datasheet_operation').createIndex(
  {
    datasheetId: NumberInt('1'),
    revision: NumberInt('-1'),
  },
  {
    name: 'uk_dst_rvs',
    background: true,
    unique: true,
  },
);

// ----------------------------
// Collection structure for vika_datasheet_record
// ----------------------------
db.getCollection('vika_datasheet_record').drop();
db.createCollection('vika_datasheet_record');
db.getCollection('vika_datasheet_record').createIndex(
  {
    spaceId: NumberInt('1'),
  },
  {
    name: 'idx_spc',
    background: true,
  },
);
db.getCollection('vika_datasheet_record').createIndex(
  {
    datasheetId: NumberInt('1'),
    recordId: NumberInt('1'),
  },
  {
    name: 'uk_dst_rcd',
    background: true,
    unique: true,
  },
);

// ----------------------------
// Collection structure for vika_datasheet_record_alarm
// ----------------------------
db.getCollection('vika_datasheet_record_alarm').drop();
db.createCollection('vika_datasheet_record_alarm');

// ----------------------------
// Collection structure for vika_datasheet_record_comment
// ----------------------------
db.getCollection('vika_datasheet_record_comment').drop();
db.createCollection('vika_datasheet_record_comment');
db.getCollection('vika_datasheet_record_comment').createIndex(
  {
    spaceId: NumberInt('1'),
  },
  {
    name: 'idx_spc',
    background: true,
  },
);
db.getCollection('vika_datasheet_record_comment').createIndex(
  {
    datasheetId: NumberInt('1'),
    recordId: NumberInt('1'),
  },
  {
    name: 'idx_dst_rcd',
    background: true,
  },
);
db.getCollection('vika_datasheet_record_comment').createIndex(
  {
    commentId: NumberInt('1'),
  },
  {
    name: 'idx_cmt',
    background: true,
  },
);

// ----------------------------
// Collection structure for vika_datasheet_record_data
// ----------------------------
db.getCollection('vika_datasheet_record_data').drop();
db.createCollection('vika_datasheet_record_data');
db.getCollection('vika_datasheet_record_data').createIndex(
  {
    datasheetId: NumberInt('1'),
    recordId: NumberInt('1'),
  },
  {
    name: 'uk_dst_rcd',
    background: true,
    unique: true,
  },
);
db.getCollection('vika_datasheet_record_data').createIndex(
  {
    '$**': 'text',
  },
  {
    name: 'stringify_text',
    weights: {
      stringify: NumberInt('1'),
    },
    default_language: 'english',
    language_override: 'language',
    textIndexVersion: NumberInt('3'),
  },
);

// ----------------------------
// Collection structure for vika_datasheet_record_ref
// ----------------------------
db.getCollection('vika_datasheet_record_ref').drop();
db.createCollection('vika_datasheet_record_ref');
db.getCollection('vika_datasheet_record_ref').createIndex(
  {
    fromDstId: NumberInt('1'),
  },
  {
    name: 'idx_from_dst_id',
    background: true,
  },
);
db.getCollection('vika_datasheet_record_ref').createIndex(
  {
    toDstId: NumberInt('1'),
  },
  {
    name: 'idx_to_dst_id',
    background: true,
  },
);
db.getCollection('vika_datasheet_record_ref').createIndex(
  {
    from: NumberInt('1'),
    to: NumberInt('1'),
    type: NumberInt('1'),
  },
  {
    name: 'uk_from_to_type',
    background: true,
    unique: true,
  },
);
db.getCollection('vika_datasheet_record_ref').createIndex(
  {
    to: NumberInt('1'),
    from: NumberInt('1'),
    type: NumberInt('1'),
  },
  {
    name: 'uk_to_from_type',
    background: true,
    unique: true,
  },
);

// ----------------------------
// Collection structure for vika_datasheet_view
// ----------------------------
db.getCollection('vika_datasheet_view').drop();
db.createCollection('vika_datasheet_view');
db.getCollection('vika_datasheet_view').createIndex(
  {
    spaceId: NumberInt('1'),
  },
  {
    name: 'idx_spc',
    background: true,
  },
);
db.getCollection('vika_datasheet_view').createIndex(
  {
    datasheetId: NumberInt('1'),
    viewId: NumberInt('1'),
  },
  {
    name: 'uk_dst_viw',
    background: true,
    unique: true,
  },
);

// ----------------------------
// Collection structure for vika_datasheet_widget_panel
// ----------------------------
db.getCollection('vika_datasheet_widget_panel').drop();
db.createCollection('vika_datasheet_widget_panel');
db.getCollection('vika_datasheet_widget_panel').createIndex(
  {
    spaceId: NumberInt('1'),
  },
  {
    name: 'idx_spc',
    background: true,
  },
);
db.getCollection('vika_datasheet_widget_panel').createIndex(
  {
    datasheetId: NumberInt('1'),
    widgetPanelId: NumberInt('1'),
  },
  {
    name: 'uk_dst_wpn',
    background: true,
    unique: true,
  },
);

// ----------------------------
// Collection structure for vika_member_cell_ref
// ----------------------------
db.getCollection('vika_member_cell_ref').drop();
db.createCollection('vika_member_cell_ref');
db.getCollection('vika_member_cell_ref').createIndex(
  {
    uid: NumberInt('1'),
  },
  {
    name: 'idx_uid',
    background: true,
  },
);
db.getCollection('vika_member_cell_ref').createIndex(
  {
    datasheetId: NumberInt('1'),
  },
  {
    name: 'idx_dst',
    background: true,
  },
);
db.getCollection('vika_member_cell_ref').createIndex(
  {
    fieldId: NumberInt('1'),
  },
  {
    name: 'idx_fld',
    background: true,
  },
);
db.getCollection('vika_member_cell_ref').createIndex(
  {
    recordId: NumberInt('1'),
  },
  {
    name: 'idx_rec',
    background: true,
  },
);

// ----------------------------
// Collection structure for vika_room_resource_ref
// ----------------------------
db.getCollection('vika_room_resource_ref').drop();
db.createCollection('vika_room_resource_ref');
db.getCollection('vika_room_resource_ref').createIndex(
  {
    spaceId: NumberInt('1'),
  },
  {
    name: 'idx_spc',
    background: true,
  },
);
db.getCollection('vika_room_resource_ref').createIndex(
  {
    roomId: NumberInt('1'),
    resourceId: NumberInt('1'),
  },
  {
    name: 'uk_room_resource',
    background: true,
    unique: true,
  },
);
