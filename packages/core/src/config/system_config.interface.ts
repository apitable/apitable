export interface SystemConfigInterface {
    api_panel:                   { [key: string]: APIPanel };
    audit:                       Audit;
    country_code_and_phone_code: { [key: string]: CountryCodeAndPhoneCode };
    environment:                 Environment;
    guide:                       SystemConfigInterfaceGuide;
    integral:                    Integral;
    locales:                     Locale[];
    marketplace:                 SystemConfigInterfaceMarketplace;
    notifications:               Notifications;
    player:                      SystemConfigInterfacePlayer;
    settings:                    Settings;
    shortcut_keys:               ShortcutKey[];
    test_function:               TestFunction;
}

export interface APIPanel {
    defaultExample:   string;
    defaultExampleId: string;
    description:      string;
    descriptionId:    string;
    valueType:        string;
}

export interface Audit {
    actual_delete_space:       TartuGecko;
    add_field_role:            TartuGecko;
    add_node_role:             AddNodeRole;
    add_sub_admin:             AddTeamToMemberClass;
    add_team_to_member:        AddTeamToMemberClass;
    agree_user_apply:          AddTeamToMemberClass;
    cancel_delete_space:       TartuGecko;
    change_main_admin:         AddTeamToMemberClass;
    copy_node:                 AddNodeRole;
    create_node:               AddNodeRole;
    create_space:              TartuGecko;
    create_team:               AddTeamToMemberClass;
    create_template:           TartuGecko;
    delete_field_role:         TartuGecko;
    delete_node:               AddNodeRole;
    delete_node_role:          AddNodeRole;
    delete_rubbish_node:       TartuGecko;
    delete_space:              TartuGecko;
    delete_sub_admin:          AddTeamToMemberClass;
    delete_team:               AddTeamToMemberClass;
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
    remove_member_from_team:   AddTeamToMemberClass;
    remove_user:               AddTeamToMemberClass;
    rename_node:               AddNodeRole;
    rename_space:              TartuGecko;
    sort_node:                 TartuGecko;
    store_share_node:          AddNodeRole;
    update_field_role:         TartuGecko;
    update_field_role_setting: AddTeamToMemberClass;
    update_member_property:    AddTeamToMemberClass;
    update_member_team:        AddTeamToMemberClass;
    update_node_cover:         TartuGecko;
    update_node_desc:          TartuGecko;
    update_node_icon:          TartuGecko;
    update_node_role:          AddNodeRole;
    update_node_share_setting: AddNodeRole;
    update_space_logo:         TartuGecko;
    update_sub_admin_role:     AddTeamToMemberClass;
    update_team_property:      AddTeamToMemberClass;
    user_leave_space:          TartuGecko;
    user_login:                TartuGecko;
    user_logout:               TartuGecko;
}

export interface TartuGecko {
    category: string;
    content:  string;
    name:     string;
    online?:  boolean;
    type:     NotificationsTypeEnum;
}

export enum NotificationsTypeEnum {
    Member = "member",
    Space = "space",
    System = "system",
}

export interface AddNodeRole {
    category:          PurpleCategory;
    content:           string;
    name:              string;
    online:            boolean;
    show_in_audit_log: boolean;
    sort:              string;
    type:              NotificationsTypeEnum;
}

export enum PurpleCategory {
    WorkCatalogChangeEvent = "work_catalog_change_event",
    WorkCatalogPermissionChangeEvent = "work_catalog_permission_change_event",
    WorkCatalogShareEvent = "work_catalog_share_event",
}

export interface AddTeamToMemberClass {
    category: FluffyCategory;
    type:     NotificationsTypeEnum;
}

export enum FluffyCategory {
    AdminPermissionChangeEvent = "admin_permission_change_event",
    DatasheetFieldPermissionChangeEvent = "datasheet_field_permission_change_event",
    OrganizationChangeEvent = "organization_change_event",
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
    step:   { [key: string]: Step };
    wizard: { [key: string]: Wizard };
}

export interface Step {
    backdrop?:  Backdrop;
    next?:      Next;
    nextId?:    NextID;
    onClose?:   string[];
    onNext?:    On[];
    onPlay?:    string[];
    onPrev?:    On[];
    onSkip?:    On[];
    onTarget?:  On[];
    prev?:      string;
    uiConfig:   string;
    uiConfigId: string;
    uiType:     string;
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
    SeeMore = "see_more",
}

export enum On {
    ClearGuideAllUI = "clear_guide_all_ui()",
    ClearGuideUisPopover = "clear_guide_uis([\"popover\"])",
    OpenGuideNextStep = "open_guide_next_step()",
    OpenGuideNextStepClearAllPrevUITrue = "open_guide_next_step({\"clearAllPrevUi\":true})",
    SetWizardCompletedCurWizardTrue = "set_wizard_completed({\"curWizard\": true})",
    SkipAllWizards = "skip_all_wizards()",
    SkipCurrentWizard = "skip_current_wizard()",
    SkipCurrentWizardCurWizardCompletedTrue = "skip_current_wizard({\"curWizardCompleted\": true})",
}

export interface Wizard {
    completeIndex?:   number;
    player?:          WizardPlayer;
    steps?:           string;
    repeat?:          boolean;
    endTime?:         number;
    startTime?:       number;
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
    action_name:            string;
    day_max_integral_value: number;
    display_name:           string[];
    integral_value:         number;
    notify?:                boolean;
    online?:                boolean;
}

export interface FissionReward {
    action_code:  string;
    action_name:  string;
    display_name: string[];
    notify?:      boolean;
    online:       boolean;
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
    cli_9f614b454434500e: CLI;
    cli_a08120b120fad00e: CLI;
    ina5200279359980055:  Ina;
    ina5645957505507647:  Ina;
    ina9134969049653777:  Ina;
}

export interface CLI {
    app_description: string;
    app_id:          string;
    app_info:        string;
    app_name:        string;
    app_type:        string;
    btn_card:        BtnCard;
    disable:         boolean;
    display_order:   number;
    env:             string[];
    id:              string;
    image:           Image;
    link_to_cms:     string;
    logo:            Image;
    modal:           CLI9F3930Dd7D7Ad00CModal;
    note:            string;
    type:            string;
}

export interface BtnCard {
    apps_btn_text:     string;
    btn_action?:       string;
    btn_close_action?: string;
    btn_text:          string;
    btn_type:          string;
}

export interface Image {
    height:   number;
    id:       string;
    mimeType: MIMEType;
    name:     string;
    size:     number;
    token:    string;
    url:      string;
    width:    number;
}

export enum MIMEType {
    ImagePNG = "image/png",
    ImageSVGXML = "image/svg+xml",
}

export interface CLI9F3930Dd7D7Ad00CModal {
    app_description: string;
    btn_action?:     string;
    btn_text:        string;
    btn_type:        string;
    help_link:       string;
}

export interface Ina {
    app_description: string;
    app_id:          string;
    app_info:        string;
    app_name:        string;
    app_type:        string;
    btn_card:        BtnCard;
    display_order:   number;
    env:             string[];
    id:              string;
    image:           Image;
    link_to_cms:     string;
    logo:            Image;
    modal:           CLI9F3930Dd7D7Ad00CModal;
    note:            string;
    type:            string;
}

export interface Notifications {
    templates: Templates;
    types:     Types;
}

export interface Templates {
    activity_integral_income_notify:             ActivityIntegralIncomeNotify;
    activity_integral_income_toadmin:            ActivityIntegralIncomeNotify;
    add_record_out_of_limit:                     AddRecordOutOfLimit;
    add_record_soon_to_be_limit:                 AddRecordOutOfLimit;
    add_sub_admin:                               AssignedToGroupClass;
    admin_transfer_space_widget_notify:          LivingstoneSouthernWhiteFacedOwl;
    admin_unpublish_space_widget_notify:         LivingstoneSouthernWhiteFacedOwl;
    apply_space_beta_feature_success_notify_all: ActivityIntegralIncomeNotify;
    apply_space_beta_feature_success_notify_me:  ActivityIntegralIncomeNotify;
    assigned_to_group:                           AssignedToGroupClass;
    assigned_to_role:                            AssignedToGroupClass;
    auto_cancel_record_subscription:             AutoCancelRecordSubscription;
    auto_create_record_subscription:             AutoCancelRecordSubscription;
    capacity_limit:                              AddRecordOutOfLimit;
    changed_ordinary_user:                       LivingstoneSouthernWhiteFacedOwl;
    comment_mentioned:                           AutoCancelRecordSubscription;
    common_system_notify:                        LivingstoneSouthernWhiteFacedOwl;
    common_system_notify_web:                    ActivityIntegralIncomeNotify;
    datasheet_limit:                             AddRecordOutOfLimit;
    datasheet_record_limit:                      AddRecordOutOfLimit;
    integral_income_notify:                      ActivityIntegralIncomeNotify;
    invite_member_toadmin:                       LivingstoneSouthernWhiteFacedOwl;
    invite_member_tomyself:                      LivingstoneSouthernWhiteFacedOwl;
    invite_member_touser:                        LivingstoneSouthernWhiteFacedOwl;
    member_applied_to_close_account:             LivingstoneSouthernWhiteFacedOwl;
    new_space_widget_notify:                     LivingstoneSouthernWhiteFacedOwl;
    new_user_welcome_notify:                     LivingstoneSouthernWhiteFacedOwl;
    quit_space:                                  LivingstoneSouthernWhiteFacedOwl;
    remove_from_group:                           LivingstoneSouthernWhiteFacedOwl;
    remove_from_role:                            LivingstoneSouthernWhiteFacedOwl;
    removed_from_space_toadmin:                  LivingstoneSouthernWhiteFacedOwl;
    removed_from_space_touser:                   LivingstoneSouthernWhiteFacedOwl;
    removed_member_tomyself:                     LivingstoneSouthernWhiteFacedOwl;
    server_pre_publish:                          LivingstoneSouthernWhiteFacedOwl;
    single_record_comment_mentioned:             AutoCancelRecordSubscription;
    single_record_member_mention:                AutoCancelRecordSubscription;
    space_add_primary_admin:                     LivingstoneSouthernWhiteFacedOwl;
    space_admin_limit:                           AddRecordOutOfLimit;
    space_api_limit:                             AddRecordOutOfLimit;
    space_calendar_limit:                        AddRecordOutOfLimit;
    space_certification_fail_notify:             LivingstoneSouthernWhiteFacedOwl;
    space_certification_notify:                  LivingstoneSouthernWhiteFacedOwl;
    space_deleted:                               LivingstoneSouthernWhiteFacedOwl;
    space_dingtalk_notify:                       LivingstoneSouthernWhiteFacedOwl;
    space_field_permission_limit:                LivingstoneSouthernWhiteFacedOwl;
    space_file_permission_limit:                 LivingstoneSouthernWhiteFacedOwl;
    space_form_limit:                            LivingstoneSouthernWhiteFacedOwl;
    space_gantt_limit:                           LivingstoneSouthernWhiteFacedOwl;
    space_join_apply:                            LivingstoneSouthernWhiteFacedOwl;
    space_join_apply_approved:                   LivingstoneSouthernWhiteFacedOwl;
    space_join_apply_refused:                    LivingstoneSouthernWhiteFacedOwl;
    space_lark_notify:                           LivingstoneSouthernWhiteFacedOwl;
    space_members_limit:                         LivingstoneSouthernWhiteFacedOwl;
    space_mirror_limit:                          LivingstoneSouthernWhiteFacedOwl;
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
    subscribed_record_cell_updated:              AutoCancelRecordSubscription;
    subscribed_record_commented:                 AutoCancelRecordSubscription;
    task_reminder:                               AddRecordOutOfLimit;
    user_field:                                  AutoCancelRecordSubscription;
    web_publish:                                 LivingstoneSouthernWhiteFacedOwl;
}

export interface ActivityIntegralIncomeNotify {
    format_string:      string;
    is_component?:      boolean;
    is_notification?:   boolean;
    notifications_type: NotificationsTypeEnum;
    to_tag:             string;
    can_jump?:          boolean;
}

export interface AddRecordOutOfLimit {
    can_jump:              boolean;
    format_string:         string;
    frequency?:            number;
    is_component:          boolean;
    is_mail:               boolean;
    is_notification:       boolean;
    mail_template_subject: string;
    notifications_type:    NotificationsTypeEnum;
    to_tag:                string;
    url:                   URL;
    billing_notify?:       string;
    is_browser?:           boolean;
    is_mobile?:            boolean;
}

export enum URL {
    Management = "/management",
    Workbench = "/workbench",
}

export interface AssignedToGroupClass {
    can_jump:           boolean;
    format_string:      string;
    is_browser:         boolean;
    is_component:       boolean;
    is_mobile:          boolean;
    is_notification:    boolean;
    notifications_type: NotificationsTypeEnum;
    to_tag:             string;
    url:                URL;
}

export interface LivingstoneSouthernWhiteFacedOwl {
    format_string?:         string;
    is_browser?:            boolean;
    is_component?:          boolean;
    is_mail?:               boolean;
    is_notification?:       boolean;
    notifications_type:     NotificationsTypeEnum;
    to_tag:                 string;
    can_jump?:              boolean;
    is_mobile?:             boolean;
    url?:                   URL;
    redirect_url?:          string;
    billing_notify?:        string;
    frequency?:             number;
    mail_template_subject?: string;
}

export interface AutoCancelRecordSubscription {
    can_jump:               boolean;
    format_string:          string;
    is_browser:             boolean;
    is_mail:                boolean;
    is_mobile:              boolean;
    is_notification:        boolean;
    notifications_type:     any[];
    to_tag:                 string;
    url:                    URL;
    is_component?:          boolean;
    mail_template_subject?: string;
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
    action:  Action[];
    events:  Events;
    jobs:    Jobs;
    rule:    RuleElement[];
    tips:    Tips;
    trigger: Trigger[];
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
    _:                                             Empty;
    address_shown:                                 HammerfestPonies;
    app_error_logger:                              HammerfestPonies;
    app_modal_confirm:                             HammerfestPonies;
    app_set_user_id:                               HammerfestPonies;
    app_tracker:                                   HammerfestPonies;
    datasheet_add_new_view:                        HammerfestPonies;
    datasheet_create_mirror_tip:                   DatasheetCreateMirrorTip;
    datasheet_dashboard_panel_shown:               HammerfestPonies;
    datasheet_delete_record:                       HammerfestPonies;
    datasheet_field_context_hidden:                HammerfestPonies;
    datasheet_field_context_shown:                 HammerfestPonies;
    datasheet_field_setting_hidden:                DatasheetCreateMirrorTip;
    datasheet_field_setting_shown:                 HammerfestPonies;
    datasheet_gantt_view_shown:                    HammerfestPonies;
    datasheet_grid_view_shown:                     DatasheetCreateMirrorTip;
    datasheet_org_has_link_field:                  HammerfestPonies;
    datasheet_org_view_add_first_node:             HammerfestPonies;
    datasheet_org_view_drag_to_unhandled_list:     HammerfestPonies;
    datasheet_org_view_right_panel_shown:          HammerfestPonies;
    datasheet_search_panel_hidden:                 DatasheetCreateMirrorTip;
    datasheet_search_panel_shown:                  DatasheetCreateMirrorTip;
    datasheet_shown:                               HammerfestPonies;
    datasheet_user_menu:                           HammerfestPonies;
    datasheet_widget_center_modal_shown:           DatasheetCreateMirrorTip;
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
    workbench_create_form_previewer_shown:         DatasheetCreateMirrorTip;
    workbench_entry:                               HammerfestPonies;
    workbench_folder_from_template_showcase_shown: HammerfestPonies;
    workbench_folder_showcase_shown:               HammerfestPonies;
    workbench_form_container_shown:                HammerfestPonies;
    workbench_hidden_vikaby_btn_clicked:           HammerfestPonies;
    workbench_no_emit:                             HammerfestPonies;
    workbench_show_trial_tip:                      HammerfestPonies;
    workbench_shown:                               HammerfestPonies;
    workbench_space_list_shown:                    HammerfestPonies;
}

export interface Empty {
}

export interface HammerfestPonies {
    module: string;
    name:   string;
}

export interface DatasheetCreateMirrorTip {
    guide:  ActionGuide;
    module: string;
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
    desc:        string;
    description: string;
    title:       string;
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
    _build_branch:                                       ArakGroundhog;
    _build_id:                                           ArakGroundhog;
    _version_type:                                       ArakGroundhog;
    activity_center_end_time:                            ArakGroundhog;
    activity_center_url:                                 ArakGroundhog;
    activity_train_camp_end_time:                        ArakGroundhog;
    activity_train_camp_start_time:                      ArakGroundhog;
    agree_terms_of_service:                              ArakGroundhog;
    api_apiffox_patch_url:                               ArakGroundhog;
    api_apiffox_post_url:                                ArakGroundhog;
    api_apifox_delete_url:                               ArakGroundhog;
    api_apifox_get_url:                                  ArakGroundhog;
    api_apifox_upload_url:                               ArakGroundhog;
    api_times_per_day:                                   ArakGroundhog;
    api_times_per_hour:                                  ArakGroundhog;
    api_times_per_minute:                                ArakGroundhog;
    api_times_per_second:                                ArakGroundhog;
    apitable_login_logo:                                 ArakGroundhog;
    assistant:                                           ArakGroundhog;
    assistant_activity_train_camp_end_time:              ArakGroundhog;
    assistant_activity_train_camp_start_time:            ArakGroundhog;
    assistant_ai_course_url:                             ArakGroundhog;
    assistant_release_history_url:                       ArakGroundhog;
    automation_action_send_msg_to_dingtalk:              ArakGroundhog;
    automation_action_send_msg_to_feishu:                ArakGroundhog;
    automation_action_send_msg_to_wecom:                 ArakGroundhog;
    billing_default_billing_period:                      ArakGroundhog;
    billing_default_grade:                               ArakGroundhog;
    billing_default_seats:                               ArakGroundhog;
    billing_enterprise_qr_code:                          ArakGroundhog;
    billing_pay_contact_us:                              ArakGroundhog;
    billing_pay_success_qr_code:                         ArakGroundhog;
    datasheet_max_view_count_per_sheet:                  ArakGroundhog;
    datasheet_unlogin_user_avatar:                       ArakGroundhog;
    delete_account_step1_cover:                          ArakGroundhog;
    delete_account_step2_email_icon:                     ArakGroundhog;
    delete_account_step2_mobile_icon:                    ArakGroundhog;
    education_url:                                       ArakGroundhog;
    email_icon:                                          ArakGroundhog;
    emoji_apple_32:                                      ArakGroundhog;
    emoji_apple_64:                                      ArakGroundhog;
    experimental_features_unsynchronized_view_intro_img: ArakGroundhog;
    field_cascade:                                       ArakGroundhog;
    github_icon:                                         ArakGroundhog;
    grades_info:                                         ArakGroundhog;
    help_assistant:                                      ArakGroundhog;
    help_contact_us_type:                                ArakGroundhog;
    help_developers_center_url:                          ArakGroundhog;
    help_download_app:                                   ArakGroundhog;
    help_join_chatgroup_url:                             ArakGroundhog;
    help_official_website_url:                           ArakGroundhog;
    help_product_roadmap_url:                            ArakGroundhog;
    help_solution_url:                                   ArakGroundhog;
    help_subscribe_demonstrate_form_url:                 ArakGroundhog;
    help_user_community_url:                             ArakGroundhog;
    help_user_community_url_dev:                         ArakGroundhog;
    help_user_community_url_prod:                        ArakGroundhog;
    help_user_feedback_url:                              ArakGroundhog;
    help_video_tutorials_url:                            ArakGroundhog;
    integration_apifox_url:                              ArakGroundhog;
    integration_dingtalk_da:                             ArakGroundhog;
    integration_dingtalk_help_url:                       IntegrationHelpURL;
    integration_dingtalk_upgrade_url:                    ArakGroundhog;
    integration_feishu_help:                             ArakGroundhog;
    integration_feishu_help_url:                         IntegrationHelpURL;
    integration_feishu_manage_open_url:                  ArakGroundhog;
    integration_feishu_seats_form_url:                   ArakGroundhog;
    integration_feishu_upgrade_url:                      ArakGroundhog;
    integration_feishu_upgrade_url_dev:                  ArakGroundhog;
    integration_feisu_register_now_url:                  ArakGroundhog;
    integration_wecom_bind_help_center:                  ArakGroundhog;
    integration_wecom_bind_help_center_url:              ArakGroundhog;
    integration_wecom_bind_success_icon_img:             ArakGroundhog;
    integration_wecom_custom_subdomain_help_url:         ArakGroundhog;
    integration_wecom_help_url:                          IntegrationHelpURL;
    integration_wecom_login_qrcode_js:                   ArakGroundhog;
    integration_wecom_qrcode_css:                        ArakGroundhog;
    integration_wecom_shop_cms:                          ArakGroundhog;
    integration_wecom_shop_corpid_dev:                   ArakGroundhog;
    integration_wecom_shop_corpid_prod:                  ArakGroundhog;
    integration_wecom_shop_corpid_staging:               ArakGroundhog;
    integration_wecom_shop_corpid_test:                  ArakGroundhog;
    integration_wecom_shop_suiteid_dev:                  ArakGroundhog;
    integration_wecom_shop_suiteid_prod:                 ArakGroundhog;
    integration_wecom_shop_suiteid_staging:              ArakGroundhog;
    integration_wecom_shop_suiteid_test:                 ArakGroundhog;
    integration_wecom_upgrade_guide_url:                 ArakGroundhog;
    integration_yozosoft_help_url:                       IntegrationHelpURL;
    introduction_video:                                  ArakGroundhog;
    linkedin_icon:                                       ArakGroundhog;
    login_agree_terms_of_service:                        ArakGroundhog;
    login_icp1_url:                                      ArakGroundhog;
    login_icp2_url:                                      ArakGroundhog;
    login_introduction_video:                            ArakGroundhog;
    login_join_chatgroup_url:                            ArakGroundhog;
    login_privacy_policy:                                ArakGroundhog;
    login_private_deployment_form_url:                   ArakGroundhog;
    login_service_agreement:                             ArakGroundhog;
    official_avatar:                                     ArakGroundhog;
    page_apply_logout:                                   ArakGroundhog;
    page_apply_logout_bg:                                ArakGroundhog;
    permission_config_in_workbench_page:                 ArakGroundhog;
    quick_search_default_dark:                           ArakGroundhog;
    quick_search_default_light:                          ArakGroundhog;
    server_error_page_bg:                                ArakGroundhog;
    share_iframe_brand:                                  ArakGroundhog;
    share_iframe_brand_dark:                             ArakGroundhog;
    space_setting_integrations_dingtalk:                 ArakGroundhog;
    space_setting_integrations_feishu:                   ArakGroundhog;
    space_setting_integrations_preview_office_file:      ArakGroundhog;
    space_setting_integrations_wecom:                    ArakGroundhog;
    space_setting_invite_user_to_get_v_coins:            ArakGroundhog;
    space_setting_list_of_enable_all_lab_features:       ArakGroundhog;
    space_setting_role_empty_img:                        ArakGroundhog;
    space_setting_upgrade:                               ArakGroundhog;
    system_configuration_logo_with_name_white_font:      ArakGroundhog;
    system_configuration_minmum_version_require:         ArakGroundhog;
    system_configuration_server_error_bg_img:            ArakGroundhog;
    system_configuration_version:                        ArakGroundhog;
    twitter_icon:                                        ArakGroundhog;
    user_account_deleted_bg_img:                         ArakGroundhog;
    user_account_deleted_img:                            ArakGroundhog;
    user_guide_welcome_developer_center_url:             ArakGroundhog;
    user_guide_welcome_introduction_video:               ArakGroundhog;
    user_guide_welcome_quick_start_video:                ArakGroundhog;
    user_guide_welcome_template1_icon:                   ArakGroundhog;
    user_guide_welcome_template1_url:                    ArakGroundhog;
    user_guide_welcome_template2_icon:                   ArakGroundhog;
    user_guide_welcome_template2_url:                    ArakGroundhog;
    user_guide_welcome_template3_icon:                   ArakGroundhog;
    user_guide_welcome_template3_url:                    ArakGroundhog;
    user_guide_welcome_what_is_datasheet_video:          ArakGroundhog;
    user_setting_account_bind:                           ArakGroundhog;
    user_setting_account_bind_dingtalk:                  ArakGroundhog;
    user_setting_account_bind_qq:                        ArakGroundhog;
    user_setting_account_bind_wechat:                    ArakGroundhog;
    user_setting_default_avatar:                         ArakGroundhog;
    view_architecture_empty_graphics_img:                ArakGroundhog;
    view_architecture_empty_record_list_img:             ArakGroundhog;
    view_architecture_guide_video:                       ArakGroundhog;
    view_calendar_guide_create:                          ArakGroundhog;
    view_calendar_guide_no_permission:                   ArakGroundhog;
    view_calendar_guide_video:                           ArakGroundhog;
    view_form_guide_video:                               ArakGroundhog;
    view_gallery_guide_video:                            ArakGroundhog;
    view_gantt_guide_video:                              ArakGroundhog;
    view_grid_guide_video:                               ArakGroundhog;
    view_kanban_guide_video:                             ArakGroundhog;
    view_mirror_list_empty_img:                          ArakGroundhog;
    widget_center_feature_not_unturned_on_img:           ArakGroundhog;
    widget_center_help_link:                             ArakGroundhog;
    widget_center_space_widget_empty_img:                ArakGroundhog;
    widget_cli_miumum_version:                           ArakGroundhog;
    widget_custom_widget_empty_img:                      ArakGroundhog;
    widget_default_cover_img:                            ArakGroundhog;
    widget_panel_empty_img:                              ArakGroundhog;
    workbench_folder_default_cover_list:                 ArakGroundhog;
    workbench_max_node_number_show_invite_and_new_node:  ArakGroundhog;
    workbench_no_permission_img:                         ArakGroundhog;
}

export interface ArakGroundhog {
    value: string;
}

export interface IntegrationHelpURL {
    marketplace: IntegrationDingtalkHelpURLMarketplace;
    value:       string;
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
    render_normal:    AsyncCompute;
    render_prompt:    AsyncCompute;
    robot:            AsyncCompute;
    view_manual_save: AsyncCompute;
    widget_center:    AsyncCompute;
}

export interface AsyncCompute {
    card:         Card;
    feature_key:  string;
    feature_name: string;
    id:           string;
    logo:         string;
    modal:        AsyncComputeModal;
    note:         string;
}

export interface Card {
    btn_close_action: string;
    btn_open_action:  string;
    btn_text:         string;
    btn_type:         string;
    info:             string;
    info的副本:          string;
}

export interface AsyncComputeModal {
    btn_action?: string;
    btn_text:    string;
    btn_type:    string;
    info:        string;
    info_image:  string;
    info的副本:     string;
}
