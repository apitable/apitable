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
    actual_delete_space:       TartuGecko;
    add_field_role:            TartuGecko;
    add_node_role:             AddNodeRole;
    add_sub_admin:             AddSubAdmin;
    add_team_to_member:        AddSubAdmin;
    agree_user_apply:          AddSubAdmin;
    cancel_delete_space:       TartuGecko;
    change_main_admin:         AddSubAdmin;
    copy_node:                 AddNodeRole;
    create_node:               AddNodeRole;
    create_space:              TartuGecko;
    create_team:               AddSubAdmin;
    create_template:           TartuGecko;
    delete_field_role:         TartuGecko;
    delete_node:               AddNodeRole;
    delete_node_role:          AddNodeRole;
    delete_rubbish_node:       TartuGecko;
    delete_space:              TartuGecko;
    delete_sub_admin:          AddSubAdmin;
    delete_team:               AddSubAdmin;
    delete_template:           TartuGecko;
    disable_field_role:        TartuGecko;
    disable_node_role:         AddNodeRole;
    disable_node_share:        AddNodeRole;
    enable_field_role:         TartuGecko;
    enable_node_role:          AddNodeRole;
    enable_node_share:         AddNodeRole;
    export_node:               TartuGecko;
    import_node:               AddNodeRole;
    invite_user_join_by_email: TartuGecko;
    move_node:                 AddNodeRole;
    quote_template:            TartuGecko;
    recover_rubbish_node:      AddNodeRole;
    remove_member_from_team:   AddSubAdmin;
    remove_user:               AddSubAdmin;
    rename_node:               AddNodeRole;
    rename_space:              TartuGecko;
    sort_node:                 TartuGecko;
    store_share_node:          AddNodeRole;
    update_field_role:         TartuGecko;
    update_field_role_setting: AddSubAdmin;
    update_member_property:    AddSubAdmin;
    update_member_team:        AddSubAdmin;
    update_node_cover:         TartuGecko;
    update_node_desc:          TartuGecko;
    update_node_icon:          TartuGecko;
    update_node_role:          AddNodeRole;
    update_node_share_setting: AddNodeRole;
    update_space_logo:         TartuGecko;
    update_sub_admin_role:     AddSubAdmin;
    update_team_property:      AddSubAdmin;
    user_leave_space:          TartuGecko;
    user_login:                TartuGecko;
    user_logout:               TartuGecko;
}

export interface TartuGecko {
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
    category:          PurpleCategory;
    name:              string;
}

export enum PurpleCategory {
    WorkCatalogChangeEvent = "work_catalog_change_event",
    WorkCatalogPermissionChangeEvent = "work_catalog_permission_change_event",
    WorkCatalogShareEvent = "work_catalog_share_event",
}

export interface AddSubAdmin {
    type:     NotificationsTypeEnum;
    category: FluffyCategory;
}

export enum FluffyCategory {
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
    category: TentacledCategory;
    en_name:  string;
    online?:  boolean;
    i18nName: string;
    channel:  string;
    name:     string[];
    free?:    boolean;
}

export enum TentacledCategory {
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
    add_sub_admin:                               LivingstoneSouthernWhiteFacedOwl;
    assigned_to_group:                           LivingstoneSouthernWhiteFacedOwl;
    changed_ordinary_user:                       LivingstoneSouthernWhiteFacedOwl;
    invite_member_toadmin:                       LivingstoneSouthernWhiteFacedOwl;
    invite_member_tomyself:                      LivingstoneSouthernWhiteFacedOwl;
    invite_member_touser:                        LivingstoneSouthernWhiteFacedOwl;
    member_applied_to_close_account:             LivingstoneSouthernWhiteFacedOwl;
    quit_space:                                  LivingstoneSouthernWhiteFacedOwl;
    remove_from_group:                           LivingstoneSouthernWhiteFacedOwl;
    removed_from_space_toadmin:                  LivingstoneSouthernWhiteFacedOwl;
    removed_from_space_touser:                   LivingstoneSouthernWhiteFacedOwl;
    removed_member_tomyself:                     LivingstoneSouthernWhiteFacedOwl;
    space_add_primary_admin:                     LivingstoneSouthernWhiteFacedOwl;
    space_join_apply:                            LivingstoneSouthernWhiteFacedOwl;
    space_join_apply_approved:                   LivingstoneSouthernWhiteFacedOwl;
    space_join_apply_refused:                    LivingstoneSouthernWhiteFacedOwl;
    comment_mentioned:                           CommentMentioned;
    single_record_comment_mentioned:             CommentMentioned;
    single_record_member_mention:                CommentMentioned;
    subscribed_record_cell_updated:              CommentMentioned;
    subscribed_record_commented:                 CommentMentioned;
    user_field:                                  CommentMentioned;
    apply_space_beta_feature_success_notify_all: LivingstoneSouthernWhiteFacedOwl;
    apply_space_beta_feature_success_notify_me:  LivingstoneSouthernWhiteFacedOwl;
    capacity_limit:                              LivingstoneSouthernWhiteFacedOwl;
    datasheet_limit:                             LivingstoneSouthernWhiteFacedOwl;
    datasheet_record_limit:                      LivingstoneSouthernWhiteFacedOwl;
    space_admin_limit:                           LivingstoneSouthernWhiteFacedOwl;
    space_api_limit:                             LivingstoneSouthernWhiteFacedOwl;
    space_calendar_limit:                        LivingstoneSouthernWhiteFacedOwl;
    space_certification_fail_notify:             LivingstoneSouthernWhiteFacedOwl;
    space_certification_notify:                  LivingstoneSouthernWhiteFacedOwl;
    space_deleted:                               LivingstoneSouthernWhiteFacedOwl;
    space_dingtalk_notify:                       LivingstoneSouthernWhiteFacedOwl;
    space_field_permission_limit:                LivingstoneSouthernWhiteFacedOwl;
    space_form_limit:                            LivingstoneSouthernWhiteFacedOwl;
    space_gantt_limit:                           LivingstoneSouthernWhiteFacedOwl;
    space_lark_notify:                           LivingstoneSouthernWhiteFacedOwl;
    space_members_limit:                         LivingstoneSouthernWhiteFacedOwl;
    space_name_change:                           LivingstoneSouthernWhiteFacedOwl;
    space_paid_notify:                           LivingstoneSouthernWhiteFacedOwl;
    space_rainbow_label_limit:                   LivingstoneSouthernWhiteFacedOwl;
    space_record_limit:                          LivingstoneSouthernWhiteFacedOwl;
    space_recover:                               LivingstoneSouthernWhiteFacedOwl;
    space_seats_limit:                           LivingstoneSouthernWhiteFacedOwl;
    space_subscription_end_notify:               LivingstoneSouthernWhiteFacedOwl;
    space_subscription_notify:                   LivingstoneSouthernWhiteFacedOwl;
    space_time_machine_limit:                    LivingstoneSouthernWhiteFacedOwl;
    space_trash_limit:                           LivingstoneSouthernWhiteFacedOwl;
    space_trial:                                 LivingstoneSouthernWhiteFacedOwl;
    space_vika_paid_notify:                      LivingstoneSouthernWhiteFacedOwl;
    space_watermark_notify:                      LivingstoneSouthernWhiteFacedOwl;
    space_wecom_api_trial_end:                   LivingstoneSouthernWhiteFacedOwl;
    space_wecom_notify:                          LivingstoneSouthernWhiteFacedOwl;
    space_yozooffice_notify:                     LivingstoneSouthernWhiteFacedOwl;
    task_reminder:                               AddRecordOutOfLimit;
    activity_integral_income_notify:             LivingstoneSouthernWhiteFacedOwl;
    activity_integral_income_toadmin:            LivingstoneSouthernWhiteFacedOwl;
    add_record_out_of_limit:                     AddRecordOutOfLimit;
    add_record_soon_to_be_limit:                 AddRecordOutOfLimit;
    admin_transfer_space_widget_notify:          LivingstoneSouthernWhiteFacedOwl;
    admin_unpublish_space_widget_notify:         LivingstoneSouthernWhiteFacedOwl;
    common_system_notify:                        LivingstoneSouthernWhiteFacedOwl;
    common_system_notify_web:                    LivingstoneSouthernWhiteFacedOwl;
    integral_income_notify:                      LivingstoneSouthernWhiteFacedOwl;
    new_space_widget_notify:                     LivingstoneSouthernWhiteFacedOwl;
    server_pre_publish:                          LivingstoneSouthernWhiteFacedOwl;
    web_publish:                                 LivingstoneSouthernWhiteFacedOwl;
}

export interface LivingstoneSouthernWhiteFacedOwl {
    to_tag:             string;
    notifications_type: NotificationsTypeEnum;
    formatString?:      string[];
    is_notification?:   boolean;
    format_string?:     string;
    is_component?:      boolean;
    is_mail?:           boolean;
    is_browser?:        boolean;
    can_jump?:          boolean;
    url?:               URL;
    is_mobile?:         boolean;
}

export enum URL {
    Management = "/management",
    Workbench = "/workbench",
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
    url:                   URL;
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
    _:                                             IntegrationOfficialTemplateCategory;
    address_shown:                                 HammerfestPonies;
    app_error_logger:                              HammerfestPonies;
    app_modal_confirm:                             HammerfestPonies;
    app_set_user_id:                               HammerfestPonies;
    app_tracker:                                   HammerfestPonies;
    datasheet_add_new_view:                        HammerfestPonies;
    datasheet_dashboard_panel_shown:               HammerfestPonies;
    datasheet_delete_record:                       HammerfestPonies;
    datasheet_field_context_hidden:                HammerfestPonies;
    datasheet_field_context_shown:                 HammerfestPonies;
    datasheet_field_setting_hidden:                DatasheetFieldSettingHidden;
    datasheet_field_setting_shown:                 HammerfestPonies;
    datasheet_gantt_view_shown:                    HammerfestPonies;
    datasheet_grid_view_shown:                     DatasheetFieldSettingHidden;
    datasheet_org_has_link_field:                  HammerfestPonies;
    datasheet_org_view_add_first_node:             HammerfestPonies;
    datasheet_org_view_drag_to_unhandled_list:     HammerfestPonies;
    datasheet_org_view_right_panel_shown:          HammerfestPonies;
    datasheet_search_panel_hidden:                 DatasheetFieldSettingHidden;
    datasheet_search_panel_shown:                  HammerfestPonies;
    datasheet_shown:                               HammerfestPonies;
    datasheet_user_menu:                           HammerfestPonies;
    datasheet_widget_center_modal_shown:           DatasheetFieldSettingHidden;
    datasheet_wigdet_empty_panel_shown:            HammerfestPonies;
    get_context_menu_file_more:                    HammerfestPonies;
    get_context_menu_folder_more:                  HammerfestPonies;
    get_context_menu_root_add:                     HammerfestPonies;
    get_nav_list:                                  HammerfestPonies;
    invite_entrance_modal_shown:                   HammerfestPonies;
    questionnaire_shown:                           HammerfestPonies;
    questionnaire_shown_after_sign:                HammerfestPonies;
    space_setting_main_admin_shown:                HammerfestPonies;
    space_setting_member_manage_shown:             HammerfestPonies;
    space_setting_overview_shown:                  HammerfestPonies;
    space_setting_sub_admin_shown:                 HammerfestPonies;
    space_setting_workbench_shown:                 HammerfestPonies;
    template_center_shown:                         HammerfestPonies;
    template_detail_shown:                         HammerfestPonies;
    template_use_confirm_modal_shown:              HammerfestPonies;
    view_add_panel_shown:                          HammerfestPonies;
    view_convert_gallery:                          HammerfestPonies;
    view_notice_auto_save_true:                    HammerfestPonies;
    view_notice_view_auto_false:                   HammerfestPonies;
    viewset_manual_save_tip:                       HammerfestPonies;
    workbench_create_form_bth_clicked:             HammerfestPonies;
    workbench_create_form_panel_shown:             HammerfestPonies;
    workbench_create_form_previewer_shown:         DatasheetFieldSettingHidden;
    workbench_entry:                               HammerfestPonies;
    workbench_folder_from_template_showcase_shown: HammerfestPonies;
    workbench_folder_showcase_shown:               HammerfestPonies;
    workbench_form_container_shown:                HammerfestPonies;
    workbench_hidden_vikaby_btn_clicked:           HammerfestPonies;
    workbench_no_emit:                             HammerfestPonies;
    workbench_shown:                               HammerfestPonies;
    workbench_space_list_shown:                    HammerfestPonies;
}

export interface IntegrationOfficialTemplateCategory {
}

export interface HammerfestPonies {
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
    _build_branch:                          ArakGroundhog;
    _build_id:                              ArakGroundhog;
    _version_type:                          ArakGroundhog;
    account_wallet_help:                    ArakGroundhog;
    activity_center_end_time:               ArakGroundhog;
    activity_center_url:                    ArakGroundhog;
    activity_train_camp_end_time:           ArakGroundhog;
    activity_train_camp_start_time:         ArakGroundhog;
    activity_train_camp_url:                ArakGroundhog;
    agree_terms_of_service:                 ArakGroundhog;
    anonymous_avatar:                       ArakGroundhog;
    ap_rate_hour:                           ArakGroundhog;
    api_apiffox_patch_url:                  ArakGroundhog;
    api_apiffox_post_url:                   ArakGroundhog;
    api_apifox_delete_url:                  ArakGroundhog;
    api_apifox_get_url:                     ArakGroundhog;
    api_apifox_upload_url:                  ArakGroundhog;
    api_rate_day:                           ArakGroundhog;
    api_rate_inute:                         ArakGroundhog;
    api_rate_second:                        ArakGroundhog;
    apifox_link:                            ArakGroundhog;
    billing_default_billing_period:         ArakGroundhog;
    billing_default_grade:                  ArakGroundhog;
    billing_default_seats:                  ArakGroundhog;
    blank_mirror_list_image:                ArakGroundhog;
    calendar_guide_create:                  ArakGroundhog;
    calendar_guide_no_permission:           ArakGroundhog;
    calendar_guide_video:                   ArakGroundhog;
    calendar_setting_help_url:              ArakGroundhog;
    chatgroup_url:                          ArakGroundhog;
    create_widget_help:                     ArakGroundhog;
    customer_qrcode_background_image:       ArakGroundhog;
    customer_qrcode_url:                    ArakGroundhog;
    " customer_service_qr_code":            ArakGroundhog;
    default_avatar:                         ArakGroundhog;
    default_widget_template_url:            ArakGroundhog;
    deploy_mode:                            ArakGroundhog;
    developers_center_url:                  ArakGroundhog;
    ding_talk_login_appid_dev:              ArakGroundhog;
    ding_talk_login_appid_pro:              ArakGroundhog;
    dingtalk_login_appid_dev:               ArakGroundhog;
    dingtalk_login_appid_prod:              ArakGroundhog;
    dingtalk_login_appid_staging:           ArakGroundhog;
    dingtalk_login_callback_dev:            ArakGroundhog;
    dingtalk_login_callback_prod:           ArakGroundhog;
    dingtalk_login_callback_staging:        ArakGroundhog;
    dingtalk_upgrade_url:                   ArakGroundhog;
    education_url:                          ArakGroundhog;
    "emoji-apple-32":                       ArakGroundhog;
    "emoji-apple-64":                       ArakGroundhog;
    enterprise_qr_code:                     ArakGroundhog;
    error_message_qrcode:                   ArakGroundhog;
    feishu_bind_help:                       ArakGroundhog;
    feishu_callback_pathname:               ArakGroundhog;
    feishu_login_appid:                     ArakGroundhog;
    feishu_login_appid_dev:                 ArakGroundhog;
    feishu_login_appid_prod:                ArakGroundhog;
    feishu_login_appid_staging:             ArakGroundhog;
    feishu_manage_open_url:                 ArakGroundhog;
    feishu_seats_form:                      ArakGroundhog;
    feishu_upgrade_url:                     ArakGroundhog;
    feishu_upgrade_url_dev:                 ArakGroundhog;
    feisu_register_link_in_login:           ArakGroundhog;
    folder_showcase_banners:                ArakGroundhog;
    form_guide_video:                       ArakGroundhog;
    gallery_guide_video:                    ArakGroundhog;
    gantt_config_color_help_url:            ArakGroundhog;
    gantt_config_task_contact_help_url:     ArakGroundhog;
    gantt_guide_video:                      ArakGroundhog;
    grades_info:                            ArakGroundhog;
    grid_guide_video:                       ArakGroundhog;
    guide_api_getting_start:                ArakGroundhog;
    help_intro_custom_subdomain:            ArakGroundhog;
    icp1:                                   ArakGroundhog;
    icp2:                                   ArakGroundhog;
    integration_official_template_category: IntegrationOfficialTemplateCategory;
    integration_official_template_choice:   ArakGroundhog;
    introduction_video:                     ArakGroundhog;
    invite_code_image_dev:                  ArakGroundhog;
    invite_code_image_pro:                  ArakGroundhog;
    kanban_guide_video:                     ArakGroundhog;
    know_how_to_logout:                     ArakGroundhog;
    labs_open_spaces:                       ArakGroundhog;
    language:                               ArakGroundhog;
    link_preview_office_cms:                LinkCMS;
    link_to_dingtalk_cms:                   LinkCMS;
    link_to_dingtalk_da:                    ArakGroundhog;
    link_to_lark_cms:                       LinkCMS;
    link_to_privacy_policy:                 ArakGroundhog;
    link_to_privacy_policy_in_app:          ArakGroundhog;
    link_to_terms_of_service:               ArakGroundhog;
    link_to_terms_of_service_in_app:        ArakGroundhog;
    link_to_wecom_cms:                      LinkCMS;
    link_to_wecom_shop_cms:                 ArakGroundhog;
    minimum_version_require:                ArakGroundhog;
    modal_logout_step1_cover:               ArakGroundhog;
    modal_logout_step2_icon_mail:           ArakGroundhog;
    modal_logout_step2_icon_mobile:         ArakGroundhog;
    node_count_trigger:                     ArakGroundhog;
    official_avatar:                        ArakGroundhog;
    org_chart_setting_help_url:             ArakGroundhog;
    org_guide_add_first_node_cover_1:       ArakGroundhog;
    org_guide_add_first_node_cover_2:       ArakGroundhog;
    org_guide_video:                        ArakGroundhog;
    page_apply_logout:                      ArakGroundhog;
    page_apply_logout_bg:                   ArakGroundhog;
    pay_contact_us:                         ArakGroundhog;
    pay_success_qr_code:                    ArakGroundhog;
    permission_config_in_workbench_page:    ArakGroundhog;
    private_deployment_form:                ArakGroundhog;
    product_roadmap:                        ArakGroundhog;
    QNY1:                                   ArakGroundhog;
    QNY2:                                   ArakGroundhog;
    QNY3:                                   ArakGroundhog;
    qq_callback_dev:                        ArakGroundhog;
    qq_callback_prod:                       ArakGroundhog;
    qq_callback_staging:                    ArakGroundhog;
    qq_connect_web_appid_dev:               ArakGroundhog;
    qq_connect_web_appid_prod:              ArakGroundhog;
    qq_connect_web_appid_staging:           ArakGroundhog;
    recorded_comments:                      ArakGroundhog;
    release_log_history_url:                ArakGroundhog;
    server_error_page_bg:                   ArakGroundhog;
    solution:                               ArakGroundhog;
    space_corp_cert_url:                    ArakGroundhog;
    subscribe_demonstrate:                  ArakGroundhog;
    template_customization:                 ArakGroundhog;
    template_space_id:                      ArakGroundhog;
    trash_url:                              ArakGroundhog;
    user_feedback_url:                      ArakGroundhog;
    version:                                ArakGroundhog;
    view_manual_save_modal_img:             ArakGroundhog;
    vika_classroom_url:                     ArakGroundhog;
    vika_community_url:                     ArakGroundhog;
    vika_community_url_dev:                 ArakGroundhog;
    vika_community_url_prod:                ArakGroundhog;
    vika_logo:                              ArakGroundhog;
    vika_logo_white:                        ArakGroundhog;
    vika_official_template_category:        IntegrationOfficialTemplateCategory;
    vika_official_template_choice:          ArakGroundhog;
    wechat_mp_appid_dev:                    ArakGroundhog;
    wechat_mp_appid_prod:                   ArakGroundhog;
    wechat_mp_appid_staging:                ArakGroundhog;
    wechat_mp_callback_dev:                 ArakGroundhog;
    wechat_mp_callback_prod:                ArakGroundhog;
    wechat_mp_callback_staging:             ArakGroundhog;
    wecom_bind_help_center:                 ArakGroundhog;
    wecom_bind_success_icon:                ArakGroundhog;
    wecom_callback_path:                    ArakGroundhog;
    wecom_integration_logo:                 ArakGroundhog;
    wecom_login_qrcode_js:                  ArakGroundhog;
    wecom_qrcode_css:                       ArakGroundhog;
    wecom_shop_callback_dev:                ArakGroundhog;
    wecom_shop_callback_prod:               ArakGroundhog;
    wecom_shop_callback_staging:            ArakGroundhog;
    wecom_shop_callback_test:               ArakGroundhog;
    wecom_shop_corpid_dev:                  ArakGroundhog;
    wecom_shop_corpid_prod:                 ArakGroundhog;
    wecom_shop_corpid_staging:              ArakGroundhog;
    wecom_shop_corpid_test:                 ArakGroundhog;
    wecom_shop_suiteid_dev:                 ArakGroundhog;
    wecom_shop_suiteid_prod:                ArakGroundhog;
    wecom_shop_suiteid_staging:             ArakGroundhog;
    wecom_shop_suiteid_test:                ArakGroundhog;
    wecom_upgrade_guide_url:                ArakGroundhog;
    welcome_get_vika:                       ArakGroundhog;
    welcome_module4_url:                    ArakGroundhog;
    welcome_module5_url:                    ArakGroundhog;
    welcome_module6_url:                    ArakGroundhog;
    welcome_module7_url:                    ArakGroundhog;
    welcome_module8_url:                    ArakGroundhog;
    welcome_module9_url:                    ArakGroundhog;
    welcome_quick_start:                    ArakGroundhog;
    welcome_what_is_vikasheet:              ArakGroundhog;
    widget_center_help:                     ArakGroundhog;
    widget_center_help_link:                ArakGroundhog;
    widget_center_lab_unused_banner:        ArakGroundhog;
    widget_center_space_empty:              ArakGroundhog;
    widget_cli_min_version:                 ArakGroundhog;
    widget_cret_invalid_help:               ArakGroundhog;
    widget_default_cover:                   ArakGroundhog;
    widget_develop_init_help:               ArakGroundhog;
    widget_develop_install_help:            ArakGroundhog;
    widget_develop_preview_help:            ArakGroundhog;
    widget_develop_start_help:              ArakGroundhog;
    widget_empty:                           ArakGroundhog;
    widget_publish_modal_img:               ArakGroundhog;
    widget_release_help:                    ArakGroundhog;
}

export interface ArakGroundhog {
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
