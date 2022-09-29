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
    add_sub_admin:             AddSubAdmin;
    add_team_to_member:        AddSubAdmin;
    agree_user_apply:          AddSubAdmin;
    cancel_delete_space:       ActualDeleteSpace;
    change_main_admin:         AddSubAdmin;
    copy_node:                 AddNodeRole;
    create_node:               AddNodeRole;
    create_space:              ActualDeleteSpace;
    create_team:               AddSubAdmin;
    create_template:           ActualDeleteSpace;
    delete_field_role:         ActualDeleteSpace;
    delete_node:               AddNodeRole;
    delete_node_role:          AddNodeRole;
    delete_rubbish_node:       ActualDeleteSpace;
    delete_space:              ActualDeleteSpace;
    delete_sub_admin:          AddSubAdmin;
    delete_team:               AddSubAdmin;
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
    remove_member_from_team:   AddSubAdmin;
    remove_user:               AddSubAdmin;
    rename_node:               AddNodeRole;
    rename_space:              ActualDeleteSpace;
    sort_node:                 ActualDeleteSpace;
    store_share_node:          AddNodeRole;
    update_field_role:         ActualDeleteSpace;
    update_field_role_setting: AddSubAdmin;
    update_member_property:    AddSubAdmin;
    update_member_team:        AddSubAdmin;
    update_node_cover:         ActualDeleteSpace;
    update_node_desc:          ActualDeleteSpace;
    update_node_icon:          ActualDeleteSpace;
    update_node_role:          AddNodeRole;
    update_node_share_setting: AddNodeRole;
    update_space_logo:         ActualDeleteSpace;
    update_sub_admin_role:     AddSubAdmin;
    update_team_property:      AddSubAdmin;
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

export interface AddSubAdmin {
    type:     NotificationsTypeEnum;
    category: AddSubAdminCategory;
}

export enum AddSubAdminCategory {
    AdminPermissionChangeEvent = "admin_permission_change_event",
    DatasheetFieldPermissionChangeEvent = "datasheet_field_permission_change_event",
    OrganizationChangeEvent = "organization_change_event",
}

export interface Billing {
    products: Products;
}

export interface Products {
    Bronze:              APIUsage;
    Silver:              APIUsage;
    Gold:                APIUsage;
    Enterprise:          APIUsage;
    ApiUsage:            APIUsage;
    Capacity:            APIUsage;
    Standalone_Capacity: StandaloneCapacity;
    Dingtalk_Base:       APIUsage;
    Dingtalk_Standard:   APIUsage;
    Dingtalk_Profession: APIUsage;
    Dingtalk_Enterprise: APIUsage;
    Feishu_Base:         APIUsage;
    Feishu_Standard:     APIUsage;
    Feishu_Profession:   APIUsage;
    Feishu_Enterprise:   APIUsage;
    Private_Cloud:       APIUsage;
    Wecom_Base:          APIUsage;
    Wecom_Standard:      APIUsage;
    Wecom_Profession:    APIUsage;
    Wecom_Enterprise:    APIUsage;
}

export interface APIUsage {
    ch_name:  string;
    id:       string;
    category: APIUsageCategory;
    en_name:  string;
    online?:  boolean;
    i18nName: string;
    channel:  string;
    name:     string[];
    free?:    boolean;
}

export enum APIUsageCategory {
    AddOn = "Add-on",
    Base = "BASE",
}

export interface StandaloneCapacity {
    id:       string;
    category: string;
    channel:  string;
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
    uiConfigId?: string;
    uiType:      UIType;
    prev?:       string;
    backdrop?:   Backdrop;
    onPlay?:     string[];
    onNext?:     On[];
    next?:       Next;
    onPrev?:     On[];
    nextId?:     NextID;
    onSkip?:     On[];
    uiConfig?:   string;
    onClose?:    string[];
    onTarget?:   On[];
    byEvent?:    string[];
    skipId?:     string;
    skip?:       string;
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
    add_sub_admin:                               ActivityIntegralIncomeNotify;
    assigned_to_group:                           ActivityIntegralIncomeNotify;
    assigned_to_role:                            ActivityIntegralIncomeNotify;
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
    space_add_primary_admin:                     ActivityIntegralIncomeNotify;
    space_join_apply:                            ActivityIntegralIncomeNotify;
    space_join_apply_approved:                   ActivityIntegralIncomeNotify;
    space_join_apply_refused:                    ActivityIntegralIncomeNotify;
    comment_mentioned:                           CommentMentioned;
    single_record_comment_mentioned:             CommentMentioned;
    single_record_member_mention:                CommentMentioned;
    subscribed_record_cell_updated:              CommentMentioned;
    subscribed_record_commented:                 CommentMentioned;
    user_field:                                  CommentMentioned;
    apply_space_beta_feature_success_notify_all: ActivityIntegralIncomeNotify;
    apply_space_beta_feature_success_notify_me:  ActivityIntegralIncomeNotify;
    capacity_limit:                              ActivityIntegralIncomeNotify;
    datasheet_limit:                             ActivityIntegralIncomeNotify;
    datasheet_record_limit:                      ActivityIntegralIncomeNotify;
    space_admin_limit:                           ActivityIntegralIncomeNotify;
    space_api_limit:                             ActivityIntegralIncomeNotify;
    space_calendar_limit:                        ActivityIntegralIncomeNotify;
    space_certification_fail_notify:             ActivityIntegralIncomeNotify;
    space_certification_notify:                  ActivityIntegralIncomeNotify;
    space_deleted:                               ActivityIntegralIncomeNotify;
    space_dingtalk_notify:                       ActivityIntegralIncomeNotify;
    space_field_permission_limit:                ActivityIntegralIncomeNotify;
    space_form_limit:                            ActivityIntegralIncomeNotify;
    space_gantt_limit:                           ActivityIntegralIncomeNotify;
    space_lark_notify:                           ActivityIntegralIncomeNotify;
    space_members_limit:                         ActivityIntegralIncomeNotify;
    space_name_change:                           ActivityIntegralIncomeNotify;
    space_paid_notify:                           ActivityIntegralIncomeNotify;
    space_rainbow_label_limit:                   ActivityIntegralIncomeNotify;
    space_record_limit:                          ActivityIntegralIncomeNotify;
    space_recover:                               ActivityIntegralIncomeNotify;
    space_seats_limit:                           ActivityIntegralIncomeNotify;
    space_subscription_end_notify:               ActivityIntegralIncomeNotify;
    space_subscription_notify:                   ActivityIntegralIncomeNotify;
    space_time_machine_limit:                    ActivityIntegralIncomeNotify;
    space_trash_limit:                           ActivityIntegralIncomeNotify;
    space_trial:                                 ActivityIntegralIncomeNotify;
    space_vika_paid_notify:                      ActivityIntegralIncomeNotify;
    space_watermark_notify:                      ActivityIntegralIncomeNotify;
    space_wecom_api_trial_end:                   ActivityIntegralIncomeNotify;
    space_wecom_notify:                          ActivityIntegralIncomeNotify;
    space_yozooffice_notify:                     ActivityIntegralIncomeNotify;
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
    formatString?:      string[];
    is_notification?:   boolean;
    format_string?:     string;
    is_component?:      boolean;
    is_mail?:           boolean;
    is_browser?:        boolean;
    can_jump?:          boolean;
    url?:               string;
    is_mobile?:         boolean;
}

export interface AddRecordOutOfLimit {
    can_jump:              boolean;
    to_tag:                string;
    notifications_type:    NotificationsTypeEnum;
    formatString:          string[];
    is_notification:       boolean;
    is_mail:               boolean;
    mail_template_subject: string;
    format_string:         string;
    url:                   string;
    frequency?:            number;
    is_component:          boolean;
    is_mobile?:            boolean;
    is_browser?:           boolean;
    notifications?:        AddRecordOutOfLimitNotifications;
}

export interface AddRecordOutOfLimitNotifications {
    "social_templates copy": string[];
}

export interface CommentMentioned {
    can_jump:               boolean;
    to_tag:                 string;
    notifications_type:     any[];
    formatString:           string[];
    is_notification:        boolean;
    is_mobile:              boolean;
    is_mail:                boolean;
    is_browser:             boolean;
    format_string:          string;
    url:                    string;
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
    _:                                             IntegrationOfficialTemplateCategory;
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

export interface IntegrationOfficialTemplateCategory {
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
    _build_branch:                          CustomerServiceQrCode;
    _build_id:                              CustomerServiceQrCode;
    _version_type:                          CustomerServiceQrCode;
    account_wallet_help:                    CustomerServiceQrCode;
    activity_center_end_time:               CustomerServiceQrCode;
    activity_center_url:                    CustomerServiceQrCode;
    activity_train_camp_end_time:           CustomerServiceQrCode;
    activity_train_camp_start_time:         CustomerServiceQrCode;
    activity_train_camp_url:                CustomerServiceQrCode;
    agree_terms_of_service:                 CustomerServiceQrCode;
    anonymous_avatar:                       CustomerServiceQrCode;
    ap_rate_hour:                           CustomerServiceQrCode;
    api_apiffox_patch_url:                  CustomerServiceQrCode;
    api_apiffox_post_url:                   CustomerServiceQrCode;
    api_apifox_delete_url:                  CustomerServiceQrCode;
    api_apifox_get_url:                     CustomerServiceQrCode;
    api_apifox_upload_url:                  CustomerServiceQrCode;
    api_rate_day:                           CustomerServiceQrCode;
    api_rate_inute:                         CustomerServiceQrCode;
    api_rate_second:                        CustomerServiceQrCode;
    apifox_link:                            CustomerServiceQrCode;
    billing_default_billing_period:         CustomerServiceQrCode;
    billing_default_grade:                  CustomerServiceQrCode;
    billing_default_seats:                  CustomerServiceQrCode;
    blank_mirror_list_image:                CustomerServiceQrCode;
    calendar_guide_create:                  CustomerServiceQrCode;
    calendar_guide_no_permission:           CustomerServiceQrCode;
    calendar_guide_video:                   CustomerServiceQrCode;
    calendar_setting_help_url:              CustomerServiceQrCode;
    chatgroup_url:                          CustomerServiceQrCode;
    create_widget_help:                     CustomerServiceQrCode;
    customer_qrcode_background_image:       CustomerServiceQrCode;
    customer_qrcode_url:                    CustomerServiceQrCode;
    " customer_service_qr_code":            CustomerServiceQrCode;
    default_avatar:                         CustomerServiceQrCode;
    default_widget_template_url:            CustomerServiceQrCode;
    deploy_mode:                            CustomerServiceQrCode;
    developers_center_url:                  CustomerServiceQrCode;
    ding_talk_login_appid_dev:              CustomerServiceQrCode;
    ding_talk_login_appid_pro:              CustomerServiceQrCode;
    dingtalk_login_appid_dev:               CustomerServiceQrCode;
    dingtalk_login_appid_prod:              CustomerServiceQrCode;
    dingtalk_login_appid_staging:           CustomerServiceQrCode;
    dingtalk_login_callback_dev:            CustomerServiceQrCode;
    dingtalk_login_callback_prod:           CustomerServiceQrCode;
    dingtalk_login_callback_staging:        CustomerServiceQrCode;
    dingtalk_upgrade_url:                   CustomerServiceQrCode;
    education_url:                          CustomerServiceQrCode;
    "emoji-apple-32":                       CustomerServiceQrCode;
    "emoji-apple-64":                       CustomerServiceQrCode;
    enterprise_qr_code:                     CustomerServiceQrCode;
    error_message_qrcode:                   CustomerServiceQrCode;
    feishu_bind_help:                       CustomerServiceQrCode;
    feishu_callback_pathname:               CustomerServiceQrCode;
    feishu_login_appid:                     CustomerServiceQrCode;
    feishu_login_appid_dev:                 CustomerServiceQrCode;
    feishu_login_appid_prod:                CustomerServiceQrCode;
    feishu_login_appid_staging:             CustomerServiceQrCode;
    feishu_manage_open_url:                 CustomerServiceQrCode;
    feishu_seats_form:                      CustomerServiceQrCode;
    feishu_upgrade_url:                     CustomerServiceQrCode;
    feishu_upgrade_url_dev:                 CustomerServiceQrCode;
    feisu_register_link_in_login:           CustomerServiceQrCode;
    folder_showcase_banners:                CustomerServiceQrCode;
    form_guide_video:                       CustomerServiceQrCode;
    gallery_guide_video:                    CustomerServiceQrCode;
    gantt_config_color_help_url:            CustomerServiceQrCode;
    gantt_config_task_contact_help_url:     CustomerServiceQrCode;
    gantt_guide_video:                      CustomerServiceQrCode;
    grades_info:                            CustomerServiceQrCode;
    grid_guide_video:                       CustomerServiceQrCode;
    guide_api_getting_start:                CustomerServiceQrCode;
    help_intro_custom_subdomain:            CustomerServiceQrCode;
    icp1:                                   CustomerServiceQrCode;
    icp2:                                   CustomerServiceQrCode;
    integration_official_template_category: IntegrationOfficialTemplateCategory;
    integration_official_template_choice:   CustomerServiceQrCode;
    introduction_video:                     CustomerServiceQrCode;
    invite_code_image_dev:                  CustomerServiceQrCode;
    invite_code_image_pro:                  CustomerServiceQrCode;
    kanban_guide_video:                     CustomerServiceQrCode;
    know_how_to_logout:                     CustomerServiceQrCode;
    labs_open_spaces:                       CustomerServiceQrCode;
    language:                               CustomerServiceQrCode;
    link_preview_office_cms:                LinkCMS;
    link_to_dingtalk_cms:                   LinkCMS;
    link_to_dingtalk_da:                    CustomerServiceQrCode;
    link_to_lark_cms:                       LinkCMS;
    link_to_privacy_policy:                 CustomerServiceQrCode;
    link_to_privacy_policy_in_app:          CustomerServiceQrCode;
    link_to_terms_of_service:               CustomerServiceQrCode;
    link_to_terms_of_service_in_app:        CustomerServiceQrCode;
    link_to_wecom_cms:                      LinkCMS;
    link_to_wecom_shop_cms:                 CustomerServiceQrCode;
    minimum_version_require:                CustomerServiceQrCode;
    modal_logout_step1_cover:               CustomerServiceQrCode;
    modal_logout_step2_icon_mail:           CustomerServiceQrCode;
    modal_logout_step2_icon_mobile:         CustomerServiceQrCode;
    no_permission_img_url:                  CustomerServiceQrCode;
    node_count_trigger:                     CustomerServiceQrCode;
    official_avatar:                        CustomerServiceQrCode;
    org_chart_setting_help_url:             CustomerServiceQrCode;
    org_guide_add_first_node_cover_1:       CustomerServiceQrCode;
    org_guide_add_first_node_cover_2:       CustomerServiceQrCode;
    org_guide_video:                        CustomerServiceQrCode;
    page_apply_logout:                      CustomerServiceQrCode;
    page_apply_logout_bg:                   CustomerServiceQrCode;
    pay_contact_us:                         CustomerServiceQrCode;
    pay_success_qr_code:                    CustomerServiceQrCode;
    permission_config_in_workbench_page:    CustomerServiceQrCode;
    private_deployment_form:                CustomerServiceQrCode;
    product_roadmap:                        CustomerServiceQrCode;
    QNY1:                                   CustomerServiceQrCode;
    QNY2:                                   CustomerServiceQrCode;
    QNY3:                                   CustomerServiceQrCode;
    qq_callback_dev:                        CustomerServiceQrCode;
    qq_callback_prod:                       CustomerServiceQrCode;
    qq_callback_staging:                    CustomerServiceQrCode;
    qq_connect_web_appid_dev:               CustomerServiceQrCode;
    qq_connect_web_appid_prod:              CustomerServiceQrCode;
    qq_connect_web_appid_staging:           CustomerServiceQrCode;
    recorded_comments:                      CustomerServiceQrCode;
    release_log_history_url:                CustomerServiceQrCode;
    role_empty:                             CustomerServiceQrCode;
    role_help_url:                          CustomerServiceQrCode;
    server_error_page_bg:                   CustomerServiceQrCode;
    share_url:                              CustomerServiceQrCode;
    solution:                               CustomerServiceQrCode;
    space_corp_cert_url:                    CustomerServiceQrCode;
    subscribe_demonstrate:                  CustomerServiceQrCode;
    template_customization:                 CustomerServiceQrCode;
    template_space_id:                      CustomerServiceQrCode;
    trash_url:                              CustomerServiceQrCode;
    user_feedback_url:                      CustomerServiceQrCode;
    version:                                CustomerServiceQrCode;
    view_manual_save_modal_img:             CustomerServiceQrCode;
    vika_classroom_url:                     CustomerServiceQrCode;
    vika_community_url:                     CustomerServiceQrCode;
    vika_community_url_dev:                 CustomerServiceQrCode;
    vika_community_url_prod:                CustomerServiceQrCode;
    vika_logo:                              CustomerServiceQrCode;
    vika_logo_white:                        CustomerServiceQrCode;
    vika_official_template_category:        IntegrationOfficialTemplateCategory;
    vika_official_template_choice:          CustomerServiceQrCode;
    wechat_mp_appid_dev:                    CustomerServiceQrCode;
    wechat_mp_appid_prod:                   CustomerServiceQrCode;
    wechat_mp_appid_staging:                CustomerServiceQrCode;
    wechat_mp_callback_dev:                 CustomerServiceQrCode;
    wechat_mp_callback_prod:                CustomerServiceQrCode;
    wechat_mp_callback_staging:             CustomerServiceQrCode;
    wecom_bind_help_center:                 CustomerServiceQrCode;
    wecom_bind_success_icon:                CustomerServiceQrCode;
    wecom_callback_path:                    CustomerServiceQrCode;
    wecom_integration_logo:                 CustomerServiceQrCode;
    wecom_login_qrcode_js:                  CustomerServiceQrCode;
    wecom_qrcode_css:                       CustomerServiceQrCode;
    wecom_shop_callback_dev:                CustomerServiceQrCode;
    wecom_shop_callback_prod:               CustomerServiceQrCode;
    wecom_shop_callback_staging:            CustomerServiceQrCode;
    wecom_shop_callback_test:               CustomerServiceQrCode;
    wecom_shop_corpid_dev:                  CustomerServiceQrCode;
    wecom_shop_corpid_prod:                 CustomerServiceQrCode;
    wecom_shop_corpid_staging:              CustomerServiceQrCode;
    wecom_shop_corpid_test:                 CustomerServiceQrCode;
    wecom_shop_suiteid_dev:                 CustomerServiceQrCode;
    wecom_shop_suiteid_prod:                CustomerServiceQrCode;
    wecom_shop_suiteid_staging:             CustomerServiceQrCode;
    wecom_shop_suiteid_test:                CustomerServiceQrCode;
    wecom_upgrade_guide_url:                CustomerServiceQrCode;
    welcome_get_vika:                       CustomerServiceQrCode;
    welcome_module4_url:                    CustomerServiceQrCode;
    welcome_module5_url:                    CustomerServiceQrCode;
    welcome_module6_url:                    CustomerServiceQrCode;
    welcome_module7_url:                    CustomerServiceQrCode;
    welcome_module8_url:                    CustomerServiceQrCode;
    welcome_module9_url:                    CustomerServiceQrCode;
    welcome_quick_start:                    CustomerServiceQrCode;
    welcome_what_is_vikasheet:              CustomerServiceQrCode;
    widget_center_help:                     CustomerServiceQrCode;
    widget_center_help_link:                CustomerServiceQrCode;
    widget_center_lab_unused_banner:        CustomerServiceQrCode;
    widget_center_space_empty:              CustomerServiceQrCode;
    widget_cli_min_version:                 CustomerServiceQrCode;
    widget_cret_invalid_help:               CustomerServiceQrCode;
    widget_default_cover:                   CustomerServiceQrCode;
    widget_develop_init_help:               CustomerServiceQrCode;
    widget_develop_install_help:            CustomerServiceQrCode;
    widget_develop_preview_help:            CustomerServiceQrCode;
    widget_develop_start_help:              CustomerServiceQrCode;
    widget_empty:                           CustomerServiceQrCode;
    widget_publish_modal_img:               CustomerServiceQrCode;
    widget_release_help:                    CustomerServiceQrCode;
}

export interface CustomerServiceQrCode {
    value: string;
}

export interface LinkCMS {
    value:       string;
    marketplace: LinkPreviewOfficeCMSMarketplace;
}

export interface LinkPreviewOfficeCMSMarketplace {
    integration: string[];
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
