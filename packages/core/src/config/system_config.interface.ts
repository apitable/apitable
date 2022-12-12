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
    notifications:               SystemConfigInterfaceNotifications;
    integral:                    Integral;
    billing:                     Billing;
}

export interface APIPanel {
    defaultExampleId: string;
    description:      string;
    descriptionId:    string;
    defaultExample:   string;
    valueType:        string;
}

export interface Audit {
    actual_delete_space:       ActualDeleteSpace;
    add_field_role:            ActualDeleteSpace;
    add_node_role:             AddNodeRole;
    add_sub_admin:             AddTeamToMemberClass;
    add_team_to_member:        AddTeamToMemberClass;
    agree_user_apply:          AddTeamToMemberClass;
    cancel_delete_space:       ActualDeleteSpace;
    change_main_admin:         AddTeamToMemberClass;
    copy_node:                 AddNodeRole;
    create_node:               AddNodeRole;
    create_space:              ActualDeleteSpace;
    create_team:               AddTeamToMemberClass;
    create_template:           ActualDeleteSpace;
    delete_field_role:         ActualDeleteSpace;
    delete_node:               AddNodeRole;
    delete_node_role:          AddNodeRole;
    delete_rubbish_node:       ActualDeleteSpace;
    delete_space:              ActualDeleteSpace;
    delete_sub_admin:          AddTeamToMemberClass;
    delete_team:               AddTeamToMemberClass;
    delete_template:           ActualDeleteSpace;
    disable_field_role:        ActualDeleteSpace;
    disable_node_role:         AddNodeRole;
    disable_node_share:        AddNodeRole;
    enable_field_role:         ActualDeleteSpace;
    enable_node_role:          AddNodeRole;
    enable_node_share:         AddNodeRole;
    export_node:               ActualDeleteSpace;
    import_node:               AddNodeRole;
    invite_user_join_by_email: ActualDeleteSpace;
    move_node:                 AddNodeRole;
    quote_template:            ActualDeleteSpace;
    recover_rubbish_node:      AddNodeRole;
    remove_member_from_team:   AddTeamToMemberClass;
    remove_user:               AddTeamToMemberClass;
    rename_node:               AddNodeRole;
    rename_space:              ActualDeleteSpace;
    sort_node:                 ActualDeleteSpace;
    store_share_node:          AddNodeRole;
    update_field_role:         ActualDeleteSpace;
    update_field_role_setting: AddTeamToMemberClass;
    update_member_property:    AddTeamToMemberClass;
    update_member_team:        AddTeamToMemberClass;
    update_node_cover:         ActualDeleteSpace;
    update_node_desc:          ActualDeleteSpace;
    update_node_icon:          ActualDeleteSpace;
    update_node_role:          AddNodeRole;
    update_node_share_setting: AddNodeRole;
    update_space_logo:         ActualDeleteSpace;
    update_sub_admin_role:     AddTeamToMemberClass;
    update_team_property:      AddTeamToMemberClass;
    user_leave_space:          ActualDeleteSpace;
    user_login:                ActualDeleteSpace;
    user_logout:               ActualDeleteSpace;
}

export interface ActualDeleteSpace {
    content:  string;
    online?:  boolean;
    type:     NotificationsTypeEnum;
    category: string;
    name:     string;
}

export enum NotificationsTypeEnum {
    Member = "member",
    Space = "space",
    System = "system",
}

export interface AddNodeRole {
    content:           string;
    online:            boolean;
    type:              NotificationsTypeEnum;
    sort:              string;
    show_in_audit_log: boolean;
    category:          AddNodeRoleCategory;
    name:              string;
}

export enum AddNodeRoleCategory {
    WorkCatalogChangeEvent = "work_catalog_change_event",
    WorkCatalogPermissionChangeEvent = "work_catalog_permission_change_event",
    WorkCatalogShareEvent = "work_catalog_share_event",
}

export interface AddTeamToMemberClass {
    type:     NotificationsTypeEnum;
    category: AddSubAdminCategory;
}

export enum AddSubAdminCategory {
    AdminPermissionChangeEvent = "admin_permission_change_event",
    DatasheetFieldPermissionChangeEvent = "datasheet_field_permission_change_event",
    OrganizationChangeEvent = "organization_change_event",
}

export interface Billing {
    products: { [key: string]: Product };
    notify:   { [key: string]: Notify };
}

export interface Notify {
    id:                    string;
    link_string_id:        string[];
    引用名称:                  string;
    模板名称:                  string;
    link_notification_id?: string[];
}

export interface Product {
    ch_name:  string;
    id:       string;
    category: ProductCategory;
    en_name:  string;
    online?:  boolean;
    i18nName: string;
    channel:  string;
    name:     string[];
    free?:    boolean;
}

export enum ProductCategory {
    AddOn = "Add-on",
    Base = "BASE",
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
    uiType:     UIType;
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
    byEvent?:   string[];
    skipId?:    string;
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
}

export enum NextID {
    CheckDetail = "check_detail",
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

export enum UIType {
    AfterSignNPS = "afterSignNPS",
    Breath = "breath",
    ContactUs = "contactUs",
    CustomQuestionnaire = "customQuestionnaire",
    Modal = "modal",
    Notice = "notice",
    Popover = "popover",
    PrivacyModal = "privacyModal",
    Questionnaire = "questionnaire",
    Slideout = "slideout",
    TaskList = "taskList",
}

export interface Wizard {
    completeIndex?:   number;
    steps?:           string;
    player?:          WizardPlayer;
    repeat?:          boolean;
    endTime?:         number;
    startTime?:       number;
    successMsg?:      string;
    freeVCount?:      number;
    integral_action?: string;
    manualActions?:   string[];
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
    display_name:           string[];
    online?:                boolean;
    integral_value:         number;
    notify?:                boolean;
    action_name:            string;
}

export interface FissionReward {
    action_code:  string;
    display_name: string[];
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

export interface SystemConfigInterfaceNotifications {
    types:     Types;
    templates: Templates;
}

export interface Templates {
    add_sub_admin:                               AssignedToGroupClass;
    assigned_to_group:                           AssignedToGroupClass;
    assigned_to_role:                            AssignedToGroupClass;
    changed_ordinary_user:                       ActivityIntegralIncomeNotify;
    invite_member_toadmin:                       ActivityIntegralIncomeNotify;
    invite_member_tomyself:                      ActivityIntegralIncomeNotify;
    invite_member_touser:                        ActivityIntegralIncomeNotify;
    member_applied_to_close_account:             ActivityIntegralIncomeNotify;
    quit_space:                                  ActivityIntegralIncomeNotify;
    remove_from_group:                           ActivityIntegralIncomeNotify;
    remove_from_role:                            ActivityIntegralIncomeNotify;
    removed_from_space_toadmin:                  ActivityIntegralIncomeNotify;
    removed_from_space_touser:                   ActivityIntegralIncomeNotify;
    removed_member_tomyself:                     ActivityIntegralIncomeNotify;
    space_add_primary_admin:                     AssignedToGroupClass;
    space_join_apply:                            AssignedToGroupClass;
    space_join_apply_approved:                   AssignedToGroupClass;
    space_join_apply_refused:                    AssignedToGroupClass;
    comment_mentioned:                           CommentMentioned;
    single_record_comment_mentioned:             CommentMentioned;
    single_record_member_mention:                CommentMentioned;
    subscribed_record_cell_updated:              CommentMentioned;
    subscribed_record_commented:                 CommentMentioned;
    user_field:                                  CommentMentioned;
    apply_space_beta_feature_success_notify_all: ActivityIntegralIncomeNotify;
    apply_space_beta_feature_success_notify_me:  ActivityIntegralIncomeNotify;
    capacity_limit:                              AddRecordOutOfLimit;
    datasheet_limit:                             AddRecordOutOfLimit;
    datasheet_record_limit:                      AddRecordOutOfLimit;
    space_admin_limit:                           AddRecordOutOfLimit;
    space_api_limit:                             AddRecordOutOfLimit;
    space_calendar_limit:                        AddRecordOutOfLimit;
    space_certification_fail_notify:             AssignedToGroupClass;
    space_certification_notify:                  AssignedToGroupClass;
    space_deleted:                               AssignedToGroupClass;
    space_dingtalk_notify:                       AssignedToGroupClass;
    space_field_permission_limit:                AssignedToGroupClass;
    space_file_permission_limit:                 AssignedToGroupClass;
    space_form_limit:                            AssignedToGroupClass;
    space_gantt_limit:                           AssignedToGroupClass;
    space_lark_notify:                           AssignedToGroupClass;
    space_members_limit:                         AssignedToGroupClass;
    space_mirror_limit:                          AssignedToGroupClass;
    space_name_change:                           AssignedToGroupClass;
    space_paid_notify:                           AssignedToGroupClass;
    space_rainbow_label_limit:                   AssignedToGroupClass;
    space_record_limit:                          AssignedToGroupClass;
    space_recover:                               AssignedToGroupClass;
    space_seats_limit:                           AssignedToGroupClass;
    space_subscription_end_notify:               AssignedToGroupClass;
    space_subscription_notify:                   AssignedToGroupClass;
    space_time_machine_limit:                    AssignedToGroupClass;
    space_trash_limit:                           AssignedToGroupClass;
    space_trial:                                 AssignedToGroupClass;
    space_vika_paid_notify:                      AssignedToGroupClass;
    space_watermark_notify:                      AssignedToGroupClass;
    space_wecom_api_trial_end:                   AssignedToGroupClass;
    space_wecom_notify:                          AssignedToGroupClass;
    space_yozooffice_notify:                     AssignedToGroupClass;
    task_reminder:                               AddRecordOutOfLimit;
    activity_integral_income_notify:             ActivityIntegralIncomeNotify;
    activity_integral_income_toadmin:            ActivityIntegralIncomeNotify;
    add_record_out_of_limit:                     AddRecordOutOfLimit;
    add_record_soon_to_be_limit:                 AddRecordOutOfLimit;
    admin_transfer_space_widget_notify:          ActivityIntegralIncomeNotify;
    admin_unpublish_space_widget_notify:         ActivityIntegralIncomeNotify;
    common_system_notify:                        ActivityIntegralIncomeNotify;
    common_system_notify_web:                    ActivityIntegralIncomeNotify;
    integral_income_notify:                      ActivityIntegralIncomeNotify;
    new_space_widget_notify:                     ActivityIntegralIncomeNotify;
    new_user_welcome_notify:                     ActivityIntegralIncomeNotify;
    server_pre_publish:                          ActivityIntegralIncomeNotify;
    web_publish:                                 ActivityIntegralIncomeNotify;
}

export interface ActivityIntegralIncomeNotify {
    to_tag:             string;
    notifications_type: NotificationsTypeEnum;
    formatString:       string[];
    is_notification?:   boolean;
    format_string:      string;
    is_component?:      boolean;
    is_mail?:           boolean;
    is_browser?:        boolean;
    can_jump?:          boolean;
    is_mobile?:         boolean;
    url?:               string;
}

export interface AddRecordOutOfLimit {
    can_jump:              boolean;
    to_tag:                ToTag;
    notifications_type:    NotificationsTypeEnum;
    formatString:          string[];
    is_notification:       boolean;
    is_mail:               boolean;
    mail_template_subject: string;
    format_string:         string;
    url:                   URL;
    frequency?:            number;
    is_component:          boolean;
    is_browser?:           boolean;
    billing_notify?:       any[];
    is_mobile?:            boolean;
    notifications?:        AddRecordOutOfLimitNotifications;
}

export interface AddRecordOutOfLimitNotifications {
    "social_templates copy": string[];
}

export enum ToTag {
    AllMembers = "all_members",
    Members = "members",
    SpaceAdmins = "space_admins",
    SpaceMemberAdmins = "space_member_admins",
    Users = "users",
}

export enum URL {
    Management = "/management",
    Workbench = "/workbench",
}

export interface AssignedToGroupClass {
    can_jump?:              boolean;
    to_tag:                 ToTag;
    notifications_type:     NotificationsTypeEnum;
    formatString?:          string[];
    is_notification:        boolean;
    is_mobile?:             boolean;
    is_browser?:            boolean;
    format_string?:         string;
    url?:                   URL;
    is_component?:          boolean;
    is_mail?:               boolean;
    billing_notify?:        any[];
    mail_template_subject?: string;
    frequency?:             number;
}

export interface CommentMentioned {
    can_jump:               boolean;
    to_tag:                 ToTag;
    notifications_type:     any[];
    formatString:           string[];
    is_notification:        boolean;
    is_mobile:              boolean;
    is_mail:                boolean;
    is_browser:             boolean;
    format_string:          string;
    url:                    URL;
    is_component?:          boolean;
    mail_template_subject?: string;
    notifications?:         AddRecordOutOfLimitNotifications;
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
    id:           string;
    command:      string;
    guide?:       ActionGuide;
    commandArgs?: string;
}

export interface ActionGuide {
    step: string[];
}

export interface Events {
    _:                                             Icp1;
    address_shown:                                 AddressShown;
    app_error_logger:                              AddressShown;
    app_modal_confirm:                             AddressShown;
    app_set_user_id:                               AddressShown;
    app_tracker:                                   AddressShown;
    datasheet_add_new_view:                        AddressShown;
    datasheet_dashboard_panel_shown:               AddressShown;
    datasheet_delete_record:                       AddressShown;
    datasheet_field_context_hidden:                AddressShown;
    datasheet_field_context_shown:                 AddressShown;
    datasheet_field_setting_hidden:                DatasheetFieldSettingHidden;
    datasheet_field_setting_shown:                 AddressShown;
    datasheet_gantt_view_shown:                    AddressShown;
    datasheet_grid_view_shown:                     DatasheetFieldSettingHidden;
    datasheet_org_has_link_field:                  AddressShown;
    datasheet_org_view_add_first_node:             AddressShown;
    datasheet_org_view_drag_to_unhandled_list:     AddressShown;
    datasheet_org_view_right_panel_shown:          AddressShown;
    datasheet_search_panel_hidden:                 DatasheetFieldSettingHidden;
    datasheet_search_panel_shown:                  AddressShown;
    datasheet_shown:                               AddressShown;
    datasheet_user_menu:                           AddressShown;
    datasheet_widget_center_modal_shown:           DatasheetFieldSettingHidden;
    datasheet_wigdet_empty_panel_shown:            AddressShown;
    get_context_menu_file_more:                    AddressShown;
    get_context_menu_folder_more:                  AddressShown;
    get_context_menu_root_add:                     AddressShown;
    get_nav_list:                                  AddressShown;
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
    workbench_create_form_previewer_shown:         DatasheetFieldSettingHidden;
    workbench_entry:                               AddressShown;
    workbench_folder_from_template_showcase_shown: AddressShown;
    workbench_folder_showcase_shown:               AddressShown;
    workbench_form_container_shown:                AddressShown;
    workbench_hidden_vikaby_btn_clicked:           AddressShown;
    workbench_no_emit:                             AddressShown;
    workbench_shown:                               AddressShown;
    workbench_space_list_shown:                    AddressShown;
}

export interface Icp1 {
}

export interface AddressShown {
    module: string;
    name:   string;
}

export interface DatasheetFieldSettingHidden {
    module: string;
    name:   string;
    guide:  ActionGuide;
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
    rules:       string[];
    id:          string;
    event:       string[];
    eventState?: string;
    suspended?:  boolean;
}

export interface Settings {
    _build_branch:                                       Qny1;
    _build_id:                                           Qny1;
    _version_type:                                       Qny1;
    activity_center_end_time:                            Qny1;
    activity_center_url:                                 Qny1;
    activity_train_camp_end_time:                        Qny1;
    activity_train_camp_start_time:                      Qny1;
    agree_terms_of_service:                              Qny1;
    api_apiffox_patch_url:                               Qny1;
    api_apiffox_post_url:                                Qny1;
    api_apifox_delete_url:                               Qny1;
    api_apifox_get_url:                                  Qny1;
    api_apifox_upload_url:                               Qny1;
    api_panel_help_url:                                  Qny1;
    api_times_per_day:                                   Qny1;
    api_times_per_hour:                                  Qny1;
    api_times_per_minute:                                Qny1;
    api_times_per_second:                                Qny1;
    assistant:                                           Qny1;
    assistant_activity_train_camp_end_time:              Qny1;
    assistant_activity_train_camp_start_time:            Qny1;
    assistant_ai_course_url:                             Qny1;
    assistant_release_history_url:                       Qny1;
    automation_action_send_msg_to_dingtalk:              Qny1;
    automation_action_send_msg_to_feishu:                Qny1;
    automation_action_send_msg_to_wecom:                 Qny1;
    billing_default_billing_period:                      Qny1;
    billing_default_grade:                               Qny1;
    billing_default_seats:                               Qny1;
    billing_enterprise_qr_code:                          Qny1;
    billing_pay_contact_us:                              Qny1;
    billing_pay_success_qr_code:                         Qny1;
    billing_space_upgrade_url:                           Qny1;
    datasheet_max_view_count_per_sheet:                  Qny1;
    datasheet_unlogin_user_avatar:                       Qny1;
    delete_account_step1_cover:                          Qny1;
    delete_account_step2_email_icon:                     Qny1;
    delete_account_step2_mobile_icon:                    Qny1;
    dingtalk_login_appid_dev:                            Qny1;
    dingtalk_login_appid_prod:                           Qny1;
    education_url:                                       Qny1;
    emoji_database_32:                                   Qny1;
    emoji_database_64:                                   Qny1;
    experimental_features_unsynchronized_view_intro_img: Qny1;
    feishu_login_appid:                                  Qny1;
    field_cascade:                                       Qny1;
    grades_info:                                         Qny1;
    help_assistant:                                      Qny1;
    help_contact_us_type:                                Qny1;
    help_developers_center_url:                          Qny1;
    help_download_app:                                   Qny1;
    help_join_chatgroup_url:                             Qny1;
    help_official_website_url:                           Qny1;
    help_product_roadmap_url:                            Qny1;
    help_solution_url:                                   Qny1;
    help_subscribe_demonstrate_form_url:                 Qny1;
    help_user_community_url:                             Qny1;
    help_user_community_url_dev:                         Qny1;
    help_user_community_url_prod:                        Qny1;
    help_user_feedback_url:                              Qny1;
    help_video_tutorials_url:                            Qny1;
    icp1:                                                Icp1;
    integration_apifox_url:                              Qny1;
    integration_dingtalk_da:                             Qny1;
    integration_dingtalk_help_url:                       IntegrationHelpURL;
    integration_dingtalk_login_appid_dev:                Qny1;
    integration_dingtalk_login_appid_prod:               Qny1;
    integration_dingtalk_login_appid_staging:            Qny1;
    integration_dingtalk_upgrade_url:                    Qny1;
    integration_feishu_help:                             Qny1;
    integration_feishu_help_url:                         IntegrationHelpURL;
    integration_feishu_login_appid:                      Qny1;
    integration_feishu_login_appid_dev:                  Qny1;
    integration_feishu_login_appid_prod:                 Qny1;
    integration_feishu_login_appid_staging:              Qny1;
    integration_feishu_manage_open_url:                  Qny1;
    integration_feishu_seats_form_url:                   Qny1;
    integration_feishu_upgrade_url:                      Qny1;
    integration_feishu_upgrade_url_dev:                  Qny1;
    integration_feisu_register_now_url:                  Qny1;
    integration_wecom_bind_help_center:                  Qny1;
    integration_wecom_bind_help_center_url:              Qny1;
    integration_wecom_bind_success_icon_img:             Qny1;
    integration_wecom_custom_subdomain_help_url:         Qny1;
    integration_wecom_help_url:                          IntegrationHelpURL;
    integration_wecom_login_qrcode_js:                   Qny1;
    integration_wecom_qrcode_css:                        Qny1;
    integration_wecom_shop_cms:                          Qny1;
    integration_wecom_shop_corpid_dev:                   Qny1;
    integration_wecom_shop_corpid_prod:                  Qny1;
    integration_wecom_shop_corpid_staging:               Qny1;
    integration_wecom_shop_corpid_test:                  Qny1;
    integration_wecom_shop_suiteid_dev:                  Qny1;
    integration_wecom_shop_suiteid_prod:                 Qny1;
    integration_wecom_shop_suiteid_staging:              Qny1;
    integration_wecom_shop_suiteid_test:                 Qny1;
    integration_wecom_upgrade_guide_url:                 Qny1;
    integration_yozosoft_help_url:                       IntegrationHelpURL;
    introduction_video:                                  Qny1;
    login_agree_terms_of_service:                        Qny1;
    login_icp1_url:                                      Qny1;
    login_icp2_url:                                      Qny1;
    login_introduction_video:                            Qny1;
    login_join_chatgroup_url:                            Qny1;
    login_privacy_policy:                                Qny1;
    login_privacy_policy_url:                            Qny1;
    login_private_deployment_form_url:                   Qny1;
    login_service_agreement:                             Qny1;
    login_service_agreement_url:                         Qny1;
    official_avatar:                                     Qny1;
    onboarding_customer_service_background_img_url:      Qny1;
    onboarding_customer_service_qrcode_avatar_img_url:   Qny1;
    page_apply_logout:                                   Qny1;
    page_apply_logout_bg:                                Qny1;
    permission_config_in_workbench_page:                 Qny1;
    QNY1:                                                Qny1;
    QNY2:                                                Qny1;
    QNY3:                                                Qny1;
    record_comments_help_url:                            Qny1;
    server_error_page_bg:                                Qny1;
    share_iframe_brand:                                  Qny1;
    share_iframe_brand_dark:                             Qny1;
    space_enterprise_certification_form:                 Qny1;
    space_setting_integrations_dingtalk:                 Qny1;
    space_setting_integrations_feishu:                   Qny1;
    space_setting_integrations_preview_office_file:      Qny1;
    space_setting_integrations_wecom:                    Qny1;
    space_setting_invite_user_to_get_v_coins:            Qny1;
    space_setting_list_of_enable_all_lab_features:       Qny1;
    space_setting_role_empty_img:                        Qny1;
    space_setting_role_help_url:                         Qny1;
    space_setting_upgrade:                               Qny1;
    system_configuration_default_language:               Qny1;
    system_configuration_default_theme:                  Qny1;
    system_configuration_error_msg_qrcode:               Qny1;
    system_configuration_logo_with_name_white_font:      Qny1;
    system_configuration_minmum_version_require:         Qny1;
    system_configuration_official_avatar:                Qny1;
    system_configuration_official_logo:                  Qny1;
    system_configuration_server_error_bg_img:            Qny1;
    system_configuration_version:                        Qny1;
    template_feedback_form_url:                          Qny1;
    template_space_id:                                   Qny1;
    user_account_deleted_bg_img:                         Qny1;
    user_account_deleted_img:                            Qny1;
    user_guide_welcome_developer_center_url:             Qny1;
    user_guide_welcome_faq_url:                          Qny1;
    user_guide_welcome_introduction_video:               Qny1;
    user_guide_welcome_product_manual_url:               Qny1;
    user_guide_welcome_quick_start_video:                Qny1;
    user_guide_welcome_template1_icon:                   Qny1;
    user_guide_welcome_template1_url:                    Qny1;
    user_guide_welcome_template2_icon:                   Qny1;
    user_guide_welcome_template2_url:                    Qny1;
    user_guide_welcome_template3_icon:                   Qny1;
    user_guide_welcome_template3_url:                    Qny1;
    user_guide_welcome_what_is_datasheet_video:          Qny1;
    user_setting_account_bind:                           Qny1;
    user_setting_account_bind_dingtalk:                  Qny1;
    user_setting_account_bind_qq:                        Qny1;
    user_setting_account_bind_qq_web_appid_dev:          Qny1;
    user_setting_account_bind_qq_web_appid_prod:         Qny1;
    user_setting_account_bind_qq_web_appid_staging:      Qny1;
    user_setting_account_bind_wechat:                    Qny1;
    user_setting_account_bind_wechat_appid_dev:          Qny1;
    user_setting_account_bind_wechat_appid_prod:         Qny1;
    user_setting_account_bind_wechat_appid_staging:      Qny1;
    user_setting_account_wallet_help_url:                Qny1;
    user_setting_default_avatar:                         Qny1;
    user_setting_delete_account_help_url:                Qny1;
    view_architecture_empty_graphics_img:                Qny1;
    view_architecture_empty_record_list_img:             Qny1;
    view_architecture_guide_video:                       Qny1;
    view_architecture_setting_help_url:                  Qny1;
    view_calendar_guide_create:                          Qny1;
    view_calendar_guide_no_permission:                   Qny1;
    view_calendar_guide_video:                           Qny1;
    view_calendar_setting_help_url:                      Qny1;
    view_form_guide_video:                               Qny1;
    view_gallery_guide_video:                            Qny1;
    view_gantt_config_color_help_url:                    Qny1;
    view_gantt_guide_video:                              Qny1;
    view_gantt_set_task_relation_help_url:               Qny1;
    view_grid_guide_video:                               Qny1;
    view_kanban_guide_video:                             Qny1;
    view_mirror_list_empty_img:                          Qny1;
    widget_center_feature_not_unturned_on_img:           Qny1;
    widget_center_help_link:                             Qny1;
    widget_center_help_url:                              Qny1;
    widget_center_space_widget_empty_img:                Qny1;
    widget_cli_miumum_version:                           Qny1;
    widget_create_widget_help_url:                       Qny1;
    widget_custom_widget_empty_img:                      Qny1;
    widget_default_cover_img:                            Qny1;
    widget_default_template_url:                         Qny1;
    widget_develop_init_help_url:                        Qny1;
    widget_develop_install_help_url:                     Qny1;
    widget_develop_preview_help_url:                     Qny1;
    widget_develop_start_help_url:                       Qny1;
    widget_how_to_close_browser_restriction_help_url:    Qny1;
    widget_panel_empty_img:                              Qny1;
    widget_release_help_url:                             Qny1;
    workbench_folder_default_cover_list:                 Qny1;
    workbench_max_node_number_show_invite_and_new_node:  Qny1;
    workbench_no_permission_img:                         Qny1;
    workbench_node_share_help_url:                       Qny1;
    workbench_trash_help_url:                            Qny1;
}

export interface Qny1 {
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
    type?:        TypeElement[];
}

export enum TypeElement {
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
