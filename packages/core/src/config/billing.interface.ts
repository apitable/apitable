/* eslint-disable @typescript-eslint/naming-convention */
export interface SystemConfigInterface {
  environment: Environment;
  settings: Settings;
  shortcut_keys: ShortcutKey[];
  country_code_and_phone_code: { [key: string]: CountryCodeAndPhoneCode };
  api_panel: { [key: string]: APIPanel };
  audit: Audit;
  locales: Locale[];
  api_tips: { [key: string]: APITip };
  marketplace: SystemConfigInterfaceMarketplace;
  player: SystemConfigInterfacePlayer;
  guide: SystemConfigInterfaceGuide;
  notifications: Notifications;
  integral: Integral;
  billing: Billing;
}

export interface APIPanel {
  description: string;
  defaultExample: string;
  valueType: string;
}

export interface APITip {
  code: number;
  id: string;
  isRecordTimes?: boolean;
  strings的副本: string[];
  message: string[];
  statusCode: number;
  apiTypes: APITypes;
}

export enum APITypes {
  FusionAPI = 'fusion_api',
}

export interface Audit {
  actual_delete_space: LivingstoneSouthernWhiteFacedOwl;
  add_field_role: LivingstoneSouthernWhiteFacedOwl;
  add_member_to_team: AddMemberToTeam;
  add_node_role: LivingstoneSouthernWhiteFacedOwl;
  add_sub_admin: AddMemberToTeam;
  add_team_to_member: AddMemberToTeam;
  add_template: AddTemplate;
  agree_user_apply: AddMemberToTeam;
  change_main_admin: AddMemberToTeam;
  copy_node: LivingstoneSouthernWhiteFacedOwl;
  create_node: LivingstoneSouthernWhiteFacedOwl;
  create_space: LivingstoneSouthernWhiteFacedOwl;
  create_team: AddMemberToTeam;
  delete_field_role: LivingstoneSouthernWhiteFacedOwl;
  delete_node: LivingstoneSouthernWhiteFacedOwl;
  delete_node_role: LivingstoneSouthernWhiteFacedOwl;
  delete_rubbish_node: LivingstoneSouthernWhiteFacedOwl;
  delete_space: LivingstoneSouthernWhiteFacedOwl;
  delete_sub_admin: AddMemberToTeam;
  delete_team: AddMemberToTeam;
  delete_template: AddTemplate;
  disable_field_role: LivingstoneSouthernWhiteFacedOwl;
  disable_node_role: LivingstoneSouthernWhiteFacedOwl;
  disable_node_share: LivingstoneSouthernWhiteFacedOwl;
  enable_field_role: LivingstoneSouthernWhiteFacedOwl;
  enable_node_role: LivingstoneSouthernWhiteFacedOwl;
  enable_node_share: LivingstoneSouthernWhiteFacedOwl;
  export_node: LivingstoneSouthernWhiteFacedOwl;
  import_node: LivingstoneSouthernWhiteFacedOwl;
  invite_user_join: LivingstoneSouthernWhiteFacedOwl;
  move_node: LivingstoneSouthernWhiteFacedOwl;
  quote_template: AddTemplate;
  recover_rubbish_node: LivingstoneSouthernWhiteFacedOwl;
  remove_member_from_team: AddMemberToTeam;
  remove_user: AddMemberToTeam;
  rename_node: LivingstoneSouthernWhiteFacedOwl;
  rename_space: LivingstoneSouthernWhiteFacedOwl;
  store_share_node: AddTemplate;
  update_field_role: LivingstoneSouthernWhiteFacedOwl;
  update_member_property: AddMemberToTeam;
  update_node_role: LivingstoneSouthernWhiteFacedOwl;
  update_node_share_setting: AddTemplate;
  update_sub_admin_role: AddMemberToTeam;
  update_team_property: AddMemberToTeam;
  user_apply_join: AddMemberToTeam;
  user_leave_team: LivingstoneSouthernWhiteFacedOwl;
  user_login: LivingstoneSouthernWhiteFacedOwl;
  user_logout: LivingstoneSouthernWhiteFacedOwl;
}

export interface LivingstoneSouthernWhiteFacedOwl {
  content: string;
  strings的副本: string[];
  type: TypeElement;
  'strings的副本 2': string[];
  category: string[];
  'strings的副本 3': string[];
  name: string;
}

export enum TypeElement {
  Member = 'member',
  Record = 'record',
  Space = 'space',
  System = 'system',
}

export interface AddMemberToTeam {
  strings的副本: Strings的副本_Element[];
  type: TypeElement;
  category: Strings的副本_Element[];
}

export enum Strings的副本_Element {
  AuditAdminPermissionChangeEvent = 'audit_admin_permission_change_event',
  AuditOrganizationChangeEvent = 'audit_organization_change_event',
}

export interface AddTemplate {
  strings的副本: string[];
  type: TypeElement;
  category: string[];
  'strings的副本 3'?: string[];
  name: string;
  content?: string;
}

export interface Billing {
  entries: Entries;
  catalog: Catalog;
  products: Products;
  plans: { [key: string]: Plan };
  features: Features;
  functions: Functions;
}

export interface Catalog {
  V1: V1;
}

export interface V1 {
  version: VersionElement;
  products: ProductElement[];
  id: VersionElement;
  effectiveDate: Date;
  online: boolean;
}

export enum VersionElement {
  V1 = 'V1',
}

export enum ProductElement {
  APIUsage = 'Api_Usage',
  Bronze = 'Bronze',
  Capacity = 'Capacity',
  Enterprise = 'Enterprise',
  PublicBetaPeriod = 'Public_Beta_Period',
  Silver = 'Silver',
}

export interface Entries {
  early_bird: EarlyBird;
  folder_level: EarlyBird;
  nodes: EarlyBird;
  rows_limit: EarlyBird;
  space_admin: EarlyBird;
  space_search: EarlyBird;
  space_upgrade: SpaceUpgrade;
  storage_capacity: EarlyBird;
  styling: EarlyBird;
  time_machine: EarlyBird;
}

export interface EarlyBird {
  strings的副本: string[];
  title: string[];
  message: string[];
  'strings的副本 2': string[];
  id: string;
}

export interface SpaceUpgrade {
  id: string;
}

export interface Features {
  _advanced_permissions: AdvancedPermissions;
  _augmented_views: AdvancedPermissions;
  _benchs: AdvancedPermissions;
  _folder_level: AdvancedPermissions;
  _guests: AdvancedPermissions;
  _help_center: AdvancedPermissions;
  _styling: AdvancedPermissions;
  _viewers: AdvancedPermissions;
  add_on_api_call_20000: HammerfestPonies;
  add_on_api_call_30000: HammerfestPonies;
  add_on_api_call_40000: HammerfestPonies;
  add_on_api_call_50000: HammerfestPonies;
  add_on_api_call_60000: HammerfestPonies;
  api_usage_api_excess: HammerfestPonies;
  bronze_api_call_10000: HammerfestPonies;
  bronze_api_excess: HammerfestPonies;
  bronze_calendar_view: HammerfestPonies;
  bronze_dashboard: HammerfestPonies;
  bronze_favorite: HammerfestPonies;
  bronze_field_permission: HammerfestPonies;
  bronze_form_view: HammerfestPonies;
  bronze_gallery_view: HammerfestPonies;
  bronze_gantt_view: HammerfestPonies;
  bronze_grid_view: HammerfestPonies;
  bronze_integration_dingtalk: HammerfestPonies;
  bronze_integration_feishu: HammerfestPonies;
  bronze_integration_wecom: HammerfestPonies;
  bronze_integration_yozosoft: HammerfestPonies;
  bronze_kanban_view: HammerfestPonies;
  bronze_maximum_concurrent_volume: HammerfestPonies;
  bronze_node_permissions: HammerfestPonies;
  bronze_nodes: HammerfestPonies;
  bronze_rainbow_label: HammerfestPonies;
  bronze_rows_limit: HammerfestPonies;
  bronze_seats_20: HammerfestPonies;
  bronze_senior_field: HammerfestPonies;
  bronze_space_admin: HammerfestPonies;
  bronze_space_manage_menu_social: HammerfestPonies;
  bronze_space_rows_limit: HammerfestPonies;
  bronze_storage_capacity_1: HammerfestPonies;
  bronze_time_machine: HammerfestPonies;
  bronze_trash: HammerfestPonies;
  bronze_watermark: HammerfestPonies;
  bronze_widget_tip: HammerfestPonies;
  add_on_storage_capacity_1000: HammerfestPonies;
  add_on_storage_capacity_200: HammerfestPonies;
  add_on_storage_capacity_50: HammerfestPonies;
  Enterprise_api_call: HammerfestPonies;
  Enterprise_api_excess: HammerfestPonies;
  Enterprise_calendar_view: HammerfestPonies;
  Enterprise_dashboard: HammerfestPonies;
  Enterprise_favorite: HammerfestPonies;
  Enterprise_field_permission: HammerfestPonies;
  Enterprise_form_view: HammerfestPonies;
  Enterprise_gallery_view: HammerfestPonies;
  Enterprise_gantt_view: HammerfestPonies;
  Enterprise_grid_view: HammerfestPonies;
  Enterprise_integration_dingtalk: HammerfestPonies;
  Enterprise_integration_feishu: HammerfestPonies;
  Enterprise_integration_wecom: HammerfestPonies;
  Enterprise_integration_yozosoft: HammerfestPonies;
  Enterprise_kanban_view: HammerfestPonies;
  Enterprise_maximum_concurrent_volume: HammerfestPonies;
  Enterprise_node_permissions: HammerfestPonies;
  Enterprise_nodes: HammerfestPonies;
  Enterprise_rainbow_label: HammerfestPonies;
  Enterprise_rows_limit: HammerfestPonies;
  Enterprise_senior_field: HammerfestPonies;
  Enterprise_space_admin: HammerfestPonies;
  Enterprise_space_manage_menu_social: HammerfestPonies;
  Enterprise_space_rows_limit: HammerfestPonies;
  Enterprise_time_machine: HammerfestPonies;
  Enterprise_trash: HammerfestPonies;
  Enterprise_watermark: HammerfestPonies;
  Enterprise_widget_tip: HammerfestPonies;
  seats_100: HammerfestPonies;
  seats_110: HammerfestPonies;
  seats_120: HammerfestPonies;
  seats_130: HammerfestPonies;
  seats_140: HammerfestPonies;
  seats_150: HammerfestPonies;
  seats_160: HammerfestPonies;
  seats_170: HammerfestPonies;
  seats_180: HammerfestPonies;
  seats_190: HammerfestPonies;
  seats_200: HammerfestPonies;
  seats_210: HammerfestPonies;
  seats_220: HammerfestPonies;
  seats_230: HammerfestPonies;
  seats_240: HammerfestPonies;
  seats_250: HammerfestPonies;
  seats_260: HammerfestPonies;
  seats_270: HammerfestPonies;
  seats_280: HammerfestPonies;
  seats_290: HammerfestPonies;
  seats_300: HammerfestPonies;
  seats_500: HammerfestPonies;
  seats_60: HammerfestPonies;
  seats_70: HammerfestPonies;
  seats_80: HammerfestPonies;
  seats_90: HammerfestPonies;
  storage_capacity_1000: HammerfestPonies;
  storage_capacity_1100: HammerfestPonies;
  storage_capacity_1200: HammerfestPonies;
  storage_capacity_1300: HammerfestPonies;
  storage_capacity_1400: HammerfestPonies;
  storage_capacity_1500: HammerfestPonies;
  storage_capacity_1600: HammerfestPonies;
  storage_capacity_1700: HammerfestPonies;
  storage_capacity_1800: HammerfestPonies;
  storage_capacity_1900: HammerfestPonies;
  storage_capacity_2000: HammerfestPonies;
  storage_capacity_2100: HammerfestPonies;
  storage_capacity_2200: HammerfestPonies;
  storage_capacity_2300: HammerfestPonies;
  storage_capacity_2400: HammerfestPonies;
  storage_capacity_2500: HammerfestPonies;
  storage_capacity_2600: HammerfestPonies;
  storage_capacity_2700: HammerfestPonies;
  storage_capacity_2800: HammerfestPonies;
  storage_capacity_2900: HammerfestPonies;
  storage_capacity_300: HammerfestPonies;
  storage_capacity_3000: HammerfestPonies;
  storage_capacity_400: HammerfestPonies;
  storage_capacity_500: HammerfestPonies;
  storage_capacity_5000: HammerfestPonies;
  storage_capacity_600: HammerfestPonies;
  storage_capacity_700: HammerfestPonies;
  storage_capacity_800: HammerfestPonies;
  storage_capacity_900: HammerfestPonies;
  Public_Beta_Period_old_api_call: HammerfestPonies;
  Public_Beta_Period_old_api_excess: HammerfestPonies;
  Public_Beta_Period_old_field_permission: HammerfestPonies;
  Public_Beta_Period_old_form_view: HammerfestPonies;
  Public_Beta_Period_old_gallery_view: HammerfestPonies;
  Public_Beta_Period_old_maximum_concurrent_volume: HammerfestPonies;
  Public_Beta_Period_old_nodes: HammerfestPonies;
  Public_Beta_Period_old_rainbow_label: HammerfestPonies;
  Public_Beta_Period_old_rows_limit: HammerfestPonies;
  Public_Beta_Period_old_seats: HammerfestPonies;
  Public_Beta_Period_old_senior_field: HammerfestPonies;
  Public_Beta_Period_old_space_admin: HammerfestPonies;
  Public_Beta_Period_old_space_manage_menu_social: HammerfestPonies;
  Public_Beta_Period_old_space_rows_limit: HammerfestPonies;
  Public_Beta_Period_old_storage_capacity: HammerfestPonies;
  Public_Beta_Period_old_time_machine: HammerfestPonies;
  Public_Beta_Period_old_trash: HammerfestPonies;
  Public_Beta_Period_old_widget_tip: HammerfestPonies;
  seats_2: HammerfestPonies;
  seats_25: HammerfestPonies;
  seats_5: HammerfestPonies;
  silver_api_call_10000: HammerfestPonies;
  silver_api_excess: HammerfestPonies;
  silver_calendar_view: HammerfestPonies;
  silver_dashboard: HammerfestPonies;
  silver_favorite: HammerfestPonies;
  silver_field_permission: HammerfestPonies;
  silver_form_view: HammerfestPonies;
  silver_gallery_view: HammerfestPonies;
  silver_gantt_view: HammerfestPonies;
  silver_grid_view: HammerfestPonies;
  silver_integration_dingtalk: HammerfestPonies;
  silver_integration_feishu: HammerfestPonies;
  silver_integration_wecom: HammerfestPonies;
  silver_integration_yozosoft: HammerfestPonies;
  silver_kanban_view: HammerfestPonies;
  silver_maximum_concurrent_volume: HammerfestPonies;
  silver_node_permissions: HammerfestPonies;
  silver_nodes: HammerfestPonies;
  silver_rainbow_label: HammerfestPonies;
  silver_rows_limit: HammerfestPonies;
  silver_senior_field: HammerfestPonies;
  silver_space_admin: HammerfestPonies;
  silver_space_manage_menu_social: HammerfestPonies;
  silver_space_rows_limit: HammerfestPonies;
  silver_time_machine: HammerfestPonies;
  silver_trash: HammerfestPonies;
  silver_watermark: HammerfestPonies;
  silver_widget_tip: HammerfestPonies;
  seats_10: HammerfestPonies;
  seats_15: HammerfestPonies;
  seats_20: HammerfestPonies;
  seats_30: HammerfestPonies;
  seats_40: HammerfestPonies;
  seats_50: HammerfestPonies;
  storage_capacity_100: HammerfestPonies;
  storage_capacity_125: HammerfestPonies;
  storage_capacity_150: HammerfestPonies;
  storage_capacity_200: HammerfestPonies;
  storage_capacity_25: HammerfestPonies;
  storage_capacity_250: HammerfestPonies;
  storage_capacity_5: HammerfestPonies;
  storage_capacity_50: HammerfestPonies;
  storage_capacity_75: HammerfestPonies;
}

export interface HammerfestPonies {
  plans?: string[];
  products: ProductElement[];
  id: string;
  function: string[];
  specification: number;
  type?: PurpleType;
  unlimited?: boolean;
  category?: PurpleCategory[];
  description?: string[];
}

export enum PurpleCategory {
  AdvancedFeatures = 'advanced_features',
  EssentialFeatures = 'essential_features',
  SecurityFeatures = 'security_features',
  SupportFeatures = 'support_features',
}

export enum PurpleType {
  Capability = 'capability',
  Consumable = 'consumable',
  Subscribable = 'subscribable',
  Unlockable = 'unlockable',
}

export interface AdvancedPermissions {
  category: PurpleCategory[];
  unlimited: boolean;
  description?: string[];
  id: string;
  function: string[];
  specification: number;
  type?: PurpleType;
}

export interface Functions {
  nodes: ArakGroundhog;
  rows_limit: ArakGroundhog;
  seats: ArakGroundhog;
  space_rows_limit: ArakGroundhog;
  storage_capacity: ArakGroundhog;
  time_machine: ArakGroundhog;
  trash: ArakGroundhog;
  apps_support: ArakGroundhog;
  favorite: ArakGroundhog;
  gallery_view: ArakGroundhog;
  kanban_view: ArakGroundhog;
  rainbow_label: ArakGroundhog;
  api_call: ArakGroundhog;
  api_excess: ArakGroundhog;
  calendar_view: ArakGroundhog;
  dashboard: ArakGroundhog;
  form_view: ArakGroundhog;
  gantt_view: ArakGroundhog;
  maximum_concurrent_volume: ArakGroundhog;
  quick_compass: ArakGroundhog;
  senior_field: ArakGroundhog;
  widget_tip: ArakGroundhog;
  field_permission: ArakGroundhog;
  space_admin: ArakGroundhog;
  space_manage_menu_social: ArakGroundhog;
  sso: ArakGroundhog;
  view_permission: ArakGroundhog;
  add_on_api_call: ArakGroundhog;
  add_on_storage_capacity: ArakGroundhog;
  advanced_permissions: ArakGroundhog;
  augmented_views: ArakGroundhog;
  benchs: ArakGroundhog;
  comment: ArakGroundhog;
  custom_function_development: CustomFunctionDevelopment;
  dashboard_widgets: ArakGroundhog;
  early_bird: ArakGroundhog;
  exclusive_consultant: CustomFunctionDevelopment;
  folder_level: ArakGroundhog;
  grid_view: ArakGroundhog;
  guests: ArakGroundhog;
  help_center: ArakGroundhog;
  integration_dingtalk: ArakGroundhog;
  integration_feishu: ArakGroundhog;
  integration_wecom: ArakGroundhog;
  integration_yozosoft: ArakGroundhog;
  member: CustomFunctionDevelopment;
  multilingual_mail: CustomFunctionDevelopment;
  node_permissions: ArakGroundhog;
  notification_center: ArakGroundhog;
  online_custome_service: CustomFunctionDevelopment;
  online_video_training: CustomFunctionDevelopment;
  platform_synchronization: ArakGroundhog;
  styling: ArakGroundhog;
  viewers: ArakGroundhog;
  views: ArakGroundhog;
  watermark: ArakGroundhog;
}

export interface ArakGroundhog {
  name: string[];
  id: string;
  features?: string[];
  strings的副本?: string[];
}

export interface CustomFunctionDevelopment {
  name: string[];
  id: string;
}

export interface Plan {
  catalog?: VersionElement[];
  related_features: string[];
  category: PlanCategory;
  id: string;
  recurringPrice: number;
  name: Name[];
  period: Period;
  related_pricelist: any[];
  related_products: ProductElement[];
}

export enum PlanCategory {
  AddOn = 'Add-on',
  Base = 'BASE',
}

export enum Name {
  APIUsage = 'api_usage',
  BronzeGrade = 'bronze_grade',
  Enterprise = 'enterprise',
  PublicBetaPeriod = 'Public_Beta_Period',
  SilverGrade = 'silver_grade',
  SpaceCapacity = 'space_capacity',
}

export enum Period {
  Annual = 'ANNUAL',
  Biannual = 'BIANNUAL',
  Monthly = 'MONTHLY',
  NoBillingPeriod = 'NO_BILLING_PERIOD',
}

export interface Products {
  Api_Usage: APIUsage;
  Bronze: Bronze;
  Capacity: APIUsage;
  Enterprise: APIUsage;
  Public_Beta_Period: APIUsage;
  Self_Hosting: SelfHosting;
  Silver: Bronze;
}

export interface APIUsage {
  related_plans: string[];
  id: ProductElement;
  category: PlanCategory;
  related_features: string[];
  online?: boolean;
  catalog: VersionElement[];
  name: Name[];
  grade?: boolean;
  free?: boolean;
}

export interface Bronze {
  free?: boolean;
  img: string[];
  related_plans: string[];
  id: ProductElement;
  category: PlanCategory;
  related_features: string[];
  online: boolean;
  grade: boolean;
  name: Name[];
  catalog?: VersionElement[];
}

export interface SelfHosting {
  id: string;
  category: PlanCategory;
  grade: boolean;
  name: string[];
}

export interface CountryCodeAndPhoneCode {
  strings的副本: string[];
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
  skip?: string;
  uiType: UIType;
  prev?: Next;
  backdrop?: string;
  onPlay?: string[];
  onNext?: string[];
  next?: Next;
  onPrev?: On[];
  uiConfig: string;
  onSkip?: On[];
  onClose?: string[];
  onTarget?: OnTarget[];
  byEvent?: string[];
}

export enum Next {
  Empty = '-',
  下一步 = '下一步',
  好的 = '好的',
  知道啦 = '知道啦',
  确定 = '确定',
}

export enum On {
  ClearGuideAllUI = 'clear_guide_all_ui()',
  OpenGuideNextStepClearAllPrevUITrue = 'open_guide_next_step({"clearAllPrevUi":true})',
  SkipCurrentWizard = 'skip_current_wizard()',
  SkipCurrentWizardCurWizardCompletedTrue = 'skip_current_wizard({"curWizardCompleted": true})',
}

export enum OnTarget {
  OpenGuideNextStep = 'open_guide_next_step()',
  OpenGuideNextStepClearAllPrevUITrue = 'open_guide_next_step({"clearAllPrevUi":true})',
  SkipCurrentWizardCurWizardCompletedTrue = 'skip_current_wizard({"curWizardCompleted": true})',
}

export enum UIType {
  Breath = 'breath',
  Modal = 'modal',
  Notice = 'notice',
  Popover = 'popover',
  Questionnaire = 'questionnaire',
  Slideout = 'slideout',
}

export interface Wizard {
  completeIndex: number;
  steps?: string;
  player?: WizardPlayer;
  repeat?: boolean;
  endTime?: number;
  startTime?: number;
  strings的副本?: string[];
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
  invitation_reward: BeInvitedToReward;
  official_adjustment: OfficialAdjustment;
  official_invitation_reward: BeInvitedToReward;
  redemption_code: BeInvitedToReward;
  wizard_reward: BeInvitedToReward;
  wizard_video_reward: BeInvitedToReward;
}

export interface BeInvitedToReward {
  action_code: string;
  day_max_integral_value: number;
  display_name: string[];
  online?: boolean;
  strings的副本: string[];
  integral_value: number;
  notify?: boolean;
  action_name: string;
}

export interface OfficialAdjustment {
  action_code: string;
  display_name: string[];
  online: boolean;
  strings的副本: string[];
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
  ina5200279359980055: Ina5200279359980055;
  ina9134969049653777: Ina9134969049653777;
  ina5645957505507647: Ina5645957505507647;
}

export interface CLI {
  logo: Image;
  env: string[];
  'strings的副本 2': string[];
  'strings的副本 5': string[];
  'strings的副本 4': string[];
  strings的副本: string[];
  app_info: string;
  'strings的副本 6': string[];
  note: string;
  app_name: string;
  'strings的副本 7': string[];
  type: string;
  app_description: string;
  id: string;
  display_order: number;
  image: Image;
  app_id: string;
  'strings的副本 3': string[];
  link_to_cms: string;
  btn_card: CLI9F3930Dd7D7Ad00CBtnCard;
  modal: CLI9F3930Dd7D7Ad00CModal;
}

export interface CLI9F3930Dd7D7Ad00CBtnCard {
  btn_text: string;
  btn_action: string;
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

export interface Ina5200279359980055 {
  logo: Image;
  env: string[];
  'strings的副本 2': string[];
  'strings的副本 5': string[];
  'strings的副本 4': string[];
  strings的副本: string[];
  app_info: string;
  'strings的副本 6': string[];
  note: string;
  app_name: string;
  type: string;
  app_description: string;
  id: string;
  display_order: number;
  image: Image;
  app_id: string;
  'strings的副本 3': string[];
  btn_card: Ina5200279359980055BtnCard;
  modal: Ina5200279359980055Modal;
}

export interface Ina5200279359980055BtnCard {
  btn_text: string;
  btn_type: string;
  apps_btn_text: string;
}

export interface Ina5200279359980055Modal {
  btn_text: string;
  app_description: string;
  btn_type: string;
}

export interface Ina5645957505507647 {
  logo: Image;
  env: string[];
  'strings的副本 2': string[];
  'strings的副本 5': string[];
  'strings的副本 4': string[];
  strings的副本: string[];
  app_info: string;
  'strings的副本 6': string[];
  note: string;
  app_name: string;
  'strings的副本 7': string[];
  type: string;
  app_description: string;
  id: string;
  display_order: number;
  image: Image;
  app_id: string;
  'strings的副本 3': string[];
  link_to_cms: string;
  btn_card: Ina5200279359980055BtnCard;
  modal: CLI9F3930Dd7D7Ad00CModal;
}

export interface Ina9134969049653777 {
  logo: Image;
  env: string[];
  'strings的副本 2': string[];
  'strings的副本 5': string[];
  'strings的副本 4': string[];
  strings的副本: string[];
  app_info: string;
  'strings的副本 6': string[];
  note: string;
  app_name: string;
  type: string;
  app_description: string;
  id: string;
  display_order: number;
  image: Image;
  app_id: string;
  'strings的副本 3': string[];
  link_to_cms: string;
  btn_card: CLI9F3930Dd7D7Ad00CBtnCard;
  modal: CLI9F3930Dd7D7Ad00CModal;
}

export interface Notifications {
  types: Types;
  templates: Templates;
}

export interface Templates {
  __place_holder: BeijingPigeon;
  add_sub_admin: BeijingPigeon;
  assigned_to_group: BeijingPigeon;
  capacity_limit: BeijingPigeon;
  changed_ordinary_user: BeijingPigeon;
  comment_mentioned: BeijingPigeon;
  datasheet_limit: BeijingPigeon;
  integral_income_notify: IntegralIncomeNotify;
  invite_member_toadmin: BeijingPigeon;
  invite_member_tomyself: BeijingPigeon;
  invite_member_touser: BeijingPigeon;
  quit_space: BeijingPigeon;
  remove_from_group: BeijingPigeon;
  removed_from_space_toadmin: BeijingPigeon;
  removed_from_space_touser: BeijingPigeon;
  removed_member_tomyself: BeijingPigeon;
  server_pre_publish: BeijingPigeon;
  single_record_comment_mentioned: BeijingPigeon;
  single_record_member_mention: BeijingPigeon;
  space_add_primary_admin: BeijingPigeon;
  space_deleted: BeijingPigeon;
  space_join_apply: IntegralIncomeNotify;
  space_join_apply_approved: BeijingPigeon;
  space_join_apply_refused: IntegralIncomeNotify;
  space_name_change: BeijingPigeon;
  space_recover: BeijingPigeon;
  space_seats_limit: SpaceSeatsLimit;
  user_field: BeijingPigeon;
  web_publish: BeijingPigeon;
}

export interface BeijingPigeon {
  can_jump?: boolean;
  toTag: string;
  formatString: string[];
  is_mobile?: boolean;
  is_browser?: boolean;
  strings的副本?: string[];
  url?: URL;
  notificationsType: TypeElement[];
  is_notification?: boolean;
  html?: string[];
  is_component?: boolean;
  force_reload?: boolean;
}

export enum URL {
  Empty = '_',
  Management = '/management',
  Workbench = '/workbench',
}

export interface IntegralIncomeNotify {
  toTag: string;
  formatString: string[];
  is_notification: boolean;
  strings的副本: string[];
  notificationsType: TypeElement[];
  is_mail?: boolean;
}

export interface SpaceSeatsLimit {
  toTag: string;
  is_mail: boolean;
  is_browser: boolean;
  notificationsType: TypeElement[];
}

export interface Types {
  member: Member;
  record: Member;
  space: Member;
  system: Member;
}

export interface Member {
  strings的副本: string[];
  formatString: string[];
  tag: TypeElement;
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
  _: WechatMpAppidStaging;
  address_shown: TrapaniSnowLeopard;
  app_error_logger: TrapaniSnowLeopard;
  app_modal_confirm: TrapaniSnowLeopard;
  app_set_user_id: TrapaniSnowLeopard;
  app_tracker: TrapaniSnowLeopard;
  datasheet_add_new_view: TrapaniSnowLeopard;
  datasheet_dashboard_panel_shown: TrapaniSnowLeopard;
  datasheet_delete_record: TrapaniSnowLeopard;
  datasheet_field_context_hidden: TrapaniSnowLeopard;
  datasheet_field_context_shown: TrapaniSnowLeopard;
  datasheet_field_setting_hidden: DatasheetFieldSettingHidden;
  datasheet_field_setting_shown: TrapaniSnowLeopard;
  datasheet_grid_view_shown: DatasheetFieldSettingHidden;
  datasheet_search_panel_hidden: DatasheetFieldSettingHidden;
  datasheet_search_panel_shown: TrapaniSnowLeopard;
  datasheet_shown: TrapaniSnowLeopard;
  datasheet_widget_center_modal_shown: DatasheetFieldSettingHidden;
  datasheet_wigdet_empty_panel_shown: TrapaniSnowLeopard;
  get_context_menu_file_more: TrapaniSnowLeopard;
  get_context_menu_folder_more: TrapaniSnowLeopard;
  get_context_menu_root_add: TrapaniSnowLeopard;
  get_nav_list: TrapaniSnowLeopard;
  invite_entrance_modal_shown: TrapaniSnowLeopard;
  space_setting_main_admin_shown: TrapaniSnowLeopard;
  space_setting_member_manage_shown: TrapaniSnowLeopard;
  space_setting_overview_shown: TrapaniSnowLeopard;
  space_setting_sub_admin_shown: TrapaniSnowLeopard;
  space_setting_workbench_shown: TrapaniSnowLeopard;
  template_center_shown: TrapaniSnowLeopard;
  template_detail_shown: TrapaniSnowLeopard;
  template_use_confirm_modal_shown: TrapaniSnowLeopard;
  view_add_panel_shown: TrapaniSnowLeopard;
  view_convert_gallery: TrapaniSnowLeopard;
  workbench_create_form_bth_clicked: TrapaniSnowLeopard;
  workbench_create_form_panel_shown: TrapaniSnowLeopard;
  workbench_create_form_previewer_shown: DatasheetFieldSettingHidden;
  workbench_entry: TrapaniSnowLeopard;
  workbench_folder_showcase_shown: TrapaniSnowLeopard;
  workbench_form_container_shown: DatasheetFieldSettingHidden;
  workbench_hidden_vikaby_btn_clicked: TrapaniSnowLeopard;
  workbench_shown: TrapaniSnowLeopard;
  workbench_space_list_shown: TrapaniSnowLeopard;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WechatMpAppidStaging {
}

export interface TrapaniSnowLeopard {
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
}

export interface Settings {
  _build_branch: ChiangMaiGoose;
  _build_id: ChiangMaiGoose;
  _version_type: ChiangMaiGoose;
  account_wallet_help: ChiangMaiGoose;
  activity_center_end_time: ChiangMaiGoose;
  activity_center_url: ChiangMaiGoose;
  anonymous_avatar: ChiangMaiGoose;
  ap_rate_hour: ChiangMaiGoose;
  api_rate_day: ChiangMaiGoose;
  api_rate_inute: ChiangMaiGoose;
  api_rate_second: ChiangMaiGoose;
  billing_default_billing_period: ChiangMaiGoose;
  billing_default_grade: ChiangMaiGoose;
  billing_default_seats: ChiangMaiGoose;
  blank_mirror_list_image: ChiangMaiGoose;
  calendar_guide_video: CalendarGuideVideo;
  ' customer_service_qr_code': ChiangMaiGoose;
  default_avatar: ChiangMaiGoose;
  deploy_mode: CalendarGuideVideo;
  ding_talk_login_appid_dev: ChiangMaiGoose;
  ding_talk_login_appid_pro: ChiangMaiGoose;
  dingtalk_login_appid_dev: ChiangMaiGoose;
  dingtalk_login_appid_prod: ChiangMaiGoose;
  dingtalk_login_appid_staging: ChiangMaiGoose;
  dingtalk_login_callback_dev: ChiangMaiGoose;
  dingtalk_login_callback_prod: ChiangMaiGoose;
  dingtalk_login_callback_staging: ChiangMaiGoose;
  'emoji-apple-32': ChiangMaiGoose;
  'emoji-apple-64': ChiangMaiGoose;
  feishu_bind_help: ChiangMaiGoose;
  feishu_callback_pathname: ChiangMaiGoose;
  feishu_login_appid: CalendarGuideVideo;
  feishu_login_appid_dev: ChiangMaiGoose;
  feishu_login_appid_prod: ChiangMaiGoose;
  feishu_login_appid_staging: ChiangMaiGoose;
  feishu_manage_open_url: ChiangMaiGoose;
  feishu_seats_form: ChiangMaiGoose;
  feisu_register_link_in_login: ChiangMaiGoose;
  folder_showcase_banners: ChiangMaiGoose;
  form_guide_video: ChiangMaiGoose;
  gallery_guide_video: ChiangMaiGoose;
  gantt_guide_video: ChiangMaiGoose;
  grades_info: ChiangMaiGoose;
  grid_guide_video: ChiangMaiGoose;
  guide_api_getting_start: ChiangMaiGoose;
  integration_official_template_category: OfficialTemplateCategory;
  integration_official_template_choice: CalendarGuideVideo;
  introduction_video: ChiangMaiGoose;
  invite_code_image_dev: ChiangMaiGoose;
  invite_code_image_pro: ChiangMaiGoose;
  kanban_guide_video: ChiangMaiGoose;
  labs_open_spaces: ChiangMaiGoose;
  language: ChiangMaiGoose;
  link_preview_office_cms: LinkCMS;
  link_to_dingtalk_cms: LinkCMS;
  link_to_lark_cms: LinkCMS;
  minimum_version_require: ChiangMaiGoose;
  node_count_trigger: ChiangMaiGoose;
  official_avatar: ChiangMaiGoose;
  permission_config_in_workbench_page: ChiangMaiGoose;
  product_roadmap: ChiangMaiGoose;
  QNY1: ChiangMaiGoose;
  QNY2: ChiangMaiGoose;
  qq_callback_dev: ChiangMaiGoose;
  qq_callback_prod: ChiangMaiGoose;
  qq_callback_staging: ChiangMaiGoose;
  qq_connect_web_appid_dev: ChiangMaiGoose;
  qq_connect_web_appid_prod: ChiangMaiGoose;
  qq_connect_web_appid_staging: ChiangMaiGoose;
  recorded_comments: ChiangMaiGoose;
  solution: ChiangMaiGoose;
  subscribe_demonstrate: ChiangMaiGoose;
  template_customization: ChiangMaiGoose;
  template_space_id: ChiangMaiGoose;
  user_feedback_url: ChiangMaiGoose;
  version: ChiangMaiGoose;
  vika_official_template_category: OfficialTemplateCategory;
  vika_official_template_choice: CalendarGuideVideo;
  wechat_mp_appid_dev: ChiangMaiGoose;
  wechat_mp_appid_prod: ChiangMaiGoose;
  wechat_mp_appid_staging: WechatMpAppidStaging;
  wechat_mp_callback_dev: ChiangMaiGoose;
  wechat_mp_callback_prod: ChiangMaiGoose;
  wecom_bind_help_center: ChiangMaiGoose;
  wecom_bind_success_icon: ChiangMaiGoose;
  wecom_callback_path: ChiangMaiGoose;
  wecom_integration_logo: ChiangMaiGoose;
  wecom_login_qrcode_js: ChiangMaiGoose;
  wecom_qrcode_css: ChiangMaiGoose;
  welcome_get_vika: ChiangMaiGoose;
  welcome_module4_url: ChiangMaiGoose;
  welcome_module5_url: ChiangMaiGoose;
  welcome_module6_url: ChiangMaiGoose;
  welcome_module7_url: ChiangMaiGoose;
  welcome_module8_url: ChiangMaiGoose;
  welcome_module9_url: ChiangMaiGoose;
  welcome_quick_start: ChiangMaiGoose;
  welcome_what_is_vikasheet: ChiangMaiGoose;
}

export interface ChiangMaiGoose {
  value: string;
}

export interface CalendarGuideVideo {
  已废弃: boolean;
  value: string;
}

export interface OfficialTemplateCategory {
  已废弃: boolean;
}

export interface LinkCMS {
  value: string;
  marketplace: LinkPreviewOfficeCMSMarketplace;
}

export interface LinkPreviewOfficeCMSMarketplace {
  integration: string[];
}

export interface ShortcutKey {
  show?: boolean;
  strings的副本?: Strings的副本[];
  key: string;
  winKey: string;
  name?: string[];
  when?: string;
  id: string;
  command: string;
  description?: string;
  'strings的副本 2'?: string[];
  type?: Strings的副本[];
}

export enum Strings的副本 {
  GalleryViewShortcuts = 'gallery_view_shortcuts',
  GirdViewShortcuts = 'gird_view_shortcuts',
  GlobalShortcuts = 'global_shortcuts',
  WorkbenckShortcuts = 'workbenck_shortcuts',
}
