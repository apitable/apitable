import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'

import { ActionExecutionVO } from '../models/ActionExecutionVO';
import { ActionSimpleVO } from '../models/ActionSimpleVO';
import { ActionTypeCreateRO } from '../models/ActionTypeCreateRO';
import { ActionTypeEditRO } from '../models/ActionTypeEditRO';
import { ActionVO } from '../models/ActionVO';
import { ActiveSheetsOpRo } from '../models/ActiveSheetsOpRo';
import { ActivityStatusRo } from '../models/ActivityStatusRo';
import { AddNodeRoleRo } from '../models/AddNodeRoleRo';
import { AddRoleMemberRo } from '../models/AddRoleMemberRo';
import { AddSpaceRoleRo } from '../models/AddSpaceRoleRo';
import { AgentCreateRO } from '../models/AgentCreateRO';
import { AgentUpdateParams } from '../models/AgentUpdateParams';
import { AgentVO } from '../models/AgentVO';
import { Ai } from '../models/Ai';
import { AiInfoVO } from '../models/AiInfoVO';
import { AiSetting } from '../models/AiSetting';
import { AiTrainingDataSource } from '../models/AiTrainingDataSource';
import { AiUpdateParams } from '../models/AiUpdateParams';
import { AlbumContentVo } from '../models/AlbumContentVo';
import { AlbumGroupVo } from '../models/AlbumGroupVo';
import { AlbumVo } from '../models/AlbumVo';
import { AppInfo } from '../models/AppInfo';
import { AppInstance } from '../models/AppInstance';
import { ApplicationContext } from '../models/ApplicationContext';
import { ApplicationContextClassLoader } from '../models/ApplicationContextClassLoader';
import { ApplicationContextClassLoaderParent } from '../models/ApplicationContextClassLoaderParent';
import { AssetUploadCertificateRO } from '../models/AssetUploadCertificateRO';
import { AssetUploadCertificateVO } from '../models/AssetUploadCertificateVO';
import { AssetUploadNotifyRO } from '../models/AssetUploadNotifyRO';
import { AssetUploadResult } from '../models/AssetUploadResult';
import { AssetUrlSignatureRo } from '../models/AssetUrlSignatureRo';
import { AssetUrlSignatureVo } from '../models/AssetUrlSignatureVo';
import { AssetsAuditOpRo } from '../models/AssetsAuditOpRo';
import { AssetsAuditRo } from '../models/AssetsAuditRo';
import { AssetsAuditVo } from '../models/AssetsAuditVo';
import { AttachOfficePreviewRo } from '../models/AttachOfficePreviewRo';
import { AttachOpRo } from '../models/AttachOpRo';
import { AttachUrlOpRo } from '../models/AttachUrlOpRo';
import { AuditContent } from '../models/AuditContent';
import { AutomationApiRobotRo } from '../models/AutomationApiRobotRo';
import { AutomationApiTriggerCreateRo } from '../models/AutomationApiTriggerCreateRo';
import { AutomationApiTriggerRo } from '../models/AutomationApiTriggerRo';
import { AutomationPropertyRO } from '../models/AutomationPropertyRO';
import { AutomationPropertyVO } from '../models/AutomationPropertyVO';
import { AutomationServiceCreateRO } from '../models/AutomationServiceCreateRO';
import { AutomationServiceEditRO } from '../models/AutomationServiceEditRO';
import { AutomationSimpleVO } from '../models/AutomationSimpleVO';
import { AutomationTaskSimpleVO } from '../models/AutomationTaskSimpleVO';
import { AutomationTriggerCreateVo } from '../models/AutomationTriggerCreateVo';
import { AutomationVO } from '../models/AutomationVO';
import { Banner } from '../models/Banner';
import { BatchDeleteNodeRoleRo } from '../models/BatchDeleteNodeRoleRo';
import { BatchFieldRoleDeleteRo } from '../models/BatchFieldRoleDeleteRo';
import { BatchFieldRoleEditRo } from '../models/BatchFieldRoleEditRo';
import { BatchModifyNodeRoleRo } from '../models/BatchModifyNodeRoleRo';
import { BillingDetail } from '../models/BillingDetail';
import { BillingInfo } from '../models/BillingInfo';
import { BillingSessionVO } from '../models/BillingSessionVO';
import { ChatbotEnableRo } from '../models/ChatbotEnableRo';
import { CheckUserEmailRo } from '../models/CheckUserEmailRo';
import { CheckoutCreation } from '../models/CheckoutCreation';
import { CheckoutCreationVO } from '../models/CheckoutCreationVO';
import { ClientInfoVO } from '../models/ClientInfoVO';
import { CodeValidateRo } from '../models/CodeValidateRo';
import { ConfigDatasheetRo } from '../models/ConfigDatasheetRo';
import { ConfigRo } from '../models/ConfigRo';
import { ContentCensorReportRo } from '../models/ContentCensorReportRo';
import { ContentCensorResultVo } from '../models/ContentCensorResultVo';
import { Control } from '../models/Control';
import { CreateActionRO } from '../models/CreateActionRO';
import { CreateAppInstance } from '../models/CreateAppInstance';
import { CreateDatasheetRo } from '../models/CreateDatasheetRo';
import { CreateDatasheetVo } from '../models/CreateDatasheetVo';
import { CreateOrderRo } from '../models/CreateOrderRo';
import { CreateRoleRo } from '../models/CreateRoleRo';
import { CreateSpaceResultVo } from '../models/CreateSpaceResultVo';
import { CreateTeamRo } from '../models/CreateTeamRo';
import { CreateTemplateRo } from '../models/CreateTemplateRo';
import { CreateTriggerRO } from '../models/CreateTriggerRO';
import { CreateUnitTeamRo } from '../models/CreateUnitTeamRo';
import { CreatedMemberInfoVo } from '../models/CreatedMemberInfoVo';
import { CreditUsage } from '../models/CreditUsage';
import { CustomerInvoice } from '../models/CustomerInvoice';
import { CustomerInvoices } from '../models/CustomerInvoices';
import { DataSource } from '../models/DataSource';
import { DataSourceParam } from '../models/DataSourceParam';
import { DatasheetPermissionView } from '../models/DatasheetPermissionView';
import { DeleteBatchMemberRo } from '../models/DeleteBatchMemberRo';
import { DeleteMemberRo } from '../models/DeleteMemberRo';
import { DeleteNodeRoleRo } from '../models/DeleteNodeRoleRo';
import { DeleteRoleMemberRo } from '../models/DeleteRoleMemberRo';
import { DeptLeader } from '../models/DeptLeader';
import { DeptOrder } from '../models/DeptOrder';
import { DevelopUserVo } from '../models/DevelopUserVo';
import { DeveloperInfoVo } from '../models/DeveloperInfoVo';
import { DeveloperVo } from '../models/DeveloperVo';
import { DingTalkAgentBindSpaceDTO } from '../models/DingTalkAgentBindSpaceDTO';
import { DingTalkBindOpRo } from '../models/DingTalkBindOpRo';
import { DingTalkBindSpaceVo } from '../models/DingTalkBindSpaceVo';
import { DingTalkDaTemplateCreateRo } from '../models/DingTalkDaTemplateCreateRo';
import { DingTalkDaTemplateDeleteRo } from '../models/DingTalkDaTemplateDeleteRo';
import { DingTalkDaTemplateUpdateRo } from '../models/DingTalkDaTemplateUpdateRo';
import { DingTalkDdConfigRo } from '../models/DingTalkDdConfigRo';
import { DingTalkDdConfigVo } from '../models/DingTalkDdConfigVo';
import { DingTalkInternalSkuPageRo } from '../models/DingTalkInternalSkuPageRo';
import { DingTalkIsvAdminUserLoginVo } from '../models/DingTalkIsvAdminUserLoginVo';
import { DingTalkIsvAminUserLoginRo } from '../models/DingTalkIsvAminUserLoginRo';
import { DingTalkIsvUserLoginRo } from '../models/DingTalkIsvUserLoginRo';
import { DingTalkIsvUserLoginVo } from '../models/DingTalkIsvUserLoginVo';
import { DingTalkTenantMainAdminChangeRo } from '../models/DingTalkTenantMainAdminChangeRo';
import { DingTalkUserDetail } from '../models/DingTalkUserDetail';
import { DingTalkUserLoginRo } from '../models/DingTalkUserLoginRo';
import { DingTalkUserLoginVo } from '../models/DingTalkUserLoginVo';
import { DryRunOrderArgs } from '../models/DryRunOrderArgs';
import { EmailCodeValidateRo } from '../models/EmailCodeValidateRo';
import { EmailOpRo } from '../models/EmailOpRo';
import { Environment } from '../models/Environment';
import { EventVO } from '../models/EventVO';
import { FavoriteNodeInfo } from '../models/FavoriteNodeInfo';
import { FeatureVo } from '../models/FeatureVo';
import { Feedback } from '../models/Feedback';
import { FeedbackCreateParam } from '../models/FeedbackCreateParam';
import { FeedbackPagination } from '../models/FeedbackPagination';
import { FeedbackUpdateParam } from '../models/FeedbackUpdateParam';
import { FeedbackVO } from '../models/FeedbackVO';
import { FeishuAppConfigRo } from '../models/FeishuAppConfigRo';
import { FeishuAppEventConfigRo } from '../models/FeishuAppEventConfigRo';
import { FeishuTenantDetailVO } from '../models/FeishuTenantDetailVO';
import { FeishuTenantMainAdminChangeRo } from '../models/FeishuTenantMainAdminChangeRo';
import { Field } from '../models/Field';
import { FieldCollaboratorVO } from '../models/FieldCollaboratorVO';
import { FieldControlProp } from '../models/FieldControlProp';
import { FieldPermission } from '../models/FieldPermission';
import { FieldPermissionInfo } from '../models/FieldPermissionInfo';
import { FieldPermissionView } from '../models/FieldPermissionView';
import { FieldRole } from '../models/FieldRole';
import { FieldRoleCreateRo } from '../models/FieldRoleCreateRo';
import { FieldRoleDeleteRo } from '../models/FieldRoleDeleteRo';
import { FieldRoleEditRo } from '../models/FieldRoleEditRo';
import { FieldRoleMemberVo } from '../models/FieldRoleMemberVo';
import { FieldRoleSetting } from '../models/FieldRoleSetting';
import { GlobalWidgetInfo } from '../models/GlobalWidgetInfo';
import { GlobalWidgetListRo } from '../models/GlobalWidgetListRo';
import { GmApplyFeatureRo } from '../models/GmApplyFeatureRo';
import { GmLabFeatureVo } from '../models/GmLabFeatureVo';
import { GmLabsFeatureCreatorRo } from '../models/GmLabsFeatureCreatorRo';
import { HotsTransformIpRo } from '../models/HotsTransformIpRo';
import { HqAddUserRo } from '../models/HqAddUserRo';
import { HqAddUserVo } from '../models/HqAddUserVo';
import { IdaasAuthCallbackRo } from '../models/IdaasAuthCallbackRo';
import { IdaasAuthLoginVo } from '../models/IdaasAuthLoginVo';
import { IdaasBindInfoVo } from '../models/IdaasBindInfoVo';
import { ImportExcelOpRo } from '../models/ImportExcelOpRo';
import { InstanceConfig } from '../models/InstanceConfig';
import { InstanceConfigProfile } from '../models/InstanceConfigProfile';
import { IntegralDeductRo } from '../models/IntegralDeductRo';
import { IntegralRecordVO } from '../models/IntegralRecordVO';
import { Intent } from '../models/Intent';
import { InternalCreditUsageVo } from '../models/InternalCreditUsageVo';
import { InternalPermissionRo } from '../models/InternalPermissionRo';
import { InternalSpaceApiRateLimitVo } from '../models/InternalSpaceApiRateLimitVo';
import { InternalSpaceApiUsageVo } from '../models/InternalSpaceApiUsageVo';
import { InternalSpaceAutomationRunMessageV0 } from '../models/InternalSpaceAutomationRunMessageV0';
import { InternalSpaceCapacityVo } from '../models/InternalSpaceCapacityVo';
import { InternalSpaceInfoVo } from '../models/InternalSpaceInfoVo';
import { InternalSpaceSubscriptionVo } from '../models/InternalSpaceSubscriptionVo';
import { InternalSpaceUsageVo } from '../models/InternalSpaceUsageVo';
import { InviteCodeRewardRo } from '../models/InviteCodeRewardRo';
import { InviteInfoVo } from '../models/InviteInfoVo';
import { InviteMemberAgainRo } from '../models/InviteMemberAgainRo';
import { InviteMemberRo } from '../models/InviteMemberRo';
import { InviteRo } from '../models/InviteRo';
import { InviteUserInfo } from '../models/InviteUserInfo';
import { InviteValidRo } from '../models/InviteValidRo';
import { JSONConfig } from '../models/JSONConfig';
import { JSONObject } from '../models/JSONObject';
import { LabsFeatureVo } from '../models/LabsFeatureVo';
import { LoadSearchDTO } from '../models/LoadSearchDTO';
import { LoginResultVO } from '../models/LoginResultVO';
import { LoginRo } from '../models/LoginRo';
import { LogoutVO } from '../models/LogoutVO';
import { MainAdminInfoVo } from '../models/MainAdminInfoVo';
import { MarkNodeMoveRo } from '../models/MarkNodeMoveRo';
import { MarketplaceSpaceAppVo } from '../models/MarketplaceSpaceAppVo';
import { MemberBriefInfoVo } from '../models/MemberBriefInfoVo';
import { MemberInfo } from '../models/MemberInfo';
import { MemberInfoVo } from '../models/MemberInfoVo';
import { MemberMobile } from '../models/MemberMobile';
import { MemberPageVo } from '../models/MemberPageVo';
import { MemberRo } from '../models/MemberRo';
import { MemberTeamPathInfo } from '../models/MemberTeamPathInfo';
import { MemberUnitsVo } from '../models/MemberUnitsVo';
import { Message } from '../models/Message';
import { MessageCreditLimit } from '../models/MessageCreditLimit';
import { MessageCreditUsageVO } from '../models/MessageCreditUsageVO';
import { MessageItem } from '../models/MessageItem';
import { Meta } from '../models/Meta';
import { MigrationResourcesRo } from '../models/MigrationResourcesRo';
import { ModifyNodeRoleRo } from '../models/ModifyNodeRoleRo';
import { MpSignatureRo } from '../models/MpSignatureRo';
import { Node } from '../models/Node';
import { NodeBundleOpRo } from '../models/NodeBundleOpRo';
import { NodeCollaboratorVO } from '../models/NodeCollaboratorVO';
import { NodeCollaboratorsVo } from '../models/NodeCollaboratorsVo';
import { NodeCopyOpRo } from '../models/NodeCopyOpRo';
import { NodeDescOpRo } from '../models/NodeDescOpRo';
import { NodeExtra } from '../models/NodeExtra';
import { NodeInfo } from '../models/NodeInfo';
import { NodeInfoTreeVo } from '../models/NodeInfoTreeVo';
import { NodeInfoVo } from '../models/NodeInfoVo';
import { NodeInfoWindowVo } from '../models/NodeInfoWindowVo';
import { NodeMoveOpRo } from '../models/NodeMoveOpRo';
import { NodeOpRo } from '../models/NodeOpRo';
import { NodePathVo } from '../models/NodePathVo';
import { NodePermissionView } from '../models/NodePermissionView';
import { NodeRecoverRo } from '../models/NodeRecoverRo';
import { NodeRelRo } from '../models/NodeRelRo';
import { NodeRoleMemberVo } from '../models/NodeRoleMemberVo';
import { NodeRoleUnit } from '../models/NodeRoleUnit';
import { NodeSearchResult } from '../models/NodeSearchResult';
import { NodeShareInfoVO } from '../models/NodeShareInfoVO';
import { NodeShareSettingInfoVO } from '../models/NodeShareSettingInfoVO';
import { NodeShareSettingPropsVO } from '../models/NodeShareSettingPropsVO';
import { NodeShareTree } from '../models/NodeShareTree';
import { NodeSimpleVO } from '../models/NodeSimpleVO';
import { NodeUpdateOpRo } from '../models/NodeUpdateOpRo';
import { NotificationCreateRo } from '../models/NotificationCreateRo';
import { NotificationDetailVo } from '../models/NotificationDetailVo';
import { NotificationListRo } from '../models/NotificationListRo';
import { NotificationPageRo } from '../models/NotificationPageRo';
import { NotificationReadRo } from '../models/NotificationReadRo';
import { NotificationRevokeRo } from '../models/NotificationRevokeRo';
import { NotificationStatisticsVo } from '../models/NotificationStatisticsVo';
import { NotifyBody } from '../models/NotifyBody';
import { OneAccessCopyInfoRo } from '../models/OneAccessCopyInfoRo';
import { OpAssetRo } from '../models/OpAssetRo';
import { Operator } from '../models/Operator';
import { OrderDetailVo } from '../models/OrderDetailVo';
import { OrderItem } from '../models/OrderItem';
import { OrderPaymentVo } from '../models/OrderPaymentVo';
import { OrderPreview } from '../models/OrderPreview';
import { OrgUnitRo } from '../models/OrgUnitRo';
import { OrganizationUnitVo } from '../models/OrganizationUnitVo';
import { Page } from '../models/Page';
import { PageInfoAppInfo } from '../models/PageInfoAppInfo';
import { PageInfoAppInstance } from '../models/PageInfoAppInstance';
import { PageInfoAssetsAuditVo } from '../models/PageInfoAssetsAuditVo';
import { PageInfoContentCensorResultVo } from '../models/PageInfoContentCensorResultVo';
import { PageInfoFieldRoleMemberVo } from '../models/PageInfoFieldRoleMemberVo';
import { PageInfoIntegralRecordVO } from '../models/PageInfoIntegralRecordVO';
import { PageInfoMemberPageVo } from '../models/PageInfoMemberPageVo';
import { PageInfoNodeRoleMemberVo } from '../models/PageInfoNodeRoleMemberVo';
import { PageInfoQrCodePageVo } from '../models/PageInfoQrCodePageVo';
import { PageInfoRoleMemberVo } from '../models/PageInfoRoleMemberVo';
import { PageInfoSpaceAuditPageVO } from '../models/PageInfoSpaceAuditPageVO';
import { PageInfoSpaceCapacityPageVO } from '../models/PageInfoSpaceCapacityPageVO';
import { PageInfoSpaceRoleVo } from '../models/PageInfoSpaceRoleVo';
import { PageInfoUnitMemberInfoVo } from '../models/PageInfoUnitMemberInfoVo';
import { PageInfoUnitRoleInfoVo } from '../models/PageInfoUnitRoleInfoVo';
import { PageInfoUnitTeamInfoVo } from '../models/PageInfoUnitTeamInfoVo';
import { PageInfoVCodeActivityPageVo } from '../models/PageInfoVCodeActivityPageVo';
import { PageInfoVCodeCouponPageVo } from '../models/PageInfoVCodeCouponPageVo';
import { PageInfoVCodePageVo } from '../models/PageInfoVCodePageVo';
import { PageLong } from '../models/PageLong';
import { PageRoleBaseInfoDto } from '../models/PageRoleBaseInfoDto';
import { PageVoid } from '../models/PageVoid';
import { PaginationMessage } from '../models/PaginationMessage';
import { ParseErrorRecordVO } from '../models/ParseErrorRecordVO';
import { PausedUserHistoryDto } from '../models/PausedUserHistoryDto';
import { PausedUserHistoryRo } from '../models/PausedUserHistoryRo';
import { PayOrderRo } from '../models/PayOrderRo';
import { PaymentMethodDetail } from '../models/PaymentMethodDetail';
import { PaymentOrderStatusVo } from '../models/PaymentOrderStatusVo';
import { PlayerBaseVo } from '../models/PlayerBaseVo';
import { PriceVO } from '../models/PriceVO';
import { ProductPriceVo } from '../models/ProductPriceVo';
import { ProductVO } from '../models/ProductVO';
import { QrCodeBaseInfo } from '../models/QrCodeBaseInfo';
import { QrCodePageVo } from '../models/QrCodePageVo';
import { QrCodeStatisticsVo } from '../models/QrCodeStatisticsVo';
import { QrCodeVo } from '../models/QrCodeVo';
import { QueryUserInfoRo } from '../models/QueryUserInfoRo';
import { QuoteTemplateRo } from '../models/QuoteTemplateRo';
import { RecommendVo } from '../models/RecommendVo';
import { RedirectView } from '../models/RedirectView';
import { RedirectViewServletContext } from '../models/RedirectViewServletContext';
import { RedirectViewServletContextFilterRegistrationsValue } from '../models/RedirectViewServletContextFilterRegistrationsValue';
import { RedirectViewServletContextJspConfigDescriptor } from '../models/RedirectViewServletContextJspConfigDescriptor';
import { RedirectViewServletContextJspConfigDescriptorJspPropertyGroupsInner } from '../models/RedirectViewServletContextJspConfigDescriptorJspPropertyGroupsInner';
import { RedirectViewServletContextJspConfigDescriptorTaglibsInner } from '../models/RedirectViewServletContextJspConfigDescriptorTaglibsInner';
import { RedirectViewServletContextServletRegistrationsValue } from '../models/RedirectViewServletContextServletRegistrationsValue';
import { RedirectViewServletContextSessionCookieConfig } from '../models/RedirectViewServletContextSessionCookieConfig';
import { RefreshApiKeyRo } from '../models/RefreshApiKeyRo';
import { RegisterRO } from '../models/RegisterRO';
import { RemindExtraRo } from '../models/RemindExtraRo';
import { RemindMemberRo } from '../models/RemindMemberRo';
import { RemindUnitRecRo } from '../models/RemindUnitRecRo';
import { RemindUnitsNoPermissionRo } from '../models/RemindUnitsNoPermissionRo';
import { ResponseData } from '../models/ResponseData';
import { ResponseDataAiInfoVO } from '../models/ResponseDataAiInfoVO';
import { ResponseDataAlbumContentVo } from '../models/ResponseDataAlbumContentVo';
import { ResponseDataAppInstance } from '../models/ResponseDataAppInstance';
import { ResponseDataAssetUploadResult } from '../models/ResponseDataAssetUploadResult';
import { ResponseDataAutomationTriggerCreateVo } from '../models/ResponseDataAutomationTriggerCreateVo';
import { ResponseDataAutomationVO } from '../models/ResponseDataAutomationVO';
import { ResponseDataBillingInfo } from '../models/ResponseDataBillingInfo';
import { ResponseDataBillingSessionVO } from '../models/ResponseDataBillingSessionVO';
import { ResponseDataBoolean } from '../models/ResponseDataBoolean';
import { ResponseDataCreateDatasheetVo } from '../models/ResponseDataCreateDatasheetVo';
import { ResponseDataCreateSpaceResultVo } from '../models/ResponseDataCreateSpaceResultVo';
import { ResponseDataCreditUsages } from '../models/ResponseDataCreditUsages';
import { ResponseDataCustomerInvoices } from '../models/ResponseDataCustomerInvoices';
import { ResponseDataDatasheetPermissionView } from '../models/ResponseDataDatasheetPermissionView';
import { ResponseDataDevelopUserVo } from '../models/ResponseDataDevelopUserVo';
import { ResponseDataDeveloperInfoVo } from '../models/ResponseDataDeveloperInfoVo';
import { ResponseDataDeveloperVo } from '../models/ResponseDataDeveloperVo';
import { ResponseDataDingTalkBindSpaceVo } from '../models/ResponseDataDingTalkBindSpaceVo';
import { ResponseDataDingTalkDdConfigVo } from '../models/ResponseDataDingTalkDdConfigVo';
import { ResponseDataDingTalkIsvAdminUserLoginVo } from '../models/ResponseDataDingTalkIsvAdminUserLoginVo';
import { ResponseDataDingTalkIsvUserLoginVo } from '../models/ResponseDataDingTalkIsvUserLoginVo';
import { ResponseDataDingTalkUserDetail } from '../models/ResponseDataDingTalkUserDetail';
import { ResponseDataDingTalkUserLoginVo } from '../models/ResponseDataDingTalkUserLoginVo';
import { ResponseDataEventVO } from '../models/ResponseDataEventVO';
import { ResponseDataFeedback } from '../models/ResponseDataFeedback';
import { ResponseDataFeedbackPagination } from '../models/ResponseDataFeedbackPagination';
import { ResponseDataFeedbackVO } from '../models/ResponseDataFeedbackVO';
import { ResponseDataFeishuTenantDetailVO } from '../models/ResponseDataFeishuTenantDetailVO';
import { ResponseDataFieldCollaboratorVO } from '../models/ResponseDataFieldCollaboratorVO';
import { ResponseDataFieldPermissionView } from '../models/ResponseDataFieldPermissionView';
import { ResponseDataGmLabFeatureVo } from '../models/ResponseDataGmLabFeatureVo';
import { ResponseDataHqAddUserVo } from '../models/ResponseDataHqAddUserVo';
import { ResponseDataIdaasAuthLoginVo } from '../models/ResponseDataIdaasAuthLoginVo';
import { ResponseDataIdaasBindInfoVo } from '../models/ResponseDataIdaasBindInfoVo';
import { ResponseDataInteger } from '../models/ResponseDataInteger';
import { ResponseDataInternalCreditUsageVo } from '../models/ResponseDataInternalCreditUsageVo';
import { ResponseDataInternalSpaceApiRateLimitVo } from '../models/ResponseDataInternalSpaceApiRateLimitVo';
import { ResponseDataInternalSpaceApiUsageVo } from '../models/ResponseDataInternalSpaceApiUsageVo';
import { ResponseDataInternalSpaceAutomationRunMessageV0 } from '../models/ResponseDataInternalSpaceAutomationRunMessageV0';
import { ResponseDataInternalSpaceCapacityVo } from '../models/ResponseDataInternalSpaceCapacityVo';
import { ResponseDataInternalSpaceInfoVo } from '../models/ResponseDataInternalSpaceInfoVo';
import { ResponseDataInternalSpaceSubscriptionVo } from '../models/ResponseDataInternalSpaceSubscriptionVo';
import { ResponseDataInternalSpaceUsageVo } from '../models/ResponseDataInternalSpaceUsageVo';
import { ResponseDataInviteInfoVo } from '../models/ResponseDataInviteInfoVo';
import { ResponseDataLabsFeatureVo } from '../models/ResponseDataLabsFeatureVo';
import { ResponseDataListActionVO } from '../models/ResponseDataListActionVO';
import { ResponseDataListAgentVO } from '../models/ResponseDataListAgentVO';
import { ResponseDataListAlbumVo } from '../models/ResponseDataListAlbumVo';
import { ResponseDataListAssetUploadCertificateVO } from '../models/ResponseDataListAssetUploadCertificateVO';
import { ResponseDataListAssetUploadResult } from '../models/ResponseDataListAssetUploadResult';
import { ResponseDataListAssetUrlSignatureVo } from '../models/ResponseDataListAssetUrlSignatureVo';
import { ResponseDataListAutomationSimpleVO } from '../models/ResponseDataListAutomationSimpleVO';
import { ResponseDataListAutomationTaskSimpleVO } from '../models/ResponseDataListAutomationTaskSimpleVO';
import { ResponseDataListDatasheetPermissionView } from '../models/ResponseDataListDatasheetPermissionView';
import { ResponseDataListFavoriteNodeInfo } from '../models/ResponseDataListFavoriteNodeInfo';
import { ResponseDataListFieldPermissionView } from '../models/ResponseDataListFieldPermissionView';
import { ResponseDataListGlobalWidgetInfo } from '../models/ResponseDataListGlobalWidgetInfo';
import { ResponseDataListMarketplaceSpaceAppVo } from '../models/ResponseDataListMarketplaceSpaceAppVo';
import { ResponseDataListMemberBriefInfoVo } from '../models/ResponseDataListMemberBriefInfoVo';
import { ResponseDataListMemberInfoVo } from '../models/ResponseDataListMemberInfoVo';
import { ResponseDataListMemberPageVo } from '../models/ResponseDataListMemberPageVo';
import { ResponseDataListNodeInfo } from '../models/ResponseDataListNodeInfo';
import { ResponseDataListNodeInfoVo } from '../models/ResponseDataListNodeInfoVo';
import { ResponseDataListNodePathVo } from '../models/ResponseDataListNodePathVo';
import { ResponseDataListNodeSearchResult } from '../models/ResponseDataListNodeSearchResult';
import { ResponseDataListNotificationDetailVo } from '../models/ResponseDataListNotificationDetailVo';
import { ResponseDataListOrganizationUnitVo } from '../models/ResponseDataListOrganizationUnitVo';
import { ResponseDataListPausedUserHistoryDto } from '../models/ResponseDataListPausedUserHistoryDto';
import { ResponseDataListProductPriceVo } from '../models/ResponseDataListProductPriceVo';
import { ResponseDataListProductVO } from '../models/ResponseDataListProductVO';
import { ResponseDataListRoleInfoVo } from '../models/ResponseDataListRoleInfoVo';
import { ResponseDataListRubbishNodeVo } from '../models/ResponseDataListRubbishNodeVo';
import { ResponseDataListSearchMemberVo } from '../models/ResponseDataListSearchMemberVo';
import { ResponseDataListSpaceLinkVo } from '../models/ResponseDataListSpaceLinkVo';
import { ResponseDataListSpaceShowcaseVo } from '../models/ResponseDataListSpaceShowcaseVo';
import { ResponseDataListSpaceVO } from '../models/ResponseDataListSpaceVO';
import { ResponseDataListString } from '../models/ResponseDataListString';
import { ResponseDataListTeamTreeVo } from '../models/ResponseDataListTeamTreeVo';
import { ResponseDataListTemplateCategoryMenuVo } from '../models/ResponseDataListTemplateCategoryMenuVo';
import { ResponseDataListTemplateVo } from '../models/ResponseDataListTemplateVo';
import { ResponseDataListTrainingInfoVO } from '../models/ResponseDataListTrainingInfoVO';
import { ResponseDataListTriggerVO } from '../models/ResponseDataListTriggerVO';
import { ResponseDataListUnitInfoVo } from '../models/ResponseDataListUnitInfoVo';
import { ResponseDataListUserInPausedDto } from '../models/ResponseDataListUserInPausedDto';
import { ResponseDataListVCodeActivityVo } from '../models/ResponseDataListVCodeActivityVo';
import { ResponseDataListVCodeCouponVo } from '../models/ResponseDataListVCodeCouponVo';
import { ResponseDataListWidgetInfo } from '../models/ResponseDataListWidgetInfo';
import { ResponseDataListWidgetPack } from '../models/ResponseDataListWidgetPack';
import { ResponseDataListWidgetPackageInfoVo } from '../models/ResponseDataListWidgetPackageInfoVo';
import { ResponseDataListWidgetReleaseListVo } from '../models/ResponseDataListWidgetReleaseListVo';
import { ResponseDataListWidgetStoreListInfo } from '../models/ResponseDataListWidgetStoreListInfo';
import { ResponseDataListWidgetTemplatePackageInfo } from '../models/ResponseDataListWidgetTemplatePackageInfo';
import { ResponseDataListWidgetUploadTokenVo } from '../models/ResponseDataListWidgetUploadTokenVo';
import { ResponseDataLoginResultVo } from '../models/ResponseDataLoginResultVO';
import { ResponseDataLoginResultVO } from '../models/ResponseDataLoginResultVO';
import { ResponseDataLogoutVO } from '../models/ResponseDataLogoutVO';
import { ResponseDataMainAdminInfoVo } from '../models/ResponseDataMainAdminInfoVo';
import { ResponseDataMemberInfoVo } from '../models/ResponseDataMemberInfoVo';
import { ResponseDataMemberUnitsVo } from '../models/ResponseDataMemberUnitsVo';
import { ResponseDataMessageCreditUsageVO } from '../models/ResponseDataMessageCreditUsageVO';
import { ResponseDataNodeCollaboratorVO } from '../models/ResponseDataNodeCollaboratorVO';
import { ResponseDataNodeCollaboratorsVo } from '../models/ResponseDataNodeCollaboratorsVo';
import { ResponseDataNodeInfoTreeVo } from '../models/ResponseDataNodeInfoTreeVo';
import { ResponseDataNodeInfoVo } from '../models/ResponseDataNodeInfoVo';
import { ResponseDataNodeInfoWindowVo } from '../models/ResponseDataNodeInfoWindowVo';
import { ResponseDataNodeShareInfoVO } from '../models/ResponseDataNodeShareInfoVO';
import { ResponseDataNodeShareSettingInfoVO } from '../models/ResponseDataNodeShareSettingInfoVO';
import { ResponseDataNotificationStatisticsVo } from '../models/ResponseDataNotificationStatisticsVo';
import { ResponseDataObject } from '../models/ResponseDataObject';
import { ResponseDataOrderDetailVo } from '../models/ResponseDataOrderDetailVo';
import { ResponseDataOrderPaymentVo } from '../models/ResponseDataOrderPaymentVo';
import { ResponseDataOrderPreview } from '../models/ResponseDataOrderPreview';
import { ResponseDataPageInfoAppInfo } from '../models/ResponseDataPageInfoAppInfo';
import { ResponseDataPageInfoAppInstance } from '../models/ResponseDataPageInfoAppInstance';
import { ResponseDataPageInfoAssetsAuditVo } from '../models/ResponseDataPageInfoAssetsAuditVo';
import { ResponseDataPageInfoContentCensorResultVo } from '../models/ResponseDataPageInfoContentCensorResultVo';
import { ResponseDataPageInfoFieldRoleMemberVo } from '../models/ResponseDataPageInfoFieldRoleMemberVo';
import { ResponseDataPageInfoIntegralRecordVO } from '../models/ResponseDataPageInfoIntegralRecordVO';
import { ResponseDataPageInfoMemberPageVo } from '../models/ResponseDataPageInfoMemberPageVo';
import { ResponseDataPageInfoNodeRoleMemberVo } from '../models/ResponseDataPageInfoNodeRoleMemberVo';
import { ResponseDataPageInfoQrCodePageVo } from '../models/ResponseDataPageInfoQrCodePageVo';
import { ResponseDataPageInfoRoleMemberVo } from '../models/ResponseDataPageInfoRoleMemberVo';
import { ResponseDataPageInfoSpaceAuditPageVO } from '../models/ResponseDataPageInfoSpaceAuditPageVO';
import { ResponseDataPageInfoSpaceCapacityPageVO } from '../models/ResponseDataPageInfoSpaceCapacityPageVO';
import { ResponseDataPageInfoSpaceRoleVo } from '../models/ResponseDataPageInfoSpaceRoleVo';
import { ResponseDataPageInfoUnitMemberInfoVo } from '../models/ResponseDataPageInfoUnitMemberInfoVo';
import { ResponseDataPageInfoUnitRoleInfoVo } from '../models/ResponseDataPageInfoUnitRoleInfoVo';
import { ResponseDataPageInfoUnitTeamInfoVo } from '../models/ResponseDataPageInfoUnitTeamInfoVo';
import { ResponseDataPageInfoVCodeActivityPageVo } from '../models/ResponseDataPageInfoVCodeActivityPageVo';
import { ResponseDataPageInfoVCodeCouponPageVo } from '../models/ResponseDataPageInfoVCodeCouponPageVo';
import { ResponseDataPageInfoVCodePageVo } from '../models/ResponseDataPageInfoVCodePageVo';
import { ResponseDataPaginationMessage } from '../models/ResponseDataPaginationMessage';
import { ResponseDataPaymentOrderStatusVo } from '../models/ResponseDataPaymentOrderStatusVo';
import { ResponseDataPureJson } from '../models/ResponseDataPureJson';
import { ResponseDataPureJsonData } from '../models/ResponseDataPureJsonData';
import { ResponseDataQrCodeVo } from '../models/ResponseDataQrCodeVo';
import { ResponseDataRecommendVo } from '../models/ResponseDataRecommendVo';
import { ResponseDataSearchResultVo } from '../models/ResponseDataSearchResultVo';
import { ResponseDataShareBaseInfoVo } from '../models/ResponseDataShareBaseInfoVo';
import { ResponseDataShowcaseVo } from '../models/ResponseDataShowcaseVo';
import { ResponseDataSocialTenantEnvVo } from '../models/ResponseDataSocialTenantEnvVo';
import { ResponseDataSpaceCapacityVO } from '../models/ResponseDataSpaceCapacityVO';
import { ResponseDataSpaceGlobalFeature } from '../models/ResponseDataSpaceGlobalFeature';
import { ResponseDataSpaceInfoVO } from '../models/ResponseDataSpaceInfoVO';
import { ResponseDataSpaceLinkInfoVo } from '../models/ResponseDataSpaceLinkInfoVo';
import { ResponseDataSpaceRoleDetailVo } from '../models/ResponseDataSpaceRoleDetailVo';
import { ResponseDataSpaceSubscribeVo } from '../models/ResponseDataSpaceSubscribeVo';
import { ResponseDataStoreNodeInfoVO } from '../models/ResponseDataStoreNodeInfoVO';
import { ResponseDataString } from '../models/ResponseDataString';
import { ResponseDataSubUnitResultVo } from '../models/ResponseDataSubUnitResultVo';
import { ResponseDataSuggestionVO } from '../models/ResponseDataSuggestionVO';
import { ResponseDataTeamInfoVo } from '../models/ResponseDataTeamInfoVo';
import { ResponseDataTemplateCategoryContentVo } from '../models/ResponseDataTemplateCategoryContentVo';
import { ResponseDataTemplateDirectoryVo } from '../models/ResponseDataTemplateDirectoryVo';
import { ResponseDataTemplateSearchResultVo } from '../models/ResponseDataTemplateSearchResultVo';
import { ResponseDataTenantDetailVO } from '../models/ResponseDataTenantDetailVO';
import { ResponseDataTrainingPredictResult } from '../models/ResponseDataTrainingPredictResult';
import { ResponseDataTrainingStatusVO } from '../models/ResponseDataTrainingStatusVO';
import { ResponseDataUnitMemberInfoVo } from '../models/ResponseDataUnitMemberInfoVo';
import { ResponseDataUnitRoleInfoVo } from '../models/ResponseDataUnitRoleInfoVo';
import { ResponseDataUnitRoleMemberVo } from '../models/ResponseDataUnitRoleMemberVo';
import { ResponseDataUnitSearchResultVo } from '../models/ResponseDataUnitSearchResultVo';
import { ResponseDataUnitTeamInfoVo } from '../models/ResponseDataUnitTeamInfoVo';
import { ResponseDataUploadParseResultVO } from '../models/ResponseDataUploadParseResultVO';
import { ResponseDataUrlAwareContentsVo } from '../models/ResponseDataUrlAwareContentsVo';
import { ResponseDataUserBaseInfoVo } from '../models/ResponseDataUserBaseInfoVo';
import { ResponseDataUserInfoVo } from '../models/ResponseDataUserInfoVo';
import { ResponseDataUserIntegralVo } from '../models/ResponseDataUserIntegralVo';
import { ResponseDataUserProfile } from '../models/ResponseDataUserProfile';
import { ResponseDataUserSpaceLabsFeatureVo } from '../models/ResponseDataUserSpaceLabsFeatureVo';
import { ResponseDataUserSpaceVo } from '../models/ResponseDataUserSpaceVo';
import { ResponseDataVCodeActivityVo } from '../models/ResponseDataVCodeActivityVo';
import { ResponseDataVCodeCouponVo } from '../models/ResponseDataVCodeCouponVo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { ResponseDataWeComBindConfigVo } from '../models/ResponseDataWeComBindConfigVo';
import { ResponseDataWeComBindSpaceVo } from '../models/ResponseDataWeComBindSpaceVo';
import { ResponseDataWeComCheckConfigVo } from '../models/ResponseDataWeComCheckConfigVo';
import { ResponseDataWeComIsvJsSdkAgentConfigVo } from '../models/ResponseDataWeComIsvJsSdkAgentConfigVo';
import { ResponseDataWeComIsvJsSdkConfigVo } from '../models/ResponseDataWeComIsvJsSdkConfigVo';
import { ResponseDataWeComIsvRegisterInstallSelfUrlVo } from '../models/ResponseDataWeComIsvRegisterInstallSelfUrlVo';
import { ResponseDataWeComIsvRegisterInstallWeComVo } from '../models/ResponseDataWeComIsvRegisterInstallWeComVo';
import { ResponseDataWeComIsvUserLoginVo } from '../models/ResponseDataWeComIsvUserLoginVo';
import { ResponseDataWeComUserLoginVo } from '../models/ResponseDataWeComUserLoginVo';
import { ResponseDataWechatAuthorizationEntity } from '../models/ResponseDataWechatAuthorizationEntity';
import { ResponseDataWechatInfoVo } from '../models/ResponseDataWechatInfoVo';
import { ResponseDataWidgetInfoVo } from '../models/ResponseDataWidgetInfoVo';
import { ResponseDataWidgetIssuedGlobalIdVo } from '../models/ResponseDataWidgetIssuedGlobalIdVo';
import { ResponseDataWidgetPack } from '../models/ResponseDataWidgetPack';
import { ResponseDataWidgetPackageInfoVo } from '../models/ResponseDataWidgetPackageInfoVo';
import { ResponseDataWidgetReleaseCreateVo } from '../models/ResponseDataWidgetReleaseCreateVo';
import { ResponseDataWidgetUploadMetaVo } from '../models/ResponseDataWidgetUploadMetaVo';
import { ResponseDataWoaUserLoginVo } from '../models/ResponseDataWoaUserLoginVo';
import { ResponseDataWxJsapiSignature } from '../models/ResponseDataWxJsapiSignature';
import { ResponseDataWxOpenAuthorizerListResult } from '../models/ResponseDataWxOpenAuthorizerListResult';
import { RetrievePwdOpRo } from '../models/RetrievePwdOpRo';
import { RoleBaseInfoDto } from '../models/RoleBaseInfoDto';
import { RoleControlOpenRo } from '../models/RoleControlOpenRo';
import { RoleInfoVo } from '../models/RoleInfoVo';
import { RoleMemberUnitRo } from '../models/RoleMemberUnitRo';
import { RoleMemberVo } from '../models/RoleMemberVo';
import { RoleVo } from '../models/RoleVo';
import { RubbishNodeVo } from '../models/RubbishNodeVo';
import { SearchMemberResultVo } from '../models/SearchMemberResultVo';
import { SearchMemberVo } from '../models/SearchMemberVo';
import { SearchResultVo } from '../models/SearchResultVo';
import { SearchTeamResultVo } from '../models/SearchTeamResultVo';
import { SearchUnitRo } from '../models/SearchUnitRo';
import { SeatUsage } from '../models/SeatUsage';
import { SendMessageParam } from '../models/SendMessageParam';
import { ShareBaseInfoVo } from '../models/ShareBaseInfoVo';
import { ShowcaseVo } from '../models/ShowcaseVo';
import { SmsCodeValidateRo } from '../models/SmsCodeValidateRo';
import { SmsOpRo } from '../models/SmsOpRo';
import { Social } from '../models/Social';
import { SocialTenantEnvVo } from '../models/SocialTenantEnvVo';
import { Space } from '../models/Space';
import { SpaceAssetOpRo } from '../models/SpaceAssetOpRo';
import { SpaceAuditPageVO } from '../models/SpaceAuditPageVO';
import { SpaceCapacityPageVO } from '../models/SpaceCapacityPageVO';
import { SpaceCapacityVO } from '../models/SpaceCapacityVO';
import { SpaceDeleteRo } from '../models/SpaceDeleteRo';
import { SpaceGlobalFeature } from '../models/SpaceGlobalFeature';
import { SpaceInfoVO } from '../models/SpaceInfoVO';
import { SpaceJoinApplyRo } from '../models/SpaceJoinApplyRo';
import { SpaceJoinProcessRo } from '../models/SpaceJoinProcessRo';
import { SpaceLabs } from '../models/SpaceLabs';
import { SpaceLinkInfoVo } from '../models/SpaceLinkInfoVo';
import { SpaceLinkOpRo } from '../models/SpaceLinkOpRo';
import { SpaceLinkVo } from '../models/SpaceLinkVo';
import { SpaceMainAdminChangeOpRo } from '../models/SpaceMainAdminChangeOpRo';
import { SpaceMemberSettingRo } from '../models/SpaceMemberSettingRo';
import { SpaceOpRo } from '../models/SpaceOpRo';
import { SpaceRoleDetailVo } from '../models/SpaceRoleDetailVo';
import { SpaceRoleVo } from '../models/SpaceRoleVo';
import { SpaceSecuritySettingRo } from '../models/SpaceSecuritySettingRo';
import { SpaceShowcaseVo } from '../models/SpaceShowcaseVo';
import { SpaceSocialConfig } from '../models/SpaceSocialConfig';
import { SpaceStatisticsRo } from '../models/SpaceStatisticsRo';
import { SpaceSubscribeVo } from '../models/SpaceSubscribeVo';
import { SpaceUpdateOpRo } from '../models/SpaceUpdateOpRo';
import { SpaceVO } from '../models/SpaceVO';
import { SpaceWorkbenchSettingRo } from '../models/SpaceWorkbenchSettingRo';
import { StoreNodeInfoVO } from '../models/StoreNodeInfoVO';
import { StoreShareNodeRo } from '../models/StoreShareNodeRo';
import { SubUnitResultVo } from '../models/SubUnitResultVo';
import { SuggestionParams } from '../models/SuggestionParams';
import { SuggestionVO } from '../models/SuggestionVO';
import { SyncSocialDingTalkAppRo } from '../models/SyncSocialDingTalkAppRo';
import { TagVo } from '../models/TagVo';
import { TeamAddMemberRo } from '../models/TeamAddMemberRo';
import { TeamInfoVo } from '../models/TeamInfoVo';
import { TeamTreeVo } from '../models/TeamTreeVo';
import { TeamVo } from '../models/TeamVo';
import { Template } from '../models/Template';
import { TemplateCategoryContentVo } from '../models/TemplateCategoryContentVo';
import { TemplateCategoryCreateRo } from '../models/TemplateCategoryCreateRo';
import { TemplateCategoryMenuVo } from '../models/TemplateCategoryMenuVo';
import { TemplateCenterConfigRo } from '../models/TemplateCenterConfigRo';
import { TemplateDirectoryVo } from '../models/TemplateDirectoryVo';
import { TemplateGroupVo } from '../models/TemplateGroupVo';
import { TemplatePublishRo } from '../models/TemplatePublishRo';
import { TemplateSearchResult } from '../models/TemplateSearchResult';
import { TemplateSearchResultVo } from '../models/TemplateSearchResultVo';
import { TemplateUnpublishRo } from '../models/TemplateUnpublishRo';
import { TemplateVo } from '../models/TemplateVo';
import { TenantDetailVO } from '../models/TenantDetailVO';
import { TrainingInfoVO } from '../models/TrainingInfoVO';
import { TrainingPredictParams } from '../models/TrainingPredictParams';
import { TrainingPredictResult } from '../models/TrainingPredictResult';
import { TrainingStatusVO } from '../models/TrainingStatusVO';
import { TriggerSimpleVO } from '../models/TriggerSimpleVO';
import { TriggerTypeCreateRO } from '../models/TriggerTypeCreateRO';
import { TriggerTypeEditRO } from '../models/TriggerTypeEditRO';
import { TriggerVO } from '../models/TriggerVO';
import { UnionEmpExt } from '../models/UnionEmpExt';
import { UnionEmpMapVo } from '../models/UnionEmpMapVo';
import { Unit } from '../models/Unit';
import { UnitInfoVo } from '../models/UnitInfoVo';
import { UnitMemberInfoVo } from '../models/UnitMemberInfoVo';
import { UnitMemberVo } from '../models/UnitMemberVo';
import { UnitRoleInfoVo } from '../models/UnitRoleInfoVo';
import { UnitRoleMemberVo } from '../models/UnitRoleMemberVo';
import { UnitSearchResultVo } from '../models/UnitSearchResultVo';
import { UnitTagVo } from '../models/UnitTagVo';
import { UnitTeamInfoVo } from '../models/UnitTeamInfoVo';
import { UnitTeamVo } from '../models/UnitTeamVo';
import { UnlockRo } from '../models/UnlockRo';
import { UpdateActionRO } from '../models/UpdateActionRO';
import { UpdateMemberOpRo } from '../models/UpdateMemberOpRo';
import { UpdateMemberRo } from '../models/UpdateMemberRo';
import { UpdateMemberTeamRo } from '../models/UpdateMemberTeamRo';
import { UpdateNodeShareSettingRo } from '../models/UpdateNodeShareSettingRo';
import { UpdatePwdOpRo } from '../models/UpdatePwdOpRo';
import { UpdateRobotRO } from '../models/UpdateRobotRO';
import { UpdateRoleRo } from '../models/UpdateRoleRo';
import { UpdateSpaceRoleRo } from '../models/UpdateSpaceRoleRo';
import { UpdateTeamRo } from '../models/UpdateTeamRo';
import { UpdateTriggerRO } from '../models/UpdateTriggerRO';
import { UpdateUnitMemberRo } from '../models/UpdateUnitMemberRo';
import { UpdateUnitRoleRo } from '../models/UpdateUnitRoleRo';
import { UpdateUnitTeamRo } from '../models/UpdateUnitTeamRo';
import { UploadMemberTemplateRo } from '../models/UploadMemberTemplateRo';
import { UploadParseResultVO } from '../models/UploadParseResultVO';
import { UrlAwareContentVo } from '../models/UrlAwareContentVo';
import { UrlAwareContentsVo } from '../models/UrlAwareContentsVo';
import { UrlsWrapperRo } from '../models/UrlsWrapperRo';
import { UserActivityAssignRo } from '../models/UserActivityAssignRo';
import { UserActivityRo } from '../models/UserActivityRo';
import { UserBaseInfoVo } from '../models/UserBaseInfoVo';
import { UserInPausedDto } from '../models/UserInPausedDto';
import { UserInfoVo } from '../models/UserInfoVo';
import { UserIntegralVo } from '../models/UserIntegralVo';
import { UserLabsFeatureRo } from '../models/UserLabsFeatureRo';
import { UserLinkEmailRo } from '../models/UserLinkEmailRo';
import { UserLinkOpRo } from '../models/UserLinkOpRo';
import { UserLinkVo } from '../models/UserLinkVo';
import { UserOpRo } from '../models/UserOpRo';
import { UserProfile } from '../models/UserProfile';
import { UserRole } from '../models/UserRole';
import { UserSimpleVO } from '../models/UserSimpleVO';
import { UserSpaceLabsFeatureVo } from '../models/UserSpaceLabsFeatureVo';
import { UserSpaceVo } from '../models/UserSpaceVo';
import { VCodeActivityPageVo } from '../models/VCodeActivityPageVo';
import { VCodeActivityRo } from '../models/VCodeActivityRo';
import { VCodeActivityVo } from '../models/VCodeActivityVo';
import { VCodeCouponPageVo } from '../models/VCodeCouponPageVo';
import { VCodeCouponRo } from '../models/VCodeCouponRo';
import { VCodeCouponVo } from '../models/VCodeCouponVo';
import { VCodeCreateRo } from '../models/VCodeCreateRo';
import { VCodePageVo } from '../models/VCodePageVo';
import { VCodeUpdateRo } from '../models/VCodeUpdateRo';
import { WeComAgentBindSpaceRo } from '../models/WeComAgentBindSpaceRo';
import { WeComBindConfigVo } from '../models/WeComBindConfigVo';
import { WeComBindSpaceVo } from '../models/WeComBindSpaceVo';
import { WeComCheckConfigRo } from '../models/WeComCheckConfigRo';
import { WeComCheckConfigVo } from '../models/WeComCheckConfigVo';
import { WeComIsvAdminChangeRo } from '../models/WeComIsvAdminChangeRo';
import { WeComIsvInviteUnauthMemberRo } from '../models/WeComIsvInviteUnauthMemberRo';
import { WeComIsvJsSdkAgentConfigVo } from '../models/WeComIsvJsSdkAgentConfigVo';
import { WeComIsvJsSdkConfigVo } from '../models/WeComIsvJsSdkConfigVo';
import { WeComIsvLoginAdminCodeRo } from '../models/WeComIsvLoginAdminCodeRo';
import { WeComIsvLoginAuthCodeRo } from '../models/WeComIsvLoginAuthCodeRo';
import { WeComIsvLoginCodeRo } from '../models/WeComIsvLoginCodeRo';
import { WeComIsvRegisterInstallSelfUrlVo } from '../models/WeComIsvRegisterInstallSelfUrlVo';
import { WeComIsvRegisterInstallWeComVo } from '../models/WeComIsvRegisterInstallWeComVo';
import { WeComIsvUserLoginVo } from '../models/WeComIsvUserLoginVo';
import { WeComUserLoginRo } from '../models/WeComUserLoginRo';
import { WeComUserLoginVo } from '../models/WeComUserLoginVo';
import { WechatAuthorizationEntity } from '../models/WechatAuthorizationEntity';
import { WechatInfoVo } from '../models/WechatInfoVo';
import { WidgetAssetUploadCertificateRO } from '../models/WidgetAssetUploadCertificateRO';
import { WidgetAuditGlobalIdRo } from '../models/WidgetAuditGlobalIdRo';
import { WidgetAuditSubmitDataRo } from '../models/WidgetAuditSubmitDataRo';
import { WidgetCopyRo } from '../models/WidgetCopyRo';
import { WidgetCreateRo } from '../models/WidgetCreateRo';
import { WidgetInfo } from '../models/WidgetInfo';
import { WidgetInfoVo } from '../models/WidgetInfoVo';
import { WidgetIssuedGlobalIdVo } from '../models/WidgetIssuedGlobalIdVo';
import { WidgetPack } from '../models/WidgetPack';
import { WidgetPackageAuthRo } from '../models/WidgetPackageAuthRo';
import { WidgetPackageBanRo } from '../models/WidgetPackageBanRo';
import { WidgetPackageCreateRo } from '../models/WidgetPackageCreateRo';
import { WidgetPackageInfoVo } from '../models/WidgetPackageInfoVo';
import { WidgetPackageReleaseV2Ro } from '../models/WidgetPackageReleaseV2Ro';
import { WidgetPackageRollbackRo } from '../models/WidgetPackageRollbackRo';
import { WidgetPackageSubmitV2Ro } from '../models/WidgetPackageSubmitV2Ro';
import { WidgetPackageUnpublishRo } from '../models/WidgetPackageUnpublishRo';
import { WidgetReleaseCreateVo } from '../models/WidgetReleaseCreateVo';
import { WidgetReleaseListVo } from '../models/WidgetReleaseListVo';
import { WidgetSnapshot } from '../models/WidgetSnapshot';
import { WidgetStoreListExtraInfo } from '../models/WidgetStoreListExtraInfo';
import { WidgetStoreListInfo } from '../models/WidgetStoreListInfo';
import { WidgetStoreListRo } from '../models/WidgetStoreListRo';
import { WidgetTemplatePackageExtraInfo } from '../models/WidgetTemplatePackageExtraInfo';
import { WidgetTemplatePackageInfo } from '../models/WidgetTemplatePackageInfo';
import { WidgetTransferOwnerRo } from '../models/WidgetTransferOwnerRo';
import { WidgetUploadMetaVo } from '../models/WidgetUploadMetaVo';
import { WidgetUploadNotifyRO } from '../models/WidgetUploadNotifyRO';
import { WidgetUploadTokenVo } from '../models/WidgetUploadTokenVo';
import { WoaAppBindSpaceRo } from '../models/WoaAppBindSpaceRo';
import { WoaUserLoginRo } from '../models/WoaUserLoginRo';
import { WoaUserLoginVo } from '../models/WoaUserLoginVo';
import { WxJsapiSignature } from '../models/WxJsapiSignature';
import { WxOpenAuthorizerListResult } from '../models/WxOpenAuthorizerListResult';

import { ObservableAIApi } from "./ObservableAPI";
import { AIApiRequestFactory, AIApiResponseProcessor} from "../apis/AIApi";

export interface AIApiCreateFeedback1Request {
    /**
     *
     * @type FeedbackCreateParam
     * @memberof AIApicreateFeedback1
     */
    feedbackCreateParam: FeedbackCreateParam
    /**
     *
     * @type string
     * @memberof AIApicreateFeedback1
     */
    aiId: string
}

export interface AIApiGetConversationFeedback1Request {
    /**
     *
     * @type string
     * @memberof AIApigetConversationFeedback1
     */
    aiId: string
    /**
     *
     * @type string
     * @memberof AIApigetConversationFeedback1
     */
    conversationId: string
}

export interface AIApiGetCreditUsageRequest {
    /**
     *
     * @type string
     * @memberof AIApigetCreditUsage
     */
    aiId: string
}

export interface AIApiGetLastTrainingStatus1Request {
    /**
     *
     * @type string
     * @memberof AIApigetLastTrainingStatus1
     */
    aiId: string
}

export interface AIApiGetMessagePagination1Request {
    /**
     *
     * @type string
     * @memberof AIApigetMessagePagination1
     */
    aiId: string
    /**
     *
     * @type string
     * @memberof AIApigetMessagePagination1
     */
    trainingId?: string
    /**
     *
     * @type string
     * @memberof AIApigetMessagePagination1
     */
    conversationId?: string
    /**
     *
     * @type string
     * @memberof AIApigetMessagePagination1
     */
    cursor?: string
    /**
     *
     * @type number
     * @memberof AIApigetMessagePagination1
     */
    limit?: number
}

export interface AIApiGetMessagesFeedback1Request {
    /**
     *
     * @type string
     * @memberof AIApigetMessagesFeedback1
     */
    aiId: string
    /**
     *
     * @type number
     * @memberof AIApigetMessagesFeedback1
     */
    pageNum?: number
    /**
     *
     * @type number
     * @memberof AIApigetMessagesFeedback1
     */
    pageSize?: number
    /**
     *
     * @type number
     * @memberof AIApigetMessagesFeedback1
     */
    state?: number
    /**
     *
     * @type string
     * @memberof AIApigetMessagesFeedback1
     */
    search?: string
}

export interface AIApiGetSuggestions1Request {
    /**
     *
     * @type SuggestionParams
     * @memberof AIApigetSuggestions1
     */
    suggestionParams: SuggestionParams
    /**
     *
     * @type string
     * @memberof AIApigetSuggestions1
     */
    aiId: string
}

export interface AIApiRetrieve1Request {
    /**
     *
     * @type string
     * @memberof AIApiretrieve1
     */
    aiId: string
}

export interface AIApiRetrieveSettingRequest {
    /**
     *
     * @type string
     * @memberof AIApiretrieveSetting
     */
    aiId: string
    /**
     *
     * @type string
     * @memberof AIApiretrieveSetting
     */
    type?: string
}

export interface AIApiRetrieveTrainingsRequest {
    /**
     *
     * @type string
     * @memberof AIApiretrieveTrainings
     */
    aiId: string
}

export interface AIApiSendMessage1Request {
    /**
     *
     * @type SendMessageParam
     * @memberof AIApisendMessage1
     */
    sendMessageParam: SendMessageParam
    /**
     *
     * @type string
     * @memberof AIApisendMessage1
     */
    aiId: string
}

export interface AIApiTrain1Request {
    /**
     *
     * @type string
     * @memberof AIApitrain1
     */
    aiId: string
}

export interface AIApiTrainPredict1Request {
    /**
     *
     * @type TrainingPredictParams
     * @memberof AIApitrainPredict1
     */
    trainingPredictParams: TrainingPredictParams
    /**
     *
     * @type string
     * @memberof AIApitrainPredict1
     */
    aiId: string
}

export interface AIApiUpdate1Request {
    /**
     *
     * @type AiUpdateParams
     * @memberof AIApiupdate1
     */
    aiUpdateParams: AiUpdateParams
    /**
     *
     * @type string
     * @memberof AIApiupdate1
     */
    aiId: string
}

export interface AIApiUpdateFeedback1Request {
    /**
     *
     * @type FeedbackUpdateParam
     * @memberof AIApiupdateFeedback1
     */
    feedbackUpdateParam: FeedbackUpdateParam
    /**
     *
     * @type string
     * @memberof AIApiupdateFeedback1
     */
    aiId: string
    /**
     *
     * @type number
     * @memberof AIApiupdateFeedback1
     */
    feedbackId: number
}

export class ObjectAIApi {
    private api: ObservableAIApi

    public constructor(configuration: Configuration, requestFactory?: AIApiRequestFactory, responseProcessor?: AIApiResponseProcessor) {
        this.api = new ObservableAIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Feedback
     * Create Feedback
     * @param param the request object
     */
    public createFeedback1WithHttpInfo(param: AIApiCreateFeedback1Request, options?: Configuration): Promise<HttpInfo<ResponseDataFeedback>> {
        return this.api.createFeedback1WithHttpInfo(param.feedbackCreateParam, param.aiId,  options).toPromise();
    }

    /**
     * Create Feedback
     * Create Feedback
     * @param param the request object
     */
    public createFeedback1(param: AIApiCreateFeedback1Request, options?: Configuration): Promise<ResponseDataFeedback> {
        return this.api.createFeedback1(param.feedbackCreateParam, param.aiId,  options).toPromise();
    }

    /**
     * Retrieve Conversation Feedback
     * Retrieve Conversation Feedback
     * @param param the request object
     */
    public getConversationFeedback1WithHttpInfo(param: AIApiGetConversationFeedback1Request, options?: Configuration): Promise<HttpInfo<ResponseDataFeedbackVO>> {
        return this.api.getConversationFeedback1WithHttpInfo(param.aiId, param.conversationId,  options).toPromise();
    }

    /**
     * Retrieve Conversation Feedback
     * Retrieve Conversation Feedback
     * @param param the request object
     */
    public getConversationFeedback1(param: AIApiGetConversationFeedback1Request, options?: Configuration): Promise<ResponseDataFeedbackVO> {
        return this.api.getConversationFeedback1(param.aiId, param.conversationId,  options).toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Credit Usage
     * @param param the request object
     */
    public getCreditUsageWithHttpInfo(param: AIApiGetCreditUsageRequest, options?: Configuration): Promise<HttpInfo<ResponseDataMessageCreditUsageVO>> {
        return this.api.getCreditUsageWithHttpInfo(param.aiId,  options).toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Credit Usage
     * @param param the request object
     */
    public getCreditUsage(param: AIApiGetCreditUsageRequest, options?: Configuration): Promise<ResponseDataMessageCreditUsageVO> {
        return this.api.getCreditUsage(param.aiId,  options).toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Latest Training Status
     * @param param the request object
     */
    public getLastTrainingStatus1WithHttpInfo(param: AIApiGetLastTrainingStatus1Request, options?: Configuration): Promise<HttpInfo<ResponseDataTrainingStatusVO>> {
        return this.api.getLastTrainingStatus1WithHttpInfo(param.aiId,  options).toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Latest Training Status
     * @param param the request object
     */
    public getLastTrainingStatus1(param: AIApiGetLastTrainingStatus1Request, options?: Configuration): Promise<ResponseDataTrainingStatusVO> {
        return this.api.getLastTrainingStatus1(param.aiId,  options).toPromise();
    }

    /**
     * Retrieve Conversation Message
     * Retrieve Conversation Message
     * @param param the request object
     */
    public getMessagePagination1WithHttpInfo(param: AIApiGetMessagePagination1Request, options?: Configuration): Promise<HttpInfo<ResponseDataPaginationMessage>> {
        return this.api.getMessagePagination1WithHttpInfo(param.aiId, param.trainingId, param.conversationId, param.cursor, param.limit,  options).toPromise();
    }

    /**
     * Retrieve Conversation Message
     * Retrieve Conversation Message
     * @param param the request object
     */
    public getMessagePagination1(param: AIApiGetMessagePagination1Request, options?: Configuration): Promise<ResponseDataPaginationMessage> {
        return this.api.getMessagePagination1(param.aiId, param.trainingId, param.conversationId, param.cursor, param.limit,  options).toPromise();
    }

    /**
     * Retrieve Feedback Pagination
     * Retrieve Feedback Pagination
     * @param param the request object
     */
    public getMessagesFeedback1WithHttpInfo(param: AIApiGetMessagesFeedback1Request, options?: Configuration): Promise<HttpInfo<ResponseDataFeedbackPagination>> {
        return this.api.getMessagesFeedback1WithHttpInfo(param.aiId, param.pageNum, param.pageSize, param.state, param.search,  options).toPromise();
    }

    /**
     * Retrieve Feedback Pagination
     * Retrieve Feedback Pagination
     * @param param the request object
     */
    public getMessagesFeedback1(param: AIApiGetMessagesFeedback1Request, options?: Configuration): Promise<ResponseDataFeedbackPagination> {
        return this.api.getMessagesFeedback1(param.aiId, param.pageNum, param.pageSize, param.state, param.search,  options).toPromise();
    }

    /**
     * Get Suggestions
     * Get Suggestions
     * @param param the request object
     */
    public getSuggestions1WithHttpInfo(param: AIApiGetSuggestions1Request, options?: Configuration): Promise<HttpInfo<ResponseDataSuggestionVO>> {
        return this.api.getSuggestions1WithHttpInfo(param.suggestionParams, param.aiId,  options).toPromise();
    }

    /**
     * Get Suggestions
     * Get Suggestions
     * @param param the request object
     */
    public getSuggestions1(param: AIApiGetSuggestions1Request, options?: Configuration): Promise<ResponseDataSuggestionVO> {
        return this.api.getSuggestions1(param.suggestionParams, param.aiId,  options).toPromise();
    }

    /**
     * Retrieve AI Info by ai id
     * Retrieve AI Info
     * @param param the request object
     */
    public retrieve1WithHttpInfo(param: AIApiRetrieve1Request, options?: Configuration): Promise<HttpInfo<ResponseDataAiInfoVO>> {
        return this.api.retrieve1WithHttpInfo(param.aiId,  options).toPromise();
    }

    /**
     * Retrieve AI Info by ai id
     * Retrieve AI Info
     * @param param the request object
     */
    public retrieve1(param: AIApiRetrieve1Request, options?: Configuration): Promise<ResponseDataAiInfoVO> {
        return this.api.retrieve1(param.aiId,  options).toPromise();
    }

    /**
     * Retrieve AI Setting by ai id
     * Retrieve AI Setting
     * @param param the request object
     */
    public retrieveSettingWithHttpInfo(param: AIApiRetrieveSettingRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPureJson>> {
        return this.api.retrieveSettingWithHttpInfo(param.aiId, param.type,  options).toPromise();
    }

    /**
     * Retrieve AI Setting by ai id
     * Retrieve AI Setting
     * @param param the request object
     */
    public retrieveSetting(param: AIApiRetrieveSettingRequest, options?: Configuration): Promise<ResponseDataPureJson> {
        return this.api.retrieveSetting(param.aiId, param.type,  options).toPromise();
    }

    /**
     * Retrieve AI training list by ai id
     * Retrieve AI Training List
     * @param param the request object
     */
    public retrieveTrainingsWithHttpInfo(param: AIApiRetrieveTrainingsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListTrainingInfoVO>> {
        return this.api.retrieveTrainingsWithHttpInfo(param.aiId,  options).toPromise();
    }

    /**
     * Retrieve AI training list by ai id
     * Retrieve AI Training List
     * @param param the request object
     */
    public retrieveTrainings(param: AIApiRetrieveTrainingsRequest, options?: Configuration): Promise<ResponseDataListTrainingInfoVO> {
        return this.api.retrieveTrainings(param.aiId,  options).toPromise();
    }

    /**
     * Send Message
     * Send Message
     * @param param the request object
     */
    public sendMessage1WithHttpInfo(param: AIApiSendMessage1Request, options?: Configuration): Promise<HttpInfo<Array<any>>> {
        return this.api.sendMessage1WithHttpInfo(param.sendMessageParam, param.aiId,  options).toPromise();
    }

    /**
     * Send Message
     * Send Message
     * @param param the request object
     */
    public sendMessage1(param: AIApiSendMessage1Request, options?: Configuration): Promise<Array<any>> {
        return this.api.sendMessage1(param.sendMessageParam, param.aiId,  options).toPromise();
    }

    /**
     * Train
     * Train
     * @param param the request object
     */
    public train1WithHttpInfo(param: AIApiTrain1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.train1WithHttpInfo(param.aiId,  options).toPromise();
    }

    /**
     * Train
     * Train
     * @param param the request object
     */
    public train1(param: AIApiTrain1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.train1(param.aiId,  options).toPromise();
    }

    /**
     * Train Predict
     * Train Predict
     * @param param the request object
     */
    public trainPredict1WithHttpInfo(param: AIApiTrainPredict1Request, options?: Configuration): Promise<HttpInfo<ResponseDataTrainingPredictResult>> {
        return this.api.trainPredict1WithHttpInfo(param.trainingPredictParams, param.aiId,  options).toPromise();
    }

    /**
     * Train Predict
     * Train Predict
     * @param param the request object
     */
    public trainPredict1(param: AIApiTrainPredict1Request, options?: Configuration): Promise<ResponseDataTrainingPredictResult> {
        return this.api.trainPredict1(param.trainingPredictParams, param.aiId,  options).toPromise();
    }

    /**
     * Update AI Info
     * Update AI Info
     * @param param the request object
     */
    public update1WithHttpInfo(param: AIApiUpdate1Request, options?: Configuration): Promise<HttpInfo<ResponseDataAiInfoVO>> {
        return this.api.update1WithHttpInfo(param.aiUpdateParams, param.aiId,  options).toPromise();
    }

    /**
     * Update AI Info
     * Update AI Info
     * @param param the request object
     */
    public update1(param: AIApiUpdate1Request, options?: Configuration): Promise<ResponseDataAiInfoVO> {
        return this.api.update1(param.aiUpdateParams, param.aiId,  options).toPromise();
    }

    /**
     * Update Feedback
     * Update Feedback
     * @param param the request object
     */
    public updateFeedback1WithHttpInfo(param: AIApiUpdateFeedback1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateFeedback1WithHttpInfo(param.feedbackUpdateParam, param.aiId, param.feedbackId,  options).toPromise();
    }

    /**
     * Update Feedback
     * Update Feedback
     * @param param the request object
     */
    public updateFeedback1(param: AIApiUpdateFeedback1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateFeedback1(param.feedbackUpdateParam, param.aiId, param.feedbackId,  options).toPromise();
    }

}

import { ObservableAccountCenterModuleUserManagementInterfaceApi } from "./ObservableAPI";
import { AccountCenterModuleUserManagementInterfaceApiRequestFactory, AccountCenterModuleUserManagementInterfaceApiResponseProcessor} from "../apis/AccountCenterModuleUserManagementInterfaceApi";

export interface AccountCenterModuleUserManagementInterfaceApiApplyForClosingRequest {
}

export interface AccountCenterModuleUserManagementInterfaceApiBindEmailRequest {
    /**
     *
     * @type EmailCodeValidateRo
     * @memberof AccountCenterModuleUserManagementInterfaceApibindEmail
     */
    emailCodeValidateRo: EmailCodeValidateRo
}

export interface AccountCenterModuleUserManagementInterfaceApiCancelClosingRequest {
}

export interface AccountCenterModuleUserManagementInterfaceApiCheckForClosingRequest {
}

export interface AccountCenterModuleUserManagementInterfaceApiDelActiveSpaceCacheRequest {
}

export interface AccountCenterModuleUserManagementInterfaceApiGetEnabledLabFeaturesRequest {
    /**
     *
     * @type string
     * @memberof AccountCenterModuleUserManagementInterfaceApigetEnabledLabFeatures
     */
    spaceId: string
}

export interface AccountCenterModuleUserManagementInterfaceApiLinkInviteEmailRequest {
    /**
     *
     * @type UserLinkEmailRo
     * @memberof AccountCenterModuleUserManagementInterfaceApilinkInviteEmail
     */
    userLinkEmailRo: UserLinkEmailRo
}

export interface AccountCenterModuleUserManagementInterfaceApiResetPasswordRequest {
}

export interface AccountCenterModuleUserManagementInterfaceApiRetrievePwdRequest {
    /**
     *
     * @type RetrievePwdOpRo
     * @memberof AccountCenterModuleUserManagementInterfaceApiretrievePwd
     */
    retrievePwdOpRo: RetrievePwdOpRo
}

export interface AccountCenterModuleUserManagementInterfaceApiUnbindEmailRequest {
    /**
     *
     * @type CodeValidateRo
     * @memberof AccountCenterModuleUserManagementInterfaceApiunbindEmail
     */
    codeValidateRo: CodeValidateRo
}

export interface AccountCenterModuleUserManagementInterfaceApiUnbindPhoneRequest {
    /**
     *
     * @type CodeValidateRo
     * @memberof AccountCenterModuleUserManagementInterfaceApiunbindPhone
     */
    codeValidateRo: CodeValidateRo
}

export interface AccountCenterModuleUserManagementInterfaceApiUpdate2Request {
    /**
     *
     * @type UserOpRo
     * @memberof AccountCenterModuleUserManagementInterfaceApiupdate2
     */
    userOpRo: UserOpRo
}

export interface AccountCenterModuleUserManagementInterfaceApiUpdateLabsFeatureStatusRequest {
    /**
     *
     * @type UserLabsFeatureRo
     * @memberof AccountCenterModuleUserManagementInterfaceApiupdateLabsFeatureStatus
     */
    userLabsFeatureRo: UserLabsFeatureRo
}

export interface AccountCenterModuleUserManagementInterfaceApiUpdatePwdRequest {
    /**
     *
     * @type UpdatePwdOpRo
     * @memberof AccountCenterModuleUserManagementInterfaceApiupdatePwd
     */
    updatePwdOpRo: UpdatePwdOpRo
}

export interface AccountCenterModuleUserManagementInterfaceApiUserInfoRequest {
    /**
     * space id
     * @type string
     * @memberof AccountCenterModuleUserManagementInterfaceApiuserInfo
     */
    spaceId?: string
    /**
     * node id
     * @type string
     * @memberof AccountCenterModuleUserManagementInterfaceApiuserInfo
     */
    nodeId?: string
    /**
     * whether to filter space related information
     * @type boolean
     * @memberof AccountCenterModuleUserManagementInterfaceApiuserInfo
     */
    filter?: boolean
}

export interface AccountCenterModuleUserManagementInterfaceApiValidBindEmailRequest {
}

export interface AccountCenterModuleUserManagementInterfaceApiValidSameEmailRequest {
    /**
     *
     * @type CheckUserEmailRo
     * @memberof AccountCenterModuleUserManagementInterfaceApivalidSameEmail
     */
    checkUserEmailRo: CheckUserEmailRo
}

export interface AccountCenterModuleUserManagementInterfaceApiVerifyPhoneRequest {
    /**
     *
     * @type SmsCodeValidateRo
     * @memberof AccountCenterModuleUserManagementInterfaceApiverifyPhone
     */
    smsCodeValidateRo: SmsCodeValidateRo
}

export class ObjectAccountCenterModuleUserManagementInterfaceApi {
    private api: ObservableAccountCenterModuleUserManagementInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: AccountCenterModuleUserManagementInterfaceApiRequestFactory, responseProcessor?: AccountCenterModuleUserManagementInterfaceApiResponseProcessor) {
        this.api = new ObservableAccountCenterModuleUserManagementInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Registered login user applies for account cancellation
     * Apply for cancellation of user account
     * @param param the request object
     */
    public applyForClosingWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiApplyForClosingRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.applyForClosingWithHttpInfo( options).toPromise();
    }

    /**
     * Registered login user applies for account cancellation
     * Apply for cancellation of user account
     * @param param the request object
     */
    public applyForClosing(param: AccountCenterModuleUserManagementInterfaceApiApplyForClosingRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.applyForClosing( options).toPromise();
    }

    /**
     * Bind mail and modify mail
     * Bind mail
     * @param param the request object
     */
    public bindEmailWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiBindEmailRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.bindEmailWithHttpInfo(param.emailCodeValidateRo,  options).toPromise();
    }

    /**
     * Bind mail and modify mail
     * Bind mail
     * @param param the request object
     */
    public bindEmail(param: AccountCenterModuleUserManagementInterfaceApiBindEmailRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.bindEmail(param.emailCodeValidateRo,  options).toPromise();
    }

    /**
     * User recovery account has been applied for cancellation
     * Apply for account restoration
     * @param param the request object
     */
    public cancelClosingWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiCancelClosingRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.cancelClosingWithHttpInfo( options).toPromise();
    }

    /**
     * User recovery account has been applied for cancellation
     * Apply for account restoration
     * @param param the request object
     */
    public cancelClosing(param: AccountCenterModuleUserManagementInterfaceApiCancelClosingRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.cancelClosing( options).toPromise();
    }

    /**
     * Unregistered users verify whether the account meets the cancellation conditions
     * Verify whether the account can be cancelled
     * @param param the request object
     */
    public checkForClosingWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiCheckForClosingRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.checkForClosingWithHttpInfo( options).toPromise();
    }

    /**
     * Unregistered users verify whether the account meets the cancellation conditions
     * Verify whether the account can be cancelled
     * @param param the request object
     */
    public checkForClosing(param: AccountCenterModuleUserManagementInterfaceApiCheckForClosingRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.checkForClosing( options).toPromise();
    }

    /**
     * Delete Active Space Cache
     * @param param the request object
     */
    public delActiveSpaceCacheWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiDelActiveSpaceCacheRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delActiveSpaceCacheWithHttpInfo( options).toPromise();
    }

    /**
     * Delete Active Space Cache
     * @param param the request object
     */
    public delActiveSpaceCache(param: AccountCenterModuleUserManagementInterfaceApiDelActiveSpaceCacheRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delActiveSpaceCache( options).toPromise();
    }

    /**
     * Get the enabled experimental functions
     * @param param the request object
     */
    public getEnabledLabFeaturesWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiGetEnabledLabFeaturesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataLabsFeatureVo>> {
        return this.api.getEnabledLabFeaturesWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Get the enabled experimental functions
     * @param param the request object
     */
    public getEnabledLabFeatures(param: AccountCenterModuleUserManagementInterfaceApiGetEnabledLabFeaturesRequest, options?: Configuration): Promise<ResponseDataLabsFeatureVo> {
        return this.api.getEnabledLabFeatures(param.spaceId,  options).toPromise();
    }

    /**
     * Users can only associate with invited mail when they have no other mail
     * Associate the invited mail
     * @param param the request object
     */
    public linkInviteEmailWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiLinkInviteEmailRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.linkInviteEmailWithHttpInfo(param.userLinkEmailRo,  options).toPromise();
    }

    /**
     * Users can only associate with invited mail when they have no other mail
     * Associate the invited mail
     * @param param the request object
     */
    public linkInviteEmail(param: AccountCenterModuleUserManagementInterfaceApiLinkInviteEmailRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.linkInviteEmail(param.userLinkEmailRo,  options).toPromise();
    }

    /**
     * reset password router
     * @param param the request object
     */
    public resetPasswordWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiResetPasswordRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.resetPasswordWithHttpInfo( options).toPromise();
    }

    /**
     * reset password router
     * @param param the request object
     */
    public resetPassword(param: AccountCenterModuleUserManagementInterfaceApiResetPasswordRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.resetPassword( options).toPromise();
    }

    /**
     * Retrieve password
     * @param param the request object
     */
    public retrievePwdWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiRetrievePwdRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.retrievePwdWithHttpInfo(param.retrievePwdOpRo,  options).toPromise();
    }

    /**
     * Retrieve password
     * @param param the request object
     */
    public retrievePwd(param: AccountCenterModuleUserManagementInterfaceApiRetrievePwdRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.retrievePwd(param.retrievePwdOpRo,  options).toPromise();
    }

    /**
     * Bind mail and modify mail
     * Unbind mail
     * @param param the request object
     */
    public unbindEmailWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiUnbindEmailRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.unbindEmailWithHttpInfo(param.codeValidateRo,  options).toPromise();
    }

    /**
     * Bind mail and modify mail
     * Unbind mail
     * @param param the request object
     */
    public unbindEmail(param: AccountCenterModuleUserManagementInterfaceApiUnbindEmailRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.unbindEmail(param.codeValidateRo,  options).toPromise();
    }

    /**
     * Unbind mobile phone
     * @param param the request object
     */
    public unbindPhoneWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiUnbindPhoneRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.unbindPhoneWithHttpInfo(param.codeValidateRo,  options).toPromise();
    }

    /**
     * Unbind mobile phone
     * @param param the request object
     */
    public unbindPhone(param: AccountCenterModuleUserManagementInterfaceApiUnbindPhoneRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.unbindPhone(param.codeValidateRo,  options).toPromise();
    }

    /**
     * Request parameters cannot be all empty
     * Edit user information
     * @param param the request object
     */
    public update2WithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiUpdate2Request, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.update2WithHttpInfo(param.userOpRo,  options).toPromise();
    }

    /**
     * Request parameters cannot be all empty
     * Edit user information
     * @param param the request object
     */
    public update2(param: AccountCenterModuleUserManagementInterfaceApiUpdate2Request, options?: Configuration): Promise<ResponseDataString> {
        return this.api.update2(param.userOpRo,  options).toPromise();
    }

    /**
     * Update the usage status of laboratory functions
     * Update the usage status of laboratory functions
     * @param param the request object
     */
    public updateLabsFeatureStatusWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiUpdateLabsFeatureStatusRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateLabsFeatureStatusWithHttpInfo(param.userLabsFeatureRo,  options).toPromise();
    }

    /**
     * Update the usage status of laboratory functions
     * Update the usage status of laboratory functions
     * @param param the request object
     */
    public updateLabsFeatureStatus(param: AccountCenterModuleUserManagementInterfaceApiUpdateLabsFeatureStatusRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateLabsFeatureStatus(param.userLabsFeatureRo,  options).toPromise();
    }

    /**
     * Scene: 1. Personal setting and password modification; 2. Initialize after login for accounts without password
     * Change Password
     * @param param the request object
     */
    public updatePwdWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiUpdatePwdRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updatePwdWithHttpInfo(param.updatePwdOpRo,  options).toPromise();
    }

    /**
     * Scene: 1. Personal setting and password modification; 2. Initialize after login for accounts without password
     * Change Password
     * @param param the request object
     */
    public updatePwd(param: AccountCenterModuleUserManagementInterfaceApiUpdatePwdRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updatePwd(param.updatePwdOpRo,  options).toPromise();
    }

    /**
     * get personal information
     * @param param the request object
     */
    public userInfoWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiUserInfoRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataUserInfoVo>> {
        return this.api.userInfoWithHttpInfo(param.spaceId, param.nodeId, param.filter,  options).toPromise();
    }

    /**
     * get personal information
     * @param param the request object
     */
    public userInfo(param: AccountCenterModuleUserManagementInterfaceApiUserInfoRequest = {}, options?: Configuration): Promise<ResponseDataUserInfoVo> {
        return this.api.userInfo(param.spaceId, param.nodeId, param.filter,  options).toPromise();
    }

    /**
     * Query whether users bind mail
     * Query whether users bind mail
     * @param param the request object
     */
    public validBindEmailWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiValidBindEmailRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        return this.api.validBindEmailWithHttpInfo( options).toPromise();
    }

    /**
     * Query whether users bind mail
     * Query whether users bind mail
     * @param param the request object
     */
    public validBindEmail(param: AccountCenterModuleUserManagementInterfaceApiValidBindEmailRequest = {}, options?: Configuration): Promise<ResponseDataBoolean> {
        return this.api.validBindEmail( options).toPromise();
    }

    /**
     * Query whether the user is consistent with the specified mail. It can only be determined if the user has bound the mail
     * Query whether the user is consistent with the specified mail
     * @param param the request object
     */
    public validSameEmailWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiValidSameEmailRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        return this.api.validSameEmailWithHttpInfo(param.checkUserEmailRo,  options).toPromise();
    }

    /**
     * Query whether the user is consistent with the specified mail. It can only be determined if the user has bound the mail
     * Query whether the user is consistent with the specified mail
     * @param param the request object
     */
    public validSameEmail(param: AccountCenterModuleUserManagementInterfaceApiValidSameEmailRequest, options?: Configuration): Promise<ResponseDataBoolean> {
        return this.api.validSameEmail(param.checkUserEmailRo,  options).toPromise();
    }

    /**
     * Bind a new phone
     * Bind a new phone
     * @param param the request object
     */
    public verifyPhoneWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiVerifyPhoneRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.verifyPhoneWithHttpInfo(param.smsCodeValidateRo,  options).toPromise();
    }

    /**
     * Bind a new phone
     * Bind a new phone
     * @param param the request object
     */
    public verifyPhone(param: AccountCenterModuleUserManagementInterfaceApiVerifyPhoneRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.verifyPhone(param.smsCodeValidateRo,  options).toPromise();
    }

}

import { ObservableAccountLinkManagementInterfaceApi } from "./ObservableAPI";
import { AccountLinkManagementInterfaceApiRequestFactory, AccountLinkManagementInterfaceApiResponseProcessor} from "../apis/AccountLinkManagementInterfaceApi";

export interface AccountLinkManagementInterfaceApiBindDingTalkRequest {
    /**
     *
     * @type DingTalkBindOpRo
     * @memberof AccountLinkManagementInterfaceApibindDingTalk
     */
    dingTalkBindOpRo: DingTalkBindOpRo
}

export interface AccountLinkManagementInterfaceApiUnbindRequest {
    /**
     *
     * @type UserLinkOpRo
     * @memberof AccountLinkManagementInterfaceApiunbind
     */
    userLinkOpRo: UserLinkOpRo
}

export class ObjectAccountLinkManagementInterfaceApi {
    private api: ObservableAccountLinkManagementInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: AccountLinkManagementInterfaceApiRequestFactory, responseProcessor?: AccountLinkManagementInterfaceApiResponseProcessor) {
        this.api = new ObservableAccountLinkManagementInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Associated DingTalk
     * Associated DingTalk
     * @param param the request object
     */
    public bindDingTalkWithHttpInfo(param: AccountLinkManagementInterfaceApiBindDingTalkRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.bindDingTalkWithHttpInfo(param.dingTalkBindOpRo,  options).toPromise();
    }

    /**
     * Associated DingTalk
     * Associated DingTalk
     * @param param the request object
     */
    public bindDingTalk(param: AccountLinkManagementInterfaceApiBindDingTalkRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.bindDingTalk(param.dingTalkBindOpRo,  options).toPromise();
    }

    /**
     * Unbind the third-party account
     * @param param the request object
     */
    public unbindWithHttpInfo(param: AccountLinkManagementInterfaceApiUnbindRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.unbindWithHttpInfo(param.userLinkOpRo,  options).toPromise();
    }

    /**
     * Unbind the third-party account
     * @param param the request object
     */
    public unbind(param: AccountLinkManagementInterfaceApiUnbindRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.unbind(param.userLinkOpRo,  options).toPromise();
    }

}

import { ObservableAirAgentAIAgentResourceApi } from "./ObservableAPI";
import { AirAgentAIAgentResourceApiRequestFactory, AirAgentAIAgentResourceApiResponseProcessor} from "../apis/AirAgentAIAgentResourceApi";

export interface AirAgentAIAgentResourceApiCreate11Request {
    /**
     *
     * @type AgentCreateRO
     * @memberof AirAgentAIAgentResourceApicreate11
     */
    agentCreateRO: AgentCreateRO
}

export interface AirAgentAIAgentResourceApiCreateFeedbackRequest {
    /**
     *
     * @type FeedbackCreateParam
     * @memberof AirAgentAIAgentResourceApicreateFeedback
     */
    feedbackCreateParam: FeedbackCreateParam
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApicreateFeedback
     */
    aiId: string
}

export interface AirAgentAIAgentResourceApiDelete18Request {
    /**
     * agent id
     * @type string
     * @memberof AirAgentAIAgentResourceApidelete18
     */
    agentId: string
}

export interface AirAgentAIAgentResourceApiGetConversationFeedbackRequest {
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApigetConversationFeedback
     */
    aiId: string
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApigetConversationFeedback
     */
    conversationId: string
}

export interface AirAgentAIAgentResourceApiGetLastTrainingStatusRequest {
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApigetLastTrainingStatus
     */
    aiId: string
}

export interface AirAgentAIAgentResourceApiGetMessagePaginationRequest {
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApigetMessagePagination
     */
    aiId: string
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApigetMessagePagination
     */
    trainingId?: string
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApigetMessagePagination
     */
    conversationId?: string
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApigetMessagePagination
     */
    cursor?: string
    /**
     *
     * @type number
     * @memberof AirAgentAIAgentResourceApigetMessagePagination
     */
    limit?: number
}

export interface AirAgentAIAgentResourceApiGetMessagesFeedbackRequest {
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApigetMessagesFeedback
     */
    aiId: string
    /**
     *
     * @type number
     * @memberof AirAgentAIAgentResourceApigetMessagesFeedback
     */
    pageNum?: number
    /**
     *
     * @type number
     * @memberof AirAgentAIAgentResourceApigetMessagesFeedback
     */
    pageSize?: number
    /**
     *
     * @type number
     * @memberof AirAgentAIAgentResourceApigetMessagesFeedback
     */
    state?: number
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApigetMessagesFeedback
     */
    search?: string
}

export interface AirAgentAIAgentResourceApiGetSuggestionsRequest {
    /**
     *
     * @type SuggestionParams
     * @memberof AirAgentAIAgentResourceApigetSuggestions
     */
    suggestionParams: SuggestionParams
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApigetSuggestions
     */
    aiId: string
}

export interface AirAgentAIAgentResourceApiList8Request {
}

export interface AirAgentAIAgentResourceApiRetrieveRequest {
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApiretrieve
     */
    agentId: string
}

export interface AirAgentAIAgentResourceApiSendMessageRequest {
    /**
     *
     * @type SendMessageParam
     * @memberof AirAgentAIAgentResourceApisendMessage
     */
    sendMessageParam: SendMessageParam
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApisendMessage
     */
    aiId: string
}

export interface AirAgentAIAgentResourceApiTrainRequest {
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApitrain
     */
    agentId: string
}

export interface AirAgentAIAgentResourceApiTrainPredictRequest {
    /**
     *
     * @type TrainingPredictParams
     * @memberof AirAgentAIAgentResourceApitrainPredict
     */
    trainingPredictParams: TrainingPredictParams
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApitrainPredict
     */
    agentId: string
}

export interface AirAgentAIAgentResourceApiUpdateRequest {
    /**
     *
     * @type AgentUpdateParams
     * @memberof AirAgentAIAgentResourceApiupdate
     */
    agentUpdateParams: AgentUpdateParams
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApiupdate
     */
    agentId: string
}

export interface AirAgentAIAgentResourceApiUpdateFeedbackRequest {
    /**
     *
     * @type FeedbackUpdateParam
     * @memberof AirAgentAIAgentResourceApiupdateFeedback
     */
    feedbackUpdateParam: FeedbackUpdateParam
    /**
     *
     * @type string
     * @memberof AirAgentAIAgentResourceApiupdateFeedback
     */
    aiId: string
    /**
     *
     * @type number
     * @memberof AirAgentAIAgentResourceApiupdateFeedback
     */
    feedbackId: number
}

export class ObjectAirAgentAIAgentResourceApi {
    private api: ObservableAirAgentAIAgentResourceApi

    public constructor(configuration: Configuration, requestFactory?: AirAgentAIAgentResourceApiRequestFactory, responseProcessor?: AirAgentAIAgentResourceApiResponseProcessor) {
        this.api = new ObservableAirAgentAIAgentResourceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create AI Agent
     * @param param the request object
     */
    public create11WithHttpInfo(param: AirAgentAIAgentResourceApiCreate11Request, options?: Configuration): Promise<HttpInfo<ResponseDataAiInfoVO>> {
        return this.api.create11WithHttpInfo(param.agentCreateRO,  options).toPromise();
    }

    /**
     * Create AI Agent
     * @param param the request object
     */
    public create11(param: AirAgentAIAgentResourceApiCreate11Request, options?: Configuration): Promise<ResponseDataAiInfoVO> {
        return this.api.create11(param.agentCreateRO,  options).toPromise();
    }

    /**
     * Create Feedback
     * Create Feedback
     * @param param the request object
     */
    public createFeedbackWithHttpInfo(param: AirAgentAIAgentResourceApiCreateFeedbackRequest, options?: Configuration): Promise<HttpInfo<ResponseDataFeedback>> {
        return this.api.createFeedbackWithHttpInfo(param.feedbackCreateParam, param.aiId,  options).toPromise();
    }

    /**
     * Create Feedback
     * Create Feedback
     * @param param the request object
     */
    public createFeedback(param: AirAgentAIAgentResourceApiCreateFeedbackRequest, options?: Configuration): Promise<ResponseDataFeedback> {
        return this.api.createFeedback(param.feedbackCreateParam, param.aiId,  options).toPromise();
    }

    /**
     * Delete AI Agent
     * @param param the request object
     */
    public delete18WithHttpInfo(param: AirAgentAIAgentResourceApiDelete18Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete18WithHttpInfo(param.agentId,  options).toPromise();
    }

    /**
     * Delete AI Agent
     * @param param the request object
     */
    public delete18(param: AirAgentAIAgentResourceApiDelete18Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete18(param.agentId,  options).toPromise();
    }

    /**
     * Retrieve Conversation Feedback
     * Retrieve Conversation Feedback
     * @param param the request object
     */
    public getConversationFeedbackWithHttpInfo(param: AirAgentAIAgentResourceApiGetConversationFeedbackRequest, options?: Configuration): Promise<HttpInfo<ResponseDataFeedbackVO>> {
        return this.api.getConversationFeedbackWithHttpInfo(param.aiId, param.conversationId,  options).toPromise();
    }

    /**
     * Retrieve Conversation Feedback
     * Retrieve Conversation Feedback
     * @param param the request object
     */
    public getConversationFeedback(param: AirAgentAIAgentResourceApiGetConversationFeedbackRequest, options?: Configuration): Promise<ResponseDataFeedbackVO> {
        return this.api.getConversationFeedback(param.aiId, param.conversationId,  options).toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Latest Training Status
     * @param param the request object
     */
    public getLastTrainingStatusWithHttpInfo(param: AirAgentAIAgentResourceApiGetLastTrainingStatusRequest, options?: Configuration): Promise<HttpInfo<ResponseDataTrainingStatusVO>> {
        return this.api.getLastTrainingStatusWithHttpInfo(param.aiId,  options).toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Latest Training Status
     * @param param the request object
     */
    public getLastTrainingStatus(param: AirAgentAIAgentResourceApiGetLastTrainingStatusRequest, options?: Configuration): Promise<ResponseDataTrainingStatusVO> {
        return this.api.getLastTrainingStatus(param.aiId,  options).toPromise();
    }

    /**
     * Retrieve Conversation Message
     * Retrieve Conversation Message
     * @param param the request object
     */
    public getMessagePaginationWithHttpInfo(param: AirAgentAIAgentResourceApiGetMessagePaginationRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPaginationMessage>> {
        return this.api.getMessagePaginationWithHttpInfo(param.aiId, param.trainingId, param.conversationId, param.cursor, param.limit,  options).toPromise();
    }

    /**
     * Retrieve Conversation Message
     * Retrieve Conversation Message
     * @param param the request object
     */
    public getMessagePagination(param: AirAgentAIAgentResourceApiGetMessagePaginationRequest, options?: Configuration): Promise<ResponseDataPaginationMessage> {
        return this.api.getMessagePagination(param.aiId, param.trainingId, param.conversationId, param.cursor, param.limit,  options).toPromise();
    }

    /**
     * Retrieve Feedback Pagination
     * Retrieve Feedback Pagination
     * @param param the request object
     */
    public getMessagesFeedbackWithHttpInfo(param: AirAgentAIAgentResourceApiGetMessagesFeedbackRequest, options?: Configuration): Promise<HttpInfo<ResponseDataFeedbackPagination>> {
        return this.api.getMessagesFeedbackWithHttpInfo(param.aiId, param.pageNum, param.pageSize, param.state, param.search,  options).toPromise();
    }

    /**
     * Retrieve Feedback Pagination
     * Retrieve Feedback Pagination
     * @param param the request object
     */
    public getMessagesFeedback(param: AirAgentAIAgentResourceApiGetMessagesFeedbackRequest, options?: Configuration): Promise<ResponseDataFeedbackPagination> {
        return this.api.getMessagesFeedback(param.aiId, param.pageNum, param.pageSize, param.state, param.search,  options).toPromise();
    }

    /**
     * Get Suggestions
     * Get Suggestions
     * @param param the request object
     */
    public getSuggestionsWithHttpInfo(param: AirAgentAIAgentResourceApiGetSuggestionsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataSuggestionVO>> {
        return this.api.getSuggestionsWithHttpInfo(param.suggestionParams, param.aiId,  options).toPromise();
    }

    /**
     * Get Suggestions
     * Get Suggestions
     * @param param the request object
     */
    public getSuggestions(param: AirAgentAIAgentResourceApiGetSuggestionsRequest, options?: Configuration): Promise<ResponseDataSuggestionVO> {
        return this.api.getSuggestions(param.suggestionParams, param.aiId,  options).toPromise();
    }

    /**
     * Get AI Agent List
     * @param param the request object
     */
    public list8WithHttpInfo(param: AirAgentAIAgentResourceApiList8Request = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListAgentVO>> {
        return this.api.list8WithHttpInfo( options).toPromise();
    }

    /**
     * Get AI Agent List
     * @param param the request object
     */
    public list8(param: AirAgentAIAgentResourceApiList8Request = {}, options?: Configuration): Promise<ResponseDataListAgentVO> {
        return this.api.list8( options).toPromise();
    }

    /**
     * Retrieve AI Info
     * Retrieve AI Agent
     * @param param the request object
     */
    public retrieveWithHttpInfo(param: AirAgentAIAgentResourceApiRetrieveRequest, options?: Configuration): Promise<HttpInfo<ResponseDataAiInfoVO>> {
        return this.api.retrieveWithHttpInfo(param.agentId,  options).toPromise();
    }

    /**
     * Retrieve AI Info
     * Retrieve AI Agent
     * @param param the request object
     */
    public retrieve(param: AirAgentAIAgentResourceApiRetrieveRequest, options?: Configuration): Promise<ResponseDataAiInfoVO> {
        return this.api.retrieve(param.agentId,  options).toPromise();
    }

    /**
     * Send Message
     * Send Message
     * @param param the request object
     */
    public sendMessageWithHttpInfo(param: AirAgentAIAgentResourceApiSendMessageRequest, options?: Configuration): Promise<HttpInfo<Array<string>>> {
        return this.api.sendMessageWithHttpInfo(param.sendMessageParam, param.aiId,  options).toPromise();
    }

    /**
     * Send Message
     * Send Message
     * @param param the request object
     */
    public sendMessage(param: AirAgentAIAgentResourceApiSendMessageRequest, options?: Configuration): Promise<Array<string>> {
        return this.api.sendMessage(param.sendMessageParam, param.aiId,  options).toPromise();
    }

    /**
     * Train AI Agent
     * @param param the request object
     */
    public trainWithHttpInfo(param: AirAgentAIAgentResourceApiTrainRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.trainWithHttpInfo(param.agentId,  options).toPromise();
    }

    /**
     * Train AI Agent
     * @param param the request object
     */
    public train(param: AirAgentAIAgentResourceApiTrainRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.train(param.agentId,  options).toPromise();
    }

    /**
     * Train Predict
     * Train Predict
     * @param param the request object
     */
    public trainPredictWithHttpInfo(param: AirAgentAIAgentResourceApiTrainPredictRequest, options?: Configuration): Promise<HttpInfo<ResponseDataTrainingPredictResult>> {
        return this.api.trainPredictWithHttpInfo(param.trainingPredictParams, param.agentId,  options).toPromise();
    }

    /**
     * Train Predict
     * Train Predict
     * @param param the request object
     */
    public trainPredict(param: AirAgentAIAgentResourceApiTrainPredictRequest, options?: Configuration): Promise<ResponseDataTrainingPredictResult> {
        return this.api.trainPredict(param.trainingPredictParams, param.agentId,  options).toPromise();
    }

    /**
     * Update AI Info
     * Update AI Agent
     * @param param the request object
     */
    public updateWithHttpInfo(param: AirAgentAIAgentResourceApiUpdateRequest, options?: Configuration): Promise<HttpInfo<ResponseDataAiInfoVO>> {
        return this.api.updateWithHttpInfo(param.agentUpdateParams, param.agentId,  options).toPromise();
    }

    /**
     * Update AI Info
     * Update AI Agent
     * @param param the request object
     */
    public update(param: AirAgentAIAgentResourceApiUpdateRequest, options?: Configuration): Promise<ResponseDataAiInfoVO> {
        return this.api.update(param.agentUpdateParams, param.agentId,  options).toPromise();
    }

    /**
     * Update Feedback
     * Update Feedback
     * @param param the request object
     */
    public updateFeedbackWithHttpInfo(param: AirAgentAIAgentResourceApiUpdateFeedbackRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateFeedbackWithHttpInfo(param.feedbackUpdateParam, param.aiId, param.feedbackId,  options).toPromise();
    }

    /**
     * Update Feedback
     * Update Feedback
     * @param param the request object
     */
    public updateFeedback(param: AirAgentAIAgentResourceApiUpdateFeedbackRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateFeedback(param.feedbackUpdateParam, param.aiId, param.feedbackId,  options).toPromise();
    }

}

import { ObservableAirAgentAuthResourceApi } from "./ObservableAPI";
import { AirAgentAuthResourceApiRequestFactory, AirAgentAuthResourceApiResponseProcessor} from "../apis/AirAgentAuthResourceApi";

export interface AirAgentAuthResourceApiCallback5Request {
    /**
     *
     * @type string
     * @memberof AirAgentAuthResourceApicallback5
     */
    code?: string
    /**
     *
     * @type string
     * @memberof AirAgentAuthResourceApicallback5
     */
    error?: string
    /**
     *
     * @type string
     * @memberof AirAgentAuthResourceApicallback5
     */
    errorDescription?: string
}

export interface AirAgentAuthResourceApiLogin4Request {
    /**
     *
     * @type string
     * @memberof AirAgentAuthResourceApilogin4
     */
    message?: string
}

export interface AirAgentAuthResourceApiLogout2Request {
}

export interface AirAgentAuthResourceApiLogout3Request {
}

export class ObjectAirAgentAuthResourceApi {
    private api: ObservableAirAgentAuthResourceApi

    public constructor(configuration: Configuration, requestFactory?: AirAgentAuthResourceApiRequestFactory, responseProcessor?: AirAgentAuthResourceApiResponseProcessor) {
        this.api = new ObservableAirAgentAuthResourceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public callback5WithHttpInfo(param: AirAgentAuthResourceApiCallback5Request = {}, options?: Configuration): Promise<HttpInfo<RedirectView>> {
        return this.api.callback5WithHttpInfo(param.code, param.error, param.errorDescription,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public callback5(param: AirAgentAuthResourceApiCallback5Request = {}, options?: Configuration): Promise<RedirectView> {
        return this.api.callback5(param.code, param.error, param.errorDescription,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public login4WithHttpInfo(param: AirAgentAuthResourceApiLogin4Request = {}, options?: Configuration): Promise<HttpInfo<RedirectView>> {
        return this.api.login4WithHttpInfo(param.message,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public login4(param: AirAgentAuthResourceApiLogin4Request = {}, options?: Configuration): Promise<RedirectView> {
        return this.api.login4(param.message,  options).toPromise();
    }

    /**
     * logout current user
     * Logout
     * @param param the request object
     */
    public logout2WithHttpInfo(param: AirAgentAuthResourceApiLogout2Request = {}, options?: Configuration): Promise<HttpInfo<RedirectView>> {
        return this.api.logout2WithHttpInfo( options).toPromise();
    }

    /**
     * logout current user
     * Logout
     * @param param the request object
     */
    public logout2(param: AirAgentAuthResourceApiLogout2Request = {}, options?: Configuration): Promise<RedirectView> {
        return this.api.logout2( options).toPromise();
    }

    /**
     * logout current user
     * Logout
     * @param param the request object
     */
    public logout3WithHttpInfo(param: AirAgentAuthResourceApiLogout3Request = {}, options?: Configuration): Promise<HttpInfo<RedirectView>> {
        return this.api.logout3WithHttpInfo( options).toPromise();
    }

    /**
     * logout current user
     * Logout
     * @param param the request object
     */
    public logout3(param: AirAgentAuthResourceApiLogout3Request = {}, options?: Configuration): Promise<RedirectView> {
        return this.api.logout3( options).toPromise();
    }

}

import { ObservableAirAgentUserResourceApi } from "./ObservableAPI";
import { AirAgentUserResourceApiRequestFactory, AirAgentUserResourceApiResponseProcessor} from "../apis/AirAgentUserResourceApi";

export interface AirAgentUserResourceApiGetUserProfileRequest {
}

export class ObjectAirAgentUserResourceApi {
    private api: ObservableAirAgentUserResourceApi

    public constructor(configuration: Configuration, requestFactory?: AirAgentUserResourceApiRequestFactory, responseProcessor?: AirAgentUserResourceApiResponseProcessor) {
        this.api = new ObservableAirAgentUserResourceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get User Profile
     * @param param the request object
     */
    public getUserProfileWithHttpInfo(param: AirAgentUserResourceApiGetUserProfileRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataUserProfile>> {
        return this.api.getUserProfileWithHttpInfo( options).toPromise();
    }

    /**
     * Get User Profile
     * @param param the request object
     */
    public getUserProfile(param: AirAgentUserResourceApiGetUserProfileRequest = {}, options?: Configuration): Promise<ResponseDataUserProfile> {
        return this.api.getUserProfile( options).toPromise();
    }

}

import { ObservableAppStoreRelevantServiceInterfacesOfTheApplicationStoreApi } from "./ObservableAPI";
import { AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiRequestFactory, AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiResponseProcessor} from "../apis/AppStoreRelevantServiceInterfacesOfTheApplicationStoreApi";

export interface AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiFetchAppStoreAppsRequest {
    /**
     * Page Index
     * @type string
     * @memberof AppStoreRelevantServiceInterfacesOfTheApplicationStoreApifetchAppStoreApps
     */
    pageIndex?: string
    /**
     * Quantity per page
     * @type string
     * @memberof AppStoreRelevantServiceInterfacesOfTheApplicationStoreApifetchAppStoreApps
     */
    pageSize?: string
    /**
     * Sort field
     * @type string
     * @memberof AppStoreRelevantServiceInterfacesOfTheApplicationStoreApifetchAppStoreApps
     */
    orderBy?: string
    /**
     * Collation,asc&#x3D;positive sequence,desc&#x3D;reverse order
     * @type string
     * @memberof AppStoreRelevantServiceInterfacesOfTheApplicationStoreApifetchAppStoreApps
     */
    sortBy?: string
}

export class ObjectAppStoreRelevantServiceInterfacesOfTheApplicationStoreApi {
    private api: ObservableAppStoreRelevantServiceInterfacesOfTheApplicationStoreApi

    public constructor(configuration: Configuration, requestFactory?: AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiRequestFactory, responseProcessor?: AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiResponseProcessor) {
        this.api = new ObservableAppStoreRelevantServiceInterfacesOfTheApplicationStoreApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Pagination query. If no query parameter is transferred, the default query will be used
     * Query application list
     * @param param the request object
     */
    public fetchAppStoreAppsWithHttpInfo(param: AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiFetchAppStoreAppsRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoAppInfo>> {
        return this.api.fetchAppStoreAppsWithHttpInfo(param.pageIndex, param.pageSize, param.orderBy, param.sortBy,  options).toPromise();
    }

    /**
     * Pagination query. If no query parameter is transferred, the default query will be used
     * Query application list
     * @param param the request object
     */
    public fetchAppStoreApps(param: AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiFetchAppStoreAppsRequest = {}, options?: Configuration): Promise<ResponseDataPageInfoAppInfo> {
        return this.api.fetchAppStoreApps(param.pageIndex, param.pageSize, param.orderBy, param.sortBy,  options).toPromise();
    }

}

import { ObservableApplicationManagementApplicationManagementRelatedServiceInterfaceApi } from "./ObservableAPI";
import { ApplicationManagementApplicationManagementRelatedServiceInterfaceApiRequestFactory, ApplicationManagementApplicationManagementRelatedServiceInterfaceApiResponseProcessor} from "../apis/ApplicationManagementApplicationManagementRelatedServiceInterfaceApi";

export interface ApplicationManagementApplicationManagementRelatedServiceInterfaceApiCreateAppInstanceRequest {
    /**
     *
     * @type CreateAppInstance
     * @memberof ApplicationManagementApplicationManagementRelatedServiceInterfaceApicreateAppInstance
     */
    createAppInstance: CreateAppInstance
}

export interface ApplicationManagementApplicationManagementRelatedServiceInterfaceApiDelete17Request {
    /**
     * Application instance ID
     * @type string
     * @memberof ApplicationManagementApplicationManagementRelatedServiceInterfaceApidelete17
     */
    appInstanceId: string
}

export interface ApplicationManagementApplicationManagementRelatedServiceInterfaceApiFetchAppInstancesRequest {
    /**
     * Space ID
     * @type string
     * @memberof ApplicationManagementApplicationManagementRelatedServiceInterfaceApifetchAppInstances
     */
    spaceId: string
    /**
     * Page Index
     * @type string
     * @memberof ApplicationManagementApplicationManagementRelatedServiceInterfaceApifetchAppInstances
     */
    pageIndex?: string
    /**
     * Quantity per page
     * @type string
     * @memberof ApplicationManagementApplicationManagementRelatedServiceInterfaceApifetchAppInstances
     */
    pageSize?: string
    /**
     * Sort field
     * @type string
     * @memberof ApplicationManagementApplicationManagementRelatedServiceInterfaceApifetchAppInstances
     */
    orderBy?: string
    /**
     * Collation,asc&#x3D;positive sequence,desc&#x3D;Reverse order
     * @type string
     * @memberof ApplicationManagementApplicationManagementRelatedServiceInterfaceApifetchAppInstances
     */
    sortBy?: string
}

export interface ApplicationManagementApplicationManagementRelatedServiceInterfaceApiGetAppInstanceRequest {
    /**
     * Application instance ID
     * @type string
     * @memberof ApplicationManagementApplicationManagementRelatedServiceInterfaceApigetAppInstance
     */
    appInstanceId: string
}

export class ObjectApplicationManagementApplicationManagementRelatedServiceInterfaceApi {
    private api: ObservableApplicationManagementApplicationManagementRelatedServiceInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiRequestFactory, responseProcessor?: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiResponseProcessor) {
        this.api = new ObservableApplicationManagementApplicationManagementRelatedServiceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Opening an application instance
     * Create an application instance
     * @param param the request object
     */
    public createAppInstanceWithHttpInfo(param: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiCreateAppInstanceRequest, options?: Configuration): Promise<HttpInfo<ResponseDataAppInstance>> {
        return this.api.createAppInstanceWithHttpInfo(param.createAppInstance,  options).toPromise();
    }

    /**
     * Opening an application instance
     * Create an application instance
     * @param param the request object
     */
    public createAppInstance(param: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiCreateAppInstanceRequest, options?: Configuration): Promise<ResponseDataAppInstance> {
        return this.api.createAppInstance(param.createAppInstance,  options).toPromise();
    }

    /**
     * The space actively deletes applications
     * Delete app
     * @param param the request object
     */
    public delete17WithHttpInfo(param: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiDelete17Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete17WithHttpInfo(param.appInstanceId,  options).toPromise();
    }

    /**
     * The space actively deletes applications
     * Delete app
     * @param param the request object
     */
    public delete17(param: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiDelete17Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete17(param.appInstanceId,  options).toPromise();
    }

    /**
     * At present, the interface is full query, and the paging query function will be provided later, so you don\'t need to pass paging parameters
     * Query the application instance list
     * @param param the request object
     */
    public fetchAppInstancesWithHttpInfo(param: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiFetchAppInstancesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoAppInstance>> {
        return this.api.fetchAppInstancesWithHttpInfo(param.spaceId, param.pageIndex, param.pageSize, param.orderBy, param.sortBy,  options).toPromise();
    }

    /**
     * At present, the interface is full query, and the paging query function will be provided later, so you don\'t need to pass paging parameters
     * Query the application instance list
     * @param param the request object
     */
    public fetchAppInstances(param: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiFetchAppInstancesRequest, options?: Configuration): Promise<ResponseDataPageInfoAppInstance> {
        return this.api.fetchAppInstances(param.spaceId, param.pageIndex, param.pageSize, param.orderBy, param.sortBy,  options).toPromise();
    }

    /**
     * Get the configuration according to the application instance ID
     * Get the configuration of a single application instance
     * @param param the request object
     */
    public getAppInstanceWithHttpInfo(param: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiGetAppInstanceRequest, options?: Configuration): Promise<HttpInfo<ResponseDataAppInstance>> {
        return this.api.getAppInstanceWithHttpInfo(param.appInstanceId,  options).toPromise();
    }

    /**
     * Get the configuration according to the application instance ID
     * Get the configuration of a single application instance
     * @param param the request object
     */
    public getAppInstance(param: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiGetAppInstanceRequest, options?: Configuration): Promise<ResponseDataAppInstance> {
        return this.api.getAppInstance(param.appInstanceId,  options).toPromise();
    }

}

import { ObservableApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi } from "./ObservableAPI";
import { ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiRequestFactory, ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiResponseProcessor} from "../apis/ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi";

export interface ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiEventConfigRequest {
    /**
     *
     * @type FeishuAppEventConfigRo
     * @memberof ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApieventConfig
     */
    feishuAppEventConfigRo: FeishuAppEventConfigRo
    /**
     * Application instance ID
     * @type string
     * @memberof ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApieventConfig
     */
    appInstanceId: string
}

export interface ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiInitConfigRequest {
    /**
     *
     * @type FeishuAppConfigRo
     * @memberof ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiinitConfig
     */
    feishuAppConfigRo: FeishuAppConfigRo
    /**
     * Application instance ID
     * @type string
     * @memberof ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiinitConfig
     */
    appInstanceId: string
}

export class ObjectApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi {
    private api: ObservableApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiRequestFactory, responseProcessor?: ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiResponseProcessor) {
        this.api = new ObservableApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Change the event configuration of an application instance
     * Update Event Configuration
     * @param param the request object
     */
    public eventConfigWithHttpInfo(param: ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiEventConfigRequest, options?: Configuration): Promise<HttpInfo<ResponseDataAppInstance>> {
        return this.api.eventConfigWithHttpInfo(param.feishuAppEventConfigRo, param.appInstanceId,  options).toPromise();
    }

    /**
     * Change the event configuration of an application instance
     * Update Event Configuration
     * @param param the request object
     */
    public eventConfig(param: ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiEventConfigRequest, options?: Configuration): Promise<ResponseDataAppInstance> {
        return this.api.eventConfig(param.feishuAppEventConfigRo, param.appInstanceId,  options).toPromise();
    }

    /**
     * Update the basic configuration of the application instance
     * Update basic configuration
     * @param param the request object
     */
    public initConfigWithHttpInfo(param: ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiInitConfigRequest, options?: Configuration): Promise<HttpInfo<ResponseDataAppInstance>> {
        return this.api.initConfigWithHttpInfo(param.feishuAppConfigRo, param.appInstanceId,  options).toPromise();
    }

    /**
     * Update the basic configuration of the application instance
     * Update basic configuration
     * @param param the request object
     */
    public initConfig(param: ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiInitConfigRequest, options?: Configuration): Promise<ResponseDataAppInstance> {
        return this.api.initConfig(param.feishuAppConfigRo, param.appInstanceId,  options).toPromise();
    }

}

import { ObservableApplicationMarketApplicationAPIApi } from "./ObservableAPI";
import { ApplicationMarketApplicationAPIApiRequestFactory, ApplicationMarketApplicationAPIApiResponseProcessor} from "../apis/ApplicationMarketApplicationAPIApi";

export interface ApplicationMarketApplicationAPIApiBlockSpaceAppRequest {
    /**
     *
     * @type string
     * @memberof ApplicationMarketApplicationAPIApiblockSpaceApp
     */
    spaceId: string
    /**
     *
     * @type string
     * @memberof ApplicationMarketApplicationAPIApiblockSpaceApp
     */
    appId: string
}

export interface ApplicationMarketApplicationAPIApiGetSpaceAppListRequest {
    /**
     *
     * @type string
     * @memberof ApplicationMarketApplicationAPIApigetSpaceAppList
     */
    spaceId: string
}

export interface ApplicationMarketApplicationAPIApiOpenSpaceAppRequest {
    /**
     *
     * @type string
     * @memberof ApplicationMarketApplicationAPIApiopenSpaceApp
     */
    spaceId: string
    /**
     *
     * @type string
     * @memberof ApplicationMarketApplicationAPIApiopenSpaceApp
     */
    appId: string
}

export class ObjectApplicationMarketApplicationAPIApi {
    private api: ObservableApplicationMarketApplicationAPIApi

    public constructor(configuration: Configuration, requestFactory?: ApplicationMarketApplicationAPIApiRequestFactory, responseProcessor?: ApplicationMarketApplicationAPIApiResponseProcessor) {
        this.api = new ObservableApplicationMarketApplicationAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Block Application
     * @param param the request object
     */
    public blockSpaceAppWithHttpInfo(param: ApplicationMarketApplicationAPIApiBlockSpaceAppRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.blockSpaceAppWithHttpInfo(param.spaceId, param.appId,  options).toPromise();
    }

    /**
     * Block Application
     * @param param the request object
     */
    public blockSpaceApp(param: ApplicationMarketApplicationAPIApiBlockSpaceAppRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.blockSpaceApp(param.spaceId, param.appId,  options).toPromise();
    }

    /**
     * Query Built-in Integrated Applications
     * @param param the request object
     */
    public getSpaceAppListWithHttpInfo(param: ApplicationMarketApplicationAPIApiGetSpaceAppListRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListMarketplaceSpaceAppVo>> {
        return this.api.getSpaceAppListWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Query Built-in Integrated Applications
     * @param param the request object
     */
    public getSpaceAppList(param: ApplicationMarketApplicationAPIApiGetSpaceAppListRequest, options?: Configuration): Promise<ResponseDataListMarketplaceSpaceAppVo> {
        return this.api.getSpaceAppList(param.spaceId,  options).toPromise();
    }

    /**
     * Open Application
     * @param param the request object
     */
    public openSpaceAppWithHttpInfo(param: ApplicationMarketApplicationAPIApiOpenSpaceAppRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.openSpaceAppWithHttpInfo(param.spaceId, param.appId,  options).toPromise();
    }

    /**
     * Open Application
     * @param param the request object
     */
    public openSpaceApp(param: ApplicationMarketApplicationAPIApiOpenSpaceAppRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.openSpaceApp(param.spaceId, param.appId,  options).toPromise();
    }

}

import { ObservableAuth0ControllerApi } from "./ObservableAPI";
import { Auth0ControllerApiRequestFactory, Auth0ControllerApiResponseProcessor} from "../apis/Auth0ControllerApi";

export interface Auth0ControllerApiCallback4Request {
    /**
     *
     * @type string
     * @memberof Auth0ControllerApicallback4
     */
    code?: string
    /**
     *
     * @type string
     * @memberof Auth0ControllerApicallback4
     */
    error?: string
    /**
     *
     * @type string
     * @memberof Auth0ControllerApicallback4
     */
    errorDescription?: string
}

export interface Auth0ControllerApiInvitationCallbackRequest {
    /**
     *
     * @type string
     * @memberof Auth0ControllerApiinvitationCallback
     */
    email: string
    /**
     *
     * @type boolean
     * @memberof Auth0ControllerApiinvitationCallback
     */
    success: boolean
}

export interface Auth0ControllerApiLogin3Request {
    /**
     *
     * @type string
     * @memberof Auth0ControllerApilogin3
     */
    message?: string
}

export class ObjectAuth0ControllerApi {
    private api: ObservableAuth0ControllerApi

    public constructor(configuration: Configuration, requestFactory?: Auth0ControllerApiRequestFactory, responseProcessor?: Auth0ControllerApiResponseProcessor) {
        this.api = new ObservableAuth0ControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public callback4WithHttpInfo(param: Auth0ControllerApiCallback4Request = {}, options?: Configuration): Promise<HttpInfo<RedirectView>> {
        return this.api.callback4WithHttpInfo(param.code, param.error, param.errorDescription,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public callback4(param: Auth0ControllerApiCallback4Request = {}, options?: Configuration): Promise<RedirectView> {
        return this.api.callback4(param.code, param.error, param.errorDescription,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public invitationCallbackWithHttpInfo(param: Auth0ControllerApiInvitationCallbackRequest, options?: Configuration): Promise<HttpInfo<RedirectView>> {
        return this.api.invitationCallbackWithHttpInfo(param.email, param.success,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public invitationCallback(param: Auth0ControllerApiInvitationCallbackRequest, options?: Configuration): Promise<RedirectView> {
        return this.api.invitationCallback(param.email, param.success,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public login3WithHttpInfo(param: Auth0ControllerApiLogin3Request = {}, options?: Configuration): Promise<HttpInfo<RedirectView>> {
        return this.api.login3WithHttpInfo(param.message,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public login3(param: Auth0ControllerApiLogin3Request = {}, options?: Configuration): Promise<RedirectView> {
        return this.api.login3(param.message,  options).toPromise();
    }

}

import { ObservableAuthorizationRelatedInterfaceApi } from "./ObservableAPI";
import { AuthorizationRelatedInterfaceApiRequestFactory, AuthorizationRelatedInterfaceApiResponseProcessor} from "../apis/AuthorizationRelatedInterfaceApi";

export interface AuthorizationRelatedInterfaceApiLoginRequest {
    /**
     *
     * @type LoginRo
     * @memberof AuthorizationRelatedInterfaceApilogin
     */
    loginRo: LoginRo
}

export interface AuthorizationRelatedInterfaceApiLogoutRequest {
}

export interface AuthorizationRelatedInterfaceApiLogout1Request {
}

export interface AuthorizationRelatedInterfaceApiRegisterRequest {
    /**
     *
     * @type RegisterRO
     * @memberof AuthorizationRelatedInterfaceApiregister
     */
    registerRO: RegisterRO
}

export class ObjectAuthorizationRelatedInterfaceApi {
    private api: ObservableAuthorizationRelatedInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: AuthorizationRelatedInterfaceApiRequestFactory, responseProcessor?: AuthorizationRelatedInterfaceApiResponseProcessor) {
        this.api = new ObservableAuthorizationRelatedInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * description:verifyType，available values: password sms_code email_code
     * login
     * @param param the request object
     */
    public loginWithHttpInfo(param: AuthorizationRelatedInterfaceApiLoginRequest, options?: Configuration): Promise<HttpInfo<ResponseDataLoginResultVO>> {
        return this.api.loginWithHttpInfo(param.loginRo,  options).toPromise();
    }

    /**
     * description:verifyType，available values: password sms_code email_code
     * login
     * @param param the request object
     */
    public login(param: AuthorizationRelatedInterfaceApiLoginRequest, options?: Configuration): Promise<ResponseDataLoginResultVO> {
        return this.api.login(param.loginRo,  options).toPromise();
    }

    /**
     * log out of current user
     * sign out
     * @param param the request object
     */
    public logoutWithHttpInfo(param: AuthorizationRelatedInterfaceApiLogoutRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataLogoutVO>> {
        return this.api.logoutWithHttpInfo( options).toPromise();
    }

    /**
     * log out of current user
     * sign out
     * @param param the request object
     */
    public logout(param: AuthorizationRelatedInterfaceApiLogoutRequest = {}, options?: Configuration): Promise<ResponseDataLogoutVO> {
        return this.api.logout( options).toPromise();
    }

    /**
     * log out of current user
     * sign out
     * @param param the request object
     */
    public logout1WithHttpInfo(param: AuthorizationRelatedInterfaceApiLogout1Request = {}, options?: Configuration): Promise<HttpInfo<ResponseDataLogoutVO>> {
        return this.api.logout1WithHttpInfo( options).toPromise();
    }

    /**
     * log out of current user
     * sign out
     * @param param the request object
     */
    public logout1(param: AuthorizationRelatedInterfaceApiLogout1Request = {}, options?: Configuration): Promise<ResponseDataLogoutVO> {
        return this.api.logout1( options).toPromise();
    }

    /**
     * serving for community edition
     * register
     * @param param the request object
     */
    public registerWithHttpInfo(param: AuthorizationRelatedInterfaceApiRegisterRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.registerWithHttpInfo(param.registerRO,  options).toPromise();
    }

    /**
     * serving for community edition
     * register
     * @param param the request object
     */
    public register(param: AuthorizationRelatedInterfaceApiRegisterRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.register(param.registerRO,  options).toPromise();
    }

}

import { ObservableAutoNaviInterfaceApi } from "./ObservableAPI";
import { AutoNaviInterfaceApiRequestFactory, AutoNaviInterfaceApiResponseProcessor} from "../apis/AutoNaviInterfaceApi";

export interface AutoNaviInterfaceApiProxyRequest {
}

export class ObjectAutoNaviInterfaceApi {
    private api: ObservableAutoNaviInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: AutoNaviInterfaceApiRequestFactory, responseProcessor?: AutoNaviInterfaceApiResponseProcessor) {
        this.api = new ObservableAutoNaviInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public proxyWithHttpInfo(param: AutoNaviInterfaceApiProxyRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.proxyWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public proxy(param: AutoNaviInterfaceApiProxyRequest = {}, options?: Configuration): Promise<void> {
        return this.api.proxy( options).toPromise();
    }

}

import { ObservableAutomationApi } from "./ObservableAPI";
import { AutomationApiRequestFactory, AutomationApiResponseProcessor} from "../apis/AutomationApi";

export interface AutomationApiCreateActionRequest {
    /**
     *
     * @type CreateActionRO
     * @memberof AutomationApicreateAction
     */
    createActionRO: CreateActionRO
    /**
     * node id
     * @type string
     * @memberof AutomationApicreateAction
     */
    resourceId: string
    /**
     * share id
     * @type string
     * @memberof AutomationApicreateAction
     */
    shareId: string
}

export interface AutomationApiCreateTriggerRequest {
    /**
     *
     * @type CreateTriggerRO
     * @memberof AutomationApicreateTrigger
     */
    createTriggerRO: CreateTriggerRO
    /**
     * node id
     * @type string
     * @memberof AutomationApicreateTrigger
     */
    resourceId: string
    /**
     * share id
     * @type string
     * @memberof AutomationApicreateTrigger
     */
    shareId: string
}

export interface AutomationApiDeleteActionRequest {
    /**
     * node id
     * @type string
     * @memberof AutomationApideleteAction
     */
    resourceId: string
    /**
     * action id
     * @type string
     * @memberof AutomationApideleteAction
     */
    actionId: string
    /**
     * robot id
     * @type string
     * @memberof AutomationApideleteAction
     */
    robotId: string
}

export interface AutomationApiDeleteRobotRequest {
    /**
     * node id
     * @type string
     * @memberof AutomationApideleteRobot
     */
    resourceId: string
    /**
     * robot id
     * @type string
     * @memberof AutomationApideleteRobot
     */
    robotId: string
}

export interface AutomationApiDeleteTriggerRequest {
    /**
     * node id
     * @type string
     * @memberof AutomationApideleteTrigger
     */
    resourceId: string
    /**
     * trigger id
     * @type string
     * @memberof AutomationApideleteTrigger
     */
    triggerId: string
    /**
     * robot id
     * @type string
     * @memberof AutomationApideleteTrigger
     */
    robotId: string
}

export interface AutomationApiGetNodeRobotRequest {
    /**
     * node id
     * @type string
     * @memberof AutomationApigetNodeRobot
     */
    resourceId: string
    /**
     * robot id
     * @type string
     * @memberof AutomationApigetNodeRobot
     */
    robotId: string
    /**
     * share id
     * @type string
     * @memberof AutomationApigetNodeRobot
     */
    shareId: string
}

export interface AutomationApiGetResourceRobotsRequest {
    /**
     * node id
     * @type string
     * @memberof AutomationApigetResourceRobots
     */
    resourceId: string
    /**
     * share id
     * @type string
     * @memberof AutomationApigetResourceRobots
     */
    shareId: string
}

export interface AutomationApiGetRunHistoryRequest {
    /**
     * Current page number, default: 1
     * @type number
     * @memberof AutomationApigetRunHistory
     */
    pageNum: number
    /**
     * share id
     * @type string
     * @memberof AutomationApigetRunHistory
     */
    shareId: string
    /**
     * node id
     * @type string
     * @memberof AutomationApigetRunHistory
     */
    resourceId: string
    /**
     * robot id
     * @type string
     * @memberof AutomationApigetRunHistory
     */
    robotId: string
    /**
     * Page size, default: 20
     * @type number
     * @memberof AutomationApigetRunHistory
     */
    pageSize?: number
}

export interface AutomationApiModifyRobotRequest {
    /**
     *
     * @type UpdateRobotRO
     * @memberof AutomationApimodifyRobot
     */
    updateRobotRO: UpdateRobotRO
    /**
     * node id
     * @type string
     * @memberof AutomationApimodifyRobot
     */
    resourceId: string
    /**
     * robot id
     * @type string
     * @memberof AutomationApimodifyRobot
     */
    robotId: string
    /**
     * share id
     * @type string
     * @memberof AutomationApimodifyRobot
     */
    shareId: string
}

export interface AutomationApiUpdateActionRequest {
    /**
     *
     * @type UpdateActionRO
     * @memberof AutomationApiupdateAction
     */
    updateActionRO: UpdateActionRO
    /**
     * node id
     * @type string
     * @memberof AutomationApiupdateAction
     */
    resourceId: string
    /**
     * action id
     * @type string
     * @memberof AutomationApiupdateAction
     */
    actionId: string
    /**
     * share id
     * @type string
     * @memberof AutomationApiupdateAction
     */
    shareId: string
}

export interface AutomationApiUpdateTriggerRequest {
    /**
     *
     * @type UpdateTriggerRO
     * @memberof AutomationApiupdateTrigger
     */
    updateTriggerRO: UpdateTriggerRO
    /**
     * node id
     * @type string
     * @memberof AutomationApiupdateTrigger
     */
    resourceId: string
    /**
     * trigger id
     * @type string
     * @memberof AutomationApiupdateTrigger
     */
    triggerId: string
    /**
     * share id
     * @type string
     * @memberof AutomationApiupdateTrigger
     */
    shareId: string
}

export class ObjectAutomationApi {
    private api: ObservableAutomationApi

    public constructor(configuration: Configuration, requestFactory?: AutomationApiRequestFactory, responseProcessor?: AutomationApiResponseProcessor) {
        this.api = new ObservableAutomationApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create automation action
     * @param param the request object
     */
    public createActionWithHttpInfo(param: AutomationApiCreateActionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListActionVO>> {
        return this.api.createActionWithHttpInfo(param.createActionRO, param.resourceId, param.shareId,  options).toPromise();
    }

    /**
     * Create automation action
     * @param param the request object
     */
    public createAction(param: AutomationApiCreateActionRequest, options?: Configuration): Promise<ResponseDataListActionVO> {
        return this.api.createAction(param.createActionRO, param.resourceId, param.shareId,  options).toPromise();
    }

    /**
     * Create automation robot trigger
     * @param param the request object
     */
    public createTriggerWithHttpInfo(param: AutomationApiCreateTriggerRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListTriggerVO>> {
        return this.api.createTriggerWithHttpInfo(param.createTriggerRO, param.resourceId, param.shareId,  options).toPromise();
    }

    /**
     * Create automation robot trigger
     * @param param the request object
     */
    public createTrigger(param: AutomationApiCreateTriggerRequest, options?: Configuration): Promise<ResponseDataListTriggerVO> {
        return this.api.createTrigger(param.createTriggerRO, param.resourceId, param.shareId,  options).toPromise();
    }

    /**
     * Delete automation action
     * @param param the request object
     */
    public deleteActionWithHttpInfo(param: AutomationApiDeleteActionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteActionWithHttpInfo(param.resourceId, param.actionId, param.robotId,  options).toPromise();
    }

    /**
     * Delete automation action
     * @param param the request object
     */
    public deleteAction(param: AutomationApiDeleteActionRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteAction(param.resourceId, param.actionId, param.robotId,  options).toPromise();
    }

    /**
     * Delete automation robot
     * @param param the request object
     */
    public deleteRobotWithHttpInfo(param: AutomationApiDeleteRobotRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteRobotWithHttpInfo(param.resourceId, param.robotId,  options).toPromise();
    }

    /**
     * Delete automation robot
     * @param param the request object
     */
    public deleteRobot(param: AutomationApiDeleteRobotRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteRobot(param.resourceId, param.robotId,  options).toPromise();
    }

    /**
     * Delete automation trigger
     * @param param the request object
     */
    public deleteTriggerWithHttpInfo(param: AutomationApiDeleteTriggerRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteTriggerWithHttpInfo(param.resourceId, param.triggerId, param.robotId,  options).toPromise();
    }

    /**
     * Delete automation trigger
     * @param param the request object
     */
    public deleteTrigger(param: AutomationApiDeleteTriggerRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteTrigger(param.resourceId, param.triggerId, param.robotId,  options).toPromise();
    }

    /**
     * Get node automation detail.
     * @param param the request object
     */
    public getNodeRobotWithHttpInfo(param: AutomationApiGetNodeRobotRequest, options?: Configuration): Promise<HttpInfo<ResponseDataAutomationVO>> {
        return this.api.getNodeRobotWithHttpInfo(param.resourceId, param.robotId, param.shareId,  options).toPromise();
    }

    /**
     * Get node automation detail.
     * @param param the request object
     */
    public getNodeRobot(param: AutomationApiGetNodeRobotRequest, options?: Configuration): Promise<ResponseDataAutomationVO> {
        return this.api.getNodeRobot(param.resourceId, param.robotId, param.shareId,  options).toPromise();
    }

    /**
     * Get automation robots
     * @param param the request object
     */
    public getResourceRobotsWithHttpInfo(param: AutomationApiGetResourceRobotsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListAutomationSimpleVO>> {
        return this.api.getResourceRobotsWithHttpInfo(param.resourceId, param.shareId,  options).toPromise();
    }

    /**
     * Get automation robots
     * @param param the request object
     */
    public getResourceRobots(param: AutomationApiGetResourceRobotsRequest, options?: Configuration): Promise<ResponseDataListAutomationSimpleVO> {
        return this.api.getResourceRobots(param.resourceId, param.shareId,  options).toPromise();
    }

    /**
     * Get automation run history
     * @param param the request object
     */
    public getRunHistoryWithHttpInfo(param: AutomationApiGetRunHistoryRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListAutomationTaskSimpleVO>> {
        return this.api.getRunHistoryWithHttpInfo(param.pageNum, param.shareId, param.resourceId, param.robotId, param.pageSize,  options).toPromise();
    }

    /**
     * Get automation run history
     * @param param the request object
     */
    public getRunHistory(param: AutomationApiGetRunHistoryRequest, options?: Configuration): Promise<ResponseDataListAutomationTaskSimpleVO> {
        return this.api.getRunHistory(param.pageNum, param.shareId, param.resourceId, param.robotId, param.pageSize,  options).toPromise();
    }

    /**
     * Update automation info.
     * @param param the request object
     */
    public modifyRobotWithHttpInfo(param: AutomationApiModifyRobotRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.modifyRobotWithHttpInfo(param.updateRobotRO, param.resourceId, param.robotId, param.shareId,  options).toPromise();
    }

    /**
     * Update automation info.
     * @param param the request object
     */
    public modifyRobot(param: AutomationApiModifyRobotRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.modifyRobot(param.updateRobotRO, param.resourceId, param.robotId, param.shareId,  options).toPromise();
    }

    /**
     * Update automation action
     * @param param the request object
     */
    public updateActionWithHttpInfo(param: AutomationApiUpdateActionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListActionVO>> {
        return this.api.updateActionWithHttpInfo(param.updateActionRO, param.resourceId, param.actionId, param.shareId,  options).toPromise();
    }

    /**
     * Update automation action
     * @param param the request object
     */
    public updateAction(param: AutomationApiUpdateActionRequest, options?: Configuration): Promise<ResponseDataListActionVO> {
        return this.api.updateAction(param.updateActionRO, param.resourceId, param.actionId, param.shareId,  options).toPromise();
    }

    /**
     * Update automation robot trigger
     * @param param the request object
     */
    public updateTriggerWithHttpInfo(param: AutomationApiUpdateTriggerRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListTriggerVO>> {
        return this.api.updateTriggerWithHttpInfo(param.updateTriggerRO, param.resourceId, param.triggerId, param.shareId,  options).toPromise();
    }

    /**
     * Update automation robot trigger
     * @param param the request object
     */
    public updateTrigger(param: AutomationApiUpdateTriggerRequest, options?: Configuration): Promise<ResponseDataListTriggerVO> {
        return this.api.updateTrigger(param.updateTriggerRO, param.resourceId, param.triggerId, param.shareId,  options).toPromise();
    }

}

import { ObservableAutomationAPIApi } from "./ObservableAPI";
import { AutomationAPIApiRequestFactory, AutomationAPIApiResponseProcessor} from "../apis/AutomationAPIApi";

export interface AutomationAPIApiCreate9Request {
    /**
     *
     * @type AutomationServiceCreateRO
     * @memberof AutomationAPIApicreate9
     */
    automationServiceCreateRO: AutomationServiceCreateRO
}

export interface AutomationAPIApiDelete12Request {
    /**
     *
     * @type string
     * @memberof AutomationAPIApidelete12
     */
    serviceId: string
}

export interface AutomationAPIApiEdit4Request {
    /**
     *
     * @type AutomationServiceEditRO
     * @memberof AutomationAPIApiedit4
     */
    automationServiceEditRO: AutomationServiceEditRO
    /**
     *
     * @type string
     * @memberof AutomationAPIApiedit4
     */
    serviceId: string
}

export class ObjectAutomationAPIApi {
    private api: ObservableAutomationAPIApi

    public constructor(configuration: Configuration, requestFactory?: AutomationAPIApiRequestFactory, responseProcessor?: AutomationAPIApiResponseProcessor) {
        this.api = new ObservableAutomationAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Service
     * @param param the request object
     */
    public create9WithHttpInfo(param: AutomationAPIApiCreate9Request, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.create9WithHttpInfo(param.automationServiceCreateRO,  options).toPromise();
    }

    /**
     * Create Service
     * @param param the request object
     */
    public create9(param: AutomationAPIApiCreate9Request, options?: Configuration): Promise<ResponseDataString> {
        return this.api.create9(param.automationServiceCreateRO,  options).toPromise();
    }

    /**
     * Delete Service
     * @param param the request object
     */
    public delete12WithHttpInfo(param: AutomationAPIApiDelete12Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete12WithHttpInfo(param.serviceId,  options).toPromise();
    }

    /**
     * Delete Service
     * @param param the request object
     */
    public delete12(param: AutomationAPIApiDelete12Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete12(param.serviceId,  options).toPromise();
    }

    /**
     * Edit Service
     * @param param the request object
     */
    public edit4WithHttpInfo(param: AutomationAPIApiEdit4Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.edit4WithHttpInfo(param.automationServiceEditRO, param.serviceId,  options).toPromise();
    }

    /**
     * Edit Service
     * @param param the request object
     */
    public edit4(param: AutomationAPIApiEdit4Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.edit4(param.automationServiceEditRO, param.serviceId,  options).toPromise();
    }

}

import { ObservableAutomationActionTypeAPIApi } from "./ObservableAPI";
import { AutomationActionTypeAPIApiRequestFactory, AutomationActionTypeAPIApiResponseProcessor} from "../apis/AutomationActionTypeAPIApi";

export interface AutomationActionTypeAPIApiCreate10Request {
    /**
     *
     * @type ActionTypeCreateRO
     * @memberof AutomationActionTypeAPIApicreate10
     */
    actionTypeCreateRO: ActionTypeCreateRO
}

export interface AutomationActionTypeAPIApiDelete13Request {
    /**
     *
     * @type string
     * @memberof AutomationActionTypeAPIApidelete13
     */
    actionTypeId: string
}

export interface AutomationActionTypeAPIApiEdit5Request {
    /**
     *
     * @type ActionTypeEditRO
     * @memberof AutomationActionTypeAPIApiedit5
     */
    actionTypeEditRO: ActionTypeEditRO
    /**
     *
     * @type string
     * @memberof AutomationActionTypeAPIApiedit5
     */
    actionTypeId: string
}

export class ObjectAutomationActionTypeAPIApi {
    private api: ObservableAutomationActionTypeAPIApi

    public constructor(configuration: Configuration, requestFactory?: AutomationActionTypeAPIApiRequestFactory, responseProcessor?: AutomationActionTypeAPIApiResponseProcessor) {
        this.api = new ObservableAutomationActionTypeAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Action Type
     * @param param the request object
     */
    public create10WithHttpInfo(param: AutomationActionTypeAPIApiCreate10Request, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.create10WithHttpInfo(param.actionTypeCreateRO,  options).toPromise();
    }

    /**
     * Create Action Type
     * @param param the request object
     */
    public create10(param: AutomationActionTypeAPIApiCreate10Request, options?: Configuration): Promise<ResponseDataString> {
        return this.api.create10(param.actionTypeCreateRO,  options).toPromise();
    }

    /**
     * Delete Action Type
     * @param param the request object
     */
    public delete13WithHttpInfo(param: AutomationActionTypeAPIApiDelete13Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete13WithHttpInfo(param.actionTypeId,  options).toPromise();
    }

    /**
     * Delete Action Type
     * @param param the request object
     */
    public delete13(param: AutomationActionTypeAPIApiDelete13Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete13(param.actionTypeId,  options).toPromise();
    }

    /**
     * Edit Action Type
     * @param param the request object
     */
    public edit5WithHttpInfo(param: AutomationActionTypeAPIApiEdit5Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.edit5WithHttpInfo(param.actionTypeEditRO, param.actionTypeId,  options).toPromise();
    }

    /**
     * Edit Action Type
     * @param param the request object
     */
    public edit5(param: AutomationActionTypeAPIApiEdit5Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.edit5(param.actionTypeEditRO, param.actionTypeId,  options).toPromise();
    }

}

import { ObservableAutomationOpenApiControllerApi } from "./ObservableAPI";
import { AutomationOpenApiControllerApiRequestFactory, AutomationOpenApiControllerApiResponseProcessor} from "../apis/AutomationOpenApiControllerApi";

export interface AutomationOpenApiControllerApiCreateOrUpdateTriggerRequest {
    /**
     *
     * @type AutomationApiTriggerCreateRo
     * @memberof AutomationOpenApiControllerApicreateOrUpdateTrigger
     */
    automationApiTriggerCreateRo: AutomationApiTriggerCreateRo
    /**
     *
     * @type string
     * @memberof AutomationOpenApiControllerApicreateOrUpdateTrigger
     */
    xServiceToken?: string
}

export interface AutomationOpenApiControllerApiDeleteTrigger1Request {
    /**
     *
     * @type string
     * @memberof AutomationOpenApiControllerApideleteTrigger1
     */
    datasheetId: string
    /**
     *
     * @type Array&lt;string&gt;
     * @memberof AutomationOpenApiControllerApideleteTrigger1
     */
    robotIds: Array<string>
}

export class ObjectAutomationOpenApiControllerApi {
    private api: ObservableAutomationOpenApiControllerApi

    public constructor(configuration: Configuration, requestFactory?: AutomationOpenApiControllerApiRequestFactory, responseProcessor?: AutomationOpenApiControllerApiResponseProcessor) {
        this.api = new ObservableAutomationOpenApiControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public createOrUpdateTriggerWithHttpInfo(param: AutomationOpenApiControllerApiCreateOrUpdateTriggerRequest, options?: Configuration): Promise<HttpInfo<ResponseDataAutomationTriggerCreateVo>> {
        return this.api.createOrUpdateTriggerWithHttpInfo(param.automationApiTriggerCreateRo, param.xServiceToken,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public createOrUpdateTrigger(param: AutomationOpenApiControllerApiCreateOrUpdateTriggerRequest, options?: Configuration): Promise<ResponseDataAutomationTriggerCreateVo> {
        return this.api.createOrUpdateTrigger(param.automationApiTriggerCreateRo, param.xServiceToken,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public deleteTrigger1WithHttpInfo(param: AutomationOpenApiControllerApiDeleteTrigger1Request, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.deleteTrigger1WithHttpInfo(param.datasheetId, param.robotIds,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public deleteTrigger1(param: AutomationOpenApiControllerApiDeleteTrigger1Request, options?: Configuration): Promise<ResponseDataString> {
        return this.api.deleteTrigger1(param.datasheetId, param.robotIds,  options).toPromise();
    }

}

import { ObservableAutomationTriggerTypeAPIApi } from "./ObservableAPI";
import { AutomationTriggerTypeAPIApiRequestFactory, AutomationTriggerTypeAPIApiResponseProcessor} from "../apis/AutomationTriggerTypeAPIApi";

export interface AutomationTriggerTypeAPIApiCreate8Request {
    /**
     *
     * @type TriggerTypeCreateRO
     * @memberof AutomationTriggerTypeAPIApicreate8
     */
    triggerTypeCreateRO: TriggerTypeCreateRO
}

export interface AutomationTriggerTypeAPIApiDelete11Request {
    /**
     *
     * @type string
     * @memberof AutomationTriggerTypeAPIApidelete11
     */
    triggerTypeId: string
}

export interface AutomationTriggerTypeAPIApiEdit3Request {
    /**
     *
     * @type TriggerTypeEditRO
     * @memberof AutomationTriggerTypeAPIApiedit3
     */
    triggerTypeEditRO: TriggerTypeEditRO
    /**
     *
     * @type string
     * @memberof AutomationTriggerTypeAPIApiedit3
     */
    triggerTypeId: string
}

export class ObjectAutomationTriggerTypeAPIApi {
    private api: ObservableAutomationTriggerTypeAPIApi

    public constructor(configuration: Configuration, requestFactory?: AutomationTriggerTypeAPIApiRequestFactory, responseProcessor?: AutomationTriggerTypeAPIApiResponseProcessor) {
        this.api = new ObservableAutomationTriggerTypeAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Trigger Type
     * @param param the request object
     */
    public create8WithHttpInfo(param: AutomationTriggerTypeAPIApiCreate8Request, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.create8WithHttpInfo(param.triggerTypeCreateRO,  options).toPromise();
    }

    /**
     * Create Trigger Type
     * @param param the request object
     */
    public create8(param: AutomationTriggerTypeAPIApiCreate8Request, options?: Configuration): Promise<ResponseDataString> {
        return this.api.create8(param.triggerTypeCreateRO,  options).toPromise();
    }

    /**
     * Delete Trigger Type
     * @param param the request object
     */
    public delete11WithHttpInfo(param: AutomationTriggerTypeAPIApiDelete11Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete11WithHttpInfo(param.triggerTypeId,  options).toPromise();
    }

    /**
     * Delete Trigger Type
     * @param param the request object
     */
    public delete11(param: AutomationTriggerTypeAPIApiDelete11Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete11(param.triggerTypeId,  options).toPromise();
    }

    /**
     * Edit Trigger Type
     * @param param the request object
     */
    public edit3WithHttpInfo(param: AutomationTriggerTypeAPIApiEdit3Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.edit3WithHttpInfo(param.triggerTypeEditRO, param.triggerTypeId,  options).toPromise();
    }

    /**
     * Edit Trigger Type
     * @param param the request object
     */
    public edit3(param: AutomationTriggerTypeAPIApiEdit3Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.edit3(param.triggerTypeEditRO, param.triggerTypeId,  options).toPromise();
    }

}

import { ObservableBasicModuleAccessoryCallbackInterfaceApi } from "./ObservableAPI";
import { BasicModuleAccessoryCallbackInterfaceApiRequestFactory, BasicModuleAccessoryCallbackInterfaceApiResponseProcessor} from "../apis/BasicModuleAccessoryCallbackInterfaceApi";

export interface BasicModuleAccessoryCallbackInterfaceApiNotifyCallbackRequest {
    /**
     *
     * @type AssetUploadNotifyRO
     * @memberof BasicModuleAccessoryCallbackInterfaceApinotifyCallback
     */
    assetUploadNotifyRO: AssetUploadNotifyRO
}

export interface BasicModuleAccessoryCallbackInterfaceApiWidgetCallbackRequest {
    /**
     *
     * @type WidgetUploadNotifyRO
     * @memberof BasicModuleAccessoryCallbackInterfaceApiwidgetCallback
     */
    widgetUploadNotifyRO: WidgetUploadNotifyRO
}

export class ObjectBasicModuleAccessoryCallbackInterfaceApi {
    private api: ObservableBasicModuleAccessoryCallbackInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: BasicModuleAccessoryCallbackInterfaceApiRequestFactory, responseProcessor?: BasicModuleAccessoryCallbackInterfaceApiResponseProcessor) {
        this.api = new ObservableBasicModuleAccessoryCallbackInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * After S3 completes the client upload, it actively reaches the notification server
     * Resource upload completion notification callback
     * @param param the request object
     */
    public notifyCallbackWithHttpInfo(param: BasicModuleAccessoryCallbackInterfaceApiNotifyCallbackRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListAssetUploadResult>> {
        return this.api.notifyCallbackWithHttpInfo(param.assetUploadNotifyRO,  options).toPromise();
    }

    /**
     * After S3 completes the client upload, it actively reaches the notification server
     * Resource upload completion notification callback
     * @param param the request object
     */
    public notifyCallback(param: BasicModuleAccessoryCallbackInterfaceApiNotifyCallbackRequest, options?: Configuration): Promise<ResponseDataListAssetUploadResult> {
        return this.api.notifyCallback(param.assetUploadNotifyRO,  options).toPromise();
    }

    /**
     * widget upload callback
     * @param param the request object
     */
    public widgetCallbackWithHttpInfo(param: BasicModuleAccessoryCallbackInterfaceApiWidgetCallbackRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.widgetCallbackWithHttpInfo(param.widgetUploadNotifyRO,  options).toPromise();
    }

    /**
     * widget upload callback
     * @param param the request object
     */
    public widgetCallback(param: BasicModuleAccessoryCallbackInterfaceApiWidgetCallbackRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.widgetCallback(param.widgetUploadNotifyRO,  options).toPromise();
    }

}

import { ObservableBasicModuleAttachmentInterfaceApi } from "./ObservableAPI";
import { BasicModuleAttachmentInterfaceApiRequestFactory, BasicModuleAttachmentInterfaceApiResponseProcessor} from "../apis/BasicModuleAttachmentInterfaceApi";

export interface BasicModuleAttachmentInterfaceApiCiteRequest {
    /**
     *
     * @type SpaceAssetOpRo
     * @memberof BasicModuleAttachmentInterfaceApicite
     */
    spaceAssetOpRo: SpaceAssetOpRo
}

export interface BasicModuleAttachmentInterfaceApiReadReviewsRequest {
    /**
     *
     * @type Page
     * @memberof BasicModuleAttachmentInterfaceApireadReviews
     */
    page: Page
    /**
     * Page params
     * @type string
     * @memberof BasicModuleAttachmentInterfaceApireadReviews
     */
    pageObjectParams: string
}

export interface BasicModuleAttachmentInterfaceApiSubmitAuditResultRequest {
    /**
     *
     * @type AssetsAuditRo
     * @memberof BasicModuleAttachmentInterfaceApisubmitAuditResult
     */
    assetsAuditRo: AssetsAuditRo
}

export interface BasicModuleAttachmentInterfaceApiUploadRequest {
    /**
     *
     * @type AttachOpRo
     * @memberof BasicModuleAttachmentInterfaceApiupload
     */
    attachOpRo?: AttachOpRo
}

export interface BasicModuleAttachmentInterfaceApiUrlUploadRequest {
    /**
     *
     * @type AttachUrlOpRo
     * @memberof BasicModuleAttachmentInterfaceApiurlUpload
     */
    attachUrlOpRo?: AttachUrlOpRo
}

export class ObjectBasicModuleAttachmentInterfaceApi {
    private api: ObservableBasicModuleAttachmentInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: BasicModuleAttachmentInterfaceApiRequestFactory, responseProcessor?: BasicModuleAttachmentInterfaceApiResponseProcessor) {
        this.api = new ObservableBasicModuleAttachmentInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * The same attachment needs to pass the token repeatedly
     * Changes in the number of references to space attachment resources
     * @param param the request object
     */
    public citeWithHttpInfo(param: BasicModuleAttachmentInterfaceApiCiteRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.citeWithHttpInfo(param.spaceAssetOpRo,  options).toPromise();
    }

    /**
     * The same attachment needs to pass the token repeatedly
     * Changes in the number of references to space attachment resources
     * @param param the request object
     */
    public cite(param: BasicModuleAttachmentInterfaceApiCiteRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.cite(param.spaceAssetOpRo,  options).toPromise();
    }

    /**
     * Paging query pictures that need manual review
     * @param param the request object
     */
    public readReviewsWithHttpInfo(param: BasicModuleAttachmentInterfaceApiReadReviewsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoAssetsAuditVo>> {
        return this.api.readReviewsWithHttpInfo(param.page, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Paging query pictures that need manual review
     * @param param the request object
     */
    public readReviews(param: BasicModuleAttachmentInterfaceApiReadReviewsRequest, options?: Configuration): Promise<ResponseDataPageInfoAssetsAuditVo> {
        return this.api.readReviews(param.page, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Submit the image review results, enter the reviewer\'s name when submitting
     * Submit image review results
     * @param param the request object
     */
    public submitAuditResultWithHttpInfo(param: BasicModuleAttachmentInterfaceApiSubmitAuditResultRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.submitAuditResultWithHttpInfo(param.assetsAuditRo,  options).toPromise();
    }

    /**
     * Submit the image review results, enter the reviewer\'s name when submitting
     * Submit image review results
     * @param param the request object
     */
    public submitAuditResult(param: BasicModuleAttachmentInterfaceApiSubmitAuditResultRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.submitAuditResult(param.assetsAuditRo,  options).toPromise();
    }

    /**
     * Upload resource files, any file type is unlimited
     * Upload resources
     * @param param the request object
     */
    public uploadWithHttpInfo(param: BasicModuleAttachmentInterfaceApiUploadRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataAssetUploadResult>> {
        return this.api.uploadWithHttpInfo(param.attachOpRo,  options).toPromise();
    }

    /**
     * Upload resource files, any file type is unlimited
     * Upload resources
     * @param param the request object
     */
    public upload(param: BasicModuleAttachmentInterfaceApiUploadRequest = {}, options?: Configuration): Promise<ResponseDataAssetUploadResult> {
        return this.api.upload(param.attachOpRo,  options).toPromise();
    }

    /**
     * Image URL upload interface
     * @param param the request object
     */
    public urlUploadWithHttpInfo(param: BasicModuleAttachmentInterfaceApiUrlUploadRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataAssetUploadResult>> {
        return this.api.urlUploadWithHttpInfo(param.attachUrlOpRo,  options).toPromise();
    }

    /**
     * Image URL upload interface
     * @param param the request object
     */
    public urlUpload(param: BasicModuleAttachmentInterfaceApiUrlUploadRequest = {}, options?: Configuration): Promise<ResponseDataAssetUploadResult> {
        return this.api.urlUpload(param.attachUrlOpRo,  options).toPromise();
    }

}

import { ObservableBasicModuleVerifyActionModuleInterfaceApi } from "./ObservableAPI";
import { BasicModuleVerifyActionModuleInterfaceApiRequestFactory, BasicModuleVerifyActionModuleInterfaceApiResponseProcessor} from "../apis/BasicModuleVerifyActionModuleInterfaceApi";

export interface BasicModuleVerifyActionModuleInterfaceApiInviteTokenValidRequest {
    /**
     *
     * @type InviteValidRo
     * @memberof BasicModuleVerifyActionModuleInterfaceApiinviteTokenValid
     */
    inviteValidRo: InviteValidRo
}

export interface BasicModuleVerifyActionModuleInterfaceApiMailRequest {
    /**
     *
     * @type EmailOpRo
     * @memberof BasicModuleVerifyActionModuleInterfaceApimail
     */
    emailOpRo: EmailOpRo
}

export interface BasicModuleVerifyActionModuleInterfaceApiSendRequest {
    /**
     *
     * @type SmsOpRo
     * @memberof BasicModuleVerifyActionModuleInterfaceApisend
     */
    smsOpRo: SmsOpRo
}

export interface BasicModuleVerifyActionModuleInterfaceApiValidateEmailRequest {
    /**
     *
     * @type EmailCodeValidateRo
     * @memberof BasicModuleVerifyActionModuleInterfaceApivalidateEmail
     */
    emailCodeValidateRo: EmailCodeValidateRo
}

export interface BasicModuleVerifyActionModuleInterfaceApiVerifyPhone1Request {
    /**
     *
     * @type SmsCodeValidateRo
     * @memberof BasicModuleVerifyActionModuleInterfaceApiverifyPhone1
     */
    smsCodeValidateRo: SmsCodeValidateRo
}

export class ObjectBasicModuleVerifyActionModuleInterfaceApi {
    private api: ObservableBasicModuleVerifyActionModuleInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: BasicModuleVerifyActionModuleInterfaceApiRequestFactory, responseProcessor?: BasicModuleVerifyActionModuleInterfaceApiResponseProcessor) {
        this.api = new ObservableBasicModuleVerifyActionModuleInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Invitation link token verification, the relevant invitation information can be obtained after the verification is successful
     * Invitation temporary code verification
     * @param param the request object
     */
    public inviteTokenValidWithHttpInfo(param: BasicModuleVerifyActionModuleInterfaceApiInviteTokenValidRequest, options?: Configuration): Promise<HttpInfo<ResponseDataInviteInfoVo>> {
        return this.api.inviteTokenValidWithHttpInfo(param.inviteValidRo,  options).toPromise();
    }

    /**
     * Invitation link token verification, the relevant invitation information can be obtained after the verification is successful
     * Invitation temporary code verification
     * @param param the request object
     */
    public inviteTokenValid(param: BasicModuleVerifyActionModuleInterfaceApiInviteTokenValidRequest, options?: Configuration): Promise<ResponseDataInviteInfoVo> {
        return this.api.inviteTokenValid(param.inviteValidRo,  options).toPromise();
    }

    /**
     * Email verification code; 1:Email binding, 2: Email registration, 3: General verification
     * Send email verification code
     * @param param the request object
     */
    public mailWithHttpInfo(param: BasicModuleVerifyActionModuleInterfaceApiMailRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.mailWithHttpInfo(param.emailOpRo,  options).toPromise();
    }

    /**
     * Email verification code; 1:Email binding, 2: Email registration, 3: General verification
     * Send email verification code
     * @param param the request object
     */
    public mail(param: BasicModuleVerifyActionModuleInterfaceApiMailRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.mail(param.emailOpRo,  options).toPromise();
    }

    /**
     * SMS type; 1: Registration, 2:Login, 3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, 6: (Remove replacement) mobile phone binding 7: Modify mailbox binding, 8: Delete space, 9: Replace main administrator 10: General verification, 11: Change developer configuration, 12: Bind third-party platform account
     * Send SMS verification code
     * @param param the request object
     */
    public sendWithHttpInfo(param: BasicModuleVerifyActionModuleInterfaceApiSendRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.sendWithHttpInfo(param.smsOpRo,  options).toPromise();
    }

    /**
     * SMS type; 1: Registration, 2:Login, 3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, 6: (Remove replacement) mobile phone binding 7: Modify mailbox binding, 8: Delete space, 9: Replace main administrator 10: General verification, 11: Change developer configuration, 12: Bind third-party platform account
     * Send SMS verification code
     * @param param the request object
     */
    public send(param: BasicModuleVerifyActionModuleInterfaceApiSendRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.send(param.smsOpRo,  options).toPromise();
    }

    /**
     * Usage scenario: Verify identity before changing email address when no mobile phone, change the main administrator
     * Email verification code verification
     * @param param the request object
     */
    public validateEmailWithHttpInfo(param: BasicModuleVerifyActionModuleInterfaceApiValidateEmailRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.validateEmailWithHttpInfo(param.emailCodeValidateRo,  options).toPromise();
    }

    /**
     * Usage scenario: Verify identity before changing email address when no mobile phone, change the main administrator
     * Email verification code verification
     * @param param the request object
     */
    public validateEmail(param: BasicModuleVerifyActionModuleInterfaceApiValidateEmailRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.validateEmail(param.emailCodeValidateRo,  options).toPromise();
    }

    /**
     * Usage scenarios: DingTalk binding, identity verification before changing the mobile phone mailbox, changing the main administrator
     * Mobile verification code verification
     * @param param the request object
     */
    public verifyPhone1WithHttpInfo(param: BasicModuleVerifyActionModuleInterfaceApiVerifyPhone1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.verifyPhone1WithHttpInfo(param.smsCodeValidateRo,  options).toPromise();
    }

    /**
     * Usage scenarios: DingTalk binding, identity verification before changing the mobile phone mailbox, changing the main administrator
     * Mobile verification code verification
     * @param param the request object
     */
    public verifyPhone1(param: BasicModuleVerifyActionModuleInterfaceApiVerifyPhone1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.verifyPhone1(param.smsCodeValidateRo,  options).toPromise();
    }

}

import { ObservableBasicsAttachmentUploadTokenInterfaceApi } from "./ObservableAPI";
import { BasicsAttachmentUploadTokenInterfaceApiRequestFactory, BasicsAttachmentUploadTokenInterfaceApiResponseProcessor} from "../apis/BasicsAttachmentUploadTokenInterfaceApi";

export interface BasicsAttachmentUploadTokenInterfaceApiGeneratePreSignedUrlRequest {
    /**
     *
     * @type AssetUploadCertificateRO
     * @memberof BasicsAttachmentUploadTokenInterfaceApigeneratePreSignedUrl
     */
    assetUploadCertificateRO: AssetUploadCertificateRO
}

export interface BasicsAttachmentUploadTokenInterfaceApiGetSignatureUrlRequest {
    /**
     *
     * @type string
     * @memberof BasicsAttachmentUploadTokenInterfaceApigetSignatureUrl
     */
    token: string
}

export interface BasicsAttachmentUploadTokenInterfaceApiGetSignatureUrlsRequest {
    /**
     *
     * @type AssetUrlSignatureRo
     * @memberof BasicsAttachmentUploadTokenInterfaceApigetSignatureUrls
     */
    assetUrlSignatureRo: AssetUrlSignatureRo
}

export class ObjectBasicsAttachmentUploadTokenInterfaceApi {
    private api: ObservableBasicsAttachmentUploadTokenInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: BasicsAttachmentUploadTokenInterfaceApiRequestFactory, responseProcessor?: BasicsAttachmentUploadTokenInterfaceApiResponseProcessor) {
        this.api = new ObservableBasicsAttachmentUploadTokenInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get upload presigned URL
     * @param param the request object
     */
    public generatePreSignedUrlWithHttpInfo(param: BasicsAttachmentUploadTokenInterfaceApiGeneratePreSignedUrlRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListAssetUploadCertificateVO>> {
        return this.api.generatePreSignedUrlWithHttpInfo(param.assetUploadCertificateRO,  options).toPromise();
    }

    /**
     * Get upload presigned URL
     * @param param the request object
     */
    public generatePreSignedUrl(param: BasicsAttachmentUploadTokenInterfaceApiGeneratePreSignedUrlRequest, options?: Configuration): Promise<ResponseDataListAssetUploadCertificateVO> {
        return this.api.generatePreSignedUrl(param.assetUploadCertificateRO,  options).toPromise();
    }

    /**
     * Get asset signature url
     * @param param the request object
     */
    public getSignatureUrlWithHttpInfo(param: BasicsAttachmentUploadTokenInterfaceApiGetSignatureUrlRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.getSignatureUrlWithHttpInfo(param.token,  options).toPromise();
    }

    /**
     * Get asset signature url
     * @param param the request object
     */
    public getSignatureUrl(param: BasicsAttachmentUploadTokenInterfaceApiGetSignatureUrlRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.getSignatureUrl(param.token,  options).toPromise();
    }

    /**
     * Batch get asset signature url
     * @param param the request object
     */
    public getSignatureUrlsWithHttpInfo(param: BasicsAttachmentUploadTokenInterfaceApiGetSignatureUrlsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListAssetUrlSignatureVo>> {
        return this.api.getSignatureUrlsWithHttpInfo(param.assetUrlSignatureRo,  options).toPromise();
    }

    /**
     * Batch get asset signature url
     * @param param the request object
     */
    public getSignatureUrls(param: BasicsAttachmentUploadTokenInterfaceApiGetSignatureUrlsRequest, options?: Configuration): Promise<ResponseDataListAssetUrlSignatureVo> {
        return this.api.getSignatureUrls(param.assetUrlSignatureRo,  options).toPromise();
    }

}

import { ObservableBillingCapacityApiApi } from "./ObservableAPI";
import { BillingCapacityApiApiRequestFactory, BillingCapacityApiApiResponseProcessor} from "../apis/BillingCapacityApiApi";

export interface BillingCapacityApiApiGetCapacityDetailRequest {
    /**
     *
     * @type Page
     * @memberof BillingCapacityApiApigetCapacityDetail
     */
    page: Page
    /**
     * space id
     * @type string
     * @memberof BillingCapacityApiApigetCapacityDetail
     */
    xSpaceId: string
    /**
     * paging parameter
     * @type string
     * @memberof BillingCapacityApiApigetCapacityDetail
     */
    pageObjectParams: string
    /**
     * Whether the attachment capacity has expired. By default, it has not expired
     * @type boolean
     * @memberof BillingCapacityApiApigetCapacityDetail
     */
    isExpire?: boolean
}

export class ObjectBillingCapacityApiApi {
    private api: ObservableBillingCapacityApiApi

    public constructor(configuration: Configuration, requestFactory?: BillingCapacityApiApiRequestFactory, responseProcessor?: BillingCapacityApiApiResponseProcessor) {
        this.api = new ObservableBillingCapacityApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get space capacity detail info
     * @param param the request object
     */
    public getCapacityDetailWithHttpInfo(param: BillingCapacityApiApiGetCapacityDetailRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoSpaceCapacityPageVO>> {
        return this.api.getCapacityDetailWithHttpInfo(param.page, param.xSpaceId, param.pageObjectParams, param.isExpire,  options).toPromise();
    }

    /**
     * Get space capacity detail info
     * @param param the request object
     */
    public getCapacityDetail(param: BillingCapacityApiApiGetCapacityDetailRequest, options?: Configuration): Promise<ResponseDataPageInfoSpaceCapacityPageVO> {
        return this.api.getCapacityDetail(param.page, param.xSpaceId, param.pageObjectParams, param.isExpire,  options).toPromise();
    }

}

import { ObservableBillingControllerApi } from "./ObservableAPI";
import { BillingControllerApiRequestFactory, BillingControllerApiResponseProcessor} from "../apis/BillingControllerApi";

export interface BillingControllerApiCancelSubscriptionRequest {
    /**
     *
     * @type string
     * @memberof BillingControllerApicancelSubscription
     */
    spaceId: string
    /**
     *
     * @type string
     * @memberof BillingControllerApicancelSubscription
     */
    subscriptionId: string
}

export interface BillingControllerApiChangePaymentMethodRequest {
    /**
     *
     * @type string
     * @memberof BillingControllerApichangePaymentMethod
     */
    spaceId: string
}

export interface BillingControllerApiCustomerPortalUrlRequest {
    /**
     *
     * @type string
     * @memberof BillingControllerApicustomerPortalUrl
     */
    spaceId: string
}

export interface BillingControllerApiGetInvoicesRequest {
    /**
     *
     * @type string
     * @memberof BillingControllerApigetInvoices
     */
    spaceId: string
    /**
     *
     * @type string
     * @memberof BillingControllerApigetInvoices
     */
    startingAfter?: string
    /**
     *
     * @type string
     * @memberof BillingControllerApigetInvoices
     */
    endingBefore?: string
    /**
     *
     * @type number
     * @memberof BillingControllerApigetInvoices
     */
    limit?: number
}

export interface BillingControllerApiGetSubscriptionsRequest {
    /**
     *
     * @type string
     * @memberof BillingControllerApigetSubscriptions
     */
    spaceId: string
}

export interface BillingControllerApiUpdateSubscriptionRequest {
    /**
     *
     * @type string
     * @memberof BillingControllerApiupdateSubscription
     */
    spaceId: string
    /**
     *
     * @type string
     * @memberof BillingControllerApiupdateSubscription
     */
    subscriptionId: string
    /**
     *
     * @type string
     * @memberof BillingControllerApiupdateSubscription
     */
    action?: string
}

export interface BillingControllerApiUpdateSubscriptionConfirmRequest {
    /**
     *
     * @type string
     * @memberof BillingControllerApiupdateSubscriptionConfirm
     */
    spaceId: string
    /**
     *
     * @type string
     * @memberof BillingControllerApiupdateSubscriptionConfirm
     */
    subscriptionId: string
    /**
     *
     * @type string
     * @memberof BillingControllerApiupdateSubscriptionConfirm
     */
    priceId: string
}

export class ObjectBillingControllerApi {
    private api: ObservableBillingControllerApi

    public constructor(configuration: Configuration, requestFactory?: BillingControllerApiRequestFactory, responseProcessor?: BillingControllerApiResponseProcessor) {
        this.api = new ObservableBillingControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public cancelSubscriptionWithHttpInfo(param: BillingControllerApiCancelSubscriptionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBillingSessionVO>> {
        return this.api.cancelSubscriptionWithHttpInfo(param.spaceId, param.subscriptionId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public cancelSubscription(param: BillingControllerApiCancelSubscriptionRequest, options?: Configuration): Promise<ResponseDataBillingSessionVO> {
        return this.api.cancelSubscription(param.spaceId, param.subscriptionId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public changePaymentMethodWithHttpInfo(param: BillingControllerApiChangePaymentMethodRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBillingSessionVO>> {
        return this.api.changePaymentMethodWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public changePaymentMethod(param: BillingControllerApiChangePaymentMethodRequest, options?: Configuration): Promise<ResponseDataBillingSessionVO> {
        return this.api.changePaymentMethod(param.spaceId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public customerPortalUrlWithHttpInfo(param: BillingControllerApiCustomerPortalUrlRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBillingSessionVO>> {
        return this.api.customerPortalUrlWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public customerPortalUrl(param: BillingControllerApiCustomerPortalUrlRequest, options?: Configuration): Promise<ResponseDataBillingSessionVO> {
        return this.api.customerPortalUrl(param.spaceId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getInvoicesWithHttpInfo(param: BillingControllerApiGetInvoicesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataCustomerInvoices>> {
        return this.api.getInvoicesWithHttpInfo(param.spaceId, param.startingAfter, param.endingBefore, param.limit,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getInvoices(param: BillingControllerApiGetInvoicesRequest, options?: Configuration): Promise<ResponseDataCustomerInvoices> {
        return this.api.getInvoices(param.spaceId, param.startingAfter, param.endingBefore, param.limit,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getSubscriptionsWithHttpInfo(param: BillingControllerApiGetSubscriptionsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBillingInfo>> {
        return this.api.getSubscriptionsWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getSubscriptions(param: BillingControllerApiGetSubscriptionsRequest, options?: Configuration): Promise<ResponseDataBillingInfo> {
        return this.api.getSubscriptions(param.spaceId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public updateSubscriptionWithHttpInfo(param: BillingControllerApiUpdateSubscriptionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBillingSessionVO>> {
        return this.api.updateSubscriptionWithHttpInfo(param.spaceId, param.subscriptionId, param.action,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public updateSubscription(param: BillingControllerApiUpdateSubscriptionRequest, options?: Configuration): Promise<ResponseDataBillingSessionVO> {
        return this.api.updateSubscription(param.spaceId, param.subscriptionId, param.action,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public updateSubscriptionConfirmWithHttpInfo(param: BillingControllerApiUpdateSubscriptionConfirmRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBillingSessionVO>> {
        return this.api.updateSubscriptionConfirmWithHttpInfo(param.spaceId, param.subscriptionId, param.priceId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public updateSubscriptionConfirm(param: BillingControllerApiUpdateSubscriptionConfirmRequest, options?: Configuration): Promise<ResponseDataBillingSessionVO> {
        return this.api.updateSubscriptionConfirm(param.spaceId, param.subscriptionId, param.priceId,  options).toPromise();
    }

}

import { ObservableBillingEventApiApi } from "./ObservableAPI";
import { BillingEventApiApiRequestFactory, BillingEventApiApiResponseProcessor} from "../apis/BillingEventApiApi";

export interface BillingEventApiApiFetchEventListRequest {
}

export class ObjectBillingEventApiApi {
    private api: ObservableBillingEventApiApi

    public constructor(configuration: Configuration, requestFactory?: BillingEventApiApiRequestFactory, responseProcessor?: BillingEventApiApiResponseProcessor) {
        this.api = new ObservableBillingEventApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * fetch event list
     * @param param the request object
     */
    public fetchEventListWithHttpInfo(param: BillingEventApiApiFetchEventListRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataEventVO>> {
        return this.api.fetchEventListWithHttpInfo( options).toPromise();
    }

    /**
     * fetch event list
     * @param param the request object
     */
    public fetchEventList(param: BillingEventApiApiFetchEventListRequest = {}, options?: Configuration): Promise<ResponseDataEventVO> {
        return this.api.fetchEventList( options).toPromise();
    }

}

import { ObservableBillingOrderAPIApi } from "./ObservableAPI";
import { BillingOrderAPIApiRequestFactory, BillingOrderAPIApiResponseProcessor} from "../apis/BillingOrderAPIApi";

export interface BillingOrderAPIApiCheckOrderPaidStatusRequest {
    /**
     * order id
     * @type string
     * @memberof BillingOrderAPIApicheckOrderPaidStatus
     */
    orderId: string
}

export interface BillingOrderAPIApiCreateOrderRequest {
    /**
     *
     * @type CreateOrderRo
     * @memberof BillingOrderAPIApicreateOrder
     */
    createOrderRo: CreateOrderRo
}

export interface BillingOrderAPIApiCreateOrderPaymentRequest {
    /**
     *
     * @type PayOrderRo
     * @memberof BillingOrderAPIApicreateOrderPayment
     */
    payOrderRo: PayOrderRo
    /**
     * order id
     * @type string
     * @memberof BillingOrderAPIApicreateOrderPayment
     */
    orderId: string
}

export interface BillingOrderAPIApiFetchOrderByIdRequest {
    /**
     *
     * @type string
     * @memberof BillingOrderAPIApifetchOrderById
     */
    orderId: string
}

export interface BillingOrderAPIApiGenerateDryRunOrderRequest {
    /**
     *
     * @type DryRunOrderArgs
     * @memberof BillingOrderAPIApigenerateDryRunOrder
     */
    dryRunOrderArgs: DryRunOrderArgs
}

export interface BillingOrderAPIApiGetOrderPaidStatusRequest {
    /**
     * order id
     * @type string
     * @memberof BillingOrderAPIApigetOrderPaidStatus
     */
    orderId: string
}

export class ObjectBillingOrderAPIApi {
    private api: ObservableBillingOrderAPIApi

    public constructor(configuration: Configuration, requestFactory?: BillingOrderAPIApiRequestFactory, responseProcessor?: BillingOrderAPIApiResponseProcessor) {
        this.api = new ObservableBillingOrderAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * check order paid status when client polling is longer
     * Check Order Payment Status
     * @param param the request object
     */
    public checkOrderPaidStatusWithHttpInfo(param: BillingOrderAPIApiCheckOrderPaidStatusRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPaymentOrderStatusVo>> {
        return this.api.checkOrderPaidStatusWithHttpInfo(param.orderId,  options).toPromise();
    }

    /**
     * check order paid status when client polling is longer
     * Check Order Payment Status
     * @param param the request object
     */
    public checkOrderPaidStatus(param: BillingOrderAPIApiCheckOrderPaidStatusRequest, options?: Configuration): Promise<ResponseDataPaymentOrderStatusVo> {
        return this.api.checkOrderPaidStatus(param.orderId,  options).toPromise();
    }

    /**
     * Create Order
     * @param param the request object
     */
    public createOrderWithHttpInfo(param: BillingOrderAPIApiCreateOrderRequest, options?: Configuration): Promise<HttpInfo<ResponseDataOrderDetailVo>> {
        return this.api.createOrderWithHttpInfo(param.createOrderRo,  options).toPromise();
    }

    /**
     * Create Order
     * @param param the request object
     */
    public createOrder(param: BillingOrderAPIApiCreateOrderRequest, options?: Configuration): Promise<ResponseDataOrderDetailVo> {
        return this.api.createOrder(param.createOrderRo,  options).toPromise();
    }

    /**
     * Create Payment Order
     * @param param the request object
     */
    public createOrderPaymentWithHttpInfo(param: BillingOrderAPIApiCreateOrderPaymentRequest, options?: Configuration): Promise<HttpInfo<ResponseDataOrderPaymentVo>> {
        return this.api.createOrderPaymentWithHttpInfo(param.payOrderRo, param.orderId,  options).toPromise();
    }

    /**
     * Create Payment Order
     * @param param the request object
     */
    public createOrderPayment(param: BillingOrderAPIApiCreateOrderPaymentRequest, options?: Configuration): Promise<ResponseDataOrderPaymentVo> {
        return this.api.createOrderPayment(param.payOrderRo, param.orderId,  options).toPromise();
    }

    /**
     * fetch order detail by id
     * Get Order Details
     * @param param the request object
     */
    public fetchOrderByIdWithHttpInfo(param: BillingOrderAPIApiFetchOrderByIdRequest, options?: Configuration): Promise<HttpInfo<ResponseDataOrderDetailVo>> {
        return this.api.fetchOrderByIdWithHttpInfo(param.orderId,  options).toPromise();
    }

    /**
     * fetch order detail by id
     * Get Order Details
     * @param param the request object
     */
    public fetchOrderById(param: BillingOrderAPIApiFetchOrderByIdRequest, options?: Configuration): Promise<ResponseDataOrderDetailVo> {
        return this.api.fetchOrderById(param.orderId,  options).toPromise();
    }

    /**
     * According to the subscription change type (new subscription, subscription renewal, subscription change, subscription cancellation), preview the orders to be generated by the system in the future
     * Test run order
     * @param param the request object
     */
    public generateDryRunOrderWithHttpInfo(param: BillingOrderAPIApiGenerateDryRunOrderRequest, options?: Configuration): Promise<HttpInfo<ResponseDataOrderPreview>> {
        return this.api.generateDryRunOrderWithHttpInfo(param.dryRunOrderArgs,  options).toPromise();
    }

    /**
     * According to the subscription change type (new subscription, subscription renewal, subscription change, subscription cancellation), preview the orders to be generated by the system in the future
     * Test run order
     * @param param the request object
     */
    public generateDryRunOrder(param: BillingOrderAPIApiGenerateDryRunOrderRequest, options?: Configuration): Promise<ResponseDataOrderPreview> {
        return this.api.generateDryRunOrder(param.dryRunOrderArgs,  options).toPromise();
    }

    /**
     * get order paid status when client polling
     * Get Order Payment Status
     * @param param the request object
     */
    public getOrderPaidStatusWithHttpInfo(param: BillingOrderAPIApiGetOrderPaidStatusRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPaymentOrderStatusVo>> {
        return this.api.getOrderPaidStatusWithHttpInfo(param.orderId,  options).toPromise();
    }

    /**
     * get order paid status when client polling
     * Get Order Payment Status
     * @param param the request object
     */
    public getOrderPaidStatus(param: BillingOrderAPIApiGetOrderPaidStatusRequest, options?: Configuration): Promise<ResponseDataPaymentOrderStatusVo> {
        return this.api.getOrderPaidStatus(param.orderId,  options).toPromise();
    }

}

import { ObservableCheckoutControllerApi } from "./ObservableAPI";
import { CheckoutControllerApiRequestFactory, CheckoutControllerApiResponseProcessor} from "../apis/CheckoutControllerApi";

export interface CheckoutControllerApiCreateCheckoutRequest {
    /**
     *
     * @type CheckoutCreation
     * @memberof CheckoutControllerApicreateCheckout
     */
    checkoutCreation: CheckoutCreation
}

export class ObjectCheckoutControllerApi {
    private api: ObservableCheckoutControllerApi

    public constructor(configuration: Configuration, requestFactory?: CheckoutControllerApiRequestFactory, responseProcessor?: CheckoutControllerApiResponseProcessor) {
        this.api = new ObservableCheckoutControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public createCheckoutWithHttpInfo(param: CheckoutControllerApiCreateCheckoutRequest, options?: Configuration): Promise<HttpInfo<CheckoutCreationVO>> {
        return this.api.createCheckoutWithHttpInfo(param.checkoutCreation,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public createCheckout(param: CheckoutControllerApiCreateCheckoutRequest, options?: Configuration): Promise<CheckoutCreationVO> {
        return this.api.createCheckout(param.checkoutCreation,  options).toPromise();
    }

}

import { ObservableCliAuthorizationAPIApi } from "./ObservableAPI";
import { CliAuthorizationAPIApiRequestFactory, CliAuthorizationAPIApiResponseProcessor} from "../apis/CliAuthorizationAPIApi";

export interface CliAuthorizationAPIApiAuthLoginRequest {
    /**
     *
     * @type string
     * @memberof CliAuthorizationAPIApiauthLogin
     */
    apiKey: string
}

export interface CliAuthorizationAPIApiGraphqlRequest {
    /**
     * developer token
     * @type string
     * @memberof CliAuthorizationAPIApigraphql
     */
    developerToken: string
}

export interface CliAuthorizationAPIApiNewAppletRequest {
    /**
     *
     * @type string
     * @memberof CliAuthorizationAPIApinewApplet
     */
    spaceId: string
    /**
     * developer token
     * @type string
     * @memberof CliAuthorizationAPIApinewApplet
     */
    developerToken: string
}

export interface CliAuthorizationAPIApiNewTokenRequest {
    /**
     * Normal login Session Token of the user.
     * @type string
     * @memberof CliAuthorizationAPIApinewToken
     */
    userSessionToken: string
}

export interface CliAuthorizationAPIApiNewWebhookRequest {
    /**
     * developer token
     * @type string
     * @memberof CliAuthorizationAPIApinewWebhook
     */
    developerToken: string
}

export interface CliAuthorizationAPIApiPublishAppletRequest {
    /**
     * developer token
     * @type string
     * @memberof CliAuthorizationAPIApipublishApplet
     */
    developerToken: string
}

export interface CliAuthorizationAPIApiShowAppletsRequest {
    /**
     *
     * @type string
     * @memberof CliAuthorizationAPIApishowApplets
     */
    spaceId: string
    /**
     * developer token
     * @type string
     * @memberof CliAuthorizationAPIApishowApplets
     */
    developerToken: string
    /**
     * space id
     * @type string
     * @memberof CliAuthorizationAPIApishowApplets
     */
    xSpaceId: string
}

export interface CliAuthorizationAPIApiShowSpacesRequest {
}

export interface CliAuthorizationAPIApiShowWebhooksRequest {
    /**
     *
     * @type string
     * @memberof CliAuthorizationAPIApishowWebhooks
     */
    appletId: string
    /**
     * developer token
     * @type string
     * @memberof CliAuthorizationAPIApishowWebhooks
     */
    developerToken: string
}

export interface CliAuthorizationAPIApiUploadPluginRequest {
    /**
     * developer token
     * @type string
     * @memberof CliAuthorizationAPIApiuploadPlugin
     */
    developerToken: string
}

export class ObjectCliAuthorizationAPIApi {
    private api: ObservableCliAuthorizationAPIApi

    public constructor(configuration: Configuration, requestFactory?: CliAuthorizationAPIApiRequestFactory, responseProcessor?: CliAuthorizationAPIApiResponseProcessor) {
        this.api = new ObservableCliAuthorizationAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Login authorization, using the developer\'s Api Key.
     * @param param the request object
     */
    public authLoginWithHttpInfo(param: CliAuthorizationAPIApiAuthLoginRequest, options?: Configuration): Promise<HttpInfo<ResponseDataDevelopUserVo>> {
        return this.api.authLoginWithHttpInfo(param.apiKey,  options).toPromise();
    }

    /**
     * Login authorization, using the developer\'s Api Key.
     * @param param the request object
     */
    public authLogin(param: CliAuthorizationAPIApiAuthLoginRequest, options?: Configuration): Promise<ResponseDataDevelopUserVo> {
        return this.api.authLogin(param.apiKey,  options).toPromise();
    }

    /**
     * Query using Graph QL
     * GraphQL Query
     * @param param the request object
     */
    public graphqlWithHttpInfo(param: CliAuthorizationAPIApiGraphqlRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.graphqlWithHttpInfo(param.developerToken,  options).toPromise();
    }

    /**
     * Query using Graph QL
     * GraphQL Query
     * @param param the request object
     */
    public graphql(param: CliAuthorizationAPIApiGraphqlRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.graphql(param.developerToken,  options).toPromise();
    }

    /**
     * Create a new cloud application in the specified space.
     * New Cloud application
     * @param param the request object
     */
    public newAppletWithHttpInfo(param: CliAuthorizationAPIApiNewAppletRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.newAppletWithHttpInfo(param.spaceId, param.developerToken,  options).toPromise();
    }

    /**
     * Create a new cloud application in the specified space.
     * New Cloud application
     * @param param the request object
     */
    public newApplet(param: CliAuthorizationAPIApiNewAppletRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.newApplet(param.spaceId, param.developerToken,  options).toPromise();
    }

    /**
     * The developer token is passed for login. The network verifies whether the token is valid. The user name is returned and cached locally.   Generally speaking, this API is not used by vika-cli, but for Web side web page operations.
     * Create Developer Token
     * @param param the request object
     */
    public newTokenWithHttpInfo(param: CliAuthorizationAPIApiNewTokenRequest, options?: Configuration): Promise<HttpInfo<ResponseDataDeveloperVo>> {
        return this.api.newTokenWithHttpInfo(param.userSessionToken,  options).toPromise();
    }

    /**
     * The developer token is passed for login. The network verifies whether the token is valid. The user name is returned and cached locally.   Generally speaking, this API is not used by vika-cli, but for Web side web page operations.
     * Create Developer Token
     * @param param the request object
     */
    public newToken(param: CliAuthorizationAPIApiNewTokenRequest, options?: Configuration): Promise<ResponseDataDeveloperVo> {
        return this.api.newToken(param.userSessionToken,  options).toPromise();
    }

    /**
     * Creates a cloud hook in the specified applet.
     * Creating a Cloud Hook
     * @param param the request object
     */
    public newWebhookWithHttpInfo(param: CliAuthorizationAPIApiNewWebhookRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.newWebhookWithHttpInfo(param.developerToken,  options).toPromise();
    }

    /**
     * Creates a cloud hook in the specified applet.
     * Creating a Cloud Hook
     * @param param the request object
     */
    public newWebhook(param: CliAuthorizationAPIApiNewWebhookRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.newWebhook(param.developerToken,  options).toPromise();
    }

    /**
     * Specifies that the applet is published to the marketplace.
     * Publish cloud applications
     * @param param the request object
     */
    public publishAppletWithHttpInfo(param: CliAuthorizationAPIApiPublishAppletRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.publishAppletWithHttpInfo(param.developerToken,  options).toPromise();
    }

    /**
     * Specifies that the applet is published to the marketplace.
     * Publish cloud applications
     * @param param the request object
     */
    public publishApplet(param: CliAuthorizationAPIApiPublishAppletRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.publishApplet(param.developerToken,  options).toPromise();
    }

    /**
     * Lists all cloud applications in the specified space.
     * Listing cloud applications
     * @param param the request object
     */
    public showAppletsWithHttpInfo(param: CliAuthorizationAPIApiShowAppletsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.showAppletsWithHttpInfo(param.spaceId, param.developerToken, param.xSpaceId,  options).toPromise();
    }

    /**
     * Lists all cloud applications in the specified space.
     * Listing cloud applications
     * @param param the request object
     */
    public showApplets(param: CliAuthorizationAPIApiShowAppletsRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.showApplets(param.spaceId, param.developerToken, param.xSpaceId,  options).toPromise();
    }

    /**
     * List the space owned by the user.
     * space list
     * @param param the request object
     */
    public showSpacesWithHttpInfo(param: CliAuthorizationAPIApiShowSpacesRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListSpaceShowcaseVo>> {
        return this.api.showSpacesWithHttpInfo( options).toPromise();
    }

    /**
     * List the space owned by the user.
     * space list
     * @param param the request object
     */
    public showSpaces(param: CliAuthorizationAPIApiShowSpacesRequest = {}, options?: Configuration): Promise<ResponseDataListSpaceShowcaseVo> {
        return this.api.showSpaces( options).toPromise();
    }

    /**
     * Lists all cloud hooks in the specified applet.
     * Listing cloud hooks
     * @param param the request object
     */
    public showWebhooksWithHttpInfo(param: CliAuthorizationAPIApiShowWebhooksRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.showWebhooksWithHttpInfo(param.appletId, param.developerToken,  options).toPromise();
    }

    /**
     * Lists all cloud hooks in the specified applet.
     * Listing cloud hooks
     * @param param the request object
     */
    public showWebhooks(param: CliAuthorizationAPIApiShowWebhooksRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.showWebhooks(param.appletId, param.developerToken,  options).toPromise();
    }

    /**
     * Specifies the applet upload plug-in.
     * Upload plug-ins
     * @param param the request object
     */
    public uploadPluginWithHttpInfo(param: CliAuthorizationAPIApiUploadPluginRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.uploadPluginWithHttpInfo(param.developerToken,  options).toPromise();
    }

    /**
     * Specifies the applet upload plug-in.
     * Upload plug-ins
     * @param param the request object
     */
    public uploadPlugin(param: CliAuthorizationAPIApiUploadPluginRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.uploadPlugin(param.developerToken,  options).toPromise();
    }

}

import { ObservableCliOfficeBanAPIApi } from "./ObservableAPI";
import { CliOfficeBanAPIApiRequestFactory, CliOfficeBanAPIApiResponseProcessor} from "../apis/CliOfficeBanAPIApi";

export interface CliOfficeBanAPIApiBanSpaceRequest {
    /**
     *
     * @type string
     * @memberof CliOfficeBanAPIApibanSpace
     */
    spaceId: string
}

export interface CliOfficeBanAPIApiBanUserRequest {
    /**
     *
     * @type number
     * @memberof CliOfficeBanAPIApibanUser
     */
    userId: number
}

export class ObjectCliOfficeBanAPIApi {
    private api: ObservableCliOfficeBanAPIApi

    public constructor(configuration: Configuration, requestFactory?: CliOfficeBanAPIApiRequestFactory, responseProcessor?: CliOfficeBanAPIApiResponseProcessor) {
        this.api = new ObservableCliOfficeBanAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * limit function.
     * Ban space
     * @param param the request object
     */
    public banSpaceWithHttpInfo(param: CliOfficeBanAPIApiBanSpaceRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.banSpaceWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * limit function.
     * Ban space
     * @param param the request object
     */
    public banSpace(param: CliOfficeBanAPIApiBanSpaceRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.banSpace(param.spaceId,  options).toPromise();
    }

    /**
     * Restrict login and force logout.
     * Ban account
     * @param param the request object
     */
    public banUserWithHttpInfo(param: CliOfficeBanAPIApiBanUserRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.banUserWithHttpInfo(param.userId,  options).toPromise();
    }

    /**
     * Restrict login and force logout.
     * Ban account
     * @param param the request object
     */
    public banUser(param: CliOfficeBanAPIApiBanUserRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.banUser(param.userId,  options).toPromise();
    }

}

import { ObservableCliOfficeGMAPIApi } from "./ObservableAPI";
import { CliOfficeGMAPIApiRequestFactory, CliOfficeGMAPIApiResponseProcessor} from "../apis/CliOfficeGMAPIApi";

export interface CliOfficeGMAPIApiActivityRewardRequest {
}

export interface CliOfficeGMAPIApiAddPlayerNotifyRequest {
    /**
     *
     * @type NotificationCreateRo
     * @memberof CliOfficeGMAPIApiaddPlayerNotify
     */
    notificationCreateRo: NotificationCreateRo
}

export interface CliOfficeGMAPIApiApplyLabsFeatureRequest {
    /**
     *
     * @type GmApplyFeatureRo
     * @memberof CliOfficeGMAPIApiapplyLabsFeature
     */
    gmApplyFeatureRo: GmApplyFeatureRo
}

export interface CliOfficeGMAPIApiAssignActivityRequest {
    /**
     *
     * @type UserActivityAssignRo
     * @memberof CliOfficeGMAPIApiassignActivity
     */
    userActivityAssignRo: UserActivityAssignRo
}

export interface CliOfficeGMAPIApiCloseAccountDirectlyRequest {
    /**
     *
     * @type string
     * @memberof CliOfficeGMAPIApicloseAccountDirectly
     */
    uuid: string
}

export interface CliOfficeGMAPIApiConfigRequest {
    /**
     *
     * @type TemplateCenterConfigRo
     * @memberof CliOfficeGMAPIApiconfig
     */
    templateCenterConfigRo: TemplateCenterConfigRo
}

export interface CliOfficeGMAPIApiCreateLabsFeatureRequest {
    /**
     *
     * @type GmLabsFeatureCreatorRo
     * @memberof CliOfficeGMAPIApicreateLabsFeature
     */
    gmLabsFeatureCreatorRo: GmLabsFeatureCreatorRo
}

export interface CliOfficeGMAPIApiCreateUserRequest {
    /**
     *
     * @type HqAddUserRo
     * @memberof CliOfficeGMAPIApicreateUser
     */
    hqAddUserRo: HqAddUserRo
}

export interface CliOfficeGMAPIApiCreateUsersRequest {
}

export interface CliOfficeGMAPIApiDeductRequest {
    /**
     *
     * @type IntegralDeductRo
     * @memberof CliOfficeGMAPIApideduct
     */
    integralDeductRo: IntegralDeductRo
}

export interface CliOfficeGMAPIApiDeleteLabsFeatureRequest {
    /**
     * laboratory feature unique identifier
     * @type string
     * @memberof CliOfficeGMAPIApideleteLabsFeature
     */
    featureKey: string
}

export interface CliOfficeGMAPIApiEnableChatbotRequest {
    /**
     *
     * @type ChatbotEnableRo
     * @memberof CliOfficeGMAPIApienableChatbot
     */
    chatbotEnableRo: ChatbotEnableRo
}

export interface CliOfficeGMAPIApiFeishuTenantEventRequest {
    /**
     *
     * @type string
     * @memberof CliOfficeGMAPIApifeishuTenantEvent
     */
    tenantId: string
}

export interface CliOfficeGMAPIApiGet1Request {
    /**
     * User ID
     * @type number
     * @memberof CliOfficeGMAPIApiget1
     */
    userId?: number
    /**
     * Area Code
     * @type number
     * @memberof CliOfficeGMAPIApiget1
     */
    areaCode?: number
    /**
     * Account Credential（mobile or email）
     * @type string
     * @memberof CliOfficeGMAPIApiget1
     */
    credential?: string
}

export interface CliOfficeGMAPIApiLockRequest {
    /**
     *
     * @type UnlockRo
     * @memberof CliOfficeGMAPIApilock
     */
    unlockRo: UnlockRo
}

export interface CliOfficeGMAPIApiResetActivityRequest {
    /**
     *
     * @type UserActivityRo
     * @memberof CliOfficeGMAPIApiresetActivity
     */
    userActivityRo?: UserActivityRo
}

export interface CliOfficeGMAPIApiRevokePlayerNotifyRequest {
    /**
     *
     * @type NotificationRevokeRo
     * @memberof CliOfficeGMAPIApirevokePlayerNotify
     */
    notificationRevokeRo: NotificationRevokeRo
}

export interface CliOfficeGMAPIApiSyncDingTalkAppRequest {
    /**
     *
     * @type Array&lt;SyncSocialDingTalkAppRo&gt;
     * @memberof CliOfficeGMAPIApisyncDingTalkApp
     */
    syncSocialDingTalkAppRo: Array<SyncSocialDingTalkAppRo>
}

export interface CliOfficeGMAPIApiUnlockRequest {
    /**
     *
     * @type UnlockRo
     * @memberof CliOfficeGMAPIApiunlock
     */
    unlockRo: UnlockRo
}

export interface CliOfficeGMAPIApiUpdateLabsFeaturesAttributeRequest {
    /**
     *
     * @type GmLabsFeatureCreatorRo
     * @memberof CliOfficeGMAPIApiupdateLabsFeaturesAttribute
     */
    gmLabsFeatureCreatorRo: GmLabsFeatureCreatorRo
}

export interface CliOfficeGMAPIApiUpdatePermissionRequest {
    /**
     *
     * @type ConfigDatasheetRo
     * @memberof CliOfficeGMAPIApiupdatePermission
     */
    configDatasheetRo: ConfigDatasheetRo
}

export interface CliOfficeGMAPIApiUserContactInfoQueryRequest {
    /**
     *
     * @type QueryUserInfoRo
     * @memberof CliOfficeGMAPIApiuserContactInfoQuery
     */
    queryUserInfoRo: QueryUserInfoRo
}

export class ObjectCliOfficeGMAPIApi {
    private api: ObservableCliOfficeGMAPIApi

    public constructor(configuration: Configuration, requestFactory?: CliOfficeGMAPIApiRequestFactory, responseProcessor?: CliOfficeGMAPIApiResponseProcessor) {
        this.api = new ObservableCliOfficeGMAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Activity Integral Reward
     * @param param the request object
     */
    public activityRewardWithHttpInfo(param: CliOfficeGMAPIApiActivityRewardRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.activityRewardWithHttpInfo( options).toPromise();
    }

    /**
     * Activity Integral Reward
     * @param param the request object
     */
    public activityReward(param: CliOfficeGMAPIApiActivityRewardRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.activityReward( options).toPromise();
    }

    /**
     * Adding system notification.
     * Create a player notification
     * @param param the request object
     */
    public addPlayerNotifyWithHttpInfo(param: CliOfficeGMAPIApiAddPlayerNotifyRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.addPlayerNotifyWithHttpInfo(param.notificationCreateRo,  options).toPromise();
    }

    /**
     * Adding system notification.
     * Create a player notification
     * @param param the request object
     */
    public addPlayerNotify(param: CliOfficeGMAPIApiAddPlayerNotifyRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.addPlayerNotify(param.notificationCreateRo,  options).toPromise();
    }

    /**
     * Open laboratory feature for applicants
     * @param param the request object
     */
    public applyLabsFeatureWithHttpInfo(param: CliOfficeGMAPIApiApplyLabsFeatureRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.applyLabsFeatureWithHttpInfo(param.gmApplyFeatureRo,  options).toPromise();
    }

    /**
     * Open laboratory feature for applicants
     * @param param the request object
     */
    public applyLabsFeature(param: CliOfficeGMAPIApiApplyLabsFeatureRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.applyLabsFeature(param.gmApplyFeatureRo,  options).toPromise();
    }

    /**
     * Specifies the active state of the user
     * @param param the request object
     */
    public assignActivityWithHttpInfo(param: CliOfficeGMAPIApiAssignActivityRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.assignActivityWithHttpInfo(param.userActivityAssignRo,  options).toPromise();
    }

    /**
     * Specifies the active state of the user
     * @param param the request object
     */
    public assignActivity(param: CliOfficeGMAPIApiAssignActivityRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.assignActivity(param.userActivityAssignRo,  options).toPromise();
    }

    /**
     * Close paused account
     * @param param the request object
     */
    public closeAccountDirectlyWithHttpInfo(param: CliOfficeGMAPIApiCloseAccountDirectlyRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.closeAccountDirectlyWithHttpInfo(param.uuid,  options).toPromise();
    }

    /**
     * Close paused account
     * @param param the request object
     */
    public closeAccountDirectly(param: CliOfficeGMAPIApiCloseAccountDirectlyRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.closeAccountDirectly(param.uuid,  options).toPromise();
    }

    /**
     * Update Template Center Config
     * @param param the request object
     */
    public configWithHttpInfo(param: CliOfficeGMAPIApiConfigRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.configWithHttpInfo(param.templateCenterConfigRo,  options).toPromise();
    }

    /**
     * Update Template Center Config
     * @param param the request object
     */
    public config(param: CliOfficeGMAPIApiConfigRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.config(param.templateCenterConfigRo,  options).toPromise();
    }

    /**
     * Create laboratory feature
     * @param param the request object
     */
    public createLabsFeatureWithHttpInfo(param: CliOfficeGMAPIApiCreateLabsFeatureRequest, options?: Configuration): Promise<HttpInfo<ResponseDataGmLabFeatureVo>> {
        return this.api.createLabsFeatureWithHttpInfo(param.gmLabsFeatureCreatorRo,  options).toPromise();
    }

    /**
     * Create laboratory feature
     * @param param the request object
     */
    public createLabsFeature(param: CliOfficeGMAPIApiCreateLabsFeatureRequest, options?: Configuration): Promise<ResponseDataGmLabFeatureVo> {
        return this.api.createLabsFeature(param.gmLabsFeatureCreatorRo,  options).toPromise();
    }

    /**
     * create a user by username and password.
     * Create user(Irregular vest number, used for testing)
     * @param param the request object
     */
    public createUserWithHttpInfo(param: CliOfficeGMAPIApiCreateUserRequest, options?: Configuration): Promise<HttpInfo<ResponseDataHqAddUserVo>> {
        return this.api.createUserWithHttpInfo(param.hqAddUserRo,  options).toPromise();
    }

    /**
     * create a user by username and password.
     * Create user(Irregular vest number, used for testing)
     * @param param the request object
     */
    public createUser(param: CliOfficeGMAPIApiCreateUserRequest, options?: Configuration): Promise<ResponseDataHqAddUserVo> {
        return this.api.createUser(param.hqAddUserRo,  options).toPromise();
    }

    /**
     * Batch Create user(Irregular vest number, used for testing)
     * @param param the request object
     */
    public createUsersWithHttpInfo(param: CliOfficeGMAPIApiCreateUsersRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.createUsersWithHttpInfo( options).toPromise();
    }

    /**
     * Batch Create user(Irregular vest number, used for testing)
     * @param param the request object
     */
    public createUsers(param: CliOfficeGMAPIApiCreateUsersRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.createUsers( options).toPromise();
    }

    /**
     * Deduct User Integral
     * @param param the request object
     */
    public deductWithHttpInfo(param: CliOfficeGMAPIApiDeductRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deductWithHttpInfo(param.integralDeductRo,  options).toPromise();
    }

    /**
     * Deduct User Integral
     * @param param the request object
     */
    public deduct(param: CliOfficeGMAPIApiDeductRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deduct(param.integralDeductRo,  options).toPromise();
    }

    /**
     * Remove laboratory feature
     * @param param the request object
     */
    public deleteLabsFeatureWithHttpInfo(param: CliOfficeGMAPIApiDeleteLabsFeatureRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteLabsFeatureWithHttpInfo(param.featureKey,  options).toPromise();
    }

    /**
     * Remove laboratory feature
     * @param param the request object
     */
    public deleteLabsFeature(param: CliOfficeGMAPIApiDeleteLabsFeatureRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteLabsFeature(param.featureKey,  options).toPromise();
    }

    /**
     * Enable specified space chatbot feature
     * @param param the request object
     */
    public enableChatbotWithHttpInfo(param: CliOfficeGMAPIApiEnableChatbotRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.enableChatbotWithHttpInfo(param.chatbotEnableRo,  options).toPromise();
    }

    /**
     * Enable specified space chatbot feature
     * @param param the request object
     */
    public enableChatbot(param: CliOfficeGMAPIApiEnableChatbotRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.enableChatbot(param.chatbotEnableRo,  options).toPromise();
    }

    /**
     * Manually execute compensation of feishu event
     * @param param the request object
     */
    public feishuTenantEventWithHttpInfo(param: CliOfficeGMAPIApiFeishuTenantEventRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.feishuTenantEventWithHttpInfo(param.tenantId,  options).toPromise();
    }

    /**
     * Manually execute compensation of feishu event
     * @param param the request object
     */
    public feishuTenantEvent(param: CliOfficeGMAPIApiFeishuTenantEventRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.feishuTenantEvent(param.tenantId,  options).toPromise();
    }

    /**
     * Query User Integral
     * @param param the request object
     */
    public get1WithHttpInfo(param: CliOfficeGMAPIApiGet1Request = {}, options?: Configuration): Promise<HttpInfo<ResponseDataInteger>> {
        return this.api.get1WithHttpInfo(param.userId, param.areaCode, param.credential,  options).toPromise();
    }

    /**
     * Query User Integral
     * @param param the request object
     */
    public get1(param: CliOfficeGMAPIApiGet1Request = {}, options?: Configuration): Promise<ResponseDataInteger> {
        return this.api.get1(param.userId, param.areaCode, param.credential,  options).toPromise();
    }

    /**
     * Lock verification
     * @param param the request object
     */
    public lockWithHttpInfo(param: CliOfficeGMAPIApiLockRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.lockWithHttpInfo(param.unlockRo,  options).toPromise();
    }

    /**
     * Lock verification
     * @param param the request object
     */
    public lock(param: CliOfficeGMAPIApiLockRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.lock(param.unlockRo,  options).toPromise();
    }

    /**
     * Reset the active state of the user
     * @param param the request object
     */
    public resetActivityWithHttpInfo(param: CliOfficeGMAPIApiResetActivityRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.resetActivityWithHttpInfo(param.userActivityRo,  options).toPromise();
    }

    /**
     * Reset the active state of the user
     * @param param the request object
     */
    public resetActivity(param: CliOfficeGMAPIApiResetActivityRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.resetActivity(param.userActivityRo,  options).toPromise();
    }

    /**
     * Cancel a player notification, deleted from the notification center
     * Cancel a player notification
     * @param param the request object
     */
    public revokePlayerNotifyWithHttpInfo(param: CliOfficeGMAPIApiRevokePlayerNotifyRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.revokePlayerNotifyWithHttpInfo(param.notificationRevokeRo,  options).toPromise();
    }

    /**
     * Cancel a player notification, deleted from the notification center
     * Cancel a player notification
     * @param param the request object
     */
    public revokePlayerNotify(param: CliOfficeGMAPIApiRevokePlayerNotifyRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.revokePlayerNotify(param.notificationRevokeRo,  options).toPromise();
    }

    /**
     * create dingTalk app
     * @param param the request object
     */
    public syncDingTalkAppWithHttpInfo(param: CliOfficeGMAPIApiSyncDingTalkAppRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.syncDingTalkAppWithHttpInfo(param.syncSocialDingTalkAppRo,  options).toPromise();
    }

    /**
     * create dingTalk app
     * @param param the request object
     */
    public syncDingTalkApp(param: CliOfficeGMAPIApiSyncDingTalkAppRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.syncDingTalkApp(param.syncSocialDingTalkAppRo,  options).toPromise();
    }

    /**
     * Unlock verification
     * @param param the request object
     */
    public unlockWithHttpInfo(param: CliOfficeGMAPIApiUnlockRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.unlockWithHttpInfo(param.unlockRo,  options).toPromise();
    }

    /**
     * Unlock verification
     * @param param the request object
     */
    public unlock(param: CliOfficeGMAPIApiUnlockRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.unlock(param.unlockRo,  options).toPromise();
    }

    /**
     * Modify laboratory feature attribute
     * @param param the request object
     */
    public updateLabsFeaturesAttributeWithHttpInfo(param: CliOfficeGMAPIApiUpdateLabsFeaturesAttributeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateLabsFeaturesAttributeWithHttpInfo(param.gmLabsFeatureCreatorRo,  options).toPromise();
    }

    /**
     * Modify laboratory feature attribute
     * @param param the request object
     */
    public updateLabsFeaturesAttribute(param: CliOfficeGMAPIApiUpdateLabsFeaturesAttributeRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateLabsFeaturesAttribute(param.gmLabsFeatureCreatorRo,  options).toPromise();
    }

    /**
     * Update GM permission config
     * @param param the request object
     */
    public updatePermissionWithHttpInfo(param: CliOfficeGMAPIApiUpdatePermissionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updatePermissionWithHttpInfo(param.configDatasheetRo,  options).toPromise();
    }

    /**
     * Update GM permission config
     * @param param the request object
     */
    public updatePermission(param: CliOfficeGMAPIApiUpdatePermissionRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updatePermission(param.configDatasheetRo,  options).toPromise();
    }

    /**
     * query user\'s mobile phone and email by user\'s id
     * @param param the request object
     */
    public userContactInfoQueryWithHttpInfo(param: CliOfficeGMAPIApiUserContactInfoQueryRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.userContactInfoQueryWithHttpInfo(param.queryUserInfoRo,  options).toPromise();
    }

    /**
     * query user\'s mobile phone and email by user\'s id
     * @param param the request object
     */
    public userContactInfoQuery(param: CliOfficeGMAPIApiUserContactInfoQueryRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.userContactInfoQuery(param.queryUserInfoRo,  options).toPromise();
    }

}

import { ObservableClientInterfaceApi } from "./ObservableAPI";
import { ClientInterfaceApiRequestFactory, ClientInterfaceApiResponseProcessor} from "../apis/ClientInterfaceApi";

export interface ClientInterfaceApiGetTemplateInfoRequest {
    /**
     *
     * @type string
     * @memberof ClientInterfaceApigetTemplateInfo
     */
    spaceId?: string
    /**
     * Construction serial number
     * @type string
     * @memberof ClientInterfaceApigetTemplateInfo
     */
    pipeline?: string
}

export class ObjectClientInterfaceApi {
    private api: ObservableClientInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: ClientInterfaceApiRequestFactory, responseProcessor?: ClientInterfaceApiResponseProcessor) {
        this.api = new ObservableClientInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get the application client version rendering information
     * Get application version information
     * @param param the request object
     */
    public getTemplateInfoWithHttpInfo(param: ClientInterfaceApiGetTemplateInfoRequest = {}, options?: Configuration): Promise<HttpInfo<ClientInfoVO>> {
        return this.api.getTemplateInfoWithHttpInfo(param.spaceId, param.pipeline,  options).toPromise();
    }

    /**
     * Get the application client version rendering information
     * Get application version information
     * @param param the request object
     */
    public getTemplateInfo(param: ClientInterfaceApiGetTemplateInfoRequest = {}, options?: Configuration): Promise<ClientInfoVO> {
        return this.api.getTemplateInfo(param.spaceId, param.pipeline,  options).toPromise();
    }

}

import { ObservableConfigurationRelatedInterfacesApi } from "./ObservableAPI";
import { ConfigurationRelatedInterfacesApiRequestFactory, ConfigurationRelatedInterfacesApiResponseProcessor} from "../apis/ConfigurationRelatedInterfacesApi";

export interface ConfigurationRelatedInterfacesApiGeneralRequest {
    /**
     *
     * @type ConfigRo
     * @memberof ConfigurationRelatedInterfacesApigeneral
     */
    configRo: ConfigRo
}

export interface ConfigurationRelatedInterfacesApiGet2Request {
    /**
     * language
     * @type string
     * @memberof ConfigurationRelatedInterfacesApiget2
     */
    lang?: string
}

export class ObjectConfigurationRelatedInterfacesApi {
    private api: ObservableConfigurationRelatedInterfacesApi

    public constructor(configuration: Configuration, requestFactory?: ConfigurationRelatedInterfacesApiRequestFactory, responseProcessor?: ConfigurationRelatedInterfacesApiResponseProcessor) {
        this.api = new ObservableConfigurationRelatedInterfacesApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Scenario: novice guidance, announcement
     * General configuration
     * @param param the request object
     */
    public generalWithHttpInfo(param: ConfigurationRelatedInterfacesApiGeneralRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.generalWithHttpInfo(param.configRo,  options).toPromise();
    }

    /**
     * Scenario: novice guidance, announcement
     * General configuration
     * @param param the request object
     */
    public general(param: ConfigurationRelatedInterfacesApiGeneralRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.general(param.configRo,  options).toPromise();
    }

    /**
     * Get configuration information
     * @param param the request object
     */
    public get2WithHttpInfo(param: ConfigurationRelatedInterfacesApiGet2Request = {}, options?: Configuration): Promise<HttpInfo<ResponseDataObject>> {
        return this.api.get2WithHttpInfo(param.lang,  options).toPromise();
    }

    /**
     * Get configuration information
     * @param param the request object
     */
    public get2(param: ConfigurationRelatedInterfacesApiGet2Request = {}, options?: Configuration): Promise<ResponseDataObject> {
        return this.api.get2(param.lang,  options).toPromise();
    }

}

import { ObservableContactMemberApiApi } from "./ObservableAPI";
import { ContactMemberApiApiRequestFactory, ContactMemberApiApiResponseProcessor} from "../apis/ContactMemberApiApi";

export interface ContactMemberApiApiAddMemberRequest {
    /**
     *
     * @type TeamAddMemberRo
     * @memberof ContactMemberApiApiaddMember
     */
    teamAddMemberRo: TeamAddMemberRo
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApiaddMember
     */
    xSpaceId: string
}

export interface ContactMemberApiApiCheckEmailInSpaceRequest {
    /**
     * email
     * @type string
     * @memberof ContactMemberApiApicheckEmailInSpace
     */
    email: string
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApicheckEmailInSpace
     */
    xSpaceId: string
}

export interface ContactMemberApiApiDeleteBatchMemberRequest {
    /**
     *
     * @type DeleteBatchMemberRo
     * @memberof ContactMemberApiApideleteBatchMember
     */
    deleteBatchMemberRo: DeleteBatchMemberRo
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApideleteBatchMember
     */
    xSpaceId: string
}

export interface ContactMemberApiApiDeleteMemberRequest {
    /**
     *
     * @type DeleteMemberRo
     * @memberof ContactMemberApiApideleteMember
     */
    deleteMemberRo: DeleteMemberRo
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApideleteMember
     */
    xSpaceId: string
}

export interface ContactMemberApiApiDownloadTemplateRequest {
}

export interface ContactMemberApiApiGetMemberListRequest {
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApigetMemberList
     */
    xSpaceId: string
    /**
     * team id. if root team can lack teamId, teamId default 0.
     * @type string
     * @memberof ContactMemberApiApigetMemberList
     */
    teamId?: string
}

export interface ContactMemberApiApiGetMembersRequest {
    /**
     * keyword
     * @type string
     * @memberof ContactMemberApiApigetMembers
     */
    keyword: string
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApigetMembers
     */
    xSpaceId: string
    /**
     * whether to filter unadded members
     * @type boolean
     * @memberof ContactMemberApiApigetMembers
     */
    filter?: boolean
    /**
     * the highlighting style
     * @type string
     * @memberof ContactMemberApiApigetMembers
     */
    className?: string
}

export interface ContactMemberApiApiGetUnitsRequest {
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApigetUnits
     */
    xSpaceId: string
}

export interface ContactMemberApiApiInviteMemberRequest {
    /**
     *
     * @type InviteRo
     * @memberof ContactMemberApiApiinviteMember
     */
    inviteRo: InviteRo
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApiinviteMember
     */
    xSpaceId: string
}

export interface ContactMemberApiApiInviteMemberSingleRequest {
    /**
     *
     * @type InviteMemberAgainRo
     * @memberof ContactMemberApiApiinviteMemberSingle
     */
    inviteMemberAgainRo: InviteMemberAgainRo
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApiinviteMemberSingle
     */
    xSpaceId: string
}

export interface ContactMemberApiApiRead1Request {
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApiread1
     */
    xSpaceId: string
    /**
     * member id
     * @type string
     * @memberof ContactMemberApiApiread1
     */
    memberId?: string
    /**
     * user uuid
     * @type string
     * @memberof ContactMemberApiApiread1
     */
    uuid?: string
}

export interface ContactMemberApiApiReadPageRequest {
    /**
     *
     * @type Page
     * @memberof ContactMemberApiApireadPage
     */
    page: Page
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApireadPage
     */
    xSpaceId: string
    /**
     * page\&#39;s parameter
     * @type string
     * @memberof ContactMemberApiApireadPage
     */
    pageObjectParams: string
    /**
     * team id. if root team can lack teamId, teamId default 0.
     * @type string
     * @memberof ContactMemberApiApireadPage
     */
    teamId?: string
    /**
     * whether to filter unadded members
     * @type string
     * @memberof ContactMemberApiApireadPage
     */
    isActive?: string
}

export interface ContactMemberApiApiUpdate4Request {
    /**
     *
     * @type UpdateMemberOpRo
     * @memberof ContactMemberApiApiupdate4
     */
    updateMemberOpRo: UpdateMemberOpRo
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApiupdate4
     */
    xSpaceId: string
}

export interface ContactMemberApiApiUpdateInfoRequest {
    /**
     *
     * @type UpdateMemberRo
     * @memberof ContactMemberApiApiupdateInfo
     */
    updateMemberRo: UpdateMemberRo
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApiupdateInfo
     */
    xSpaceId: string
}

export interface ContactMemberApiApiUpdateTeam1Request {
    /**
     *
     * @type UpdateMemberTeamRo
     * @memberof ContactMemberApiApiupdateTeam1
     */
    updateMemberTeamRo: UpdateMemberTeamRo
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApiupdateTeam1
     */
    xSpaceId: string
}

export interface ContactMemberApiApiUploadExcelRequest {
    /**
     *
     * @type UploadMemberTemplateRo
     * @memberof ContactMemberApiApiuploadExcel
     */
    data: UploadMemberTemplateRo
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApiuploadExcel
     */
    xSpaceId: string
}

export class ObjectContactMemberApiApi {
    private api: ObservableContactMemberApiApi

    public constructor(configuration: Configuration, requestFactory?: ContactMemberApiApiRequestFactory, responseProcessor?: ContactMemberApiApiResponseProcessor) {
        this.api = new ObservableContactMemberApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * When adding new members, they can only be selected from within the organization structure and can be transferred by department
     * Add member
     * @param param the request object
     */
    public addMemberWithHttpInfo(param: ContactMemberApiApiAddMemberRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.addMemberWithHttpInfo(param.teamAddMemberRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * When adding new members, they can only be selected from within the organization structure and can be transferred by department
     * Add member
     * @param param the request object
     */
    public addMember(param: ContactMemberApiApiAddMemberRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.addMember(param.teamAddMemberRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Check whether email in space
     * Check whether email in space
     * @param param the request object
     */
    public checkEmailInSpaceWithHttpInfo(param: ContactMemberApiApiCheckEmailInSpaceRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        return this.api.checkEmailInSpaceWithHttpInfo(param.email, param.xSpaceId,  options).toPromise();
    }

    /**
     * Check whether email in space
     * Check whether email in space
     * @param param the request object
     */
    public checkEmailInSpace(param: ContactMemberApiApiCheckEmailInSpaceRequest, options?: Configuration): Promise<ResponseDataBoolean> {
        return this.api.checkEmailInSpace(param.email, param.xSpaceId,  options).toPromise();
    }

    /**
     * action provides two deletion modes，1.delete from organization 2. delete from team
     * Delete members
     * @param param the request object
     */
    public deleteBatchMemberWithHttpInfo(param: ContactMemberApiApiDeleteBatchMemberRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteBatchMemberWithHttpInfo(param.deleteBatchMemberRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * action provides two deletion modes，1.delete from organization 2. delete from team
     * Delete members
     * @param param the request object
     */
    public deleteBatchMember(param: ContactMemberApiApiDeleteBatchMemberRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteBatchMember(param.deleteBatchMemberRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * action provides two deletion modes.1.delete from organization 2. delete from team
     * Delete a Member
     * @param param the request object
     */
    public deleteMemberWithHttpInfo(param: ContactMemberApiApiDeleteMemberRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteMemberWithHttpInfo(param.deleteMemberRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * action provides two deletion modes.1.delete from organization 2. delete from team
     * Delete a Member
     * @param param the request object
     */
    public deleteMember(param: ContactMemberApiApiDeleteMemberRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteMember(param.deleteMemberRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Download contact template
     * Download contact template
     * @param param the request object
     */
    public downloadTemplateWithHttpInfo(param: ContactMemberApiApiDownloadTemplateRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.downloadTemplateWithHttpInfo( options).toPromise();
    }

    /**
     * Download contact template
     * Download contact template
     * @param param the request object
     */
    public downloadTemplate(param: ContactMemberApiApiDownloadTemplateRequest = {}, options?: Configuration): Promise<void> {
        return this.api.downloadTemplate( options).toPromise();
    }

    /**
     * Query all the members of the department, including the members of the sub department.if root team can lack teamId, teamId default 0.
     * Query the team\'s members
     * @param param the request object
     */
    public getMemberListWithHttpInfo(param: ContactMemberApiApiGetMemberListRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListMemberInfoVo>> {
        return this.api.getMemberListWithHttpInfo(param.xSpaceId, param.teamId,  options).toPromise();
    }

    /**
     * Query all the members of the department, including the members of the sub department.if root team can lack teamId, teamId default 0.
     * Query the team\'s members
     * @param param the request object
     */
    public getMemberList(param: ContactMemberApiApiGetMemberListRequest, options?: Configuration): Promise<ResponseDataListMemberInfoVo> {
        return this.api.getMemberList(param.xSpaceId, param.teamId,  options).toPromise();
    }

    /**
     * Fuzzy Search Members
     * Fuzzy Search Members
     * @param param the request object
     */
    public getMembersWithHttpInfo(param: ContactMemberApiApiGetMembersRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListSearchMemberVo>> {
        return this.api.getMembersWithHttpInfo(param.keyword, param.xSpaceId, param.filter, param.className,  options).toPromise();
    }

    /**
     * Fuzzy Search Members
     * Fuzzy Search Members
     * @param param the request object
     */
    public getMembers(param: ContactMemberApiApiGetMembersRequest, options?: Configuration): Promise<ResponseDataListSearchMemberVo> {
        return this.api.getMembers(param.keyword, param.xSpaceId, param.filter, param.className,  options).toPromise();
    }

    /**
     * Query the units which a user belongs, include self
     * Query the units which a user belongs in space
     * @param param the request object
     */
    public getUnitsWithHttpInfo(param: ContactMemberApiApiGetUnitsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataMemberUnitsVo>> {
        return this.api.getUnitsWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Query the units which a user belongs, include self
     * Query the units which a user belongs in space
     * @param param the request object
     */
    public getUnits(param: ContactMemberApiApiGetUnitsRequest, options?: Configuration): Promise<ResponseDataMemberUnitsVo> {
        return this.api.getUnits(param.xSpaceId,  options).toPromise();
    }

    /**
     * Send an email to invite. The email is automatically bound to the platform user. The invited member will be in the state to be activated, and will not take effect until the user self activates.
     * Send an email to invite members
     * @param param the request object
     */
    public inviteMemberWithHttpInfo(param: ContactMemberApiApiInviteMemberRequest, options?: Configuration): Promise<HttpInfo<ResponseDataMemberUnitsVo>> {
        return this.api.inviteMemberWithHttpInfo(param.inviteRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Send an email to invite. The email is automatically bound to the platform user. The invited member will be in the state to be activated, and will not take effect until the user self activates.
     * Send an email to invite members
     * @param param the request object
     */
    public inviteMember(param: ContactMemberApiApiInviteMemberRequest, options?: Configuration): Promise<ResponseDataMemberUnitsVo> {
        return this.api.inviteMember(param.inviteRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * If a member is not activated, it can send an invitation again regardless of whether the invitation has expired. After the invitation is successfully sent, the invitation link sent last time will be invalid.
     * Again send an email to invite members
     * @param param the request object
     */
    public inviteMemberSingleWithHttpInfo(param: ContactMemberApiApiInviteMemberSingleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.inviteMemberSingleWithHttpInfo(param.inviteMemberAgainRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * If a member is not activated, it can send an invitation again regardless of whether the invitation has expired. After the invitation is successfully sent, the invitation link sent last time will be invalid.
     * Again send an email to invite members
     * @param param the request object
     */
    public inviteMemberSingle(param: ContactMemberApiApiInviteMemberSingleRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.inviteMemberSingle(param.inviteMemberAgainRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Get member\'s detail info
     * Get member\'s detail info
     * @param param the request object
     */
    public read1WithHttpInfo(param: ContactMemberApiApiRead1Request, options?: Configuration): Promise<HttpInfo<ResponseDataMemberInfoVo>> {
        return this.api.read1WithHttpInfo(param.xSpaceId, param.memberId, param.uuid,  options).toPromise();
    }

    /**
     * Get member\'s detail info
     * Get member\'s detail info
     * @param param the request object
     */
    public read1(param: ContactMemberApiApiRead1Request, options?: Configuration): Promise<ResponseDataMemberInfoVo> {
        return this.api.read1(param.xSpaceId, param.memberId, param.uuid,  options).toPromise();
    }

    /**
     * Query all the members of the department,  including the members of the sub department. The query must be paging not full query. Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page query the team\'s member
     * @param param the request object
     */
    public readPageWithHttpInfo(param: ContactMemberApiApiReadPageRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoMemberPageVo>> {
        return this.api.readPageWithHttpInfo(param.page, param.xSpaceId, param.pageObjectParams, param.teamId, param.isActive,  options).toPromise();
    }

    /**
     * Query all the members of the department,  including the members of the sub department. The query must be paging not full query. Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page query the team\'s member
     * @param param the request object
     */
    public readPage(param: ContactMemberApiApiReadPageRequest, options?: Configuration): Promise<ResponseDataPageInfoMemberPageVo> {
        return this.api.readPage(param.page, param.xSpaceId, param.pageObjectParams, param.teamId, param.isActive,  options).toPromise();
    }

    /**
     * Edit self member information
     * Edit self member information
     * @param param the request object
     */
    public update4WithHttpInfo(param: ContactMemberApiApiUpdate4Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.update4WithHttpInfo(param.updateMemberOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Edit self member information
     * Edit self member information
     * @param param the request object
     */
    public update4(param: ContactMemberApiApiUpdate4Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.update4(param.updateMemberOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Edit member info
     * Edit member info
     * @param param the request object
     */
    public updateInfoWithHttpInfo(param: ContactMemberApiApiUpdateInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateInfoWithHttpInfo(param.updateMemberRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Edit member info
     * Edit member info
     * @param param the request object
     */
    public updateInfo(param: ContactMemberApiApiUpdateInfoRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateInfo(param.updateMemberRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * assign members to departments
     * Update team
     * @param param the request object
     */
    public updateTeam1WithHttpInfo(param: ContactMemberApiApiUpdateTeam1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateTeam1WithHttpInfo(param.updateMemberTeamRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * assign members to departments
     * Update team
     * @param param the request object
     */
    public updateTeam1(param: ContactMemberApiApiUpdateTeam1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateTeam1(param.updateMemberTeamRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Upload employee sheet，then parse it.
     * Upload employee sheet
     * @param param the request object
     */
    public uploadExcelWithHttpInfo(param: ContactMemberApiApiUploadExcelRequest, options?: Configuration): Promise<HttpInfo<ResponseDataUploadParseResultVO>> {
        return this.api.uploadExcelWithHttpInfo(param.data, param.xSpaceId,  options).toPromise();
    }

    /**
     * Upload employee sheet，then parse it.
     * Upload employee sheet
     * @param param the request object
     */
    public uploadExcel(param: ContactMemberApiApiUploadExcelRequest, options?: Configuration): Promise<ResponseDataUploadParseResultVO> {
        return this.api.uploadExcel(param.data, param.xSpaceId,  options).toPromise();
    }

}

import { ObservableContactOrganizationApiApi } from "./ObservableAPI";
import { ContactOrganizationApiApiRequestFactory, ContactOrganizationApiApiResponseProcessor} from "../apis/ContactOrganizationApiApi";

export interface ContactOrganizationApiApiGetSubUnitListRequest {
    /**
     * team id
     * @type string
     * @memberof ContactOrganizationApiApigetSubUnitList
     */
    teamId?: string
    /**
     * link id: node share id | template id
     * @type string
     * @memberof ContactOrganizationApiApigetSubUnitList
     */
    linkId?: string
    /**
     * space id
     * @type string
     * @memberof ContactOrganizationApiApigetSubUnitList
     */
    xSpaceId?: string
}

export interface ContactOrganizationApiApiLoadOrSearchRequest {
    /**
     *
     * @type LoadSearchDTO
     * @memberof ContactOrganizationApiApiloadOrSearch
     */
    params: LoadSearchDTO
    /**
     * space id
     * @type string
     * @memberof ContactOrganizationApiApiloadOrSearch
     */
    xSpaceId?: string
    /**
     * link id: node share id | template id
     * @type string
     * @memberof ContactOrganizationApiApiloadOrSearch
     */
    linkId?: string
    /**
     * keyword
     * @type string
     * @memberof ContactOrganizationApiApiloadOrSearch
     */
    keyword?: string
    /**
     * unitIds
     * @type string
     * @memberof ContactOrganizationApiApiloadOrSearch
     */
    unitIds?: string
    /**
     * specifies the organizational unit to filter
     * @type string
     * @memberof ContactOrganizationApiApiloadOrSearch
     */
    filterIds?: string
    /**
     * whether to load all departments and members
     * @type boolean
     * @memberof ContactOrganizationApiApiloadOrSearch
     */
    all?: boolean
    /**
     * whether to search for emails
     * @type boolean
     * @memberof ContactOrganizationApiApiloadOrSearch
     */
    searchEmail?: boolean
}

export interface ContactOrganizationApiApiSearchRequest {
    /**
     * keyword
     * @type string
     * @memberof ContactOrganizationApiApisearch
     */
    keyword: string
    /**
     * link id: node share id | template id
     * @type string
     * @memberof ContactOrganizationApiApisearch
     */
    linkId?: string
    /**
     * the highlight style
     * @type string
     * @memberof ContactOrganizationApiApisearch
     */
    className?: string
    /**
     * space id
     * @type string
     * @memberof ContactOrganizationApiApisearch
     */
    xSpaceId?: string
}

export interface ContactOrganizationApiApiSearchSubTeamAndMembersRequest {
    /**
     * keyword
     * @type string
     * @memberof ContactOrganizationApiApisearchSubTeamAndMembers
     */
    keyword: string
    /**
     * space id
     * @type string
     * @memberof ContactOrganizationApiApisearchSubTeamAndMembers
     */
    xSpaceId: string
    /**
     * the highlight style
     * @type string
     * @memberof ContactOrganizationApiApisearchSubTeamAndMembers
     */
    className?: string
}

export interface ContactOrganizationApiApiSearchTeamInfoRequest {
    /**
     * keyword
     * @type string
     * @memberof ContactOrganizationApiApisearchTeamInfo
     */
    keyword: string
    /**
     * space id
     * @type string
     * @memberof ContactOrganizationApiApisearchTeamInfo
     */
    xSpaceId: string
    /**
     * the highlight style
     * @type string
     * @memberof ContactOrganizationApiApisearchTeamInfo
     */
    className?: string
}

export interface ContactOrganizationApiApiSearchUnitInfoVoRequest {
    /**
     *
     * @type SearchUnitRo
     * @memberof ContactOrganizationApiApisearchUnitInfoVo
     */
    searchUnitRo: SearchUnitRo
    /**
     * space id
     * @type string
     * @memberof ContactOrganizationApiApisearchUnitInfoVo
     */
    xSpaceId?: string
}

export class ObjectContactOrganizationApiApi {
    private api: ObservableContactOrganizationApiApi

    public constructor(configuration: Configuration, requestFactory?: ContactOrganizationApiApiRequestFactory, responseProcessor?: ContactOrganizationApiApiResponseProcessor) {
        this.api = new ObservableContactOrganizationApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Query the sub departments and members of department. if team id lack, default is 0
     * Query the sub departments and members of department
     * @param param the request object
     */
    public getSubUnitListWithHttpInfo(param: ContactOrganizationApiApiGetSubUnitListRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataSubUnitResultVo>> {
        return this.api.getSubUnitListWithHttpInfo(param.teamId, param.linkId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Query the sub departments and members of department. if team id lack, default is 0
     * Query the sub departments and members of department
     * @param param the request object
     */
    public getSubUnitList(param: ContactOrganizationApiApiGetSubUnitListRequest = {}, options?: Configuration): Promise<ResponseDataSubUnitResultVo> {
        return this.api.getSubUnitList(param.teamId, param.linkId, param.xSpaceId,  options).toPromise();
    }

    /**
     * The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10
     * Load/search departments and members
     * @param param the request object
     */
    public loadOrSearchWithHttpInfo(param: ContactOrganizationApiApiLoadOrSearchRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListUnitInfoVo>> {
        return this.api.loadOrSearchWithHttpInfo(param.params, param.xSpaceId, param.linkId, param.keyword, param.unitIds, param.filterIds, param.all, param.searchEmail,  options).toPromise();
    }

    /**
     * The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10
     * Load/search departments and members
     * @param param the request object
     */
    public loadOrSearch(param: ContactOrganizationApiApiLoadOrSearchRequest, options?: Configuration): Promise<ResponseDataListUnitInfoVo> {
        return this.api.loadOrSearch(param.params, param.xSpaceId, param.linkId, param.keyword, param.unitIds, param.filterIds, param.all, param.searchEmail,  options).toPromise();
    }

    /**
     * Provide input word fuzzy search organization resources
     * search organization resources
     * @param param the request object
     */
    public searchWithHttpInfo(param: ContactOrganizationApiApiSearchRequest, options?: Configuration): Promise<HttpInfo<ResponseDataUnitSearchResultVo>> {
        return this.api.searchWithHttpInfo(param.keyword, param.linkId, param.className, param.xSpaceId,  options).toPromise();
    }

    /**
     * Provide input word fuzzy search organization resources
     * search organization resources
     * @param param the request object
     */
    public search(param: ContactOrganizationApiApiSearchRequest, options?: Configuration): Promise<ResponseDataUnitSearchResultVo> {
        return this.api.search(param.keyword, param.linkId, param.className, param.xSpaceId,  options).toPromise();
    }

    /**
     * fuzzy search unit
     * Search departments or members（it will be abandoned）
     * @param param the request object
     */
    public searchSubTeamAndMembersWithHttpInfo(param: ContactOrganizationApiApiSearchSubTeamAndMembersRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListOrganizationUnitVo>> {
        return this.api.searchSubTeamAndMembersWithHttpInfo(param.keyword, param.xSpaceId, param.className,  options).toPromise();
    }

    /**
     * fuzzy search unit
     * Search departments or members（it will be abandoned）
     * @param param the request object
     */
    public searchSubTeamAndMembers(param: ContactOrganizationApiApiSearchSubTeamAndMembersRequest, options?: Configuration): Promise<ResponseDataListOrganizationUnitVo> {
        return this.api.searchSubTeamAndMembers(param.keyword, param.xSpaceId, param.className,  options).toPromise();
    }

    /**
     * fuzzy search department or members
     * Global search
     * @param param the request object
     */
    public searchTeamInfoWithHttpInfo(param: ContactOrganizationApiApiSearchTeamInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataSearchResultVo>> {
        return this.api.searchTeamInfoWithHttpInfo(param.keyword, param.xSpaceId, param.className,  options).toPromise();
    }

    /**
     * fuzzy search department or members
     * Global search
     * @param param the request object
     */
    public searchTeamInfo(param: ContactOrganizationApiApiSearchTeamInfoRequest, options?: Configuration): Promise<ResponseDataSearchResultVo> {
        return this.api.searchTeamInfo(param.keyword, param.xSpaceId, param.className,  options).toPromise();
    }

    /**
     * scenario field conversion（If the amount of data is large, the content requested by GET will exceed the limit.）
     * accurately query departments and members
     * @param param the request object
     */
    public searchUnitInfoVoWithHttpInfo(param: ContactOrganizationApiApiSearchUnitInfoVoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListUnitInfoVo>> {
        return this.api.searchUnitInfoVoWithHttpInfo(param.searchUnitRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * scenario field conversion（If the amount of data is large, the content requested by GET will exceed the limit.）
     * accurately query departments and members
     * @param param the request object
     */
    public searchUnitInfoVo(param: ContactOrganizationApiApiSearchUnitInfoVoRequest, options?: Configuration): Promise<ResponseDataListUnitInfoVo> {
        return this.api.searchUnitInfoVo(param.searchUnitRo, param.xSpaceId,  options).toPromise();
    }

}

import { ObservableContactsRoleApiApi } from "./ObservableAPI";
import { ContactsRoleApiApiRequestFactory, ContactsRoleApiApiResponseProcessor} from "../apis/ContactsRoleApiApi";

export interface ContactsRoleApiApiAddRoleMembersRequest {
    /**
     *
     * @type AddRoleMemberRo
     * @memberof ContactsRoleApiApiaddRoleMembers
     */
    addRoleMemberRo: AddRoleMemberRo
    /**
     *
     * @type number
     * @memberof ContactsRoleApiApiaddRoleMembers
     */
    roleId: number
    /**
     * space id
     * @type string
     * @memberof ContactsRoleApiApiaddRoleMembers
     */
    xSpaceId: string
    /**
     *
     * @type string
     * @memberof ContactsRoleApiApiaddRoleMembers
     */
    roleId2: string
}

export interface ContactsRoleApiApiCreateRoleRequest {
    /**
     *
     * @type CreateRoleRo
     * @memberof ContactsRoleApiApicreateRole
     */
    createRoleRo: CreateRoleRo
    /**
     * space id
     * @type string
     * @memberof ContactsRoleApiApicreateRole
     */
    xSpaceId: string
}

export interface ContactsRoleApiApiDeleteRole1Request {
    /**
     *
     * @type number
     * @memberof ContactsRoleApiApideleteRole1
     */
    roleId: number
    /**
     * space id
     * @type string
     * @memberof ContactsRoleApiApideleteRole1
     */
    xSpaceId: string
    /**
     *
     * @type string
     * @memberof ContactsRoleApiApideleteRole1
     */
    roleId2: string
}

export interface ContactsRoleApiApiGetRoleMembersRequest {
    /**
     *
     * @type number
     * @memberof ContactsRoleApiApigetRoleMembers
     */
    roleId: number
    /**
     *
     * @type PageVoid
     * @memberof ContactsRoleApiApigetRoleMembers
     */
    page: PageVoid
    /**
     * space id
     * @type string
     * @memberof ContactsRoleApiApigetRoleMembers
     */
    xSpaceId: string
    /**
     *
     * @type string
     * @memberof ContactsRoleApiApigetRoleMembers
     */
    roleId2: string
    /**
     * page parameters
     * @type string
     * @memberof ContactsRoleApiApigetRoleMembers
     */
    pageObjectParams: string
}

export interface ContactsRoleApiApiGetRolesRequest {
    /**
     * space id
     * @type string
     * @memberof ContactsRoleApiApigetRoles
     */
    xSpaceId: string
}

export interface ContactsRoleApiApiInitRolesRequest {
    /**
     * space id
     * @type string
     * @memberof ContactsRoleApiApiinitRoles
     */
    xSpaceId: string
}

export interface ContactsRoleApiApiRemoveRoleMembersRequest {
    /**
     *
     * @type DeleteRoleMemberRo
     * @memberof ContactsRoleApiApiremoveRoleMembers
     */
    deleteRoleMemberRo: DeleteRoleMemberRo
    /**
     *
     * @type number
     * @memberof ContactsRoleApiApiremoveRoleMembers
     */
    roleId: number
    /**
     * space id
     * @type string
     * @memberof ContactsRoleApiApiremoveRoleMembers
     */
    xSpaceId: string
    /**
     *
     * @type string
     * @memberof ContactsRoleApiApiremoveRoleMembers
     */
    roleId2: string
}

export interface ContactsRoleApiApiUpdateRoleRequest {
    /**
     *
     * @type UpdateRoleRo
     * @memberof ContactsRoleApiApiupdateRole
     */
    updateRoleRo: UpdateRoleRo
    /**
     *
     * @type number
     * @memberof ContactsRoleApiApiupdateRole
     */
    roleId: number
    /**
     * space id
     * @type string
     * @memberof ContactsRoleApiApiupdateRole
     */
    xSpaceId: string
    /**
     *
     * @type string
     * @memberof ContactsRoleApiApiupdateRole
     */
    roleId2: string
}

export class ObjectContactsRoleApiApi {
    private api: ObservableContactsRoleApiApi

    public constructor(configuration: Configuration, requestFactory?: ContactsRoleApiApiRequestFactory, responseProcessor?: ContactsRoleApiApiResponseProcessor) {
        this.api = new ObservableContactsRoleApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * add role members
     * add role members
     * @param param the request object
     */
    public addRoleMembersWithHttpInfo(param: ContactsRoleApiApiAddRoleMembersRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.addRoleMembersWithHttpInfo(param.addRoleMemberRo, param.roleId, param.xSpaceId, param.roleId2,  options).toPromise();
    }

    /**
     * add role members
     * add role members
     * @param param the request object
     */
    public addRoleMembers(param: ContactsRoleApiApiAddRoleMembersRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.addRoleMembers(param.addRoleMemberRo, param.roleId, param.xSpaceId, param.roleId2,  options).toPromise();
    }

    /**
     * create new role
     * create new role
     * @param param the request object
     */
    public createRoleWithHttpInfo(param: ContactsRoleApiApiCreateRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.createRoleWithHttpInfo(param.createRoleRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * create new role
     * create new role
     * @param param the request object
     */
    public createRole(param: ContactsRoleApiApiCreateRoleRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.createRole(param.createRoleRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * delete role
     * delete role
     * @param param the request object
     */
    public deleteRole1WithHttpInfo(param: ContactsRoleApiApiDeleteRole1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteRole1WithHttpInfo(param.roleId, param.xSpaceId, param.roleId2,  options).toPromise();
    }

    /**
     * delete role
     * delete role
     * @param param the request object
     */
    public deleteRole1(param: ContactsRoleApiApiDeleteRole1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteRole1(param.roleId, param.xSpaceId, param.roleId2,  options).toPromise();
    }

    /**
     * query the role\'s members
     * query role members
     * @param param the request object
     */
    public getRoleMembersWithHttpInfo(param: ContactsRoleApiApiGetRoleMembersRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoRoleMemberVo>> {
        return this.api.getRoleMembersWithHttpInfo(param.roleId, param.page, param.xSpaceId, param.roleId2, param.pageObjectParams,  options).toPromise();
    }

    /**
     * query the role\'s members
     * query role members
     * @param param the request object
     */
    public getRoleMembers(param: ContactsRoleApiApiGetRoleMembersRequest, options?: Configuration): Promise<ResponseDataPageInfoRoleMemberVo> {
        return this.api.getRoleMembers(param.roleId, param.page, param.xSpaceId, param.roleId2, param.pageObjectParams,  options).toPromise();
    }

    /**
     * query the space\'s roles
     * query roles
     * @param param the request object
     */
    public getRolesWithHttpInfo(param: ContactsRoleApiApiGetRolesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListRoleInfoVo>> {
        return this.api.getRolesWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * query the space\'s roles
     * query roles
     * @param param the request object
     */
    public getRoles(param: ContactsRoleApiApiGetRolesRequest, options?: Configuration): Promise<ResponseDataListRoleInfoVo> {
        return this.api.getRoles(param.xSpaceId,  options).toPromise();
    }

    /**
     * create init role
     * create init role
     * @param param the request object
     */
    public initRolesWithHttpInfo(param: ContactsRoleApiApiInitRolesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.initRolesWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * create init role
     * create init role
     * @param param the request object
     */
    public initRoles(param: ContactsRoleApiApiInitRolesRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.initRoles(param.xSpaceId,  options).toPromise();
    }

    /**
     * remove role members
     * remove role members
     * @param param the request object
     */
    public removeRoleMembersWithHttpInfo(param: ContactsRoleApiApiRemoveRoleMembersRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.removeRoleMembersWithHttpInfo(param.deleteRoleMemberRo, param.roleId, param.xSpaceId, param.roleId2,  options).toPromise();
    }

    /**
     * remove role members
     * remove role members
     * @param param the request object
     */
    public removeRoleMembers(param: ContactsRoleApiApiRemoveRoleMembersRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.removeRoleMembers(param.deleteRoleMemberRo, param.roleId, param.xSpaceId, param.roleId2,  options).toPromise();
    }

    /**
     * update role information
     * update role information
     * @param param the request object
     */
    public updateRoleWithHttpInfo(param: ContactsRoleApiApiUpdateRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateRoleWithHttpInfo(param.updateRoleRo, param.roleId, param.xSpaceId, param.roleId2,  options).toPromise();
    }

    /**
     * update role information
     * update role information
     * @param param the request object
     */
    public updateRole(param: ContactsRoleApiApiUpdateRoleRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateRole(param.updateRoleRo, param.roleId, param.xSpaceId, param.roleId2,  options).toPromise();
    }

}

import { ObservableContactsTeamApiApi } from "./ObservableAPI";
import { ContactsTeamApiApiRequestFactory, ContactsTeamApiApiResponseProcessor} from "../apis/ContactsTeamApiApi";

export interface ContactsTeamApiApiCreateTeamRequest {
    /**
     *
     * @type CreateTeamRo
     * @memberof ContactsTeamApiApicreateTeam
     */
    createTeamRo: CreateTeamRo
    /**
     * space id
     * @type string
     * @memberof ContactsTeamApiApicreateTeam
     */
    xSpaceId: string
}

export interface ContactsTeamApiApiDeleteTeamRequest {
    /**
     * team id
     * @type string
     * @memberof ContactsTeamApiApideleteTeam
     */
    teamId: string
    /**
     * space id
     * @type string
     * @memberof ContactsTeamApiApideleteTeam
     */
    xSpaceId: string
}

export interface ContactsTeamApiApiGetSubTeamsRequest {
    /**
     * space id
     * @type string
     * @memberof ContactsTeamApiApigetSubTeams
     */
    xSpaceId: string
    /**
     * team id
     * @type string
     * @memberof ContactsTeamApiApigetSubTeams
     */
    teamId?: string
}

export interface ContactsTeamApiApiGetTeamBranchRequest {
    /**
     * space id
     * @type string
     * @memberof ContactsTeamApiApigetTeamBranch
     */
    xSpaceId: string
}

export interface ContactsTeamApiApiGetTeamMembersRequest {
    /**
     * team id
     * @type string
     * @memberof ContactsTeamApiApigetTeamMembers
     */
    teamId: string
    /**
     * space id
     * @type string
     * @memberof ContactsTeamApiApigetTeamMembers
     */
    xSpaceId: string
}

export interface ContactsTeamApiApiGetTeamTreeRequest {
    /**
     * space id
     * @type string
     * @memberof ContactsTeamApiApigetTeamTree
     */
    xSpaceId: string
    /**
     * tree depth(default:1,max:2)
     * @type number
     * @memberof ContactsTeamApiApigetTeamTree
     */
    depth?: number
}

export interface ContactsTeamApiApiReadTeamInfoRequest {
    /**
     * space id
     * @type string
     * @memberof ContactsTeamApiApireadTeamInfo
     */
    xSpaceId: string
    /**
     * team id
     * @type string
     * @memberof ContactsTeamApiApireadTeamInfo
     */
    teamId?: string
}

export interface ContactsTeamApiApiUpdateTeamRequest {
    /**
     *
     * @type UpdateTeamRo
     * @memberof ContactsTeamApiApiupdateTeam
     */
    updateTeamRo: UpdateTeamRo
    /**
     * space id
     * @type string
     * @memberof ContactsTeamApiApiupdateTeam
     */
    xSpaceId: string
}

export class ObjectContactsTeamApiApi {
    private api: ObservableContactsTeamApiApi

    public constructor(configuration: Configuration, requestFactory?: ContactsTeamApiApiRequestFactory, responseProcessor?: ContactsTeamApiApiResponseProcessor) {
        this.api = new ObservableContactsTeamApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create team
     * Create team
     * @param param the request object
     */
    public createTeamWithHttpInfo(param: ContactsTeamApiApiCreateTeamRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.createTeamWithHttpInfo(param.createTeamRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Create team
     * Create team
     * @param param the request object
     */
    public createTeam(param: ContactsTeamApiApiCreateTeamRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.createTeam(param.createTeamRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete team. If team has members, it can be deleted.
     * Delete team
     * @param param the request object
     */
    public deleteTeamWithHttpInfo(param: ContactsTeamApiApiDeleteTeamRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteTeamWithHttpInfo(param.teamId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete team. If team has members, it can be deleted.
     * Delete team
     * @param param the request object
     */
    public deleteTeam(param: ContactsTeamApiApiDeleteTeamRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteTeam(param.teamId, param.xSpaceId,  options).toPromise();
    }

    /**
     * query sub team by team id. if team id lack, default root team.
     * Query direct sub departments
     * @param param the request object
     */
    public getSubTeamsWithHttpInfo(param: ContactsTeamApiApiGetSubTeamsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListTeamTreeVo>> {
        return this.api.getSubTeamsWithHttpInfo(param.xSpaceId, param.teamId,  options).toPromise();
    }

    /**
     * query sub team by team id. if team id lack, default root team.
     * Query direct sub departments
     * @param param the request object
     */
    public getSubTeams(param: ContactsTeamApiApiGetSubTeamsRequest, options?: Configuration): Promise<ResponseDataListTeamTreeVo> {
        return this.api.getSubTeams(param.xSpaceId, param.teamId,  options).toPromise();
    }

    /**
     * team branch. result is tree
     * team branch
     * @param param the request object
     */
    public getTeamBranchWithHttpInfo(param: ContactsTeamApiApiGetTeamBranchRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListTeamTreeVo>> {
        return this.api.getTeamBranchWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * team branch. result is tree
     * team branch
     * @param param the request object
     */
    public getTeamBranch(param: ContactsTeamApiApiGetTeamBranchRequest, options?: Configuration): Promise<ResponseDataListTeamTreeVo> {
        return this.api.getTeamBranch(param.xSpaceId,  options).toPromise();
    }

    /**
     * Query the team\'s members, no include sub team\'s
     * Query the team\'s members
     * @param param the request object
     */
    public getTeamMembersWithHttpInfo(param: ContactsTeamApiApiGetTeamMembersRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListMemberPageVo>> {
        return this.api.getTeamMembersWithHttpInfo(param.teamId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Query the team\'s members, no include sub team\'s
     * Query the team\'s members
     * @param param the request object
     */
    public getTeamMembers(param: ContactsTeamApiApiGetTeamMembersRequest, options?: Configuration): Promise<ResponseDataListMemberPageVo> {
        return this.api.getTeamMembers(param.teamId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Query team tree
     * @param param the request object
     */
    public getTeamTreeWithHttpInfo(param: ContactsTeamApiApiGetTeamTreeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListTeamTreeVo>> {
        return this.api.getTeamTreeWithHttpInfo(param.xSpaceId, param.depth,  options).toPromise();
    }

    /**
     * Query team tree
     * @param param the request object
     */
    public getTeamTree(param: ContactsTeamApiApiGetTeamTreeRequest, options?: Configuration): Promise<ResponseDataListTeamTreeVo> {
        return this.api.getTeamTree(param.xSpaceId, param.depth,  options).toPromise();
    }

    /**
     * Query department information. if team id lack, default root team
     * Query team information
     * @param param the request object
     */
    public readTeamInfoWithHttpInfo(param: ContactsTeamApiApiReadTeamInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataTeamInfoVo>> {
        return this.api.readTeamInfoWithHttpInfo(param.xSpaceId, param.teamId,  options).toPromise();
    }

    /**
     * Query department information. if team id lack, default root team
     * Query team information
     * @param param the request object
     */
    public readTeamInfo(param: ContactsTeamApiApiReadTeamInfoRequest, options?: Configuration): Promise<ResponseDataTeamInfoVo> {
        return this.api.readTeamInfo(param.xSpaceId, param.teamId,  options).toPromise();
    }

    /**
     * Update team info. If modify team level,default sort in the end of parent team.
     * Update team info
     * @param param the request object
     */
    public updateTeamWithHttpInfo(param: ContactsTeamApiApiUpdateTeamRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateTeamWithHttpInfo(param.updateTeamRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Update team info. If modify team level,default sort in the end of parent team.
     * Update team info
     * @param param the request object
     */
    public updateTeam(param: ContactsTeamApiApiUpdateTeamRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateTeam(param.updateTeamRo, param.xSpaceId,  options).toPromise();
    }

}

import { ObservableContentRiskControlAPIApi } from "./ObservableAPI";
import { ContentRiskControlAPIApiRequestFactory, ContentRiskControlAPIApiResponseProcessor} from "../apis/ContentRiskControlAPIApi";

export interface ContentRiskControlAPIApiCreateReportsRequest {
    /**
     *
     * @type ContentCensorReportRo
     * @memberof ContentRiskControlAPIApicreateReports
     */
    contentCensorReportRo: ContentCensorReportRo
}

export interface ContentRiskControlAPIApiReadReportsRequest {
    /**
     * Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)
     * @type number
     * @memberof ContentRiskControlAPIApireadReports
     */
    status: number
    /**
     *
     * @type Page
     * @memberof ContentRiskControlAPIApireadReports
     */
    page: Page
    /**
     * Paging parameters, see the interface description for instructions
     * @type string
     * @memberof ContentRiskControlAPIApireadReports
     */
    pageObjectParams: string
}

export interface ContentRiskControlAPIApiUpdateReportsRequest {
    /**
     * node id
     * @type string
     * @memberof ContentRiskControlAPIApiupdateReports
     */
    nodeId: string
    /**
     * Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)
     * @type number
     * @memberof ContentRiskControlAPIApiupdateReports
     */
    status: number
}

export class ObjectContentRiskControlAPIApi {
    private api: ObservableContentRiskControlAPIApi

    public constructor(configuration: Configuration, requestFactory?: ContentRiskControlAPIApiRequestFactory, responseProcessor?: ContentRiskControlAPIApiResponseProcessor) {
        this.api = new ObservableContentRiskControlAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Submit a report
     * @param param the request object
     */
    public createReportsWithHttpInfo(param: ContentRiskControlAPIApiCreateReportsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.createReportsWithHttpInfo(param.contentCensorReportRo,  options).toPromise();
    }

    /**
     * Submit a report
     * @param param the request object
     */
    public createReports(param: ContentRiskControlAPIApiCreateReportsRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.createReports(param.contentCensorReportRo,  options).toPromise();
    }

    /**
     * Paging query report information list, each table corresponds to a row of records, and the number of reports is automatically accumulatedDescription of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Paging query report information list
     * @param param the request object
     */
    public readReportsWithHttpInfo(param: ContentRiskControlAPIApiReadReportsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoContentCensorResultVo>> {
        return this.api.readReportsWithHttpInfo(param.status, param.page, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Paging query report information list, each table corresponds to a row of records, and the number of reports is automatically accumulatedDescription of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Paging query report information list
     * @param param the request object
     */
    public readReports(param: ContentRiskControlAPIApiReadReportsRequest, options?: Configuration): Promise<ResponseDataPageInfoContentCensorResultVo> {
        return this.api.readReports(param.status, param.page, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Force to open in DingTalk, automatically acquire DingTalk users
     * Handling whistleblower information
     * @param param the request object
     */
    public updateReportsWithHttpInfo(param: ContentRiskControlAPIApiUpdateReportsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateReportsWithHttpInfo(param.nodeId, param.status,  options).toPromise();
    }

    /**
     * Force to open in DingTalk, automatically acquire DingTalk users
     * Handling whistleblower information
     * @param param the request object
     */
    public updateReports(param: ContentRiskControlAPIApiUpdateReportsRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateReports(param.nodeId, param.status,  options).toPromise();
    }

}

import { ObservableDeveloperConfigAPIApi } from "./ObservableAPI";
import { DeveloperConfigAPIApiRequestFactory, DeveloperConfigAPIApiResponseProcessor} from "../apis/DeveloperConfigAPIApi";

export interface DeveloperConfigAPIApiCreateApiKeyRequest {
}

export interface DeveloperConfigAPIApiRefreshApiKeyRequest {
    /**
     *
     * @type RefreshApiKeyRo
     * @memberof DeveloperConfigAPIApirefreshApiKey
     */
    refreshApiKeyRo: RefreshApiKeyRo
}

export interface DeveloperConfigAPIApiValidateApiKeyRequest {
    /**
     *
     * @type string
     * @memberof DeveloperConfigAPIApivalidateApiKey
     */
    apiKey: string
}

export class ObjectDeveloperConfigAPIApi {
    private api: ObservableDeveloperConfigAPIApi

    public constructor(configuration: Configuration, requestFactory?: DeveloperConfigAPIApiRequestFactory, responseProcessor?: DeveloperConfigAPIApiResponseProcessor) {
        this.api = new ObservableDeveloperConfigAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create developer access tokens to access open platform functionality.
     * Create the developer access token
     * @param param the request object
     */
    public createApiKeyWithHttpInfo(param: DeveloperConfigAPIApiCreateApiKeyRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataDeveloperInfoVo>> {
        return this.api.createApiKeyWithHttpInfo( options).toPromise();
    }

    /**
     * Create developer access tokens to access open platform functionality.
     * Create the developer access token
     * @param param the request object
     */
    public createApiKey(param: DeveloperConfigAPIApiCreateApiKeyRequest = {}, options?: Configuration): Promise<ResponseDataDeveloperInfoVo> {
        return this.api.createApiKey( options).toPromise();
    }

    /**
     * Refresh developer access token before verifying phone number.If there is no verification mailbox, skip verification.
     * Refresh the developer access token
     * @param param the request object
     */
    public refreshApiKeyWithHttpInfo(param: DeveloperConfigAPIApiRefreshApiKeyRequest, options?: Configuration): Promise<HttpInfo<ResponseDataDeveloperInfoVo>> {
        return this.api.refreshApiKeyWithHttpInfo(param.refreshApiKeyRo,  options).toPromise();
    }

    /**
     * Refresh developer access token before verifying phone number.If there is no verification mailbox, skip verification.
     * Refresh the developer access token
     * @param param the request object
     */
    public refreshApiKey(param: DeveloperConfigAPIApiRefreshApiKeyRequest, options?: Configuration): Promise<ResponseDataDeveloperInfoVo> {
        return this.api.refreshApiKey(param.refreshApiKeyRo,  options).toPromise();
    }

    /**
     * Provides a mid-tier validation access token.
     * Verify the access token
     * @param param the request object
     */
    public validateApiKeyWithHttpInfo(param: DeveloperConfigAPIApiValidateApiKeyRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        return this.api.validateApiKeyWithHttpInfo(param.apiKey,  options).toPromise();
    }

    /**
     * Provides a mid-tier validation access token.
     * Verify the access token
     * @param param the request object
     */
    public validateApiKey(param: DeveloperConfigAPIApiValidateApiKeyRequest, options?: Configuration): Promise<ResponseDataBoolean> {
        return this.api.validateApiKey(param.apiKey,  options).toPromise();
    }

}

import { ObservableDingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi } from "./ObservableAPI";
import { DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiRequestFactory, DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiResponseProcessor} from "../apis/DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi";

export interface DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiLogin1Request {
    /**
     * temporary authorization code, uploaded by the client
     * @type string
     * @memberof DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApilogin1
     */
    code: string
}

export class ObjectDingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi {
    private api: ObservableDingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiRequestFactory, responseProcessor?: DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiResponseProcessor) {
        this.api = new ObservableDingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * After the login is completed, the system saves the user session by default, and calls other business interfaces to automatically bring the cookie
     * dingtalk user password free login
     * @param param the request object
     */
    public login1WithHttpInfo(param: DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiLogin1Request, options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkUserDetail>> {
        return this.api.login1WithHttpInfo(param.code,  options).toPromise();
    }

    /**
     * After the login is completed, the system saves the user session by default, and calls other business interfaces to automatically bring the cookie
     * dingtalk user password free login
     * @param param the request object
     */
    public login1(param: DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiLogin1Request, options?: Configuration): Promise<ResponseDataDingTalkUserDetail> {
        return this.api.login1(param.code,  options).toPromise();
    }

}

import { ObservableDingTalkServiceInterfaceApi } from "./ObservableAPI";
import { DingTalkServiceInterfaceApiRequestFactory, DingTalkServiceInterfaceApiResponseProcessor} from "../apis/DingTalkServiceInterfaceApi";

export interface DingTalkServiceInterfaceApiCallback3Request {
    /**
     * coding. JS gets the login Tmp Code, redirects and returns after jumping to the specified connection
     * @type string
     * @memberof DingTalkServiceInterfaceApicallback3
     */
    code: string
    /**
     * declare value. Used to prevent replay attacks
     * @type string
     * @memberof DingTalkServiceInterfaceApicallback3
     */
    state: string
    /**
     * Type (0: scan code to log in; 1: account binding;)
     * @type number
     * @memberof DingTalkServiceInterfaceApicallback3
     */
    type?: number
}

export class ObjectDingTalkServiceInterfaceApi {
    private api: ObservableDingTalkServiceInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: DingTalkServiceInterfaceApiRequestFactory, responseProcessor?: DingTalkServiceInterfaceApiResponseProcessor) {
        this.api = new ObservableDingTalkServiceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * DingTalk scan code login callback
     * @param param the request object
     */
    public callback3WithHttpInfo(param: DingTalkServiceInterfaceApiCallback3Request, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.callback3WithHttpInfo(param.code, param.state, param.type,  options).toPromise();
    }

    /**
     * DingTalk scan code login callback
     * @param param the request object
     */
    public callback3(param: DingTalkServiceInterfaceApiCallback3Request, options?: Configuration): Promise<ResponseDataString> {
        return this.api.callback3(param.code, param.state, param.type,  options).toPromise();
    }

}

import { ObservableGMWidgetAPIApi } from "./ObservableAPI";
import { GMWidgetAPIApiRequestFactory, GMWidgetAPIApiResponseProcessor} from "../apis/GMWidgetAPIApi";

export interface GMWidgetAPIApiBanWidgetRequest {
    /**
     *
     * @type WidgetPackageBanRo
     * @memberof GMWidgetAPIApibanWidget
     */
    widgetPackageBanRo: WidgetPackageBanRo
    /**
     * developer token
     * @type string
     * @memberof GMWidgetAPIApibanWidget
     */
    authorization?: string
}

export interface GMWidgetAPIApiGlobalWidgetDbDataRefreshRequest {
    /**
     *
     * @type GlobalWidgetListRo
     * @memberof GMWidgetAPIApiglobalWidgetDbDataRefresh
     */
    globalWidgetListRo: GlobalWidgetListRo
}

export interface GMWidgetAPIApiGlobalWidgetListRequest {
    /**
     *
     * @type GlobalWidgetListRo
     * @memberof GMWidgetAPIApiglobalWidgetList
     */
    globalWidgetListRo: GlobalWidgetListRo
}

export class ObjectGMWidgetAPIApi {
    private api: ObservableGMWidgetAPIApi

    public constructor(configuration: Configuration, requestFactory?: GMWidgetAPIApiRequestFactory, responseProcessor?: GMWidgetAPIApiResponseProcessor) {
        this.api = new ObservableGMWidgetAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * widget-cli ban/unban widget
     * Ban/Unban widget
     * @param param the request object
     */
    public banWidgetWithHttpInfo(param: GMWidgetAPIApiBanWidgetRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.banWidgetWithHttpInfo(param.widgetPackageBanRo, param.authorization,  options).toPromise();
    }

    /**
     * widget-cli ban/unban widget
     * Ban/Unban widget
     * @param param the request object
     */
    public banWidget(param: GMWidgetAPIApiBanWidgetRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.banWidget(param.widgetPackageBanRo, param.authorization,  options).toPromise();
    }

    /**
     * Refresh the global component DB data
     * @param param the request object
     */
    public globalWidgetDbDataRefreshWithHttpInfo(param: GMWidgetAPIApiGlobalWidgetDbDataRefreshRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.globalWidgetDbDataRefreshWithHttpInfo(param.globalWidgetListRo,  options).toPromise();
    }

    /**
     * Refresh the global component DB data
     * @param param the request object
     */
    public globalWidgetDbDataRefresh(param: GMWidgetAPIApiGlobalWidgetDbDataRefreshRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.globalWidgetDbDataRefresh(param.globalWidgetListRo,  options).toPromise();
    }

    /**
     * Gets a list of global widget stores
     * @param param the request object
     */
    public globalWidgetListWithHttpInfo(param: GMWidgetAPIApiGlobalWidgetListRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListGlobalWidgetInfo>> {
        return this.api.globalWidgetListWithHttpInfo(param.globalWidgetListRo,  options).toPromise();
    }

    /**
     * Gets a list of global widget stores
     * @param param the request object
     */
    public globalWidgetList(param: GMWidgetAPIApiGlobalWidgetListRequest, options?: Configuration): Promise<ResponseDataListGlobalWidgetInfo> {
        return this.api.globalWidgetList(param.globalWidgetListRo,  options).toPromise();
    }

}

import { ObservableIDaaSAddressBookApi } from "./ObservableAPI";
import { IDaaSAddressBookApiRequestFactory, IDaaSAddressBookApiResponseProcessor} from "../apis/IDaaSAddressBookApi";

export interface IDaaSAddressBookApiPostSyncRequest {
}

export class ObjectIDaaSAddressBookApi {
    private api: ObservableIDaaSAddressBookApi

    public constructor(configuration: Configuration, requestFactory?: IDaaSAddressBookApiRequestFactory, responseProcessor?: IDaaSAddressBookApiResponseProcessor) {
        this.api = new ObservableIDaaSAddressBookApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Synchronize address book
     * @param param the request object
     */
    public postSyncWithHttpInfo(param: IDaaSAddressBookApiPostSyncRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.postSyncWithHttpInfo( options).toPromise();
    }

    /**
     * Synchronize address book
     * @param param the request object
     */
    public postSync(param: IDaaSAddressBookApiPostSyncRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.postSync( options).toPromise();
    }

}

import { ObservableIDaaSLoginAuthorizationApi } from "./ObservableAPI";
import { IDaaSLoginAuthorizationApiRequestFactory, IDaaSLoginAuthorizationApiResponseProcessor} from "../apis/IDaaSLoginAuthorizationApi";

export interface IDaaSLoginAuthorizationApiGetBindInfoRequest {
    /**
     *
     * @type string
     * @memberof IDaaSLoginAuthorizationApigetBindInfo
     */
    spaceId: string
}

export interface IDaaSLoginAuthorizationApiGetLoginRequest {
    /**
     *
     * @type string
     * @memberof IDaaSLoginAuthorizationApigetLogin
     */
    clientId: string
}

export interface IDaaSLoginAuthorizationApiGetLoginRedirectRequest {
    /**
     *
     * @type string
     * @memberof IDaaSLoginAuthorizationApigetLoginRedirect
     */
    clientId: string
}

export interface IDaaSLoginAuthorizationApiPostCallback1Request {
    /**
     *
     * @type IdaasAuthCallbackRo
     * @memberof IDaaSLoginAuthorizationApipostCallback1
     */
    idaasAuthCallbackRo: IdaasAuthCallbackRo
    /**
     *
     * @type string
     * @memberof IDaaSLoginAuthorizationApipostCallback1
     */
    clientId: string
}

export interface IDaaSLoginAuthorizationApiPostSpaceCallbackRequest {
    /**
     *
     * @type IdaasAuthCallbackRo
     * @memberof IDaaSLoginAuthorizationApipostSpaceCallback
     */
    idaasAuthCallbackRo: IdaasAuthCallbackRo
    /**
     *
     * @type string
     * @memberof IDaaSLoginAuthorizationApipostSpaceCallback
     */
    clientId: string
    /**
     *
     * @type string
     * @memberof IDaaSLoginAuthorizationApipostSpaceCallback
     */
    spaceId: string
}

export class ObjectIDaaSLoginAuthorizationApi {
    private api: ObservableIDaaSLoginAuthorizationApi

    public constructor(configuration: Configuration, requestFactory?: IDaaSLoginAuthorizationApiRequestFactory, responseProcessor?: IDaaSLoginAuthorizationApiResponseProcessor) {
        this.api = new ObservableIDaaSLoginAuthorizationApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get the IDaaS information bound to the space
     * @param param the request object
     */
    public getBindInfoWithHttpInfo(param: IDaaSLoginAuthorizationApiGetBindInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataIdaasBindInfoVo>> {
        return this.api.getBindInfoWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Get the IDaaS information bound to the space
     * @param param the request object
     */
    public getBindInfo(param: IDaaSLoginAuthorizationApiGetBindInfoRequest, options?: Configuration): Promise<ResponseDataIdaasBindInfoVo> {
        return this.api.getBindInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Get the link to log in to the IDaaS system
     * @param param the request object
     */
    public getLoginWithHttpInfo(param: IDaaSLoginAuthorizationApiGetLoginRequest, options?: Configuration): Promise<HttpInfo<ResponseDataIdaasAuthLoginVo>> {
        return this.api.getLoginWithHttpInfo(param.clientId,  options).toPromise();
    }

    /**
     * Get the link to log in to the IDaaS system
     * @param param the request object
     */
    public getLogin(param: IDaaSLoginAuthorizationApiGetLoginRequest, options?: Configuration): Promise<ResponseDataIdaasAuthLoginVo> {
        return this.api.getLogin(param.clientId,  options).toPromise();
    }

    /**
     * Jump to the IDaaS system for automatic login
     * @param param the request object
     */
    public getLoginRedirectWithHttpInfo(param: IDaaSLoginAuthorizationApiGetLoginRedirectRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.getLoginRedirectWithHttpInfo(param.clientId,  options).toPromise();
    }

    /**
     * Jump to the IDaaS system for automatic login
     * @param param the request object
     */
    public getLoginRedirect(param: IDaaSLoginAuthorizationApiGetLoginRedirectRequest, options?: Configuration): Promise<void> {
        return this.api.getLoginRedirect(param.clientId,  options).toPromise();
    }

    /**
     * For private deployment only
     * The user completes subsequent operations after logging in to the IDaaS system
     * @param param the request object
     */
    public postCallback1WithHttpInfo(param: IDaaSLoginAuthorizationApiPostCallback1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.postCallback1WithHttpInfo(param.idaasAuthCallbackRo, param.clientId,  options).toPromise();
    }

    /**
     * For private deployment only
     * The user completes subsequent operations after logging in to the IDaaS system
     * @param param the request object
     */
    public postCallback1(param: IDaaSLoginAuthorizationApiPostCallback1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.postCallback1(param.idaasAuthCallbackRo, param.clientId,  options).toPromise();
    }

    /**
     * For Sass version only
     * The user completes subsequent operations after logging in to the IDaaS system
     * @param param the request object
     */
    public postSpaceCallbackWithHttpInfo(param: IDaaSLoginAuthorizationApiPostSpaceCallbackRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.postSpaceCallbackWithHttpInfo(param.idaasAuthCallbackRo, param.clientId, param.spaceId,  options).toPromise();
    }

    /**
     * For Sass version only
     * The user completes subsequent operations after logging in to the IDaaS system
     * @param param the request object
     */
    public postSpaceCallback(param: IDaaSLoginAuthorizationApiPostSpaceCallbackRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.postSpaceCallback(param.idaasAuthCallbackRo, param.clientId, param.spaceId,  options).toPromise();
    }

}

import { ObservableIntegralApiApi } from "./ObservableAPI";
import { IntegralApiApiRequestFactory, IntegralApiApiResponseProcessor} from "../apis/IntegralApiApi";

export interface IntegralApiApiIntegralRecordsRequest {
    /**
     *
     * @type Page
     * @memberof IntegralApiApiintegralRecords
     */
    page: Page
    /**
     * Page parameter
     * @type string
     * @memberof IntegralApiApiintegralRecords
     */
    pageObjectParams: string
}

export interface IntegralApiApiIntegralsRequest {
}

export interface IntegralApiApiInviteCodeRewardRequest {
    /**
     *
     * @type InviteCodeRewardRo
     * @memberof IntegralApiApiinviteCodeReward
     */
    inviteCodeRewardRo: InviteCodeRewardRo
}

export class ObjectIntegralApiApi {
    private api: ObservableIntegralApiApi

    public constructor(configuration: Configuration, requestFactory?: IntegralApiApiRequestFactory, responseProcessor?: IntegralApiApiResponseProcessor) {
        this.api = new ObservableIntegralApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Page by page query of integral revenue and expenditure details
     * @param param the request object
     */
    public integralRecordsWithHttpInfo(param: IntegralApiApiIntegralRecordsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoIntegralRecordVO>> {
        return this.api.integralRecordsWithHttpInfo(param.page, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Page by page query of integral revenue and expenditure details
     * @param param the request object
     */
    public integralRecords(param: IntegralApiApiIntegralRecordsRequest, options?: Configuration): Promise<ResponseDataPageInfoIntegralRecordVO> {
        return this.api.integralRecords(param.page, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Query account integral information
     * @param param the request object
     */
    public integralsWithHttpInfo(param: IntegralApiApiIntegralsRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataUserIntegralVo>> {
        return this.api.integralsWithHttpInfo( options).toPromise();
    }

    /**
     * Query account integral information
     * @param param the request object
     */
    public integrals(param: IntegralApiApiIntegralsRequest = {}, options?: Configuration): Promise<ResponseDataUserIntegralVo> {
        return this.api.integrals( options).toPromise();
    }

    /**
     * Users fill in the invitation code and get rewards
     * Fill in invitation code reward
     * @param param the request object
     */
    public inviteCodeRewardWithHttpInfo(param: IntegralApiApiInviteCodeRewardRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.inviteCodeRewardWithHttpInfo(param.inviteCodeRewardRo,  options).toPromise();
    }

    /**
     * Users fill in the invitation code and get rewards
     * Fill in invitation code reward
     * @param param the request object
     */
    public inviteCodeReward(param: IntegralApiApiInviteCodeRewardRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.inviteCodeReward(param.inviteCodeRewardRo,  options).toPromise();
    }

}

import { ObservableInternalContactsApiApi } from "./ObservableAPI";
import { InternalContactsApiApiRequestFactory, InternalContactsApiApiResponseProcessor} from "../apis/InternalContactsApiApi";

export interface InternalContactsApiApiCreateUnitRoleRequest {
    /**
     *
     * @type CreateRoleRo
     * @memberof InternalContactsApiApicreateUnitRole
     */
    createRoleRo: CreateRoleRo
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApicreateUnitRole
     */
    xSpaceId: string
}

export interface InternalContactsApiApiCreateUnitTeamRequest {
    /**
     *
     * @type CreateUnitTeamRo
     * @memberof InternalContactsApiApicreateUnitTeam
     */
    createUnitTeamRo: CreateUnitTeamRo
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApicreateUnitTeam
     */
    xSpaceId: string
}

export interface InternalContactsApiApiDeleteMember1Request {
    /**
     * unit uuid
     * @type string
     * @memberof InternalContactsApiApideleteMember1
     */
    unitId: string
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApideleteMember1
     */
    xSpaceId: string
}

export interface InternalContactsApiApiDeleteUnitRoleRequest {
    /**
     * unit uuid
     * @type string
     * @memberof InternalContactsApiApideleteUnitRole
     */
    unitId: string
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApideleteUnitRole
     */
    xSpaceId: string
}

export interface InternalContactsApiApiDeleteUnitTeamRequest {
    /**
     * unit uuid
     * @type string
     * @memberof InternalContactsApiApideleteUnitTeam
     */
    unitId: string
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApideleteUnitTeam
     */
    xSpaceId: string
}

export interface InternalContactsApiApiGetRolePageListRequest {
    /**
     *
     * @type PageRoleBaseInfoDto
     * @memberof InternalContactsApiApigetRolePageList
     */
    page: PageRoleBaseInfoDto
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApigetRolePageList
     */
    xSpaceId: string
    /**
     * page\&#39;s parameter
     * @type string
     * @memberof InternalContactsApiApigetRolePageList
     */
    pageObjectParams: string
}

export interface InternalContactsApiApiGetTeamChildrenPageListRequest {
    /**
     * unit uuid
     * @type string
     * @memberof InternalContactsApiApigetTeamChildrenPageList
     */
    unitId: string
    /**
     *
     * @type PageLong
     * @memberof InternalContactsApiApigetTeamChildrenPageList
     */
    page: PageLong
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApigetTeamChildrenPageList
     */
    xSpaceId: string
    /**
     * page\&#39;s parameter
     * @type string
     * @memberof InternalContactsApiApigetTeamChildrenPageList
     */
    pageObjectParams: string
}

export interface InternalContactsApiApiGetTeamMembersPageInfoRequest {
    /**
     * unit uuid
     * @type string
     * @memberof InternalContactsApiApigetTeamMembersPageInfo
     */
    unitId: string
    /**
     *
     * @type PageLong
     * @memberof InternalContactsApiApigetTeamMembersPageInfo
     */
    page: PageLong
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApigetTeamMembersPageInfo
     */
    xSpaceId: string
    /**
     * page\&#39;s parameter
     * @type string
     * @memberof InternalContactsApiApigetTeamMembersPageInfo
     */
    pageObjectParams: string
    /**
     * includes mobile number and email
     * @type boolean
     * @memberof InternalContactsApiApigetTeamMembersPageInfo
     */
    sensitiveData?: boolean
}

export interface InternalContactsApiApiGetUnitMemberDetailsRequest {
    /**
     * unit uuid
     * @type string
     * @memberof InternalContactsApiApigetUnitMemberDetails
     */
    unitId: string
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApigetUnitMemberDetails
     */
    xSpaceId: string
    /**
     * includes mobile number and email
     * @type boolean
     * @memberof InternalContactsApiApigetUnitMemberDetails
     */
    sensitiveData?: boolean
}

export interface InternalContactsApiApiGetUnitRoleMembersRequest {
    /**
     * unit uuid
     * @type string
     * @memberof InternalContactsApiApigetUnitRoleMembers
     */
    unitId: string
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApigetUnitRoleMembers
     */
    xSpaceId: string
    /**
     * includes mobile number and email
     * @type boolean
     * @memberof InternalContactsApiApigetUnitRoleMembers
     */
    sensitiveData?: boolean
}

export interface InternalContactsApiApiUpdateUnitMemberRequest {
    /**
     *
     * @type UpdateUnitMemberRo
     * @memberof InternalContactsApiApiupdateUnitMember
     */
    updateUnitMemberRo: UpdateUnitMemberRo
    /**
     * unit uuid
     * @type string
     * @memberof InternalContactsApiApiupdateUnitMember
     */
    unitId: string
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApiupdateUnitMember
     */
    xSpaceId: string
    /**
     * includes mobile number and email
     * @type boolean
     * @memberof InternalContactsApiApiupdateUnitMember
     */
    sensitiveData?: boolean
}

export interface InternalContactsApiApiUpdateUnitRoleRequest {
    /**
     *
     * @type UpdateUnitRoleRo
     * @memberof InternalContactsApiApiupdateUnitRole
     */
    updateUnitRoleRo: UpdateUnitRoleRo
    /**
     * unit uuid
     * @type string
     * @memberof InternalContactsApiApiupdateUnitRole
     */
    unitId: string
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApiupdateUnitRole
     */
    xSpaceId: string
}

export interface InternalContactsApiApiUpdateUnitTeamRequest {
    /**
     *
     * @type UpdateUnitTeamRo
     * @memberof InternalContactsApiApiupdateUnitTeam
     */
    updateUnitTeamRo: UpdateUnitTeamRo
    /**
     * unit uuid
     * @type string
     * @memberof InternalContactsApiApiupdateUnitTeam
     */
    unitId: string
    /**
     * space id
     * @type string
     * @memberof InternalContactsApiApiupdateUnitTeam
     */
    xSpaceId: string
}

export class ObjectInternalContactsApiApi {
    private api: ObservableInternalContactsApiApi

    public constructor(configuration: Configuration, requestFactory?: InternalContactsApiApiRequestFactory, responseProcessor?: InternalContactsApiApiResponseProcessor) {
        this.api = new ObservableInternalContactsApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * create new role
     * create new role
     * @param param the request object
     */
    public createUnitRoleWithHttpInfo(param: InternalContactsApiApiCreateUnitRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataUnitRoleInfoVo>> {
        return this.api.createUnitRoleWithHttpInfo(param.createRoleRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * create new role
     * create new role
     * @param param the request object
     */
    public createUnitRole(param: InternalContactsApiApiCreateUnitRoleRequest, options?: Configuration): Promise<ResponseDataUnitRoleInfoVo> {
        return this.api.createUnitRole(param.createRoleRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Add a sub team
     * Add a sub team
     * @param param the request object
     */
    public createUnitTeamWithHttpInfo(param: InternalContactsApiApiCreateUnitTeamRequest, options?: Configuration): Promise<HttpInfo<ResponseDataUnitTeamInfoVo>> {
        return this.api.createUnitTeamWithHttpInfo(param.createUnitTeamRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Add a sub team
     * Add a sub team
     * @param param the request object
     */
    public createUnitTeam(param: InternalContactsApiApiCreateUnitTeamRequest, options?: Configuration): Promise<ResponseDataUnitTeamInfoVo> {
        return this.api.createUnitTeam(param.createUnitTeamRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete a Member from organization
     * Delete a Member from organization
     * @param param the request object
     */
    public deleteMember1WithHttpInfo(param: InternalContactsApiApiDeleteMember1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteMember1WithHttpInfo(param.unitId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete a Member from organization
     * Delete a Member from organization
     * @param param the request object
     */
    public deleteMember1(param: InternalContactsApiApiDeleteMember1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteMember1(param.unitId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete role. If role has members, it can be deleted.
     * Delete team
     * @param param the request object
     */
    public deleteUnitRoleWithHttpInfo(param: InternalContactsApiApiDeleteUnitRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteUnitRoleWithHttpInfo(param.unitId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete role. If role has members, it can be deleted.
     * Delete team
     * @param param the request object
     */
    public deleteUnitRole(param: InternalContactsApiApiDeleteUnitRoleRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteUnitRole(param.unitId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete team. If team has members, it can be deleted.
     * Delete team
     * @param param the request object
     */
    public deleteUnitTeamWithHttpInfo(param: InternalContactsApiApiDeleteUnitTeamRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteUnitTeamWithHttpInfo(param.unitId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete team. If team has members, it can be deleted.
     * Delete team
     * @param param the request object
     */
    public deleteUnitTeam(param: InternalContactsApiApiDeleteUnitTeamRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteUnitTeam(param.unitId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Query roles information
     * Query roles information
     * @param param the request object
     */
    public getRolePageListWithHttpInfo(param: InternalContactsApiApiGetRolePageListRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoUnitRoleInfoVo>> {
        return this.api.getRolePageListWithHttpInfo(param.page, param.xSpaceId, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Query roles information
     * Query roles information
     * @param param the request object
     */
    public getRolePageList(param: InternalContactsApiApiGetRolePageListRequest, options?: Configuration): Promise<ResponseDataPageInfoUnitRoleInfoVo> {
        return this.api.getRolePageList(param.page, param.xSpaceId, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Query department information. if team id lack, default root team
     * Query team information
     * @param param the request object
     */
    public getTeamChildrenPageListWithHttpInfo(param: InternalContactsApiApiGetTeamChildrenPageListRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoUnitTeamInfoVo>> {
        return this.api.getTeamChildrenPageListWithHttpInfo(param.unitId, param.page, param.xSpaceId, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Query department information. if team id lack, default root team
     * Query team information
     * @param param the request object
     */
    public getTeamChildrenPageList(param: InternalContactsApiApiGetTeamChildrenPageListRequest, options?: Configuration): Promise<ResponseDataPageInfoUnitTeamInfoVo> {
        return this.api.getTeamChildrenPageList(param.unitId, param.page, param.xSpaceId, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Query department members information. if team id lack, default root team
     * Query team members information
     * @param param the request object
     */
    public getTeamMembersPageInfoWithHttpInfo(param: InternalContactsApiApiGetTeamMembersPageInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoUnitMemberInfoVo>> {
        return this.api.getTeamMembersPageInfoWithHttpInfo(param.unitId, param.page, param.xSpaceId, param.pageObjectParams, param.sensitiveData,  options).toPromise();
    }

    /**
     * Query department members information. if team id lack, default root team
     * Query team members information
     * @param param the request object
     */
    public getTeamMembersPageInfo(param: InternalContactsApiApiGetTeamMembersPageInfoRequest, options?: Configuration): Promise<ResponseDataPageInfoUnitMemberInfoVo> {
        return this.api.getTeamMembersPageInfo(param.unitId, param.page, param.xSpaceId, param.pageObjectParams, param.sensitiveData,  options).toPromise();
    }

    /**
     * Query team information
     * Query team information
     * @param param the request object
     */
    public getUnitMemberDetailsWithHttpInfo(param: InternalContactsApiApiGetUnitMemberDetailsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataUnitMemberInfoVo>> {
        return this.api.getUnitMemberDetailsWithHttpInfo(param.unitId, param.xSpaceId, param.sensitiveData,  options).toPromise();
    }

    /**
     * Query team information
     * Query team information
     * @param param the request object
     */
    public getUnitMemberDetails(param: InternalContactsApiApiGetUnitMemberDetailsRequest, options?: Configuration): Promise<ResponseDataUnitMemberInfoVo> {
        return this.api.getUnitMemberDetails(param.unitId, param.xSpaceId, param.sensitiveData,  options).toPromise();
    }

    /**
     * query the role\'s members
     * query role members
     * @param param the request object
     */
    public getUnitRoleMembersWithHttpInfo(param: InternalContactsApiApiGetUnitRoleMembersRequest, options?: Configuration): Promise<HttpInfo<ResponseDataUnitRoleMemberVo>> {
        return this.api.getUnitRoleMembersWithHttpInfo(param.unitId, param.xSpaceId, param.sensitiveData,  options).toPromise();
    }

    /**
     * query the role\'s members
     * query role members
     * @param param the request object
     */
    public getUnitRoleMembers(param: InternalContactsApiApiGetUnitRoleMembersRequest, options?: Configuration): Promise<ResponseDataUnitRoleMemberVo> {
        return this.api.getUnitRoleMembers(param.unitId, param.xSpaceId, param.sensitiveData,  options).toPromise();
    }

    /**
     * Edit member info
     * Edit member info
     * @param param the request object
     */
    public updateUnitMemberWithHttpInfo(param: InternalContactsApiApiUpdateUnitMemberRequest, options?: Configuration): Promise<HttpInfo<ResponseDataUnitMemberInfoVo>> {
        return this.api.updateUnitMemberWithHttpInfo(param.updateUnitMemberRo, param.unitId, param.xSpaceId, param.sensitiveData,  options).toPromise();
    }

    /**
     * Edit member info
     * Edit member info
     * @param param the request object
     */
    public updateUnitMember(param: InternalContactsApiApiUpdateUnitMemberRequest, options?: Configuration): Promise<ResponseDataUnitMemberInfoVo> {
        return this.api.updateUnitMember(param.updateUnitMemberRo, param.unitId, param.xSpaceId, param.sensitiveData,  options).toPromise();
    }

    /**
     * Update role info.
     * Update team info
     * @param param the request object
     */
    public updateUnitRoleWithHttpInfo(param: InternalContactsApiApiUpdateUnitRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataUnitRoleInfoVo>> {
        return this.api.updateUnitRoleWithHttpInfo(param.updateUnitRoleRo, param.unitId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Update role info.
     * Update team info
     * @param param the request object
     */
    public updateUnitRole(param: InternalContactsApiApiUpdateUnitRoleRequest, options?: Configuration): Promise<ResponseDataUnitRoleInfoVo> {
        return this.api.updateUnitRole(param.updateUnitRoleRo, param.unitId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Update team info. If modify team level, default sort in the end of parent team.
     * Update team info
     * @param param the request object
     */
    public updateUnitTeamWithHttpInfo(param: InternalContactsApiApiUpdateUnitTeamRequest, options?: Configuration): Promise<HttpInfo<ResponseDataUnitTeamInfoVo>> {
        return this.api.updateUnitTeamWithHttpInfo(param.updateUnitTeamRo, param.unitId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Update team info. If modify team level, default sort in the end of parent team.
     * Update team info
     * @param param the request object
     */
    public updateUnitTeam(param: InternalContactsApiApiUpdateUnitTeamRequest, options?: Configuration): Promise<ResponseDataUnitTeamInfoVo> {
        return this.api.updateUnitTeam(param.updateUnitTeamRo, param.unitId, param.xSpaceId,  options).toPromise();
    }

}

import { ObservableInternalServerAssetAPIApi } from "./ObservableAPI";
import { InternalServerAssetAPIApiRequestFactory, InternalServerAssetAPIApiResponseProcessor} from "../apis/InternalServerAssetAPIApi";

export interface InternalServerAssetAPIApiGetRequest {
    /**
     * resource key
     * @type string
     * @memberof InternalServerAssetAPIApiget
     */
    token: string
}

export interface InternalServerAssetAPIApiGetSignatureUrls1Request {
    /**
     *
     * @type Array&lt;string&gt;
     * @memberof InternalServerAssetAPIApigetSignatureUrls1
     */
    resourceKeys: Array<string>
}

export interface InternalServerAssetAPIApiGetSpaceCapacity1Request {
    /**
     * node custom id
     * @type string
     * @memberof InternalServerAssetAPIApigetSpaceCapacity1
     */
    nodeId: string
    /**
     * number to create (default 1, max 20)
     * @type string
     * @memberof InternalServerAssetAPIApigetSpaceCapacity1
     */
    count?: string
}

export class ObjectInternalServerAssetAPIApi {
    private api: ObservableInternalServerAssetAPIApi

    public constructor(configuration: Configuration, requestFactory?: InternalServerAssetAPIApiRequestFactory, responseProcessor?: InternalServerAssetAPIApiResponseProcessor) {
        this.api = new ObservableInternalServerAssetAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * scene：Fusion server query the attachment field data before writing
     * Get Asset Info
     * @param param the request object
     */
    public getWithHttpInfo(param: InternalServerAssetAPIApiGetRequest, options?: Configuration): Promise<HttpInfo<ResponseDataAssetUploadResult>> {
        return this.api.getWithHttpInfo(param.token,  options).toPromise();
    }

    /**
     * scene：Fusion server query the attachment field data before writing
     * Get Asset Info
     * @param param the request object
     */
    public get(param: InternalServerAssetAPIApiGetRequest, options?: Configuration): Promise<ResponseDataAssetUploadResult> {
        return this.api.get(param.token,  options).toPromise();
    }

    /**
     * Batch get asset signature url
     * @param param the request object
     */
    public getSignatureUrls1WithHttpInfo(param: InternalServerAssetAPIApiGetSignatureUrls1Request, options?: Configuration): Promise<HttpInfo<ResponseDataListAssetUrlSignatureVo>> {
        return this.api.getSignatureUrls1WithHttpInfo(param.resourceKeys,  options).toPromise();
    }

    /**
     * Batch get asset signature url
     * @param param the request object
     */
    public getSignatureUrls1(param: InternalServerAssetAPIApiGetSignatureUrls1Request, options?: Configuration): Promise<ResponseDataListAssetUrlSignatureVo> {
        return this.api.getSignatureUrls1(param.resourceKeys,  options).toPromise();
    }

    /**
     * Get Upload PreSigned URL
     * @param param the request object
     */
    public getSpaceCapacity1WithHttpInfo(param: InternalServerAssetAPIApiGetSpaceCapacity1Request, options?: Configuration): Promise<HttpInfo<ResponseDataListAssetUploadCertificateVO>> {
        return this.api.getSpaceCapacity1WithHttpInfo(param.nodeId, param.count,  options).toPromise();
    }

    /**
     * Get Upload PreSigned URL
     * @param param the request object
     */
    public getSpaceCapacity1(param: InternalServerAssetAPIApiGetSpaceCapacity1Request, options?: Configuration): Promise<ResponseDataListAssetUploadCertificateVO> {
        return this.api.getSpaceCapacity1(param.nodeId, param.count,  options).toPromise();
    }

}

import { ObservableInternalServerOrgAPIApi } from "./ObservableAPI";
import { InternalServerOrgAPIApiRequestFactory, InternalServerOrgAPIApiResponseProcessor} from "../apis/InternalServerOrgAPIApi";

export interface InternalServerOrgAPIApiLoadOrSearch1Request {
    /**
     *
     * @type LoadSearchDTO
     * @memberof InternalServerOrgAPIApiloadOrSearch1
     */
    params: LoadSearchDTO
    /**
     * space id
     * @type string
     * @memberof InternalServerOrgAPIApiloadOrSearch1
     */
    xSpaceId?: string
    /**
     * user id
     * @type string
     * @memberof InternalServerOrgAPIApiloadOrSearch1
     */
    userId?: string
    /**
     * keyword
     * @type string
     * @memberof InternalServerOrgAPIApiloadOrSearch1
     */
    keyword?: string
    /**
     * unitIds
     * @type string
     * @memberof InternalServerOrgAPIApiloadOrSearch1
     */
    unitIds?: string
    /**
     * specifies the organizational unit to filter
     * @type string
     * @memberof InternalServerOrgAPIApiloadOrSearch1
     */
    filterIds?: string
    /**
     * whether to load all departments and members
     * @type boolean
     * @memberof InternalServerOrgAPIApiloadOrSearch1
     */
    all?: boolean
    /**
     * whether to search for emails
     * @type boolean
     * @memberof InternalServerOrgAPIApiloadOrSearch1
     */
    searchEmail?: boolean
}

export class ObjectInternalServerOrgAPIApi {
    private api: ObservableInternalServerOrgAPIApi

    public constructor(configuration: Configuration, requestFactory?: InternalServerOrgAPIApiRequestFactory, responseProcessor?: InternalServerOrgAPIApiResponseProcessor) {
        this.api = new ObservableInternalServerOrgAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10
     * Load/search departments and members
     * @param param the request object
     */
    public loadOrSearch1WithHttpInfo(param: InternalServerOrgAPIApiLoadOrSearch1Request, options?: Configuration): Promise<HttpInfo<ResponseDataListUnitInfoVo>> {
        return this.api.loadOrSearch1WithHttpInfo(param.params, param.xSpaceId, param.userId, param.keyword, param.unitIds, param.filterIds, param.all, param.searchEmail,  options).toPromise();
    }

    /**
     * The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10
     * Load/search departments and members
     * @param param the request object
     */
    public loadOrSearch1(param: InternalServerOrgAPIApiLoadOrSearch1Request, options?: Configuration): Promise<ResponseDataListUnitInfoVo> {
        return this.api.loadOrSearch1(param.params, param.xSpaceId, param.userId, param.keyword, param.unitIds, param.filterIds, param.all, param.searchEmail,  options).toPromise();
    }

}

import { ObservableInternalServiceDataTableFieldPermissionInterfaceApi } from "./ObservableAPI";
import { InternalServiceDataTableFieldPermissionInterfaceApiRequestFactory, InternalServiceDataTableFieldPermissionInterfaceApiResponseProcessor} from "../apis/InternalServiceDataTableFieldPermissionInterfaceApi";

export interface InternalServiceDataTableFieldPermissionInterfaceApiDisableRolesRequest {
    /**
     * table id
     * @type ModelString
     * @memberof InternalServiceDataTableFieldPermissionInterfaceApidisableRoles
     */
    dstId: ModelString
    /**
     * list of field ids
     * @type string
     * @memberof InternalServiceDataTableFieldPermissionInterfaceApidisableRoles
     */
    fieldIds: string
}

export interface InternalServiceDataTableFieldPermissionInterfaceApiGetFieldPermissionRequest {
    /**
     * node id
     * @type string
     * @memberof InternalServiceDataTableFieldPermissionInterfaceApigetFieldPermission
     */
    nodeId: string
    /**
     * user id
     * @type string
     * @memberof InternalServiceDataTableFieldPermissionInterfaceApigetFieldPermission
     */
    userId: string
    /**
     * share id
     * @type string
     * @memberof InternalServiceDataTableFieldPermissionInterfaceApigetFieldPermission
     */
    shareId?: string
}

export interface InternalServiceDataTableFieldPermissionInterfaceApiGetMultiFieldPermissionViewsRequest {
    /**
     *
     * @type InternalPermissionRo
     * @memberof InternalServiceDataTableFieldPermissionInterfaceApigetMultiFieldPermissionViews
     */
    internalPermissionRo: InternalPermissionRo
}

export class ObjectInternalServiceDataTableFieldPermissionInterfaceApi {
    private api: ObservableInternalServiceDataTableFieldPermissionInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: InternalServiceDataTableFieldPermissionInterfaceApiRequestFactory, responseProcessor?: InternalServiceDataTableFieldPermissionInterfaceApiResponseProcessor) {
        this.api = new ObservableInternalServiceDataTableFieldPermissionInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * room layer ot delete field operation call
     * turn off multiple field permissions
     * @param param the request object
     */
    public disableRolesWithHttpInfo(param: InternalServiceDataTableFieldPermissionInterfaceApiDisableRolesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.disableRolesWithHttpInfo(param.dstId, param.fieldIds,  options).toPromise();
    }

    /**
     * room layer ot delete field operation call
     * turn off multiple field permissions
     * @param param the request object
     */
    public disableRoles(param: InternalServiceDataTableFieldPermissionInterfaceApiDisableRolesRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.disableRoles(param.dstId, param.fieldIds,  options).toPromise();
    }

    /**
     * get field permissions
     * @param param the request object
     */
    public getFieldPermissionWithHttpInfo(param: InternalServiceDataTableFieldPermissionInterfaceApiGetFieldPermissionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataFieldPermissionView>> {
        return this.api.getFieldPermissionWithHttpInfo(param.nodeId, param.userId, param.shareId,  options).toPromise();
    }

    /**
     * get field permissions
     * @param param the request object
     */
    public getFieldPermission(param: InternalServiceDataTableFieldPermissionInterfaceApiGetFieldPermissionRequest, options?: Configuration): Promise<ResponseDataFieldPermissionView> {
        return this.api.getFieldPermission(param.nodeId, param.userId, param.shareId,  options).toPromise();
    }

    /**
     * get field permission set for multiple nodes
     * @param param the request object
     */
    public getMultiFieldPermissionViewsWithHttpInfo(param: InternalServiceDataTableFieldPermissionInterfaceApiGetMultiFieldPermissionViewsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListFieldPermissionView>> {
        return this.api.getMultiFieldPermissionViewsWithHttpInfo(param.internalPermissionRo,  options).toPromise();
    }

    /**
     * get field permission set for multiple nodes
     * @param param the request object
     */
    public getMultiFieldPermissionViews(param: InternalServiceDataTableFieldPermissionInterfaceApiGetMultiFieldPermissionViewsRequest, options?: Configuration): Promise<ResponseDataListFieldPermissionView> {
        return this.api.getMultiFieldPermissionViews(param.internalPermissionRo,  options).toPromise();
    }

}

import { ObservableInternalServiceEnterpriseMicroInterfaceApi } from "./ObservableAPI";
import { InternalServiceEnterpriseMicroInterfaceApiRequestFactory, InternalServiceEnterpriseMicroInterfaceApiResponseProcessor} from "../apis/InternalServiceEnterpriseMicroInterfaceApi";

export interface InternalServiceEnterpriseMicroInterfaceApiPostPermitDelayBatchProcessRequest {
}

export class ObjectInternalServiceEnterpriseMicroInterfaceApi {
    private api: ObservableInternalServiceEnterpriseMicroInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: InternalServiceEnterpriseMicroInterfaceApiRequestFactory, responseProcessor?: InternalServiceEnterpriseMicroInterfaceApiResponseProcessor) {
        this.api = new ObservableInternalServiceEnterpriseMicroInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Batch processing pending interface license delay information
     * @param param the request object
     */
    public postPermitDelayBatchProcessWithHttpInfo(param: InternalServiceEnterpriseMicroInterfaceApiPostPermitDelayBatchProcessRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.postPermitDelayBatchProcessWithHttpInfo( options).toPromise();
    }

    /**
     * Batch processing pending interface license delay information
     * @param param the request object
     */
    public postPermitDelayBatchProcess(param: InternalServiceEnterpriseMicroInterfaceApiPostPermitDelayBatchProcessRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.postPermitDelayBatchProcess( options).toPromise();
    }

}

import { ObservableInternalServiceFieldServiceInterfaceApi } from "./ObservableAPI";
import { InternalServiceFieldServiceInterfaceApiRequestFactory, InternalServiceFieldServiceInterfaceApiResponseProcessor} from "../apis/InternalServiceFieldServiceInterfaceApi";

export interface InternalServiceFieldServiceInterfaceApiUrlContentsAwareFillRequest {
    /**
     *
     * @type UrlsWrapperRo
     * @memberof InternalServiceFieldServiceInterfaceApiurlContentsAwareFill
     */
    urlsWrapperRo: UrlsWrapperRo
}

export class ObjectInternalServiceFieldServiceInterfaceApi {
    private api: ObservableInternalServiceFieldServiceInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: InternalServiceFieldServiceInterfaceApiRequestFactory, responseProcessor?: InternalServiceFieldServiceInterfaceApiResponseProcessor) {
        this.api = new ObservableInternalServiceFieldServiceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * get url related information
     * get url related information
     * @param param the request object
     */
    public urlContentsAwareFillWithHttpInfo(param: InternalServiceFieldServiceInterfaceApiUrlContentsAwareFillRequest, options?: Configuration): Promise<HttpInfo<ResponseDataUrlAwareContentsVo>> {
        return this.api.urlContentsAwareFillWithHttpInfo(param.urlsWrapperRo,  options).toPromise();
    }

    /**
     * get url related information
     * get url related information
     * @param param the request object
     */
    public urlContentsAwareFill(param: InternalServiceFieldServiceInterfaceApiUrlContentsAwareFillRequest, options?: Configuration): Promise<ResponseDataUrlAwareContentsVo> {
        return this.api.urlContentsAwareFill(param.urlsWrapperRo,  options).toPromise();
    }

}

import { ObservableInternalServiceNodeInterfaceApi } from "./ObservableAPI";
import { InternalServiceNodeInterfaceApiRequestFactory, InternalServiceNodeInterfaceApiResponseProcessor} from "../apis/InternalServiceNodeInterfaceApi";

export interface InternalServiceNodeInterfaceApiCreateDatasheetRequest {
    /**
     *
     * @type CreateDatasheetRo
     * @memberof InternalServiceNodeInterfaceApicreateDatasheet
     */
    createDatasheetRo: CreateDatasheetRo
    /**
     *
     * @type string
     * @memberof InternalServiceNodeInterfaceApicreateDatasheet
     */
    spaceId: string
}

export interface InternalServiceNodeInterfaceApiDeleteNodeRequest {
    /**
     *
     * @type string
     * @memberof InternalServiceNodeInterfaceApideleteNode
     */
    spaceId: string
    /**
     *
     * @type string
     * @memberof InternalServiceNodeInterfaceApideleteNode
     */
    nodeId: string
}

export interface InternalServiceNodeInterfaceApiFilterRequest {
    /**
     *
     * @type string
     * @memberof InternalServiceNodeInterfaceApifilter
     */
    spaceId: string
    /**
     *
     * @type number
     * @memberof InternalServiceNodeInterfaceApifilter
     */
    type: number
    /**
     *
     * @type Array&lt;number&gt;
     * @memberof InternalServiceNodeInterfaceApifilter
     */
    nodePermissions?: Array<number>
    /**
     *
     * @type string
     * @memberof InternalServiceNodeInterfaceApifilter
     */
    keyword?: string
}

export class ObjectInternalServiceNodeInterfaceApi {
    private api: ObservableInternalServiceNodeInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: InternalServiceNodeInterfaceApiRequestFactory, responseProcessor?: InternalServiceNodeInterfaceApiResponseProcessor) {
        this.api = new ObservableInternalServiceNodeInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * create a table node
     * create a table node
     * @param param the request object
     */
    public createDatasheetWithHttpInfo(param: InternalServiceNodeInterfaceApiCreateDatasheetRequest, options?: Configuration): Promise<HttpInfo<ResponseDataCreateDatasheetVo>> {
        return this.api.createDatasheetWithHttpInfo(param.createDatasheetRo, param.spaceId,  options).toPromise();
    }

    /**
     * create a table node
     * create a table node
     * @param param the request object
     */
    public createDatasheet(param: InternalServiceNodeInterfaceApiCreateDatasheetRequest, options?: Configuration): Promise<ResponseDataCreateDatasheetVo> {
        return this.api.createDatasheet(param.createDatasheetRo, param.spaceId,  options).toPromise();
    }

    /**
     * delete node
     * delete node
     * @param param the request object
     */
    public deleteNodeWithHttpInfo(param: InternalServiceNodeInterfaceApiDeleteNodeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteNodeWithHttpInfo(param.spaceId, param.nodeId,  options).toPromise();
    }

    /**
     * delete node
     * delete node
     * @param param the request object
     */
    public deleteNode(param: InternalServiceNodeInterfaceApiDeleteNodeRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteNode(param.spaceId, param.nodeId,  options).toPromise();
    }

    /**
     * scenario: query an existing read-only dashboard
     * Get filter nodes by type, permissions and node name.
     * @param param the request object
     */
    public filterWithHttpInfo(param: InternalServiceNodeInterfaceApiFilterRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfo>> {
        return this.api.filterWithHttpInfo(param.spaceId, param.type, param.nodePermissions, param.keyword,  options).toPromise();
    }

    /**
     * scenario: query an existing read-only dashboard
     * Get filter nodes by type, permissions and node name.
     * @param param the request object
     */
    public filter(param: InternalServiceNodeInterfaceApiFilterRequest, options?: Configuration): Promise<ResponseDataListNodeInfo> {
        return this.api.filter(param.spaceId, param.type, param.nodePermissions, param.keyword,  options).toPromise();
    }

}

import { ObservableInternalServiceNodePermissionInterfaceApi } from "./ObservableAPI";
import { InternalServiceNodePermissionInterfaceApiRequestFactory, InternalServiceNodePermissionInterfaceApiResponseProcessor} from "../apis/InternalServiceNodePermissionInterfaceApi";

export interface InternalServiceNodePermissionInterfaceApiGetMultiNodePermissionsRequest {
    /**
     *
     * @type InternalPermissionRo
     * @memberof InternalServiceNodePermissionInterfaceApigetMultiNodePermissions
     */
    internalPermissionRo: InternalPermissionRo
}

export interface InternalServiceNodePermissionInterfaceApiGetNodePermissionRequest {
    /**
     * Node ID
     * @type string
     * @memberof InternalServiceNodePermissionInterfaceApigetNodePermission
     */
    nodeId: string
    /**
     * Share ID
     * @type string
     * @memberof InternalServiceNodePermissionInterfaceApigetNodePermission
     */
    shareId?: string
}

export class ObjectInternalServiceNodePermissionInterfaceApi {
    private api: ObservableInternalServiceNodePermissionInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: InternalServiceNodePermissionInterfaceApiRequestFactory, responseProcessor?: InternalServiceNodePermissionInterfaceApiResponseProcessor) {
        this.api = new ObservableInternalServiceNodePermissionInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get permission set for multiple nodes
     * @param param the request object
     */
    public getMultiNodePermissionsWithHttpInfo(param: InternalServiceNodePermissionInterfaceApiGetMultiNodePermissionsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListDatasheetPermissionView>> {
        return this.api.getMultiNodePermissionsWithHttpInfo(param.internalPermissionRo,  options).toPromise();
    }

    /**
     * Get permission set for multiple nodes
     * @param param the request object
     */
    public getMultiNodePermissions(param: InternalServiceNodePermissionInterfaceApiGetMultiNodePermissionsRequest, options?: Configuration): Promise<ResponseDataListDatasheetPermissionView> {
        return this.api.getMultiNodePermissions(param.internalPermissionRo,  options).toPromise();
    }

    /**
     * Get Node permission
     * @param param the request object
     */
    public getNodePermissionWithHttpInfo(param: InternalServiceNodePermissionInterfaceApiGetNodePermissionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataDatasheetPermissionView>> {
        return this.api.getNodePermissionWithHttpInfo(param.nodeId, param.shareId,  options).toPromise();
    }

    /**
     * Get Node permission
     * @param param the request object
     */
    public getNodePermission(param: InternalServiceNodePermissionInterfaceApiGetNodePermissionRequest, options?: Configuration): Promise<ResponseDataDatasheetPermissionView> {
        return this.api.getNodePermission(param.nodeId, param.shareId,  options).toPromise();
    }

}

import { ObservableInternalServiceNotificationInterfaceApi } from "./ObservableAPI";
import { InternalServiceNotificationInterfaceApiRequestFactory, InternalServiceNotificationInterfaceApiResponseProcessor} from "../apis/InternalServiceNotificationInterfaceApi";

export interface InternalServiceNotificationInterfaceApiCreate7Request {
    /**
     *
     * @type Array&lt;NotificationCreateRo&gt;
     * @memberof InternalServiceNotificationInterfaceApicreate7
     */
    notificationCreateRo: Array<NotificationCreateRo>
}

export class ObjectInternalServiceNotificationInterfaceApi {
    private api: ObservableInternalServiceNotificationInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: InternalServiceNotificationInterfaceApiRequestFactory, responseProcessor?: InternalServiceNotificationInterfaceApiResponseProcessor) {
        this.api = new ObservableInternalServiceNotificationInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * send a message
     * send a message
     * @param param the request object
     */
    public create7WithHttpInfo(param: InternalServiceNotificationInterfaceApiCreate7Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.create7WithHttpInfo(param.notificationCreateRo,  options).toPromise();
    }

    /**
     * send a message
     * send a message
     * @param param the request object
     */
    public create7(param: InternalServiceNotificationInterfaceApiCreate7Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.create7(param.notificationCreateRo,  options).toPromise();
    }

}

import { ObservableInternalServiceSpaceInterfaceApi } from "./ObservableAPI";
import { InternalServiceSpaceInterfaceApiRequestFactory, InternalServiceSpaceInterfaceApiResponseProcessor} from "../apis/InternalServiceSpaceInterfaceApi";

export interface InternalServiceSpaceInterfaceApiApiRateLimitRequest {
    /**
     *
     * @type string
     * @memberof InternalServiceSpaceInterfaceApiapiRateLimit
     */
    spaceId: string
}

export interface InternalServiceSpaceInterfaceApiApiUsagesRequest {
    /**
     *
     * @type string
     * @memberof InternalServiceSpaceInterfaceApiapiUsages
     */
    spaceId: string
}

export interface InternalServiceSpaceInterfaceApiGetAutomationRunMessageRequest {
    /**
     * space id
     * @type string
     * @memberof InternalServiceSpaceInterfaceApigetAutomationRunMessage
     */
    spaceId: string
}

export interface InternalServiceSpaceInterfaceApiGetCreditUsages1Request {
    /**
     * space id
     * @type string
     * @memberof InternalServiceSpaceInterfaceApigetCreditUsages1
     */
    spaceId: string
}

export interface InternalServiceSpaceInterfaceApiGetSpaceCapacityRequest {
    /**
     * space id
     * @type string
     * @memberof InternalServiceSpaceInterfaceApigetSpaceCapacity
     */
    spaceId: string
}

export interface InternalServiceSpaceInterfaceApiGetSpaceSubscriptionRequest {
    /**
     * space id
     * @type string
     * @memberof InternalServiceSpaceInterfaceApigetSpaceSubscription
     */
    spaceId: string
}

export interface InternalServiceSpaceInterfaceApiGetSpaceUsagesRequest {
    /**
     * space id
     * @type string
     * @memberof InternalServiceSpaceInterfaceApigetSpaceUsages
     */
    spaceId: string
}

export interface InternalServiceSpaceInterfaceApiLabsRequest {
    /**
     *
     * @type string
     * @memberof InternalServiceSpaceInterfaceApilabs
     */
    spaceId: string
}

export interface InternalServiceSpaceInterfaceApiStatisticsRequest {
    /**
     *
     * @type SpaceStatisticsRo
     * @memberof InternalServiceSpaceInterfaceApistatistics
     */
    spaceStatisticsRo: SpaceStatisticsRo
    /**
     *
     * @type string
     * @memberof InternalServiceSpaceInterfaceApistatistics
     */
    spaceId: string
}

export class ObjectInternalServiceSpaceInterfaceApi {
    private api: ObservableInternalServiceSpaceInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: InternalServiceSpaceInterfaceApiRequestFactory, responseProcessor?: InternalServiceSpaceInterfaceApiResponseProcessor) {
        this.api = new ObservableInternalServiceSpaceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API aps information in the subscription plan corresponding to the space.
     * get api qps information of a specified space
     * @param param the request object
     */
    public apiRateLimitWithHttpInfo(param: InternalServiceSpaceInterfaceApiApiRateLimitRequest, options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceApiRateLimitVo>> {
        return this.api.apiRateLimitWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API aps information in the subscription plan corresponding to the space.
     * get api qps information of a specified space
     * @param param the request object
     */
    public apiRateLimit(param: InternalServiceSpaceInterfaceApiApiRateLimitRequest, options?: Configuration): Promise<ResponseDataInternalSpaceApiRateLimitVo> {
        return this.api.apiRateLimit(param.spaceId,  options).toPromise();
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API usage information in the subscription plan corresponding to the space.
     * get api usage information of a specified space
     * @param param the request object
     */
    public apiUsagesWithHttpInfo(param: InternalServiceSpaceInterfaceApiApiUsagesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceApiUsageVo>> {
        return this.api.apiUsagesWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API usage information in the subscription plan corresponding to the space.
     * get api usage information of a specified space
     * @param param the request object
     */
    public apiUsages(param: InternalServiceSpaceInterfaceApiApiUsagesRequest, options?: Configuration): Promise<ResponseDataInternalSpaceApiUsageVo> {
        return this.api.apiUsages(param.spaceId,  options).toPromise();
    }

    /**
     * get space automation run message
     * @param param the request object
     */
    public getAutomationRunMessageWithHttpInfo(param: InternalServiceSpaceInterfaceApiGetAutomationRunMessageRequest, options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceAutomationRunMessageV0>> {
        return this.api.getAutomationRunMessageWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * get space automation run message
     * @param param the request object
     */
    public getAutomationRunMessage(param: InternalServiceSpaceInterfaceApiGetAutomationRunMessageRequest, options?: Configuration): Promise<ResponseDataInternalSpaceAutomationRunMessageV0> {
        return this.api.getAutomationRunMessage(param.spaceId,  options).toPromise();
    }

    /**
     * get space credit used usage
     * @param param the request object
     */
    public getCreditUsages1WithHttpInfo(param: InternalServiceSpaceInterfaceApiGetCreditUsages1Request, options?: Configuration): Promise<HttpInfo<ResponseDataInternalCreditUsageVo>> {
        return this.api.getCreditUsages1WithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * get space credit used usage
     * @param param the request object
     */
    public getCreditUsages1(param: InternalServiceSpaceInterfaceApiGetCreditUsages1Request, options?: Configuration): Promise<ResponseDataInternalCreditUsageVo> {
        return this.api.getCreditUsages1(param.spaceId,  options).toPromise();
    }

    /**
     * get attachment capacity information for a space
     * @param param the request object
     */
    public getSpaceCapacityWithHttpInfo(param: InternalServiceSpaceInterfaceApiGetSpaceCapacityRequest, options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceCapacityVo>> {
        return this.api.getSpaceCapacityWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * get attachment capacity information for a space
     * @param param the request object
     */
    public getSpaceCapacity(param: InternalServiceSpaceInterfaceApiGetSpaceCapacityRequest, options?: Configuration): Promise<ResponseDataInternalSpaceCapacityVo> {
        return this.api.getSpaceCapacity(param.spaceId,  options).toPromise();
    }

    /**
     * get subscription information for a space
     * @param param the request object
     */
    public getSpaceSubscriptionWithHttpInfo(param: InternalServiceSpaceInterfaceApiGetSpaceSubscriptionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceSubscriptionVo>> {
        return this.api.getSpaceSubscriptionWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * get subscription information for a space
     * @param param the request object
     */
    public getSpaceSubscription(param: InternalServiceSpaceInterfaceApiGetSpaceSubscriptionRequest, options?: Configuration): Promise<ResponseDataInternalSpaceSubscriptionVo> {
        return this.api.getSpaceSubscription(param.spaceId,  options).toPromise();
    }

    /**
     * get space used usage information
     * @param param the request object
     */
    public getSpaceUsagesWithHttpInfo(param: InternalServiceSpaceInterfaceApiGetSpaceUsagesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceUsageVo>> {
        return this.api.getSpaceUsagesWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * get space used usage information
     * @param param the request object
     */
    public getSpaceUsages(param: InternalServiceSpaceInterfaceApiGetSpaceUsagesRequest, options?: Configuration): Promise<ResponseDataInternalSpaceUsageVo> {
        return this.api.getSpaceUsages(param.spaceId,  options).toPromise();
    }

    /**
     * get space information
     * @param param the request object
     */
    public labsWithHttpInfo(param: InternalServiceSpaceInterfaceApiLabsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceInfoVo>> {
        return this.api.labsWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * get space information
     * @param param the request object
     */
    public labs(param: InternalServiceSpaceInterfaceApiLabsRequest, options?: Configuration): Promise<ResponseDataInternalSpaceInfoVo> {
        return this.api.labs(param.spaceId,  options).toPromise();
    }

    /**
     * get space information
     * @param param the request object
     */
    public statisticsWithHttpInfo(param: InternalServiceSpaceInterfaceApiStatisticsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.statisticsWithHttpInfo(param.spaceStatisticsRo, param.spaceId,  options).toPromise();
    }

    /**
     * get space information
     * @param param the request object
     */
    public statistics(param: InternalServiceSpaceInterfaceApiStatisticsRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.statistics(param.spaceStatisticsRo, param.spaceId,  options).toPromise();
    }

}

import { ObservableInternalServiceUserInterfaceApi } from "./ObservableAPI";
import { InternalServiceUserInterfaceApiRequestFactory, InternalServiceUserInterfaceApiResponseProcessor} from "../apis/InternalServiceUserInterfaceApi";

export interface InternalServiceUserInterfaceApiClosePausedUserAccountRequest {
    /**
     *
     * @type number
     * @memberof InternalServiceUserInterfaceApiclosePausedUserAccount
     */
    userId: number
}

export interface InternalServiceUserInterfaceApiGetPausedUsersRequest {
}

export interface InternalServiceUserInterfaceApiGetUserHistoriesRequest {
    /**
     *
     * @type PausedUserHistoryRo
     * @memberof InternalServiceUserInterfaceApigetUserHistories
     */
    pausedUserHistoryRo: PausedUserHistoryRo
}

export interface InternalServiceUserInterfaceApiMeSessionRequest {
}

export interface InternalServiceUserInterfaceApiUserBaseInfoRequest {
}

export class ObjectInternalServiceUserInterfaceApi {
    private api: ObservableInternalServiceUserInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: InternalServiceUserInterfaceApiRequestFactory, responseProcessor?: InternalServiceUserInterfaceApiResponseProcessor) {
        this.api = new ObservableInternalServiceUserInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Close and log off the cooling-off period user account
     * Close and log off the cooling-off period user account
     * @param param the request object
     */
    public closePausedUserAccountWithHttpInfo(param: InternalServiceUserInterfaceApiClosePausedUserAccountRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        return this.api.closePausedUserAccountWithHttpInfo(param.userId,  options).toPromise();
    }

    /**
     * Close and log off the cooling-off period user account
     * Close and log off the cooling-off period user account
     * @param param the request object
     */
    public closePausedUserAccount(param: InternalServiceUserInterfaceApiClosePausedUserAccountRequest, options?: Configuration): Promise<ResponseDataBoolean> {
        return this.api.closePausedUserAccount(param.userId,  options).toPromise();
    }

    /**
     * get cooling off users
     * get cooling off users
     * @param param the request object
     */
    public getPausedUsersWithHttpInfo(param: InternalServiceUserInterfaceApiGetPausedUsersRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListUserInPausedDto>> {
        return this.api.getPausedUsersWithHttpInfo( options).toPromise();
    }

    /**
     * get cooling off users
     * get cooling off users
     * @param param the request object
     */
    public getPausedUsers(param: InternalServiceUserInterfaceApiGetPausedUsersRequest = {}, options?: Configuration): Promise<ResponseDataListUserInPausedDto> {
        return this.api.getPausedUsers( options).toPromise();
    }

    /**
     * get the cooling-off period user operation record
     * get the cooling-off period user operation record
     * @param param the request object
     */
    public getUserHistoriesWithHttpInfo(param: InternalServiceUserInterfaceApiGetUserHistoriesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListPausedUserHistoryDto>> {
        return this.api.getUserHistoriesWithHttpInfo(param.pausedUserHistoryRo,  options).toPromise();
    }

    /**
     * get the cooling-off period user operation record
     * get the cooling-off period user operation record
     * @param param the request object
     */
    public getUserHistories(param: InternalServiceUserInterfaceApiGetUserHistoriesRequest, options?: Configuration): Promise<ResponseDataListPausedUserHistoryDto> {
        return this.api.getUserHistories(param.pausedUserHistoryRo,  options).toPromise();
    }

    /**
     * get the necessary information
     * check whether logged in
     * @param param the request object
     */
    public meSessionWithHttpInfo(param: InternalServiceUserInterfaceApiMeSessionRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        return this.api.meSessionWithHttpInfo( options).toPromise();
    }

    /**
     * get the necessary information
     * check whether logged in
     * @param param the request object
     */
    public meSession(param: InternalServiceUserInterfaceApiMeSessionRequest = {}, options?: Configuration): Promise<ResponseDataBoolean> {
        return this.api.meSession( options).toPromise();
    }

    /**
     * get the necessary information
     * get the necessary information
     * @param param the request object
     */
    public userBaseInfoWithHttpInfo(param: InternalServiceUserInterfaceApiUserBaseInfoRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataUserBaseInfoVo>> {
        return this.api.userBaseInfoWithHttpInfo( options).toPromise();
    }

    /**
     * get the necessary information
     * get the necessary information
     * @param param the request object
     */
    public userBaseInfo(param: InternalServiceUserInterfaceApiUserBaseInfoRequest = {}, options?: Configuration): Promise<ResponseDataUserBaseInfoVo> {
        return this.api.userBaseInfo( options).toPromise();
    }

}

import { ObservableK11LoginInterfaceApi } from "./ObservableAPI";
import { K11LoginInterfaceApiRequestFactory, K11LoginInterfaceApiResponseProcessor} from "../apis/K11LoginInterfaceApi";

export interface K11LoginInterfaceApiLoginBySsoTokenRequest {
    /**
     *
     * @type string
     * @memberof K11LoginInterfaceApiloginBySsoToken
     */
    token: string
}

export class ObjectK11LoginInterfaceApi {
    private api: ObservableK11LoginInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: K11LoginInterfaceApiRequestFactory, responseProcessor?: K11LoginInterfaceApiResponseProcessor) {
        this.api = new ObservableK11LoginInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * k11 Synchronous login with token
     * @param param the request object
     */
    public loginBySsoTokenWithHttpInfo(param: K11LoginInterfaceApiLoginBySsoTokenRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.loginBySsoTokenWithHttpInfo(param.token,  options).toPromise();
    }

    /**
     * k11 Synchronous login with token
     * @param param the request object
     */
    public loginBySsoToken(param: K11LoginInterfaceApiLoginBySsoTokenRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.loginBySsoToken(param.token,  options).toPromise();
    }

}

import { ObservableLaboratoryModuleExperimentalFunctionInterfaceApi } from "./ObservableAPI";
import { LaboratoryModuleExperimentalFunctionInterfaceApiRequestFactory, LaboratoryModuleExperimentalFunctionInterfaceApiResponseProcessor} from "../apis/LaboratoryModuleExperimentalFunctionInterfaceApi";

export interface LaboratoryModuleExperimentalFunctionInterfaceApiShowAvailableLabsFeaturesRequest {
}

export class ObjectLaboratoryModuleExperimentalFunctionInterfaceApi {
    private api: ObservableLaboratoryModuleExperimentalFunctionInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: LaboratoryModuleExperimentalFunctionInterfaceApiRequestFactory, responseProcessor?: LaboratoryModuleExperimentalFunctionInterfaceApiResponseProcessor) {
        this.api = new ObservableLaboratoryModuleExperimentalFunctionInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get Lab Function List
     * @param param the request object
     */
    public showAvailableLabsFeaturesWithHttpInfo(param: LaboratoryModuleExperimentalFunctionInterfaceApiShowAvailableLabsFeaturesRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataUserSpaceLabsFeatureVo>> {
        return this.api.showAvailableLabsFeaturesWithHttpInfo( options).toPromise();
    }

    /**
     * Get Lab Function List
     * @param param the request object
     */
    public showAvailableLabsFeatures(param: LaboratoryModuleExperimentalFunctionInterfaceApiShowAvailableLabsFeaturesRequest = {}, options?: Configuration): Promise<ResponseDataUserSpaceLabsFeatureVo> {
        return this.api.showAvailableLabsFeatures( options).toPromise();
    }

}

import { ObservableLarkInterfaceApi } from "./ObservableAPI";
import { LarkInterfaceApiRequestFactory, LarkInterfaceApiResponseProcessor} from "../apis/LarkInterfaceApi";

export interface LarkInterfaceApiChangeAdminRequest {
    /**
     *
     * @type FeishuTenantMainAdminChangeRo
     * @memberof LarkInterfaceApichangeAdmin
     */
    feishuTenantMainAdminChangeRo: FeishuTenantMainAdminChangeRo
}

export interface LarkInterfaceApiGetTenantInfo1Request {
    /**
     * Lark Tenant ID
     * @type string
     * @memberof LarkInterfaceApigetTenantInfo1
     */
    tenantKey: string
}

export class ObjectLarkInterfaceApi {
    private api: ObservableLarkInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: LarkInterfaceApiRequestFactory, responseProcessor?: LarkInterfaceApiResponseProcessor) {
        this.api = new ObservableLarkInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Replace the master administrator
     * Tenant space replacement master administrator
     * @param param the request object
     */
    public changeAdminWithHttpInfo(param: LarkInterfaceApiChangeAdminRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.changeAdminWithHttpInfo(param.feishuTenantMainAdminChangeRo,  options).toPromise();
    }

    /**
     * Replace the master administrator
     * Tenant space replacement master administrator
     * @param param the request object
     */
    public changeAdmin(param: LarkInterfaceApiChangeAdminRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.changeAdmin(param.feishuTenantMainAdminChangeRo,  options).toPromise();
    }

    /**
     * Get the space information bound by the tenant
     * Get tenant binding information
     * @param param the request object
     */
    public getTenantInfo1WithHttpInfo(param: LarkInterfaceApiGetTenantInfo1Request, options?: Configuration): Promise<HttpInfo<ResponseDataFeishuTenantDetailVO>> {
        return this.api.getTenantInfo1WithHttpInfo(param.tenantKey,  options).toPromise();
    }

    /**
     * Get the space information bound by the tenant
     * Get tenant binding information
     * @param param the request object
     */
    public getTenantInfo1(param: LarkInterfaceApiGetTenantInfo1Request, options?: Configuration): Promise<ResponseDataFeishuTenantDetailVO> {
        return this.api.getTenantInfo1(param.tenantKey,  options).toPromise();
    }

}

import { ObservableMigrationResourcesAPIApi } from "./ObservableAPI";
import { MigrationResourcesAPIApiRequestFactory, MigrationResourcesAPIApiResponseProcessor} from "../apis/MigrationResourcesAPIApi";

export interface MigrationResourcesAPIApiMigrationResourcesRequest {
    /**
     *
     * @type MigrationResourcesRo
     * @memberof MigrationResourcesAPIApimigrationResources
     */
    migrationResourcesRo: MigrationResourcesRo
}

export class ObjectMigrationResourcesAPIApi {
    private api: ObservableMigrationResourcesAPIApi

    public constructor(configuration: Configuration, requestFactory?: MigrationResourcesAPIApiRequestFactory, responseProcessor?: MigrationResourcesAPIApiResponseProcessor) {
        this.api = new ObservableMigrationResourcesAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * migration resources
     * @param param the request object
     */
    public migrationResourcesWithHttpInfo(param: MigrationResourcesAPIApiMigrationResourcesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.migrationResourcesWithHttpInfo(param.migrationResourcesRo,  options).toPromise();
    }

    /**
     * migration resources
     * @param param the request object
     */
    public migrationResources(param: MigrationResourcesAPIApiMigrationResourcesRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.migrationResources(param.migrationResourcesRo,  options).toPromise();
    }

}

import { ObservableOfficeOperationAPIApi } from "./ObservableAPI";
import { OfficeOperationAPIApiRequestFactory, OfficeOperationAPIApiResponseProcessor} from "../apis/OfficeOperationAPIApi";

export interface OfficeOperationAPIApiOfficePreviewRequest {
    /**
     *
     * @type AttachOfficePreviewRo
     * @memberof OfficeOperationAPIApiofficePreview
     */
    attachOfficePreviewRo: AttachOfficePreviewRo
    /**
     *
     * @type string
     * @memberof OfficeOperationAPIApiofficePreview
     */
    spaceId: string
}

export class ObjectOfficeOperationAPIApi {
    private api: ObservableOfficeOperationAPIApi

    public constructor(configuration: Configuration, requestFactory?: OfficeOperationAPIApiRequestFactory, responseProcessor?: OfficeOperationAPIApiResponseProcessor) {
        this.api = new ObservableOfficeOperationAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Office document preview conversion,call Yongzhong office conversion interface
     * Office document preview conversion
     * @param param the request object
     */
    public officePreviewWithHttpInfo(param: OfficeOperationAPIApiOfficePreviewRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.officePreviewWithHttpInfo(param.attachOfficePreviewRo, param.spaceId,  options).toPromise();
    }

    /**
     * Office document preview conversion,call Yongzhong office conversion interface
     * Office document preview conversion
     * @param param the request object
     */
    public officePreview(param: OfficeOperationAPIApiOfficePreviewRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.officePreview(param.attachOfficePreviewRo, param.spaceId,  options).toPromise();
    }

}

import { ObservableOpenApiApi } from "./ObservableAPI";
import { OpenApiApiRequestFactory, OpenApiApiResponseProcessor} from "../apis/OpenApiApi";

export interface OpenApiApiValidateApiKey1Request {
    /**
     *
     * @type string
     * @memberof OpenApiApivalidateApiKey1
     */
    widgetId: string
}

export class ObjectOpenApiApi {
    private api: ObservableOpenApiApi

    public constructor(configuration: Configuration, requestFactory?: OpenApiApiRequestFactory, responseProcessor?: OpenApiApiResponseProcessor) {
        this.api = new ObservableOpenApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get information that the applet can expose
     * Get information that the applet can expose
     * @param param the request object
     */
    public validateApiKey1WithHttpInfo(param: OpenApiApiValidateApiKey1Request, options?: Configuration): Promise<HttpInfo<ResponseDataWidgetInfoVo>> {
        return this.api.validateApiKey1WithHttpInfo(param.widgetId,  options).toPromise();
    }

    /**
     * Get information that the applet can expose
     * Get information that the applet can expose
     * @param param the request object
     */
    public validateApiKey1(param: OpenApiApiValidateApiKey1Request, options?: Configuration): Promise<ResponseDataWidgetInfoVo> {
        return this.api.validateApiKey1(param.widgetId,  options).toPromise();
    }

}

import { ObservablePlayerSystemActivityAPIApi } from "./ObservableAPI";
import { PlayerSystemActivityAPIApiRequestFactory, PlayerSystemActivityAPIApiResponseProcessor} from "../apis/PlayerSystemActivityAPIApi";

export interface PlayerSystemActivityAPIApiTriggerWizardRequest {
    /**
     *
     * @type ActivityStatusRo
     * @memberof PlayerSystemActivityAPIApitriggerWizard
     */
    activityStatusRo: ActivityStatusRo
}

export class ObjectPlayerSystemActivityAPIApi {
    private api: ObservablePlayerSystemActivityAPIApi

    public constructor(configuration: Configuration, requestFactory?: PlayerSystemActivityAPIApiRequestFactory, responseProcessor?: PlayerSystemActivityAPIApiResponseProcessor) {
        this.api = new ObservablePlayerSystemActivityAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Scene: After triggering the guided click event, modify the state or the cumulative number of times.
     * Trigger Wizard
     * @param param the request object
     */
    public triggerWizardWithHttpInfo(param: PlayerSystemActivityAPIApiTriggerWizardRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.triggerWizardWithHttpInfo(param.activityStatusRo,  options).toPromise();
    }

    /**
     * Scene: After triggering the guided click event, modify the state or the cumulative number of times.
     * Trigger Wizard
     * @param param the request object
     */
    public triggerWizard(param: PlayerSystemActivityAPIApiTriggerWizardRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.triggerWizard(param.activityStatusRo,  options).toPromise();
    }

}

import { ObservablePlayerSystemNotificationAPIApi } from "./ObservableAPI";
import { PlayerSystemNotificationAPIApiRequestFactory, PlayerSystemNotificationAPIApiResponseProcessor} from "../apis/PlayerSystemNotificationAPIApi";

export interface PlayerSystemNotificationAPIApiCreate5Request {
    /**
     *
     * @type Array&lt;NotificationCreateRo&gt;
     * @memberof PlayerSystemNotificationAPIApicreate5
     */
    notificationCreateRo: Array<NotificationCreateRo>
}

export interface PlayerSystemNotificationAPIApiDelete10Request {
    /**
     *
     * @type NotificationReadRo
     * @memberof PlayerSystemNotificationAPIApidelete10
     */
    notificationReadRo: NotificationReadRo
}

export interface PlayerSystemNotificationAPIApiList4Request {
    /**
     *
     * @type NotificationListRo
     * @memberof PlayerSystemNotificationAPIApilist4
     */
    notificationListRo: NotificationListRo
}

export interface PlayerSystemNotificationAPIApiPage3Request {
    /**
     *
     * @type NotificationPageRo
     * @memberof PlayerSystemNotificationAPIApipage3
     */
    notificationPageRo: NotificationPageRo
}

export interface PlayerSystemNotificationAPIApiReadRequest {
    /**
     *
     * @type NotificationReadRo
     * @memberof PlayerSystemNotificationAPIApiread
     */
    notificationReadRo: NotificationReadRo
}

export interface PlayerSystemNotificationAPIApiStatistics1Request {
}

export class ObjectPlayerSystemNotificationAPIApi {
    private api: ObservablePlayerSystemNotificationAPIApi

    public constructor(configuration: Configuration, requestFactory?: PlayerSystemNotificationAPIApiRequestFactory, responseProcessor?: PlayerSystemNotificationAPIApiResponseProcessor) {
        this.api = new ObservablePlayerSystemNotificationAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Notification
     * @param param the request object
     */
    public create5WithHttpInfo(param: PlayerSystemNotificationAPIApiCreate5Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.create5WithHttpInfo(param.notificationCreateRo,  options).toPromise();
    }

    /**
     * Create Notification
     * @param param the request object
     */
    public create5(param: PlayerSystemNotificationAPIApiCreate5Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.create5(param.notificationCreateRo,  options).toPromise();
    }

    /**
     * Delete Notification
     * @param param the request object
     */
    public delete10WithHttpInfo(param: PlayerSystemNotificationAPIApiDelete10Request, options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        return this.api.delete10WithHttpInfo(param.notificationReadRo,  options).toPromise();
    }

    /**
     * Delete Notification
     * @param param the request object
     */
    public delete10(param: PlayerSystemNotificationAPIApiDelete10Request, options?: Configuration): Promise<ResponseDataBoolean> {
        return this.api.delete10(param.notificationReadRo,  options).toPromise();
    }

    /**
     * Default: System Notification
     * Get Notification Detail List
     * @param param the request object
     */
    public list4WithHttpInfo(param: PlayerSystemNotificationAPIApiList4Request, options?: Configuration): Promise<HttpInfo<ResponseDataListNotificationDetailVo>> {
        return this.api.list4WithHttpInfo(param.notificationListRo,  options).toPromise();
    }

    /**
     * Default: System Notification
     * Get Notification Detail List
     * @param param the request object
     */
    public list4(param: PlayerSystemNotificationAPIApiList4Request, options?: Configuration): Promise<ResponseDataListNotificationDetailVo> {
        return this.api.list4(param.notificationListRo,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Get Notification Page Info
     * @param param the request object
     */
    public page3WithHttpInfo(param: PlayerSystemNotificationAPIApiPage3Request, options?: Configuration): Promise<HttpInfo<ResponseDataListNotificationDetailVo>> {
        return this.api.page3WithHttpInfo(param.notificationPageRo,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Get Notification Page Info
     * @param param the request object
     */
    public page3(param: PlayerSystemNotificationAPIApiPage3Request, options?: Configuration): Promise<ResponseDataListNotificationDetailVo> {
        return this.api.page3(param.notificationPageRo,  options).toPromise();
    }

    /**
     * Mark Notification Read
     * @param param the request object
     */
    public readWithHttpInfo(param: PlayerSystemNotificationAPIApiReadRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        return this.api.readWithHttpInfo(param.notificationReadRo,  options).toPromise();
    }

    /**
     * Mark Notification Read
     * @param param the request object
     */
    public read(param: PlayerSystemNotificationAPIApiReadRequest, options?: Configuration): Promise<ResponseDataBoolean> {
        return this.api.read(param.notificationReadRo,  options).toPromise();
    }

    /**
     * Get Notification\' Statistics
     * @param param the request object
     */
    public statistics1WithHttpInfo(param: PlayerSystemNotificationAPIApiStatistics1Request = {}, options?: Configuration): Promise<HttpInfo<ResponseDataNotificationStatisticsVo>> {
        return this.api.statistics1WithHttpInfo( options).toPromise();
    }

    /**
     * Get Notification\' Statistics
     * @param param the request object
     */
    public statistics1(param: PlayerSystemNotificationAPIApiStatistics1Request = {}, options?: Configuration): Promise<ResponseDataNotificationStatisticsVo> {
        return this.api.statistics1( options).toPromise();
    }

}

import { ObservableProductControllerApi } from "./ObservableAPI";
import { ProductControllerApiRequestFactory, ProductControllerApiResponseProcessor} from "../apis/ProductControllerApi";

export interface ProductControllerApiGetListRequest {
}

export class ObjectProductControllerApi {
    private api: ObservableProductControllerApi

    public constructor(configuration: Configuration, requestFactory?: ProductControllerApiRequestFactory, responseProcessor?: ProductControllerApiResponseProcessor) {
        this.api = new ObservableProductControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public getListWithHttpInfo(param: ProductControllerApiGetListRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListProductVO>> {
        return this.api.getListWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getList(param: ProductControllerApiGetListRequest = {}, options?: Configuration): Promise<ResponseDataListProductVO> {
        return this.api.getList( options).toPromise();
    }

}

import { ObservableProductOperationSystemAPIApi } from "./ObservableAPI";
import { ProductOperationSystemAPIApiRequestFactory, ProductOperationSystemAPIApiResponseProcessor} from "../apis/ProductOperationSystemAPIApi";

export interface ProductOperationSystemAPIApiMarkTemplateAssetRequest {
    /**
     * Template Custom ID
     * @type string
     * @memberof ProductOperationSystemAPIApimarkTemplateAsset
     */
    templateId: string
    /**
     * Whether it is a reverse operation, that is, cancel the flag (default false)
     * @type boolean
     * @memberof ProductOperationSystemAPIApimarkTemplateAsset
     */
    isReversed?: boolean
}

export class ObjectProductOperationSystemAPIApi {
    private api: ObservableProductOperationSystemAPIApi

    public constructor(configuration: Configuration, requestFactory?: ProductOperationSystemAPIApiRequestFactory, responseProcessor?: ProductOperationSystemAPIApiResponseProcessor) {
        this.api = new ObservableProductOperationSystemAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Indicates the attachment resource of the specified template. Users refer to this part of the resource without occupying the space station capacity
     * Template Asset Remark
     * @param param the request object
     */
    public markTemplateAssetWithHttpInfo(param: ProductOperationSystemAPIApiMarkTemplateAssetRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.markTemplateAssetWithHttpInfo(param.templateId, param.isReversed,  options).toPromise();
    }

    /**
     * Indicates the attachment resource of the specified template. Users refer to this part of the resource without occupying the space station capacity
     * Template Asset Remark
     * @param param the request object
     */
    public markTemplateAsset(param: ProductOperationSystemAPIApiMarkTemplateAssetRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.markTemplateAsset(param.templateId, param.isReversed,  options).toPromise();
    }

}

import { ObservableProductOperationSystemTemplateAPIApi } from "./ObservableAPI";
import { ProductOperationSystemTemplateAPIApiRequestFactory, ProductOperationSystemTemplateAPIApiResponseProcessor} from "../apis/ProductOperationSystemTemplateAPIApi";

export interface ProductOperationSystemTemplateAPIApiCreateTemplateCategoryRequest {
    /**
     *
     * @type TemplateCategoryCreateRo
     * @memberof ProductOperationSystemTemplateAPIApicreateTemplateCategory
     */
    templateCategoryCreateRo: TemplateCategoryCreateRo
}

export interface ProductOperationSystemTemplateAPIApiDeleteTemplateCategoryRequest {
    /**
     *
     * @type string
     * @memberof ProductOperationSystemTemplateAPIApideleteTemplateCategory
     */
    categoryCode: string
}

export interface ProductOperationSystemTemplateAPIApiPublishRequest {
    /**
     *
     * @type TemplatePublishRo
     * @memberof ProductOperationSystemTemplateAPIApipublish
     */
    templatePublishRo: TemplatePublishRo
    /**
     * template id
     * @type string
     * @memberof ProductOperationSystemTemplateAPIApipublish
     */
    templateId: string
}

export interface ProductOperationSystemTemplateAPIApiUnpublishRequest {
    /**
     *
     * @type TemplateUnpublishRo
     * @memberof ProductOperationSystemTemplateAPIApiunpublish
     */
    templateUnpublishRo: TemplateUnpublishRo
    /**
     * template id
     * @type string
     * @memberof ProductOperationSystemTemplateAPIApiunpublish
     */
    templateId: string
}

export class ObjectProductOperationSystemTemplateAPIApi {
    private api: ObservableProductOperationSystemTemplateAPIApi

    public constructor(configuration: Configuration, requestFactory?: ProductOperationSystemTemplateAPIApiRequestFactory, responseProcessor?: ProductOperationSystemTemplateAPIApiResponseProcessor) {
        this.api = new ObservableProductOperationSystemTemplateAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Only supply to people in template space
     * Create Template Category
     * @param param the request object
     */
    public createTemplateCategoryWithHttpInfo(param: ProductOperationSystemTemplateAPIApiCreateTemplateCategoryRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.createTemplateCategoryWithHttpInfo(param.templateCategoryCreateRo,  options).toPromise();
    }

    /**
     * Only supply to people in template space
     * Create Template Category
     * @param param the request object
     */
    public createTemplateCategory(param: ProductOperationSystemTemplateAPIApiCreateTemplateCategoryRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.createTemplateCategory(param.templateCategoryCreateRo,  options).toPromise();
    }

    /**
     * Only supply to people in template space
     * Delete Template Category
     * @param param the request object
     */
    public deleteTemplateCategoryWithHttpInfo(param: ProductOperationSystemTemplateAPIApiDeleteTemplateCategoryRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteTemplateCategoryWithHttpInfo(param.categoryCode,  options).toPromise();
    }

    /**
     * Only supply to people in template space
     * Delete Template Category
     * @param param the request object
     */
    public deleteTemplateCategory(param: ProductOperationSystemTemplateAPIApiDeleteTemplateCategoryRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteTemplateCategory(param.categoryCode,  options).toPromise();
    }

    /**
     * Only supply to people in template space
     * Publish Template in Specified Template Category
     * @param param the request object
     */
    public publishWithHttpInfo(param: ProductOperationSystemTemplateAPIApiPublishRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.publishWithHttpInfo(param.templatePublishRo, param.templateId,  options).toPromise();
    }

    /**
     * Only supply to people in template space
     * Publish Template in Specified Template Category
     * @param param the request object
     */
    public publish(param: ProductOperationSystemTemplateAPIApiPublishRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.publish(param.templatePublishRo, param.templateId,  options).toPromise();
    }

    /**
     * Only supply to people in template space
     * UnPublish Template
     * @param param the request object
     */
    public unpublishWithHttpInfo(param: ProductOperationSystemTemplateAPIApiUnpublishRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.unpublishWithHttpInfo(param.templateUnpublishRo, param.templateId,  options).toPromise();
    }

    /**
     * Only supply to people in template space
     * UnPublish Template
     * @param param the request object
     */
    public unpublish(param: ProductOperationSystemTemplateAPIApiUnpublishRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.unpublish(param.templateUnpublishRo, param.templateId,  options).toPromise();
    }

}

import { ObservableProductOperationSystemUserAPIApi } from "./ObservableAPI";
import { ProductOperationSystemUserAPIApiRequestFactory, ProductOperationSystemUserAPIApiResponseProcessor} from "../apis/ProductOperationSystemUserAPIApi";

export interface ProductOperationSystemUserAPIApiUpdatePwd1Request {
    /**
     *
     * @type RegisterRO
     * @memberof ProductOperationSystemUserAPIApiupdatePwd1
     */
    registerRO: RegisterRO
}

export class ObjectProductOperationSystemUserAPIApi {
    private api: ObservableProductOperationSystemUserAPIApi

    public constructor(configuration: Configuration, requestFactory?: ProductOperationSystemUserAPIApiRequestFactory, responseProcessor?: ProductOperationSystemUserAPIApiResponseProcessor) {
        this.api = new ObservableProductOperationSystemUserAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Only supply to customized customers
     * Update Appoint Account Password
     * @param param the request object
     */
    public updatePwd1WithHttpInfo(param: ProductOperationSystemUserAPIApiUpdatePwd1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updatePwd1WithHttpInfo(param.registerRO,  options).toPromise();
    }

    /**
     * Only supply to customized customers
     * Update Appoint Account Password
     * @param param the request object
     */
    public updatePwd1(param: ProductOperationSystemUserAPIApiUpdatePwd1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updatePwd1(param.registerRO,  options).toPromise();
    }

}

import { ObservableSpaceApplyJoiningSpaceApiApi } from "./ObservableAPI";
import { SpaceApplyJoiningSpaceApiApiRequestFactory, SpaceApplyJoiningSpaceApiApiResponseProcessor} from "../apis/SpaceApplyJoiningSpaceApiApi";

export interface SpaceApplyJoiningSpaceApiApiApplyRequest {
    /**
     *
     * @type SpaceJoinApplyRo
     * @memberof SpaceApplyJoiningSpaceApiApiapply
     */
    spaceJoinApplyRo: SpaceJoinApplyRo
}

export interface SpaceApplyJoiningSpaceApiApiProcessRequest {
    /**
     *
     * @type SpaceJoinProcessRo
     * @memberof SpaceApplyJoiningSpaceApiApiprocess
     */
    spaceJoinProcessRo: SpaceJoinProcessRo
}

export class ObjectSpaceApplyJoiningSpaceApiApi {
    private api: ObservableSpaceApplyJoiningSpaceApiApi

    public constructor(configuration: Configuration, requestFactory?: SpaceApplyJoiningSpaceApiApiRequestFactory, responseProcessor?: SpaceApplyJoiningSpaceApiApiResponseProcessor) {
        this.api = new ObservableSpaceApplyJoiningSpaceApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Applying to join the space
     * @param param the request object
     */
    public applyWithHttpInfo(param: SpaceApplyJoiningSpaceApiApiApplyRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.applyWithHttpInfo(param.spaceJoinApplyRo,  options).toPromise();
    }

    /**
     * Applying to join the space
     * @param param the request object
     */
    public apply(param: SpaceApplyJoiningSpaceApiApiApplyRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.apply(param.spaceJoinApplyRo,  options).toPromise();
    }

    /**
     * Process joining application
     * @param param the request object
     */
    public processWithHttpInfo(param: SpaceApplyJoiningSpaceApiApiProcessRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.processWithHttpInfo(param.spaceJoinProcessRo,  options).toPromise();
    }

    /**
     * Process joining application
     * @param param the request object
     */
    public process(param: SpaceApplyJoiningSpaceApiApiProcessRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.process(param.spaceJoinProcessRo,  options).toPromise();
    }

}

import { ObservableSpaceAuditApiApi } from "./ObservableAPI";
import { SpaceAuditApiApiRequestFactory, SpaceAuditApiApiResponseProcessor} from "../apis/SpaceAuditApiApi";

export interface SpaceAuditApiApiAuditRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceAuditApiApiaudit
     */
    spaceId: string
    /**
     * beginTime(format：yyyy-MM-dd HH:mm:ss)
     * @type Date
     * @memberof SpaceAuditApiApiaudit
     */
    beginTime?: Date
    /**
     * endTime(format：yyyy-MM-dd HH:mm:ss)
     * @type Date
     * @memberof SpaceAuditApiApiaudit
     */
    endTime?: Date
    /**
     * member ids
     * @type string
     * @memberof SpaceAuditApiApiaudit
     */
    memberIds?: string
    /**
     * actions
     * @type string
     * @memberof SpaceAuditApiApiaudit
     */
    actions?: string
    /**
     * keyword
     * @type string
     * @memberof SpaceAuditApiApiaudit
     */
    keyword?: string
    /**
     * page no(default 1)
     * @type number
     * @memberof SpaceAuditApiApiaudit
     */
    pageNo?: number
    /**
     * page size(default 20，max 100)
     * @type number
     * @memberof SpaceAuditApiApiaudit
     */
    pageSize?: number
}

export class ObjectSpaceAuditApiApi {
    private api: ObservableSpaceAuditApiApi

    public constructor(configuration: Configuration, requestFactory?: SpaceAuditApiApiRequestFactory, responseProcessor?: SpaceAuditApiApiResponseProcessor) {
        this.api = new ObservableSpaceAuditApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Query space audit logs in pages
     * @param param the request object
     */
    public auditWithHttpInfo(param: SpaceAuditApiApiAuditRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoSpaceAuditPageVO>> {
        return this.api.auditWithHttpInfo(param.spaceId, param.beginTime, param.endTime, param.memberIds, param.actions, param.keyword, param.pageNo, param.pageSize,  options).toPromise();
    }

    /**
     * Query space audit logs in pages
     * @param param the request object
     */
    public audit(param: SpaceAuditApiApiAuditRequest, options?: Configuration): Promise<ResponseDataPageInfoSpaceAuditPageVO> {
        return this.api.audit(param.spaceId, param.beginTime, param.endTime, param.memberIds, param.actions, param.keyword, param.pageNo, param.pageSize,  options).toPromise();
    }

}

import { ObservableSpaceInviteLinkApiApi } from "./ObservableAPI";
import { SpaceInviteLinkApiApiRequestFactory, SpaceInviteLinkApiApiResponseProcessor} from "../apis/SpaceInviteLinkApiApi";

export interface SpaceInviteLinkApiApiDelete15Request {
    /**
     *
     * @type SpaceLinkOpRo
     * @memberof SpaceInviteLinkApiApidelete15
     */
    spaceLinkOpRo: SpaceLinkOpRo
    /**
     * space id
     * @type string
     * @memberof SpaceInviteLinkApiApidelete15
     */
    xSpaceId: string
}

export interface SpaceInviteLinkApiApiGenerateRequest {
    /**
     *
     * @type SpaceLinkOpRo
     * @memberof SpaceInviteLinkApiApigenerate
     */
    spaceLinkOpRo: SpaceLinkOpRo
    /**
     * space id
     * @type string
     * @memberof SpaceInviteLinkApiApigenerate
     */
    xSpaceId: string
}

export interface SpaceInviteLinkApiApiJoinRequest {
    /**
     *
     * @type InviteValidRo
     * @memberof SpaceInviteLinkApiApijoin
     */
    inviteValidRo: InviteValidRo
}

export interface SpaceInviteLinkApiApiList3Request {
    /**
     * space id
     * @type string
     * @memberof SpaceInviteLinkApiApilist3
     */
    xSpaceId: string
}

export interface SpaceInviteLinkApiApiValidRequest {
    /**
     *
     * @type InviteValidRo
     * @memberof SpaceInviteLinkApiApivalid
     */
    inviteValidRo: InviteValidRo
}

export class ObjectSpaceInviteLinkApiApi {
    private api: ObservableSpaceInviteLinkApiApi

    public constructor(configuration: Configuration, requestFactory?: SpaceInviteLinkApiApiRequestFactory, responseProcessor?: SpaceInviteLinkApiApiResponseProcessor) {
        this.api = new ObservableSpaceInviteLinkApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete link
     * @param param the request object
     */
    public delete15WithHttpInfo(param: SpaceInviteLinkApiApiDelete15Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete15WithHttpInfo(param.spaceLinkOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete link
     * @param param the request object
     */
    public delete15(param: SpaceInviteLinkApiApiDelete15Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete15(param.spaceLinkOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * return token，the front end stitching $DOMAIN/invite/link?token=:token
     * Generate or refresh link
     * @param param the request object
     */
    public generateWithHttpInfo(param: SpaceInviteLinkApiApiGenerateRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.generateWithHttpInfo(param.spaceLinkOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * return token，the front end stitching $DOMAIN/invite/link?token=:token
     * Generate or refresh link
     * @param param the request object
     */
    public generate(param: SpaceInviteLinkApiApiGenerateRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.generate(param.spaceLinkOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * If return code status 201,the user redirects to the login page due to unauthorized.
     * Join the space using the public link
     * @param param the request object
     */
    public joinWithHttpInfo(param: SpaceInviteLinkApiApiJoinRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.joinWithHttpInfo(param.inviteValidRo,  options).toPromise();
    }

    /**
     * If return code status 201,the user redirects to the login page due to unauthorized.
     * Join the space using the public link
     * @param param the request object
     */
    public join(param: SpaceInviteLinkApiApiJoinRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.join(param.inviteValidRo,  options).toPromise();
    }

    /**
     * Get a list of links
     * @param param the request object
     */
    public list3WithHttpInfo(param: SpaceInviteLinkApiApiList3Request, options?: Configuration): Promise<HttpInfo<ResponseDataListSpaceLinkVo>> {
        return this.api.list3WithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Get a list of links
     * @param param the request object
     */
    public list3(param: SpaceInviteLinkApiApiList3Request, options?: Configuration): Promise<ResponseDataListSpaceLinkVo> {
        return this.api.list3(param.xSpaceId,  options).toPromise();
    }

    /**
     * After the verification is successful, it can obtain related invitation information
     * Valid invite link token
     * @param param the request object
     */
    public validWithHttpInfo(param: SpaceInviteLinkApiApiValidRequest, options?: Configuration): Promise<HttpInfo<ResponseDataSpaceLinkInfoVo>> {
        return this.api.validWithHttpInfo(param.inviteValidRo,  options).toPromise();
    }

    /**
     * After the verification is successful, it can obtain related invitation information
     * Valid invite link token
     * @param param the request object
     */
    public valid(param: SpaceInviteLinkApiApiValidRequest, options?: Configuration): Promise<ResponseDataSpaceLinkInfoVo> {
        return this.api.valid(param.inviteValidRo,  options).toPromise();
    }

}

import { ObservableSpaceMainAdminApiApi } from "./ObservableAPI";
import { SpaceMainAdminApiApiRequestFactory, SpaceMainAdminApiApiResponseProcessor} from "../apis/SpaceMainAdminApiApi";

export interface SpaceMainAdminApiApiGetMainAdminInfoRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceMainAdminApiApigetMainAdminInfo
     */
    xSpaceId: string
}

export interface SpaceMainAdminApiApiReplaceRequest {
    /**
     *
     * @type SpaceMainAdminChangeOpRo
     * @memberof SpaceMainAdminApiApireplace
     */
    spaceMainAdminChangeOpRo: SpaceMainAdminChangeOpRo
    /**
     * space id
     * @type string
     * @memberof SpaceMainAdminApiApireplace
     */
    xSpaceId: string
}

export class ObjectSpaceMainAdminApiApi {
    private api: ObservableSpaceMainAdminApiApi

    public constructor(configuration: Configuration, requestFactory?: SpaceMainAdminApiApiRequestFactory, responseProcessor?: SpaceMainAdminApiApiResponseProcessor) {
        this.api = new ObservableSpaceMainAdminApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get main admin info
     * @param param the request object
     */
    public getMainAdminInfoWithHttpInfo(param: SpaceMainAdminApiApiGetMainAdminInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataMainAdminInfoVo>> {
        return this.api.getMainAdminInfoWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Get main admin info
     * @param param the request object
     */
    public getMainAdminInfo(param: SpaceMainAdminApiApiGetMainAdminInfoRequest, options?: Configuration): Promise<ResponseDataMainAdminInfoVo> {
        return this.api.getMainAdminInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Change main admin
     * @param param the request object
     */
    public replaceWithHttpInfo(param: SpaceMainAdminApiApiReplaceRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.replaceWithHttpInfo(param.spaceMainAdminChangeOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Change main admin
     * @param param the request object
     */
    public replace(param: SpaceMainAdminApiApiReplaceRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.replace(param.spaceMainAdminChangeOpRo, param.xSpaceId,  options).toPromise();
    }

}

import { ObservableSpaceSpaceApiApi } from "./ObservableAPI";
import { SpaceSpaceApiApiRequestFactory, SpaceSpaceApiApiResponseProcessor} from "../apis/SpaceSpaceApiApi";

export interface SpaceSpaceApiApiCancelRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApicancel
     */
    spaceId: string
}

export interface SpaceSpaceApiApiCapacityRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApicapacity
     */
    xSpaceId: string
}

export interface SpaceSpaceApiApiCreate4Request {
    /**
     *
     * @type SpaceOpRo
     * @memberof SpaceSpaceApiApicreate4
     */
    spaceOpRo: SpaceOpRo
}

export interface SpaceSpaceApiApiDelRequest {
}

export interface SpaceSpaceApiApiDelete16Request {
    /**
     *
     * @type SpaceDeleteRo
     * @memberof SpaceSpaceApiApidelete16
     */
    spaceDeleteRo: SpaceDeleteRo
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApidelete16
     */
    spaceId: string
}

export interface SpaceSpaceApiApiFeatureRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApifeature
     */
    xSpaceId: string
}

export interface SpaceSpaceApiApiGetCreditUsagesRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApigetCreditUsages
     */
    spaceId: string
    /**
     *
     * @type string
     * @memberof SpaceSpaceApiApigetCreditUsages
     */
    timeDimension?: string
}

export interface SpaceSpaceApiApiGetSpaceResourceRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApigetSpaceResource
     */
    xSpaceId: string
}

export interface SpaceSpaceApiApiInfo1Request {
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApiinfo1
     */
    spaceId: string
}

export interface SpaceSpaceApiApiList2Request {
    /**
     * Whether to query only the managed space list. By default, not include
     * @type boolean
     * @memberof SpaceSpaceApiApilist2
     */
    onlyManageable?: boolean
}

export interface SpaceSpaceApiApiQuitRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApiquit
     */
    spaceId: string
}

export interface SpaceSpaceApiApiRemoveRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApiremove
     */
    spaceId: string
}

export interface SpaceSpaceApiApiSubscribeRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApisubscribe
     */
    spaceId: string
}

export interface SpaceSpaceApiApiSwitchSpaceRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApiswitchSpace
     */
    spaceId: string
}

export interface SpaceSpaceApiApiUpdate3Request {
    /**
     *
     * @type SpaceUpdateOpRo
     * @memberof SpaceSpaceApiApiupdate3
     */
    spaceUpdateOpRo: SpaceUpdateOpRo
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApiupdate3
     */
    xSpaceId: string
}

export interface SpaceSpaceApiApiUpdateMemberSettingRequest {
    /**
     *
     * @type SpaceMemberSettingRo
     * @memberof SpaceSpaceApiApiupdateMemberSetting
     */
    spaceMemberSettingRo: SpaceMemberSettingRo
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApiupdateMemberSetting
     */
    xSpaceId: string
}

export interface SpaceSpaceApiApiUpdateSecuritySettingRequest {
    /**
     *
     * @type SpaceSecuritySettingRo
     * @memberof SpaceSpaceApiApiupdateSecuritySetting
     */
    spaceSecuritySettingRo: SpaceSecuritySettingRo
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApiupdateSecuritySetting
     */
    xSpaceId: string
}

export interface SpaceSpaceApiApiUpdateWorkbenchSettingRequest {
    /**
     *
     * @type SpaceWorkbenchSettingRo
     * @memberof SpaceSpaceApiApiupdateWorkbenchSetting
     */
    spaceWorkbenchSettingRo: SpaceWorkbenchSettingRo
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApiupdateWorkbenchSetting
     */
    xSpaceId: string
}

export class ObjectSpaceSpaceApiApi {
    private api: ObservableSpaceSpaceApiApi

    public constructor(configuration: Configuration, requestFactory?: SpaceSpaceApiApiRequestFactory, responseProcessor?: SpaceSpaceApiApiResponseProcessor) {
        this.api = new ObservableSpaceSpaceApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Undo delete space
     * @param param the request object
     */
    public cancelWithHttpInfo(param: SpaceSpaceApiApiCancelRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.cancelWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Undo delete space
     * @param param the request object
     */
    public cancel(param: SpaceSpaceApiApiCancelRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.cancel(param.spaceId,  options).toPromise();
    }

    /**
     * Get space capacity info
     * @param param the request object
     */
    public capacityWithHttpInfo(param: SpaceSpaceApiApiCapacityRequest, options?: Configuration): Promise<HttpInfo<ResponseDataSpaceCapacityVO>> {
        return this.api.capacityWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Get space capacity info
     * @param param the request object
     */
    public capacity(param: SpaceSpaceApiApiCapacityRequest, options?: Configuration): Promise<ResponseDataSpaceCapacityVO> {
        return this.api.capacity(param.xSpaceId,  options).toPromise();
    }

    /**
     * Create Space
     * @param param the request object
     */
    public create4WithHttpInfo(param: SpaceSpaceApiApiCreate4Request, options?: Configuration): Promise<HttpInfo<ResponseDataCreateSpaceResultVo>> {
        return this.api.create4WithHttpInfo(param.spaceOpRo,  options).toPromise();
    }

    /**
     * Create Space
     * @param param the request object
     */
    public create4(param: SpaceSpaceApiApiCreate4Request, options?: Configuration): Promise<ResponseDataCreateSpaceResultVo> {
        return this.api.create4(param.spaceOpRo,  options).toPromise();
    }

    /**
     * Delete space immediately
     * @param param the request object
     */
    public delWithHttpInfo(param: SpaceSpaceApiApiDelRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delWithHttpInfo( options).toPromise();
    }

    /**
     * Delete space immediately
     * @param param the request object
     */
    public del(param: SpaceSpaceApiApiDelRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.del( options).toPromise();
    }

    /**
     * Delete space
     * @param param the request object
     */
    public delete16WithHttpInfo(param: SpaceSpaceApiApiDelete16Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete16WithHttpInfo(param.spaceDeleteRo, param.spaceId,  options).toPromise();
    }

    /**
     * Delete space
     * @param param the request object
     */
    public delete16(param: SpaceSpaceApiApiDelete16Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete16(param.spaceDeleteRo, param.spaceId,  options).toPromise();
    }

    /**
     * Get space feature
     * @param param the request object
     */
    public featureWithHttpInfo(param: SpaceSpaceApiApiFeatureRequest, options?: Configuration): Promise<HttpInfo<ResponseDataSpaceGlobalFeature>> {
        return this.api.featureWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Get space feature
     * @param param the request object
     */
    public feature(param: SpaceSpaceApiApiFeatureRequest, options?: Configuration): Promise<ResponseDataSpaceGlobalFeature> {
        return this.api.feature(param.xSpaceId,  options).toPromise();
    }

    /**
     * Gets message credit chart data for the space
     * @param param the request object
     */
    public getCreditUsagesWithHttpInfo(param: SpaceSpaceApiApiGetCreditUsagesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataCreditUsages>> {
        return this.api.getCreditUsagesWithHttpInfo(param.spaceId, param.timeDimension,  options).toPromise();
    }

    /**
     * Gets message credit chart data for the space
     * @param param the request object
     */
    public getCreditUsages(param: SpaceSpaceApiApiGetCreditUsagesRequest, options?: Configuration): Promise<ResponseDataCreditUsages> {
        return this.api.getCreditUsages(param.spaceId, param.timeDimension,  options).toPromise();
    }

    /**
     * Get user space resource
     * @param param the request object
     */
    public getSpaceResourceWithHttpInfo(param: SpaceSpaceApiApiGetSpaceResourceRequest, options?: Configuration): Promise<HttpInfo<ResponseDataUserSpaceVo>> {
        return this.api.getSpaceResourceWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Get user space resource
     * @param param the request object
     */
    public getSpaceResource(param: SpaceSpaceApiApiGetSpaceResourceRequest, options?: Configuration): Promise<ResponseDataUserSpaceVo> {
        return this.api.getSpaceResource(param.xSpaceId,  options).toPromise();
    }

    /**
     * Get space info
     * @param param the request object
     */
    public info1WithHttpInfo(param: SpaceSpaceApiApiInfo1Request, options?: Configuration): Promise<HttpInfo<ResponseDataSpaceInfoVO>> {
        return this.api.info1WithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Get space info
     * @param param the request object
     */
    public info1(param: SpaceSpaceApiApiInfo1Request, options?: Configuration): Promise<ResponseDataSpaceInfoVO> {
        return this.api.info1(param.spaceId,  options).toPromise();
    }

    /**
     * Get space list
     * @param param the request object
     */
    public list2WithHttpInfo(param: SpaceSpaceApiApiList2Request = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListSpaceVO>> {
        return this.api.list2WithHttpInfo(param.onlyManageable,  options).toPromise();
    }

    /**
     * Get space list
     * @param param the request object
     */
    public list2(param: SpaceSpaceApiApiList2Request = {}, options?: Configuration): Promise<ResponseDataListSpaceVO> {
        return this.api.list2(param.onlyManageable,  options).toPromise();
    }

    /**
     * Quit space
     * @param param the request object
     */
    public quitWithHttpInfo(param: SpaceSpaceApiApiQuitRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.quitWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Quit space
     * @param param the request object
     */
    public quit(param: SpaceSpaceApiApiQuitRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.quit(param.spaceId,  options).toPromise();
    }

    /**
     * Scenario: Remove the red dot in the inactive space
     * Remove hot point in space
     * @param param the request object
     */
    public removeWithHttpInfo(param: SpaceSpaceApiApiRemoveRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.removeWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Scenario: Remove the red dot in the inactive space
     * Remove hot point in space
     * @param param the request object
     */
    public remove(param: SpaceSpaceApiApiRemoveRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.remove(param.spaceId,  options).toPromise();
    }

    /**
     * Gets subscription information for the space
     * @param param the request object
     */
    public subscribeWithHttpInfo(param: SpaceSpaceApiApiSubscribeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataSpaceSubscribeVo>> {
        return this.api.subscribeWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Gets subscription information for the space
     * @param param the request object
     */
    public subscribe(param: SpaceSpaceApiApiSubscribeRequest, options?: Configuration): Promise<ResponseDataSpaceSubscribeVo> {
        return this.api.subscribe(param.spaceId,  options).toPromise();
    }

    /**
     * switch space
     * @param param the request object
     */
    public switchSpaceWithHttpInfo(param: SpaceSpaceApiApiSwitchSpaceRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.switchSpaceWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * switch space
     * @param param the request object
     */
    public switchSpace(param: SpaceSpaceApiApiSwitchSpaceRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.switchSpace(param.spaceId,  options).toPromise();
    }

    /**
     * at least one item is name and logo
     * Update space
     * @param param the request object
     */
    public update3WithHttpInfo(param: SpaceSpaceApiApiUpdate3Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.update3WithHttpInfo(param.spaceUpdateOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * at least one item is name and logo
     * Update space
     * @param param the request object
     */
    public update3(param: SpaceSpaceApiApiUpdate3Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.update3(param.spaceUpdateOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Update member setting
     * @param param the request object
     */
    public updateMemberSettingWithHttpInfo(param: SpaceSpaceApiApiUpdateMemberSettingRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateMemberSettingWithHttpInfo(param.spaceMemberSettingRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Update member setting
     * @param param the request object
     */
    public updateMemberSetting(param: SpaceSpaceApiApiUpdateMemberSettingRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateMemberSetting(param.spaceMemberSettingRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Update security setting
     * @param param the request object
     */
    public updateSecuritySettingWithHttpInfo(param: SpaceSpaceApiApiUpdateSecuritySettingRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateSecuritySettingWithHttpInfo(param.spaceSecuritySettingRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Update security setting
     * @param param the request object
     */
    public updateSecuritySetting(param: SpaceSpaceApiApiUpdateSecuritySettingRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateSecuritySetting(param.spaceSecuritySettingRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Update workbench setting
     * @param param the request object
     */
    public updateWorkbenchSettingWithHttpInfo(param: SpaceSpaceApiApiUpdateWorkbenchSettingRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateWorkbenchSettingWithHttpInfo(param.spaceWorkbenchSettingRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Update workbench setting
     * @param param the request object
     */
    public updateWorkbenchSetting(param: SpaceSpaceApiApiUpdateWorkbenchSettingRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateWorkbenchSetting(param.spaceWorkbenchSettingRo, param.xSpaceId,  options).toPromise();
    }

}

import { ObservableSpaceSubAdminApiApi } from "./ObservableAPI";
import { SpaceSubAdminApiApiRequestFactory, SpaceSubAdminApiApiResponseProcessor} from "../apis/SpaceSubAdminApiApi";

export interface SpaceSubAdminApiApiAddRoleRequest {
    /**
     *
     * @type AddSpaceRoleRo
     * @memberof SpaceSubAdminApiApiaddRole
     */
    addSpaceRoleRo: AddSpaceRoleRo
    /**
     * space id
     * @type string
     * @memberof SpaceSubAdminApiApiaddRole
     */
    xSpaceId: string
}

export interface SpaceSubAdminApiApiDeleteRoleRequest {
    /**
     *
     * @type number
     * @memberof SpaceSubAdminApiApideleteRole
     */
    memberId: number
    /**
     * space id
     * @type string
     * @memberof SpaceSubAdminApiApideleteRole
     */
    xSpaceId: string
}

export interface SpaceSubAdminApiApiEditRoleRequest {
    /**
     *
     * @type UpdateSpaceRoleRo
     * @memberof SpaceSubAdminApiApieditRole
     */
    updateSpaceRoleRo: UpdateSpaceRoleRo
    /**
     * space id
     * @type string
     * @memberof SpaceSubAdminApiApieditRole
     */
    xSpaceId: string
}

export interface SpaceSubAdminApiApiGetRoleDetailRequest {
    /**
     *
     * @type number
     * @memberof SpaceSubAdminApiApigetRoleDetail
     */
    memberId: number
    /**
     * space id
     * @type string
     * @memberof SpaceSubAdminApiApigetRoleDetail
     */
    xSpaceId: string
}

export interface SpaceSubAdminApiApiListRoleRequest {
    /**
     *
     * @type Page
     * @memberof SpaceSubAdminApiApilistRole
     */
    page: Page
    /**
     * space id
     * @type string
     * @memberof SpaceSubAdminApiApilistRole
     */
    xSpaceId: string
    /**
     * paging parameters
     * @type string
     * @memberof SpaceSubAdminApiApilistRole
     */
    pageObjectParams: string
}

export class ObjectSpaceSubAdminApiApi {
    private api: ObservableSpaceSubAdminApiApi

    public constructor(configuration: Configuration, requestFactory?: SpaceSubAdminApiApiRequestFactory, responseProcessor?: SpaceSubAdminApiApiResponseProcessor) {
        this.api = new ObservableSpaceSubAdminApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create space role
     * @param param the request object
     */
    public addRoleWithHttpInfo(param: SpaceSubAdminApiApiAddRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.addRoleWithHttpInfo(param.addSpaceRoleRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Create space role
     * @param param the request object
     */
    public addRole(param: SpaceSubAdminApiApiAddRoleRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.addRole(param.addSpaceRoleRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * delete admin
     * delete admin
     * @param param the request object
     */
    public deleteRoleWithHttpInfo(param: SpaceSubAdminApiApiDeleteRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseData>> {
        return this.api.deleteRoleWithHttpInfo(param.memberId, param.xSpaceId,  options).toPromise();
    }

    /**
     * delete admin
     * delete admin
     * @param param the request object
     */
    public deleteRole(param: SpaceSubAdminApiApiDeleteRoleRequest, options?: Configuration): Promise<ResponseData> {
        return this.api.deleteRole(param.memberId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Edite space role
     * @param param the request object
     */
    public editRoleWithHttpInfo(param: SpaceSubAdminApiApiEditRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseData>> {
        return this.api.editRoleWithHttpInfo(param.updateSpaceRoleRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Edite space role
     * @param param the request object
     */
    public editRole(param: SpaceSubAdminApiApiEditRoleRequest, options?: Configuration): Promise<ResponseData> {
        return this.api.editRole(param.updateSpaceRoleRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * query admin detail
     * @param param the request object
     */
    public getRoleDetailWithHttpInfo(param: SpaceSubAdminApiApiGetRoleDetailRequest, options?: Configuration): Promise<HttpInfo<ResponseDataSpaceRoleDetailVo>> {
        return this.api.getRoleDetailWithHttpInfo(param.memberId, param.xSpaceId,  options).toPromise();
    }

    /**
     * query admin detail
     * @param param the request object
     */
    public getRoleDetail(param: SpaceSubAdminApiApiGetRoleDetailRequest, options?: Configuration): Promise<ResponseDataSpaceRoleDetailVo> {
        return this.api.getRoleDetail(param.memberId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Page query sub admin.Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query admins
     * @param param the request object
     */
    public listRoleWithHttpInfo(param: SpaceSubAdminApiApiListRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoSpaceRoleVo>> {
        return this.api.listRoleWithHttpInfo(param.page, param.xSpaceId, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Page query sub admin.Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query admins
     * @param param the request object
     */
    public listRole(param: SpaceSubAdminApiApiListRoleRequest, options?: Configuration): Promise<ResponseDataPageInfoSpaceRoleVo> {
        return this.api.listRole(param.page, param.xSpaceId, param.pageObjectParams,  options).toPromise();
    }

}

import { ObservableStoreAPIApi } from "./ObservableAPI";
import { StoreAPIApiRequestFactory, StoreAPIApiResponseProcessor} from "../apis/StoreAPIApi";

export interface StoreAPIApiGetPricesRequest {
    /**
     * product name
     * @type string
     * @memberof StoreAPIApigetPrices
     */
    product: string
}

export class ObjectStoreAPIApi {
    private api: ObservableStoreAPIApi

    public constructor(configuration: Configuration, requestFactory?: StoreAPIApiRequestFactory, responseProcessor?: StoreAPIApiResponseProcessor) {
        this.api = new ObservableStoreAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Self-operated product price list
     * Get Price List for A Product
     * @param param the request object
     */
    public getPricesWithHttpInfo(param: StoreAPIApiGetPricesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListProductPriceVo>> {
        return this.api.getPricesWithHttpInfo(param.product,  options).toPromise();
    }

    /**
     * Self-operated product price list
     * Get Price List for A Product
     * @param param the request object
     */
    public getPrices(param: StoreAPIApiGetPricesRequest, options?: Configuration): Promise<ResponseDataListProductPriceVo> {
        return this.api.getPrices(param.product,  options).toPromise();
    }

}

import { ObservableStripeWebhookControllerApi } from "./ObservableAPI";
import { StripeWebhookControllerApiRequestFactory, StripeWebhookControllerApiResponseProcessor} from "../apis/StripeWebhookControllerApi";

export interface StripeWebhookControllerApiRetrieveStripeEventRequest {
}

export class ObjectStripeWebhookControllerApi {
    private api: ObservableStripeWebhookControllerApi

    public constructor(configuration: Configuration, requestFactory?: StripeWebhookControllerApiRequestFactory, responseProcessor?: StripeWebhookControllerApiResponseProcessor) {
        this.api = new ObservableStripeWebhookControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public retrieveStripeEventWithHttpInfo(param: StripeWebhookControllerApiRetrieveStripeEventRequest = {}, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.retrieveStripeEventWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public retrieveStripeEvent(param: StripeWebhookControllerApiRetrieveStripeEventRequest = {}, options?: Configuration): Promise<string> {
        return this.api.retrieveStripeEvent( options).toPromise();
    }

}

import { ObservableTemplateCenterTemplateAPIApi } from "./ObservableAPI";
import { TemplateCenterTemplateAPIApiRequestFactory, TemplateCenterTemplateAPIApiResponseProcessor} from "../apis/TemplateCenterTemplateAPIApi";

export interface TemplateCenterTemplateAPIApiCreate3Request {
    /**
     *
     * @type CreateTemplateRo
     * @memberof TemplateCenterTemplateAPIApicreate3
     */
    createTemplateRo: CreateTemplateRo
}

export interface TemplateCenterTemplateAPIApiDelete14Request {
    /**
     * Template ID
     * @type string
     * @memberof TemplateCenterTemplateAPIApidelete14
     */
    templateId: string
}

export interface TemplateCenterTemplateAPIApiDirectoryRequest {
    /**
     * Template Id
     * @type string
     * @memberof TemplateCenterTemplateAPIApidirectory
     */
    templateId: string
    /**
     * Official Template Category Code
     * @type string
     * @memberof TemplateCenterTemplateAPIApidirectory
     */
    categoryCode?: string
    /**
     * Whether it is a private template in the space station
     * @type boolean
     * @memberof TemplateCenterTemplateAPIApidirectory
     */
    isPrivate?: boolean
}

export interface TemplateCenterTemplateAPIApiGetCategoryContentRequest {
    /**
     * Template Category Code
     * @type string
     * @memberof TemplateCenterTemplateAPIApigetCategoryContent
     */
    categoryCode: string
}

export interface TemplateCenterTemplateAPIApiGetCategoryListRequest {
}

export interface TemplateCenterTemplateAPIApiGetSpaceTemplatesRequest {
    /**
     *
     * @type string
     * @memberof TemplateCenterTemplateAPIApigetSpaceTemplates
     */
    spaceId: string
    /**
     * Space Id
     * @type string
     * @memberof TemplateCenterTemplateAPIApigetSpaceTemplates
     */
    xSpaceId: string
}

export interface TemplateCenterTemplateAPIApiGlobalSearchRequest {
    /**
     * Search Keyword
     * @type string
     * @memberof TemplateCenterTemplateAPIApiglobalSearch
     */
    keyword: string
    /**
     * Highlight Style Class Name
     * @type string
     * @memberof TemplateCenterTemplateAPIApiglobalSearch
     */
    className?: string
}

export interface TemplateCenterTemplateAPIApiQuoteRequest {
    /**
     *
     * @type QuoteTemplateRo
     * @memberof TemplateCenterTemplateAPIApiquote
     */
    quoteTemplateRo: QuoteTemplateRo
    /**
     * user socket id
     * @type string
     * @memberof TemplateCenterTemplateAPIApiquote
     */
    xSocketId?: string
}

export interface TemplateCenterTemplateAPIApiRecommendRequest {
}

export interface TemplateCenterTemplateAPIApiValidateRequest {
    /**
     * Template Name
     * @type string
     * @memberof TemplateCenterTemplateAPIApivalidate
     */
    name: string
    /**
     * Space Id
     * @type string
     * @memberof TemplateCenterTemplateAPIApivalidate
     */
    xSpaceId: string
}

export class ObjectTemplateCenterTemplateAPIApi {
    private api: ObservableTemplateCenterTemplateAPIApi

    public constructor(configuration: Configuration, requestFactory?: TemplateCenterTemplateAPIApiRequestFactory, responseProcessor?: TemplateCenterTemplateAPIApiResponseProcessor) {
        this.api = new ObservableTemplateCenterTemplateAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Created nodes (including child descendant nodes) have administrative rights and are not associated with data tables other than nodes.
     * Create Template
     * @param param the request object
     */
    public create3WithHttpInfo(param: TemplateCenterTemplateAPIApiCreate3Request, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.create3WithHttpInfo(param.createTemplateRo,  options).toPromise();
    }

    /**
     * Created nodes (including child descendant nodes) have administrative rights and are not associated with data tables other than nodes.
     * Create Template
     * @param param the request object
     */
    public create3(param: TemplateCenterTemplateAPIApiCreate3Request, options?: Configuration): Promise<ResponseDataString> {
        return this.api.create3(param.createTemplateRo,  options).toPromise();
    }

    /**
     * Deletion objects: main administrator, sub-admins with template permissions, creator of the template
     * Delete Template
     * @param param the request object
     */
    public delete14WithHttpInfo(param: TemplateCenterTemplateAPIApiDelete14Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete14WithHttpInfo(param.templateId,  options).toPromise();
    }

    /**
     * Deletion objects: main administrator, sub-admins with template permissions, creator of the template
     * Delete Template
     * @param param the request object
     */
    public delete14(param: TemplateCenterTemplateAPIApiDelete14Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete14(param.templateId,  options).toPromise();
    }

    /**
     * Get Template Directory Info
     * @param param the request object
     */
    public directoryWithHttpInfo(param: TemplateCenterTemplateAPIApiDirectoryRequest, options?: Configuration): Promise<HttpInfo<ResponseDataTemplateDirectoryVo>> {
        return this.api.directoryWithHttpInfo(param.templateId, param.categoryCode, param.isPrivate,  options).toPromise();
    }

    /**
     * Get Template Directory Info
     * @param param the request object
     */
    public directory(param: TemplateCenterTemplateAPIApiDirectoryRequest, options?: Configuration): Promise<ResponseDataTemplateDirectoryVo> {
        return this.api.directory(param.templateId, param.categoryCode, param.isPrivate,  options).toPromise();
    }

    /**
     * Get The Template Category Content
     * @param param the request object
     */
    public getCategoryContentWithHttpInfo(param: TemplateCenterTemplateAPIApiGetCategoryContentRequest, options?: Configuration): Promise<HttpInfo<ResponseDataTemplateCategoryContentVo>> {
        return this.api.getCategoryContentWithHttpInfo(param.categoryCode,  options).toPromise();
    }

    /**
     * Get The Template Category Content
     * @param param the request object
     */
    public getCategoryContent(param: TemplateCenterTemplateAPIApiGetCategoryContentRequest, options?: Configuration): Promise<ResponseDataTemplateCategoryContentVo> {
        return this.api.getCategoryContent(param.categoryCode,  options).toPromise();
    }

    /**
     * Get Template Category List
     * @param param the request object
     */
    public getCategoryListWithHttpInfo(param: TemplateCenterTemplateAPIApiGetCategoryListRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListTemplateCategoryMenuVo>> {
        return this.api.getCategoryListWithHttpInfo( options).toPromise();
    }

    /**
     * Get Template Category List
     * @param param the request object
     */
    public getCategoryList(param: TemplateCenterTemplateAPIApiGetCategoryListRequest = {}, options?: Configuration): Promise<ResponseDataListTemplateCategoryMenuVo> {
        return this.api.getCategoryList( options).toPromise();
    }

    /**
     * Get Space Templates
     * @param param the request object
     */
    public getSpaceTemplatesWithHttpInfo(param: TemplateCenterTemplateAPIApiGetSpaceTemplatesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListTemplateVo>> {
        return this.api.getSpaceTemplatesWithHttpInfo(param.spaceId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Get Space Templates
     * @param param the request object
     */
    public getSpaceTemplates(param: TemplateCenterTemplateAPIApiGetSpaceTemplatesRequest, options?: Configuration): Promise<ResponseDataListTemplateVo> {
        return this.api.getSpaceTemplates(param.spaceId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Template Global Search
     * @param param the request object
     */
    public globalSearchWithHttpInfo(param: TemplateCenterTemplateAPIApiGlobalSearchRequest, options?: Configuration): Promise<HttpInfo<ResponseDataTemplateSearchResultVo>> {
        return this.api.globalSearchWithHttpInfo(param.keyword, param.className,  options).toPromise();
    }

    /**
     * Template Global Search
     * @param param the request object
     */
    public globalSearch(param: TemplateCenterTemplateAPIApiGlobalSearchRequest, options?: Configuration): Promise<ResponseDataTemplateSearchResultVo> {
        return this.api.globalSearch(param.keyword, param.className,  options).toPromise();
    }

    /**
     * Quote Template
     * @param param the request object
     */
    public quoteWithHttpInfo(param: TemplateCenterTemplateAPIApiQuoteRequest, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        return this.api.quoteWithHttpInfo(param.quoteTemplateRo, param.xSocketId,  options).toPromise();
    }

    /**
     * Quote Template
     * @param param the request object
     */
    public quote(param: TemplateCenterTemplateAPIApiQuoteRequest, options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        return this.api.quote(param.quoteTemplateRo, param.xSocketId,  options).toPromise();
    }

    /**
     * Get Template Recommend Content
     * @param param the request object
     */
    public recommendWithHttpInfo(param: TemplateCenterTemplateAPIApiRecommendRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataRecommendVo>> {
        return this.api.recommendWithHttpInfo( options).toPromise();
    }

    /**
     * Get Template Recommend Content
     * @param param the request object
     */
    public recommend(param: TemplateCenterTemplateAPIApiRecommendRequest = {}, options?: Configuration): Promise<ResponseDataRecommendVo> {
        return this.api.recommend( options).toPromise();
    }

    /**
     * Called before creating a template, the same name will overwrite the old template. you need to confirm the operation again
     * Check if the template name already exists
     * @param param the request object
     */
    public validateWithHttpInfo(param: TemplateCenterTemplateAPIApiValidateRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        return this.api.validateWithHttpInfo(param.name, param.xSpaceId,  options).toPromise();
    }

    /**
     * Called before creating a template, the same name will overwrite the old template. you need to confirm the operation again
     * Check if the template name already exists
     * @param param the request object
     */
    public validate(param: TemplateCenterTemplateAPIApiValidateRequest, options?: Configuration): Promise<ResponseDataBoolean> {
        return this.api.validate(param.name, param.xSpaceId,  options).toPromise();
    }

}

import { ObservableTemplateCenterTemplateAlbumAPIApi } from "./ObservableAPI";
import { TemplateCenterTemplateAlbumAPIApiRequestFactory, TemplateCenterTemplateAlbumAPIApiResponseProcessor} from "../apis/TemplateCenterTemplateAlbumAPIApi";

export interface TemplateCenterTemplateAlbumAPIApiGetAlbumContentRequest {
    /**
     * Template Album ID
     * @type string
     * @memberof TemplateCenterTemplateAlbumAPIApigetAlbumContent
     */
    albumId: string
}

export interface TemplateCenterTemplateAlbumAPIApiGetRecommendedAlbumsRequest {
    /**
     * Exclude Album
     * @type string
     * @memberof TemplateCenterTemplateAlbumAPIApigetRecommendedAlbums
     */
    excludeAlbumId?: string
    /**
     * Max Count of Load.The number of response result may be smaller than it
     * @type number
     * @memberof TemplateCenterTemplateAlbumAPIApigetRecommendedAlbums
     */
    maxCount?: number
}

export class ObjectTemplateCenterTemplateAlbumAPIApi {
    private api: ObservableTemplateCenterTemplateAlbumAPIApi

    public constructor(configuration: Configuration, requestFactory?: TemplateCenterTemplateAlbumAPIApiRequestFactory, responseProcessor?: TemplateCenterTemplateAlbumAPIApiResponseProcessor) {
        this.api = new ObservableTemplateCenterTemplateAlbumAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get The Template Album Content
     * @param param the request object
     */
    public getAlbumContentWithHttpInfo(param: TemplateCenterTemplateAlbumAPIApiGetAlbumContentRequest, options?: Configuration): Promise<HttpInfo<ResponseDataAlbumContentVo>> {
        return this.api.getAlbumContentWithHttpInfo(param.albumId,  options).toPromise();
    }

    /**
     * Get The Template Album Content
     * @param param the request object
     */
    public getAlbumContent(param: TemplateCenterTemplateAlbumAPIApiGetAlbumContentRequest, options?: Configuration): Promise<ResponseDataAlbumContentVo> {
        return this.api.getAlbumContent(param.albumId,  options).toPromise();
    }

    /**
     * Get Recommended Template Albums
     * @param param the request object
     */
    public getRecommendedAlbumsWithHttpInfo(param: TemplateCenterTemplateAlbumAPIApiGetRecommendedAlbumsRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListAlbumVo>> {
        return this.api.getRecommendedAlbumsWithHttpInfo(param.excludeAlbumId, param.maxCount,  options).toPromise();
    }

    /**
     * Get Recommended Template Albums
     * @param param the request object
     */
    public getRecommendedAlbums(param: TemplateCenterTemplateAlbumAPIApiGetRecommendedAlbumsRequest = {}, options?: Configuration): Promise<ResponseDataListAlbumVo> {
        return this.api.getRecommendedAlbums(param.excludeAlbumId, param.maxCount,  options).toPromise();
    }

}

import { ObservableTencentQQModuleTencentQQRelatedServiceInterfaceApi } from "./ObservableAPI";
import { TencentQQModuleTencentQQRelatedServiceInterfaceApiRequestFactory, TencentQQModuleTencentQQRelatedServiceInterfaceApiResponseProcessor} from "../apis/TencentQQModuleTencentQQRelatedServiceInterfaceApi";

export interface TencentQQModuleTencentQQRelatedServiceInterfaceApiCallback2Request {
    /**
     * Type (0: Scan code for login; 1: Account binding;)
     * @type number
     * @memberof TencentQQModuleTencentQQRelatedServiceInterfaceApicallback2
     */
    type?: number
    /**
     * Code (build the request yourself and call back the parameter)
     * @type string
     * @memberof TencentQQModuleTencentQQRelatedServiceInterfaceApicallback2
     */
    code?: string
    /**
     * Authorization token (use the JS SDK to call back this parameter)
     * @type string
     * @memberof TencentQQModuleTencentQQRelatedServiceInterfaceApicallback2
     */
    accessToken?: string
    /**
     * access token\&#39;s TERM OF VALIDITY
     * @type string
     * @memberof TencentQQModuleTencentQQRelatedServiceInterfaceApicallback2
     */
    expiresIn?: string
}

export class ObjectTencentQQModuleTencentQQRelatedServiceInterfaceApi {
    private api: ObservableTencentQQModuleTencentQQRelatedServiceInterfaceApi

    public constructor(configuration: Configuration, requestFactory?: TencentQQModuleTencentQQRelatedServiceInterfaceApiRequestFactory, responseProcessor?: TencentQQModuleTencentQQRelatedServiceInterfaceApiResponseProcessor) {
        this.api = new ObservableTencentQQModuleTencentQQRelatedServiceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * code、accessToken, At least one is passed in
     * Website application callback
     * @param param the request object
     */
    public callback2WithHttpInfo(param: TencentQQModuleTencentQQRelatedServiceInterfaceApiCallback2Request = {}, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.callback2WithHttpInfo(param.type, param.code, param.accessToken, param.expiresIn,  options).toPromise();
    }

    /**
     * code、accessToken, At least one is passed in
     * Website application callback
     * @param param the request object
     */
    public callback2(param: TencentQQModuleTencentQQRelatedServiceInterfaceApiCallback2Request = {}, options?: Configuration): Promise<ResponseDataString> {
        return this.api.callback2(param.type, param.code, param.accessToken, param.expiresIn,  options).toPromise();
    }

}

import { ObservableThirdPartyPlatformIntegrationInterfaceDingTalkApi } from "./ObservableAPI";
import { ThirdPartyPlatformIntegrationInterfaceDingTalkApiRequestFactory, ThirdPartyPlatformIntegrationInterfaceDingTalkApiResponseProcessor} from "../apis/ThirdPartyPlatformIntegrationInterfaceDingTalkApi";

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiBindSpace1Request {
    /**
     *
     * @type DingTalkAgentBindSpaceDTO
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApibindSpace1
     */
    dingTalkAgentBindSpaceDTO: DingTalkAgentBindSpaceDTO
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApibindSpace1
     */
    agentId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiBindSpaceInfo1Request {
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApibindSpaceInfo1
     */
    agentId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiChangeAdmin1Request {
    /**
     *
     * @type DingTalkTenantMainAdminChangeRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApichangeAdmin1
     */
    dingTalkTenantMainAdminChangeRo: DingTalkTenantMainAdminChangeRo
    /**
     * kit ID
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApichangeAdmin1
     */
    suiteId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateCreateRequest {
    /**
     *
     * @type DingTalkDaTemplateCreateRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApidingTalkDaTemplateCreate
     */
    dingTalkDaTemplateCreateRo: DingTalkDaTemplateCreateRo
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApidingTalkDaTemplateCreate
     */
    dingTalkDaAppId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateDeleteRequest {
    /**
     *
     * @type DingTalkDaTemplateDeleteRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApidingTalkDaTemplateDelete
     */
    dingTalkDaTemplateDeleteRo: DingTalkDaTemplateDeleteRo
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApidingTalkDaTemplateDelete
     */
    dingTalkDaAppId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateUpdateRequest {
    /**
     *
     * @type DingTalkDaTemplateUpdateRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApidingTalkDaTemplateUpdate
     */
    dingTalkDaTemplateUpdateRo: DingTalkDaTemplateUpdateRo
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApidingTalkDaTemplateUpdate
     */
    dingTalkDaAppId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkUserLoginRequest {
    /**
     *
     * @type DingTalkUserLoginRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApidingTalkUserLogin
     */
    dingTalkUserLoginRo: DingTalkUserLoginRo
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApidingTalkUserLogin
     */
    agentId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetDdConfigParamRequest {
    /**
     *
     * @type DingTalkDdConfigRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApigetDdConfigParam
     */
    dingTalkDdConfigRo: DingTalkDdConfigRo
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetSkuPageRequest {
    /**
     *
     * @type DingTalkInternalSkuPageRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApigetSkuPage
     */
    dingTalkInternalSkuPageRo: DingTalkInternalSkuPageRo
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetTenantInfo2Request {
    /**
     * kit ID
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApigetTenantInfo2
     */
    suiteId: string
    /**
     * current organization ID
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApigetTenantInfo2
     */
    corpId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvAminUserLoginRequest {
    /**
     *
     * @type DingTalkIsvAminUserLoginRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApiisvAminUserLogin
     */
    dingTalkIsvAminUserLoginRo: DingTalkIsvAminUserLoginRo
    /**
     * kit ID
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApiisvAminUserLogin
     */
    suiteId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvBindSpaceInfoRequest {
    /**
     * kit ID
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApiisvBindSpaceInfo
     */
    suiteId: string
    /**
     * Current Organization ID
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApiisvBindSpaceInfo
     */
    corpId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvUserLoginRequest {
    /**
     *
     * @type DingTalkIsvUserLoginRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApiisvUserLogin
     */
    dingTalkIsvUserLoginRo: DingTalkIsvUserLoginRo
    /**
     * kit ID
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApiisvUserLogin
     */
    suiteId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceDingTalkApiRefreshContact1Request {
    /**
     * space id
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceDingTalkApirefreshContact1
     */
    xSpaceId: string
}

export class ObjectThirdPartyPlatformIntegrationInterfaceDingTalkApi {
    private api: ObservableThirdPartyPlatformIntegrationInterfaceDingTalkApi

    public constructor(configuration: Configuration, requestFactory?: ThirdPartyPlatformIntegrationInterfaceDingTalkApiRequestFactory, responseProcessor?: ThirdPartyPlatformIntegrationInterfaceDingTalkApiResponseProcessor) {
        this.api = new ObservableThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * DingTalk application bind space
     * DingTalk The application enterprise binds the space
     * @param param the request object
     */
    public bindSpace1WithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiBindSpace1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.bindSpace1WithHttpInfo(param.dingTalkAgentBindSpaceDTO, param.agentId,  options).toPromise();
    }

    /**
     * DingTalk application bind space
     * DingTalk The application enterprise binds the space
     * @param param the request object
     */
    public bindSpace1(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiBindSpace1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.bindSpace1(param.dingTalkAgentBindSpaceDTO, param.agentId,  options).toPromise();
    }

    /**
     * Get the space station ID of the application binding, and jump to the login page when success=false
     * Get the space station ID bound by the application
     * @param param the request object
     */
    public bindSpaceInfo1WithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiBindSpaceInfo1Request, options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkBindSpaceVo>> {
        return this.api.bindSpaceInfo1WithHttpInfo(param.agentId,  options).toPromise();
    }

    /**
     * Get the space station ID of the application binding, and jump to the login page when success=false
     * Get the space station ID bound by the application
     * @param param the request object
     */
    public bindSpaceInfo1(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiBindSpaceInfo1Request, options?: Configuration): Promise<ResponseDataDingTalkBindSpaceVo> {
        return this.api.bindSpaceInfo1(param.agentId,  options).toPromise();
    }

    /**
     * Replace the master administrator
     * Tenant space replacement master administrator
     * @param param the request object
     */
    public changeAdmin1WithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiChangeAdmin1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.changeAdmin1WithHttpInfo(param.dingTalkTenantMainAdminChangeRo, param.suiteId,  options).toPromise();
    }

    /**
     * Replace the master administrator
     * Tenant space replacement master administrator
     * @param param the request object
     */
    public changeAdmin1(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiChangeAdmin1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.changeAdmin1(param.dingTalkTenantMainAdminChangeRo, param.suiteId,  options).toPromise();
    }

    /**
     * DingTalk Callback interface--Template Creation
     * DingTalk Callback interface--Template Creation
     * @param param the request object
     */
    public dingTalkDaTemplateCreateWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateCreateRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.dingTalkDaTemplateCreateWithHttpInfo(param.dingTalkDaTemplateCreateRo, param.dingTalkDaAppId,  options).toPromise();
    }

    /**
     * DingTalk Callback interface--Template Creation
     * DingTalk Callback interface--Template Creation
     * @param param the request object
     */
    public dingTalkDaTemplateCreate(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateCreateRequest, options?: Configuration): Promise<void> {
        return this.api.dingTalkDaTemplateCreate(param.dingTalkDaTemplateCreateRo, param.dingTalkDaAppId,  options).toPromise();
    }

    /**
     * DingTalk Callback interface--Template application deletion
     * DingTalk Callback interface--Template application deletion
     * @param param the request object
     */
    public dingTalkDaTemplateDeleteWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateDeleteRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.dingTalkDaTemplateDeleteWithHttpInfo(param.dingTalkDaTemplateDeleteRo, param.dingTalkDaAppId,  options).toPromise();
    }

    /**
     * DingTalk Callback interface--Template application deletion
     * DingTalk Callback interface--Template application deletion
     * @param param the request object
     */
    public dingTalkDaTemplateDelete(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateDeleteRequest, options?: Configuration): Promise<void> {
        return this.api.dingTalkDaTemplateDelete(param.dingTalkDaTemplateDeleteRo, param.dingTalkDaAppId,  options).toPromise();
    }

    /**
     * DingTalk Callback interface--Template application modification
     * DingTalk Callback interface--Template application modification
     * @param param the request object
     */
    public dingTalkDaTemplateUpdateWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateUpdateRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.dingTalkDaTemplateUpdateWithHttpInfo(param.dingTalkDaTemplateUpdateRo, param.dingTalkDaAppId,  options).toPromise();
    }

    /**
     * DingTalk Callback interface--Template application modification
     * DingTalk Callback interface--Template application modification
     * @param param the request object
     */
    public dingTalkDaTemplateUpdate(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateUpdateRequest, options?: Configuration): Promise<void> {
        return this.api.dingTalkDaTemplateUpdate(param.dingTalkDaTemplateUpdateRo, param.dingTalkDaAppId,  options).toPromise();
    }

    /**
     * Use DingTalk login user identity to authorize login. If no user is bound, return parameters to guide registration
     * DingTalk Application user login
     * @param param the request object
     */
    public dingTalkUserLoginWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkUserLoginRequest, options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkUserLoginVo>> {
        return this.api.dingTalkUserLoginWithHttpInfo(param.dingTalkUserLoginRo, param.agentId,  options).toPromise();
    }

    /**
     * Use DingTalk login user identity to authorize login. If no user is bound, return parameters to guide registration
     * DingTalk Application user login
     * @param param the request object
     */
    public dingTalkUserLogin(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkUserLoginRequest, options?: Configuration): Promise<ResponseDataDingTalkUserLoginVo> {
        return this.api.dingTalkUserLogin(param.dingTalkUserLoginRo, param.agentId,  options).toPromise();
    }

    /**
     * Get the dd.config parameter
     * Get the dd.config parameter
     * @param param the request object
     */
    public getDdConfigParamWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetDdConfigParamRequest, options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkDdConfigVo>> {
        return this.api.getDdConfigParamWithHttpInfo(param.dingTalkDdConfigRo,  options).toPromise();
    }

    /**
     * Get the dd.config parameter
     * Get the dd.config parameter
     * @param param the request object
     */
    public getDdConfigParam(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetDdConfigParamRequest, options?: Configuration): Promise<ResponseDataDingTalkDdConfigVo> {
        return this.api.getDdConfigParam(param.dingTalkDdConfigRo,  options).toPromise();
    }

    /**
     * Get the SKU page address of domestic products
     * Get the SKU page address of domestic products
     * @param param the request object
     */
    public getSkuPageWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetSkuPageRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.getSkuPageWithHttpInfo(param.dingTalkInternalSkuPageRo,  options).toPromise();
    }

    /**
     * Get the SKU page address of domestic products
     * Get the SKU page address of domestic products
     * @param param the request object
     */
    public getSkuPage(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetSkuPageRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.getSkuPage(param.dingTalkInternalSkuPageRo,  options).toPromise();
    }

    /**
     * Get the space information bound by the tenant
     * Get tenant binding information
     * @param param the request object
     */
    public getTenantInfo2WithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetTenantInfo2Request, options?: Configuration): Promise<HttpInfo<ResponseDataTenantDetailVO>> {
        return this.api.getTenantInfo2WithHttpInfo(param.suiteId, param.corpId,  options).toPromise();
    }

    /**
     * Get the space information bound by the tenant
     * Get tenant binding information
     * @param param the request object
     */
    public getTenantInfo2(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetTenantInfo2Request, options?: Configuration): Promise<ResponseDataTenantDetailVO> {
        return this.api.getTenantInfo2(param.suiteId, param.corpId,  options).toPromise();
    }

    /**
     * DingTalk workbench entry, administrator login
     * ISV third-party DingTalk application background administrator login
     * @param param the request object
     */
    public isvAminUserLoginWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvAminUserLoginRequest, options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkIsvAdminUserLoginVo>> {
        return this.api.isvAminUserLoginWithHttpInfo(param.dingTalkIsvAminUserLoginRo, param.suiteId,  options).toPromise();
    }

    /**
     * DingTalk workbench entry, administrator login
     * ISV third-party DingTalk application background administrator login
     * @param param the request object
     */
    public isvAminUserLogin(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvAminUserLoginRequest, options?: Configuration): Promise<ResponseDataDingTalkIsvAdminUserLoginVo> {
        return this.api.isvAminUserLogin(param.dingTalkIsvAminUserLoginRo, param.suiteId,  options).toPromise();
    }

    /**
     * Get the space station ID of the application binding, and jump to the login page when success=false
     * ISV Third party application obtains the space ID bound by the application
     * @param param the request object
     */
    public isvBindSpaceInfoWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvBindSpaceInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkBindSpaceVo>> {
        return this.api.isvBindSpaceInfoWithHttpInfo(param.suiteId, param.corpId,  options).toPromise();
    }

    /**
     * Get the space station ID of the application binding, and jump to the login page when success=false
     * ISV Third party application obtains the space ID bound by the application
     * @param param the request object
     */
    public isvBindSpaceInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvBindSpaceInfoRequest, options?: Configuration): Promise<ResponseDataDingTalkBindSpaceVo> {
        return this.api.isvBindSpaceInfo(param.suiteId, param.corpId,  options).toPromise();
    }

    /**
     * Use the third-party DingTalk login user identity to authorize login. If no user is bound, return the parameter to guide the registration
     * ISV Third party Ding Talk application user login
     * @param param the request object
     */
    public isvUserLoginWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvUserLoginRequest, options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkIsvUserLoginVo>> {
        return this.api.isvUserLoginWithHttpInfo(param.dingTalkIsvUserLoginRo, param.suiteId,  options).toPromise();
    }

    /**
     * Use the third-party DingTalk login user identity to authorize login. If no user is bound, return the parameter to guide the registration
     * ISV Third party Ding Talk application user login
     * @param param the request object
     */
    public isvUserLogin(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvUserLoginRequest, options?: Configuration): Promise<ResponseDataDingTalkIsvUserLoginVo> {
        return this.api.isvUserLogin(param.dingTalkIsvUserLoginRo, param.suiteId,  options).toPromise();
    }

    /**
     * Refresh the address book of DingTalk application
     * Refresh the address book of DingTalk application
     * @param param the request object
     */
    public refreshContact1WithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiRefreshContact1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.refreshContact1WithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Refresh the address book of DingTalk application
     * Refresh the address book of DingTalk application
     * @param param the request object
     */
    public refreshContact1(param: ThirdPartyPlatformIntegrationInterfaceDingTalkApiRefreshContact1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.refreshContact1(param.xSpaceId,  options).toPromise();
    }

}

import { ObservableThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi } from "./ObservableAPI";
import { ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiRequestFactory, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiResponseProcessor} from "../apis/ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi";

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiCopyTeamAndMembersRequest {
    /**
     *
     * @type OneAccessCopyInfoRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApicopyTeamAndMembers
     */
    oneAccessCopyInfoRo: OneAccessCopyInfoRo
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiLogin2Request {
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOauth2CallbackRequest {
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApioauth2Callback
     */
    code: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApioauth2Callback
     */
    state: string
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgCreateRequest {
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgDeleteRequest {
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgUpdateRequest {
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiQueryOrgByIdServiceRequest {
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiQueryUserByIdServiceRequest {
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserCreateRequest {
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserDeleteRequest {
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserLogin1Request {
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserSchemaRequest {
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserUpdateRequest {
}

export interface ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiWecomLoginRequest {
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiwecomLogin
     */
    code: string
}

export class ObjectThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi {
    private api: ObservableThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi

    public constructor(configuration: Configuration, requestFactory?: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiRequestFactory, responseProcessor?: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiResponseProcessor) {
        this.api = new ObservableThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Synchronize a group or member to the current station
     * Sync group or member to Honma station
     * @param param the request object
     */
    public copyTeamAndMembersWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiCopyTeamAndMembersRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.copyTeamAndMembersWithHttpInfo(param.oneAccessCopyInfoRo,  options).toPromise();
    }

    /**
     * Synchronize a group or member to the current station
     * Sync group or member to Honma station
     * @param param the request object
     */
    public copyTeamAndMembers(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiCopyTeamAndMembersRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.copyTeamAndMembers(param.oneAccessCopyInfoRo,  options).toPromise();
    }

    /**
     * login
     * Unified login interface
     * @param param the request object
     */
    public login2WithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiLogin2Request = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.login2WithHttpInfo( options).toPromise();
    }

    /**
     * login
     * Unified login interface
     * @param param the request object
     */
    public login2(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiLogin2Request = {}, options?: Configuration): Promise<void> {
        return this.api.login2( options).toPromise();
    }

    /**
     * Accept the authorization interface of OneAccess and call back the login
     * Login callback interface
     * @param param the request object
     */
    public oauth2CallbackWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOauth2CallbackRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.oauth2CallbackWithHttpInfo(param.code, param.state,  options).toPromise();
    }

    /**
     * Accept the authorization interface of OneAccess and call back the login
     * Login callback interface
     * @param param the request object
     */
    public oauth2Callback(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOauth2CallbackRequest, options?: Configuration): Promise<void> {
        return this.api.oauth2Callback(param.code, param.state,  options).toPromise();
    }

    /**
     * Organizations are created by oneAccess
     * organization creation
     * @param param the request object
     */
    public orgCreateWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgCreateRequest = {}, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.orgCreateWithHttpInfo( options).toPromise();
    }

    /**
     * Organizations are created by oneAccess
     * organization creation
     * @param param the request object
     */
    public orgCreate(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgCreateRequest = {}, options?: Configuration): Promise<string> {
        return this.api.orgCreate( options).toPromise();
    }

    /**
     * Active deletion of an organization by OneAccess
     * Organization deletion
     * @param param the request object
     */
    public orgDeleteWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgDeleteRequest = {}, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.orgDeleteWithHttpInfo( options).toPromise();
    }

    /**
     * Active deletion of an organization by OneAccess
     * Organization deletion
     * @param param the request object
     */
    public orgDelete(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgDeleteRequest = {}, options?: Configuration): Promise<string> {
        return this.api.orgDelete( options).toPromise();
    }

    /**
     * Organizations are updated by OneAccess
     * Organizational update
     * @param param the request object
     */
    public orgUpdateWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgUpdateRequest = {}, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.orgUpdateWithHttpInfo( options).toPromise();
    }

    /**
     * Organizations are updated by OneAccess
     * Organizational update
     * @param param the request object
     */
    public orgUpdate(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgUpdateRequest = {}, options?: Configuration): Promise<string> {
        return this.api.orgUpdate( options).toPromise();
    }

    /**
     * query org by params
     * query org
     * @param param the request object
     */
    public queryOrgByIdServiceWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiQueryOrgByIdServiceRequest = {}, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.queryOrgByIdServiceWithHttpInfo( options).toPromise();
    }

    /**
     * query org by params
     * query org
     * @param param the request object
     */
    public queryOrgByIdService(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiQueryOrgByIdServiceRequest = {}, options?: Configuration): Promise<string> {
        return this.api.queryOrgByIdService( options).toPromise();
    }

    /**
     * query user by params
     * query user
     * @param param the request object
     */
    public queryUserByIdServiceWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiQueryUserByIdServiceRequest = {}, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.queryUserByIdServiceWithHttpInfo( options).toPromise();
    }

    /**
     * query user by params
     * query user
     * @param param the request object
     */
    public queryUserByIdService(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiQueryUserByIdServiceRequest = {}, options?: Configuration): Promise<string> {
        return this.api.queryUserByIdService( options).toPromise();
    }

    /**
     * The account is actively created by the oneAccess platform
     * Account creation
     * @param param the request object
     */
    public userCreateWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserCreateRequest = {}, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.userCreateWithHttpInfo( options).toPromise();
    }

    /**
     * The account is actively created by the oneAccess platform
     * Account creation
     * @param param the request object
     */
    public userCreate(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserCreateRequest = {}, options?: Configuration): Promise<string> {
        return this.api.userCreate( options).toPromise();
    }

    /**
     * Delete the account by the oneAccess platform
     * user delete
     * @param param the request object
     */
    public userDeleteWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserDeleteRequest = {}, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.userDeleteWithHttpInfo( options).toPromise();
    }

    /**
     * Delete the account by the oneAccess platform
     * user delete
     * @param param the request object
     */
    public userDelete(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserDeleteRequest = {}, options?: Configuration): Promise<string> {
        return this.api.userDelete( options).toPromise();
    }

    /**
     * Log in to the openaccess interface, redirect iam single sign-on
     * login
     * @param param the request object
     */
    public userLogin1WithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserLogin1Request = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.userLogin1WithHttpInfo( options).toPromise();
    }

    /**
     * Log in to the openaccess interface, redirect iam single sign-on
     * login
     * @param param the request object
     */
    public userLogin1(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserLogin1Request = {}, options?: Configuration): Promise<void> {
        return this.api.userLogin1( options).toPromise();
    }

    /**
     * Get all information about objects such as system account, institution role, etc.
     * Get schema information
     * @param param the request object
     */
    public userSchemaWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserSchemaRequest = {}, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.userSchemaWithHttpInfo( options).toPromise();
    }

    /**
     * Get all information about objects such as system account, institution role, etc.
     * Get schema information
     * @param param the request object
     */
    public userSchema(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserSchemaRequest = {}, options?: Configuration): Promise<string> {
        return this.api.userSchema( options).toPromise();
    }

    /**
     * The user information is actively updated by the OneAccess platform
     * User update
     * @param param the request object
     */
    public userUpdateWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserUpdateRequest = {}, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.userUpdateWithHttpInfo( options).toPromise();
    }

    /**
     * The user information is actively updated by the OneAccess platform
     * User update
     * @param param the request object
     */
    public userUpdate(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserUpdateRequest = {}, options?: Configuration): Promise<string> {
        return this.api.userUpdate( options).toPromise();
    }

    /**
     * Government WeCom Login
     * Government Affairs WeCom Login Interface
     * @param param the request object
     */
    public wecomLoginWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiWecomLoginRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.wecomLoginWithHttpInfo(param.code,  options).toPromise();
    }

    /**
     * Government WeCom Login
     * Government Affairs WeCom Login Interface
     * @param param the request object
     */
    public wecomLogin(param: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiWecomLoginRequest, options?: Configuration): Promise<void> {
        return this.api.wecomLogin(param.code,  options).toPromise();
    }

}

import { ObservableThirdPartyPlatformIntegrationInterfaceWeComApi } from "./ObservableAPI";
import { ThirdPartyPlatformIntegrationInterfaceWeComApiRequestFactory, ThirdPartyPlatformIntegrationInterfaceWeComApiResponseProcessor} from "../apis/ThirdPartyPlatformIntegrationInterfaceWeComApi";

export interface ThirdPartyPlatformIntegrationInterfaceWeComApiBindSpaceInfoRequest {
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComApibindSpaceInfo
     */
    corpId: string
    /**
     *
     * @type number
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComApibindSpaceInfo
     */
    agentId: number
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComApiGetTenantBindWeComConfigRequest {
    /**
     * space ID
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComApigetTenantBindWeComConfig
     */
    xSpaceId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComApiHotsTransformIpRequest {
    /**
     *
     * @type HotsTransformIpRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComApihotsTransformIp
     */
    hotsTransformIpRo: HotsTransformIpRo
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComApiSocialTenantEnvRequest {
    /**
     * Real request address
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComApisocialTenantEnv
     */
    xRealHost: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComApiWeComBindConfigRequest {
    /**
     *
     * @type WeComAgentBindSpaceRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComApiweComBindConfig
     */
    weComAgentBindSpaceRo: WeComAgentBindSpaceRo
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComApiweComBindConfig
     */
    configSha: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComApiWeComCheckConfigRequest {
    /**
     *
     * @type WeComCheckConfigRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComApiweComCheckConfig
     */
    weComCheckConfigRo: WeComCheckConfigRo
    /**
     * space id
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComApiweComCheckConfig
     */
    xSpaceId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComApiWeComRefreshContactRequest {
    /**
     * space ID
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComApiweComRefreshContact
     */
    xSpaceId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComApiWeComUserLoginRequest {
    /**
     *
     * @type WeComUserLoginRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComApiweComUserLogin
     */
    weComUserLoginRo: WeComUserLoginRo
}

export class ObjectThirdPartyPlatformIntegrationInterfaceWeComApi {
    private api: ObservableThirdPartyPlatformIntegrationInterfaceWeComApi

    public constructor(configuration: Configuration, requestFactory?: ThirdPartyPlatformIntegrationInterfaceWeComApiRequestFactory, responseProcessor?: ThirdPartyPlatformIntegrationInterfaceWeComApiResponseProcessor) {
        this.api = new ObservableThirdPartyPlatformIntegrationInterfaceWeComApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get the space ID bound to the self built application of WeCom, and jump to the login page when success=false
     * Obtain the space ID bound by the self built application of WeCom
     * @param param the request object
     */
    public bindSpaceInfoWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComApiBindSpaceInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWeComBindSpaceVo>> {
        return this.api.bindSpaceInfoWithHttpInfo(param.corpId, param.agentId,  options).toPromise();
    }

    /**
     * Get the space ID bound to the self built application of WeCom, and jump to the login page when success=false
     * Obtain the space ID bound by the self built application of WeCom
     * @param param the request object
     */
    public bindSpaceInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComApiBindSpaceInfoRequest, options?: Configuration): Promise<ResponseDataWeComBindSpaceVo> {
        return this.api.bindSpaceInfo(param.corpId, param.agentId,  options).toPromise();
    }

    /**
     * Get the bound WeCom application configuration of the space station
     * Get the bound WeCom application configuration of the space station
     * @param param the request object
     */
    public getTenantBindWeComConfigWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComApiGetTenantBindWeComConfigRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWeComBindConfigVo>> {
        return this.api.getTenantBindWeComConfigWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Get the bound WeCom application configuration of the space station
     * Get the bound WeCom application configuration of the space station
     * @param param the request object
     */
    public getTenantBindWeComConfig(param: ThirdPartyPlatformIntegrationInterfaceWeComApiGetTenantBindWeComConfigRequest, options?: Configuration): Promise<ResponseDataWeComBindConfigVo> {
        return this.api.getTenantBindWeComConfig(param.xSpaceId,  options).toPromise();
    }

    /**
     * Used to generate We Com scanning code to log in and verify whether the domain name can be accessed
     * WeCom Verification domain name conversion IP
     * @param param the request object
     */
    public hotsTransformIpWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComApiHotsTransformIpRequest, options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        return this.api.hotsTransformIpWithHttpInfo(param.hotsTransformIpRo,  options).toPromise();
    }

    /**
     * Used to generate We Com scanning code to log in and verify whether the domain name can be accessed
     * WeCom Verification domain name conversion IP
     * @param param the request object
     */
    public hotsTransformIp(param: ThirdPartyPlatformIntegrationInterfaceWeComApiHotsTransformIpRequest, options?: Configuration): Promise<ResponseDataBoolean> {
        return this.api.hotsTransformIp(param.hotsTransformIpRo,  options).toPromise();
    }

    /**
     * Get integrated tenant environment configuration
     * Get integrated tenant environment configuration
     * @param param the request object
     */
    public socialTenantEnvWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComApiSocialTenantEnvRequest, options?: Configuration): Promise<HttpInfo<ResponseDataSocialTenantEnvVo>> {
        return this.api.socialTenantEnvWithHttpInfo(param.xRealHost,  options).toPromise();
    }

    /**
     * Get integrated tenant environment configuration
     * Get integrated tenant environment configuration
     * @param param the request object
     */
    public socialTenantEnv(param: ThirdPartyPlatformIntegrationInterfaceWeComApiSocialTenantEnvRequest, options?: Configuration): Promise<ResponseDataSocialTenantEnvVo> {
        return this.api.socialTenantEnv(param.xRealHost,  options).toPromise();
    }

    /**
     * WeCom Application binding space
     * WeCom Application binding space
     * @param param the request object
     */
    public weComBindConfigWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComApiWeComBindConfigRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.weComBindConfigWithHttpInfo(param.weComAgentBindSpaceRo, param.configSha,  options).toPromise();
    }

    /**
     * WeCom Application binding space
     * WeCom Application binding space
     * @param param the request object
     */
    public weComBindConfig(param: ThirdPartyPlatformIntegrationInterfaceWeComApiWeComBindConfigRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.weComBindConfig(param.weComAgentBindSpaceRo, param.configSha,  options).toPromise();
    }

    /**
     * Before binding We Com, verify the third-party application configuration in advance. If the code scanning verification is not successful, the configuration file is not effective
     * WeCom Verification - Authorization Application Configuration
     * @param param the request object
     */
    public weComCheckConfigWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComApiWeComCheckConfigRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWeComCheckConfigVo>> {
        return this.api.weComCheckConfigWithHttpInfo(param.weComCheckConfigRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Before binding We Com, verify the third-party application configuration in advance. If the code scanning verification is not successful, the configuration file is not effective
     * WeCom Verification - Authorization Application Configuration
     * @param param the request object
     */
    public weComCheckConfig(param: ThirdPartyPlatformIntegrationInterfaceWeComApiWeComCheckConfigRequest, options?: Configuration): Promise<ResponseDataWeComCheckConfigVo> {
        return this.api.weComCheckConfig(param.weComCheckConfigRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * WeCom Apply to refresh the address book manually
     * WeCom App Refresh Address Book
     * @param param the request object
     */
    public weComRefreshContactWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComApiWeComRefreshContactRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.weComRefreshContactWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * WeCom Apply to refresh the address book manually
     * WeCom App Refresh Address Book
     * @param param the request object
     */
    public weComRefreshContact(param: ThirdPartyPlatformIntegrationInterfaceWeComApiWeComRefreshContactRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.weComRefreshContact(param.xSpaceId,  options).toPromise();
    }

    /**
     * Use WeCom login user identity to authorize login, and return parameters to guide registration when no user is bound
     * WeCom Application user login
     * @param param the request object
     */
    public weComUserLoginWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComApiWeComUserLoginRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWeComUserLoginVo>> {
        return this.api.weComUserLoginWithHttpInfo(param.weComUserLoginRo,  options).toPromise();
    }

    /**
     * Use WeCom login user identity to authorize login, and return parameters to guide registration when no user is bound
     * WeCom Application user login
     * @param param the request object
     */
    public weComUserLogin(param: ThirdPartyPlatformIntegrationInterfaceWeComApiWeComUserLoginRequest, options?: Configuration): Promise<ResponseDataWeComUserLoginVo> {
        return this.api.weComUserLogin(param.weComUserLoginRo,  options).toPromise();
    }

}

import { ObservableThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi } from "./ObservableAPI";
import { ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiRequestFactory, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiResponseProcessor} from "../apis/ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi";

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetCallbackRequest {
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApigetCallback
     */
    msgSignature: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApigetCallback
     */
    timestamp: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApigetCallback
     */
    nonce: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApigetCallback
     */
    echostr: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetJsSdkAgentConfigRequest {
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApigetJsSdkAgentConfig
     */
    spaceId: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApigetJsSdkAgentConfig
     */
    url: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetJsSdkConfigRequest {
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApigetJsSdkConfig
     */
    spaceId: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApigetJsSdkConfig
     */
    url: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetRegisterInstallSelfUrlRequest {
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApigetRegisterInstallSelfUrl
     */
    finalPath: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetRegisterInstallWeComRequest {
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetTenantInfoRequest {
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApigetTenantInfo
     */
    suiteId: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApigetTenantInfo
     */
    authCorpId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostAdminChangeRequest {
    /**
     *
     * @type WeComIsvAdminChangeRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApipostAdminChange
     */
    weComIsvAdminChangeRo: WeComIsvAdminChangeRo
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostCallbackRequest {
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApipostCallback
     */
    body: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApipostCallback
     */
    type: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApipostCallback
     */
    msgSignature: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApipostCallback
     */
    timestamp: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApipostCallback
     */
    nonce: string
    /**
     *
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApipostCallback
     */
    suiteId?: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostInviteUnauthMemberRequest {
    /**
     *
     * @type WeComIsvInviteUnauthMemberRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApipostInviteUnauthMember
     */
    weComIsvInviteUnauthMemberRo: WeComIsvInviteUnauthMemberRo
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginAdminCodeRequest {
    /**
     *
     * @type WeComIsvLoginAdminCodeRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApipostLoginAdminCode
     */
    weComIsvLoginAdminCodeRo: WeComIsvLoginAdminCodeRo
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginAuthCodeRequest {
    /**
     *
     * @type WeComIsvLoginAuthCodeRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApipostLoginAuthCode
     */
    weComIsvLoginAuthCodeRo: WeComIsvLoginAuthCodeRo
}

export interface ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginCodeRequest {
    /**
     *
     * @type WeComIsvLoginCodeRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApipostLoginCode
     */
    weComIsvLoginCodeRo: WeComIsvLoginCodeRo
}

export class ObjectThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi {
    private api: ObservableThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi

    public constructor(configuration: Configuration, requestFactory?: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiRequestFactory, responseProcessor?: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiResponseProcessor) {
        this.api = new ObservableThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public getCallbackWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetCallbackRequest, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.getCallbackWithHttpInfo(param.msgSignature, param.timestamp, param.nonce, param.echostr,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getCallback(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetCallbackRequest, options?: Configuration): Promise<string> {
        return this.api.getCallback(param.msgSignature, param.timestamp, param.nonce, param.echostr,  options).toPromise();
    }

    /**
     * JS-SDK Verify the configuration parameters of application identity and permission
     * JS-SDK Verify the configuration parameters of application identity and permission
     * @param param the request object
     */
    public getJsSdkAgentConfigWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetJsSdkAgentConfigRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvJsSdkAgentConfigVo>> {
        return this.api.getJsSdkAgentConfigWithHttpInfo(param.spaceId, param.url,  options).toPromise();
    }

    /**
     * JS-SDK Verify the configuration parameters of application identity and permission
     * JS-SDK Verify the configuration parameters of application identity and permission
     * @param param the request object
     */
    public getJsSdkAgentConfig(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetJsSdkAgentConfigRequest, options?: Configuration): Promise<ResponseDataWeComIsvJsSdkAgentConfigVo> {
        return this.api.getJsSdkAgentConfig(param.spaceId, param.url,  options).toPromise();
    }

    /**
     * JS-SDK Verify the configuration parameters of enterprise identity and authority
     * JS-SDK Verify the configuration parameters of enterprise identity and authority
     * @param param the request object
     */
    public getJsSdkConfigWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetJsSdkConfigRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvJsSdkConfigVo>> {
        return this.api.getJsSdkConfigWithHttpInfo(param.spaceId, param.url,  options).toPromise();
    }

    /**
     * JS-SDK Verify the configuration parameters of enterprise identity and authority
     * JS-SDK Verify the configuration parameters of enterprise identity and authority
     * @param param the request object
     */
    public getJsSdkConfig(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetJsSdkConfigRequest, options?: Configuration): Promise<ResponseDataWeComIsvJsSdkConfigVo> {
        return this.api.getJsSdkConfig(param.spaceId, param.url,  options).toPromise();
    }

    /**
     * Get the authorization link for installing vika
     * Get the authorization link for installing vika
     * @param param the request object
     */
    public getRegisterInstallSelfUrlWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetRegisterInstallSelfUrlRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvRegisterInstallSelfUrlVo>> {
        return this.api.getRegisterInstallSelfUrlWithHttpInfo(param.finalPath,  options).toPromise();
    }

    /**
     * Get the authorization link for installing vika
     * Get the authorization link for installing vika
     * @param param the request object
     */
    public getRegisterInstallSelfUrl(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetRegisterInstallSelfUrlRequest, options?: Configuration): Promise<ResponseDataWeComIsvRegisterInstallSelfUrlVo> {
        return this.api.getRegisterInstallSelfUrl(param.finalPath,  options).toPromise();
    }

    /**
     * Get the registration code for registering WeCom and installing vika
     * Get the registration code for registering WeCom and installing vika
     * @param param the request object
     */
    public getRegisterInstallWeComWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetRegisterInstallWeComRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvRegisterInstallWeComVo>> {
        return this.api.getRegisterInstallWeComWithHttpInfo( options).toPromise();
    }

    /**
     * Get the registration code for registering WeCom and installing vika
     * Get the registration code for registering WeCom and installing vika
     * @param param the request object
     */
    public getRegisterInstallWeCom(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetRegisterInstallWeComRequest = {}, options?: Configuration): Promise<ResponseDataWeComIsvRegisterInstallWeComVo> {
        return this.api.getRegisterInstallWeCom( options).toPromise();
    }

    /**
     * Get tenant binding information
     * Get tenant binding information
     * @param param the request object
     */
    public getTenantInfoWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetTenantInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataTenantDetailVO>> {
        return this.api.getTenantInfoWithHttpInfo(param.suiteId, param.authCorpId,  options).toPromise();
    }

    /**
     * Get tenant binding information
     * Get tenant binding information
     * @param param the request object
     */
    public getTenantInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetTenantInfoRequest, options?: Configuration): Promise<ResponseDataTenantDetailVO> {
        return this.api.getTenantInfo(param.suiteId, param.authCorpId,  options).toPromise();
    }

    /**
     * Tenant space replacement master administrator
     * Tenant space replacement master administrator
     * @param param the request object
     */
    public postAdminChangeWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostAdminChangeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.postAdminChangeWithHttpInfo(param.weComIsvAdminChangeRo,  options).toPromise();
    }

    /**
     * Tenant space replacement master administrator
     * Tenant space replacement master administrator
     * @param param the request object
     */
    public postAdminChange(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostAdminChangeRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.postAdminChange(param.weComIsvAdminChangeRo,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public postCallbackWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostCallbackRequest, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.postCallbackWithHttpInfo(param.body, param.type, param.msgSignature, param.timestamp, param.nonce, param.suiteId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public postCallback(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostCallbackRequest, options?: Configuration): Promise<string> {
        return this.api.postCallback(param.body, param.type, param.msgSignature, param.timestamp, param.nonce, param.suiteId,  options).toPromise();
    }

    /**
     * Invite unauthorized users
     * Invite unauthorized users
     * @param param the request object
     */
    public postInviteUnauthMemberWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostInviteUnauthMemberRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.postInviteUnauthMemberWithHttpInfo(param.weComIsvInviteUnauthMemberRo,  options).toPromise();
    }

    /**
     * Invite unauthorized users
     * Invite unauthorized users
     * @param param the request object
     */
    public postInviteUnauthMember(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostInviteUnauthMemberRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.postInviteUnauthMember(param.weComIsvInviteUnauthMemberRo,  options).toPromise();
    }

    /**
     * WeCom administrator jumps to the third-party application management page and automatically logs in
     * WeCom administrator jumps to the third-party application management page and automatically logs in
     * @param param the request object
     */
    public postLoginAdminCodeWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginAdminCodeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvUserLoginVo>> {
        return this.api.postLoginAdminCodeWithHttpInfo(param.weComIsvLoginAdminCodeRo,  options).toPromise();
    }

    /**
     * WeCom administrator jumps to the third-party application management page and automatically logs in
     * WeCom administrator jumps to the third-party application management page and automatically logs in
     * @param param the request object
     */
    public postLoginAdminCode(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginAdminCodeRequest, options?: Configuration): Promise<ResponseDataWeComIsvUserLoginVo> {
        return this.api.postLoginAdminCode(param.weComIsvLoginAdminCodeRo,  options).toPromise();
    }

    /**
     * WeCom third-party application scanning code login
     * WeCom third-party application scanning code login
     * @param param the request object
     */
    public postLoginAuthCodeWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginAuthCodeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvUserLoginVo>> {
        return this.api.postLoginAuthCodeWithHttpInfo(param.weComIsvLoginAuthCodeRo,  options).toPromise();
    }

    /**
     * WeCom third-party application scanning code login
     * WeCom third-party application scanning code login
     * @param param the request object
     */
    public postLoginAuthCode(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginAuthCodeRequest, options?: Configuration): Promise<ResponseDataWeComIsvUserLoginVo> {
        return this.api.postLoginAuthCode(param.weComIsvLoginAuthCodeRo,  options).toPromise();
    }

    /**
     * Auto login to third-party applications within WeCom
     * Auto login to third-party applications within WeCom
     * @param param the request object
     */
    public postLoginCodeWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginCodeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvUserLoginVo>> {
        return this.api.postLoginCodeWithHttpInfo(param.weComIsvLoginCodeRo,  options).toPromise();
    }

    /**
     * Auto login to third-party applications within WeCom
     * Auto login to third-party applications within WeCom
     * @param param the request object
     */
    public postLoginCode(param: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginCodeRequest, options?: Configuration): Promise<ResponseDataWeComIsvUserLoginVo> {
        return this.api.postLoginCode(param.weComIsvLoginCodeRo,  options).toPromise();
    }

}

import { ObservableThirdPartyPlatformIntegrationInterfaceWoaApi } from "./ObservableAPI";
import { ThirdPartyPlatformIntegrationInterfaceWoaApiRequestFactory, ThirdPartyPlatformIntegrationInterfaceWoaApiResponseProcessor} from "../apis/ThirdPartyPlatformIntegrationInterfaceWoaApi";

export interface ThirdPartyPlatformIntegrationInterfaceWoaApiBindSpaceRequest {
    /**
     *
     * @type WoaAppBindSpaceRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceWoaApibindSpace
     */
    woaAppBindSpaceRo: WoaAppBindSpaceRo
}

export interface ThirdPartyPlatformIntegrationInterfaceWoaApiRefreshContactRequest {
    /**
     * Space ID
     * @type string
     * @memberof ThirdPartyPlatformIntegrationInterfaceWoaApirefreshContact
     */
    xSpaceId: string
}

export interface ThirdPartyPlatformIntegrationInterfaceWoaApiUserLoginRequest {
    /**
     *
     * @type WoaUserLoginRo
     * @memberof ThirdPartyPlatformIntegrationInterfaceWoaApiuserLogin
     */
    woaUserLoginRo: WoaUserLoginRo
}

export class ObjectThirdPartyPlatformIntegrationInterfaceWoaApi {
    private api: ObservableThirdPartyPlatformIntegrationInterfaceWoaApi

    public constructor(configuration: Configuration, requestFactory?: ThirdPartyPlatformIntegrationInterfaceWoaApiRequestFactory, responseProcessor?: ThirdPartyPlatformIntegrationInterfaceWoaApiResponseProcessor) {
        this.api = new ObservableThirdPartyPlatformIntegrationInterfaceWoaApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Woa Application Binding Space
     * @param param the request object
     */
    public bindSpaceWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWoaApiBindSpaceRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.bindSpaceWithHttpInfo(param.woaAppBindSpaceRo,  options).toPromise();
    }

    /**
     * Woa Application Binding Space
     * @param param the request object
     */
    public bindSpace(param: ThirdPartyPlatformIntegrationInterfaceWoaApiBindSpaceRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.bindSpace(param.woaAppBindSpaceRo,  options).toPromise();
    }

    /**
     * Apply to refresh the address book manually
     * Woa App Refresh Address Book
     * @param param the request object
     */
    public refreshContactWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWoaApiRefreshContactRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.refreshContactWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Apply to refresh the address book manually
     * Woa App Refresh Address Book
     * @param param the request object
     */
    public refreshContact(param: ThirdPartyPlatformIntegrationInterfaceWoaApiRefreshContactRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.refreshContact(param.xSpaceId,  options).toPromise();
    }

    /**
     * Woa Application User Login
     * @param param the request object
     */
    public userLoginWithHttpInfo(param: ThirdPartyPlatformIntegrationInterfaceWoaApiUserLoginRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWoaUserLoginVo>> {
        return this.api.userLoginWithHttpInfo(param.woaUserLoginRo,  options).toPromise();
    }

    /**
     * Woa Application User Login
     * @param param the request object
     */
    public userLogin(param: ThirdPartyPlatformIntegrationInterfaceWoaApiUserLoginRequest, options?: Configuration): Promise<ResponseDataWoaUserLoginVo> {
        return this.api.userLogin(param.woaUserLoginRo,  options).toPromise();
    }

}

import { ObservableVCodeActivityAPIApi } from "./ObservableAPI";
import { VCodeActivityAPIApiRequestFactory, VCodeActivityAPIApiResponseProcessor} from "../apis/VCodeActivityAPIApi";

export interface VCodeActivityAPIApiCreate2Request {
    /**
     *
     * @type VCodeActivityRo
     * @memberof VCodeActivityAPIApicreate2
     */
    vCodeActivityRo: VCodeActivityRo
}

export interface VCodeActivityAPIApiDelete4Request {
    /**
     * Activity ID
     * @type string
     * @memberof VCodeActivityAPIApidelete4
     */
    activityId: string
}

export interface VCodeActivityAPIApiDelete5Request {
    /**
     * Activity ID
     * @type string
     * @memberof VCodeActivityAPIApidelete5
     */
    activityId: string
}

export interface VCodeActivityAPIApiEdit2Request {
    /**
     *
     * @type VCodeActivityRo
     * @memberof VCodeActivityAPIApiedit2
     */
    vCodeActivityRo: VCodeActivityRo
    /**
     * Activity ID
     * @type string
     * @memberof VCodeActivityAPIApiedit2
     */
    activityId: string
}

export interface VCodeActivityAPIApiList1Request {
    /**
     * Keyword
     * @type string
     * @memberof VCodeActivityAPIApilist1
     */
    keyword?: string
}

export interface VCodeActivityAPIApiPage2Request {
    /**
     *
     * @type Page
     * @memberof VCodeActivityAPIApipage2
     */
    page: Page
    /**
     * Page params
     * @type string
     * @memberof VCodeActivityAPIApipage2
     */
    pageObjectParams: string
    /**
     * Keyword
     * @type string
     * @memberof VCodeActivityAPIApipage2
     */
    keyword?: string
}

export class ObjectVCodeActivityAPIApi {
    private api: ObservableVCodeActivityAPIApi

    public constructor(configuration: Configuration, requestFactory?: VCodeActivityAPIApiRequestFactory, responseProcessor?: VCodeActivityAPIApiResponseProcessor) {
        this.api = new ObservableVCodeActivityAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Activity
     * @param param the request object
     */
    public create2WithHttpInfo(param: VCodeActivityAPIApiCreate2Request, options?: Configuration): Promise<HttpInfo<ResponseDataVCodeActivityVo>> {
        return this.api.create2WithHttpInfo(param.vCodeActivityRo,  options).toPromise();
    }

    /**
     * Create Activity
     * @param param the request object
     */
    public create2(param: VCodeActivityAPIApiCreate2Request, options?: Configuration): Promise<ResponseDataVCodeActivityVo> {
        return this.api.create2(param.vCodeActivityRo,  options).toPromise();
    }

    /**
     * Delete Activity
     * @param param the request object
     */
    public delete4WithHttpInfo(param: VCodeActivityAPIApiDelete4Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete4WithHttpInfo(param.activityId,  options).toPromise();
    }

    /**
     * Delete Activity
     * @param param the request object
     */
    public delete4(param: VCodeActivityAPIApiDelete4Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete4(param.activityId,  options).toPromise();
    }

    /**
     * Delete Activity
     * @param param the request object
     */
    public delete5WithHttpInfo(param: VCodeActivityAPIApiDelete5Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete5WithHttpInfo(param.activityId,  options).toPromise();
    }

    /**
     * Delete Activity
     * @param param the request object
     */
    public delete5(param: VCodeActivityAPIApiDelete5Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete5(param.activityId,  options).toPromise();
    }

    /**
     * Edit Activity Info
     * @param param the request object
     */
    public edit2WithHttpInfo(param: VCodeActivityAPIApiEdit2Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.edit2WithHttpInfo(param.vCodeActivityRo, param.activityId,  options).toPromise();
    }

    /**
     * Edit Activity Info
     * @param param the request object
     */
    public edit2(param: VCodeActivityAPIApiEdit2Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.edit2(param.vCodeActivityRo, param.activityId,  options).toPromise();
    }

    /**
     * Query Activity List
     * @param param the request object
     */
    public list1WithHttpInfo(param: VCodeActivityAPIApiList1Request = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListVCodeActivityVo>> {
        return this.api.list1WithHttpInfo(param.keyword,  options).toPromise();
    }

    /**
     * Query Activity List
     * @param param the request object
     */
    public list1(param: VCodeActivityAPIApiList1Request = {}, options?: Configuration): Promise<ResponseDataListVCodeActivityVo> {
        return this.api.list1(param.keyword,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Activity Page
     * @param param the request object
     */
    public page2WithHttpInfo(param: VCodeActivityAPIApiPage2Request, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoVCodeActivityPageVo>> {
        return this.api.page2WithHttpInfo(param.page, param.pageObjectParams, param.keyword,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Activity Page
     * @param param the request object
     */
    public page2(param: VCodeActivityAPIApiPage2Request, options?: Configuration): Promise<ResponseDataPageInfoVCodeActivityPageVo> {
        return this.api.page2(param.page, param.pageObjectParams, param.keyword,  options).toPromise();
    }

}

import { ObservableVCodeSystemCouponAPIApi } from "./ObservableAPI";
import { VCodeSystemCouponAPIApiRequestFactory, VCodeSystemCouponAPIApiResponseProcessor} from "../apis/VCodeSystemCouponAPIApi";

export interface VCodeSystemCouponAPIApiCreate1Request {
    /**
     *
     * @type VCodeCouponRo
     * @memberof VCodeSystemCouponAPIApicreate1
     */
    vCodeCouponRo: VCodeCouponRo
}

export interface VCodeSystemCouponAPIApiDelete2Request {
    /**
     * Coupon Template ID
     * @type string
     * @memberof VCodeSystemCouponAPIApidelete2
     */
    templateId: string
}

export interface VCodeSystemCouponAPIApiDelete3Request {
    /**
     * Coupon Template ID
     * @type string
     * @memberof VCodeSystemCouponAPIApidelete3
     */
    templateId: string
}

export interface VCodeSystemCouponAPIApiEdit1Request {
    /**
     *
     * @type VCodeCouponRo
     * @memberof VCodeSystemCouponAPIApiedit1
     */
    vCodeCouponRo: VCodeCouponRo
    /**
     * Coupon Template ID
     * @type string
     * @memberof VCodeSystemCouponAPIApiedit1
     */
    templateId: string
}

export interface VCodeSystemCouponAPIApiListRequest {
    /**
     * Keyword
     * @type string
     * @memberof VCodeSystemCouponAPIApilist
     */
    keyword?: string
}

export interface VCodeSystemCouponAPIApiPage1Request {
    /**
     *
     * @type Page
     * @memberof VCodeSystemCouponAPIApipage1
     */
    page: Page
    /**
     * Page Params
     * @type string
     * @memberof VCodeSystemCouponAPIApipage1
     */
    pageObjectParams: string
    /**
     * Keyword
     * @type string
     * @memberof VCodeSystemCouponAPIApipage1
     */
    keyword?: string
}

export class ObjectVCodeSystemCouponAPIApi {
    private api: ObservableVCodeSystemCouponAPIApi

    public constructor(configuration: Configuration, requestFactory?: VCodeSystemCouponAPIApiRequestFactory, responseProcessor?: VCodeSystemCouponAPIApiResponseProcessor) {
        this.api = new ObservableVCodeSystemCouponAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Coupon Template
     * @param param the request object
     */
    public create1WithHttpInfo(param: VCodeSystemCouponAPIApiCreate1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVCodeCouponVo>> {
        return this.api.create1WithHttpInfo(param.vCodeCouponRo,  options).toPromise();
    }

    /**
     * Create Coupon Template
     * @param param the request object
     */
    public create1(param: VCodeSystemCouponAPIApiCreate1Request, options?: Configuration): Promise<ResponseDataVCodeCouponVo> {
        return this.api.create1(param.vCodeCouponRo,  options).toPromise();
    }

    /**
     * Delete Coupon Template
     * @param param the request object
     */
    public delete2WithHttpInfo(param: VCodeSystemCouponAPIApiDelete2Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete2WithHttpInfo(param.templateId,  options).toPromise();
    }

    /**
     * Delete Coupon Template
     * @param param the request object
     */
    public delete2(param: VCodeSystemCouponAPIApiDelete2Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete2(param.templateId,  options).toPromise();
    }

    /**
     * Delete Coupon Template
     * @param param the request object
     */
    public delete3WithHttpInfo(param: VCodeSystemCouponAPIApiDelete3Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete3WithHttpInfo(param.templateId,  options).toPromise();
    }

    /**
     * Delete Coupon Template
     * @param param the request object
     */
    public delete3(param: VCodeSystemCouponAPIApiDelete3Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete3(param.templateId,  options).toPromise();
    }

    /**
     * Edit Coupon Template
     * @param param the request object
     */
    public edit1WithHttpInfo(param: VCodeSystemCouponAPIApiEdit1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.edit1WithHttpInfo(param.vCodeCouponRo, param.templateId,  options).toPromise();
    }

    /**
     * Edit Coupon Template
     * @param param the request object
     */
    public edit1(param: VCodeSystemCouponAPIApiEdit1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.edit1(param.vCodeCouponRo, param.templateId,  options).toPromise();
    }

    /**
     * Query Coupon View List
     * @param param the request object
     */
    public listWithHttpInfo(param: VCodeSystemCouponAPIApiListRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListVCodeCouponVo>> {
        return this.api.listWithHttpInfo(param.keyword,  options).toPromise();
    }

    /**
     * Query Coupon View List
     * @param param the request object
     */
    public list(param: VCodeSystemCouponAPIApiListRequest = {}, options?: Configuration): Promise<ResponseDataListVCodeCouponVo> {
        return this.api.list(param.keyword,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Coupon Page
     * @param param the request object
     */
    public page1WithHttpInfo(param: VCodeSystemCouponAPIApiPage1Request, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoVCodeCouponPageVo>> {
        return this.api.page1WithHttpInfo(param.page, param.pageObjectParams, param.keyword,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Coupon Page
     * @param param the request object
     */
    public page1(param: VCodeSystemCouponAPIApiPage1Request, options?: Configuration): Promise<ResponseDataPageInfoVCodeCouponPageVo> {
        return this.api.page1(param.page, param.pageObjectParams, param.keyword,  options).toPromise();
    }

}

import { ObservableVCodeSystemVCodeAPIApi } from "./ObservableAPI";
import { VCodeSystemVCodeAPIApiRequestFactory, VCodeSystemVCodeAPIApiResponseProcessor} from "../apis/VCodeSystemVCodeAPIApi";

export interface VCodeSystemVCodeAPIApiDeleteRequest {
    /**
     * VCode
     * @type string
     * @memberof VCodeSystemVCodeAPIApi_delete
     */
    code: string
}

export interface VCodeSystemVCodeAPIApiCreateRequest {
    /**
     *
     * @type VCodeCreateRo
     * @memberof VCodeSystemVCodeAPIApicreate
     */
    vCodeCreateRo: VCodeCreateRo
}

export interface VCodeSystemVCodeAPIApiDelete1Request {
    /**
     * VCode
     * @type string
     * @memberof VCodeSystemVCodeAPIApidelete1
     */
    code: string
}

export interface VCodeSystemVCodeAPIApiEditRequest {
    /**
     *
     * @type VCodeUpdateRo
     * @memberof VCodeSystemVCodeAPIApiedit
     */
    vCodeUpdateRo: VCodeUpdateRo
    /**
     * VCode
     * @type string
     * @memberof VCodeSystemVCodeAPIApiedit
     */
    code: string
}

export interface VCodeSystemVCodeAPIApiExchangeRequest {
    /**
     * VCode
     * @type string
     * @memberof VCodeSystemVCodeAPIApiexchange
     */
    code: string
}

export interface VCodeSystemVCodeAPIApiPageRequest {
    /**
     *
     * @type Page
     * @memberof VCodeSystemVCodeAPIApipage
     */
    page: Page
    /**
     * Page Params
     * @type string
     * @memberof VCodeSystemVCodeAPIApipage
     */
    pageObjectParams: string
    /**
     * Type (0: official invitation code; 2: redemption code)
     * @type number
     * @memberof VCodeSystemVCodeAPIApipage
     */
    type?: number
    /**
     * Activity ID
     * @type string
     * @memberof VCodeSystemVCodeAPIApipage
     */
    activityId?: string
}

export class ObjectVCodeSystemVCodeAPIApi {
    private api: ObservableVCodeSystemVCodeAPIApi

    public constructor(configuration: Configuration, requestFactory?: VCodeSystemVCodeAPIApiRequestFactory, responseProcessor?: VCodeSystemVCodeAPIApiResponseProcessor) {
        this.api = new ObservableVCodeSystemVCodeAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete VCode
     * @param param the request object
     */
    public _deleteWithHttpInfo(param: VCodeSystemVCodeAPIApiDeleteRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api._deleteWithHttpInfo(param.code,  options).toPromise();
    }

    /**
     * Delete VCode
     * @param param the request object
     */
    public _delete(param: VCodeSystemVCodeAPIApiDeleteRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api._delete(param.code,  options).toPromise();
    }

    /**
     * Create VCode
     * @param param the request object
     */
    public createWithHttpInfo(param: VCodeSystemVCodeAPIApiCreateRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListString>> {
        return this.api.createWithHttpInfo(param.vCodeCreateRo,  options).toPromise();
    }

    /**
     * Create VCode
     * @param param the request object
     */
    public create(param: VCodeSystemVCodeAPIApiCreateRequest, options?: Configuration): Promise<ResponseDataListString> {
        return this.api.create(param.vCodeCreateRo,  options).toPromise();
    }

    /**
     * Delete VCode
     * @param param the request object
     */
    public delete1WithHttpInfo(param: VCodeSystemVCodeAPIApiDelete1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete1WithHttpInfo(param.code,  options).toPromise();
    }

    /**
     * Delete VCode
     * @param param the request object
     */
    public delete1(param: VCodeSystemVCodeAPIApiDelete1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete1(param.code,  options).toPromise();
    }

    /**
     * Edit VCode Setting
     * @param param the request object
     */
    public editWithHttpInfo(param: VCodeSystemVCodeAPIApiEditRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.editWithHttpInfo(param.vCodeUpdateRo, param.code,  options).toPromise();
    }

    /**
     * Edit VCode Setting
     * @param param the request object
     */
    public edit(param: VCodeSystemVCodeAPIApiEditRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.edit(param.vCodeUpdateRo, param.code,  options).toPromise();
    }

    /**
     * Exchange VCode
     * @param param the request object
     */
    public exchangeWithHttpInfo(param: VCodeSystemVCodeAPIApiExchangeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataInteger>> {
        return this.api.exchangeWithHttpInfo(param.code,  options).toPromise();
    }

    /**
     * Exchange VCode
     * @param param the request object
     */
    public exchange(param: VCodeSystemVCodeAPIApiExchangeRequest, options?: Configuration): Promise<ResponseDataInteger> {
        return this.api.exchange(param.code,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query VCode Page
     * @param param the request object
     */
    public pageWithHttpInfo(param: VCodeSystemVCodeAPIApiPageRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoVCodePageVo>> {
        return this.api.pageWithHttpInfo(param.page, param.pageObjectParams, param.type, param.activityId,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query VCode Page
     * @param param the request object
     */
    public page(param: VCodeSystemVCodeAPIApiPageRequest, options?: Configuration): Promise<ResponseDataPageInfoVCodePageVo> {
        return this.api.page(param.page, param.pageObjectParams, param.type, param.activityId,  options).toPromise();
    }

}

import { ObservableWeChatMiniAppAPIApi } from "./ObservableAPI";
import { WeChatMiniAppAPIApiRequestFactory, WeChatMiniAppAPIApiResponseProcessor} from "../apis/WeChatMiniAppAPIApi";

export interface WeChatMiniAppAPIApiAuthorizeRequest {
    /**
     * Wechat login credentials obtained by wx.login
     * @type string
     * @memberof WeChatMiniAppAPIApiauthorize
     */
    code: string
}

export interface WeChatMiniAppAPIApiGetInfoRequest {
}

export interface WeChatMiniAppAPIApiInfoRequest {
    /**
     * signature
     * @type string
     * @memberof WeChatMiniAppAPIApiinfo
     */
    signature: string
    /**
     * data
     * @type string
     * @memberof WeChatMiniAppAPIApiinfo
     */
    rawData: string
    /**
     * encrypted data
     * @type string
     * @memberof WeChatMiniAppAPIApiinfo
     */
    encryptedData: string
    /**
     * initial vector for encryption algorithm
     * @type string
     * @memberof WeChatMiniAppAPIApiinfo
     */
    iv: string
}

export interface WeChatMiniAppAPIApiOperateRequest {
    /**
     * type (0: Enter verification validity; 1: Confirm the login (the WeChat account of the Weige account is bound); 2: Cancel the login/bind the account; 3: Confirm the binding account)
     * @type number
     * @memberof WeChatMiniAppAPIApioperate
     */
    type: number
    /**
     * mini program code unique identifier
     * @type string
     * @memberof WeChatMiniAppAPIApioperate
     */
    mark: string
}

export interface WeChatMiniAppAPIApiPhoneRequest {
    /**
     * encrypted data
     * @type string
     * @memberof WeChatMiniAppAPIApiphone
     */
    encryptedData: string
    /**
     * initial vector for encryption algorithm
     * @type string
     * @memberof WeChatMiniAppAPIApiphone
     */
    iv: string
    /**
     * mini program code unique identifier
     * @type string
     * @memberof WeChatMiniAppAPIApiphone
     */
    mark?: string
}

export class ObjectWeChatMiniAppAPIApi {
    private api: ObservableWeChatMiniAppAPIApi

    public constructor(configuration: Configuration, requestFactory?: WeChatMiniAppAPIApiRequestFactory, responseProcessor?: WeChatMiniAppAPIApiResponseProcessor) {
        this.api = new ObservableWeChatMiniAppAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Mini Program Authorized Login (Silent Authorization)
     * Authorized Login(wx.login user)
     * @param param the request object
     */
    public authorizeWithHttpInfo(param: WeChatMiniAppAPIApiAuthorizeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataLoginResultVo>> {
        return this.api.authorizeWithHttpInfo(param.code,  options).toPromise();
    }

    /**
     * Mini Program Authorized Login (Silent Authorization)
     * Authorized Login(wx.login user)
     * @param param the request object
     */
    public authorize(param: WeChatMiniAppAPIApiAuthorizeRequest, options?: Configuration): Promise<ResponseDataLoginResultVo> {
        return this.api.authorize(param.code,  options).toPromise();
    }

    /**
     * Get User Information
     * @param param the request object
     */
    public getInfoWithHttpInfo(param: WeChatMiniAppAPIApiGetInfoRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataWechatInfoVo>> {
        return this.api.getInfoWithHttpInfo( options).toPromise();
    }

    /**
     * Get User Information
     * @param param the request object
     */
    public getInfo(param: WeChatMiniAppAPIApiGetInfoRequest = {}, options?: Configuration): Promise<ResponseDataWechatInfoVo> {
        return this.api.getInfo( options).toPromise();
    }

    /**
     * Synchronize WeChat User Information
     * @param param the request object
     */
    public infoWithHttpInfo(param: WeChatMiniAppAPIApiInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.infoWithHttpInfo(param.signature, param.rawData, param.encryptedData, param.iv,  options).toPromise();
    }

    /**
     * Synchronize WeChat User Information
     * @param param the request object
     */
    public info(param: WeChatMiniAppAPIApiInfoRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.info(param.signature, param.rawData, param.encryptedData, param.iv,  options).toPromise();
    }

    /**
     * The Operation of The Applet Code
     * @param param the request object
     */
    public operateWithHttpInfo(param: WeChatMiniAppAPIApiOperateRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.operateWithHttpInfo(param.type, param.mark,  options).toPromise();
    }

    /**
     * The Operation of The Applet Code
     * @param param the request object
     */
    public operate(param: WeChatMiniAppAPIApiOperateRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.operate(param.type, param.mark,  options).toPromise();
    }

    /**
     * User authorized to use WeChat mobile number
     * @param param the request object
     */
    public phoneWithHttpInfo(param: WeChatMiniAppAPIApiPhoneRequest, options?: Configuration): Promise<HttpInfo<ResponseDataLoginResultVo>> {
        return this.api.phoneWithHttpInfo(param.encryptedData, param.iv, param.mark,  options).toPromise();
    }

    /**
     * User authorized to use WeChat mobile number
     * @param param the request object
     */
    public phone(param: WeChatMiniAppAPIApiPhoneRequest, options?: Configuration): Promise<ResponseDataLoginResultVo> {
        return this.api.phone(param.encryptedData, param.iv, param.mark,  options).toPromise();
    }

}

import { ObservableWeChatMpAPIApi } from "./ObservableAPI";
import { WeChatMpAPIApiRequestFactory, WeChatMpAPIApiResponseProcessor} from "../apis/WeChatMpAPIApi";

export interface WeChatMpAPIApiCallback1Request {
    /**
     * coding. JS gets the loginTmpCode, redirects and returns after jumping to the specified connection
     * @type string
     * @memberof WeChatMpAPIApicallback1
     */
    code: string
    /**
     * declare value. Used to prevent replay attacks
     * @type string
     * @memberof WeChatMpAPIApicallback1
     */
    state: string
}

export interface WeChatMpAPIApiPollRequest {
    /**
     * type (0: scan code to log in; 1: account binding)
     * @type number
     * @memberof WeChatMpAPIApipoll
     */
    type: number
    /**
     * the unique identifier of the qrcode
     * @type string
     * @memberof WeChatMpAPIApipoll
     */
    mark: string
}

export interface WeChatMpAPIApiQrcodeRequest {
}

export interface WeChatMpAPIApiSignatureRequest {
    /**
     *
     * @type MpSignatureRo
     * @memberof WeChatMpAPIApisignature
     */
    mpSignatureRo: MpSignatureRo
}

export class ObjectWeChatMpAPIApi {
    private api: ObservableWeChatMpAPIApi

    public constructor(configuration: Configuration, requestFactory?: WeChatMpAPIApiRequestFactory, responseProcessor?: WeChatMpAPIApiResponseProcessor) {
        this.api = new ObservableWeChatMpAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Web Page Authorization Callback
     * @param param the request object
     */
    public callback1WithHttpInfo(param: WeChatMpAPIApiCallback1Request, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.callback1WithHttpInfo(param.code, param.state,  options).toPromise();
    }

    /**
     * Web Page Authorization Callback
     * @param param the request object
     */
    public callback1(param: WeChatMpAPIApiCallback1Request, options?: Configuration): Promise<ResponseDataString> {
        return this.api.callback1(param.code, param.state,  options).toPromise();
    }

    /**
     * Scene: Scan code login, account binding polling results
     * Scan poll
     * @param param the request object
     */
    public pollWithHttpInfo(param: WeChatMpAPIApiPollRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.pollWithHttpInfo(param.type, param.mark,  options).toPromise();
    }

    /**
     * Scene: Scan code login, account binding polling results
     * Scan poll
     * @param param the request object
     */
    public poll(param: WeChatMpAPIApiPollRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.poll(param.type, param.mark,  options).toPromise();
    }

    /**
     * Get qrcode
     * @param param the request object
     */
    public qrcodeWithHttpInfo(param: WeChatMpAPIApiQrcodeRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataQrCodeVo>> {
        return this.api.qrcodeWithHttpInfo( options).toPromise();
    }

    /**
     * Get qrcode
     * @param param the request object
     */
    public qrcode(param: WeChatMpAPIApiQrcodeRequest = {}, options?: Configuration): Promise<ResponseDataQrCodeVo> {
        return this.api.qrcode( options).toPromise();
    }

    /**
     * Get wechat signature
     * @param param the request object
     */
    public signatureWithHttpInfo(param: WeChatMpAPIApiSignatureRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWxJsapiSignature>> {
        return this.api.signatureWithHttpInfo(param.mpSignatureRo,  options).toPromise();
    }

    /**
     * Get wechat signature
     * @param param the request object
     */
    public signature(param: WeChatMpAPIApiSignatureRequest, options?: Configuration): Promise<ResponseDataWxJsapiSignature> {
        return this.api.signature(param.mpSignatureRo,  options).toPromise();
    }

}

import { ObservableWeChatOpenPlatformAPIApi } from "./ObservableAPI";
import { WeChatOpenPlatformAPIApiRequestFactory, WeChatOpenPlatformAPIApiResponseProcessor} from "../apis/WeChatOpenPlatformAPIApi";

export interface WeChatOpenPlatformAPIApiCallbackRequest {
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApicallback
     */
    appId: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApicallback
     */
    signature: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApicallback
     */
    timestamp: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApicallback
     */
    nonce: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApicallback
     */
    openid: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApicallback
     */
    encryptType: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApicallback
     */
    msgSignature: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApicallback
     */
    body?: string
}

export interface WeChatOpenPlatformAPIApiCreatePreAuthUrlRequest {
    /**
     * Authorized account type, 1. Only the official account authorization list is displayed, 2. Only the applet authorization list is displayed, 3. Both are displayed
     * @type string
     * @memberof WeChatOpenPlatformAPIApicreatePreAuthUrl
     */
    authType: string
    /**
     * Authorized Official Account or Mini Program AppId
     * @type string
     * @memberof WeChatOpenPlatformAPIApicreatePreAuthUrl
     */
    componentAppid: string
}

export interface WeChatOpenPlatformAPIApiCreateWxQrCodeRequest {
    /**
     * qrcode type, type value (temporary integer value: QR_SCENE, temporary string value: QR_STR_SCENE; permanent integer value: QR_LIMIT_SCENE, permanent string value: QR_LIMIT_STR_SCENE)
     * @type string
     * @memberof WeChatOpenPlatformAPIApicreateWxQrCode
     */
    type?: string
    /**
     * the valid time of the QR code, in seconds. The maximum is not more than 2592000 (that is, 30 days), and the default is 30 seconds.
     * @type number
     * @memberof WeChatOpenPlatformAPIApicreateWxQrCode
     */
    expireSeconds?: number
    /**
     * scene value ID, a 32-bit non-zero integer for a temporary QR code, and a maximum value of 100000 for a permanent QR code (current parameters only support 1--100000)
     * @type number
     * @memberof WeChatOpenPlatformAPIApicreateWxQrCode
     */
    sceneId?: number
    /**
     * Scene value ID (ID in string form), string type, length limited from 1 to 64.
     * @type string
     * @memberof WeChatOpenPlatformAPIApicreateWxQrCode
     */
    sceneStr?: string
    /**
     * wechat public account appId
     * @type string
     * @memberof WeChatOpenPlatformAPIApicreateWxQrCode
     */
    appId?: string
}

export interface WeChatOpenPlatformAPIApiDelQrCodeRequest {
    /**
     * qrcode ID
     * @type string
     * @memberof WeChatOpenPlatformAPIApidelQrCode
     */
    qrCodeId: string
    /**
     * wechat public account appId
     * @type string
     * @memberof WeChatOpenPlatformAPIApidelQrCode
     */
    appId?: string
}

export interface WeChatOpenPlatformAPIApiDelQrCode1Request {
    /**
     * qrcode ID
     * @type string
     * @memberof WeChatOpenPlatformAPIApidelQrCode1
     */
    qrCodeId: string
    /**
     * wechat public account appId
     * @type string
     * @memberof WeChatOpenPlatformAPIApidelQrCode1
     */
    appId?: string
}

export interface WeChatOpenPlatformAPIApiGetAuthorizerInfoRequest {
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApigetAuthorizerInfo
     */
    authorizerAppid?: string
}

export interface WeChatOpenPlatformAPIApiGetAuthorizerListRequest {
}

export interface WeChatOpenPlatformAPIApiGetComponentVerifyTicketRequest {
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApigetComponentVerifyTicket
     */
    timestamp: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApigetComponentVerifyTicket
     */
    nonce: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApigetComponentVerifyTicket
     */
    signature: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApigetComponentVerifyTicket
     */
    body?: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApigetComponentVerifyTicket
     */
    encryptType?: string
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApigetComponentVerifyTicket
     */
    msgSignature?: string
}

export interface WeChatOpenPlatformAPIApiGetQrCodePageRequest {
    /**
     *
     * @type Page
     * @memberof WeChatOpenPlatformAPIApigetQrCodePage
     */
    page: Page
    /**
     * page params
     * @type string
     * @memberof WeChatOpenPlatformAPIApigetQrCodePage
     */
    pageObjectParams: string
    /**
     * wechat public account appId
     * @type string
     * @memberof WeChatOpenPlatformAPIApigetQrCodePage
     */
    appId?: string
}

export interface WeChatOpenPlatformAPIApiGetQueryAuthRequest {
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApigetQueryAuth
     */
    authCode?: string
}

export interface WeChatOpenPlatformAPIApiGetWechatIpListRequest {
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApigetWechatIpList
     */
    appId?: string
}

export interface WeChatOpenPlatformAPIApiUpdateWxReplyRequest {
    /**
     *
     * @type string
     * @memberof WeChatOpenPlatformAPIApiupdateWxReply
     */
    appId?: string
}

export class ObjectWeChatOpenPlatformAPIApi {
    private api: ObservableWeChatOpenPlatformAPIApi

    public constructor(configuration: Configuration, requestFactory?: WeChatOpenPlatformAPIApiRequestFactory, responseProcessor?: WeChatOpenPlatformAPIApiResponseProcessor) {
        this.api = new ObservableWeChatOpenPlatformAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * WeChat Message Push Callback
     * @param param the request object
     */
    public callbackWithHttpInfo(param: WeChatOpenPlatformAPIApiCallbackRequest, options?: Configuration): Promise<HttpInfo<any>> {
        return this.api.callbackWithHttpInfo(param.appId, param.signature, param.timestamp, param.nonce, param.openid, param.encryptType, param.msgSignature, param.body,  options).toPromise();
    }

    /**
     * WeChat Message Push Callback
     * @param param the request object
     */
    public callback(param: WeChatOpenPlatformAPIApiCallbackRequest, options?: Configuration): Promise<any> {
        return this.api.callback(param.appId, param.signature, param.timestamp, param.nonce, param.openid, param.encryptType, param.msgSignature, param.body,  options).toPromise();
    }

    /**
     * Create Pre-authorization URL
     * @param param the request object
     */
    public createPreAuthUrlWithHttpInfo(param: WeChatOpenPlatformAPIApiCreatePreAuthUrlRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.createPreAuthUrlWithHttpInfo(param.authType, param.componentAppid,  options).toPromise();
    }

    /**
     * Create Pre-authorization URL
     * @param param the request object
     */
    public createPreAuthUrl(param: WeChatOpenPlatformAPIApiCreatePreAuthUrlRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.createPreAuthUrl(param.authType, param.componentAppid,  options).toPromise();
    }

    /**
     * The scene value cannot be passed at all, and the string type is preferred.
     * Generates Qrcode
     * @param param the request object
     */
    public createWxQrCodeWithHttpInfo(param: WeChatOpenPlatformAPIApiCreateWxQrCodeRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataQrCodeVo>> {
        return this.api.createWxQrCodeWithHttpInfo(param.type, param.expireSeconds, param.sceneId, param.sceneStr, param.appId,  options).toPromise();
    }

    /**
     * The scene value cannot be passed at all, and the string type is preferred.
     * Generates Qrcode
     * @param param the request object
     */
    public createWxQrCode(param: WeChatOpenPlatformAPIApiCreateWxQrCodeRequest = {}, options?: Configuration): Promise<ResponseDataQrCodeVo> {
        return this.api.createWxQrCode(param.type, param.expireSeconds, param.sceneId, param.sceneStr, param.appId,  options).toPromise();
    }

    /**
     * Delete Qrcode
     * @param param the request object
     */
    public delQrCodeWithHttpInfo(param: WeChatOpenPlatformAPIApiDelQrCodeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delQrCodeWithHttpInfo(param.qrCodeId, param.appId,  options).toPromise();
    }

    /**
     * Delete Qrcode
     * @param param the request object
     */
    public delQrCode(param: WeChatOpenPlatformAPIApiDelQrCodeRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delQrCode(param.qrCodeId, param.appId,  options).toPromise();
    }

    /**
     * Delete Qrcode
     * @param param the request object
     */
    public delQrCode1WithHttpInfo(param: WeChatOpenPlatformAPIApiDelQrCode1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delQrCode1WithHttpInfo(param.qrCodeId, param.appId,  options).toPromise();
    }

    /**
     * Delete Qrcode
     * @param param the request object
     */
    public delQrCode1(param: WeChatOpenPlatformAPIApiDelQrCode1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delQrCode1(param.qrCodeId, param.appId,  options).toPromise();
    }

    /**
     * Obtain the basic information of the authorized account
     * @param param the request object
     */
    public getAuthorizerInfoWithHttpInfo(param: WeChatOpenPlatformAPIApiGetAuthorizerInfoRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataWechatAuthorizationEntity>> {
        return this.api.getAuthorizerInfoWithHttpInfo(param.authorizerAppid,  options).toPromise();
    }

    /**
     * Obtain the basic information of the authorized account
     * @param param the request object
     */
    public getAuthorizerInfo(param: WeChatOpenPlatformAPIApiGetAuthorizerInfoRequest = {}, options?: Configuration): Promise<ResponseDataWechatAuthorizationEntity> {
        return this.api.getAuthorizerInfo(param.authorizerAppid,  options).toPromise();
    }

    /**
     * Get All Authorized Account Information
     * @param param the request object
     */
    public getAuthorizerListWithHttpInfo(param: WeChatOpenPlatformAPIApiGetAuthorizerListRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataWxOpenAuthorizerListResult>> {
        return this.api.getAuthorizerListWithHttpInfo( options).toPromise();
    }

    /**
     * Get All Authorized Account Information
     * @param param the request object
     */
    public getAuthorizerList(param: WeChatOpenPlatformAPIApiGetAuthorizerListRequest = {}, options?: Configuration): Promise<ResponseDataWxOpenAuthorizerListResult> {
        return this.api.getAuthorizerList( options).toPromise();
    }

    /**
     * Receive Verification Ticket
     * @param param the request object
     */
    public getComponentVerifyTicketWithHttpInfo(param: WeChatOpenPlatformAPIApiGetComponentVerifyTicketRequest, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.getComponentVerifyTicketWithHttpInfo(param.timestamp, param.nonce, param.signature, param.body, param.encryptType, param.msgSignature,  options).toPromise();
    }

    /**
     * Receive Verification Ticket
     * @param param the request object
     */
    public getComponentVerifyTicket(param: WeChatOpenPlatformAPIApiGetComponentVerifyTicketRequest, options?: Configuration): Promise<string> {
        return this.api.getComponentVerifyTicket(param.timestamp, param.nonce, param.signature, param.body, param.encryptType, param.msgSignature,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Qrcode pagination list
     * @param param the request object
     */
    public getQrCodePageWithHttpInfo(param: WeChatOpenPlatformAPIApiGetQrCodePageRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoQrCodePageVo>> {
        return this.api.getQrCodePageWithHttpInfo(param.page, param.pageObjectParams, param.appId,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Qrcode pagination list
     * @param param the request object
     */
    public getQrCodePage(param: WeChatOpenPlatformAPIApiGetQrCodePageRequest, options?: Configuration): Promise<ResponseDataPageInfoQrCodePageVo> {
        return this.api.getQrCodePage(param.page, param.pageObjectParams, param.appId,  options).toPromise();
    }

    /**
     * Get Authorization Code Get Authorization Information
     * @param param the request object
     */
    public getQueryAuthWithHttpInfo(param: WeChatOpenPlatformAPIApiGetQueryAuthRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataWechatAuthorizationEntity>> {
        return this.api.getQueryAuthWithHttpInfo(param.authCode,  options).toPromise();
    }

    /**
     * Get Authorization Code Get Authorization Information
     * @param param the request object
     */
    public getQueryAuth(param: WeChatOpenPlatformAPIApiGetQueryAuthRequest = {}, options?: Configuration): Promise<ResponseDataWechatAuthorizationEntity> {
        return this.api.getQueryAuth(param.authCode,  options).toPromise();
    }

    /**
     * Get WeChat server IP list
     * @param param the request object
     */
    public getWechatIpListWithHttpInfo(param: WeChatOpenPlatformAPIApiGetWechatIpListRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListString>> {
        return this.api.getWechatIpListWithHttpInfo(param.appId,  options).toPromise();
    }

    /**
     * Get WeChat server IP list
     * @param param the request object
     */
    public getWechatIpList(param: WeChatOpenPlatformAPIApiGetWechatIpListRequest = {}, options?: Configuration): Promise<ResponseDataListString> {
        return this.api.getWechatIpList(param.appId,  options).toPromise();
    }

    /**
     * Be sure to add keyword replies first in the background of the official account
     * Synchronously update WeChat keyword automatic reply rules
     * @param param the request object
     */
    public updateWxReplyWithHttpInfo(param: WeChatOpenPlatformAPIApiUpdateWxReplyRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateWxReplyWithHttpInfo(param.appId,  options).toPromise();
    }

    /**
     * Be sure to add keyword replies first in the background of the official account
     * Synchronously update WeChat keyword automatic reply rules
     * @param param the request object
     */
    public updateWxReply(param: WeChatOpenPlatformAPIApiUpdateWxReplyRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateWxReply(param.appId,  options).toPromise();
    }

}

import { ObservableWidgetSDKPackageApiApi } from "./ObservableAPI";
import { WidgetSDKPackageApiApiRequestFactory, WidgetSDKPackageApiApiResponseProcessor} from "../apis/WidgetSDKPackageApiApi";

export interface WidgetSDKPackageApiApiCreateWidgetRequest {
    /**
     *
     * @type WidgetPackageCreateRo
     * @memberof WidgetSDKPackageApiApicreateWidget
     */
    widgetPackageCreateRo: WidgetPackageCreateRo
    /**
     * developer token
     * @type string
     * @memberof WidgetSDKPackageApiApicreateWidget
     */
    authorization: string
}

export interface WidgetSDKPackageApiApiGetWidgetPackageInfoRequest {
    /**
     *
     * @type string
     * @memberof WidgetSDKPackageApiApigetWidgetPackageInfo
     */
    packageId: string
    /**
     * developer token
     * @type string
     * @memberof WidgetSDKPackageApiApigetWidgetPackageInfo
     */
    authorization: string
    /**
     * developer\&#39;s language
     * @type string
     * @memberof WidgetSDKPackageApiApigetWidgetPackageInfo
     */
    acceptLanguage?: string
}

export interface WidgetSDKPackageApiApiGetWidgetPackageListInfoRequest {
    /**
     *
     * @type string
     * @memberof WidgetSDKPackageApiApigetWidgetPackageListInfo
     */
    spaceId: string
    /**
     * developer token
     * @type string
     * @memberof WidgetSDKPackageApiApigetWidgetPackageListInfo
     */
    authorization: string
    /**
     * developer\&#39;s language
     * @type string
     * @memberof WidgetSDKPackageApiApigetWidgetPackageListInfo
     */
    acceptLanguage?: string
}

export interface WidgetSDKPackageApiApiReleaseListWidgetRequest {
    /**
     * widget package id
     * @type number
     * @memberof WidgetSDKPackageApiApireleaseListWidget
     */
    packageId: number
    /**
     *
     * @type Page
     * @memberof WidgetSDKPackageApiApireleaseListWidget
     */
    page: Page
    /**
     * developer token
     * @type string
     * @memberof WidgetSDKPackageApiApireleaseListWidget
     */
    authorization: string
    /**
     * page
     * @type string
     * @memberof WidgetSDKPackageApiApireleaseListWidget
     */
    pageObjectParams?: string
}

export interface WidgetSDKPackageApiApiReleaseWidgetV2Request {
    /**
     *
     * @type WidgetPackageReleaseV2Ro
     * @memberof WidgetSDKPackageApiApireleaseWidgetV2
     */
    widgetPackageReleaseV2Ro: WidgetPackageReleaseV2Ro
    /**
     * developer token
     * @type string
     * @memberof WidgetSDKPackageApiApireleaseWidgetV2
     */
    authorization: string
}

export interface WidgetSDKPackageApiApiRollbackWidgetRequest {
    /**
     *
     * @type WidgetPackageRollbackRo
     * @memberof WidgetSDKPackageApiApirollbackWidget
     */
    widgetPackageRollbackRo: WidgetPackageRollbackRo
    /**
     * developer token
     * @type string
     * @memberof WidgetSDKPackageApiApirollbackWidget
     */
    authorization: string
}

export interface WidgetSDKPackageApiApiSubmitWidgetV2Request {
    /**
     *
     * @type WidgetPackageSubmitV2Ro
     * @memberof WidgetSDKPackageApiApisubmitWidgetV2
     */
    widgetPackageSubmitV2Ro: WidgetPackageSubmitV2Ro
    /**
     * developer token
     * @type string
     * @memberof WidgetSDKPackageApiApisubmitWidgetV2
     */
    authorization: string
    /**
     * developer\&#39;s language
     * @type string
     * @memberof WidgetSDKPackageApiApisubmitWidgetV2
     */
    acceptLanguage?: string
}

export interface WidgetSDKPackageApiApiTransferWidgetOwnerRequest {
    /**
     *
     * @type WidgetTransferOwnerRo
     * @memberof WidgetSDKPackageApiApitransferWidgetOwner
     */
    widgetTransferOwnerRo: WidgetTransferOwnerRo
    /**
     * developer token
     * @type string
     * @memberof WidgetSDKPackageApiApitransferWidgetOwner
     */
    authorization: string
    /**
     * developer\&#39;s language
     * @type string
     * @memberof WidgetSDKPackageApiApitransferWidgetOwner
     */
    acceptLanguage?: string
}

export interface WidgetSDKPackageApiApiUnpublishWidgetRequest {
    /**
     *
     * @type WidgetPackageUnpublishRo
     * @memberof WidgetSDKPackageApiApiunpublishWidget
     */
    widgetPackageUnpublishRo: WidgetPackageUnpublishRo
    /**
     * developer token
     * @type string
     * @memberof WidgetSDKPackageApiApiunpublishWidget
     */
    authorization: string
}

export interface WidgetSDKPackageApiApiWidgetAuthRequest {
    /**
     *
     * @type WidgetPackageAuthRo
     * @memberof WidgetSDKPackageApiApiwidgetAuth
     */
    widgetPackageAuthRo: WidgetPackageAuthRo
    /**
     * developer token
     * @type string
     * @memberof WidgetSDKPackageApiApiwidgetAuth
     */
    authorization: string
}

export class ObjectWidgetSDKPackageApiApi {
    private api: ObservableWidgetSDKPackageApiApi

    public constructor(configuration: Configuration, requestFactory?: WidgetSDKPackageApiApiRequestFactory, responseProcessor?: WidgetSDKPackageApiApiResponseProcessor) {
        this.api = new ObservableWidgetSDKPackageApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * widget-cli initialization create widget
     * Create widget
     * @param param the request object
     */
    public createWidgetWithHttpInfo(param: WidgetSDKPackageApiApiCreateWidgetRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWidgetReleaseCreateVo>> {
        return this.api.createWidgetWithHttpInfo(param.widgetPackageCreateRo, param.authorization,  options).toPromise();
    }

    /**
     * widget-cli initialization create widget
     * Create widget
     * @param param the request object
     */
    public createWidget(param: WidgetSDKPackageApiApiCreateWidgetRequest, options?: Configuration): Promise<ResponseDataWidgetReleaseCreateVo> {
        return this.api.createWidget(param.widgetPackageCreateRo, param.authorization,  options).toPromise();
    }

    /**
     * widget-cli get widget package info
     * Get widget package info
     * @param param the request object
     */
    public getWidgetPackageInfoWithHttpInfo(param: WidgetSDKPackageApiApiGetWidgetPackageInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWidgetPackageInfoVo>> {
        return this.api.getWidgetPackageInfoWithHttpInfo(param.packageId, param.authorization, param.acceptLanguage,  options).toPromise();
    }

    /**
     * widget-cli get widget package info
     * Get widget package info
     * @param param the request object
     */
    public getWidgetPackageInfo(param: WidgetSDKPackageApiApiGetWidgetPackageInfoRequest, options?: Configuration): Promise<ResponseDataWidgetPackageInfoVo> {
        return this.api.getWidgetPackageInfo(param.packageId, param.authorization, param.acceptLanguage,  options).toPromise();
    }

    /**
     * widget-cli get widget store information
     * Get widget store information
     * @param param the request object
     */
    public getWidgetPackageListInfoWithHttpInfo(param: WidgetSDKPackageApiApiGetWidgetPackageListInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetPackageInfoVo>> {
        return this.api.getWidgetPackageListInfoWithHttpInfo(param.spaceId, param.authorization, param.acceptLanguage,  options).toPromise();
    }

    /**
     * widget-cli get widget store information
     * Get widget store information
     * @param param the request object
     */
    public getWidgetPackageListInfo(param: WidgetSDKPackageApiApiGetWidgetPackageListInfoRequest, options?: Configuration): Promise<ResponseDataListWidgetPackageInfoVo> {
        return this.api.getWidgetPackageListInfo(param.spaceId, param.authorization, param.acceptLanguage,  options).toPromise();
    }

    /**
     * Get widget release history
     * @param param the request object
     */
    public releaseListWidgetWithHttpInfo(param: WidgetSDKPackageApiApiReleaseListWidgetRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetReleaseListVo>> {
        return this.api.releaseListWidgetWithHttpInfo(param.packageId, param.page, param.authorization, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Get widget release history
     * @param param the request object
     */
    public releaseListWidget(param: WidgetSDKPackageApiApiReleaseListWidgetRequest, options?: Configuration): Promise<ResponseDataListWidgetReleaseListVo> {
        return this.api.releaseListWidget(param.packageId, param.page, param.authorization, param.pageObjectParams,  options).toPromise();
    }

    /**
     * widget-cli release widget
     * release widget v2
     * @param param the request object
     */
    public releaseWidgetV2WithHttpInfo(param: WidgetSDKPackageApiApiReleaseWidgetV2Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.releaseWidgetV2WithHttpInfo(param.widgetPackageReleaseV2Ro, param.authorization,  options).toPromise();
    }

    /**
     * widget-cli release widget
     * release widget v2
     * @param param the request object
     */
    public releaseWidgetV2(param: WidgetSDKPackageApiApiReleaseWidgetV2Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.releaseWidgetV2(param.widgetPackageReleaseV2Ro, param.authorization,  options).toPromise();
    }

    /**
     * Rollback widget
     * @param param the request object
     */
    public rollbackWidgetWithHttpInfo(param: WidgetSDKPackageApiApiRollbackWidgetRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.rollbackWidgetWithHttpInfo(param.widgetPackageRollbackRo, param.authorization,  options).toPromise();
    }

    /**
     * Rollback widget
     * @param param the request object
     */
    public rollbackWidget(param: WidgetSDKPackageApiApiRollbackWidgetRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.rollbackWidget(param.widgetPackageRollbackRo, param.authorization,  options).toPromise();
    }

    /**
     * widget-cli submit widget
     * submit widget v2
     * @param param the request object
     */
    public submitWidgetV2WithHttpInfo(param: WidgetSDKPackageApiApiSubmitWidgetV2Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.submitWidgetV2WithHttpInfo(param.widgetPackageSubmitV2Ro, param.authorization, param.acceptLanguage,  options).toPromise();
    }

    /**
     * widget-cli submit widget
     * submit widget v2
     * @param param the request object
     */
    public submitWidgetV2(param: WidgetSDKPackageApiApiSubmitWidgetV2Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.submitWidgetV2(param.widgetPackageSubmitV2Ro, param.authorization, param.acceptLanguage,  options).toPromise();
    }

    /**
     * widget-cli transfer widget owner
     * Transfer widget owner
     * @param param the request object
     */
    public transferWidgetOwnerWithHttpInfo(param: WidgetSDKPackageApiApiTransferWidgetOwnerRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.transferWidgetOwnerWithHttpInfo(param.widgetTransferOwnerRo, param.authorization, param.acceptLanguage,  options).toPromise();
    }

    /**
     * widget-cli transfer widget owner
     * Transfer widget owner
     * @param param the request object
     */
    public transferWidgetOwner(param: WidgetSDKPackageApiApiTransferWidgetOwnerRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.transferWidgetOwner(param.widgetTransferOwnerRo, param.authorization, param.acceptLanguage,  options).toPromise();
    }

    /**
     * Unpublish widget
     * @param param the request object
     */
    public unpublishWidgetWithHttpInfo(param: WidgetSDKPackageApiApiUnpublishWidgetRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.unpublishWidgetWithHttpInfo(param.widgetPackageUnpublishRo, param.authorization,  options).toPromise();
    }

    /**
     * Unpublish widget
     * @param param the request object
     */
    public unpublishWidget(param: WidgetSDKPackageApiApiUnpublishWidgetRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.unpublishWidget(param.widgetPackageUnpublishRo, param.authorization,  options).toPromise();
    }

    /**
     * widget-cli widget development authentication verification
     * Auth widget
     * @param param the request object
     */
    public widgetAuthWithHttpInfo(param: WidgetSDKPackageApiApiWidgetAuthRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.widgetAuthWithHttpInfo(param.widgetPackageAuthRo, param.authorization,  options).toPromise();
    }

    /**
     * widget-cli widget development authentication verification
     * Auth widget
     * @param param the request object
     */
    public widgetAuth(param: WidgetSDKPackageApiApiWidgetAuthRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.widgetAuth(param.widgetPackageAuthRo, param.authorization,  options).toPromise();
    }

}

import { ObservableWidgetSDKWidgetApiApi } from "./ObservableAPI";
import { WidgetSDKWidgetApiApiRequestFactory, WidgetSDKWidgetApiApiResponseProcessor} from "../apis/WidgetSDKWidgetApiApi";

export interface WidgetSDKWidgetApiApiCopyWidgetRequest {
    /**
     *
     * @type WidgetCopyRo
     * @memberof WidgetSDKWidgetApiApicopyWidget
     */
    widgetCopyRo: WidgetCopyRo
}

export interface WidgetSDKWidgetApiApiCreateWidget1Request {
    /**
     *
     * @type WidgetCreateRo
     * @memberof WidgetSDKWidgetApiApicreateWidget1
     */
    widgetCreateRo: WidgetCreateRo
}

export interface WidgetSDKWidgetApiApiFindTemplatePackageListRequest {
}

export interface WidgetSDKWidgetApiApiFindWidgetInfoByNodeIdRequest {
    /**
     * node id
     * @type string
     * @memberof WidgetSDKWidgetApiApifindWidgetInfoByNodeId
     */
    nodeId: string
}

export interface WidgetSDKWidgetApiApiFindWidgetInfoBySpaceIdRequest {
    /**
     * space id
     * @type string
     * @memberof WidgetSDKWidgetApiApifindWidgetInfoBySpaceId
     */
    spaceId: string
    /**
     * load quantity
     * @type number
     * @memberof WidgetSDKWidgetApiApifindWidgetInfoBySpaceId
     */
    count?: number
}

export interface WidgetSDKWidgetApiApiFindWidgetPackByNodeIdRequest {
    /**
     * node id
     * @type string
     * @memberof WidgetSDKWidgetApiApifindWidgetPackByNodeId
     */
    nodeId: string
    /**
     * association id：node share id、template id
     * @type string
     * @memberof WidgetSDKWidgetApiApifindWidgetPackByNodeId
     */
    linkId?: string
    /**
     * space id
     * @type string
     * @memberof WidgetSDKWidgetApiApifindWidgetPackByNodeId
     */
    xSpaceId?: string
}

export interface WidgetSDKWidgetApiApiFindWidgetPackByWidgetIdsRequest {
    /**
     * widget ids
     * @type string
     * @memberof WidgetSDKWidgetApiApifindWidgetPackByWidgetIds
     */
    widgetIds: string
    /**
     * Association ID: node sharing ID and template ID
     * @type string
     * @memberof WidgetSDKWidgetApiApifindWidgetPackByWidgetIds
     */
    linkId?: string
}

export interface WidgetSDKWidgetApiApiWidgetStoreListRequest {
    /**
     *
     * @type WidgetStoreListRo
     * @memberof WidgetSDKWidgetApiApiwidgetStoreList
     */
    widgetStoreListRo: WidgetStoreListRo
    /**
     * space id
     * @type string
     * @memberof WidgetSDKWidgetApiApiwidgetStoreList
     */
    xSpaceId: string
}

export class ObjectWidgetSDKWidgetApiApi {
    private api: ObservableWidgetSDKWidgetApiApi

    public constructor(configuration: Configuration, requestFactory?: WidgetSDKWidgetApiApiRequestFactory, responseProcessor?: WidgetSDKWidgetApiApiResponseProcessor) {
        this.api = new ObservableWidgetSDKWidgetApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Scenario: 1、dashboard import widget2:the widget panel sends applets to the dashboard; 3:copy widget
     * Copy widget
     * @param param the request object
     */
    public copyWidgetWithHttpInfo(param: WidgetSDKWidgetApiApiCopyWidgetRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetPack>> {
        return this.api.copyWidgetWithHttpInfo(param.widgetCopyRo,  options).toPromise();
    }

    /**
     * Scenario: 1、dashboard import widget2:the widget panel sends applets to the dashboard; 3:copy widget
     * Copy widget
     * @param param the request object
     */
    public copyWidget(param: WidgetSDKWidgetApiApiCopyWidgetRequest, options?: Configuration): Promise<ResponseDataListWidgetPack> {
        return this.api.copyWidget(param.widgetCopyRo,  options).toPromise();
    }

    /**
     * Scenario:1、dashboard new applet 2、datasheet widget panel new widget
     * Create widget
     * @param param the request object
     */
    public createWidget1WithHttpInfo(param: WidgetSDKWidgetApiApiCreateWidget1Request, options?: Configuration): Promise<HttpInfo<ResponseDataWidgetPack>> {
        return this.api.createWidget1WithHttpInfo(param.widgetCreateRo,  options).toPromise();
    }

    /**
     * Scenario:1、dashboard new applet 2、datasheet widget panel new widget
     * Create widget
     * @param param the request object
     */
    public createWidget1(param: WidgetSDKWidgetApiApiCreateWidget1Request, options?: Configuration): Promise<ResponseDataWidgetPack> {
        return this.api.createWidget1(param.widgetCreateRo,  options).toPromise();
    }

    /**
     * Get package teamplates
     * @param param the request object
     */
    public findTemplatePackageListWithHttpInfo(param: WidgetSDKWidgetApiApiFindTemplatePackageListRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetTemplatePackageInfo>> {
        return this.api.findTemplatePackageListWithHttpInfo( options).toPromise();
    }

    /**
     * Get package teamplates
     * @param param the request object
     */
    public findTemplatePackageList(param: WidgetSDKWidgetApiApiFindTemplatePackageListRequest = {}, options?: Configuration): Promise<ResponseDataListWidgetTemplatePackageInfo> {
        return this.api.findTemplatePackageList( options).toPromise();
    }

    /**
     * get the widget information of the node
     * @param param the request object
     */
    public findWidgetInfoByNodeIdWithHttpInfo(param: WidgetSDKWidgetApiApiFindWidgetInfoByNodeIdRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetInfo>> {
        return this.api.findWidgetInfoByNodeIdWithHttpInfo(param.nodeId,  options).toPromise();
    }

    /**
     * get the widget information of the node
     * @param param the request object
     */
    public findWidgetInfoByNodeId(param: WidgetSDKWidgetApiApiFindWidgetInfoByNodeIdRequest, options?: Configuration): Promise<ResponseDataListWidgetInfo> {
        return this.api.findWidgetInfoByNodeId(param.nodeId,  options).toPromise();
    }

    /**
     * get the widgets under the entire space
     * Get the space widgets
     * @param param the request object
     */
    public findWidgetInfoBySpaceIdWithHttpInfo(param: WidgetSDKWidgetApiApiFindWidgetInfoBySpaceIdRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetInfo>> {
        return this.api.findWidgetInfoBySpaceIdWithHttpInfo(param.spaceId, param.count,  options).toPromise();
    }

    /**
     * get the widgets under the entire space
     * Get the space widgets
     * @param param the request object
     */
    public findWidgetInfoBySpaceId(param: WidgetSDKWidgetApiApiFindWidgetInfoBySpaceIdRequest, options?: Configuration): Promise<ResponseDataListWidgetInfo> {
        return this.api.findWidgetInfoBySpaceId(param.spaceId, param.count,  options).toPromise();
    }

    /**
     * Node types are limited to dashboards and datasheet
     * Get the node widget package
     * @param param the request object
     */
    public findWidgetPackByNodeIdWithHttpInfo(param: WidgetSDKWidgetApiApiFindWidgetPackByNodeIdRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetPack>> {
        return this.api.findWidgetPackByNodeIdWithHttpInfo(param.nodeId, param.linkId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Node types are limited to dashboards and datasheet
     * Get the node widget package
     * @param param the request object
     */
    public findWidgetPackByNodeId(param: WidgetSDKWidgetApiApiFindWidgetPackByNodeIdRequest, options?: Configuration): Promise<ResponseDataListWidgetPack> {
        return this.api.findWidgetPackByNodeId(param.nodeId, param.linkId, param.xSpaceId,  options).toPromise();
    }

    /**
     * get widget info by widget id
     * Get widget info
     * @param param the request object
     */
    public findWidgetPackByWidgetIdsWithHttpInfo(param: WidgetSDKWidgetApiApiFindWidgetPackByWidgetIdsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetPack>> {
        return this.api.findWidgetPackByWidgetIdsWithHttpInfo(param.widgetIds, param.linkId,  options).toPromise();
    }

    /**
     * get widget info by widget id
     * Get widget info
     * @param param the request object
     */
    public findWidgetPackByWidgetIds(param: WidgetSDKWidgetApiApiFindWidgetPackByWidgetIdsRequest, options?: Configuration): Promise<ResponseDataListWidgetPack> {
        return this.api.findWidgetPackByWidgetIds(param.widgetIds, param.linkId,  options).toPromise();
    }

    /**
     * Get widget store
     * @param param the request object
     */
    public widgetStoreListWithHttpInfo(param: WidgetSDKWidgetApiApiWidgetStoreListRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetStoreListInfo>> {
        return this.api.widgetStoreListWithHttpInfo(param.widgetStoreListRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Get widget store
     * @param param the request object
     */
    public widgetStoreList(param: WidgetSDKWidgetApiApiWidgetStoreListRequest, options?: Configuration): Promise<ResponseDataListWidgetStoreListInfo> {
        return this.api.widgetStoreList(param.widgetStoreListRo, param.xSpaceId,  options).toPromise();
    }

}

import { ObservableWidgetSDKWidgetAuditApiApi } from "./ObservableAPI";
import { WidgetSDKWidgetAuditApiApiRequestFactory, WidgetSDKWidgetAuditApiApiResponseProcessor} from "../apis/WidgetSDKWidgetAuditApiApi";

export interface WidgetSDKWidgetAuditApiApiAuditSubmitDataRequest {
    /**
     *
     * @type WidgetAuditSubmitDataRo
     * @memberof WidgetSDKWidgetAuditApiApiauditSubmitData
     */
    widgetAuditSubmitDataRo: WidgetAuditSubmitDataRo
}

export interface WidgetSDKWidgetAuditApiApiIssuedGlobalIdRequest {
    /**
     *
     * @type WidgetAuditGlobalIdRo
     * @memberof WidgetSDKWidgetAuditApiApiissuedGlobalId
     */
    widgetAuditGlobalIdRo: WidgetAuditGlobalIdRo
}

export class ObjectWidgetSDKWidgetAuditApiApi {
    private api: ObservableWidgetSDKWidgetAuditApiApi

    public constructor(configuration: Configuration, requestFactory?: WidgetSDKWidgetAuditApiApiRequestFactory, responseProcessor?: WidgetSDKWidgetAuditApiApiResponseProcessor) {
        this.api = new ObservableWidgetSDKWidgetAuditApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Audit global widget submit data
     * @param param the request object
     */
    public auditSubmitDataWithHttpInfo(param: WidgetSDKWidgetAuditApiApiAuditSubmitDataRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.auditSubmitDataWithHttpInfo(param.widgetAuditSubmitDataRo,  options).toPromise();
    }

    /**
     * Audit global widget submit data
     * @param param the request object
     */
    public auditSubmitData(param: WidgetSDKWidgetAuditApiApiAuditSubmitDataRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.auditSubmitData(param.widgetAuditSubmitDataRo,  options).toPromise();
    }

    /**
     * Issue global id
     * @param param the request object
     */
    public issuedGlobalIdWithHttpInfo(param: WidgetSDKWidgetAuditApiApiIssuedGlobalIdRequest, options?: Configuration): Promise<HttpInfo<ResponseDataWidgetIssuedGlobalIdVo>> {
        return this.api.issuedGlobalIdWithHttpInfo(param.widgetAuditGlobalIdRo,  options).toPromise();
    }

    /**
     * Issue global id
     * @param param the request object
     */
    public issuedGlobalId(param: WidgetSDKWidgetAuditApiApiIssuedGlobalIdRequest, options?: Configuration): Promise<ResponseDataWidgetIssuedGlobalIdVo> {
        return this.api.issuedGlobalId(param.widgetAuditGlobalIdRo,  options).toPromise();
    }

}

import { ObservableWidgetUploadAPIApi } from "./ObservableAPI";
import { WidgetUploadAPIApiRequestFactory, WidgetUploadAPIApiResponseProcessor} from "../apis/WidgetUploadAPIApi";

export interface WidgetUploadAPIApiGenerateWidgetPreSignedUrlRequest {
    /**
     *
     * @type WidgetAssetUploadCertificateRO
     * @memberof WidgetUploadAPIApigenerateWidgetPreSignedUrl
     */
    widgetAssetUploadCertificateRO: WidgetAssetUploadCertificateRO
    /**
     *
     * @type string
     * @memberof WidgetUploadAPIApigenerateWidgetPreSignedUrl
     */
    packageId: string
}

export interface WidgetUploadAPIApiGetWidgetUploadMetaRequest {
}

export class ObjectWidgetUploadAPIApi {
    private api: ObservableWidgetUploadAPIApi

    public constructor(configuration: Configuration, requestFactory?: WidgetUploadAPIApiRequestFactory, responseProcessor?: WidgetUploadAPIApiResponseProcessor) {
        this.api = new ObservableWidgetUploadAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get widget file upload pre signed url
     * @param param the request object
     */
    public generateWidgetPreSignedUrlWithHttpInfo(param: WidgetUploadAPIApiGenerateWidgetPreSignedUrlRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetUploadTokenVo>> {
        return this.api.generateWidgetPreSignedUrlWithHttpInfo(param.widgetAssetUploadCertificateRO, param.packageId,  options).toPromise();
    }

    /**
     * Get widget file upload pre signed url
     * @param param the request object
     */
    public generateWidgetPreSignedUrl(param: WidgetUploadAPIApiGenerateWidgetPreSignedUrlRequest, options?: Configuration): Promise<ResponseDataListWidgetUploadTokenVo> {
        return this.api.generateWidgetPreSignedUrl(param.widgetAssetUploadCertificateRO, param.packageId,  options).toPromise();
    }

    /**
     * get widget upload meta
     * get widget upload meta
     * @param param the request object
     */
    public getWidgetUploadMetaWithHttpInfo(param: WidgetUploadAPIApiGetWidgetUploadMetaRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataWidgetUploadMetaVo>> {
        return this.api.getWidgetUploadMetaWithHttpInfo( options).toPromise();
    }

    /**
     * get widget upload meta
     * get widget upload meta
     * @param param the request object
     */
    public getWidgetUploadMeta(param: WidgetUploadAPIApiGetWidgetUploadMetaRequest = {}, options?: Configuration): Promise<ResponseDataWidgetUploadMetaVo> {
        return this.api.getWidgetUploadMeta( options).toPromise();
    }

}

import { ObservableWorkbenchFieldRoleAPIApi } from "./ObservableAPI";
import { WorkbenchFieldRoleAPIApiRequestFactory, WorkbenchFieldRoleAPIApiResponseProcessor} from "../apis/WorkbenchFieldRoleAPIApi";

export interface WorkbenchFieldRoleAPIApiAddRole1Request {
    /**
     *
     * @type FieldRoleCreateRo
     * @memberof WorkbenchFieldRoleAPIApiaddRole1
     */
    fieldRoleCreateRo: FieldRoleCreateRo
    /**
     * datasheet id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApiaddRole1
     */
    dstId: string
    /**
     * field id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApiaddRole1
     */
    fieldId: string
}

export interface WorkbenchFieldRoleAPIApiBatchDeleteRole1Request {
    /**
     *
     * @type BatchFieldRoleDeleteRo
     * @memberof WorkbenchFieldRoleAPIApibatchDeleteRole1
     */
    batchFieldRoleDeleteRo: BatchFieldRoleDeleteRo
    /**
     * datasheet id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApibatchDeleteRole1
     */
    dstId: string
    /**
     * field id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApibatchDeleteRole1
     */
    fieldId: string
}

export interface WorkbenchFieldRoleAPIApiBatchEditRole1Request {
    /**
     *
     * @type BatchFieldRoleEditRo
     * @memberof WorkbenchFieldRoleAPIApibatchEditRole1
     */
    batchFieldRoleEditRo: BatchFieldRoleEditRo
    /**
     * datasheet id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApibatchEditRole1
     */
    dstId: string
    /**
     * field id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApibatchEditRole1
     */
    fieldId: string
}

export interface WorkbenchFieldRoleAPIApiDeleteRole3Request {
    /**
     *
     * @type FieldRoleDeleteRo
     * @memberof WorkbenchFieldRoleAPIApideleteRole3
     */
    fieldRoleDeleteRo: FieldRoleDeleteRo
    /**
     * datasheet id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApideleteRole3
     */
    dstId: string
    /**
     * field id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApideleteRole3
     */
    fieldId: string
}

export interface WorkbenchFieldRoleAPIApiDisableRoleRequest {
    /**
     * datasheet id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApidisableRole
     */
    dstId: string
    /**
     * field id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApidisableRole
     */
    fieldId: string
}

export interface WorkbenchFieldRoleAPIApiEditRole2Request {
    /**
     *
     * @type FieldRoleEditRo
     * @memberof WorkbenchFieldRoleAPIApieditRole2
     */
    fieldRoleEditRo: FieldRoleEditRo
    /**
     * datasheet id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApieditRole2
     */
    dstId: string
    /**
     * field id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApieditRole2
     */
    fieldId: string
}

export interface WorkbenchFieldRoleAPIApiEnableRoleRequest {
    /**
     * datasheet id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApienableRole
     */
    dstId: string
    /**
     * field id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApienableRole
     */
    fieldId: string
    /**
     *
     * @type RoleControlOpenRo
     * @memberof WorkbenchFieldRoleAPIApienableRole
     */
    roleControlOpenRo?: RoleControlOpenRo
}

export interface WorkbenchFieldRoleAPIApiGetCollaboratorPage1Request {
    /**
     * datasheet id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApigetCollaboratorPage1
     */
    dstId: string
    /**
     * field id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApigetCollaboratorPage1
     */
    fieldId: string
    /**
     *
     * @type Page
     * @memberof WorkbenchFieldRoleAPIApigetCollaboratorPage1
     */
    page: Page
    /**
     * space id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApigetCollaboratorPage1
     */
    xSpaceId: string
    /**
     * page\&#39;s parameter
     * @type string
     * @memberof WorkbenchFieldRoleAPIApigetCollaboratorPage1
     */
    pageObjectParams: string
}

export interface WorkbenchFieldRoleAPIApiGetMultiDatasheetFieldPermissionRequest {
    /**
     * datasheet id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApigetMultiDatasheetFieldPermission
     */
    dstIds: string
    /**
     * share id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApigetMultiDatasheetFieldPermission
     */
    shareId?: string
}

export interface WorkbenchFieldRoleAPIApiListRole2Request {
    /**
     * datasheet id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApilistRole2
     */
    dstId: string
    /**
     * field id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApilistRole2
     */
    fieldId: string
}

export interface WorkbenchFieldRoleAPIApiUpdateRoleSettingRequest {
    /**
     *
     * @type FieldControlProp
     * @memberof WorkbenchFieldRoleAPIApiupdateRoleSetting
     */
    fieldControlProp: FieldControlProp
    /**
     * datasheet id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApiupdateRoleSetting
     */
    dstId: string
    /**
     * field id
     * @type string
     * @memberof WorkbenchFieldRoleAPIApiupdateRoleSetting
     */
    fieldId: string
}

export class ObjectWorkbenchFieldRoleAPIApi {
    private api: ObservableWorkbenchFieldRoleAPIApi

    public constructor(configuration: Configuration, requestFactory?: WorkbenchFieldRoleAPIApiRequestFactory, responseProcessor?: WorkbenchFieldRoleAPIApiResponseProcessor) {
        this.api = new ObservableWorkbenchFieldRoleAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Add field role
     * @param param the request object
     */
    public addRole1WithHttpInfo(param: WorkbenchFieldRoleAPIApiAddRole1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.addRole1WithHttpInfo(param.fieldRoleCreateRo, param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Add field role
     * @param param the request object
     */
    public addRole1(param: WorkbenchFieldRoleAPIApiAddRole1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.addRole1(param.fieldRoleCreateRo, param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Batch delete role
     * @param param the request object
     */
    public batchDeleteRole1WithHttpInfo(param: WorkbenchFieldRoleAPIApiBatchDeleteRole1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.batchDeleteRole1WithHttpInfo(param.batchFieldRoleDeleteRo, param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Batch delete role
     * @param param the request object
     */
    public batchDeleteRole1(param: WorkbenchFieldRoleAPIApiBatchDeleteRole1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.batchDeleteRole1(param.batchFieldRoleDeleteRo, param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Batch edit field role
     * @param param the request object
     */
    public batchEditRole1WithHttpInfo(param: WorkbenchFieldRoleAPIApiBatchEditRole1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.batchEditRole1WithHttpInfo(param.batchFieldRoleEditRo, param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Batch edit field role
     * @param param the request object
     */
    public batchEditRole1(param: WorkbenchFieldRoleAPIApiBatchEditRole1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.batchEditRole1(param.batchFieldRoleEditRo, param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Delete field role
     * @param param the request object
     */
    public deleteRole3WithHttpInfo(param: WorkbenchFieldRoleAPIApiDeleteRole3Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteRole3WithHttpInfo(param.fieldRoleDeleteRo, param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Delete field role
     * @param param the request object
     */
    public deleteRole3(param: WorkbenchFieldRoleAPIApiDeleteRole3Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteRole3(param.fieldRoleDeleteRo, param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Disable field role
     * @param param the request object
     */
    public disableRoleWithHttpInfo(param: WorkbenchFieldRoleAPIApiDisableRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.disableRoleWithHttpInfo(param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Disable field role
     * @param param the request object
     */
    public disableRole(param: WorkbenchFieldRoleAPIApiDisableRoleRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.disableRole(param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Edit field role
     * @param param the request object
     */
    public editRole2WithHttpInfo(param: WorkbenchFieldRoleAPIApiEditRole2Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.editRole2WithHttpInfo(param.fieldRoleEditRo, param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Edit field role
     * @param param the request object
     */
    public editRole2(param: WorkbenchFieldRoleAPIApiEditRole2Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.editRole2(param.fieldRoleEditRo, param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Enable field role
     * @param param the request object
     */
    public enableRoleWithHttpInfo(param: WorkbenchFieldRoleAPIApiEnableRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.enableRoleWithHttpInfo(param.dstId, param.fieldId, param.roleControlOpenRo,  options).toPromise();
    }

    /**
     * Enable field role
     * @param param the request object
     */
    public enableRole(param: WorkbenchFieldRoleAPIApiEnableRoleRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.enableRole(param.dstId, param.fieldId, param.roleControlOpenRo,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page Query the Field\' Collaborator
     * @param param the request object
     */
    public getCollaboratorPage1WithHttpInfo(param: WorkbenchFieldRoleAPIApiGetCollaboratorPage1Request, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoFieldRoleMemberVo>> {
        return this.api.getCollaboratorPage1WithHttpInfo(param.dstId, param.fieldId, param.page, param.xSpaceId, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page Query the Field\' Collaborator
     * @param param the request object
     */
    public getCollaboratorPage1(param: WorkbenchFieldRoleAPIApiGetCollaboratorPage1Request, options?: Configuration): Promise<ResponseDataPageInfoFieldRoleMemberVo> {
        return this.api.getCollaboratorPage1(param.dstId, param.fieldId, param.page, param.xSpaceId, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Get multi datasheet field permission
     * @param param the request object
     */
    public getMultiDatasheetFieldPermissionWithHttpInfo(param: WorkbenchFieldRoleAPIApiGetMultiDatasheetFieldPermissionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListFieldPermissionView>> {
        return this.api.getMultiDatasheetFieldPermissionWithHttpInfo(param.dstIds, param.shareId,  options).toPromise();
    }

    /**
     * Get multi datasheet field permission
     * @param param the request object
     */
    public getMultiDatasheetFieldPermission(param: WorkbenchFieldRoleAPIApiGetMultiDatasheetFieldPermissionRequest, options?: Configuration): Promise<ResponseDataListFieldPermissionView> {
        return this.api.getMultiDatasheetFieldPermission(param.dstIds, param.shareId,  options).toPromise();
    }

    /**
     * Gets the field role infos in datasheet.
     * @param param the request object
     */
    public listRole2WithHttpInfo(param: WorkbenchFieldRoleAPIApiListRole2Request, options?: Configuration): Promise<HttpInfo<ResponseDataFieldCollaboratorVO>> {
        return this.api.listRole2WithHttpInfo(param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Gets the field role infos in datasheet.
     * @param param the request object
     */
    public listRole2(param: WorkbenchFieldRoleAPIApiListRole2Request, options?: Configuration): Promise<ResponseDataFieldCollaboratorVO> {
        return this.api.listRole2(param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Update field role setting
     * @param param the request object
     */
    public updateRoleSettingWithHttpInfo(param: WorkbenchFieldRoleAPIApiUpdateRoleSettingRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateRoleSettingWithHttpInfo(param.fieldControlProp, param.dstId, param.fieldId,  options).toPromise();
    }

    /**
     * Update field role setting
     * @param param the request object
     */
    public updateRoleSetting(param: WorkbenchFieldRoleAPIApiUpdateRoleSettingRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateRoleSetting(param.fieldControlProp, param.dstId, param.fieldId,  options).toPromise();
    }

}

import { ObservableWorkbenchNodeApiApi } from "./ObservableAPI";
import { WorkbenchNodeApiApiRequestFactory, WorkbenchNodeApiApiResponseProcessor} from "../apis/WorkbenchNodeApiApi";

export interface WorkbenchNodeApiApiActiveSheetsRequest {
    /**
     *
     * @type ActiveSheetsOpRo
     * @memberof WorkbenchNodeApiApiactiveSheets
     */
    activeSheetsOpRo: ActiveSheetsOpRo
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeApiApiactiveSheets
     */
    xSpaceId: string
}

export interface WorkbenchNodeApiApiAnalyzeBundleRequest {
    /**
     *
     * @type NodeBundleOpRo
     * @memberof WorkbenchNodeApiApianalyzeBundle
     */
    nodeBundleOpRo?: NodeBundleOpRo
}

export interface WorkbenchNodeApiApiCheckRelNodeRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApicheckRelNode
     */
    nodeId: string
    /**
     * view id（do not specify full return）
     * @type string
     * @memberof WorkbenchNodeApiApicheckRelNode
     */
    viewId?: string
    /**
     * node type（do not specify full return，form:3/mirror:5）
     * @type number
     * @memberof WorkbenchNodeApiApicheckRelNode
     */
    type?: number
}

export interface WorkbenchNodeApiApiCopyRequest {
    /**
     *
     * @type NodeCopyOpRo
     * @memberof WorkbenchNodeApiApicopy
     */
    nodeCopyOpRo: NodeCopyOpRo
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeApiApicopy
     */
    xSocketId?: string
}

export interface WorkbenchNodeApiApiCreate6Request {
    /**
     *
     * @type NodeOpRo
     * @memberof WorkbenchNodeApiApicreate6
     */
    nodeOpRo: NodeOpRo
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeApiApicreate6
     */
    xSocketId?: string
}

export interface WorkbenchNodeApiApiDelete8Request {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApidelete8
     */
    nodeId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeApiApidelete8
     */
    xSocketId?: string
}

export interface WorkbenchNodeApiApiDelete9Request {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApidelete9
     */
    nodeId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeApiApidelete9
     */
    xSocketId?: string
}

export interface WorkbenchNodeApiApiExportBundleRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApiexportBundle
     */
    nodeId: string
    /**
     * whether to retain data
     * @type boolean
     * @memberof WorkbenchNodeApiApiexportBundle
     */
    saveData?: boolean
    /**
     * encrypted password
     * @type string
     * @memberof WorkbenchNodeApiApiexportBundle
     */
    password?: string
}

export interface WorkbenchNodeApiApiGetByNodeIdRequest {
    /**
     * node ids
     * @type string
     * @memberof WorkbenchNodeApiApigetByNodeId
     */
    nodeIds: string
}

export interface WorkbenchNodeApiApiGetNodeChildrenListRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApigetNodeChildrenList
     */
    nodeId: string
    /**
     * node type 1:folder,2:datasheet
     * @type number
     * @memberof WorkbenchNodeApiApigetNodeChildrenList
     */
    nodeType?: number
}

export interface WorkbenchNodeApiApiGetNodeRelRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApigetNodeRel
     */
    nodeId: string
    /**
     * view id（do not specify full return）
     * @type string
     * @memberof WorkbenchNodeApiApigetNodeRel
     */
    viewId?: string
    /**
     * node type（do not specify full return，form:3/mirror:5）
     * @type number
     * @memberof WorkbenchNodeApiApigetNodeRel
     */
    type?: number
}

export interface WorkbenchNodeApiApiGetParentNodesRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApigetParentNodes
     */
    nodeId: string
}

export interface WorkbenchNodeApiApiGetTreeRequest {
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeApiApigetTree
     */
    xSpaceId: string
    /**
     * tree depth, we can specify the query depth, maximum 2 layers depth.
     * @type number
     * @memberof WorkbenchNodeApiApigetTree
     */
    depth?: number
}

export interface WorkbenchNodeApiApiImportExcelRequest {
    /**
     *
     * @type ImportExcelOpRo
     * @memberof WorkbenchNodeApiApiimportExcel
     */
    importExcelOpRo?: ImportExcelOpRo
}

export interface WorkbenchNodeApiApiImportExcel1Request {
    /**
     *
     * @type ImportExcelOpRo
     * @memberof WorkbenchNodeApiApiimportExcel1
     */
    importExcelOpRo?: ImportExcelOpRo
}

export interface WorkbenchNodeApiApiList6Request {
    /**
     * node type
     * @type number
     * @memberof WorkbenchNodeApiApilist6
     */
    type: number
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeApiApilist6
     */
    xSpaceId: string
    /**
     * role（manageable by default）
     * @type string
     * @memberof WorkbenchNodeApiApilist6
     */
    role?: string
}

export interface WorkbenchNodeApiApiMoveRequest {
    /**
     *
     * @type NodeMoveOpRo
     * @memberof WorkbenchNodeApiApimove
     */
    nodeMoveOpRo: NodeMoveOpRo
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeApiApimove
     */
    xSpaceId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeApiApimove
     */
    xSocketId?: string
}

export interface WorkbenchNodeApiApiPositionRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApiposition
     */
    nodeId: string
}

export interface WorkbenchNodeApiApiPostRemindUnitsNoPermissionRequest {
    /**
     *
     * @type RemindUnitsNoPermissionRo
     * @memberof WorkbenchNodeApiApipostRemindUnitsNoPermission
     */
    remindUnitsNoPermissionRo: RemindUnitsNoPermissionRo
}

export interface WorkbenchNodeApiApiRecentListRequest {
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeApiApirecentList
     */
    xSpaceId: string
}

export interface WorkbenchNodeApiApiRemindRequest {
    /**
     *
     * @type RemindMemberRo
     * @memberof WorkbenchNodeApiApiremind
     */
    remindMemberRo: RemindMemberRo
}

export interface WorkbenchNodeApiApiSearchNodeRequest {
    /**
     * keyword
     * @type string
     * @memberof WorkbenchNodeApiApisearchNode
     */
    keyword: string
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeApiApisearchNode
     */
    xSpaceId: string
    /**
     * highlight style
     * @type string
     * @memberof WorkbenchNodeApiApisearchNode
     */
    className?: string
}

export interface WorkbenchNodeApiApiShowNodeInfoWindowRequest {
    /**
     *
     * @type string
     * @memberof WorkbenchNodeApiApishowNodeInfoWindow
     */
    nodeId: string
}

export interface WorkbenchNodeApiApiShowcaseRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApishowcase
     */
    nodeId: string
    /**
     * share id
     * @type string
     * @memberof WorkbenchNodeApiApishowcase
     */
    shareId?: string
}

export interface WorkbenchNodeApiApiUpdate5Request {
    /**
     *
     * @type NodeUpdateOpRo
     * @memberof WorkbenchNodeApiApiupdate5
     */
    nodeUpdateOpRo: NodeUpdateOpRo
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApiupdate5
     */
    nodeId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeApiApiupdate5
     */
    xSocketId?: string
}

export interface WorkbenchNodeApiApiUpdateDescRequest {
    /**
     *
     * @type NodeDescOpRo
     * @memberof WorkbenchNodeApiApiupdateDesc
     */
    nodeDescOpRo: NodeDescOpRo
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeApiApiupdateDesc
     */
    xSocketId?: string
}

export class ObjectWorkbenchNodeApiApi {
    private api: ObservableWorkbenchNodeApiApi

    public constructor(configuration: Configuration, requestFactory?: WorkbenchNodeApiApiRequestFactory, responseProcessor?: WorkbenchNodeApiApiResponseProcessor) {
        this.api = new ObservableWorkbenchNodeApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * node id and view id are not required（do not pass means all closed）
     * Record active node
     * @param param the request object
     */
    public activeSheetsWithHttpInfo(param: WorkbenchNodeApiApiActiveSheetsRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.activeSheetsWithHttpInfo(param.activeSheetsOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * node id and view id are not required（do not pass means all closed）
     * Record active node
     * @param param the request object
     */
    public activeSheets(param: WorkbenchNodeApiApiActiveSheetsRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.activeSheets(param.activeSheetsOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * The front node is saved in the first place of the parent node when it is not under the parent node. Save in the first place of the first level directory when it is not transmitted.
     * Analyze Bundle
     * @param param the request object
     */
    public analyzeBundleWithHttpInfo(param: WorkbenchNodeApiApiAnalyzeBundleRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.analyzeBundleWithHttpInfo(param.nodeBundleOpRo,  options).toPromise();
    }

    /**
     * The front node is saved in the first place of the parent node when it is not under the parent node. Save in the first place of the first level directory when it is not transmitted.
     * Analyze Bundle
     * @param param the request object
     */
    public analyzeBundle(param: WorkbenchNodeApiApiAnalyzeBundleRequest = {}, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.analyzeBundle(param.nodeBundleOpRo,  options).toPromise();
    }

    /**
     * permission of the associated node is not required. Scenario: Check whether the view associated mirror before deleting the table.
     * check for associated nodes
     * @param param the request object
     */
    public checkRelNodeWithHttpInfo(param: WorkbenchNodeApiApiCheckRelNodeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfo>> {
        return this.api.checkRelNodeWithHttpInfo(param.nodeId, param.viewId, param.type,  options).toPromise();
    }

    /**
     * permission of the associated node is not required. Scenario: Check whether the view associated mirror before deleting the table.
     * check for associated nodes
     * @param param the request object
     */
    public checkRelNode(param: WorkbenchNodeApiApiCheckRelNodeRequest, options?: Configuration): Promise<ResponseDataListNodeInfo> {
        return this.api.checkRelNode(param.nodeId, param.viewId, param.type,  options).toPromise();
    }

    /**
     * node id is required, whether to copy data is not required.
     * Copy node
     * @param param the request object
     */
    public copyWithHttpInfo(param: WorkbenchNodeApiApiCopyRequest, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        return this.api.copyWithHttpInfo(param.nodeCopyOpRo, param.xSocketId,  options).toPromise();
    }

    /**
     * node id is required, whether to copy data is not required.
     * Copy node
     * @param param the request object
     */
    public copy(param: WorkbenchNodeApiApiCopyRequest, options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        return this.api.copy(param.nodeCopyOpRo, param.xSocketId,  options).toPromise();
    }

    /**
     * create a new node under the node<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Create child node
     * @param param the request object
     */
    public create6WithHttpInfo(param: WorkbenchNodeApiApiCreate6Request, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        return this.api.create6WithHttpInfo(param.nodeOpRo, param.xSocketId,  options).toPromise();
    }

    /**
     * create a new node under the node<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Create child node
     * @param param the request object
     */
    public create6(param: WorkbenchNodeApiApiCreate6Request, options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        return this.api.create6(param.nodeOpRo, param.xSocketId,  options).toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param param the request object
     */
    public delete8WithHttpInfo(param: WorkbenchNodeApiApiDelete8Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete8WithHttpInfo(param.nodeId, param.xSocketId,  options).toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param param the request object
     */
    public delete8(param: WorkbenchNodeApiApiDelete8Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete8(param.nodeId, param.xSocketId,  options).toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param param the request object
     */
    public delete9WithHttpInfo(param: WorkbenchNodeApiApiDelete9Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete9WithHttpInfo(param.nodeId, param.xSocketId,  options).toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param param the request object
     */
    public delete9(param: WorkbenchNodeApiApiDelete9Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete9(param.nodeId, param.xSocketId,  options).toPromise();
    }

    /**
     * Export Bundle
     * @param param the request object
     */
    public exportBundleWithHttpInfo(param: WorkbenchNodeApiApiExportBundleRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.exportBundleWithHttpInfo(param.nodeId, param.saveData, param.password,  options).toPromise();
    }

    /**
     * Export Bundle
     * @param param the request object
     */
    public exportBundle(param: WorkbenchNodeApiApiExportBundleRequest, options?: Configuration): Promise<void> {
        return this.api.exportBundle(param.nodeId, param.saveData, param.password,  options).toPromise();
    }

    /**
     * obtain information about the node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query nodes
     * @param param the request object
     */
    public getByNodeIdWithHttpInfo(param: WorkbenchNodeApiApiGetByNodeIdRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfoVo>> {
        return this.api.getByNodeIdWithHttpInfo(param.nodeIds,  options).toPromise();
    }

    /**
     * obtain information about the node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query nodes
     * @param param the request object
     */
    public getByNodeId(param: WorkbenchNodeApiApiGetByNodeIdRequest, options?: Configuration): Promise<ResponseDataListNodeInfoVo> {
        return this.api.getByNodeId(param.nodeIds,  options).toPromise();
    }

    /**
     * Obtain the list of child nodes of the specified node. The nodes are classified into folders or datasheet by type <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get child nodes
     * @param param the request object
     */
    public getNodeChildrenListWithHttpInfo(param: WorkbenchNodeApiApiGetNodeChildrenListRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfoVo>> {
        return this.api.getNodeChildrenListWithHttpInfo(param.nodeId, param.nodeType,  options).toPromise();
    }

    /**
     * Obtain the list of child nodes of the specified node. The nodes are classified into folders or datasheet by type <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get child nodes
     * @param param the request object
     */
    public getNodeChildrenList(param: WorkbenchNodeApiApiGetNodeChildrenListRequest, options?: Configuration): Promise<ResponseDataListNodeInfoVo> {
        return this.api.getNodeChildrenList(param.nodeId, param.nodeType,  options).toPromise();
    }

    /**
     * This interface requires readable or above permissions of the associated node. Scenario: Open the display columns of form and mirror in the datasheet.
     * Get associated node
     * @param param the request object
     */
    public getNodeRelWithHttpInfo(param: WorkbenchNodeApiApiGetNodeRelRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfo>> {
        return this.api.getNodeRelWithHttpInfo(param.nodeId, param.viewId, param.type,  options).toPromise();
    }

    /**
     * This interface requires readable or above permissions of the associated node. Scenario: Open the display columns of form and mirror in the datasheet.
     * Get associated node
     * @param param the request object
     */
    public getNodeRel(param: WorkbenchNodeApiApiGetNodeRelRequest, options?: Configuration): Promise<ResponseDataListNodeInfo> {
        return this.api.getNodeRel(param.nodeId, param.viewId, param.type,  options).toPromise();
    }

    /**
     * Gets a list of all parent nodes of the specified node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get parent nodes
     * @param param the request object
     */
    public getParentNodesWithHttpInfo(param: WorkbenchNodeApiApiGetParentNodesRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListNodePathVo>> {
        return this.api.getParentNodesWithHttpInfo(param.nodeId,  options).toPromise();
    }

    /**
     * Gets a list of all parent nodes of the specified node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get parent nodes
     * @param param the request object
     */
    public getParentNodes(param: WorkbenchNodeApiApiGetParentNodesRequest, options?: Configuration): Promise<ResponseDataListNodePathVo> {
        return this.api.getParentNodes(param.nodeId,  options).toPromise();
    }

    /**
     * Query the node tree of workbench, restricted to two levels.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query tree node
     * @param param the request object
     */
    public getTreeWithHttpInfo(param: WorkbenchNodeApiApiGetTreeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoTreeVo>> {
        return this.api.getTreeWithHttpInfo(param.xSpaceId, param.depth,  options).toPromise();
    }

    /**
     * Query the node tree of workbench, restricted to two levels.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query tree node
     * @param param the request object
     */
    public getTree(param: WorkbenchNodeApiApiGetTreeRequest, options?: Configuration): Promise<ResponseDataNodeInfoTreeVo> {
        return this.api.getTree(param.xSpaceId, param.depth,  options).toPromise();
    }

    /**
     * all parameters must be
     * Import excel
     * @param param the request object
     */
    public importExcelWithHttpInfo(param: WorkbenchNodeApiApiImportExcelRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        return this.api.importExcelWithHttpInfo(param.importExcelOpRo,  options).toPromise();
    }

    /**
     * all parameters must be
     * Import excel
     * @param param the request object
     */
    public importExcel(param: WorkbenchNodeApiApiImportExcelRequest = {}, options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        return this.api.importExcel(param.importExcelOpRo,  options).toPromise();
    }

    /**
     * all parameters must be
     * Import excel
     * @param param the request object
     */
    public importExcel1WithHttpInfo(param: WorkbenchNodeApiApiImportExcel1Request = {}, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        return this.api.importExcel1WithHttpInfo(param.importExcelOpRo,  options).toPromise();
    }

    /**
     * all parameters must be
     * Import excel
     * @param param the request object
     */
    public importExcel1(param: WorkbenchNodeApiApiImportExcel1Request = {}, options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        return this.api.importExcel1(param.importExcelOpRo,  options).toPromise();
    }

    /**
     * scenario: query an existing dashboard
     * Get nodes of the specified type
     * @param param the request object
     */
    public list6WithHttpInfo(param: WorkbenchNodeApiApiList6Request, options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfo>> {
        return this.api.list6WithHttpInfo(param.type, param.xSpaceId, param.role,  options).toPromise();
    }

    /**
     * scenario: query an existing dashboard
     * Get nodes of the specified type
     * @param param the request object
     */
    public list6(param: WorkbenchNodeApiApiList6Request, options?: Configuration): Promise<ResponseDataListNodeInfo> {
        return this.api.list6(param.type, param.xSpaceId, param.role,  options).toPromise();
    }

    /**
     * Node ID and parent node ID are required, and pre Node Id is not required.
     * Move node
     * @param param the request object
     */
    public moveWithHttpInfo(param: WorkbenchNodeApiApiMoveRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfoVo>> {
        return this.api.moveWithHttpInfo(param.nodeMoveOpRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Node ID and parent node ID are required, and pre Node Id is not required.
     * Move node
     * @param param the request object
     */
    public move(param: WorkbenchNodeApiApiMoveRequest, options?: Configuration): Promise<ResponseDataListNodeInfoVo> {
        return this.api.move(param.nodeMoveOpRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * node in must <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Position node
     * @param param the request object
     */
    public positionWithHttpInfo(param: WorkbenchNodeApiApiPositionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoTreeVo>> {
        return this.api.positionWithHttpInfo(param.nodeId,  options).toPromise();
    }

    /**
     * node in must <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Position node
     * @param param the request object
     */
    public position(param: WorkbenchNodeApiApiPositionRequest, options?: Configuration): Promise<ResponseDataNodeInfoTreeVo> {
        return this.api.position(param.nodeId,  options).toPromise();
    }

    /**
     * Gets no permission member before remind
     * @param param the request object
     */
    public postRemindUnitsNoPermissionWithHttpInfo(param: WorkbenchNodeApiApiPostRemindUnitsNoPermissionRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListMemberBriefInfoVo>> {
        return this.api.postRemindUnitsNoPermissionWithHttpInfo(param.remindUnitsNoPermissionRo,  options).toPromise();
    }

    /**
     * Gets no permission member before remind
     * @param param the request object
     */
    public postRemindUnitsNoPermission(param: WorkbenchNodeApiApiPostRemindUnitsNoPermissionRequest, options?: Configuration): Promise<ResponseDataListMemberBriefInfoVo> {
        return this.api.postRemindUnitsNoPermission(param.remindUnitsNoPermissionRo,  options).toPromise();
    }

    /**
     * member recent open node list
     * member recent open node list
     * @param param the request object
     */
    public recentListWithHttpInfo(param: WorkbenchNodeApiApiRecentListRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListNodeSearchResult>> {
        return this.api.recentListWithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * member recent open node list
     * member recent open node list
     * @param param the request object
     */
    public recentList(param: WorkbenchNodeApiApiRecentListRequest, options?: Configuration): Promise<ResponseDataListNodeSearchResult> {
        return this.api.recentList(param.xSpaceId,  options).toPromise();
    }

    /**
     * Remind notification
     * @param param the request object
     */
    public remindWithHttpInfo(param: WorkbenchNodeApiApiRemindRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.remindWithHttpInfo(param.remindMemberRo,  options).toPromise();
    }

    /**
     * Remind notification
     * @param param the request object
     */
    public remind(param: WorkbenchNodeApiApiRemindRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.remind(param.remindMemberRo,  options).toPromise();
    }

    /**
     * Enter the search term to search for the node of the working directory.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Fuzzy search node
     * @param param the request object
     */
    public searchNodeWithHttpInfo(param: WorkbenchNodeApiApiSearchNodeRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListNodeSearchResult>> {
        return this.api.searchNodeWithHttpInfo(param.keyword, param.xSpaceId, param.className,  options).toPromise();
    }

    /**
     * Enter the search term to search for the node of the working directory.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Fuzzy search node
     * @param param the request object
     */
    public searchNode(param: WorkbenchNodeApiApiSearchNodeRequest, options?: Configuration): Promise<ResponseDataListNodeSearchResult> {
        return this.api.searchNode(param.keyword, param.xSpaceId, param.className,  options).toPromise();
    }

    /**
     * Nodes that are not in the center of the template, make spatial judgments.
     * Node info window
     * @param param the request object
     */
    public showNodeInfoWindowWithHttpInfo(param: WorkbenchNodeApiApiShowNodeInfoWindowRequest, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoWindowVo>> {
        return this.api.showNodeInfoWindowWithHttpInfo(param.nodeId,  options).toPromise();
    }

    /**
     * Nodes that are not in the center of the template, make spatial judgments.
     * Node info window
     * @param param the request object
     */
    public showNodeInfoWindow(param: WorkbenchNodeApiApiShowNodeInfoWindowRequest, options?: Configuration): Promise<ResponseDataNodeInfoWindowVo> {
        return this.api.showNodeInfoWindow(param.nodeId,  options).toPromise();
    }

    /**
     * Nodes that are not in the center of the template, make cross-space judgments.
     * Folder preview
     * @param param the request object
     */
    public showcaseWithHttpInfo(param: WorkbenchNodeApiApiShowcaseRequest, options?: Configuration): Promise<HttpInfo<ResponseDataShowcaseVo>> {
        return this.api.showcaseWithHttpInfo(param.nodeId, param.shareId,  options).toPromise();
    }

    /**
     * Nodes that are not in the center of the template, make cross-space judgments.
     * Folder preview
     * @param param the request object
     */
    public showcase(param: WorkbenchNodeApiApiShowcaseRequest, options?: Configuration): Promise<ResponseDataShowcaseVo> {
        return this.api.showcase(param.nodeId, param.shareId,  options).toPromise();
    }

    /**
     * node id must. name, icon is not required<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Edit node
     * @param param the request object
     */
    public update5WithHttpInfo(param: WorkbenchNodeApiApiUpdate5Request, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        return this.api.update5WithHttpInfo(param.nodeUpdateOpRo, param.nodeId, param.xSocketId,  options).toPromise();
    }

    /**
     * node id must. name, icon is not required<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Edit node
     * @param param the request object
     */
    public update5(param: WorkbenchNodeApiApiUpdate5Request, options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        return this.api.update5(param.nodeUpdateOpRo, param.nodeId, param.xSocketId,  options).toPromise();
    }

    /**
     * Update node description
     * @param param the request object
     */
    public updateDescWithHttpInfo(param: WorkbenchNodeApiApiUpdateDescRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateDescWithHttpInfo(param.nodeDescOpRo, param.xSocketId,  options).toPromise();
    }

    /**
     * Update node description
     * @param param the request object
     */
    public updateDesc(param: WorkbenchNodeApiApiUpdateDescRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateDesc(param.nodeDescOpRo, param.xSocketId,  options).toPromise();
    }

}

import { ObservableWorkbenchNodeFavoriteApiApi } from "./ObservableAPI";
import { WorkbenchNodeFavoriteApiApiRequestFactory, WorkbenchNodeFavoriteApiApiResponseProcessor} from "../apis/WorkbenchNodeFavoriteApiApi";

export interface WorkbenchNodeFavoriteApiApiList7Request {
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeFavoriteApiApilist7
     */
    xSpaceId: string
}

export interface WorkbenchNodeFavoriteApiApiMove1Request {
    /**
     *
     * @type MarkNodeMoveRo
     * @memberof WorkbenchNodeFavoriteApiApimove1
     */
    markNodeMoveRo: MarkNodeMoveRo
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeFavoriteApiApimove1
     */
    xSpaceId: string
}

export interface WorkbenchNodeFavoriteApiApiUpdateStatusRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeFavoriteApiApiupdateStatus
     */
    nodeId: string
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeFavoriteApiApiupdateStatus
     */
    xSpaceId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeFavoriteApiApiupdateStatus
     */
    xSocketId?: string
}

export class ObjectWorkbenchNodeFavoriteApiApi {
    private api: ObservableWorkbenchNodeFavoriteApiApi

    public constructor(configuration: Configuration, requestFactory?: WorkbenchNodeFavoriteApiApiRequestFactory, responseProcessor?: WorkbenchNodeFavoriteApiApiResponseProcessor) {
        this.api = new ObservableWorkbenchNodeFavoriteApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get favorite nodes
     * @param param the request object
     */
    public list7WithHttpInfo(param: WorkbenchNodeFavoriteApiApiList7Request, options?: Configuration): Promise<HttpInfo<ResponseDataListFavoriteNodeInfo>> {
        return this.api.list7WithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Get favorite nodes
     * @param param the request object
     */
    public list7(param: WorkbenchNodeFavoriteApiApiList7Request, options?: Configuration): Promise<ResponseDataListFavoriteNodeInfo> {
        return this.api.list7(param.xSpaceId,  options).toPromise();
    }

    /**
     * Move favorite node
     * @param param the request object
     */
    public move1WithHttpInfo(param: WorkbenchNodeFavoriteApiApiMove1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.move1WithHttpInfo(param.markNodeMoveRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Move favorite node
     * @param param the request object
     */
    public move1(param: WorkbenchNodeFavoriteApiApiMove1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.move1(param.markNodeMoveRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Change favorite status
     * @param param the request object
     */
    public updateStatusWithHttpInfo(param: WorkbenchNodeFavoriteApiApiUpdateStatusRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.updateStatusWithHttpInfo(param.nodeId, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Change favorite status
     * @param param the request object
     */
    public updateStatus(param: WorkbenchNodeFavoriteApiApiUpdateStatusRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.updateStatus(param.nodeId, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

}

import { ObservableWorkbenchNodeRoleApiApi } from "./ObservableAPI";
import { WorkbenchNodeRoleApiApiRequestFactory, WorkbenchNodeRoleApiApiResponseProcessor} from "../apis/WorkbenchNodeRoleApiApi";

export interface WorkbenchNodeRoleApiApiBatchDeleteRoleRequest {
    /**
     *
     * @type BatchDeleteNodeRoleRo
     * @memberof WorkbenchNodeRoleApiApibatchDeleteRole
     */
    batchDeleteNodeRoleRo: BatchDeleteNodeRoleRo
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRoleApiApibatchDeleteRole
     */
    xSpaceId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeRoleApiApibatchDeleteRole
     */
    xSocketId?: string
}

export interface WorkbenchNodeRoleApiApiBatchEditRoleRequest {
    /**
     *
     * @type BatchModifyNodeRoleRo
     * @memberof WorkbenchNodeRoleApiApibatchEditRole
     */
    batchModifyNodeRoleRo: BatchModifyNodeRoleRo
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRoleApiApibatchEditRole
     */
    xSpaceId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeRoleApiApibatchEditRole
     */
    xSocketId?: string
}

export interface WorkbenchNodeRoleApiApiCreateRole1Request {
    /**
     *
     * @type AddNodeRoleRo
     * @memberof WorkbenchNodeRoleApiApicreateRole1
     */
    addNodeRoleRo: AddNodeRoleRo
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRoleApiApicreateRole1
     */
    xSpaceId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeRoleApiApicreateRole1
     */
    xSocketId?: string
}

export interface WorkbenchNodeRoleApiApiDeleteRole2Request {
    /**
     *
     * @type DeleteNodeRoleRo
     * @memberof WorkbenchNodeRoleApiApideleteRole2
     */
    deleteNodeRoleRo: DeleteNodeRoleRo
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRoleApiApideleteRole2
     */
    xSpaceId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeRoleApiApideleteRole2
     */
    xSocketId?: string
}

export interface WorkbenchNodeRoleApiApiDisableRoleExtendRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeRoleApiApidisableRoleExtend
     */
    nodeId: string
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRoleApiApidisableRoleExtend
     */
    xSpaceId: string
    /**
     *
     * @type RoleControlOpenRo
     * @memberof WorkbenchNodeRoleApiApidisableRoleExtend
     */
    roleControlOpenRo?: RoleControlOpenRo
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeRoleApiApidisableRoleExtend
     */
    xSocketId?: string
}

export interface WorkbenchNodeRoleApiApiEditRole1Request {
    /**
     *
     * @type ModifyNodeRoleRo
     * @memberof WorkbenchNodeRoleApiApieditRole1
     */
    modifyNodeRoleRo: ModifyNodeRoleRo
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRoleApiApieditRole1
     */
    xSpaceId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeRoleApiApieditRole1
     */
    xSocketId?: string
}

export interface WorkbenchNodeRoleApiApiEnableRoleExtendRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeRoleApiApienableRoleExtend
     */
    nodeId: string
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRoleApiApienableRoleExtend
     */
    xSpaceId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeRoleApiApienableRoleExtend
     */
    xSocketId?: string
}

export interface WorkbenchNodeRoleApiApiGetCollaboratorInfoRequest {
    /**
     *
     * @type string
     * @memberof WorkbenchNodeRoleApiApigetCollaboratorInfo
     */
    uuid: string
    /**
     *
     * @type string
     * @memberof WorkbenchNodeRoleApiApigetCollaboratorInfo
     */
    nodeId: string
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRoleApiApigetCollaboratorInfo
     */
    xSpaceId: string
}

export interface WorkbenchNodeRoleApiApiGetCollaboratorPageRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeRoleApiApigetCollaboratorPage
     */
    nodeId: string
    /**
     *
     * @type Page
     * @memberof WorkbenchNodeRoleApiApigetCollaboratorPage
     */
    page: Page
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRoleApiApigetCollaboratorPage
     */
    xSpaceId: string
    /**
     * page\&#39;s parameter
     * @type string
     * @memberof WorkbenchNodeRoleApiApigetCollaboratorPage
     */
    pageObjectParams: string
}

export interface WorkbenchNodeRoleApiApiListRole1Request {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeRoleApiApilistRole1
     */
    nodeId: string
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRoleApiApilistRole1
     */
    xSpaceId: string
    /**
     * Whether to include the master administrator, can not be passed, the default includes
     * @type boolean
     * @memberof WorkbenchNodeRoleApiApilistRole1
     */
    includeAdmin?: boolean
    /**
     * Whether to get userself, do not pass, the default contains
     * @type boolean
     * @memberof WorkbenchNodeRoleApiApilistRole1
     */
    includeSelf?: boolean
    /**
     * Contains superior inherited permissions. By default, it does not include
     * @type boolean
     * @memberof WorkbenchNodeRoleApiApilistRole1
     */
    includeExtend?: boolean
}

export class ObjectWorkbenchNodeRoleApiApi {
    private api: ObservableWorkbenchNodeRoleApiApi

    public constructor(configuration: Configuration, requestFactory?: WorkbenchNodeRoleApiApiRequestFactory, responseProcessor?: WorkbenchNodeRoleApiApiResponseProcessor) {
        this.api = new ObservableWorkbenchNodeRoleApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Batch delete node role
     * @param param the request object
     */
    public batchDeleteRoleWithHttpInfo(param: WorkbenchNodeRoleApiApiBatchDeleteRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.batchDeleteRoleWithHttpInfo(param.batchDeleteNodeRoleRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Batch delete node role
     * @param param the request object
     */
    public batchDeleteRole(param: WorkbenchNodeRoleApiApiBatchDeleteRoleRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.batchDeleteRole(param.batchDeleteNodeRoleRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Batch modify the role of the organizational unit of the node
     * Batch edit role
     * @param param the request object
     */
    public batchEditRoleWithHttpInfo(param: WorkbenchNodeRoleApiApiBatchEditRoleRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.batchEditRoleWithHttpInfo(param.batchModifyNodeRoleRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Batch modify the role of the organizational unit of the node
     * Batch edit role
     * @param param the request object
     */
    public batchEditRole(param: WorkbenchNodeRoleApiApiBatchEditRoleRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.batchEditRole(param.batchModifyNodeRoleRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Add the organizational unit of the node specified role
     * Create node role
     * @param param the request object
     */
    public createRole1WithHttpInfo(param: WorkbenchNodeRoleApiApiCreateRole1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.createRole1WithHttpInfo(param.addNodeRoleRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Add the organizational unit of the node specified role
     * Create node role
     * @param param the request object
     */
    public createRole1(param: WorkbenchNodeRoleApiApiCreateRole1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.createRole1(param.addNodeRoleRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Delete role
     * @param param the request object
     */
    public deleteRole2WithHttpInfo(param: WorkbenchNodeRoleApiApiDeleteRole2Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.deleteRole2WithHttpInfo(param.deleteNodeRoleRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Delete role
     * @param param the request object
     */
    public deleteRole2(param: WorkbenchNodeRoleApiApiDeleteRole2Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.deleteRole2(param.deleteNodeRoleRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Disable role extend
     * @param param the request object
     */
    public disableRoleExtendWithHttpInfo(param: WorkbenchNodeRoleApiApiDisableRoleExtendRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.disableRoleExtendWithHttpInfo(param.nodeId, param.xSpaceId, param.roleControlOpenRo, param.xSocketId,  options).toPromise();
    }

    /**
     * Disable role extend
     * @param param the request object
     */
    public disableRoleExtend(param: WorkbenchNodeRoleApiApiDisableRoleExtendRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.disableRoleExtend(param.nodeId, param.xSpaceId, param.roleControlOpenRo, param.xSocketId,  options).toPromise();
    }

    /**
     * Modify the role of the organizational unit of the node
     * Edit node role
     * @param param the request object
     */
    public editRole1WithHttpInfo(param: WorkbenchNodeRoleApiApiEditRole1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.editRole1WithHttpInfo(param.modifyNodeRoleRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Modify the role of the organizational unit of the node
     * Edit node role
     * @param param the request object
     */
    public editRole1(param: WorkbenchNodeRoleApiApiEditRole1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.editRole1(param.modifyNodeRoleRo, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Enable role extend
     * @param param the request object
     */
    public enableRoleExtendWithHttpInfo(param: WorkbenchNodeRoleApiApiEnableRoleExtendRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.enableRoleExtendWithHttpInfo(param.nodeId, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Enable role extend
     * @param param the request object
     */
    public enableRoleExtend(param: WorkbenchNodeRoleApiApiEnableRoleExtendRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.enableRoleExtend(param.nodeId, param.xSpaceId, param.xSocketId,  options).toPromise();
    }

    /**
     * Scene: Collaborator Card Information
     * Get Collaborator Info
     * @param param the request object
     */
    public getCollaboratorInfoWithHttpInfo(param: WorkbenchNodeRoleApiApiGetCollaboratorInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataNodeCollaboratorVO>> {
        return this.api.getCollaboratorInfoWithHttpInfo(param.uuid, param.nodeId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Scene: Collaborator Card Information
     * Get Collaborator Info
     * @param param the request object
     */
    public getCollaboratorInfo(param: WorkbenchNodeRoleApiApiGetCollaboratorInfoRequest, options?: Configuration): Promise<ResponseDataNodeCollaboratorVO> {
        return this.api.getCollaboratorInfo(param.uuid, param.nodeId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page Query the Node\' Collaborator
     * @param param the request object
     */
    public getCollaboratorPageWithHttpInfo(param: WorkbenchNodeRoleApiApiGetCollaboratorPageRequest, options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoNodeRoleMemberVo>> {
        return this.api.getCollaboratorPageWithHttpInfo(param.nodeId, param.page, param.xSpaceId, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page Query the Node\' Collaborator
     * @param param the request object
     */
    public getCollaboratorPage(param: WorkbenchNodeRoleApiApiGetCollaboratorPageRequest, options?: Configuration): Promise<ResponseDataPageInfoNodeRoleMemberVo> {
        return this.api.getCollaboratorPage(param.nodeId, param.page, param.xSpaceId, param.pageObjectParams,  options).toPromise();
    }

    /**
     * Get node roles
     * @param param the request object
     */
    public listRole1WithHttpInfo(param: WorkbenchNodeRoleApiApiListRole1Request, options?: Configuration): Promise<HttpInfo<ResponseDataNodeCollaboratorsVo>> {
        return this.api.listRole1WithHttpInfo(param.nodeId, param.xSpaceId, param.includeAdmin, param.includeSelf, param.includeExtend,  options).toPromise();
    }

    /**
     * Get node roles
     * @param param the request object
     */
    public listRole1(param: WorkbenchNodeRoleApiApiListRole1Request, options?: Configuration): Promise<ResponseDataNodeCollaboratorsVo> {
        return this.api.listRole1(param.nodeId, param.xSpaceId, param.includeAdmin, param.includeSelf, param.includeExtend,  options).toPromise();
    }

}

import { ObservableWorkbenchNodeRubbishApiApi } from "./ObservableAPI";
import { WorkbenchNodeRubbishApiApiRequestFactory, WorkbenchNodeRubbishApiApiResponseProcessor} from "../apis/WorkbenchNodeRubbishApiApi";

export interface WorkbenchNodeRubbishApiApiDelete6Request {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeRubbishApiApidelete6
     */
    nodeId: string
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRubbishApiApidelete6
     */
    xSpaceId: string
}

export interface WorkbenchNodeRubbishApiApiDelete7Request {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeRubbishApiApidelete7
     */
    nodeId: string
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRubbishApiApidelete7
     */
    xSpaceId: string
}

export interface WorkbenchNodeRubbishApiApiList5Request {
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRubbishApiApilist5
     */
    xSpaceId: string
    /**
     * expected load quantity（May be because the total number or permissions are not enough）
     * @type number
     * @memberof WorkbenchNodeRubbishApiApilist5
     */
    size?: number
    /**
     * whether to request an overrun node（default FALSE）
     * @type boolean
     * @memberof WorkbenchNodeRubbishApiApilist5
     */
    isOverLimit?: boolean
    /**
     * id of the last node in the loaded list
     * @type string
     * @memberof WorkbenchNodeRubbishApiApilist5
     */
    lastNodeId?: string
}

export interface WorkbenchNodeRubbishApiApiRecoverRequest {
    /**
     *
     * @type NodeRecoverRo
     * @memberof WorkbenchNodeRubbishApiApirecover
     */
    nodeRecoverRo: NodeRecoverRo
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRubbishApiApirecover
     */
    xSpaceId: string
}

export class ObjectWorkbenchNodeRubbishApiApi {
    private api: ObservableWorkbenchNodeRubbishApiApi

    public constructor(configuration: Configuration, requestFactory?: WorkbenchNodeRubbishApiApiRequestFactory, responseProcessor?: WorkbenchNodeRubbishApiApiResponseProcessor) {
        this.api = new ObservableWorkbenchNodeRubbishApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete node in rubbish
     * @param param the request object
     */
    public delete6WithHttpInfo(param: WorkbenchNodeRubbishApiApiDelete6Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete6WithHttpInfo(param.nodeId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete node in rubbish
     * @param param the request object
     */
    public delete6(param: WorkbenchNodeRubbishApiApiDelete6Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete6(param.nodeId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete node in rubbish
     * @param param the request object
     */
    public delete7WithHttpInfo(param: WorkbenchNodeRubbishApiApiDelete7Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete7WithHttpInfo(param.nodeId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete node in rubbish
     * @param param the request object
     */
    public delete7(param: WorkbenchNodeRubbishApiApiDelete7Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete7(param.nodeId, param.xSpaceId,  options).toPromise();
    }

    /**
     * If the last node id is passed in, the service status code 422 is returned.It means that the node is no longer in the recovery compartment, the positioning fails, and the last node can be requested again.
     * Get node in rubbish
     * @param param the request object
     */
    public list5WithHttpInfo(param: WorkbenchNodeRubbishApiApiList5Request, options?: Configuration): Promise<HttpInfo<ResponseDataListRubbishNodeVo>> {
        return this.api.list5WithHttpInfo(param.xSpaceId, param.size, param.isOverLimit, param.lastNodeId,  options).toPromise();
    }

    /**
     * If the last node id is passed in, the service status code 422 is returned.It means that the node is no longer in the recovery compartment, the positioning fails, and the last node can be requested again.
     * Get node in rubbish
     * @param param the request object
     */
    public list5(param: WorkbenchNodeRubbishApiApiList5Request, options?: Configuration): Promise<ResponseDataListRubbishNodeVo> {
        return this.api.list5(param.xSpaceId, param.size, param.isOverLimit, param.lastNodeId,  options).toPromise();
    }

    /**
     * Recover node
     * @param param the request object
     */
    public recoverWithHttpInfo(param: WorkbenchNodeRubbishApiApiRecoverRequest, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        return this.api.recoverWithHttpInfo(param.nodeRecoverRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Recover node
     * @param param the request object
     */
    public recover(param: WorkbenchNodeRubbishApiApiRecoverRequest, options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        return this.api.recover(param.nodeRecoverRo, param.xSpaceId,  options).toPromise();
    }

}

import { ObservableWorkbenchNodeShareApiApi } from "./ObservableAPI";
import { WorkbenchNodeShareApiApiRequestFactory, WorkbenchNodeShareApiApiResponseProcessor} from "../apis/WorkbenchNodeShareApiApi";
import { ModelString } from '../models/ModelString';

export interface WorkbenchNodeShareApiApiDisableShareRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeShareApiApidisableShare
     */
    nodeId: string
}

export interface WorkbenchNodeShareApiApiNodeShareInfoRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeShareApiApinodeShareInfo
     */
    nodeId: string
}

export interface WorkbenchNodeShareApiApiReadShareInfoRequest {
    /**
     * share id
     * @type string
     * @memberof WorkbenchNodeShareApiApireadShareInfo
     */
    shareId: string
}

export interface WorkbenchNodeShareApiApiStoreShareDataRequest {
    /**
     *
     * @type StoreShareNodeRo
     * @memberof WorkbenchNodeShareApiApistoreShareData
     */
    storeShareNodeRo: StoreShareNodeRo
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeShareApiApistoreShareData
     */
    xSocketId?: string
}

export interface WorkbenchNodeShareApiApiUpdateNodeShareRequest {
    /**
     *
     * @type UpdateNodeShareSettingRo
     * @memberof WorkbenchNodeShareApiApiupdateNodeShare
     */
    updateNodeShareSettingRo: UpdateNodeShareSettingRo
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeShareApiApiupdateNodeShare
     */
    nodeId: string
}

export class ObjectWorkbenchNodeShareApiApi {
    private api: ObservableWorkbenchNodeShareApiApi

    public constructor(configuration: Configuration, requestFactory?: WorkbenchNodeShareApiApiRequestFactory, responseProcessor?: WorkbenchNodeShareApiApiResponseProcessor) {
        this.api = new ObservableWorkbenchNodeShareApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Disable node sharing
     * @param param the request object
     */
    public disableShareWithHttpInfo(param: WorkbenchNodeShareApiApiDisableShareRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.disableShareWithHttpInfo(param.nodeId,  options).toPromise();
    }

    /**
     * Disable node sharing
     * @param param the request object
     */
    public disableShare(param: WorkbenchNodeShareApiApiDisableShareRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.disableShare(param.nodeId,  options).toPromise();
    }

    /**
     * Get node share info
     * @param param the request object
     */
    public nodeShareInfoWithHttpInfo(param: WorkbenchNodeShareApiApiNodeShareInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataNodeShareSettingInfoVO>> {
        return this.api.nodeShareInfoWithHttpInfo(param.nodeId,  options).toPromise();
    }

    /**
     * Get node share info
     * @param param the request object
     */
    public nodeShareInfo(param: WorkbenchNodeShareApiApiNodeShareInfoRequest, options?: Configuration): Promise<ResponseDataNodeShareSettingInfoVO> {
        return this.api.nodeShareInfo(param.nodeId,  options).toPromise();
    }

    /**
     * get shared content according to share id
     * Get share node info
     * @param param the request object
     */
    public readShareInfoWithHttpInfo(param: WorkbenchNodeShareApiApiReadShareInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataNodeShareInfoVO>> {
        return this.api.readShareInfoWithHttpInfo(param.shareId,  options).toPromise();
    }

    /**
     * get shared content according to share id
     * Get share node info
     * @param param the request object
     */
    public readShareInfo(param: WorkbenchNodeShareApiApiReadShareInfoRequest, options?: Configuration): Promise<ResponseDataNodeShareInfoVO> {
        return this.api.readShareInfo(param.shareId,  options).toPromise();
    }

    /**
     * Sotre share data
     * @param param the request object
     */
    public storeShareDataWithHttpInfo(param: WorkbenchNodeShareApiApiStoreShareDataRequest, options?: Configuration): Promise<HttpInfo<ResponseDataStoreNodeInfoVO>> {
        return this.api.storeShareDataWithHttpInfo(param.storeShareNodeRo, param.xSocketId,  options).toPromise();
    }

    /**
     * Sotre share data
     * @param param the request object
     */
    public storeShareData(param: WorkbenchNodeShareApiApiStoreShareDataRequest, options?: Configuration): Promise<ResponseDataStoreNodeInfoVO> {
        return this.api.storeShareData(param.storeShareNodeRo, param.xSocketId,  options).toPromise();
    }

    /**
     * Update node share setting  stringObjectParams share setting parameter description: <br/> There are three option parameters for sharing settings. Only one can be set true, and more than two cannot be set to true at the same time.<br/>onlyRead: Bool, whether to set sharing only for others to view.<br/>canBeEdited: Bool, whether to set up sharing to others for collaborative editing.<br/>canBeStored: Bool, whether to set up sharing to others and save as a copy.<br/>Example: Set <Share Only for Others to View>, parameters:{\"onlyRead\": true}
     * Update node share setting
     * @param param the request object
     */
    public updateNodeShareWithHttpInfo(param: WorkbenchNodeShareApiApiUpdateNodeShareRequest, options?: Configuration): Promise<HttpInfo<ResponseDataShareBaseInfoVo>> {
        return this.api.updateNodeShareWithHttpInfo(param.updateNodeShareSettingRo, param.nodeId,  options).toPromise();
    }

    /**
     * Update node share setting  stringObjectParams share setting parameter description: <br/> There are three option parameters for sharing settings. Only one can be set true, and more than two cannot be set to true at the same time.<br/>onlyRead: Bool, whether to set sharing only for others to view.<br/>canBeEdited: Bool, whether to set up sharing to others for collaborative editing.<br/>canBeStored: Bool, whether to set up sharing to others and save as a copy.<br/>Example: Set <Share Only for Others to View>, parameters:{\"onlyRead\": true}
     * Update node share setting
     * @param param the request object
     */
    public updateNodeShare(param: WorkbenchNodeShareApiApiUpdateNodeShareRequest, options?: Configuration): Promise<ResponseDataShareBaseInfoVo> {
        return this.api.updateNodeShare(param.updateNodeShareSettingRo, param.nodeId,  options).toPromise();
    }

}
