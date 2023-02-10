export interface SystemConfigInterface {
    environment: Environment;
    settings: Settings;
    shortcut_keys: ShortcutKey[];
    country_code_and_phone_code: { [key: string]: CountryCodeAndPhoneCode };
    api_panel: { [key: string]: APIPanel };
    audit: Audit;
    locales: Locale[];
    marketplace: SystemConfigInterfaceMarketplace;
    test_function: TestFunction;
    player: SystemConfigInterfacePlayer;
    guide: SystemConfigInterfaceGuide;
    notifications: SystemConfigInterfaceNotifications;
    integral: Integral;
}

export interface APIPanel {
    defaultExampleId: string;
    description: string;
    descriptionId: string;
    defaultExample: string;
    valueType: string;
}

export interface Audit {
    actual_delete_space: ActualDeleteSpace;
    add_field_role: ActualDeleteSpace;
    add_node_role: AddNodeRole;
    add_sub_admin: AddTeamToMemberClass;
    add_team_to_member: AddTeamToMemberClass;
    agree_user_apply: AddTeamToMemberClass;
    cancel_delete_space: ActualDeleteSpace;
    change_main_admin: AddTeamToMemberClass;
    copy_node: AddNodeRole;
    create_node: AddNodeRole;
    create_space: ActualDeleteSpace;
    create_team: AddTeamToMemberClass;
    create_template: ActualDeleteSpace;
    delete_field_role: ActualDeleteSpace;
    delete_node: AddNodeRole;
    delete_node_role: AddNodeRole;
    delete_rubbish_node: ActualDeleteSpace;
    delete_space: ActualDeleteSpace;
    delete_sub_admin: AddTeamToMemberClass;
    delete_team: AddTeamToMemberClass;
    delete_template: ActualDeleteSpace;
    disable_field_role: ActualDeleteSpace;
    disable_node_role: AddNodeRole;
    disable_node_share: AddNodeRole;
    enable_field_role: ActualDeleteSpace;
    enable_node_role: AddNodeRole;
    enable_node_share: AddNodeRole;
    export_node: ActualDeleteSpace;
    import_node: AddNodeRole;
    invite_user_join_by_email: ActualDeleteSpace;
    move_node: AddNodeRole;
    quote_template: ActualDeleteSpace;
    recover_rubbish_node: AddNodeRole;
    remove_member_from_team: AddTeamToMemberClass;
    remove_user: AddTeamToMemberClass;
    rename_node: AddNodeRole;
    rename_space: ActualDeleteSpace;
    sort_node: ActualDeleteSpace;
    store_share_node: AddNodeRole;
    update_field_role: ActualDeleteSpace;
    update_field_role_setting: AddTeamToMemberClass;
    update_member_property: AddTeamToMemberClass;
    update_member_team: AddTeamToMemberClass;
    update_node_cover: ActualDeleteSpace;
    update_node_desc: ActualDeleteSpace;
    update_node_icon: ActualDeleteSpace;
    update_node_role: AddNodeRole;
    update_node_share_setting: AddNodeRole;
    update_space_logo: ActualDeleteSpace;
    update_sub_admin_role: AddTeamToMemberClass;
    update_team_property: AddTeamToMemberClass;
    user_leave_space: ActualDeleteSpace;
    user_login: ActualDeleteSpace;
    user_logout: ActualDeleteSpace;
}

export interface ActualDeleteSpace {
    content: string;
    online?: boolean;
    type: NotificationsTypeEnum;
    category: string;
    name: string;
}

export enum NotificationsTypeEnum {
    Member = 'member',
    Space = 'space',
    System = 'system',
}

export interface AddNodeRole {
    content: string;
    online: boolean;
    type: NotificationsTypeEnum;
    sort: string;
    show_in_audit_log: boolean;
    category: AddNodeRoleCategory;
    name: string;
}

export enum AddNodeRoleCategory {
    WorkCatalogChangeEvent = 'work_catalog_change_event',
    WorkCatalogPermissionChangeEvent = 'work_catalog_permission_change_event',
    WorkCatalogShareEvent = 'work_catalog_share_event',
}

export interface AddTeamToMemberClass {
    type: NotificationsTypeEnum;
    category: AddSubAdminCategory;
}

export enum AddSubAdminCategory {
    AdminPermissionChangeEvent = 'admin_permission_change_event',
    DatasheetFieldPermissionChangeEvent = 'datasheet_field_permission_change_event',
    OrganizationChangeEvent = 'organization_change_event',
}

export interface CountryCodeAndPhoneCode {
    phoneCode: string;
}

export interface Environment {
    integration: Integration;
    production: Integration;
    staging: Integration;
}

export interface Integration {
    env: string;
}

export interface SystemConfigInterfaceGuide {
    wizard: { [key: string]: Wizard };
    step: { [key: string]: Step };
}

export interface Step {
    uiConfigId: string;
    uiType: UIType;
    prev?: string;
    backdrop?: Backdrop;
    onPlay?: string[];
    onNext?: On[];
    next?: Next;
    onPrev?: On[];
    nextId?: NextID;
    onSkip?: On[];
    uiConfig: string;
    onClose?: string[];
    onTarget?: On[];
    byEvent?: string[];
    skipId?: string;
    skip?: string;
}

export enum Backdrop {
    AroundMask = 'around_mask',
}

export enum Next {
    下一步 = '下一步',
    好的 = '好的',
    已完成添加 = '已完成添加',
    我知道了 = '我知道了',
    查看更多 = '查看更多',
    查看详情 = '查看详情',
    知道啦 = '知道啦',
    确定 = '确定',
}

export enum NextID {
    CheckDetail = 'check_detail',
    Confirm = 'confirm',
    IKnewIt = 'i_knew_it',
    Known = 'known',
    NextStep = 'next_step',
    Okay = 'okay',
    PlayerContactUsConfirmBtn = 'player_contact_us_confirm_btn',
    SeeMore = 'see_more',
}

export enum On {
    ClearGuideAllUI = 'clear_guide_all_ui()',
    ClearGuideUisPopover = 'clear_guide_uis(["popover"])',
    OpenGuideNextStep = 'open_guide_next_step()',
    OpenGuideNextStepClearAllPrevUITrue = 'open_guide_next_step({"clearAllPrevUi":true})',
    OpenVikabyDefaultExpandMenuTrueVisibleTrue = 'open_vikaby({"defaultExpandMenu": true, "visible": true})',
    SetWizardCompletedCurWizardTrue = 'set_wizard_completed({"curWizard": true})',
    SkipAllWizards = 'skip_all_wizards()',
    SkipCurrentWizard = 'skip_current_wizard()',
    SkipCurrentWizardCurWizardCompletedTrue = 'skip_current_wizard({"curWizardCompleted": true})',
}

export enum UIType {
    AfterSignNPS = 'afterSignNPS',
    Breath = 'breath',
    ContactUs = 'contactUs',
    CustomQuestionnaire = 'customQuestionnaire',
    Modal = 'modal',
    Notice = 'notice',
    Popover = 'popover',
    PrivacyModal = 'privacyModal',
    Questionnaire = 'questionnaire',
    Slideout = 'slideout',
    TaskList = 'taskList',
    BillingStrip = 'billingStrip',
}

export interface Wizard {
    completeIndex?: number;
    steps?: string;
    player?: WizardPlayer;
    repeat?: boolean;
    endTime?: number;
    startTime?: number;
    successMsg?: string;
    freeVCount?: number;
    integral_action?: string;
    manualActions?: string[];
}

export interface WizardPlayer {
    action: string[];
}

export interface Integral {
    rule: IntegralRule;
}

export interface IntegralRule {
    be_invited_to_reward: BeInvitedToReward;
    complete_bind_email: BeInvitedToReward;
    first_bind_email: BeInvitedToReward;
    first_bind_phone: BeInvitedToReward;
    fission_reward: FissionReward;
    invitation_reward: BeInvitedToReward;
    official_adjustment: FissionReward;
    official_invitation_reward: BeInvitedToReward;
    redemption_code: BeInvitedToReward;
    wallet_activity_reward: FissionReward;
    wizard_reward: BeInvitedToReward;
    wizard_video_reward: BeInvitedToReward;
}

export interface BeInvitedToReward {
    action_code: string;
    day_max_integral_value: number;
    display_name: any[];
    online?: boolean;
    integral_value: number;
    notify?: boolean;
    action_name: string;
}

export interface FissionReward {
    action_code: string;
    display_name: string[];
    online: boolean;
    notify?: boolean;
    action_name: string;
}

export interface Locale {
    currency_name: string;
    currency_symbol: string;
    id: string;
    strings_language: string;
    currency_code: string;
    name: string;
}

export interface SystemConfigInterfaceMarketplace {
    cli_9f3930dd7d7ad00c: CLI;
    cli_a08120b120fad00e: CLI;
    cli_9f614b454434500e: CLI;
    ina5200279359980055: Ina;
    ina9134969049653777: Ina;
    ina5645957505507647: Ina;
}

export interface CLI {
    logo: Image;
    env: string[];
    disable: boolean;
    app_info: string;
    note: string;
    app_name: string;
    type: string;
    app_description: string;
    id: string;
    display_order: number;
    image: Image;
    app_id: string;
    link_to_cms: string;
    app_type: string;
    btn_card: BtnCard;
    modal: CLI9F3930Dd7D7Ad00CModal;
}

export interface BtnCard {
    btn_text: string;
    btn_action?: string;
    btn_type: string;
    btn_close_action?: string;
    apps_btn_text: string;
}

export interface Image {
    id: string;
    name: string;
    size: number;
    mimeType: MIMEType;
    token: string;
    width: number;
    height: number;
    url: string;
}

export enum MIMEType {
    ImagePNG = 'image/png',
    ImageSVGXML = 'image/svg+xml',
}

export interface CLI9F3930Dd7D7Ad00CModal {
    btn_text: string;
    btn_action?: string;
    app_description: string;
    btn_type: string;
    help_link: string;
}

export interface Ina {
    app_info: string;
    note: string;
    logo: Image;
    app_name: string;
    type: string;
    env: string[];
    app_description: string;
    id: string;
    display_order: number;
    image: Image;
    link_to_cms: string;
    app_type: string;
    btn_card: BtnCard;
    modal: CLI9F3930Dd7D7Ad00CModal;
    app_id: string;
}

export interface SystemConfigInterfaceNotifications {
    types: Types;
    templates: Templates;
}

export interface Templates {
    activity_integral_income_notify: ActivityIntegralIncomeNotify;
    activity_integral_income_toadmin: ActivityIntegralIncomeNotify;
    add_record_out_of_limit: AddRecordOutOfLimit;
    add_record_soon_to_be_limit: AddRecordOutOfLimit;
    add_sub_admin: AssignedToGroupClass;
    admin_transfer_space_widget_notify: ActivityIntegralIncomeNotify;
    admin_unpublish_space_widget_notify: ActivityIntegralIncomeNotify;
    apply_space_beta_feature_success_notify_all: ActivityIntegralIncomeNotify;
    apply_space_beta_feature_success_notify_me: ActivityIntegralIncomeNotify;
    assigned_to_group: AssignedToGroupClass;
    assigned_to_role: AssignedToGroupClass;
    capacity_limit: AddRecordOutOfLimit;
    changed_ordinary_user: ActivityIntegralIncomeNotify;
    comment_mentioned: CommentMentioned;
    common_system_notify: ActivityIntegralIncomeNotify;
    common_system_notify_web: ActivityIntegralIncomeNotify;
    datasheet_limit: AddRecordOutOfLimit;
    datasheet_record_limit: AddRecordOutOfLimit;
    integral_income_notify: ActivityIntegralIncomeNotify;
    invite_member_toadmin: ActivityIntegralIncomeNotify;
    invite_member_tomyself: ActivityIntegralIncomeNotify;
    invite_member_touser: ActivityIntegralIncomeNotify;
    member_applied_to_close_account: ActivityIntegralIncomeNotify;
    new_space_widget_notify: ActivityIntegralIncomeNotify;
    new_user_welcome_notify: ActivityIntegralIncomeNotify;
    quit_space: ActivityIntegralIncomeNotify;
    remove_from_group: ActivityIntegralIncomeNotify;
    remove_from_role: ActivityIntegralIncomeNotify;
    removed_from_space_toadmin: ActivityIntegralIncomeNotify;
    removed_from_space_touser: ActivityIntegralIncomeNotify;
    removed_member_tomyself: ActivityIntegralIncomeNotify;
    server_pre_publish: ActivityIntegralIncomeNotify;
    single_record_comment_mentioned: CommentMentioned;
    single_record_member_mention: CommentMentioned;
    space_add_primary_admin: AssignedToGroupClass;
    space_admin_limit: AddRecordOutOfLimit;
    space_api_limit: AddRecordOutOfLimit;
    space_calendar_limit: AddRecordOutOfLimit;
    space_certification_fail_notify: AssignedToGroupClass;
    space_certification_notify: AssignedToGroupClass;
    space_deleted: AssignedToGroupClass;
    space_dingtalk_notify: AssignedToGroupClass;
    space_field_permission_limit: AssignedToGroupClass;
    space_file_permission_limit: AssignedToGroupClass;
    space_form_limit: AssignedToGroupClass;
    space_gantt_limit: AssignedToGroupClass;
    space_join_apply: AssignedToGroupClass;
    space_join_apply_approved: AssignedToGroupClass;
    space_join_apply_refused: AssignedToGroupClass;
    space_lark_notify: AssignedToGroupClass;
    space_members_limit: AssignedToGroupClass;
    space_mirror_limit: AssignedToGroupClass;
    space_name_change: AssignedToGroupClass;
    space_paid_notify: AssignedToGroupClass;
    space_rainbow_label_limit: AssignedToGroupClass;
    space_record_limit: AssignedToGroupClass;
    space_recover: AssignedToGroupClass;
    space_seats_limit: AssignedToGroupClass;
    space_subscription_end_notify: AssignedToGroupClass;
    space_subscription_notify: AssignedToGroupClass;
    space_time_machine_limit: AssignedToGroupClass;
    space_trash_limit: AssignedToGroupClass;
    space_trial: AssignedToGroupClass;
    space_vika_paid_notify: AssignedToGroupClass;
    space_watermark_notify: AssignedToGroupClass;
    space_wecom_api_trial_end: AssignedToGroupClass;
    space_wecom_notify: AssignedToGroupClass;
    space_yozooffice_notify: AssignedToGroupClass;
    subscribed_record_cell_updated: CommentMentioned;
    subscribed_record_commented: CommentMentioned;
    task_reminder: AddRecordOutOfLimit;
    user_field: CommentMentioned;
    web_publish: ActivityIntegralIncomeNotify;
}

export interface ActivityIntegralIncomeNotify {
    to_tag: string;
    notifications_type: NotificationsTypeEnum;
    formatString: string[];
    is_notification?: boolean;
    format_string: string;
    is_component?: boolean;
    is_mail?: boolean;
    is_browser?: boolean;
    can_jump?: boolean;
    is_mobile?: boolean;
    url?: string;
}

export interface AddRecordOutOfLimit {
    can_jump: boolean;
    to_tag: ToTag;
    notifications_type: NotificationsTypeEnum;
    formatString: string[];
    is_notification: boolean;
    is_mail: boolean;
    mail_template_subject: string;
    format_string: string;
    url: URL;
    frequency?: number;
    is_component: boolean;
    is_browser?: boolean;
    billing_notify?: string;
    is_mobile?: boolean;
    notifications?: AddRecordOutOfLimitNotifications;
}

export interface AddRecordOutOfLimitNotifications {
    'social_templates copy': string[];
}

export enum ToTag {
    AllMembers = 'all_members',
    Members = 'members',
    SpaceAdmins = 'space_admins',
    SpaceMemberAdmins = 'space_member_admins',
    Users = 'users',
}

export enum URL {
    Management = '/management',
    Workbench = '/workbench',
}

export interface AssignedToGroupClass {
    can_jump?: boolean;
    to_tag: ToTag;
    notifications_type: NotificationsTypeEnum;
    formatString?: string[];
    is_notification: boolean;
    is_mobile?: boolean;
    is_browser?: boolean;
    format_string?: string;
    url?: URL;
    is_component?: boolean;
    is_mail?: boolean;
    billing_notify?: string;
    mail_template_subject?: string;
    frequency?: number;
}

export interface CommentMentioned {
    can_jump: boolean;
    to_tag: ToTag;
    notifications_type: any[];
    formatString: any[];
    is_notification: boolean;
    is_mobile: boolean;
    is_mail: boolean;
    is_browser: boolean;
    format_string: string;
    url: URL;
    is_component?: boolean;
    mail_template_subject?: string;
    notifications?: AddRecordOutOfLimitNotifications;
}

export interface Types {
    member: Member;
    record: Member;
    space: Member;
    system: Member;
}

export interface Member {
    format_string: string;
    tag: string;
}

export interface SystemConfigInterfacePlayer {
    trigger: Trigger[];
    events: Events;
    rule: RuleElement[];
    jobs: Jobs;
    action: Action[];
    tips: Tips;
}

export interface Action {
    id: string;
    command: string;
    guide?: ActionGuide;
    commandArgs?: string;
}

export interface ActionGuide {
    step: string[];
}

export interface Events {
    address_shown: AddressShown;
    app_error_logger: AddressShown;
    app_modal_confirm: AddressShown;
    app_set_user_id: AddressShown;
    app_tracker: AddressShown;
    datasheet_add_new_view: AddressShown;
    datasheet_dashboard_panel_shown: AddressShown;
    datasheet_delete_record: AddressShown;
    datasheet_field_context_hidden: AddressShown;
    datasheet_field_context_shown: AddressShown;
    datasheet_field_setting_hidden: DatasheetFieldSettingHidden;
    datasheet_field_setting_shown: AddressShown;
    datasheet_gantt_view_shown: AddressShown;
    datasheet_grid_view_shown: DatasheetFieldSettingHidden;
    datasheet_org_has_link_field: AddressShown;
    datasheet_org_view_add_first_node: AddressShown;
    datasheet_org_view_drag_to_unhandled_list: AddressShown;
    datasheet_org_view_right_panel_shown: AddressShown;
    datasheet_search_panel_hidden: DatasheetFieldSettingHidden;
    datasheet_search_panel_shown: AddressShown;
    datasheet_shown: AddressShown;
    datasheet_user_menu: AddressShown;
    datasheet_widget_center_modal_shown: DatasheetFieldSettingHidden;
    datasheet_wigdet_empty_panel_shown: AddressShown;
    get_context_menu_file_more: AddressShown;
    get_context_menu_folder_more: AddressShown;
    get_context_menu_root_add: AddressShown;
    get_nav_list: AddressShown;
    invite_entrance_modal_shown: AddressShown;
    questionnaire_shown: AddressShown;
    questionnaire_shown_after_sign: AddressShown;
    space_setting_main_admin_shown: AddressShown;
    space_setting_member_manage_shown: AddressShown;
    space_setting_overview_shown: AddressShown;
    space_setting_sub_admin_shown: AddressShown;
    space_setting_workbench_shown: AddressShown;
    template_center_shown: AddressShown;
    template_detail_shown: AddressShown;
    template_use_confirm_modal_shown: AddressShown;
    view_add_panel_shown: AddressShown;
    view_convert_gallery: AddressShown;
    view_notice_auto_save_true: AddressShown;
    view_notice_view_auto_false: AddressShown;
    viewset_manual_save_tip: AddressShown;
    workbench_create_form_bth_clicked: AddressShown;
    workbench_create_form_panel_shown: AddressShown;
    workbench_create_form_previewer_shown: DatasheetFieldSettingHidden;
    workbench_entry: AddressShown;
    workbench_folder_from_template_showcase_shown: AddressShown;
    workbench_folder_showcase_shown: AddressShown;
    workbench_form_container_shown: AddressShown;
    workbench_hidden_vikaby_btn_clicked: AddressShown;
    workbench_no_emit: AddressShown;
    workbench_shown: AddressShown;
    workbench_space_list_shown: AddressShown;
}

export interface AddressShown {
    module: string;
    name: string;
}

export interface DatasheetFieldSettingHidden {
    module: string;
    name: string;
    guide: ActionGuide;
}

export interface Jobs {
    '15_days_recall': DaysRecall;
    '3_days_recall': DaysRecall;
    '7_days_recall': DaysRecall;
}

export interface DaysRecall {
    actions: any[];
    cron: string;
}

export interface RuleElement {
    operator: string;
    condition: string;
    id: string;
    conditionArgs: string;
}

export interface Tips {
    first_node_tips: FirstNodeTips;
}

export interface FirstNodeTips {
    description: string;
    title: string;
    desc: string;
}

export interface Trigger {
    actions: string[];
    rules: string[];
    id: string;
    event: string[];
    eventState?: string;
    suspended?: boolean;
}

export interface Settings {
    _build_branch: BuildBranch;
    _build_id: BuildBranch;
    _version_type: BuildBranch;
    activity_center_end_time: BuildBranch;
    activity_center_url: BuildBranch;
    activity_train_camp_end_time: BuildBranch;
    activity_train_camp_start_time: BuildBranch;
    agree_terms_of_service: BuildBranch;
    api_apiffox_patch_url: BuildBranch;
    api_apiffox_post_url: BuildBranch;
    api_apifox_delete_url: BuildBranch;
    api_apifox_get_url: BuildBranch;
    api_apifox_upload_url: BuildBranch;
    api_panel_help_url: BuildBranch;
    api_times_per_day: BuildBranch;
    api_times_per_hour: BuildBranch;
    api_times_per_minute: BuildBranch;
    api_times_per_second: BuildBranch;
    apitable_login_logo: BuildBranch;
    assistant: BuildBranch;
    assistant_activity_train_camp_end_time: BuildBranch;
    assistant_activity_train_camp_start_time: BuildBranch;
    assistant_ai_course_url: BuildBranch;
    assistant_release_history_url: BuildBranch;
    automation_action_send_msg_to_dingtalk: BuildBranch;
    automation_action_send_msg_to_feishu: BuildBranch;
    automation_action_send_msg_to_wecom: BuildBranch;
    billing_default_billing_period: BuildBranch;
    billing_default_grade: BuildBranch;
    billing_default_seats: BuildBranch;
    billing_enterprise_qr_code: BuildBranch;
    billing_pay_contact_us: BuildBranch;
    billing_pay_success_qr_code: BuildBranch;
    datasheet_max_view_count_per_sheet: BuildBranch;
    datasheet_unlogin_user_avatar: BuildBranch;
    delete_account_step1_cover: BuildBranch;
    delete_account_step2_email_icon: BuildBranch;
    delete_account_step2_mobile_icon: BuildBranch;
    dingtalk_login_appid_dev: BuildBranch;
    dingtalk_login_appid_prod: BuildBranch;
    education_url: BuildBranch;
    email_icon: BuildBranch;
    emoji_apple_32: BuildBranch;
    emoji_apple_64: BuildBranch;
    experimental_features_unsynchronized_view_intro_img: BuildBranch;
    feishu_login_appid: BuildBranch;
    field_cascade: BuildBranch;
    github_icon: BuildBranch;
    grades_info: BuildBranch;
    help_assistant: BuildBranch;
    help_contact_us_type: BuildBranch;
    help_developers_center_url: BuildBranch;
    help_download_app: BuildBranch;
    help_join_chatgroup_url: BuildBranch;
    help_official_website_url: BuildBranch;
    help_product_roadmap_url: BuildBranch;
    help_solution_url: BuildBranch;
    help_subscribe_demonstrate_form_url: BuildBranch;
    help_user_community_url: BuildBranch;
    help_user_community_url_dev: BuildBranch;
    help_user_community_url_prod: BuildBranch;
    help_user_feedback_url: BuildBranch;
    help_video_tutorials_url: BuildBranch;
    integration_apifox_url: BuildBranch;
    integration_dingtalk_da: BuildBranch;
    integration_dingtalk_help_url: IntegrationHelpURL;
    integration_dingtalk_login_appid_dev: BuildBranch;
    integration_dingtalk_login_appid_prod: BuildBranch;
    integration_dingtalk_login_appid_staging: BuildBranch;
    integration_dingtalk_upgrade_url: BuildBranch;
    integration_feishu_help: BuildBranch;
    integration_feishu_help_url: IntegrationHelpURL;
    integration_feishu_login_appid: BuildBranch;
    integration_feishu_login_appid_dev: BuildBranch;
    integration_feishu_login_appid_prod: BuildBranch;
    integration_feishu_login_appid_staging: BuildBranch;
    integration_feishu_manage_open_url: BuildBranch;
    integration_feishu_seats_form_url: BuildBranch;
    integration_feishu_upgrade_url: BuildBranch;
    integration_feishu_upgrade_url_dev: BuildBranch;
    integration_feisu_register_now_url: BuildBranch;
    integration_wecom_bind_help_center: BuildBranch;
    integration_wecom_bind_help_center_url: BuildBranch;
    integration_wecom_bind_success_icon_img: BuildBranch;
    integration_wecom_custom_subdomain_help_url: BuildBranch;
    integration_wecom_help_url: IntegrationHelpURL;
    integration_wecom_login_qrcode_js: BuildBranch;
    integration_wecom_qrcode_css: BuildBranch;
    integration_wecom_shop_cms: BuildBranch;
    integration_wecom_shop_corpid_dev: BuildBranch;
    integration_wecom_shop_corpid_prod: BuildBranch;
    integration_wecom_shop_corpid_staging: BuildBranch;
    integration_wecom_shop_corpid_test: BuildBranch;
    integration_wecom_shop_suiteid_dev: BuildBranch;
    integration_wecom_shop_suiteid_prod: BuildBranch;
    integration_wecom_shop_suiteid_staging: BuildBranch;
    integration_wecom_shop_suiteid_test: BuildBranch;
    integration_wecom_upgrade_guide_url: BuildBranch;
    integration_yozosoft_help_url: IntegrationHelpURL;
    introduction_video: BuildBranch;
    linkedin_icon: BuildBranch;
    login_agree_terms_of_service: BuildBranch;
    login_icp1_url: BuildBranch;
    login_icp2_url: BuildBranch;
    login_introduction_video: BuildBranch;
    login_join_chatgroup_url: BuildBranch;
    login_privacy_policy: BuildBranch;
    login_privacy_policy_url: BuildBranch;
    login_private_deployment_form_url: BuildBranch;
    login_service_agreement: BuildBranch;
    login_service_agreement_url: BuildBranch;
    official_avatar: BuildBranch;
    onboarding_customer_service_background_img_url: BuildBranch;
    onboarding_customer_service_qrcode_avatar_img_url: BuildBranch;
    page_apply_logout: BuildBranch;
    page_apply_logout_bg: BuildBranch;
    permission_config_in_workbench_page: BuildBranch;
    server_error_page_bg: BuildBranch;
    share_iframe_brand: BuildBranch;
    share_iframe_brand_dark: BuildBranch;
    space_enterprise_certification_form: BuildBranch;
    space_setting_integrations_dingtalk: BuildBranch;
    space_setting_integrations_feishu: BuildBranch;
    space_setting_integrations_preview_office_file: BuildBranch;
    space_setting_integrations_wecom: BuildBranch;
    space_setting_invite_user_to_get_v_coins: BuildBranch;
    space_setting_list_of_enable_all_lab_features: BuildBranch;
    space_setting_role_empty_img: BuildBranch;
    space_setting_upgrade: BuildBranch;
    system_configuration_default_language: BuildBranch;
    system_configuration_default_theme: BuildBranch;
    system_configuration_error_msg_qrcode: BuildBranch;
    system_configuration_logo_with_name_white_font: BuildBranch;
    system_configuration_minmum_version_require: BuildBranch;
    system_configuration_official_avatar: BuildBranch;
    system_configuration_official_logo: BuildBranch;
    system_configuration_server_error_bg_img: BuildBranch;
    system_configuration_version: BuildBranch;
    template_feedback_form_url: BuildBranch;
    template_space_id: BuildBranch;
    twitter_icon: BuildBranch;
    user_account_deleted_bg_img: BuildBranch;
    user_account_deleted_img: BuildBranch;
    user_guide_welcome_developer_center_url: BuildBranch;
    user_guide_welcome_introduction_video: BuildBranch;
    user_guide_welcome_quick_start_video: BuildBranch;
    user_guide_welcome_template1_icon: BuildBranch;
    user_guide_welcome_template1_url: BuildBranch;
    user_guide_welcome_template2_icon: BuildBranch;
    user_guide_welcome_template2_url: BuildBranch;
    user_guide_welcome_template3_icon: BuildBranch;
    user_guide_welcome_template3_url: BuildBranch;
    user_guide_welcome_what_is_datasheet_video: BuildBranch;
    user_setting_account_bind: BuildBranch;
    user_setting_account_bind_dingtalk: BuildBranch;
    user_setting_account_bind_qq: BuildBranch;
    user_setting_account_bind_qq_web_appid_dev: BuildBranch;
    user_setting_account_bind_qq_web_appid_prod: BuildBranch;
    user_setting_account_bind_qq_web_appid_staging: BuildBranch;
    user_setting_account_bind_wechat: BuildBranch;
    user_setting_account_bind_wechat_appid_dev: BuildBranch;
    user_setting_account_bind_wechat_appid_prod: BuildBranch;
    user_setting_account_bind_wechat_appid_staging: BuildBranch;
    user_setting_default_avatar: BuildBranch;
    view_architecture_empty_graphics_img: BuildBranch;
    view_architecture_empty_record_list_img: BuildBranch;
    view_architecture_guide_video: BuildBranch;
    view_calendar_guide_create: BuildBranch;
    view_calendar_guide_no_permission: BuildBranch;
    view_calendar_guide_video: BuildBranch;
    view_form_guide_video: BuildBranch;
    view_gallery_guide_video: BuildBranch;
    view_gantt_config_color_help_url: BuildBranch;
    view_gantt_guide_video: BuildBranch;
    view_grid_guide_video: BuildBranch;
    view_kanban_guide_video: BuildBranch;
    view_mirror_list_empty_img: BuildBranch;
    widget_center_feature_not_unturned_on_img: BuildBranch;
    widget_center_help_link: BuildBranch;
    widget_center_space_widget_empty_img: BuildBranch;
    widget_cli_miumum_version: BuildBranch;
    widget_create_widget_help_url: BuildBranch;
    widget_custom_widget_empty_img: BuildBranch;
    widget_default_cover_img: BuildBranch;
    widget_default_template_url: BuildBranch;
    widget_develop_init_help_url: BuildBranch;
    widget_develop_install_help_url: BuildBranch;
    widget_develop_preview_help_url: BuildBranch;
    widget_develop_start_help_url: BuildBranch;
    widget_how_to_close_browser_restriction_help_url: BuildBranch;
    widget_panel_empty_img: BuildBranch;
    widget_release_help_url: BuildBranch;
    workbench_folder_default_cover_list: BuildBranch;
    workbench_max_node_number_show_invite_and_new_node: BuildBranch;
    workbench_no_permission_img: BuildBranch;
}

export interface BuildBranch {
    value: string;
}

export interface IntegrationHelpURL {
    value: string;
    marketplace: IntegrationDingtalkHelpURLMarketplace;
}

export interface IntegrationDingtalkHelpURLMarketplace {
    integration: string;
}

export interface ShortcutKey {
    show?: boolean;
    key: string;
    winKey: string;
    name?: string[];
    when?: string;
    id: string;
    command: string;
    description?: string;
    type?: TypeElement[];
}

export enum TypeElement {
    GalleryViewShortcuts = 'gallery_view_shortcuts',
    GlobalShortcuts = 'global_shortcuts',
    WorkbenckShortcuts = 'workbenck_shortcuts',
}

export interface TestFunction {
    async_compute: AsyncCompute;
    render_prompt: AsyncCompute;
    robot: AsyncCompute;
    widget_center: AsyncCompute;
    render_normal: AsyncCompute;
    view_manual_save: AsyncCompute;
}

export interface AsyncCompute {
    feature_name: string;
    logo: string;
    id: string;
    note: string;
    feature_key: string;
    modal: AsyncComputeModal;
    card: Card;
}

export interface Card {
    btn_open_action: string;
    info: string;
    info的副本: string;
    btn_close_action: string;
    btn_text: string;
    btn_type: string;
}

export interface AsyncComputeModal {
    btn_text: string;
    info: string;
    btn_action?: string;
    btn_type: string;
    info的副本: string;
    info_image: string;
}