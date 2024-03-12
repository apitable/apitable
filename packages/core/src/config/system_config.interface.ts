export interface SystemConfigInterface {
    environment:                 Environment;
    settings:                    Settings;
    shortcut_keys:               ShortcutKey[];
    country_code_and_phone_code: { [key: string]: CountryCodeAndPhoneCode };
    api_panel:                   { [key: string]: APIPanel };
    audit:                       Audit;
    locales:                     Locale[];
    marketplace:                 SystemConfigInterfaceMarketplace;
    test_function:               TestFunction;
    player:                      SystemConfigInterfacePlayer;
    guide:                       SystemConfigInterfaceGuide;
    notifications:               Notifications;
    integral:                    Integral;
}

export interface APIPanel {
    defaultExampleId: string;
    description:      string;
    descriptionId:    string;
    defaultExample:   string;
    valueType:        string;
}

export interface Audit {
    actual_delete_space:         ActualDeleteSpace;
    add_field_role:              ActualDeleteSpace;
    add_node_role:               AddNodeRole;
    add_sub_admin:               AddSubAdmin;
    add_team_to_member:          AddSubAdmin;
    agree_user_apply:            AddSubAdmin;
    cancel_delete_space:         ActualDeleteSpace;
    change_main_admin:           AddSubAdmin;
    copy_node:                   AddNodeRole;
    create_node:                 AddNodeRole;
    create_space:                ActualDeleteSpace;
    create_team:                 AddSubAdmin;
    create_template:             ActualDeleteSpace;
    delete_field_role:           ActualDeleteSpace;
    delete_node:                 AddNodeRole;
    delete_node_role:            AddNodeRole;
    delete_rubbish_node:         ActualDeleteSpace;
    delete_space:                ActualDeleteSpace;
    delete_sub_admin:            AddSubAdmin;
    delete_team:                 AddSubAdmin;
    delete_template:             ActualDeleteSpace;
    disable_field_role:          ActualDeleteSpace;
    disable_node_role:           AddNodeRole;
    disable_node_share:          AddNodeRole;
    enable_field_role:           ActualDeleteSpace;
    enable_node_role:            AddNodeRole;
    enable_node_share:           AddNodeRole;
    export_node:                 ActualDeleteSpace;
    import_node:                 AddNodeRole;
    invite_user_join_by_email:   ActualDeleteSpace;
    move_node:                   AddNodeRole;
    quote_template:              ActualDeleteSpace;
    recover_rubbish_node:        AddNodeRole;
    remove_member_from_team:     AddSubAdmin;
    remove_user:                 AddSubAdmin;
    rename_node:                 AddNodeRole;
    rename_space:                ActualDeleteSpace;
    sort_node:                   ActualDeleteSpace;
    store_share_node:            StoreShareNode;
    update_field_role:           ActualDeleteSpace;
    update_field_role_setting:   AddSubAdmin;
    update_member_name_property: ActualDeleteSpace;
    update_member_property:      ActualDeleteSpace;
    update_member_team:          AddSubAdmin;
    update_node_cover:           ActualDeleteSpace;
    update_node_desc:            ActualDeleteSpace;
    update_node_icon:            ActualDeleteSpace;
    update_node_role:            AddNodeRole;
    update_node_share_setting:   AddNodeRole;
    update_space_logo:           ActualDeleteSpace;
    update_sub_admin_role:       AddSubAdmin;
    update_team_property:        AddSubAdmin;
    user_leave_space:            ActualDeleteSpace;
    user_login:                  ActualDeleteSpace;
    user_logout:                 ActualDeleteSpace;
}

export interface ActualDeleteSpace {
    content?: string;
    online?:  boolean;
    type:     NotificationsTypeElement;
    category: string;
    name:     string;
}

export enum NotificationsTypeElement {
    Member = "member",
    Space = "space",
    System = "system",
}

export interface AddNodeRole {
    content:           string;
    online:            boolean;
    type:              NotificationsTypeElement;
    sort:              string;
    show_in_audit_log: boolean;
    category:          CategoryElement;
    name:              string;
}

export enum CategoryElement {
    WorkCatalogChangeEvent = "work_catalog_change_event",
    WorkCatalogPermissionChangeEvent = "work_catalog_permission_change_event",
    WorkCatalogShareEvent = "work_catalog_share_event",
}

export interface AddSubAdmin {
    type:     NotificationsTypeElement;
    category: AddSubAdminCategory;
}

export enum AddSubAdminCategory {
    AdminPermissionChangeEvent = "admin_permission_change_event",
    DatasheetFieldPermissionChangeEvent = "datasheet_field_permission_change_event",
    OrganizationChangeEvent = "organization_change_event",
}

export interface StoreShareNode {
    content:           string;
    online:            boolean;
    type:              NotificationsTypeElement[];
    sort:              string;
    show_in_audit_log: boolean;
    category:          CategoryElement[];
    name:              string;
}

export interface CountryCodeAndPhoneCode {
    phoneCode: string;
}

export interface Environment {
    integration: Integration;
    production:  Integration;
    staging:     Integration;
}

export interface Integration {
    env: string;
}

export interface SystemConfigInterfaceGuide {
    wizard: { [key: string]: Wizard };
    step:   { [key: string]: Step };
}

export interface Step {
    uiConfigId: string;
    uiType:     string;
    prev?:      string;
    backdrop?:  Backdrop;
    onPlay?:    string[];
    onNext?:    On[];
    next?:      Next;
    onPrev?:    On[];
    nextId?:    NextID;
    onSkip?:    On[];
    uiConfig:   string;
    onClose?:   string[];
    onTarget?:  On[];
    skipId?:    string;
    byEvent?:   string[];
    skip?:      string;
}

export enum Backdrop {
    AroundMask = "around_mask",
}

export enum Next {
    下一步 = "下一步",
    好的 = "好的",
    已完成添加 = "已完成添加",
    我知道了 = "我知道了",
    查看更多 = "查看更多",
    查看详情 = "查看详情",
    知道啦 = "知道啦",
    确定 = "确定",
    获取特殊优惠 = "获取特殊优惠",
}

export enum NextID {
    CheckDetail = "check_detail",
    ClaimSpecialOffer = "claim_special_offer",
    Confirm = "confirm",
    IKnewIt = "i_knew_it",
    Known = "known",
    NextStep = "next_step",
    Okay = "okay",
    PlayerContactUsConfirmBtn = "player_contact_us_confirm_btn",
    SeeMore = "see_more",
}

export enum On {
    ClearGuideAllUI = "clear_guide_all_ui()",
    ClearGuideUisPopover = "clear_guide_uis([\"popover\"])",
    OpenGuideNextStep = "open_guide_next_step()",
    OpenGuideNextStepClearAllPrevUITrue = "open_guide_next_step({\"clearAllPrevUi\":true})",
    OpenVikabyDefaultExpandMenuTrueVisibleTrue = "open_vikaby({\"defaultExpandMenu\": true, \"visible\": true})",
    SetWizardCompletedCurWizardTrue = "set_wizard_completed({\"curWizard\": true})",
    SkipAllWizards = "skip_all_wizards()",
    SkipCurrentWizard = "skip_current_wizard()",
    SkipCurrentWizardCurWizardCompletedTrue = "skip_current_wizard({\"curWizardCompleted\": true})",
}

export interface Wizard {
    completeIndex?:   number;
    player?:          WizardPlayer;
    steps?:           string;
    manualActions?:   string[];
    repeat?:          boolean;
    endTime?:         number;
    startTime?:       number;
    freeVCount?:      number;
    integral_action?: string;
}

export interface WizardPlayer {
    action: string[];
}

export interface Integral {
    rule: IntegralRule;
}

export interface IntegralRule {
    be_invited_to_reward:       BeInvitedToReward;
    complete_bind_email:        BeInvitedToReward;
    first_bind_email:           BeInvitedToReward;
    first_bind_phone:           BeInvitedToReward;
    fission_reward:             FissionReward;
    invitation_reward:          BeInvitedToReward;
    official_adjustment:        FissionReward;
    official_invitation_reward: BeInvitedToReward;
    redemption_code:            BeInvitedToReward;
    wallet_activity_reward:     FissionReward;
    wizard_reward:              BeInvitedToReward;
    wizard_video_reward:        BeInvitedToReward;
}

export interface BeInvitedToReward {
    action_code:            string;
    day_max_integral_value: number;
    display_name:           any[];
    online?:                boolean;
    integral_value:         number;
    notify?:                boolean;
    action_name:            string;
}

export interface FissionReward {
    action_code:  string;
    display_name: any[];
    online:       boolean;
    notify?:      boolean;
    action_name:  string;
}

export interface Locale {
    currency_name:    string;
    currency_symbol:  string;
    id:               string;
    strings_language: string;
    currency_code:    string;
    name:             string;
}

export interface SystemConfigInterfaceMarketplace {
    cli_9f3930dd7d7ad00c: CLI;
    cli_a08120b120fad00e: CLI;
    cli_9f614b454434500e: CLI;
    ina5200279359980055:  Ina;
    ina9134969049653777:  Ina;
    ina5645957505507647:  Ina;
}

export interface CLI {
    logo:            Image;
    env:             string[];
    disable:         boolean;
    app_info:        string;
    note:            string;
    app_name:        string;
    type:            string;
    app_description: string;
    id:              string;
    display_order:   number;
    image:           Image;
    app_id:          string;
    link_to_cms:     string;
    app_type:        string;
    btn_card:        BtnCard;
    modal:           CLI9F3930Dd7D7Ad00CModal;
}

export interface BtnCard {
    btn_text:          string;
    btn_action?:       string;
    btn_type:          string;
    btn_close_action?: string;
    apps_btn_text:     string;
}

export interface Image {
    id:       string;
    name:     string;
    size:     number;
    mimeType: MIMEType;
    token:    string;
    width:    number;
    height:   number;
    url:      string;
}

export enum MIMEType {
    ImagePNG = "image/png",
    ImageSVGXML = "image/svg+xml",
}

export interface CLI9F3930Dd7D7Ad00CModal {
    btn_text:        string;
    btn_action?:     string;
    app_description: string;
    btn_type:        string;
    help_link:       string;
}

export interface Ina {
    logo:            Image;
    env:             string[];
    app_info:        string;
    note:            string;
    app_name:        string;
    type:            string;
    app_description: string;
    id:              string;
    display_order:   number;
    image:           Image;
    app_id:          string;
    link_to_cms:     string;
    app_type:        string;
    btn_card:        BtnCard;
    modal:           CLI9F3930Dd7D7Ad00CModal;
}

export interface Notifications {
    types:     Types;
    templates: Templates;
}

export interface Templates {
    activity_integral_income_notify:             ActivityIntegralIncomeNotify;
    activity_integral_income_toadmin:            ActivityIntegralIncomeNotify;
    add_record_out_of_limit:                     AddRecordOutOfLimit;
    add_record_soon_to_be_limit:                 AddRecordOutOfLimit;
    add_sub_admin:                               AddRecordOutOfLimit;
    admin_transfer_space_widget_notify:          Notify;
    admin_unpublish_space_widget_notify:         Notify;
    apply_space_beta_feature_success_notify_all: ActivityIntegralIncomeNotify;
    apply_space_beta_feature_success_notify_me:  ActivityIntegralIncomeNotify;
    assigned_to_group:                           AddRecordOutOfLimit;
    assigned_to_role:                            AddRecordOutOfLimit;
    auto_cancel_record_subscription:             AutoCRecordSubscription;
    auto_create_record_subscription:             AutoCRecordSubscription;
    "automation-fail":                           AutomationFail;
    capacity_limit:                              AddRecordOutOfLimit;
    changed_ordinary_user:                       AddRecordOutOfLimit;
    comment_mentioned:                           CommentMentioned;
    common_system_notify:                        Notify;
    common_system_notify_web:                    CommonSystemNotifyWeb;
    datasheet_limit:                             AddRecordOutOfLimit;
    datasheet_record_limit:                      AddRecordOutOfLimit;
    integral_income_notify:                      ActivityIntegralIncomeNotify;
    invite_member_toadmin:                       AddRecordOutOfLimit;
    invite_member_tomyself:                      AddRecordOutOfLimit;
    invite_member_touser:                        AddRecordOutOfLimit;
    member_applied_to_close_account:             AddRecordOutOfLimit;
    new_space_widget_notify:                     AddRecordOutOfLimit;
    new_user_welcome_notify:                     AddRecordOutOfLimit;
    quit_space:                                  AddRecordOutOfLimit;
    remove_from_group:                           AddRecordOutOfLimit;
    remove_from_role:                            AddRecordOutOfLimit;
    removed_from_space_toadmin:                  AddRecordOutOfLimit;
    removed_from_space_touser:                   AddRecordOutOfLimit;
    removed_member_tomyself:                     AddRecordOutOfLimit;
    server_pre_publish:                          AddRecordOutOfLimit;
    single_record_comment_mentioned:             CommentMentioned;
    single_record_member_mention:                CommentMentioned;
    space_add_primary_admin:                     AddRecordOutOfLimit;
    space_admin_limit:                           AddRecordOutOfLimit;
    space_api_limit:                             AddRecordOutOfLimit;
    space_calendar_limit:                        AddRecordOutOfLimit;
    space_certification_fail_notify:             AddRecordOutOfLimit;
    space_certification_notify:                  AddRecordOutOfLimit;
    space_deleted:                               AddRecordOutOfLimit;
    space_dingtalk_notify:                       AddRecordOutOfLimit;
    space_field_permission_limit:                AddRecordOutOfLimit;
    space_file_permission_limit:                 AddRecordOutOfLimit;
    space_form_limit:                            AddRecordOutOfLimit;
    space_gantt_limit:                           AddRecordOutOfLimit;
    space_join_apply:                            AddRecordOutOfLimit;
    space_join_apply_approved:                   AddRecordOutOfLimit;
    space_join_apply_refused:                    AddRecordOutOfLimit;
    space_lark_notify:                           AddRecordOutOfLimit;
    space_members_limit:                         AddRecordOutOfLimit;
    space_mirror_limit:                          AddRecordOutOfLimit;
    space_name_change:                           AddRecordOutOfLimit;
    space_paid_notify:                           AddRecordOutOfLimit;
    space_rainbow_label_limit:                   AddRecordOutOfLimit;
    space_record_limit:                          AddRecordOutOfLimit;
    space_recover:                               AddRecordOutOfLimit;
    space_seats_limit:                           AddRecordOutOfLimit;
    space_subscription_end_notify:               AddRecordOutOfLimit;
    space_subscription_notify:                   AddRecordOutOfLimit;
    space_time_machine_limit:                    AddRecordOutOfLimit;
    space_trash_limit:                           AddRecordOutOfLimit;
    space_trial:                                 AddRecordOutOfLimit;
    space_watermark_notify:                      AddRecordOutOfLimit;
    space_wecom_api_trial_end:                   AddRecordOutOfLimit;
    space_wecom_notify:                          AddRecordOutOfLimit;
    space_yozooffice_notify:                     AddRecordOutOfLimit;
    subscribed_record_cell_updated:              CommentMentioned;
    subscribed_record_commented:                 CommentMentioned;
    "subscribed-record-archived":                AddRecordOutOfLimit;
    "subscribed-record-unarchived":              AddRecordOutOfLimit;
    task_reminder:                               AddRecordOutOfLimit;
    user_field:                                  CommentMentioned;
    web_publish:                                 CommonSystemNotifyWeb;
    workflow_execute_failed_notify:              AddRecordOutOfLimit;
}

export interface ActivityIntegralIncomeNotify {
    to_tag:                 ToTag;
    notifications_type:     NotificationsTypeElement;
    is_notification:        boolean;
    format_string:          string;
    notification_type:      NotificationType;
    is_component?:          boolean;
    can_jump?:              boolean;
    is_mail?:               boolean;
    mail_template_subject?: string;
}

export enum NotificationType {
    事务型消息TransactionalNotify = "事务型消息(transactional notify)",
    营销型消息MarketingNotify = "营销型消息(marketing notify)",
    通知型消息NotificationNotify = "通知型消息(notification notify)",
}

export enum ToTag {
    AllMembers = "all_members",
    AllUsers = "all_users",
    Members = "members",
    Myself = "myself",
    SpaceAdmins = "space_admins",
    SpaceMainAdmin = "space_main_admin",
    SpaceMemberAdmins = "space_member_admins",
    Users = "users",
}

export interface AddRecordOutOfLimit {
    can_jump?:              boolean;
    to_tag:                 ToTag;
    notifications_type:     NotificationsTypeElement;
    is_notification:        boolean;
    is_mail?:               boolean;
    mail_template_subject?: string;
    format_string?:         string;
    url?:                   URL;
    frequency?:             number;
    is_component?:          boolean;
    is_mobile?:             boolean;
    is_browser?:            boolean;
    notification_type?:     NotificationType;
    billing_notify?:        string;
    redirect_url?:          string;
    id?:                    string;
}

export enum URL {
    Management = "/management",
    Workbench = "/workbench",
}

export interface Notify {
    to_tag:             ToTag;
    notifications_type: NotificationsTypeElement;
    is_notification:    boolean;
    is_mail?:           boolean;
    is_browser:         boolean;
    format_string:      string;
    is_component:       boolean;
}

export interface AutoCRecordSubscription {
    can_jump:           boolean;
    to_tag:             ToTag;
    notifications_type: any[];
    is_notification:    boolean;
    is_browser:         boolean;
    format_string:      string;
    url:                URL;
}

export interface AutomationFail {
}

export interface CommentMentioned {
    can_jump:               boolean;
    to_tag:                 ToTag;
    notifications_type:     any[];
    is_notification:        boolean;
    is_mobile:              boolean;
    is_mail:                boolean;
    is_browser:             boolean;
    format_string:          string;
    url:                    URL;
    is_component?:          boolean;
    mail_template_subject?: string;
}

export interface CommonSystemNotifyWeb {
    to_tag:             ToTag;
    notifications_type: NotificationsTypeElement;
    format_string:      string;
    is_component:       boolean;
    is_mobile?:         boolean;
}

export interface Types {
    member: Member;
    record: Member;
    space:  Member;
    system: Member;
}

export interface Member {
    format_string: string;
    tag:           string;
}

export interface SystemConfigInterfacePlayer {
    trigger: Trigger[];
    events:  Events;
    rule:    RuleElement[];
    jobs:    Jobs;
    action:  Action[];
    tips:    Tips;
}

export interface Action {
    guide?:       ActionGuide;
    id:           string;
    command:      string;
    commandArgs?: string;
}

export interface ActionGuide {
    step: string[];
}

export interface Events {
    _:                                             AutomationFail;
    address_shown:                                 AddressShown;
    ai_create_ai_node:                             AICreateAINode;
    app_error_logger:                              AddressShown;
    app_modal_confirm:                             AddressShown;
    app_set_user_id:                               AddressShown;
    app_tracker:                                   AddressShown;
    datasheet_add_new_view:                        AddressShown;
    datasheet_create_mirror_tip:                   AICreateAINode;
    datasheet_dashboard_panel_shown:               AddressShown;
    datasheet_delete_record:                       AddressShown;
    datasheet_field_context_hidden:                AddressShown;
    datasheet_field_context_shown:                 AddressShown;
    datasheet_field_setting_hidden:                AICreateAINode;
    datasheet_field_setting_shown:                 AddressShown;
    datasheet_gantt_view_shown:                    AddressShown;
    datasheet_grid_view_shown:                     AICreateAINode;
    datasheet_org_has_link_field:                  AddressShown;
    datasheet_org_view_add_first_node:             AddressShown;
    datasheet_org_view_drag_to_unhandled_list:     AddressShown;
    datasheet_org_view_right_panel_shown:          AddressShown;
    datasheet_search_panel_hidden:                 AICreateAINode;
    datasheet_search_panel_shown:                  AICreateAINode;
    datasheet_shown:                               AddressShown;
    datasheet_user_menu:                           AddressShown;
    datasheet_widget_center_modal_shown:           AICreateAINode;
    datasheet_wigdet_empty_panel_shown:            AddressShown;
    get_context_menu_file_more:                    AddressShown;
    get_context_menu_folder_more:                  AddressShown;
    get_context_menu_root_add:                     AddressShown;
    get_nav_list:                                  AddressShown;
    guide_use_automation_first_time:               AddressShown;
    invite_entrance_modal_shown:                   AddressShown;
    questionnaire_shown:                           AddressShown;
    questionnaire_shown_after_sign:                AddressShown;
    space_setting_main_admin_shown:                AddressShown;
    space_setting_member_manage_shown:             AddressShown;
    space_setting_overview_shown:                  AddressShown;
    space_setting_sub_admin_shown:                 AddressShown;
    space_setting_workbench_shown:                 AddressShown;
    template_center_shown:                         AddressShown;
    template_detail_shown:                         AddressShown;
    template_use_confirm_modal_shown:              AddressShown;
    view_add_panel_shown:                          AddressShown;
    view_convert_gallery:                          AddressShown;
    view_notice_auto_save_true:                    AddressShown;
    view_notice_view_auto_false:                   AddressShown;
    viewset_manual_save_tip:                       AddressShown;
    workbench_create_form_bth_clicked:             AddressShown;
    workbench_create_form_panel_shown:             AddressShown;
    workbench_create_form_previewer_shown:         AICreateAINode;
    workbench_entry:                               AddressShown;
    workbench_folder_from_template_showcase_shown: AddressShown;
    workbench_folder_showcase_shown:               AddressShown;
    workbench_form_container_shown:                AddressShown;
    workbench_hidden_vikaby_btn_clicked:           AddressShown;
    workbench_no_emit:                             AddressShown;
    workbench_show_trial_tip:                      AddressShown;
    workbench_shown:                               AddressShown;
    workbench_space_list_shown:                    AddressShown;
}

export interface AddressShown {
    module: string;
    name:   string;
}

export interface AICreateAINode {
    module: string;
    guide:  ActionGuide;
    name:   string;
}

export interface Jobs {
    "15_days_recall": DaysRecall;
    "3_days_recall":  DaysRecall;
    "7_days_recall":  DaysRecall;
}

export interface DaysRecall {
    actions: any[];
    cron:    string;
}

export interface RuleElement {
    operator:      string;
    condition:     string;
    id:            string;
    conditionArgs: string;
}

export interface Tips {
    first_node_tips: FirstNodeTips;
}

export interface FirstNodeTips {
    description: string;
    title:       string;
    desc:        string;
}

export interface Trigger {
    actions:     string[];
    rules?:      string[];
    id:          string;
    event:       string[];
    eventState?: string;
    suspended?:  boolean;
}

export interface Settings {
    _build_branch:                                       BuildBranch;
    _build_id:                                           BuildBranch;
    _version_type:                                       BuildBranch;
    activity_center_end_time:                            BuildBranch;
    activity_center_url:                                 BuildBranch;
    activity_train_camp_end_time:                        BuildBranch;
    activity_train_camp_start_time:                      BuildBranch;
    agree_terms_of_service:                              BuildBranch;
    api_apiffox_patch_url:                               BuildBranch;
    api_apiffox_post_url:                                BuildBranch;
    api_apifox_delete_url:                               BuildBranch;
    api_apifox_get_url:                                  BuildBranch;
    api_apifox_upload_url:                               BuildBranch;
    api_times_per_day:                                   BuildBranch;
    api_times_per_hour:                                  BuildBranch;
    api_times_per_minute:                                BuildBranch;
    api_times_per_second:                                BuildBranch;
    apitable_login_logo:                                 BuildBranch;
    assistant:                                           BuildBranch;
    assistant_activity_train_camp_end_time:              BuildBranch;
    assistant_activity_train_camp_start_time:            BuildBranch;
    assistant_ai_course_url:                             BuildBranch;
    assistant_release_history_url:                       BuildBranch;
    automation_action_send_msg_to_dingtalk:              BuildBranch;
    automation_action_send_msg_to_feishu:                BuildBranch;
    automation_action_send_msg_to_wecom:                 BuildBranch;
    billing_default_billing_period:                      BuildBranch;
    billing_default_grade:                               BuildBranch;
    billing_default_seats:                               BuildBranch;
    billing_enterprise_qr_code:                          BuildBranch;
    billing_pay_contact_us:                              BuildBranch;
    billing_pay_success_qr_code:                         BuildBranch;
    datasheet_max_view_count_per_sheet:                  BuildBranch;
    datasheet_unlogin_user_avatar:                       BuildBranch;
    delete_account_step1_cover:                          BuildBranch;
    delete_account_step2_email_icon:                     BuildBranch;
    delete_account_step2_mobile_icon:                    BuildBranch;
    education_url:                                       BuildBranch;
    email_icon:                                          BuildBranch;
    emoji_apple_32:                                      BuildBranch;
    emoji_apple_64:                                      BuildBranch;
    experimental_features_unsynchronized_view_intro_img: BuildBranch;
    field_cascade:                                       BuildBranch;
    github_icon:                                         BuildBranch;
    grades_info:                                         BuildBranch;
    help_assistant:                                      BuildBranch;
    help_contact_us_type:                                BuildBranch;
    help_developers_center_url:                          BuildBranch;
    help_download_app:                                   BuildBranch;
    help_join_chatgroup_url:                             BuildBranch;
    help_official_website_url:                           BuildBranch;
    help_product_roadmap_url:                            BuildBranch;
    help_solution_url:                                   BuildBranch;
    help_subscribe_demonstrate_form_url:                 BuildBranch;
    help_user_community_url:                             BuildBranch;
    help_user_community_url_dev:                         BuildBranch;
    help_user_community_url_prod:                        BuildBranch;
    help_user_feedback_url:                              BuildBranch;
    help_video_tutorials_url:                            BuildBranch;
    integration_apifox_url:                              BuildBranch;
    integration_dingtalk_da:                             BuildBranch;
    integration_dingtalk_help_url:                       IntegrationHelpURL;
    integration_dingtalk_upgrade_url:                    BuildBranch;
    integration_feishu_help:                             BuildBranch;
    integration_feishu_help_url:                         IntegrationHelpURL;
    integration_feishu_manage_open_url:                  BuildBranch;
    integration_feishu_seats_form_url:                   BuildBranch;
    integration_feishu_upgrade_url:                      BuildBranch;
    integration_feishu_upgrade_url_dev:                  BuildBranch;
    integration_feisu_register_now_url:                  BuildBranch;
    integration_wecom_bind_help_center:                  BuildBranch;
    integration_wecom_bind_help_center_url:              BuildBranch;
    integration_wecom_bind_success_icon_img:             BuildBranch;
    integration_wecom_custom_subdomain_help_url:         BuildBranch;
    integration_wecom_help_url:                          IntegrationHelpURL;
    integration_wecom_login_qrcode_js:                   BuildBranch;
    integration_wecom_qrcode_css:                        BuildBranch;
    integration_wecom_shop_cms:                          BuildBranch;
    integration_wecom_shop_corpid_dev:                   BuildBranch;
    integration_wecom_shop_corpid_prod:                  BuildBranch;
    integration_wecom_shop_corpid_staging:               BuildBranch;
    integration_wecom_shop_corpid_test:                  BuildBranch;
    integration_wecom_shop_suiteid_dev:                  BuildBranch;
    integration_wecom_shop_suiteid_prod:                 BuildBranch;
    integration_wecom_shop_suiteid_staging:              BuildBranch;
    integration_wecom_shop_suiteid_test:                 BuildBranch;
    integration_wecom_upgrade_guide_url:                 BuildBranch;
    integration_yozosoft_help_url:                       IntegrationHelpURL;
    introduction_video:                                  BuildBranch;
    linkedin_icon:                                       BuildBranch;
    login_agree_terms_of_service:                        BuildBranch;
    login_icp1_url:                                      BuildBranch;
    login_icp2_url:                                      BuildBranch;
    login_introduction_video:                            BuildBranch;
    login_join_chatgroup_url:                            BuildBranch;
    login_privacy_policy:                                BuildBranch;
    login_private_deployment_form_url:                   BuildBranch;
    login_service_agreement:                             BuildBranch;
    official_avatar:                                     BuildBranch;
    page_apply_logout:                                   BuildBranch;
    page_apply_logout_bg:                                BuildBranch;
    permission_config_in_workbench_page:                 BuildBranch;
    quick_search_default_dark:                           BuildBranch;
    quick_search_default_light:                          BuildBranch;
    server_error_page_bg:                                BuildBranch;
    share_iframe_brand:                                  BuildBranch;
    share_iframe_brand_dark:                             BuildBranch;
    space_setting_integrations_dingtalk:                 BuildBranch;
    space_setting_integrations_feishu:                   BuildBranch;
    space_setting_integrations_preview_office_file:      BuildBranch;
    space_setting_integrations_wecom:                    BuildBranch;
    space_setting_invite_user_to_get_v_coins:            BuildBranch;
    space_setting_list_of_enable_all_lab_features:       BuildBranch;
    space_setting_role_empty_img:                        BuildBranch;
    space_setting_upgrade:                               BuildBranch;
    system_configuration_logo_with_name_white_font:      BuildBranch;
    system_configuration_minmum_version_require:         BuildBranch;
    system_configuration_server_error_bg_img:            BuildBranch;
    system_configuration_version:                        BuildBranch;
    twitter_icon:                                        BuildBranch;
    user_account_deleted_bg_img:                         BuildBranch;
    user_account_deleted_img:                            BuildBranch;
    user_guide_welcome_developer_center_url:             BuildBranch;
    user_guide_welcome_introduction_video:               BuildBranch;
    user_guide_welcome_quick_start_video:                BuildBranch;
    user_guide_welcome_template1_icon:                   BuildBranch;
    user_guide_welcome_template1_url:                    BuildBranch;
    user_guide_welcome_template2_icon:                   BuildBranch;
    user_guide_welcome_template2_url:                    BuildBranch;
    user_guide_welcome_template3_icon:                   BuildBranch;
    user_guide_welcome_template3_url:                    BuildBranch;
    user_guide_welcome_what_is_datasheet_video:          BuildBranch;
    user_setting_account_bind:                           BuildBranch;
    user_setting_account_bind_dingtalk:                  BuildBranch;
    user_setting_account_bind_qq:                        BuildBranch;
    user_setting_account_bind_wechat:                    BuildBranch;
    user_setting_default_avatar:                         BuildBranch;
    view_architecture_empty_graphics_img:                BuildBranch;
    view_architecture_empty_record_list_img:             BuildBranch;
    view_architecture_guide_video:                       BuildBranch;
    view_calendar_guide_create:                          BuildBranch;
    view_calendar_guide_no_permission:                   BuildBranch;
    view_calendar_guide_video:                           BuildBranch;
    view_form_guide_video:                               BuildBranch;
    view_gallery_guide_video:                            BuildBranch;
    view_gantt_guide_video:                              BuildBranch;
    view_grid_guide_video:                               BuildBranch;
    view_kanban_guide_video:                             BuildBranch;
    view_mirror_list_empty_img:                          BuildBranch;
    widget_center_feature_not_unturned_on_img:           BuildBranch;
    widget_center_help_link:                             BuildBranch;
    widget_center_space_widget_empty_img:                BuildBranch;
    widget_cli_miumum_version:                           BuildBranch;
    widget_custom_widget_empty_img:                      BuildBranch;
    widget_default_cover_img:                            BuildBranch;
    widget_panel_empty_img:                              BuildBranch;
    workbench_folder_default_cover_list:                 BuildBranch;
    workbench_max_node_number_show_invite_and_new_node:  BuildBranch;
    workbench_no_permission_img:                         BuildBranch;
}

export interface BuildBranch {
    value: string;
}

export interface IntegrationHelpURL {
    value:       string;
    marketplace: IntegrationDingtalkHelpURLMarketplace;
}

export interface IntegrationDingtalkHelpURLMarketplace {
    integration: string;
}

export interface ShortcutKey {
    show?:        boolean;
    key:          string;
    winKey:       string;
    name?:        string[];
    when?:        string;
    id:           string;
    command:      string;
    description?: string;
    type?:        ShortcutKeyType[];
}

export enum ShortcutKeyType {
    GalleryViewShortcuts = "gallery_view_shortcuts",
    GirdViewShortcuts = "gird_view_shortcuts",
    GlobalShortcuts = "global_shortcuts",
    WorkbenckShortcuts = "workbenck_shortcuts",
}

export interface TestFunction {
    async_compute:    AsyncCompute;
    render_prompt:    AsyncCompute;
    robot:            AsyncCompute;
    widget_center:    AsyncCompute;
    render_normal:    AsyncCompute;
    view_manual_save: AsyncCompute;
}

export interface AsyncCompute {
    feature_name: string;
    logo:         string;
    id:           string;
    note:         string;
    feature_key:  string;
    modal:        AsyncComputeModal;
    card:         Card;
}

export interface Card {
    btn_open_action:  string;
    info:             string;
    info的副本:          string;
    btn_close_action: string;
    btn_text:         string;
    btn_type:         string;
}

export interface AsyncComputeModal {
    btn_text:    string;
    info:        string;
    btn_action?: string;
    btn_type:    string;
    info的副本:     string;
    info_image:  string;
}
