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
import { ResponseDataLoginResultVO } from '../models/ResponseDataLoginResultVO';
import { ResponseDataLoginResultVo } from '../models/ResponseDataLoginResultVO';
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
import { ObservableAIApi } from './ObservableAPI';

import { AIApiRequestFactory, AIApiResponseProcessor} from "../apis/AIApi";

type ModelString = string;
export class PromiseAIApi {
    private api: ObservableAIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AIApiRequestFactory,
        responseProcessor?: AIApiResponseProcessor
    ) {
        this.api = new ObservableAIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Feedback
     * Create Feedback
     * @param feedbackCreateParam
     * @param aiId
     */
    public createFeedback1WithHttpInfo(feedbackCreateParam: FeedbackCreateParam, aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataFeedback>> {
        const result = this.api.createFeedback1WithHttpInfo(feedbackCreateParam, aiId, _options);
        return result.toPromise();
    }

    /**
     * Create Feedback
     * Create Feedback
     * @param feedbackCreateParam
     * @param aiId
     */
    public createFeedback1(feedbackCreateParam: FeedbackCreateParam, aiId: string, _options?: Configuration): Promise<ResponseDataFeedback> {
        const result = this.api.createFeedback1(feedbackCreateParam, aiId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Conversation Feedback
     * Retrieve Conversation Feedback
     * @param aiId
     * @param conversationId
     */
    public getConversationFeedback1WithHttpInfo(aiId: string, conversationId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataFeedbackVO>> {
        const result = this.api.getConversationFeedback1WithHttpInfo(aiId, conversationId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Conversation Feedback
     * Retrieve Conversation Feedback
     * @param aiId
     * @param conversationId
     */
    public getConversationFeedback1(aiId: string, conversationId: string, _options?: Configuration): Promise<ResponseDataFeedbackVO> {
        const result = this.api.getConversationFeedback1(aiId, conversationId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Credit Usage
     * @param aiId
     */
    public getCreditUsageWithHttpInfo(aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataMessageCreditUsageVO>> {
        const result = this.api.getCreditUsageWithHttpInfo(aiId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Credit Usage
     * @param aiId
     */
    public getCreditUsage(aiId: string, _options?: Configuration): Promise<ResponseDataMessageCreditUsageVO> {
        const result = this.api.getCreditUsage(aiId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Latest Training Status
     * @param aiId
     */
    public getLastTrainingStatus1WithHttpInfo(aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataTrainingStatusVO>> {
        const result = this.api.getLastTrainingStatus1WithHttpInfo(aiId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Latest Training Status
     * @param aiId
     */
    public getLastTrainingStatus1(aiId: string, _options?: Configuration): Promise<ResponseDataTrainingStatusVO> {
        const result = this.api.getLastTrainingStatus1(aiId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Conversation Message
     * Retrieve Conversation Message
     * @param aiId
     * @param trainingId
     * @param conversationId
     * @param cursor
     * @param limit
     */
    public getMessagePagination1WithHttpInfo(aiId: string, trainingId?: string, conversationId?: string, cursor?: string, limit?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataPaginationMessage>> {
        const result = this.api.getMessagePagination1WithHttpInfo(aiId, trainingId, conversationId, cursor, limit, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Conversation Message
     * Retrieve Conversation Message
     * @param aiId
     * @param trainingId
     * @param conversationId
     * @param cursor
     * @param limit
     */
    public getMessagePagination1(aiId: string, trainingId?: string, conversationId?: string, cursor?: string, limit?: number, _options?: Configuration): Promise<ResponseDataPaginationMessage> {
        const result = this.api.getMessagePagination1(aiId, trainingId, conversationId, cursor, limit, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Feedback Pagination
     * Retrieve Feedback Pagination
     * @param aiId
     * @param pageNum
     * @param pageSize
     * @param state
     * @param search
     */
    public getMessagesFeedback1WithHttpInfo(aiId: string, pageNum?: number, pageSize?: number, state?: number, search?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataFeedbackPagination>> {
        const result = this.api.getMessagesFeedback1WithHttpInfo(aiId, pageNum, pageSize, state, search, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Feedback Pagination
     * Retrieve Feedback Pagination
     * @param aiId
     * @param pageNum
     * @param pageSize
     * @param state
     * @param search
     */
    public getMessagesFeedback1(aiId: string, pageNum?: number, pageSize?: number, state?: number, search?: string, _options?: Configuration): Promise<ResponseDataFeedbackPagination> {
        const result = this.api.getMessagesFeedback1(aiId, pageNum, pageSize, state, search, _options);
        return result.toPromise();
    }

    /**
     * Get Suggestions
     * Get Suggestions
     * @param suggestionParams
     * @param aiId
     */
    public getSuggestions1WithHttpInfo(suggestionParams: SuggestionParams, aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataSuggestionVO>> {
        const result = this.api.getSuggestions1WithHttpInfo(suggestionParams, aiId, _options);
        return result.toPromise();
    }

    /**
     * Get Suggestions
     * Get Suggestions
     * @param suggestionParams
     * @param aiId
     */
    public getSuggestions1(suggestionParams: SuggestionParams, aiId: string, _options?: Configuration): Promise<ResponseDataSuggestionVO> {
        const result = this.api.getSuggestions1(suggestionParams, aiId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve AI Info by ai id
     * Retrieve AI Info
     * @param aiId
     */
    public retrieve1WithHttpInfo(aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataAiInfoVO>> {
        const result = this.api.retrieve1WithHttpInfo(aiId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve AI Info by ai id
     * Retrieve AI Info
     * @param aiId
     */
    public retrieve1(aiId: string, _options?: Configuration): Promise<ResponseDataAiInfoVO> {
        const result = this.api.retrieve1(aiId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve AI Setting by ai id
     * Retrieve AI Setting
     * @param aiId
     * @param type
     */
    public retrieveSettingWithHttpInfo(aiId: string, type?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPureJson>> {
        const result = this.api.retrieveSettingWithHttpInfo(aiId, type, _options);
        return result.toPromise();
    }

    /**
     * Retrieve AI Setting by ai id
     * Retrieve AI Setting
     * @param aiId
     * @param type
     */
    public retrieveSetting(aiId: string, type?: string, _options?: Configuration): Promise<ResponseDataPureJson> {
        const result = this.api.retrieveSetting(aiId, type, _options);
        return result.toPromise();
    }

    /**
     * Retrieve AI training list by ai id
     * Retrieve AI Training List
     * @param aiId
     */
    public retrieveTrainingsWithHttpInfo(aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListTrainingInfoVO>> {
        const result = this.api.retrieveTrainingsWithHttpInfo(aiId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve AI training list by ai id
     * Retrieve AI Training List
     * @param aiId
     */
    public retrieveTrainings(aiId: string, _options?: Configuration): Promise<ResponseDataListTrainingInfoVO> {
        const result = this.api.retrieveTrainings(aiId, _options);
        return result.toPromise();
    }

    /**
     * Send Message
     * Send Message
     * @param sendMessageParam
     * @param aiId
     */
    public sendMessage1WithHttpInfo(sendMessageParam: SendMessageParam, aiId: string, _options?: Configuration): Promise<HttpInfo<Array<any>>> {
        const result = this.api.sendMessage1WithHttpInfo(sendMessageParam, aiId, _options);
        return result.toPromise();
    }

    /**
     * Send Message
     * Send Message
     * @param sendMessageParam
     * @param aiId
     */
    public sendMessage1(sendMessageParam: SendMessageParam, aiId: string, _options?: Configuration): Promise<Array<any>> {
        const result = this.api.sendMessage1(sendMessageParam, aiId, _options);
        return result.toPromise();
    }

    /**
     * Train
     * Train
     * @param aiId
     */
    public train1WithHttpInfo(aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.train1WithHttpInfo(aiId, _options);
        return result.toPromise();
    }

    /**
     * Train
     * Train
     * @param aiId
     */
    public train1(aiId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.train1(aiId, _options);
        return result.toPromise();
    }

    /**
     * Train Predict
     * Train Predict
     * @param trainingPredictParams
     * @param aiId
     */
    public trainPredict1WithHttpInfo(trainingPredictParams: TrainingPredictParams, aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataTrainingPredictResult>> {
        const result = this.api.trainPredict1WithHttpInfo(trainingPredictParams, aiId, _options);
        return result.toPromise();
    }

    /**
     * Train Predict
     * Train Predict
     * @param trainingPredictParams
     * @param aiId
     */
    public trainPredict1(trainingPredictParams: TrainingPredictParams, aiId: string, _options?: Configuration): Promise<ResponseDataTrainingPredictResult> {
        const result = this.api.trainPredict1(trainingPredictParams, aiId, _options);
        return result.toPromise();
    }

    /**
     * Update AI Info
     * Update AI Info
     * @param aiUpdateParams
     * @param aiId
     */
    public update1WithHttpInfo(aiUpdateParams: AiUpdateParams, aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataAiInfoVO>> {
        const result = this.api.update1WithHttpInfo(aiUpdateParams, aiId, _options);
        return result.toPromise();
    }

    /**
     * Update AI Info
     * Update AI Info
     * @param aiUpdateParams
     * @param aiId
     */
    public update1(aiUpdateParams: AiUpdateParams, aiId: string, _options?: Configuration): Promise<ResponseDataAiInfoVO> {
        const result = this.api.update1(aiUpdateParams, aiId, _options);
        return result.toPromise();
    }

    /**
     * Update Feedback
     * Update Feedback
     * @param feedbackUpdateParam
     * @param aiId
     * @param feedbackId
     */
    public updateFeedback1WithHttpInfo(feedbackUpdateParam: FeedbackUpdateParam, aiId: string, feedbackId: number, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateFeedback1WithHttpInfo(feedbackUpdateParam, aiId, feedbackId, _options);
        return result.toPromise();
    }

    /**
     * Update Feedback
     * Update Feedback
     * @param feedbackUpdateParam
     * @param aiId
     * @param feedbackId
     */
    public updateFeedback1(feedbackUpdateParam: FeedbackUpdateParam, aiId: string, feedbackId: number, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateFeedback1(feedbackUpdateParam, aiId, feedbackId, _options);
        return result.toPromise();
    }


}



import { ObservableAccountCenterModuleUserManagementInterfaceApi } from './ObservableAPI';

import { AccountCenterModuleUserManagementInterfaceApiRequestFactory, AccountCenterModuleUserManagementInterfaceApiResponseProcessor} from "../apis/AccountCenterModuleUserManagementInterfaceApi";
export class PromiseAccountCenterModuleUserManagementInterfaceApi {
    private api: ObservableAccountCenterModuleUserManagementInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AccountCenterModuleUserManagementInterfaceApiRequestFactory,
        responseProcessor?: AccountCenterModuleUserManagementInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableAccountCenterModuleUserManagementInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Registered login user applies for account cancellation
     * Apply for cancellation of user account
     */
    public applyForClosingWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.applyForClosingWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Registered login user applies for account cancellation
     * Apply for cancellation of user account
     */
    public applyForClosing(_options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.applyForClosing(_options);
        return result.toPromise();
    }

    /**
     * Bind mail and modify mail
     * Bind mail
     * @param emailCodeValidateRo
     */
    public bindEmailWithHttpInfo(emailCodeValidateRo: EmailCodeValidateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.bindEmailWithHttpInfo(emailCodeValidateRo, _options);
        return result.toPromise();
    }

    /**
     * Bind mail and modify mail
     * Bind mail
     * @param emailCodeValidateRo
     */
    public bindEmail(emailCodeValidateRo: EmailCodeValidateRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.bindEmail(emailCodeValidateRo, _options);
        return result.toPromise();
    }

    /**
     * User recovery account has been applied for cancellation
     * Apply for account restoration
     */
    public cancelClosingWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.cancelClosingWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * User recovery account has been applied for cancellation
     * Apply for account restoration
     */
    public cancelClosing(_options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.cancelClosing(_options);
        return result.toPromise();
    }

    /**
     * Unregistered users verify whether the account meets the cancellation conditions
     * Verify whether the account can be cancelled
     */
    public checkForClosingWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.checkForClosingWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Unregistered users verify whether the account meets the cancellation conditions
     * Verify whether the account can be cancelled
     */
    public checkForClosing(_options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.checkForClosing(_options);
        return result.toPromise();
    }

    /**
     * Delete Active Space Cache
     */
    public delActiveSpaceCacheWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delActiveSpaceCacheWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Delete Active Space Cache
     */
    public delActiveSpaceCache(_options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delActiveSpaceCache(_options);
        return result.toPromise();
    }

    /**
     * Get the enabled experimental functions
     * @param spaceId
     */
    public getEnabledLabFeaturesWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataLabsFeatureVo>> {
        const result = this.api.getEnabledLabFeaturesWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Get the enabled experimental functions
     * @param spaceId
     */
    public getEnabledLabFeatures(spaceId: string, _options?: Configuration): Promise<ResponseDataLabsFeatureVo> {
        const result = this.api.getEnabledLabFeatures(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Users can only associate with invited mail when they have no other mail
     * Associate the invited mail
     * @param userLinkEmailRo
     */
    public linkInviteEmailWithHttpInfo(userLinkEmailRo: UserLinkEmailRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.linkInviteEmailWithHttpInfo(userLinkEmailRo, _options);
        return result.toPromise();
    }

    /**
     * Users can only associate with invited mail when they have no other mail
     * Associate the invited mail
     * @param userLinkEmailRo
     */
    public linkInviteEmail(userLinkEmailRo: UserLinkEmailRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.linkInviteEmail(userLinkEmailRo, _options);
        return result.toPromise();
    }

    /**
     * reset password router
     */
    public resetPasswordWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.resetPasswordWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * reset password router
     */
    public resetPassword(_options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.resetPassword(_options);
        return result.toPromise();
    }

    /**
     * Retrieve password
     * @param retrievePwdOpRo
     */
    public retrievePwdWithHttpInfo(retrievePwdOpRo: RetrievePwdOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.retrievePwdWithHttpInfo(retrievePwdOpRo, _options);
        return result.toPromise();
    }

    /**
     * Retrieve password
     * @param retrievePwdOpRo
     */
    public retrievePwd(retrievePwdOpRo: RetrievePwdOpRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.retrievePwd(retrievePwdOpRo, _options);
        return result.toPromise();
    }

    /**
     * Bind mail and modify mail
     * Unbind mail
     * @param codeValidateRo
     */
    public unbindEmailWithHttpInfo(codeValidateRo: CodeValidateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.unbindEmailWithHttpInfo(codeValidateRo, _options);
        return result.toPromise();
    }

    /**
     * Bind mail and modify mail
     * Unbind mail
     * @param codeValidateRo
     */
    public unbindEmail(codeValidateRo: CodeValidateRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.unbindEmail(codeValidateRo, _options);
        return result.toPromise();
    }

    /**
     * Unbind mobile phone
     * @param codeValidateRo
     */
    public unbindPhoneWithHttpInfo(codeValidateRo: CodeValidateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.unbindPhoneWithHttpInfo(codeValidateRo, _options);
        return result.toPromise();
    }

    /**
     * Unbind mobile phone
     * @param codeValidateRo
     */
    public unbindPhone(codeValidateRo: CodeValidateRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.unbindPhone(codeValidateRo, _options);
        return result.toPromise();
    }

    /**
     * Request parameters cannot be all empty
     * Edit user information
     * @param userOpRo
     */
    public update2WithHttpInfo(userOpRo: UserOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.update2WithHttpInfo(userOpRo, _options);
        return result.toPromise();
    }

    /**
     * Request parameters cannot be all empty
     * Edit user information
     * @param userOpRo
     */
    public update2(userOpRo: UserOpRo, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.update2(userOpRo, _options);
        return result.toPromise();
    }

    /**
     * Update the usage status of laboratory functions
     * Update the usage status of laboratory functions
     * @param userLabsFeatureRo
     */
    public updateLabsFeatureStatusWithHttpInfo(userLabsFeatureRo: UserLabsFeatureRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateLabsFeatureStatusWithHttpInfo(userLabsFeatureRo, _options);
        return result.toPromise();
    }

    /**
     * Update the usage status of laboratory functions
     * Update the usage status of laboratory functions
     * @param userLabsFeatureRo
     */
    public updateLabsFeatureStatus(userLabsFeatureRo: UserLabsFeatureRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateLabsFeatureStatus(userLabsFeatureRo, _options);
        return result.toPromise();
    }

    /**
     * Scene: 1. Personal setting and password modification; 2. Initialize after login for accounts without password
     * Change Password
     * @param updatePwdOpRo
     */
    public updatePwdWithHttpInfo(updatePwdOpRo: UpdatePwdOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updatePwdWithHttpInfo(updatePwdOpRo, _options);
        return result.toPromise();
    }

    /**
     * Scene: 1. Personal setting and password modification; 2. Initialize after login for accounts without password
     * Change Password
     * @param updatePwdOpRo
     */
    public updatePwd(updatePwdOpRo: UpdatePwdOpRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updatePwd(updatePwdOpRo, _options);
        return result.toPromise();
    }

    /**
     * get personal information
     * @param spaceId space id
     * @param nodeId node id
     * @param filter whether to filter space related information
     */
    public userInfoWithHttpInfo(spaceId?: string, nodeId?: string, filter?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataUserInfoVo>> {
        const result = this.api.userInfoWithHttpInfo(spaceId, nodeId, filter, _options);
        return result.toPromise();
    }

    /**
     * get personal information
     * @param spaceId space id
     * @param nodeId node id
     * @param filter whether to filter space related information
     */
    public userInfo(spaceId?: string, nodeId?: string, filter?: boolean, _options?: Configuration): Promise<ResponseDataUserInfoVo> {
        const result = this.api.userInfo(spaceId, nodeId, filter, _options);
        return result.toPromise();
    }

    /**
     * Query whether users bind mail
     * Query whether users bind mail
     */
    public validBindEmailWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        const result = this.api.validBindEmailWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Query whether users bind mail
     * Query whether users bind mail
     */
    public validBindEmail(_options?: Configuration): Promise<ResponseDataBoolean> {
        const result = this.api.validBindEmail(_options);
        return result.toPromise();
    }

    /**
     * Query whether the user is consistent with the specified mail. It can only be determined if the user has bound the mail
     * Query whether the user is consistent with the specified mail
     * @param checkUserEmailRo
     */
    public validSameEmailWithHttpInfo(checkUserEmailRo: CheckUserEmailRo, _options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        const result = this.api.validSameEmailWithHttpInfo(checkUserEmailRo, _options);
        return result.toPromise();
    }

    /**
     * Query whether the user is consistent with the specified mail. It can only be determined if the user has bound the mail
     * Query whether the user is consistent with the specified mail
     * @param checkUserEmailRo
     */
    public validSameEmail(checkUserEmailRo: CheckUserEmailRo, _options?: Configuration): Promise<ResponseDataBoolean> {
        const result = this.api.validSameEmail(checkUserEmailRo, _options);
        return result.toPromise();
    }

    /**
     * Bind a new phone
     * Bind a new phone
     * @param smsCodeValidateRo
     */
    public verifyPhoneWithHttpInfo(smsCodeValidateRo: SmsCodeValidateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.verifyPhoneWithHttpInfo(smsCodeValidateRo, _options);
        return result.toPromise();
    }

    /**
     * Bind a new phone
     * Bind a new phone
     * @param smsCodeValidateRo
     */
    public verifyPhone(smsCodeValidateRo: SmsCodeValidateRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.verifyPhone(smsCodeValidateRo, _options);
        return result.toPromise();
    }


}



import { ObservableAccountLinkManagementInterfaceApi } from './ObservableAPI';

import { AccountLinkManagementInterfaceApiRequestFactory, AccountLinkManagementInterfaceApiResponseProcessor} from "../apis/AccountLinkManagementInterfaceApi";
export class PromiseAccountLinkManagementInterfaceApi {
    private api: ObservableAccountLinkManagementInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AccountLinkManagementInterfaceApiRequestFactory,
        responseProcessor?: AccountLinkManagementInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableAccountLinkManagementInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Associated DingTalk
     * Associated DingTalk
     * @param dingTalkBindOpRo
     */
    public bindDingTalkWithHttpInfo(dingTalkBindOpRo: DingTalkBindOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.bindDingTalkWithHttpInfo(dingTalkBindOpRo, _options);
        return result.toPromise();
    }

    /**
     * Associated DingTalk
     * Associated DingTalk
     * @param dingTalkBindOpRo
     */
    public bindDingTalk(dingTalkBindOpRo: DingTalkBindOpRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.bindDingTalk(dingTalkBindOpRo, _options);
        return result.toPromise();
    }

    /**
     * Unbind the third-party account
     * @param userLinkOpRo
     */
    public unbindWithHttpInfo(userLinkOpRo: UserLinkOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.unbindWithHttpInfo(userLinkOpRo, _options);
        return result.toPromise();
    }

    /**
     * Unbind the third-party account
     * @param userLinkOpRo
     */
    public unbind(userLinkOpRo: UserLinkOpRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.unbind(userLinkOpRo, _options);
        return result.toPromise();
    }


}



import { ObservableAirAgentAIAgentResourceApi } from './ObservableAPI';

import { AirAgentAIAgentResourceApiRequestFactory, AirAgentAIAgentResourceApiResponseProcessor} from "../apis/AirAgentAIAgentResourceApi";
export class PromiseAirAgentAIAgentResourceApi {
    private api: ObservableAirAgentAIAgentResourceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AirAgentAIAgentResourceApiRequestFactory,
        responseProcessor?: AirAgentAIAgentResourceApiResponseProcessor
    ) {
        this.api = new ObservableAirAgentAIAgentResourceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create AI Agent
     * @param agentCreateRO
     */
    public create11WithHttpInfo(agentCreateRO: AgentCreateRO, _options?: Configuration): Promise<HttpInfo<ResponseDataAiInfoVO>> {
        const result = this.api.create11WithHttpInfo(agentCreateRO, _options);
        return result.toPromise();
    }

    /**
     * Create AI Agent
     * @param agentCreateRO
     */
    public create11(agentCreateRO: AgentCreateRO, _options?: Configuration): Promise<ResponseDataAiInfoVO> {
        const result = this.api.create11(agentCreateRO, _options);
        return result.toPromise();
    }

    /**
     * Create Feedback
     * Create Feedback
     * @param feedbackCreateParam
     * @param aiId
     */
    public createFeedbackWithHttpInfo(feedbackCreateParam: FeedbackCreateParam, aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataFeedback>> {
        const result = this.api.createFeedbackWithHttpInfo(feedbackCreateParam, aiId, _options);
        return result.toPromise();
    }

    /**
     * Create Feedback
     * Create Feedback
     * @param feedbackCreateParam
     * @param aiId
     */
    public createFeedback(feedbackCreateParam: FeedbackCreateParam, aiId: string, _options?: Configuration): Promise<ResponseDataFeedback> {
        const result = this.api.createFeedback(feedbackCreateParam, aiId, _options);
        return result.toPromise();
    }

    /**
     * Delete AI Agent
     * @param agentId agent id
     */
    public delete18WithHttpInfo(agentId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete18WithHttpInfo(agentId, _options);
        return result.toPromise();
    }

    /**
     * Delete AI Agent
     * @param agentId agent id
     */
    public delete18(agentId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete18(agentId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Conversation Feedback
     * Retrieve Conversation Feedback
     * @param aiId
     * @param conversationId
     */
    public getConversationFeedbackWithHttpInfo(aiId: string, conversationId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataFeedbackVO>> {
        const result = this.api.getConversationFeedbackWithHttpInfo(aiId, conversationId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Conversation Feedback
     * Retrieve Conversation Feedback
     * @param aiId
     * @param conversationId
     */
    public getConversationFeedback(aiId: string, conversationId: string, _options?: Configuration): Promise<ResponseDataFeedbackVO> {
        const result = this.api.getConversationFeedback(aiId, conversationId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Latest Training Status
     * @param aiId
     */
    public getLastTrainingStatusWithHttpInfo(aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataTrainingStatusVO>> {
        const result = this.api.getLastTrainingStatusWithHttpInfo(aiId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Latest Training Status
     * Retrieve Latest Training Status
     * @param aiId
     */
    public getLastTrainingStatus(aiId: string, _options?: Configuration): Promise<ResponseDataTrainingStatusVO> {
        const result = this.api.getLastTrainingStatus(aiId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Conversation Message
     * Retrieve Conversation Message
     * @param aiId
     * @param trainingId
     * @param conversationId
     * @param cursor
     * @param limit
     */
    public getMessagePaginationWithHttpInfo(aiId: string, trainingId?: string, conversationId?: string, cursor?: string, limit?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataPaginationMessage>> {
        const result = this.api.getMessagePaginationWithHttpInfo(aiId, trainingId, conversationId, cursor, limit, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Conversation Message
     * Retrieve Conversation Message
     * @param aiId
     * @param trainingId
     * @param conversationId
     * @param cursor
     * @param limit
     */
    public getMessagePagination(aiId: string, trainingId?: string, conversationId?: string, cursor?: string, limit?: number, _options?: Configuration): Promise<ResponseDataPaginationMessage> {
        const result = this.api.getMessagePagination(aiId, trainingId, conversationId, cursor, limit, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Feedback Pagination
     * Retrieve Feedback Pagination
     * @param aiId
     * @param pageNum
     * @param pageSize
     * @param state
     * @param search
     */
    public getMessagesFeedbackWithHttpInfo(aiId: string, pageNum?: number, pageSize?: number, state?: number, search?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataFeedbackPagination>> {
        const result = this.api.getMessagesFeedbackWithHttpInfo(aiId, pageNum, pageSize, state, search, _options);
        return result.toPromise();
    }

    /**
     * Retrieve Feedback Pagination
     * Retrieve Feedback Pagination
     * @param aiId
     * @param pageNum
     * @param pageSize
     * @param state
     * @param search
     */
    public getMessagesFeedback(aiId: string, pageNum?: number, pageSize?: number, state?: number, search?: string, _options?: Configuration): Promise<ResponseDataFeedbackPagination> {
        const result = this.api.getMessagesFeedback(aiId, pageNum, pageSize, state, search, _options);
        return result.toPromise();
    }

    /**
     * Get Suggestions
     * Get Suggestions
     * @param suggestionParams
     * @param aiId
     */
    public getSuggestionsWithHttpInfo(suggestionParams: SuggestionParams, aiId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataSuggestionVO>> {
        const result = this.api.getSuggestionsWithHttpInfo(suggestionParams, aiId, _options);
        return result.toPromise();
    }

    /**
     * Get Suggestions
     * Get Suggestions
     * @param suggestionParams
     * @param aiId
     */
    public getSuggestions(suggestionParams: SuggestionParams, aiId: string, _options?: Configuration): Promise<ResponseDataSuggestionVO> {
        const result = this.api.getSuggestions(suggestionParams, aiId, _options);
        return result.toPromise();
    }

    /**
     * Get AI Agent List
     */
    public list8WithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataListAgentVO>> {
        const result = this.api.list8WithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get AI Agent List
     */
    public list8(_options?: Configuration): Promise<ResponseDataListAgentVO> {
        const result = this.api.list8(_options);
        return result.toPromise();
    }

    /**
     * Retrieve AI Info
     * Retrieve AI Agent
     * @param agentId
     */
    public retrieveWithHttpInfo(agentId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataAiInfoVO>> {
        const result = this.api.retrieveWithHttpInfo(agentId, _options);
        return result.toPromise();
    }

    /**
     * Retrieve AI Info
     * Retrieve AI Agent
     * @param agentId
     */
    public retrieve(agentId: string, _options?: Configuration): Promise<ResponseDataAiInfoVO> {
        const result = this.api.retrieve(agentId, _options);
        return result.toPromise();
    }

    /**
     * Send Message
     * Send Message
     * @param sendMessageParam
     * @param aiId
     */
    public sendMessageWithHttpInfo(sendMessageParam: SendMessageParam, aiId: string, _options?: Configuration): Promise<HttpInfo<Array<string>>> {
        const result = this.api.sendMessageWithHttpInfo(sendMessageParam, aiId, _options);
        return result.toPromise();
    }

    /**
     * Send Message
     * Send Message
     * @param sendMessageParam
     * @param aiId
     */
    public sendMessage(sendMessageParam: SendMessageParam, aiId: string, _options?: Configuration): Promise<Array<string>> {
        const result = this.api.sendMessage(sendMessageParam, aiId, _options);
        return result.toPromise();
    }

    /**
     * Train AI Agent
     * @param agentId
     */
    public trainWithHttpInfo(agentId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.trainWithHttpInfo(agentId, _options);
        return result.toPromise();
    }

    /**
     * Train AI Agent
     * @param agentId
     */
    public train(agentId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.train(agentId, _options);
        return result.toPromise();
    }

    /**
     * Train Predict
     * Train Predict
     * @param trainingPredictParams
     * @param agentId
     */
    public trainPredictWithHttpInfo(trainingPredictParams: TrainingPredictParams, agentId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataTrainingPredictResult>> {
        const result = this.api.trainPredictWithHttpInfo(trainingPredictParams, agentId, _options);
        return result.toPromise();
    }

    /**
     * Train Predict
     * Train Predict
     * @param trainingPredictParams
     * @param agentId
     */
    public trainPredict(trainingPredictParams: TrainingPredictParams, agentId: string, _options?: Configuration): Promise<ResponseDataTrainingPredictResult> {
        const result = this.api.trainPredict(trainingPredictParams, agentId, _options);
        return result.toPromise();
    }

    /**
     * Update AI Info
     * Update AI Agent
     * @param agentUpdateParams
     * @param agentId
     */
    public updateWithHttpInfo(agentUpdateParams: AgentUpdateParams, agentId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataAiInfoVO>> {
        const result = this.api.updateWithHttpInfo(agentUpdateParams, agentId, _options);
        return result.toPromise();
    }

    /**
     * Update AI Info
     * Update AI Agent
     * @param agentUpdateParams
     * @param agentId
     */
    public update(agentUpdateParams: AgentUpdateParams, agentId: string, _options?: Configuration): Promise<ResponseDataAiInfoVO> {
        const result = this.api.update(agentUpdateParams, agentId, _options);
        return result.toPromise();
    }

    /**
     * Update Feedback
     * Update Feedback
     * @param feedbackUpdateParam
     * @param aiId
     * @param feedbackId
     */
    public updateFeedbackWithHttpInfo(feedbackUpdateParam: FeedbackUpdateParam, aiId: string, feedbackId: number, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateFeedbackWithHttpInfo(feedbackUpdateParam, aiId, feedbackId, _options);
        return result.toPromise();
    }

    /**
     * Update Feedback
     * Update Feedback
     * @param feedbackUpdateParam
     * @param aiId
     * @param feedbackId
     */
    public updateFeedback(feedbackUpdateParam: FeedbackUpdateParam, aiId: string, feedbackId: number, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateFeedback(feedbackUpdateParam, aiId, feedbackId, _options);
        return result.toPromise();
    }


}



import { ObservableAirAgentAuthResourceApi } from './ObservableAPI';

import { AirAgentAuthResourceApiRequestFactory, AirAgentAuthResourceApiResponseProcessor} from "../apis/AirAgentAuthResourceApi";
export class PromiseAirAgentAuthResourceApi {
    private api: ObservableAirAgentAuthResourceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AirAgentAuthResourceApiRequestFactory,
        responseProcessor?: AirAgentAuthResourceApiResponseProcessor
    ) {
        this.api = new ObservableAirAgentAuthResourceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param code
     * @param error
     * @param errorDescription
     */
    public callback5WithHttpInfo(code?: string, error?: string, errorDescription?: string, _options?: Configuration): Promise<HttpInfo<RedirectView>> {
        const result = this.api.callback5WithHttpInfo(code, error, errorDescription, _options);
        return result.toPromise();
    }

    /**
     * @param code
     * @param error
     * @param errorDescription
     */
    public callback5(code?: string, error?: string, errorDescription?: string, _options?: Configuration): Promise<RedirectView> {
        const result = this.api.callback5(code, error, errorDescription, _options);
        return result.toPromise();
    }

    /**
     * @param message
     */
    public login4WithHttpInfo(message?: string, _options?: Configuration): Promise<HttpInfo<RedirectView>> {
        const result = this.api.login4WithHttpInfo(message, _options);
        return result.toPromise();
    }

    /**
     * @param message
     */
    public login4(message?: string, _options?: Configuration): Promise<RedirectView> {
        const result = this.api.login4(message, _options);
        return result.toPromise();
    }

    /**
     * logout current user
     * Logout
     */
    public logout2WithHttpInfo(_options?: Configuration): Promise<HttpInfo<RedirectView>> {
        const result = this.api.logout2WithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * logout current user
     * Logout
     */
    public logout2(_options?: Configuration): Promise<RedirectView> {
        const result = this.api.logout2(_options);
        return result.toPromise();
    }

    /**
     * logout current user
     * Logout
     */
    public logout3WithHttpInfo(_options?: Configuration): Promise<HttpInfo<RedirectView>> {
        const result = this.api.logout3WithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * logout current user
     * Logout
     */
    public logout3(_options?: Configuration): Promise<RedirectView> {
        const result = this.api.logout3(_options);
        return result.toPromise();
    }


}



import { ObservableAirAgentUserResourceApi } from './ObservableAPI';

import { AirAgentUserResourceApiRequestFactory, AirAgentUserResourceApiResponseProcessor} from "../apis/AirAgentUserResourceApi";
export class PromiseAirAgentUserResourceApi {
    private api: ObservableAirAgentUserResourceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AirAgentUserResourceApiRequestFactory,
        responseProcessor?: AirAgentUserResourceApiResponseProcessor
    ) {
        this.api = new ObservableAirAgentUserResourceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get User Profile
     */
    public getUserProfileWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataUserProfile>> {
        const result = this.api.getUserProfileWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get User Profile
     */
    public getUserProfile(_options?: Configuration): Promise<ResponseDataUserProfile> {
        const result = this.api.getUserProfile(_options);
        return result.toPromise();
    }


}



import { ObservableAppStoreRelevantServiceInterfacesOfTheApplicationStoreApi } from './ObservableAPI';

import { AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiRequestFactory, AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiResponseProcessor} from "../apis/AppStoreRelevantServiceInterfacesOfTheApplicationStoreApi";
export class PromiseAppStoreRelevantServiceInterfacesOfTheApplicationStoreApi {
    private api: ObservableAppStoreRelevantServiceInterfacesOfTheApplicationStoreApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiRequestFactory,
        responseProcessor?: AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiResponseProcessor
    ) {
        this.api = new ObservableAppStoreRelevantServiceInterfacesOfTheApplicationStoreApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Pagination query. If no query parameter is transferred, the default query will be used
     * Query application list
     * @param pageIndex Page Index
     * @param pageSize Quantity per page
     * @param orderBy Sort field
     * @param sortBy Collation,asc&#x3D;positive sequence,desc&#x3D;reverse order
     */
    public fetchAppStoreAppsWithHttpInfo(pageIndex?: string, pageSize?: string, orderBy?: string, sortBy?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoAppInfo>> {
        const result = this.api.fetchAppStoreAppsWithHttpInfo(pageIndex, pageSize, orderBy, sortBy, _options);
        return result.toPromise();
    }

    /**
     * Pagination query. If no query parameter is transferred, the default query will be used
     * Query application list
     * @param pageIndex Page Index
     * @param pageSize Quantity per page
     * @param orderBy Sort field
     * @param sortBy Collation,asc&#x3D;positive sequence,desc&#x3D;reverse order
     */
    public fetchAppStoreApps(pageIndex?: string, pageSize?: string, orderBy?: string, sortBy?: string, _options?: Configuration): Promise<ResponseDataPageInfoAppInfo> {
        const result = this.api.fetchAppStoreApps(pageIndex, pageSize, orderBy, sortBy, _options);
        return result.toPromise();
    }


}



import { ObservableApplicationManagementApplicationManagementRelatedServiceInterfaceApi } from './ObservableAPI';

import { ApplicationManagementApplicationManagementRelatedServiceInterfaceApiRequestFactory, ApplicationManagementApplicationManagementRelatedServiceInterfaceApiResponseProcessor} from "../apis/ApplicationManagementApplicationManagementRelatedServiceInterfaceApi";
export class PromiseApplicationManagementApplicationManagementRelatedServiceInterfaceApi {
    private api: ObservableApplicationManagementApplicationManagementRelatedServiceInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiRequestFactory,
        responseProcessor?: ApplicationManagementApplicationManagementRelatedServiceInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableApplicationManagementApplicationManagementRelatedServiceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Opening an application instance
     * Create an application instance
     * @param createAppInstance
     */
    public createAppInstanceWithHttpInfo(createAppInstance: CreateAppInstance, _options?: Configuration): Promise<HttpInfo<ResponseDataAppInstance>> {
        const result = this.api.createAppInstanceWithHttpInfo(createAppInstance, _options);
        return result.toPromise();
    }

    /**
     * Opening an application instance
     * Create an application instance
     * @param createAppInstance
     */
    public createAppInstance(createAppInstance: CreateAppInstance, _options?: Configuration): Promise<ResponseDataAppInstance> {
        const result = this.api.createAppInstance(createAppInstance, _options);
        return result.toPromise();
    }

    /**
     * The space actively deletes applications
     * Delete app
     * @param appInstanceId Application instance ID
     */
    public delete17WithHttpInfo(appInstanceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete17WithHttpInfo(appInstanceId, _options);
        return result.toPromise();
    }

    /**
     * The space actively deletes applications
     * Delete app
     * @param appInstanceId Application instance ID
     */
    public delete17(appInstanceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete17(appInstanceId, _options);
        return result.toPromise();
    }

    /**
     * At present, the interface is full query, and the paging query function will be provided later, so you don\'t need to pass paging parameters
     * Query the application instance list
     * @param spaceId Space ID
     * @param pageIndex Page Index
     * @param pageSize Quantity per page
     * @param orderBy Sort field
     * @param sortBy Collation,asc&#x3D;positive sequence,desc&#x3D;Reverse order
     */
    public fetchAppInstancesWithHttpInfo(spaceId: string, pageIndex?: string, pageSize?: string, orderBy?: string, sortBy?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoAppInstance>> {
        const result = this.api.fetchAppInstancesWithHttpInfo(spaceId, pageIndex, pageSize, orderBy, sortBy, _options);
        return result.toPromise();
    }

    /**
     * At present, the interface is full query, and the paging query function will be provided later, so you don\'t need to pass paging parameters
     * Query the application instance list
     * @param spaceId Space ID
     * @param pageIndex Page Index
     * @param pageSize Quantity per page
     * @param orderBy Sort field
     * @param sortBy Collation,asc&#x3D;positive sequence,desc&#x3D;Reverse order
     */
    public fetchAppInstances(spaceId: string, pageIndex?: string, pageSize?: string, orderBy?: string, sortBy?: string, _options?: Configuration): Promise<ResponseDataPageInfoAppInstance> {
        const result = this.api.fetchAppInstances(spaceId, pageIndex, pageSize, orderBy, sortBy, _options);
        return result.toPromise();
    }

    /**
     * Get the configuration according to the application instance ID
     * Get the configuration of a single application instance
     * @param appInstanceId Application instance ID
     */
    public getAppInstanceWithHttpInfo(appInstanceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataAppInstance>> {
        const result = this.api.getAppInstanceWithHttpInfo(appInstanceId, _options);
        return result.toPromise();
    }

    /**
     * Get the configuration according to the application instance ID
     * Get the configuration of a single application instance
     * @param appInstanceId Application instance ID
     */
    public getAppInstance(appInstanceId: string, _options?: Configuration): Promise<ResponseDataAppInstance> {
        const result = this.api.getAppInstance(appInstanceId, _options);
        return result.toPromise();
    }


}



import { ObservableApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi } from './ObservableAPI';

import { ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiRequestFactory, ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiResponseProcessor} from "../apis/ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi";
export class PromiseApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi {
    private api: ObservableApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiRequestFactory,
        responseProcessor?: ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Change the event configuration of an application instance
     * Update Event Configuration
     * @param feishuAppEventConfigRo
     * @param appInstanceId Application instance ID
     */
    public eventConfigWithHttpInfo(feishuAppEventConfigRo: FeishuAppEventConfigRo, appInstanceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataAppInstance>> {
        const result = this.api.eventConfigWithHttpInfo(feishuAppEventConfigRo, appInstanceId, _options);
        return result.toPromise();
    }

    /**
     * Change the event configuration of an application instance
     * Update Event Configuration
     * @param feishuAppEventConfigRo
     * @param appInstanceId Application instance ID
     */
    public eventConfig(feishuAppEventConfigRo: FeishuAppEventConfigRo, appInstanceId: string, _options?: Configuration): Promise<ResponseDataAppInstance> {
        const result = this.api.eventConfig(feishuAppEventConfigRo, appInstanceId, _options);
        return result.toPromise();
    }

    /**
     * Update the basic configuration of the application instance
     * Update basic configuration
     * @param feishuAppConfigRo
     * @param appInstanceId Application instance ID
     */
    public initConfigWithHttpInfo(feishuAppConfigRo: FeishuAppConfigRo, appInstanceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataAppInstance>> {
        const result = this.api.initConfigWithHttpInfo(feishuAppConfigRo, appInstanceId, _options);
        return result.toPromise();
    }

    /**
     * Update the basic configuration of the application instance
     * Update basic configuration
     * @param feishuAppConfigRo
     * @param appInstanceId Application instance ID
     */
    public initConfig(feishuAppConfigRo: FeishuAppConfigRo, appInstanceId: string, _options?: Configuration): Promise<ResponseDataAppInstance> {
        const result = this.api.initConfig(feishuAppConfigRo, appInstanceId, _options);
        return result.toPromise();
    }


}



import { ObservableApplicationMarketApplicationAPIApi } from './ObservableAPI';

import { ApplicationMarketApplicationAPIApiRequestFactory, ApplicationMarketApplicationAPIApiResponseProcessor} from "../apis/ApplicationMarketApplicationAPIApi";
export class PromiseApplicationMarketApplicationAPIApi {
    private api: ObservableApplicationMarketApplicationAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ApplicationMarketApplicationAPIApiRequestFactory,
        responseProcessor?: ApplicationMarketApplicationAPIApiResponseProcessor
    ) {
        this.api = new ObservableApplicationMarketApplicationAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Block Application
     * @param spaceId
     * @param appId
     */
    public blockSpaceAppWithHttpInfo(spaceId: string, appId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.blockSpaceAppWithHttpInfo(spaceId, appId, _options);
        return result.toPromise();
    }

    /**
     * Block Application
     * @param spaceId
     * @param appId
     */
    public blockSpaceApp(spaceId: string, appId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.blockSpaceApp(spaceId, appId, _options);
        return result.toPromise();
    }

    /**
     * Query Built-in Integrated Applications
     * @param spaceId
     */
    public getSpaceAppListWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListMarketplaceSpaceAppVo>> {
        const result = this.api.getSpaceAppListWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Query Built-in Integrated Applications
     * @param spaceId
     */
    public getSpaceAppList(spaceId: string, _options?: Configuration): Promise<ResponseDataListMarketplaceSpaceAppVo> {
        const result = this.api.getSpaceAppList(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Open Application
     * @param spaceId
     * @param appId
     */
    public openSpaceAppWithHttpInfo(spaceId: string, appId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.openSpaceAppWithHttpInfo(spaceId, appId, _options);
        return result.toPromise();
    }

    /**
     * Open Application
     * @param spaceId
     * @param appId
     */
    public openSpaceApp(spaceId: string, appId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.openSpaceApp(spaceId, appId, _options);
        return result.toPromise();
    }


}



import { ObservableAuth0ControllerApi } from './ObservableAPI';

import { Auth0ControllerApiRequestFactory, Auth0ControllerApiResponseProcessor} from "../apis/Auth0ControllerApi";
export class PromiseAuth0ControllerApi {
    private api: ObservableAuth0ControllerApi

    public constructor(
        configuration: Configuration,
        requestFactory?: Auth0ControllerApiRequestFactory,
        responseProcessor?: Auth0ControllerApiResponseProcessor
    ) {
        this.api = new ObservableAuth0ControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param code
     * @param error
     * @param errorDescription
     */
    public callback4WithHttpInfo(code?: string, error?: string, errorDescription?: string, _options?: Configuration): Promise<HttpInfo<RedirectView>> {
        const result = this.api.callback4WithHttpInfo(code, error, errorDescription, _options);
        return result.toPromise();
    }

    /**
     * @param code
     * @param error
     * @param errorDescription
     */
    public callback4(code?: string, error?: string, errorDescription?: string, _options?: Configuration): Promise<RedirectView> {
        const result = this.api.callback4(code, error, errorDescription, _options);
        return result.toPromise();
    }

    /**
     * @param email
     * @param success
     */
    public invitationCallbackWithHttpInfo(email: string, success: boolean, _options?: Configuration): Promise<HttpInfo<RedirectView>> {
        const result = this.api.invitationCallbackWithHttpInfo(email, success, _options);
        return result.toPromise();
    }

    /**
     * @param email
     * @param success
     */
    public invitationCallback(email: string, success: boolean, _options?: Configuration): Promise<RedirectView> {
        const result = this.api.invitationCallback(email, success, _options);
        return result.toPromise();
    }

    /**
     * @param message
     */
    public login3WithHttpInfo(message?: string, _options?: Configuration): Promise<HttpInfo<RedirectView>> {
        const result = this.api.login3WithHttpInfo(message, _options);
        return result.toPromise();
    }

    /**
     * @param message
     */
    public login3(message?: string, _options?: Configuration): Promise<RedirectView> {
        const result = this.api.login3(message, _options);
        return result.toPromise();
    }


}



import { ObservableAuthorizationRelatedInterfaceApi } from './ObservableAPI';

import { AuthorizationRelatedInterfaceApiRequestFactory, AuthorizationRelatedInterfaceApiResponseProcessor} from "../apis/AuthorizationRelatedInterfaceApi";
export class PromiseAuthorizationRelatedInterfaceApi {
    private api: ObservableAuthorizationRelatedInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AuthorizationRelatedInterfaceApiRequestFactory,
        responseProcessor?: AuthorizationRelatedInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableAuthorizationRelatedInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * description:verifyType，available values: password sms_code email_code
     * login
     * @param loginRo
     */
    public loginWithHttpInfo(loginRo: LoginRo, _options?: Configuration): Promise<HttpInfo<ResponseDataLoginResultVO>> {
        const result = this.api.loginWithHttpInfo(loginRo, _options);
        return result.toPromise();
    }

    /**
     * description:verifyType，available values: password sms_code email_code
     * login
     * @param loginRo
     */
    public login(loginRo: LoginRo, _options?: Configuration): Promise<ResponseDataLoginResultVO> {
        const result = this.api.login(loginRo, _options);
        return result.toPromise();
    }

    /**
     * log out of current user
     * sign out
     */
    public logoutWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataLogoutVO>> {
        const result = this.api.logoutWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * log out of current user
     * sign out
     */
    public logout(_options?: Configuration): Promise<ResponseDataLogoutVO> {
        const result = this.api.logout(_options);
        return result.toPromise();
    }

    /**
     * log out of current user
     * sign out
     */
    public logout1WithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataLogoutVO>> {
        const result = this.api.logout1WithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * log out of current user
     * sign out
     */
    public logout1(_options?: Configuration): Promise<ResponseDataLogoutVO> {
        const result = this.api.logout1(_options);
        return result.toPromise();
    }

    /**
     * serving for community edition
     * register
     * @param registerRO
     */
    public registerWithHttpInfo(registerRO: RegisterRO, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.registerWithHttpInfo(registerRO, _options);
        return result.toPromise();
    }

    /**
     * serving for community edition
     * register
     * @param registerRO
     */
    public register(registerRO: RegisterRO, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.register(registerRO, _options);
        return result.toPromise();
    }


}



import { ObservableAutoNaviInterfaceApi } from './ObservableAPI';

import { AutoNaviInterfaceApiRequestFactory, AutoNaviInterfaceApiResponseProcessor} from "../apis/AutoNaviInterfaceApi";
export class PromiseAutoNaviInterfaceApi {
    private api: ObservableAutoNaviInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AutoNaviInterfaceApiRequestFactory,
        responseProcessor?: AutoNaviInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableAutoNaviInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public proxyWithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.proxyWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public proxy(_options?: Configuration): Promise<void> {
        const result = this.api.proxy(_options);
        return result.toPromise();
    }


}



import { ObservableAutomationApi } from './ObservableAPI';

import { AutomationApiRequestFactory, AutomationApiResponseProcessor} from "../apis/AutomationApi";
export class PromiseAutomationApi {
    private api: ObservableAutomationApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AutomationApiRequestFactory,
        responseProcessor?: AutomationApiResponseProcessor
    ) {
        this.api = new ObservableAutomationApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create automation action
     * @param createActionRO
     * @param resourceId node id
     * @param shareId share id
     */
    public createActionWithHttpInfo(createActionRO: CreateActionRO, resourceId: string, shareId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListActionVO>> {
        const result = this.api.createActionWithHttpInfo(createActionRO, resourceId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Create automation action
     * @param createActionRO
     * @param resourceId node id
     * @param shareId share id
     */
    public createAction(createActionRO: CreateActionRO, resourceId: string, shareId: string, _options?: Configuration): Promise<ResponseDataListActionVO> {
        const result = this.api.createAction(createActionRO, resourceId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Create automation robot trigger
     * @param createTriggerRO
     * @param resourceId node id
     * @param shareId share id
     */
    public createTriggerWithHttpInfo(createTriggerRO: CreateTriggerRO, resourceId: string, shareId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListTriggerVO>> {
        const result = this.api.createTriggerWithHttpInfo(createTriggerRO, resourceId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Create automation robot trigger
     * @param createTriggerRO
     * @param resourceId node id
     * @param shareId share id
     */
    public createTrigger(createTriggerRO: CreateTriggerRO, resourceId: string, shareId: string, _options?: Configuration): Promise<ResponseDataListTriggerVO> {
        const result = this.api.createTrigger(createTriggerRO, resourceId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Delete automation action
     * @param resourceId node id
     * @param actionId action id
     * @param robotId robot id
     */
    public deleteActionWithHttpInfo(resourceId: string, actionId: string, robotId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteActionWithHttpInfo(resourceId, actionId, robotId, _options);
        return result.toPromise();
    }

    /**
     * Delete automation action
     * @param resourceId node id
     * @param actionId action id
     * @param robotId robot id
     */
    public deleteAction(resourceId: string, actionId: string, robotId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteAction(resourceId, actionId, robotId, _options);
        return result.toPromise();
    }

    /**
     * Delete automation robot
     * @param resourceId node id
     * @param robotId robot id
     */
    public deleteRobotWithHttpInfo(resourceId: string, robotId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteRobotWithHttpInfo(resourceId, robotId, _options);
        return result.toPromise();
    }

    /**
     * Delete automation robot
     * @param resourceId node id
     * @param robotId robot id
     */
    public deleteRobot(resourceId: string, robotId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteRobot(resourceId, robotId, _options);
        return result.toPromise();
    }

    /**
     * Delete automation trigger
     * @param resourceId node id
     * @param triggerId trigger id
     * @param robotId robot id
     */
    public deleteTriggerWithHttpInfo(resourceId: string, triggerId: string, robotId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteTriggerWithHttpInfo(resourceId, triggerId, robotId, _options);
        return result.toPromise();
    }

    /**
     * Delete automation trigger
     * @param resourceId node id
     * @param triggerId trigger id
     * @param robotId robot id
     */
    public deleteTrigger(resourceId: string, triggerId: string, robotId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteTrigger(resourceId, triggerId, robotId, _options);
        return result.toPromise();
    }

    /**
     * Get node automation detail.
     * @param resourceId node id
     * @param robotId robot id
     * @param shareId share id
     */
    public getNodeRobotWithHttpInfo(resourceId: string, robotId: string, shareId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataAutomationVO>> {
        const result = this.api.getNodeRobotWithHttpInfo(resourceId, robotId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Get node automation detail.
     * @param resourceId node id
     * @param robotId robot id
     * @param shareId share id
     */
    public getNodeRobot(resourceId: string, robotId: string, shareId: string, _options?: Configuration): Promise<ResponseDataAutomationVO> {
        const result = this.api.getNodeRobot(resourceId, robotId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Get automation robots
     * @param resourceId node id
     * @param shareId share id
     */
    public getResourceRobotsWithHttpInfo(resourceId: string, shareId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListAutomationSimpleVO>> {
        const result = this.api.getResourceRobotsWithHttpInfo(resourceId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Get automation robots
     * @param resourceId node id
     * @param shareId share id
     */
    public getResourceRobots(resourceId: string, shareId: string, _options?: Configuration): Promise<ResponseDataListAutomationSimpleVO> {
        const result = this.api.getResourceRobots(resourceId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Get automation run history
     * @param pageNum Current page number, default: 1
     * @param shareId share id
     * @param resourceId node id
     * @param robotId robot id
     * @param pageSize Page size, default: 20
     */
    public getRunHistoryWithHttpInfo(pageNum: number, shareId: string, resourceId: string, robotId: string, pageSize?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataListAutomationTaskSimpleVO>> {
        const result = this.api.getRunHistoryWithHttpInfo(pageNum, shareId, resourceId, robotId, pageSize, _options);
        return result.toPromise();
    }

    /**
     * Get automation run history
     * @param pageNum Current page number, default: 1
     * @param shareId share id
     * @param resourceId node id
     * @param robotId robot id
     * @param pageSize Page size, default: 20
     */
    public getRunHistory(pageNum: number, shareId: string, resourceId: string, robotId: string, pageSize?: number, _options?: Configuration): Promise<ResponseDataListAutomationTaskSimpleVO> {
        const result = this.api.getRunHistory(pageNum, shareId, resourceId, robotId, pageSize, _options);
        return result.toPromise();
    }

    /**
     * Update automation info.
     * @param updateRobotRO
     * @param resourceId node id
     * @param robotId robot id
     * @param shareId share id
     */
    public modifyRobotWithHttpInfo(updateRobotRO: UpdateRobotRO, resourceId: string, robotId: string, shareId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.modifyRobotWithHttpInfo(updateRobotRO, resourceId, robotId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Update automation info.
     * @param updateRobotRO
     * @param resourceId node id
     * @param robotId robot id
     * @param shareId share id
     */
    public modifyRobot(updateRobotRO: UpdateRobotRO, resourceId: string, robotId: string, shareId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.modifyRobot(updateRobotRO, resourceId, robotId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Update automation action
     * @param updateActionRO
     * @param resourceId node id
     * @param actionId action id
     * @param shareId share id
     */
    public updateActionWithHttpInfo(updateActionRO: UpdateActionRO, resourceId: string, actionId: string, shareId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListActionVO>> {
        const result = this.api.updateActionWithHttpInfo(updateActionRO, resourceId, actionId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Update automation action
     * @param updateActionRO
     * @param resourceId node id
     * @param actionId action id
     * @param shareId share id
     */
    public updateAction(updateActionRO: UpdateActionRO, resourceId: string, actionId: string, shareId: string, _options?: Configuration): Promise<ResponseDataListActionVO> {
        const result = this.api.updateAction(updateActionRO, resourceId, actionId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Update automation robot trigger
     * @param updateTriggerRO
     * @param resourceId node id
     * @param triggerId trigger id
     * @param shareId share id
     */
    public updateTriggerWithHttpInfo(updateTriggerRO: UpdateTriggerRO, resourceId: string, triggerId: string, shareId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListTriggerVO>> {
        const result = this.api.updateTriggerWithHttpInfo(updateTriggerRO, resourceId, triggerId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Update automation robot trigger
     * @param updateTriggerRO
     * @param resourceId node id
     * @param triggerId trigger id
     * @param shareId share id
     */
    public updateTrigger(updateTriggerRO: UpdateTriggerRO, resourceId: string, triggerId: string, shareId: string, _options?: Configuration): Promise<ResponseDataListTriggerVO> {
        const result = this.api.updateTrigger(updateTriggerRO, resourceId, triggerId, shareId, _options);
        return result.toPromise();
    }


}



import { ObservableAutomationAPIApi } from './ObservableAPI';

import { AutomationAPIApiRequestFactory, AutomationAPIApiResponseProcessor} from "../apis/AutomationAPIApi";
export class PromiseAutomationAPIApi {
    private api: ObservableAutomationAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AutomationAPIApiRequestFactory,
        responseProcessor?: AutomationAPIApiResponseProcessor
    ) {
        this.api = new ObservableAutomationAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Service
     * @param automationServiceCreateRO
     */
    public create9WithHttpInfo(automationServiceCreateRO: AutomationServiceCreateRO, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.create9WithHttpInfo(automationServiceCreateRO, _options);
        return result.toPromise();
    }

    /**
     * Create Service
     * @param automationServiceCreateRO
     */
    public create9(automationServiceCreateRO: AutomationServiceCreateRO, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.create9(automationServiceCreateRO, _options);
        return result.toPromise();
    }

    /**
     * Delete Service
     * @param serviceId
     */
    public delete12WithHttpInfo(serviceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete12WithHttpInfo(serviceId, _options);
        return result.toPromise();
    }

    /**
     * Delete Service
     * @param serviceId
     */
    public delete12(serviceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete12(serviceId, _options);
        return result.toPromise();
    }

    /**
     * Edit Service
     * @param automationServiceEditRO
     * @param serviceId
     */
    public edit4WithHttpInfo(automationServiceEditRO: AutomationServiceEditRO, serviceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.edit4WithHttpInfo(automationServiceEditRO, serviceId, _options);
        return result.toPromise();
    }

    /**
     * Edit Service
     * @param automationServiceEditRO
     * @param serviceId
     */
    public edit4(automationServiceEditRO: AutomationServiceEditRO, serviceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.edit4(automationServiceEditRO, serviceId, _options);
        return result.toPromise();
    }


}



import { ObservableAutomationActionTypeAPIApi } from './ObservableAPI';

import { AutomationActionTypeAPIApiRequestFactory, AutomationActionTypeAPIApiResponseProcessor} from "../apis/AutomationActionTypeAPIApi";
export class PromiseAutomationActionTypeAPIApi {
    private api: ObservableAutomationActionTypeAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AutomationActionTypeAPIApiRequestFactory,
        responseProcessor?: AutomationActionTypeAPIApiResponseProcessor
    ) {
        this.api = new ObservableAutomationActionTypeAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Action Type
     * @param actionTypeCreateRO
     */
    public create10WithHttpInfo(actionTypeCreateRO: ActionTypeCreateRO, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.create10WithHttpInfo(actionTypeCreateRO, _options);
        return result.toPromise();
    }

    /**
     * Create Action Type
     * @param actionTypeCreateRO
     */
    public create10(actionTypeCreateRO: ActionTypeCreateRO, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.create10(actionTypeCreateRO, _options);
        return result.toPromise();
    }

    /**
     * Delete Action Type
     * @param actionTypeId
     */
    public delete13WithHttpInfo(actionTypeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete13WithHttpInfo(actionTypeId, _options);
        return result.toPromise();
    }

    /**
     * Delete Action Type
     * @param actionTypeId
     */
    public delete13(actionTypeId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete13(actionTypeId, _options);
        return result.toPromise();
    }

    /**
     * Edit Action Type
     * @param actionTypeEditRO
     * @param actionTypeId
     */
    public edit5WithHttpInfo(actionTypeEditRO: ActionTypeEditRO, actionTypeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.edit5WithHttpInfo(actionTypeEditRO, actionTypeId, _options);
        return result.toPromise();
    }

    /**
     * Edit Action Type
     * @param actionTypeEditRO
     * @param actionTypeId
     */
    public edit5(actionTypeEditRO: ActionTypeEditRO, actionTypeId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.edit5(actionTypeEditRO, actionTypeId, _options);
        return result.toPromise();
    }


}



import { ObservableAutomationOpenApiControllerApi } from './ObservableAPI';

import { AutomationOpenApiControllerApiRequestFactory, AutomationOpenApiControllerApiResponseProcessor} from "../apis/AutomationOpenApiControllerApi";
export class PromiseAutomationOpenApiControllerApi {
    private api: ObservableAutomationOpenApiControllerApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AutomationOpenApiControllerApiRequestFactory,
        responseProcessor?: AutomationOpenApiControllerApiResponseProcessor
    ) {
        this.api = new ObservableAutomationOpenApiControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param automationApiTriggerCreateRo
     * @param xServiceToken
     */
    public createOrUpdateTriggerWithHttpInfo(automationApiTriggerCreateRo: AutomationApiTriggerCreateRo, xServiceToken?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataAutomationTriggerCreateVo>> {
        const result = this.api.createOrUpdateTriggerWithHttpInfo(automationApiTriggerCreateRo, xServiceToken, _options);
        return result.toPromise();
    }

    /**
     * @param automationApiTriggerCreateRo
     * @param xServiceToken
     */
    public createOrUpdateTrigger(automationApiTriggerCreateRo: AutomationApiTriggerCreateRo, xServiceToken?: string, _options?: Configuration): Promise<ResponseDataAutomationTriggerCreateVo> {
        const result = this.api.createOrUpdateTrigger(automationApiTriggerCreateRo, xServiceToken, _options);
        return result.toPromise();
    }

    /**
     * @param datasheetId
     * @param robotIds
     */
    public deleteTrigger1WithHttpInfo(datasheetId: string, robotIds: Array<string>, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.deleteTrigger1WithHttpInfo(datasheetId, robotIds, _options);
        return result.toPromise();
    }

    /**
     * @param datasheetId
     * @param robotIds
     */
    public deleteTrigger1(datasheetId: string, robotIds: Array<string>, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.deleteTrigger1(datasheetId, robotIds, _options);
        return result.toPromise();
    }


}



import { ObservableAutomationTriggerTypeAPIApi } from './ObservableAPI';

import { AutomationTriggerTypeAPIApiRequestFactory, AutomationTriggerTypeAPIApiResponseProcessor} from "../apis/AutomationTriggerTypeAPIApi";
export class PromiseAutomationTriggerTypeAPIApi {
    private api: ObservableAutomationTriggerTypeAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AutomationTriggerTypeAPIApiRequestFactory,
        responseProcessor?: AutomationTriggerTypeAPIApiResponseProcessor
    ) {
        this.api = new ObservableAutomationTriggerTypeAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Trigger Type
     * @param triggerTypeCreateRO
     */
    public create8WithHttpInfo(triggerTypeCreateRO: TriggerTypeCreateRO, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.create8WithHttpInfo(triggerTypeCreateRO, _options);
        return result.toPromise();
    }

    /**
     * Create Trigger Type
     * @param triggerTypeCreateRO
     */
    public create8(triggerTypeCreateRO: TriggerTypeCreateRO, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.create8(triggerTypeCreateRO, _options);
        return result.toPromise();
    }

    /**
     * Delete Trigger Type
     * @param triggerTypeId
     */
    public delete11WithHttpInfo(triggerTypeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete11WithHttpInfo(triggerTypeId, _options);
        return result.toPromise();
    }

    /**
     * Delete Trigger Type
     * @param triggerTypeId
     */
    public delete11(triggerTypeId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete11(triggerTypeId, _options);
        return result.toPromise();
    }

    /**
     * Edit Trigger Type
     * @param triggerTypeEditRO
     * @param triggerTypeId
     */
    public edit3WithHttpInfo(triggerTypeEditRO: TriggerTypeEditRO, triggerTypeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.edit3WithHttpInfo(triggerTypeEditRO, triggerTypeId, _options);
        return result.toPromise();
    }

    /**
     * Edit Trigger Type
     * @param triggerTypeEditRO
     * @param triggerTypeId
     */
    public edit3(triggerTypeEditRO: TriggerTypeEditRO, triggerTypeId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.edit3(triggerTypeEditRO, triggerTypeId, _options);
        return result.toPromise();
    }


}



import { ObservableBasicModuleAccessoryCallbackInterfaceApi } from './ObservableAPI';

import { BasicModuleAccessoryCallbackInterfaceApiRequestFactory, BasicModuleAccessoryCallbackInterfaceApiResponseProcessor} from "../apis/BasicModuleAccessoryCallbackInterfaceApi";
export class PromiseBasicModuleAccessoryCallbackInterfaceApi {
    private api: ObservableBasicModuleAccessoryCallbackInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: BasicModuleAccessoryCallbackInterfaceApiRequestFactory,
        responseProcessor?: BasicModuleAccessoryCallbackInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableBasicModuleAccessoryCallbackInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * After S3 completes the client upload, it actively reaches the notification server
     * Resource upload completion notification callback
     * @param assetUploadNotifyRO
     */
    public notifyCallbackWithHttpInfo(assetUploadNotifyRO: AssetUploadNotifyRO, _options?: Configuration): Promise<HttpInfo<ResponseDataListAssetUploadResult>> {
        const result = this.api.notifyCallbackWithHttpInfo(assetUploadNotifyRO, _options);
        return result.toPromise();
    }

    /**
     * After S3 completes the client upload, it actively reaches the notification server
     * Resource upload completion notification callback
     * @param assetUploadNotifyRO
     */
    public notifyCallback(assetUploadNotifyRO: AssetUploadNotifyRO, _options?: Configuration): Promise<ResponseDataListAssetUploadResult> {
        const result = this.api.notifyCallback(assetUploadNotifyRO, _options);
        return result.toPromise();
    }

    /**
     * widget upload callback
     * @param widgetUploadNotifyRO
     */
    public widgetCallbackWithHttpInfo(widgetUploadNotifyRO: WidgetUploadNotifyRO, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.widgetCallbackWithHttpInfo(widgetUploadNotifyRO, _options);
        return result.toPromise();
    }

    /**
     * widget upload callback
     * @param widgetUploadNotifyRO
     */
    public widgetCallback(widgetUploadNotifyRO: WidgetUploadNotifyRO, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.widgetCallback(widgetUploadNotifyRO, _options);
        return result.toPromise();
    }


}



import { ObservableBasicModuleAttachmentInterfaceApi } from './ObservableAPI';

import { BasicModuleAttachmentInterfaceApiRequestFactory, BasicModuleAttachmentInterfaceApiResponseProcessor} from "../apis/BasicModuleAttachmentInterfaceApi";
export class PromiseBasicModuleAttachmentInterfaceApi {
    private api: ObservableBasicModuleAttachmentInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: BasicModuleAttachmentInterfaceApiRequestFactory,
        responseProcessor?: BasicModuleAttachmentInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableBasicModuleAttachmentInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * The same attachment needs to pass the token repeatedly
     * Changes in the number of references to space attachment resources
     * @param spaceAssetOpRo
     */
    public citeWithHttpInfo(spaceAssetOpRo: SpaceAssetOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.citeWithHttpInfo(spaceAssetOpRo, _options);
        return result.toPromise();
    }

    /**
     * The same attachment needs to pass the token repeatedly
     * Changes in the number of references to space attachment resources
     * @param spaceAssetOpRo
     */
    public cite(spaceAssetOpRo: SpaceAssetOpRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.cite(spaceAssetOpRo, _options);
        return result.toPromise();
    }

    /**
     * Paging query pictures that need manual review
     * @param page
     * @param pageObjectParams Page params
     */
    public readReviewsWithHttpInfo(page: Page, pageObjectParams: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoAssetsAuditVo>> {
        const result = this.api.readReviewsWithHttpInfo(page, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Paging query pictures that need manual review
     * @param page
     * @param pageObjectParams Page params
     */
    public readReviews(page: Page, pageObjectParams: string, _options?: Configuration): Promise<ResponseDataPageInfoAssetsAuditVo> {
        const result = this.api.readReviews(page, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Submit the image review results, enter the reviewer\'s name when submitting
     * Submit image review results
     * @param assetsAuditRo
     */
    public submitAuditResultWithHttpInfo(assetsAuditRo: AssetsAuditRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.submitAuditResultWithHttpInfo(assetsAuditRo, _options);
        return result.toPromise();
    }

    /**
     * Submit the image review results, enter the reviewer\'s name when submitting
     * Submit image review results
     * @param assetsAuditRo
     */
    public submitAuditResult(assetsAuditRo: AssetsAuditRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.submitAuditResult(assetsAuditRo, _options);
        return result.toPromise();
    }

    /**
     * Upload resource files, any file type is unlimited
     * Upload resources
     * @param attachOpRo
     */
    public uploadWithHttpInfo(attachOpRo?: AttachOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataAssetUploadResult>> {
        const result = this.api.uploadWithHttpInfo(attachOpRo, _options);
        return result.toPromise();
    }

    /**
     * Upload resource files, any file type is unlimited
     * Upload resources
     * @param attachOpRo
     */
    public upload(attachOpRo?: AttachOpRo, _options?: Configuration): Promise<ResponseDataAssetUploadResult> {
        const result = this.api.upload(attachOpRo, _options);
        return result.toPromise();
    }

    /**
     * Image URL upload interface
     * @param attachUrlOpRo
     */
    public urlUploadWithHttpInfo(attachUrlOpRo?: AttachUrlOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataAssetUploadResult>> {
        const result = this.api.urlUploadWithHttpInfo(attachUrlOpRo, _options);
        return result.toPromise();
    }

    /**
     * Image URL upload interface
     * @param attachUrlOpRo
     */
    public urlUpload(attachUrlOpRo?: AttachUrlOpRo, _options?: Configuration): Promise<ResponseDataAssetUploadResult> {
        const result = this.api.urlUpload(attachUrlOpRo, _options);
        return result.toPromise();
    }


}



import { ObservableBasicModuleVerifyActionModuleInterfaceApi } from './ObservableAPI';

import { BasicModuleVerifyActionModuleInterfaceApiRequestFactory, BasicModuleVerifyActionModuleInterfaceApiResponseProcessor} from "../apis/BasicModuleVerifyActionModuleInterfaceApi";
export class PromiseBasicModuleVerifyActionModuleInterfaceApi {
    private api: ObservableBasicModuleVerifyActionModuleInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: BasicModuleVerifyActionModuleInterfaceApiRequestFactory,
        responseProcessor?: BasicModuleVerifyActionModuleInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableBasicModuleVerifyActionModuleInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Invitation link token verification, the relevant invitation information can be obtained after the verification is successful
     * Invitation temporary code verification
     * @param inviteValidRo
     */
    public inviteTokenValidWithHttpInfo(inviteValidRo: InviteValidRo, _options?: Configuration): Promise<HttpInfo<ResponseDataInviteInfoVo>> {
        const result = this.api.inviteTokenValidWithHttpInfo(inviteValidRo, _options);
        return result.toPromise();
    }

    /**
     * Invitation link token verification, the relevant invitation information can be obtained after the verification is successful
     * Invitation temporary code verification
     * @param inviteValidRo
     */
    public inviteTokenValid(inviteValidRo: InviteValidRo, _options?: Configuration): Promise<ResponseDataInviteInfoVo> {
        const result = this.api.inviteTokenValid(inviteValidRo, _options);
        return result.toPromise();
    }

    /**
     * Email verification code; 1:Email binding, 2: Email registration, 3: General verification
     * Send email verification code
     * @param emailOpRo
     */
    public mailWithHttpInfo(emailOpRo: EmailOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.mailWithHttpInfo(emailOpRo, _options);
        return result.toPromise();
    }

    /**
     * Email verification code; 1:Email binding, 2: Email registration, 3: General verification
     * Send email verification code
     * @param emailOpRo
     */
    public mail(emailOpRo: EmailOpRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.mail(emailOpRo, _options);
        return result.toPromise();
    }

    /**
     * SMS type; 1: Registration, 2:Login, 3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, 6: (Remove replacement) mobile phone binding 7: Modify mailbox binding, 8: Delete space, 9: Replace main administrator 10: General verification, 11: Change developer configuration, 12: Bind third-party platform account
     * Send SMS verification code
     * @param smsOpRo
     */
    public sendWithHttpInfo(smsOpRo: SmsOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.sendWithHttpInfo(smsOpRo, _options);
        return result.toPromise();
    }

    /**
     * SMS type; 1: Registration, 2:Login, 3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, 6: (Remove replacement) mobile phone binding 7: Modify mailbox binding, 8: Delete space, 9: Replace main administrator 10: General verification, 11: Change developer configuration, 12: Bind third-party platform account
     * Send SMS verification code
     * @param smsOpRo
     */
    public send(smsOpRo: SmsOpRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.send(smsOpRo, _options);
        return result.toPromise();
    }

    /**
     * Usage scenario: Verify identity before changing email address when no mobile phone, change the main administrator
     * Email verification code verification
     * @param emailCodeValidateRo
     */
    public validateEmailWithHttpInfo(emailCodeValidateRo: EmailCodeValidateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.validateEmailWithHttpInfo(emailCodeValidateRo, _options);
        return result.toPromise();
    }

    /**
     * Usage scenario: Verify identity before changing email address when no mobile phone, change the main administrator
     * Email verification code verification
     * @param emailCodeValidateRo
     */
    public validateEmail(emailCodeValidateRo: EmailCodeValidateRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.validateEmail(emailCodeValidateRo, _options);
        return result.toPromise();
    }

    /**
     * Usage scenarios: DingTalk binding, identity verification before changing the mobile phone mailbox, changing the main administrator
     * Mobile verification code verification
     * @param smsCodeValidateRo
     */
    public verifyPhone1WithHttpInfo(smsCodeValidateRo: SmsCodeValidateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.verifyPhone1WithHttpInfo(smsCodeValidateRo, _options);
        return result.toPromise();
    }

    /**
     * Usage scenarios: DingTalk binding, identity verification before changing the mobile phone mailbox, changing the main administrator
     * Mobile verification code verification
     * @param smsCodeValidateRo
     */
    public verifyPhone1(smsCodeValidateRo: SmsCodeValidateRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.verifyPhone1(smsCodeValidateRo, _options);
        return result.toPromise();
    }


}



import { ObservableBasicsAttachmentUploadTokenInterfaceApi } from './ObservableAPI';

import { BasicsAttachmentUploadTokenInterfaceApiRequestFactory, BasicsAttachmentUploadTokenInterfaceApiResponseProcessor} from "../apis/BasicsAttachmentUploadTokenInterfaceApi";
export class PromiseBasicsAttachmentUploadTokenInterfaceApi {
    private api: ObservableBasicsAttachmentUploadTokenInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: BasicsAttachmentUploadTokenInterfaceApiRequestFactory,
        responseProcessor?: BasicsAttachmentUploadTokenInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableBasicsAttachmentUploadTokenInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get upload presigned URL
     * @param assetUploadCertificateRO
     */
    public generatePreSignedUrlWithHttpInfo(assetUploadCertificateRO: AssetUploadCertificateRO, _options?: Configuration): Promise<HttpInfo<ResponseDataListAssetUploadCertificateVO>> {
        const result = this.api.generatePreSignedUrlWithHttpInfo(assetUploadCertificateRO, _options);
        return result.toPromise();
    }

    /**
     * Get upload presigned URL
     * @param assetUploadCertificateRO
     */
    public generatePreSignedUrl(assetUploadCertificateRO: AssetUploadCertificateRO, _options?: Configuration): Promise<ResponseDataListAssetUploadCertificateVO> {
        const result = this.api.generatePreSignedUrl(assetUploadCertificateRO, _options);
        return result.toPromise();
    }

    /**
     * Get asset signature url
     * @param token
     */
    public getSignatureUrlWithHttpInfo(token: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.getSignatureUrlWithHttpInfo(token, _options);
        return result.toPromise();
    }

    /**
     * Get asset signature url
     * @param token
     */
    public getSignatureUrl(token: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.getSignatureUrl(token, _options);
        return result.toPromise();
    }

    /**
     * Batch get asset signature url
     * @param assetUrlSignatureRo
     */
    public getSignatureUrlsWithHttpInfo(assetUrlSignatureRo: AssetUrlSignatureRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListAssetUrlSignatureVo>> {
        const result = this.api.getSignatureUrlsWithHttpInfo(assetUrlSignatureRo, _options);
        return result.toPromise();
    }

    /**
     * Batch get asset signature url
     * @param assetUrlSignatureRo
     */
    public getSignatureUrls(assetUrlSignatureRo: AssetUrlSignatureRo, _options?: Configuration): Promise<ResponseDataListAssetUrlSignatureVo> {
        const result = this.api.getSignatureUrls(assetUrlSignatureRo, _options);
        return result.toPromise();
    }


}



import { ObservableBillingCapacityApiApi } from './ObservableAPI';

import { BillingCapacityApiApiRequestFactory, BillingCapacityApiApiResponseProcessor} from "../apis/BillingCapacityApiApi";
export class PromiseBillingCapacityApiApi {
    private api: ObservableBillingCapacityApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: BillingCapacityApiApiRequestFactory,
        responseProcessor?: BillingCapacityApiApiResponseProcessor
    ) {
        this.api = new ObservableBillingCapacityApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get space capacity detail info
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams paging parameter
     * @param isExpire Whether the attachment capacity has expired. By default, it has not expired
     */
    public getCapacityDetailWithHttpInfo(page: Page, xSpaceId: string, pageObjectParams: string, isExpire?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoSpaceCapacityPageVO>> {
        const result = this.api.getCapacityDetailWithHttpInfo(page, xSpaceId, pageObjectParams, isExpire, _options);
        return result.toPromise();
    }

    /**
     * Get space capacity detail info
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams paging parameter
     * @param isExpire Whether the attachment capacity has expired. By default, it has not expired
     */
    public getCapacityDetail(page: Page, xSpaceId: string, pageObjectParams: string, isExpire?: boolean, _options?: Configuration): Promise<ResponseDataPageInfoSpaceCapacityPageVO> {
        const result = this.api.getCapacityDetail(page, xSpaceId, pageObjectParams, isExpire, _options);
        return result.toPromise();
    }


}



import { ObservableBillingControllerApi } from './ObservableAPI';

import { BillingControllerApiRequestFactory, BillingControllerApiResponseProcessor} from "../apis/BillingControllerApi";
export class PromiseBillingControllerApi {
    private api: ObservableBillingControllerApi

    public constructor(
        configuration: Configuration,
        requestFactory?: BillingControllerApiRequestFactory,
        responseProcessor?: BillingControllerApiResponseProcessor
    ) {
        this.api = new ObservableBillingControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param spaceId
     * @param subscriptionId
     */
    public cancelSubscriptionWithHttpInfo(spaceId: string, subscriptionId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataBillingSessionVO>> {
        const result = this.api.cancelSubscriptionWithHttpInfo(spaceId, subscriptionId, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     * @param subscriptionId
     */
    public cancelSubscription(spaceId: string, subscriptionId: string, _options?: Configuration): Promise<ResponseDataBillingSessionVO> {
        const result = this.api.cancelSubscription(spaceId, subscriptionId, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     */
    public changePaymentMethodWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataBillingSessionVO>> {
        const result = this.api.changePaymentMethodWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     */
    public changePaymentMethod(spaceId: string, _options?: Configuration): Promise<ResponseDataBillingSessionVO> {
        const result = this.api.changePaymentMethod(spaceId, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     */
    public customerPortalUrlWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataBillingSessionVO>> {
        const result = this.api.customerPortalUrlWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     */
    public customerPortalUrl(spaceId: string, _options?: Configuration): Promise<ResponseDataBillingSessionVO> {
        const result = this.api.customerPortalUrl(spaceId, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     * @param startingAfter
     * @param endingBefore
     * @param limit
     */
    public getInvoicesWithHttpInfo(spaceId: string, startingAfter?: string, endingBefore?: string, limit?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataCustomerInvoices>> {
        const result = this.api.getInvoicesWithHttpInfo(spaceId, startingAfter, endingBefore, limit, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     * @param startingAfter
     * @param endingBefore
     * @param limit
     */
    public getInvoices(spaceId: string, startingAfter?: string, endingBefore?: string, limit?: number, _options?: Configuration): Promise<ResponseDataCustomerInvoices> {
        const result = this.api.getInvoices(spaceId, startingAfter, endingBefore, limit, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     */
    public getSubscriptionsWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataBillingInfo>> {
        const result = this.api.getSubscriptionsWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     */
    public getSubscriptions(spaceId: string, _options?: Configuration): Promise<ResponseDataBillingInfo> {
        const result = this.api.getSubscriptions(spaceId, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     * @param subscriptionId
     * @param action
     */
    public updateSubscriptionWithHttpInfo(spaceId: string, subscriptionId: string, action?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataBillingSessionVO>> {
        const result = this.api.updateSubscriptionWithHttpInfo(spaceId, subscriptionId, action, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     * @param subscriptionId
     * @param action
     */
    public updateSubscription(spaceId: string, subscriptionId: string, action?: string, _options?: Configuration): Promise<ResponseDataBillingSessionVO> {
        const result = this.api.updateSubscription(spaceId, subscriptionId, action, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     * @param subscriptionId
     * @param priceId
     */
    public updateSubscriptionConfirmWithHttpInfo(spaceId: string, subscriptionId: string, priceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataBillingSessionVO>> {
        const result = this.api.updateSubscriptionConfirmWithHttpInfo(spaceId, subscriptionId, priceId, _options);
        return result.toPromise();
    }

    /**
     * @param spaceId
     * @param subscriptionId
     * @param priceId
     */
    public updateSubscriptionConfirm(spaceId: string, subscriptionId: string, priceId: string, _options?: Configuration): Promise<ResponseDataBillingSessionVO> {
        const result = this.api.updateSubscriptionConfirm(spaceId, subscriptionId, priceId, _options);
        return result.toPromise();
    }


}



import { ObservableBillingEventApiApi } from './ObservableAPI';

import { BillingEventApiApiRequestFactory, BillingEventApiApiResponseProcessor} from "../apis/BillingEventApiApi";
export class PromiseBillingEventApiApi {
    private api: ObservableBillingEventApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: BillingEventApiApiRequestFactory,
        responseProcessor?: BillingEventApiApiResponseProcessor
    ) {
        this.api = new ObservableBillingEventApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * fetch event list
     */
    public fetchEventListWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataEventVO>> {
        const result = this.api.fetchEventListWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * fetch event list
     */
    public fetchEventList(_options?: Configuration): Promise<ResponseDataEventVO> {
        const result = this.api.fetchEventList(_options);
        return result.toPromise();
    }


}



import { ObservableBillingOrderAPIApi } from './ObservableAPI';

import { BillingOrderAPIApiRequestFactory, BillingOrderAPIApiResponseProcessor} from "../apis/BillingOrderAPIApi";
export class PromiseBillingOrderAPIApi {
    private api: ObservableBillingOrderAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: BillingOrderAPIApiRequestFactory,
        responseProcessor?: BillingOrderAPIApiResponseProcessor
    ) {
        this.api = new ObservableBillingOrderAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * check order paid status when client polling is longer
     * Check Order Payment Status
     * @param orderId order id
     */
    public checkOrderPaidStatusWithHttpInfo(orderId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPaymentOrderStatusVo>> {
        const result = this.api.checkOrderPaidStatusWithHttpInfo(orderId, _options);
        return result.toPromise();
    }

    /**
     * check order paid status when client polling is longer
     * Check Order Payment Status
     * @param orderId order id
     */
    public checkOrderPaidStatus(orderId: string, _options?: Configuration): Promise<ResponseDataPaymentOrderStatusVo> {
        const result = this.api.checkOrderPaidStatus(orderId, _options);
        return result.toPromise();
    }

    /**
     * Create Order
     * @param createOrderRo
     */
    public createOrderWithHttpInfo(createOrderRo: CreateOrderRo, _options?: Configuration): Promise<HttpInfo<ResponseDataOrderDetailVo>> {
        const result = this.api.createOrderWithHttpInfo(createOrderRo, _options);
        return result.toPromise();
    }

    /**
     * Create Order
     * @param createOrderRo
     */
    public createOrder(createOrderRo: CreateOrderRo, _options?: Configuration): Promise<ResponseDataOrderDetailVo> {
        const result = this.api.createOrder(createOrderRo, _options);
        return result.toPromise();
    }

    /**
     * Create Payment Order
     * @param payOrderRo
     * @param orderId order id
     */
    public createOrderPaymentWithHttpInfo(payOrderRo: PayOrderRo, orderId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataOrderPaymentVo>> {
        const result = this.api.createOrderPaymentWithHttpInfo(payOrderRo, orderId, _options);
        return result.toPromise();
    }

    /**
     * Create Payment Order
     * @param payOrderRo
     * @param orderId order id
     */
    public createOrderPayment(payOrderRo: PayOrderRo, orderId: string, _options?: Configuration): Promise<ResponseDataOrderPaymentVo> {
        const result = this.api.createOrderPayment(payOrderRo, orderId, _options);
        return result.toPromise();
    }

    /**
     * fetch order detail by id
     * Get Order Details
     * @param orderId
     */
    public fetchOrderByIdWithHttpInfo(orderId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataOrderDetailVo>> {
        const result = this.api.fetchOrderByIdWithHttpInfo(orderId, _options);
        return result.toPromise();
    }

    /**
     * fetch order detail by id
     * Get Order Details
     * @param orderId
     */
    public fetchOrderById(orderId: string, _options?: Configuration): Promise<ResponseDataOrderDetailVo> {
        const result = this.api.fetchOrderById(orderId, _options);
        return result.toPromise();
    }

    /**
     * According to the subscription change type (new subscription, subscription renewal, subscription change, subscription cancellation), preview the orders to be generated by the system in the future
     * Test run order
     * @param dryRunOrderArgs
     */
    public generateDryRunOrderWithHttpInfo(dryRunOrderArgs: DryRunOrderArgs, _options?: Configuration): Promise<HttpInfo<ResponseDataOrderPreview>> {
        const result = this.api.generateDryRunOrderWithHttpInfo(dryRunOrderArgs, _options);
        return result.toPromise();
    }

    /**
     * According to the subscription change type (new subscription, subscription renewal, subscription change, subscription cancellation), preview the orders to be generated by the system in the future
     * Test run order
     * @param dryRunOrderArgs
     */
    public generateDryRunOrder(dryRunOrderArgs: DryRunOrderArgs, _options?: Configuration): Promise<ResponseDataOrderPreview> {
        const result = this.api.generateDryRunOrder(dryRunOrderArgs, _options);
        return result.toPromise();
    }

    /**
     * get order paid status when client polling
     * Get Order Payment Status
     * @param orderId order id
     */
    public getOrderPaidStatusWithHttpInfo(orderId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPaymentOrderStatusVo>> {
        const result = this.api.getOrderPaidStatusWithHttpInfo(orderId, _options);
        return result.toPromise();
    }

    /**
     * get order paid status when client polling
     * Get Order Payment Status
     * @param orderId order id
     */
    public getOrderPaidStatus(orderId: string, _options?: Configuration): Promise<ResponseDataPaymentOrderStatusVo> {
        const result = this.api.getOrderPaidStatus(orderId, _options);
        return result.toPromise();
    }


}



import { ObservableCheckoutControllerApi } from './ObservableAPI';

import { CheckoutControllerApiRequestFactory, CheckoutControllerApiResponseProcessor} from "../apis/CheckoutControllerApi";
export class PromiseCheckoutControllerApi {
    private api: ObservableCheckoutControllerApi

    public constructor(
        configuration: Configuration,
        requestFactory?: CheckoutControllerApiRequestFactory,
        responseProcessor?: CheckoutControllerApiResponseProcessor
    ) {
        this.api = new ObservableCheckoutControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param checkoutCreation
     */
    public createCheckoutWithHttpInfo(checkoutCreation: CheckoutCreation, _options?: Configuration): Promise<HttpInfo<CheckoutCreationVO>> {
        const result = this.api.createCheckoutWithHttpInfo(checkoutCreation, _options);
        return result.toPromise();
    }

    /**
     * @param checkoutCreation
     */
    public createCheckout(checkoutCreation: CheckoutCreation, _options?: Configuration): Promise<CheckoutCreationVO> {
        const result = this.api.createCheckout(checkoutCreation, _options);
        return result.toPromise();
    }


}



import { ObservableCliAuthorizationAPIApi } from './ObservableAPI';

import { CliAuthorizationAPIApiRequestFactory, CliAuthorizationAPIApiResponseProcessor} from "../apis/CliAuthorizationAPIApi";
export class PromiseCliAuthorizationAPIApi {
    private api: ObservableCliAuthorizationAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: CliAuthorizationAPIApiRequestFactory,
        responseProcessor?: CliAuthorizationAPIApiResponseProcessor
    ) {
        this.api = new ObservableCliAuthorizationAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Login authorization, using the developer\'s Api Key.
     * @param apiKey
     */
    public authLoginWithHttpInfo(apiKey: string, _options?: Configuration): Promise<HttpInfo<ResponseDataDevelopUserVo>> {
        const result = this.api.authLoginWithHttpInfo(apiKey, _options);
        return result.toPromise();
    }

    /**
     * Login authorization, using the developer\'s Api Key.
     * @param apiKey
     */
    public authLogin(apiKey: string, _options?: Configuration): Promise<ResponseDataDevelopUserVo> {
        const result = this.api.authLogin(apiKey, _options);
        return result.toPromise();
    }

    /**
     * Query using Graph QL
     * GraphQL Query
     * @param developerToken developer token
     */
    public graphqlWithHttpInfo(developerToken: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.graphqlWithHttpInfo(developerToken, _options);
        return result.toPromise();
    }

    /**
     * Query using Graph QL
     * GraphQL Query
     * @param developerToken developer token
     */
    public graphql(developerToken: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.graphql(developerToken, _options);
        return result.toPromise();
    }

    /**
     * Create a new cloud application in the specified space.
     * New Cloud application
     * @param spaceId
     * @param developerToken developer token
     */
    public newAppletWithHttpInfo(spaceId: string, developerToken: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.newAppletWithHttpInfo(spaceId, developerToken, _options);
        return result.toPromise();
    }

    /**
     * Create a new cloud application in the specified space.
     * New Cloud application
     * @param spaceId
     * @param developerToken developer token
     */
    public newApplet(spaceId: string, developerToken: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.newApplet(spaceId, developerToken, _options);
        return result.toPromise();
    }

    /**
     * The developer token is passed for login. The network verifies whether the token is valid. The user name is returned and cached locally.   Generally speaking, this API is not used by vika-cli, but for Web side web page operations.
     * Create Developer Token
     * @param userSessionToken Normal login Session Token of the user.
     */
    public newTokenWithHttpInfo(userSessionToken: string, _options?: Configuration): Promise<HttpInfo<ResponseDataDeveloperVo>> {
        const result = this.api.newTokenWithHttpInfo(userSessionToken, _options);
        return result.toPromise();
    }

    /**
     * The developer token is passed for login. The network verifies whether the token is valid. The user name is returned and cached locally.   Generally speaking, this API is not used by vika-cli, but for Web side web page operations.
     * Create Developer Token
     * @param userSessionToken Normal login Session Token of the user.
     */
    public newToken(userSessionToken: string, _options?: Configuration): Promise<ResponseDataDeveloperVo> {
        const result = this.api.newToken(userSessionToken, _options);
        return result.toPromise();
    }

    /**
     * Creates a cloud hook in the specified applet.
     * Creating a Cloud Hook
     * @param developerToken developer token
     */
    public newWebhookWithHttpInfo(developerToken: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.newWebhookWithHttpInfo(developerToken, _options);
        return result.toPromise();
    }

    /**
     * Creates a cloud hook in the specified applet.
     * Creating a Cloud Hook
     * @param developerToken developer token
     */
    public newWebhook(developerToken: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.newWebhook(developerToken, _options);
        return result.toPromise();
    }

    /**
     * Specifies that the applet is published to the marketplace.
     * Publish cloud applications
     * @param developerToken developer token
     */
    public publishAppletWithHttpInfo(developerToken: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.publishAppletWithHttpInfo(developerToken, _options);
        return result.toPromise();
    }

    /**
     * Specifies that the applet is published to the marketplace.
     * Publish cloud applications
     * @param developerToken developer token
     */
    public publishApplet(developerToken: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.publishApplet(developerToken, _options);
        return result.toPromise();
    }

    /**
     * Lists all cloud applications in the specified space.
     * Listing cloud applications
     * @param spaceId
     * @param developerToken developer token
     * @param xSpaceId space id
     */
    public showAppletsWithHttpInfo(spaceId: string, developerToken: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.showAppletsWithHttpInfo(spaceId, developerToken, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Lists all cloud applications in the specified space.
     * Listing cloud applications
     * @param spaceId
     * @param developerToken developer token
     * @param xSpaceId space id
     */
    public showApplets(spaceId: string, developerToken: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.showApplets(spaceId, developerToken, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * List the space owned by the user.
     * space list
     */
    public showSpacesWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataListSpaceShowcaseVo>> {
        const result = this.api.showSpacesWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * List the space owned by the user.
     * space list
     */
    public showSpaces(_options?: Configuration): Promise<ResponseDataListSpaceShowcaseVo> {
        const result = this.api.showSpaces(_options);
        return result.toPromise();
    }

    /**
     * Lists all cloud hooks in the specified applet.
     * Listing cloud hooks
     * @param appletId
     * @param developerToken developer token
     */
    public showWebhooksWithHttpInfo(appletId: string, developerToken: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.showWebhooksWithHttpInfo(appletId, developerToken, _options);
        return result.toPromise();
    }

    /**
     * Lists all cloud hooks in the specified applet.
     * Listing cloud hooks
     * @param appletId
     * @param developerToken developer token
     */
    public showWebhooks(appletId: string, developerToken: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.showWebhooks(appletId, developerToken, _options);
        return result.toPromise();
    }

    /**
     * Specifies the applet upload plug-in.
     * Upload plug-ins
     * @param developerToken developer token
     */
    public uploadPluginWithHttpInfo(developerToken: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.uploadPluginWithHttpInfo(developerToken, _options);
        return result.toPromise();
    }

    /**
     * Specifies the applet upload plug-in.
     * Upload plug-ins
     * @param developerToken developer token
     */
    public uploadPlugin(developerToken: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.uploadPlugin(developerToken, _options);
        return result.toPromise();
    }


}



import { ObservableCliOfficeBanAPIApi } from './ObservableAPI';

import { CliOfficeBanAPIApiRequestFactory, CliOfficeBanAPIApiResponseProcessor} from "../apis/CliOfficeBanAPIApi";
export class PromiseCliOfficeBanAPIApi {
    private api: ObservableCliOfficeBanAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: CliOfficeBanAPIApiRequestFactory,
        responseProcessor?: CliOfficeBanAPIApiResponseProcessor
    ) {
        this.api = new ObservableCliOfficeBanAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * limit function.
     * Ban space
     * @param spaceId
     */
    public banSpaceWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.banSpaceWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * limit function.
     * Ban space
     * @param spaceId
     */
    public banSpace(spaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.banSpace(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Restrict login and force logout.
     * Ban account
     * @param userId
     */
    public banUserWithHttpInfo(userId: number, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.banUserWithHttpInfo(userId, _options);
        return result.toPromise();
    }

    /**
     * Restrict login and force logout.
     * Ban account
     * @param userId
     */
    public banUser(userId: number, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.banUser(userId, _options);
        return result.toPromise();
    }


}



import { ObservableCliOfficeGMAPIApi } from './ObservableAPI';

import { CliOfficeGMAPIApiRequestFactory, CliOfficeGMAPIApiResponseProcessor} from "../apis/CliOfficeGMAPIApi";
export class PromiseCliOfficeGMAPIApi {
    private api: ObservableCliOfficeGMAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: CliOfficeGMAPIApiRequestFactory,
        responseProcessor?: CliOfficeGMAPIApiResponseProcessor
    ) {
        this.api = new ObservableCliOfficeGMAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Activity Integral Reward
     */
    public activityRewardWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.activityRewardWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Activity Integral Reward
     */
    public activityReward(_options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.activityReward(_options);
        return result.toPromise();
    }

    /**
     * Adding system notification.
     * Create a player notification
     * @param notificationCreateRo
     */
    public addPlayerNotifyWithHttpInfo(notificationCreateRo: NotificationCreateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.addPlayerNotifyWithHttpInfo(notificationCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Adding system notification.
     * Create a player notification
     * @param notificationCreateRo
     */
    public addPlayerNotify(notificationCreateRo: NotificationCreateRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.addPlayerNotify(notificationCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Open laboratory feature for applicants
     * @param gmApplyFeatureRo
     */
    public applyLabsFeatureWithHttpInfo(gmApplyFeatureRo: GmApplyFeatureRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.applyLabsFeatureWithHttpInfo(gmApplyFeatureRo, _options);
        return result.toPromise();
    }

    /**
     * Open laboratory feature for applicants
     * @param gmApplyFeatureRo
     */
    public applyLabsFeature(gmApplyFeatureRo: GmApplyFeatureRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.applyLabsFeature(gmApplyFeatureRo, _options);
        return result.toPromise();
    }

    /**
     * Specifies the active state of the user
     * @param userActivityAssignRo
     */
    public assignActivityWithHttpInfo(userActivityAssignRo: UserActivityAssignRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.assignActivityWithHttpInfo(userActivityAssignRo, _options);
        return result.toPromise();
    }

    /**
     * Specifies the active state of the user
     * @param userActivityAssignRo
     */
    public assignActivity(userActivityAssignRo: UserActivityAssignRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.assignActivity(userActivityAssignRo, _options);
        return result.toPromise();
    }

    /**
     * Close paused account
     * @param uuid
     */
    public closeAccountDirectlyWithHttpInfo(uuid: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.closeAccountDirectlyWithHttpInfo(uuid, _options);
        return result.toPromise();
    }

    /**
     * Close paused account
     * @param uuid
     */
    public closeAccountDirectly(uuid: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.closeAccountDirectly(uuid, _options);
        return result.toPromise();
    }

    /**
     * Update Template Center Config
     * @param templateCenterConfigRo
     */
    public configWithHttpInfo(templateCenterConfigRo: TemplateCenterConfigRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.configWithHttpInfo(templateCenterConfigRo, _options);
        return result.toPromise();
    }

    /**
     * Update Template Center Config
     * @param templateCenterConfigRo
     */
    public config(templateCenterConfigRo: TemplateCenterConfigRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.config(templateCenterConfigRo, _options);
        return result.toPromise();
    }

    /**
     * Create laboratory feature
     * @param gmLabsFeatureCreatorRo
     */
    public createLabsFeatureWithHttpInfo(gmLabsFeatureCreatorRo: GmLabsFeatureCreatorRo, _options?: Configuration): Promise<HttpInfo<ResponseDataGmLabFeatureVo>> {
        const result = this.api.createLabsFeatureWithHttpInfo(gmLabsFeatureCreatorRo, _options);
        return result.toPromise();
    }

    /**
     * Create laboratory feature
     * @param gmLabsFeatureCreatorRo
     */
    public createLabsFeature(gmLabsFeatureCreatorRo: GmLabsFeatureCreatorRo, _options?: Configuration): Promise<ResponseDataGmLabFeatureVo> {
        const result = this.api.createLabsFeature(gmLabsFeatureCreatorRo, _options);
        return result.toPromise();
    }

    /**
     * create a user by username and password.
     * Create user(Irregular vest number, used for testing)
     * @param hqAddUserRo
     */
    public createUserWithHttpInfo(hqAddUserRo: HqAddUserRo, _options?: Configuration): Promise<HttpInfo<ResponseDataHqAddUserVo>> {
        const result = this.api.createUserWithHttpInfo(hqAddUserRo, _options);
        return result.toPromise();
    }

    /**
     * create a user by username and password.
     * Create user(Irregular vest number, used for testing)
     * @param hqAddUserRo
     */
    public createUser(hqAddUserRo: HqAddUserRo, _options?: Configuration): Promise<ResponseDataHqAddUserVo> {
        const result = this.api.createUser(hqAddUserRo, _options);
        return result.toPromise();
    }

    /**
     * Batch Create user(Irregular vest number, used for testing)
     */
    public createUsersWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.createUsersWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Batch Create user(Irregular vest number, used for testing)
     */
    public createUsers(_options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.createUsers(_options);
        return result.toPromise();
    }

    /**
     * Deduct User Integral
     * @param integralDeductRo
     */
    public deductWithHttpInfo(integralDeductRo: IntegralDeductRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deductWithHttpInfo(integralDeductRo, _options);
        return result.toPromise();
    }

    /**
     * Deduct User Integral
     * @param integralDeductRo
     */
    public deduct(integralDeductRo: IntegralDeductRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deduct(integralDeductRo, _options);
        return result.toPromise();
    }

    /**
     * Remove laboratory feature
     * @param featureKey laboratory feature unique identifier
     */
    public deleteLabsFeatureWithHttpInfo(featureKey: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteLabsFeatureWithHttpInfo(featureKey, _options);
        return result.toPromise();
    }

    /**
     * Remove laboratory feature
     * @param featureKey laboratory feature unique identifier
     */
    public deleteLabsFeature(featureKey: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteLabsFeature(featureKey, _options);
        return result.toPromise();
    }

    /**
     * Enable specified space chatbot feature
     * @param chatbotEnableRo
     */
    public enableChatbotWithHttpInfo(chatbotEnableRo: ChatbotEnableRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.enableChatbotWithHttpInfo(chatbotEnableRo, _options);
        return result.toPromise();
    }

    /**
     * Enable specified space chatbot feature
     * @param chatbotEnableRo
     */
    public enableChatbot(chatbotEnableRo: ChatbotEnableRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.enableChatbot(chatbotEnableRo, _options);
        return result.toPromise();
    }

    /**
     * Manually execute compensation of feishu event
     * @param tenantId
     */
    public feishuTenantEventWithHttpInfo(tenantId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.feishuTenantEventWithHttpInfo(tenantId, _options);
        return result.toPromise();
    }

    /**
     * Manually execute compensation of feishu event
     * @param tenantId
     */
    public feishuTenantEvent(tenantId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.feishuTenantEvent(tenantId, _options);
        return result.toPromise();
    }

    /**
     * Query User Integral
     * @param userId User ID
     * @param areaCode Area Code
     * @param credential Account Credential（mobile or email）
     */
    public get1WithHttpInfo(userId?: number, areaCode?: number, credential?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataInteger>> {
        const result = this.api.get1WithHttpInfo(userId, areaCode, credential, _options);
        return result.toPromise();
    }

    /**
     * Query User Integral
     * @param userId User ID
     * @param areaCode Area Code
     * @param credential Account Credential（mobile or email）
     */
    public get1(userId?: number, areaCode?: number, credential?: string, _options?: Configuration): Promise<ResponseDataInteger> {
        const result = this.api.get1(userId, areaCode, credential, _options);
        return result.toPromise();
    }

    /**
     * Lock verification
     * @param unlockRo
     */
    public lockWithHttpInfo(unlockRo: UnlockRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.lockWithHttpInfo(unlockRo, _options);
        return result.toPromise();
    }

    /**
     * Lock verification
     * @param unlockRo
     */
    public lock(unlockRo: UnlockRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.lock(unlockRo, _options);
        return result.toPromise();
    }

    /**
     * Reset the active state of the user
     * @param userActivityRo
     */
    public resetActivityWithHttpInfo(userActivityRo?: UserActivityRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.resetActivityWithHttpInfo(userActivityRo, _options);
        return result.toPromise();
    }

    /**
     * Reset the active state of the user
     * @param userActivityRo
     */
    public resetActivity(userActivityRo?: UserActivityRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.resetActivity(userActivityRo, _options);
        return result.toPromise();
    }

    /**
     * Cancel a player notification, deleted from the notification center
     * Cancel a player notification
     * @param notificationRevokeRo
     */
    public revokePlayerNotifyWithHttpInfo(notificationRevokeRo: NotificationRevokeRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.revokePlayerNotifyWithHttpInfo(notificationRevokeRo, _options);
        return result.toPromise();
    }

    /**
     * Cancel a player notification, deleted from the notification center
     * Cancel a player notification
     * @param notificationRevokeRo
     */
    public revokePlayerNotify(notificationRevokeRo: NotificationRevokeRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.revokePlayerNotify(notificationRevokeRo, _options);
        return result.toPromise();
    }

    /**
     * create dingTalk app
     * @param syncSocialDingTalkAppRo
     */
    public syncDingTalkAppWithHttpInfo(syncSocialDingTalkAppRo: Array<SyncSocialDingTalkAppRo>, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.syncDingTalkAppWithHttpInfo(syncSocialDingTalkAppRo, _options);
        return result.toPromise();
    }

    /**
     * create dingTalk app
     * @param syncSocialDingTalkAppRo
     */
    public syncDingTalkApp(syncSocialDingTalkAppRo: Array<SyncSocialDingTalkAppRo>, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.syncDingTalkApp(syncSocialDingTalkAppRo, _options);
        return result.toPromise();
    }

    /**
     * Unlock verification
     * @param unlockRo
     */
    public unlockWithHttpInfo(unlockRo: UnlockRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.unlockWithHttpInfo(unlockRo, _options);
        return result.toPromise();
    }

    /**
     * Unlock verification
     * @param unlockRo
     */
    public unlock(unlockRo: UnlockRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.unlock(unlockRo, _options);
        return result.toPromise();
    }

    /**
     * Modify laboratory feature attribute
     * @param gmLabsFeatureCreatorRo
     */
    public updateLabsFeaturesAttributeWithHttpInfo(gmLabsFeatureCreatorRo: GmLabsFeatureCreatorRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateLabsFeaturesAttributeWithHttpInfo(gmLabsFeatureCreatorRo, _options);
        return result.toPromise();
    }

    /**
     * Modify laboratory feature attribute
     * @param gmLabsFeatureCreatorRo
     */
    public updateLabsFeaturesAttribute(gmLabsFeatureCreatorRo: GmLabsFeatureCreatorRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateLabsFeaturesAttribute(gmLabsFeatureCreatorRo, _options);
        return result.toPromise();
    }

    /**
     * Update GM permission config
     * @param configDatasheetRo
     */
    public updatePermissionWithHttpInfo(configDatasheetRo: ConfigDatasheetRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updatePermissionWithHttpInfo(configDatasheetRo, _options);
        return result.toPromise();
    }

    /**
     * Update GM permission config
     * @param configDatasheetRo
     */
    public updatePermission(configDatasheetRo: ConfigDatasheetRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updatePermission(configDatasheetRo, _options);
        return result.toPromise();
    }

    /**
     * query user\'s mobile phone and email by user\'s id
     * @param queryUserInfoRo
     */
    public userContactInfoQueryWithHttpInfo(queryUserInfoRo: QueryUserInfoRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.userContactInfoQueryWithHttpInfo(queryUserInfoRo, _options);
        return result.toPromise();
    }

    /**
     * query user\'s mobile phone and email by user\'s id
     * @param queryUserInfoRo
     */
    public userContactInfoQuery(queryUserInfoRo: QueryUserInfoRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.userContactInfoQuery(queryUserInfoRo, _options);
        return result.toPromise();
    }


}



import { ObservableClientInterfaceApi } from './ObservableAPI';

import { ClientInterfaceApiRequestFactory, ClientInterfaceApiResponseProcessor} from "../apis/ClientInterfaceApi";
export class PromiseClientInterfaceApi {
    private api: ObservableClientInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ClientInterfaceApiRequestFactory,
        responseProcessor?: ClientInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableClientInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get the application client version rendering information
     * Get application version information
     * @param spaceId
     * @param pipeline Construction serial number
     */
    public getTemplateInfoWithHttpInfo(spaceId?: string, pipeline?: string, _options?: Configuration): Promise<HttpInfo<ClientInfoVO>> {
        const result = this.api.getTemplateInfoWithHttpInfo(spaceId, pipeline, _options);
        return result.toPromise();
    }

    /**
     * Get the application client version rendering information
     * Get application version information
     * @param spaceId
     * @param pipeline Construction serial number
     */
    public getTemplateInfo(spaceId?: string, pipeline?: string, _options?: Configuration): Promise<ClientInfoVO> {
        const result = this.api.getTemplateInfo(spaceId, pipeline, _options);
        return result.toPromise();
    }


}



import { ObservableConfigurationRelatedInterfacesApi } from './ObservableAPI';

import { ConfigurationRelatedInterfacesApiRequestFactory, ConfigurationRelatedInterfacesApiResponseProcessor} from "../apis/ConfigurationRelatedInterfacesApi";
export class PromiseConfigurationRelatedInterfacesApi {
    private api: ObservableConfigurationRelatedInterfacesApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ConfigurationRelatedInterfacesApiRequestFactory,
        responseProcessor?: ConfigurationRelatedInterfacesApiResponseProcessor
    ) {
        this.api = new ObservableConfigurationRelatedInterfacesApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Scenario: novice guidance, announcement
     * General configuration
     * @param configRo
     */
    public generalWithHttpInfo(configRo: ConfigRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.generalWithHttpInfo(configRo, _options);
        return result.toPromise();
    }

    /**
     * Scenario: novice guidance, announcement
     * General configuration
     * @param configRo
     */
    public general(configRo: ConfigRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.general(configRo, _options);
        return result.toPromise();
    }

    /**
     * Get configuration information
     * @param lang language
     */
    public get2WithHttpInfo(lang?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataObject>> {
        const result = this.api.get2WithHttpInfo(lang, _options);
        return result.toPromise();
    }

    /**
     * Get configuration information
     * @param lang language
     */
    public get2(lang?: string, _options?: Configuration): Promise<ResponseDataObject> {
        const result = this.api.get2(lang, _options);
        return result.toPromise();
    }


}



import { ObservableContactMemberApiApi } from './ObservableAPI';

import { ContactMemberApiApiRequestFactory, ContactMemberApiApiResponseProcessor} from "../apis/ContactMemberApiApi";
export class PromiseContactMemberApiApi {
    private api: ObservableContactMemberApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ContactMemberApiApiRequestFactory,
        responseProcessor?: ContactMemberApiApiResponseProcessor
    ) {
        this.api = new ObservableContactMemberApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * When adding new members, they can only be selected from within the organization structure and can be transferred by department
     * Add member
     * @param teamAddMemberRo
     * @param xSpaceId space id
     */
    public addMemberWithHttpInfo(teamAddMemberRo: TeamAddMemberRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.addMemberWithHttpInfo(teamAddMemberRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * When adding new members, they can only be selected from within the organization structure and can be transferred by department
     * Add member
     * @param teamAddMemberRo
     * @param xSpaceId space id
     */
    public addMember(teamAddMemberRo: TeamAddMemberRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.addMember(teamAddMemberRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Check whether email in space
     * Check whether email in space
     * @param email email
     * @param xSpaceId space id
     */
    public checkEmailInSpaceWithHttpInfo(email: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        const result = this.api.checkEmailInSpaceWithHttpInfo(email, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Check whether email in space
     * Check whether email in space
     * @param email email
     * @param xSpaceId space id
     */
    public checkEmailInSpace(email: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataBoolean> {
        const result = this.api.checkEmailInSpace(email, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * action provides two deletion modes，1.delete from organization 2. delete from team
     * Delete members
     * @param deleteBatchMemberRo
     * @param xSpaceId space id
     */
    public deleteBatchMemberWithHttpInfo(deleteBatchMemberRo: DeleteBatchMemberRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteBatchMemberWithHttpInfo(deleteBatchMemberRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * action provides two deletion modes，1.delete from organization 2. delete from team
     * Delete members
     * @param deleteBatchMemberRo
     * @param xSpaceId space id
     */
    public deleteBatchMember(deleteBatchMemberRo: DeleteBatchMemberRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteBatchMember(deleteBatchMemberRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * action provides two deletion modes.1.delete from organization 2. delete from team
     * Delete a Member
     * @param deleteMemberRo
     * @param xSpaceId space id
     */
    public deleteMemberWithHttpInfo(deleteMemberRo: DeleteMemberRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteMemberWithHttpInfo(deleteMemberRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * action provides two deletion modes.1.delete from organization 2. delete from team
     * Delete a Member
     * @param deleteMemberRo
     * @param xSpaceId space id
     */
    public deleteMember(deleteMemberRo: DeleteMemberRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteMember(deleteMemberRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Download contact template
     * Download contact template
     */
    public downloadTemplateWithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.downloadTemplateWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Download contact template
     * Download contact template
     */
    public downloadTemplate(_options?: Configuration): Promise<void> {
        const result = this.api.downloadTemplate(_options);
        return result.toPromise();
    }

    /**
     * Query all the members of the department, including the members of the sub department.if root team can lack teamId, teamId default 0.
     * Query the team\'s members
     * @param xSpaceId space id
     * @param teamId team id. if root team can lack teamId, teamId default 0.
     */
    public getMemberListWithHttpInfo(xSpaceId: string, teamId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListMemberInfoVo>> {
        const result = this.api.getMemberListWithHttpInfo(xSpaceId, teamId, _options);
        return result.toPromise();
    }

    /**
     * Query all the members of the department, including the members of the sub department.if root team can lack teamId, teamId default 0.
     * Query the team\'s members
     * @param xSpaceId space id
     * @param teamId team id. if root team can lack teamId, teamId default 0.
     */
    public getMemberList(xSpaceId: string, teamId?: string, _options?: Configuration): Promise<ResponseDataListMemberInfoVo> {
        const result = this.api.getMemberList(xSpaceId, teamId, _options);
        return result.toPromise();
    }

    /**
     * Fuzzy Search Members
     * Fuzzy Search Members
     * @param keyword keyword
     * @param xSpaceId space id
     * @param filter whether to filter unadded members
     * @param className the highlighting style
     */
    public getMembersWithHttpInfo(keyword: string, xSpaceId: string, filter?: boolean, className?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListSearchMemberVo>> {
        const result = this.api.getMembersWithHttpInfo(keyword, xSpaceId, filter, className, _options);
        return result.toPromise();
    }

    /**
     * Fuzzy Search Members
     * Fuzzy Search Members
     * @param keyword keyword
     * @param xSpaceId space id
     * @param filter whether to filter unadded members
     * @param className the highlighting style
     */
    public getMembers(keyword: string, xSpaceId: string, filter?: boolean, className?: string, _options?: Configuration): Promise<ResponseDataListSearchMemberVo> {
        const result = this.api.getMembers(keyword, xSpaceId, filter, className, _options);
        return result.toPromise();
    }

    /**
     * Query the units which a user belongs, include self
     * Query the units which a user belongs in space
     * @param xSpaceId space id
     */
    public getUnitsWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataMemberUnitsVo>> {
        const result = this.api.getUnitsWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Query the units which a user belongs, include self
     * Query the units which a user belongs in space
     * @param xSpaceId space id
     */
    public getUnits(xSpaceId: string, _options?: Configuration): Promise<ResponseDataMemberUnitsVo> {
        const result = this.api.getUnits(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Send an email to invite. The email is automatically bound to the platform user. The invited member will be in the state to be activated, and will not take effect until the user self activates.
     * Send an email to invite members
     * @param inviteRo
     * @param xSpaceId space id
     */
    public inviteMemberWithHttpInfo(inviteRo: InviteRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataMemberUnitsVo>> {
        const result = this.api.inviteMemberWithHttpInfo(inviteRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Send an email to invite. The email is automatically bound to the platform user. The invited member will be in the state to be activated, and will not take effect until the user self activates.
     * Send an email to invite members
     * @param inviteRo
     * @param xSpaceId space id
     */
    public inviteMember(inviteRo: InviteRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataMemberUnitsVo> {
        const result = this.api.inviteMember(inviteRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * If a member is not activated, it can send an invitation again regardless of whether the invitation has expired. After the invitation is successfully sent, the invitation link sent last time will be invalid.
     * Again send an email to invite members
     * @param inviteMemberAgainRo
     * @param xSpaceId space id
     */
    public inviteMemberSingleWithHttpInfo(inviteMemberAgainRo: InviteMemberAgainRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.inviteMemberSingleWithHttpInfo(inviteMemberAgainRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * If a member is not activated, it can send an invitation again regardless of whether the invitation has expired. After the invitation is successfully sent, the invitation link sent last time will be invalid.
     * Again send an email to invite members
     * @param inviteMemberAgainRo
     * @param xSpaceId space id
     */
    public inviteMemberSingle(inviteMemberAgainRo: InviteMemberAgainRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.inviteMemberSingle(inviteMemberAgainRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get member\'s detail info
     * Get member\'s detail info
     * @param xSpaceId space id
     * @param memberId member id
     * @param uuid user uuid
     */
    public read1WithHttpInfo(xSpaceId: string, memberId?: string, uuid?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataMemberInfoVo>> {
        const result = this.api.read1WithHttpInfo(xSpaceId, memberId, uuid, _options);
        return result.toPromise();
    }

    /**
     * Get member\'s detail info
     * Get member\'s detail info
     * @param xSpaceId space id
     * @param memberId member id
     * @param uuid user uuid
     */
    public read1(xSpaceId: string, memberId?: string, uuid?: string, _options?: Configuration): Promise<ResponseDataMemberInfoVo> {
        const result = this.api.read1(xSpaceId, memberId, uuid, _options);
        return result.toPromise();
    }

    /**
     * Query all the members of the department,  including the members of the sub department. The query must be paging not full query. Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page query the team\'s member
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     * @param teamId team id. if root team can lack teamId, teamId default 0.
     * @param isActive whether to filter unadded members
     */
    public readPageWithHttpInfo(page: Page, xSpaceId: string, pageObjectParams: string, teamId?: string, isActive?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoMemberPageVo>> {
        const result = this.api.readPageWithHttpInfo(page, xSpaceId, pageObjectParams, teamId, isActive, _options);
        return result.toPromise();
    }

    /**
     * Query all the members of the department,  including the members of the sub department. The query must be paging not full query. Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page query the team\'s member
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     * @param teamId team id. if root team can lack teamId, teamId default 0.
     * @param isActive whether to filter unadded members
     */
    public readPage(page: Page, xSpaceId: string, pageObjectParams: string, teamId?: string, isActive?: string, _options?: Configuration): Promise<ResponseDataPageInfoMemberPageVo> {
        const result = this.api.readPage(page, xSpaceId, pageObjectParams, teamId, isActive, _options);
        return result.toPromise();
    }

    /**
     * Edit self member information
     * Edit self member information
     * @param updateMemberOpRo
     * @param xSpaceId space id
     */
    public update4WithHttpInfo(updateMemberOpRo: UpdateMemberOpRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.update4WithHttpInfo(updateMemberOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Edit self member information
     * Edit self member information
     * @param updateMemberOpRo
     * @param xSpaceId space id
     */
    public update4(updateMemberOpRo: UpdateMemberOpRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.update4(updateMemberOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Edit member info
     * Edit member info
     * @param updateMemberRo
     * @param xSpaceId space id
     */
    public updateInfoWithHttpInfo(updateMemberRo: UpdateMemberRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateInfoWithHttpInfo(updateMemberRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Edit member info
     * Edit member info
     * @param updateMemberRo
     * @param xSpaceId space id
     */
    public updateInfo(updateMemberRo: UpdateMemberRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateInfo(updateMemberRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * assign members to departments
     * Update team
     * @param updateMemberTeamRo
     * @param xSpaceId space id
     */
    public updateTeam1WithHttpInfo(updateMemberTeamRo: UpdateMemberTeamRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateTeam1WithHttpInfo(updateMemberTeamRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * assign members to departments
     * Update team
     * @param updateMemberTeamRo
     * @param xSpaceId space id
     */
    public updateTeam1(updateMemberTeamRo: UpdateMemberTeamRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateTeam1(updateMemberTeamRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Upload employee sheet，then parse it.
     * Upload employee sheet
     * @param data
     * @param xSpaceId space id
     */
    public uploadExcelWithHttpInfo(data: UploadMemberTemplateRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataUploadParseResultVO>> {
        const result = this.api.uploadExcelWithHttpInfo(data, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Upload employee sheet，then parse it.
     * Upload employee sheet
     * @param data
     * @param xSpaceId space id
     */
    public uploadExcel(data: UploadMemberTemplateRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataUploadParseResultVO> {
        const result = this.api.uploadExcel(data, xSpaceId, _options);
        return result.toPromise();
    }


}



import { ObservableContactOrganizationApiApi } from './ObservableAPI';

import { ContactOrganizationApiApiRequestFactory, ContactOrganizationApiApiResponseProcessor} from "../apis/ContactOrganizationApiApi";
export class PromiseContactOrganizationApiApi {
    private api: ObservableContactOrganizationApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ContactOrganizationApiApiRequestFactory,
        responseProcessor?: ContactOrganizationApiApiResponseProcessor
    ) {
        this.api = new ObservableContactOrganizationApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Query the sub departments and members of department. if team id lack, default is 0
     * Query the sub departments and members of department
     * @param teamId team id
     * @param linkId link id: node share id | template id
     * @param xSpaceId space id
     */
    public getSubUnitListWithHttpInfo(teamId?: string, linkId?: string, xSpaceId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataSubUnitResultVo>> {
        const result = this.api.getSubUnitListWithHttpInfo(teamId, linkId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Query the sub departments and members of department. if team id lack, default is 0
     * Query the sub departments and members of department
     * @param teamId team id
     * @param linkId link id: node share id | template id
     * @param xSpaceId space id
     */
    public getSubUnitList(teamId?: string, linkId?: string, xSpaceId?: string, _options?: Configuration): Promise<ResponseDataSubUnitResultVo> {
        const result = this.api.getSubUnitList(teamId, linkId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10
     * Load/search departments and members
     * @param params
     * @param xSpaceId space id
     * @param linkId link id: node share id | template id
     * @param keyword keyword
     * @param unitIds unitIds
     * @param filterIds specifies the organizational unit to filter
     * @param all whether to load all departments and members
     * @param searchEmail whether to search for emails
     */
    public loadOrSearchWithHttpInfo(params: LoadSearchDTO, xSpaceId?: string, linkId?: string, keyword?: string, unitIds?: string, filterIds?: string, all?: boolean, searchEmail?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataListUnitInfoVo>> {
        const result = this.api.loadOrSearchWithHttpInfo(params, xSpaceId, linkId, keyword, unitIds, filterIds, all, searchEmail, _options);
        return result.toPromise();
    }

    /**
     * The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10
     * Load/search departments and members
     * @param params
     * @param xSpaceId space id
     * @param linkId link id: node share id | template id
     * @param keyword keyword
     * @param unitIds unitIds
     * @param filterIds specifies the organizational unit to filter
     * @param all whether to load all departments and members
     * @param searchEmail whether to search for emails
     */
    public loadOrSearch(params: LoadSearchDTO, xSpaceId?: string, linkId?: string, keyword?: string, unitIds?: string, filterIds?: string, all?: boolean, searchEmail?: boolean, _options?: Configuration): Promise<ResponseDataListUnitInfoVo> {
        const result = this.api.loadOrSearch(params, xSpaceId, linkId, keyword, unitIds, filterIds, all, searchEmail, _options);
        return result.toPromise();
    }

    /**
     * Provide input word fuzzy search organization resources
     * search organization resources
     * @param keyword keyword
     * @param linkId link id: node share id | template id
     * @param className the highlight style
     * @param xSpaceId space id
     */
    public searchWithHttpInfo(keyword: string, linkId?: string, className?: string, xSpaceId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataUnitSearchResultVo>> {
        const result = this.api.searchWithHttpInfo(keyword, linkId, className, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Provide input word fuzzy search organization resources
     * search organization resources
     * @param keyword keyword
     * @param linkId link id: node share id | template id
     * @param className the highlight style
     * @param xSpaceId space id
     */
    public search(keyword: string, linkId?: string, className?: string, xSpaceId?: string, _options?: Configuration): Promise<ResponseDataUnitSearchResultVo> {
        const result = this.api.search(keyword, linkId, className, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * fuzzy search unit
     * Search departments or members（it will be abandoned）
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className the highlight style
     */
    public searchSubTeamAndMembersWithHttpInfo(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListOrganizationUnitVo>> {
        const result = this.api.searchSubTeamAndMembersWithHttpInfo(keyword, xSpaceId, className, _options);
        return result.toPromise();
    }

    /**
     * fuzzy search unit
     * Search departments or members（it will be abandoned）
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className the highlight style
     */
    public searchSubTeamAndMembers(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Promise<ResponseDataListOrganizationUnitVo> {
        const result = this.api.searchSubTeamAndMembers(keyword, xSpaceId, className, _options);
        return result.toPromise();
    }

    /**
     * fuzzy search department or members
     * Global search
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className the highlight style
     */
    public searchTeamInfoWithHttpInfo(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataSearchResultVo>> {
        const result = this.api.searchTeamInfoWithHttpInfo(keyword, xSpaceId, className, _options);
        return result.toPromise();
    }

    /**
     * fuzzy search department or members
     * Global search
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className the highlight style
     */
    public searchTeamInfo(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Promise<ResponseDataSearchResultVo> {
        const result = this.api.searchTeamInfo(keyword, xSpaceId, className, _options);
        return result.toPromise();
    }

    /**
     * scenario field conversion（If the amount of data is large, the content requested by GET will exceed the limit.）
     * accurately query departments and members
     * @param searchUnitRo
     * @param xSpaceId space id
     */
    public searchUnitInfoVoWithHttpInfo(searchUnitRo: SearchUnitRo, xSpaceId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListUnitInfoVo>> {
        const result = this.api.searchUnitInfoVoWithHttpInfo(searchUnitRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * scenario field conversion（If the amount of data is large, the content requested by GET will exceed the limit.）
     * accurately query departments and members
     * @param searchUnitRo
     * @param xSpaceId space id
     */
    public searchUnitInfoVo(searchUnitRo: SearchUnitRo, xSpaceId?: string, _options?: Configuration): Promise<ResponseDataListUnitInfoVo> {
        const result = this.api.searchUnitInfoVo(searchUnitRo, xSpaceId, _options);
        return result.toPromise();
    }


}



import { ObservableContactsRoleApiApi } from './ObservableAPI';

import { ContactsRoleApiApiRequestFactory, ContactsRoleApiApiResponseProcessor} from "../apis/ContactsRoleApiApi";
export class PromiseContactsRoleApiApi {
    private api: ObservableContactsRoleApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ContactsRoleApiApiRequestFactory,
        responseProcessor?: ContactsRoleApiApiResponseProcessor
    ) {
        this.api = new ObservableContactsRoleApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * add role members
     * add role members
     * @param addRoleMemberRo
     * @param roleId
     * @param xSpaceId space id
     * @param roleId2
     */
    public addRoleMembersWithHttpInfo(addRoleMemberRo: AddRoleMemberRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.addRoleMembersWithHttpInfo(addRoleMemberRo, roleId, xSpaceId, roleId2, _options);
        return result.toPromise();
    }

    /**
     * add role members
     * add role members
     * @param addRoleMemberRo
     * @param roleId
     * @param xSpaceId space id
     * @param roleId2
     */
    public addRoleMembers(addRoleMemberRo: AddRoleMemberRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.addRoleMembers(addRoleMemberRo, roleId, xSpaceId, roleId2, _options);
        return result.toPromise();
    }

    /**
     * create new role
     * create new role
     * @param createRoleRo
     * @param xSpaceId space id
     */
    public createRoleWithHttpInfo(createRoleRo: CreateRoleRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.createRoleWithHttpInfo(createRoleRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * create new role
     * create new role
     * @param createRoleRo
     * @param xSpaceId space id
     */
    public createRole(createRoleRo: CreateRoleRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.createRole(createRoleRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * delete role
     * delete role
     * @param roleId
     * @param xSpaceId space id
     * @param roleId2
     */
    public deleteRole1WithHttpInfo(roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteRole1WithHttpInfo(roleId, xSpaceId, roleId2, _options);
        return result.toPromise();
    }

    /**
     * delete role
     * delete role
     * @param roleId
     * @param xSpaceId space id
     * @param roleId2
     */
    public deleteRole1(roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteRole1(roleId, xSpaceId, roleId2, _options);
        return result.toPromise();
    }

    /**
     * query the role\'s members
     * query role members
     * @param roleId
     * @param page
     * @param xSpaceId space id
     * @param roleId2
     * @param pageObjectParams page parameters
     */
    public getRoleMembersWithHttpInfo(roleId: number, page: PageVoid, xSpaceId: string, roleId2: string, pageObjectParams: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoRoleMemberVo>> {
        const result = this.api.getRoleMembersWithHttpInfo(roleId, page, xSpaceId, roleId2, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * query the role\'s members
     * query role members
     * @param roleId
     * @param page
     * @param xSpaceId space id
     * @param roleId2
     * @param pageObjectParams page parameters
     */
    public getRoleMembers(roleId: number, page: PageVoid, xSpaceId: string, roleId2: string, pageObjectParams: string, _options?: Configuration): Promise<ResponseDataPageInfoRoleMemberVo> {
        const result = this.api.getRoleMembers(roleId, page, xSpaceId, roleId2, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * query the space\'s roles
     * query roles
     * @param xSpaceId space id
     */
    public getRolesWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListRoleInfoVo>> {
        const result = this.api.getRolesWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * query the space\'s roles
     * query roles
     * @param xSpaceId space id
     */
    public getRoles(xSpaceId: string, _options?: Configuration): Promise<ResponseDataListRoleInfoVo> {
        const result = this.api.getRoles(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * create init role
     * create init role
     * @param xSpaceId space id
     */
    public initRolesWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.initRolesWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * create init role
     * create init role
     * @param xSpaceId space id
     */
    public initRoles(xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.initRoles(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * remove role members
     * remove role members
     * @param deleteRoleMemberRo
     * @param roleId
     * @param xSpaceId space id
     * @param roleId2
     */
    public removeRoleMembersWithHttpInfo(deleteRoleMemberRo: DeleteRoleMemberRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.removeRoleMembersWithHttpInfo(deleteRoleMemberRo, roleId, xSpaceId, roleId2, _options);
        return result.toPromise();
    }

    /**
     * remove role members
     * remove role members
     * @param deleteRoleMemberRo
     * @param roleId
     * @param xSpaceId space id
     * @param roleId2
     */
    public removeRoleMembers(deleteRoleMemberRo: DeleteRoleMemberRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.removeRoleMembers(deleteRoleMemberRo, roleId, xSpaceId, roleId2, _options);
        return result.toPromise();
    }

    /**
     * update role information
     * update role information
     * @param updateRoleRo
     * @param roleId
     * @param xSpaceId space id
     * @param roleId2
     */
    public updateRoleWithHttpInfo(updateRoleRo: UpdateRoleRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateRoleWithHttpInfo(updateRoleRo, roleId, xSpaceId, roleId2, _options);
        return result.toPromise();
    }

    /**
     * update role information
     * update role information
     * @param updateRoleRo
     * @param roleId
     * @param xSpaceId space id
     * @param roleId2
     */
    public updateRole(updateRoleRo: UpdateRoleRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateRole(updateRoleRo, roleId, xSpaceId, roleId2, _options);
        return result.toPromise();
    }


}



import { ObservableContactsTeamApiApi } from './ObservableAPI';

import { ContactsTeamApiApiRequestFactory, ContactsTeamApiApiResponseProcessor} from "../apis/ContactsTeamApiApi";
export class PromiseContactsTeamApiApi {
    private api: ObservableContactsTeamApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ContactsTeamApiApiRequestFactory,
        responseProcessor?: ContactsTeamApiApiResponseProcessor
    ) {
        this.api = new ObservableContactsTeamApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create team
     * Create team
     * @param createTeamRo
     * @param xSpaceId space id
     */
    public createTeamWithHttpInfo(createTeamRo: CreateTeamRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.createTeamWithHttpInfo(createTeamRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Create team
     * Create team
     * @param createTeamRo
     * @param xSpaceId space id
     */
    public createTeam(createTeamRo: CreateTeamRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.createTeam(createTeamRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete team. If team has members, it can be deleted.
     * Delete team
     * @param teamId team id
     * @param xSpaceId space id
     */
    public deleteTeamWithHttpInfo(teamId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteTeamWithHttpInfo(teamId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete team. If team has members, it can be deleted.
     * Delete team
     * @param teamId team id
     * @param xSpaceId space id
     */
    public deleteTeam(teamId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteTeam(teamId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * query sub team by team id. if team id lack, default root team.
     * Query direct sub departments
     * @param xSpaceId space id
     * @param teamId team id
     */
    public getSubTeamsWithHttpInfo(xSpaceId: string, teamId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListTeamTreeVo>> {
        const result = this.api.getSubTeamsWithHttpInfo(xSpaceId, teamId, _options);
        return result.toPromise();
    }

    /**
     * query sub team by team id. if team id lack, default root team.
     * Query direct sub departments
     * @param xSpaceId space id
     * @param teamId team id
     */
    public getSubTeams(xSpaceId: string, teamId?: string, _options?: Configuration): Promise<ResponseDataListTeamTreeVo> {
        const result = this.api.getSubTeams(xSpaceId, teamId, _options);
        return result.toPromise();
    }

    /**
     * team branch. result is tree
     * team branch
     * @param xSpaceId space id
     */
    public getTeamBranchWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListTeamTreeVo>> {
        const result = this.api.getTeamBranchWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * team branch. result is tree
     * team branch
     * @param xSpaceId space id
     */
    public getTeamBranch(xSpaceId: string, _options?: Configuration): Promise<ResponseDataListTeamTreeVo> {
        const result = this.api.getTeamBranch(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Query the team\'s members, no include sub team\'s
     * Query the team\'s members
     * @param teamId team id
     * @param xSpaceId space id
     */
    public getTeamMembersWithHttpInfo(teamId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListMemberPageVo>> {
        const result = this.api.getTeamMembersWithHttpInfo(teamId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Query the team\'s members, no include sub team\'s
     * Query the team\'s members
     * @param teamId team id
     * @param xSpaceId space id
     */
    public getTeamMembers(teamId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataListMemberPageVo> {
        const result = this.api.getTeamMembers(teamId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Query team tree
     * @param xSpaceId space id
     * @param depth tree depth(default:1,max:2)
     */
    public getTeamTreeWithHttpInfo(xSpaceId: string, depth?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataListTeamTreeVo>> {
        const result = this.api.getTeamTreeWithHttpInfo(xSpaceId, depth, _options);
        return result.toPromise();
    }

    /**
     * Query team tree
     * @param xSpaceId space id
     * @param depth tree depth(default:1,max:2)
     */
    public getTeamTree(xSpaceId: string, depth?: number, _options?: Configuration): Promise<ResponseDataListTeamTreeVo> {
        const result = this.api.getTeamTree(xSpaceId, depth, _options);
        return result.toPromise();
    }

    /**
     * Query department information. if team id lack, default root team
     * Query team information
     * @param xSpaceId space id
     * @param teamId team id
     */
    public readTeamInfoWithHttpInfo(xSpaceId: string, teamId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataTeamInfoVo>> {
        const result = this.api.readTeamInfoWithHttpInfo(xSpaceId, teamId, _options);
        return result.toPromise();
    }

    /**
     * Query department information. if team id lack, default root team
     * Query team information
     * @param xSpaceId space id
     * @param teamId team id
     */
    public readTeamInfo(xSpaceId: string, teamId?: string, _options?: Configuration): Promise<ResponseDataTeamInfoVo> {
        const result = this.api.readTeamInfo(xSpaceId, teamId, _options);
        return result.toPromise();
    }

    /**
     * Update team info. If modify team level,default sort in the end of parent team.
     * Update team info
     * @param updateTeamRo
     * @param xSpaceId space id
     */
    public updateTeamWithHttpInfo(updateTeamRo: UpdateTeamRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateTeamWithHttpInfo(updateTeamRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Update team info. If modify team level,default sort in the end of parent team.
     * Update team info
     * @param updateTeamRo
     * @param xSpaceId space id
     */
    public updateTeam(updateTeamRo: UpdateTeamRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateTeam(updateTeamRo, xSpaceId, _options);
        return result.toPromise();
    }


}



import { ObservableContentRiskControlAPIApi } from './ObservableAPI';

import { ContentRiskControlAPIApiRequestFactory, ContentRiskControlAPIApiResponseProcessor} from "../apis/ContentRiskControlAPIApi";
export class PromiseContentRiskControlAPIApi {
    private api: ObservableContentRiskControlAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ContentRiskControlAPIApiRequestFactory,
        responseProcessor?: ContentRiskControlAPIApiResponseProcessor
    ) {
        this.api = new ObservableContentRiskControlAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Submit a report
     * @param contentCensorReportRo
     */
    public createReportsWithHttpInfo(contentCensorReportRo: ContentCensorReportRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.createReportsWithHttpInfo(contentCensorReportRo, _options);
        return result.toPromise();
    }

    /**
     * Submit a report
     * @param contentCensorReportRo
     */
    public createReports(contentCensorReportRo: ContentCensorReportRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.createReports(contentCensorReportRo, _options);
        return result.toPromise();
    }

    /**
     * Paging query report information list, each table corresponds to a row of records, and the number of reports is automatically accumulatedDescription of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Paging query report information list
     * @param status Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)
     * @param page
     * @param pageObjectParams Paging parameters, see the interface description for instructions
     */
    public readReportsWithHttpInfo(status: number, page: Page, pageObjectParams: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoContentCensorResultVo>> {
        const result = this.api.readReportsWithHttpInfo(status, page, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Paging query report information list, each table corresponds to a row of records, and the number of reports is automatically accumulatedDescription of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Paging query report information list
     * @param status Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)
     * @param page
     * @param pageObjectParams Paging parameters, see the interface description for instructions
     */
    public readReports(status: number, page: Page, pageObjectParams: string, _options?: Configuration): Promise<ResponseDataPageInfoContentCensorResultVo> {
        const result = this.api.readReports(status, page, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Force to open in DingTalk, automatically acquire DingTalk users
     * Handling whistleblower information
     * @param nodeId node id
     * @param status Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)
     */
    public updateReportsWithHttpInfo(nodeId: string, status: number, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateReportsWithHttpInfo(nodeId, status, _options);
        return result.toPromise();
    }

    /**
     * Force to open in DingTalk, automatically acquire DingTalk users
     * Handling whistleblower information
     * @param nodeId node id
     * @param status Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)
     */
    public updateReports(nodeId: string, status: number, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateReports(nodeId, status, _options);
        return result.toPromise();
    }


}



import { ObservableDeveloperConfigAPIApi } from './ObservableAPI';

import { DeveloperConfigAPIApiRequestFactory, DeveloperConfigAPIApiResponseProcessor} from "../apis/DeveloperConfigAPIApi";
export class PromiseDeveloperConfigAPIApi {
    private api: ObservableDeveloperConfigAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DeveloperConfigAPIApiRequestFactory,
        responseProcessor?: DeveloperConfigAPIApiResponseProcessor
    ) {
        this.api = new ObservableDeveloperConfigAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create developer access tokens to access open platform functionality.
     * Create the developer access token
     */
    public createApiKeyWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataDeveloperInfoVo>> {
        const result = this.api.createApiKeyWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Create developer access tokens to access open platform functionality.
     * Create the developer access token
     */
    public createApiKey(_options?: Configuration): Promise<ResponseDataDeveloperInfoVo> {
        const result = this.api.createApiKey(_options);
        return result.toPromise();
    }

    /**
     * Refresh developer access token before verifying phone number.If there is no verification mailbox, skip verification.
     * Refresh the developer access token
     * @param refreshApiKeyRo
     */
    public refreshApiKeyWithHttpInfo(refreshApiKeyRo: RefreshApiKeyRo, _options?: Configuration): Promise<HttpInfo<ResponseDataDeveloperInfoVo>> {
        const result = this.api.refreshApiKeyWithHttpInfo(refreshApiKeyRo, _options);
        return result.toPromise();
    }

    /**
     * Refresh developer access token before verifying phone number.If there is no verification mailbox, skip verification.
     * Refresh the developer access token
     * @param refreshApiKeyRo
     */
    public refreshApiKey(refreshApiKeyRo: RefreshApiKeyRo, _options?: Configuration): Promise<ResponseDataDeveloperInfoVo> {
        const result = this.api.refreshApiKey(refreshApiKeyRo, _options);
        return result.toPromise();
    }

    /**
     * Provides a mid-tier validation access token.
     * Verify the access token
     * @param apiKey
     */
    public validateApiKeyWithHttpInfo(apiKey: string, _options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        const result = this.api.validateApiKeyWithHttpInfo(apiKey, _options);
        return result.toPromise();
    }

    /**
     * Provides a mid-tier validation access token.
     * Verify the access token
     * @param apiKey
     */
    public validateApiKey(apiKey: string, _options?: Configuration): Promise<ResponseDataBoolean> {
        const result = this.api.validateApiKey(apiKey, _options);
        return result.toPromise();
    }


}



import { ObservableDingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi } from './ObservableAPI';

import { DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiRequestFactory, DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiResponseProcessor} from "../apis/DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi";
export class PromiseDingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi {
    private api: ObservableDingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiRequestFactory,
        responseProcessor?: DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableDingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * After the login is completed, the system saves the user session by default, and calls other business interfaces to automatically bring the cookie
     * dingtalk user password free login
     * @param code temporary authorization code, uploaded by the client
     */
    public login1WithHttpInfo(code: string, _options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkUserDetail>> {
        const result = this.api.login1WithHttpInfo(code, _options);
        return result.toPromise();
    }

    /**
     * After the login is completed, the system saves the user session by default, and calls other business interfaces to automatically bring the cookie
     * dingtalk user password free login
     * @param code temporary authorization code, uploaded by the client
     */
    public login1(code: string, _options?: Configuration): Promise<ResponseDataDingTalkUserDetail> {
        const result = this.api.login1(code, _options);
        return result.toPromise();
    }


}



import { ObservableDingTalkServiceInterfaceApi } from './ObservableAPI';

import { DingTalkServiceInterfaceApiRequestFactory, DingTalkServiceInterfaceApiResponseProcessor} from "../apis/DingTalkServiceInterfaceApi";
export class PromiseDingTalkServiceInterfaceApi {
    private api: ObservableDingTalkServiceInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DingTalkServiceInterfaceApiRequestFactory,
        responseProcessor?: DingTalkServiceInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableDingTalkServiceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * DingTalk scan code login callback
     * @param code coding. JS gets the login Tmp Code, redirects and returns after jumping to the specified connection
     * @param state declare value. Used to prevent replay attacks
     * @param type Type (0: scan code to log in; 1: account binding;)
     */
    public callback3WithHttpInfo(code: string, state: string, type?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.callback3WithHttpInfo(code, state, type, _options);
        return result.toPromise();
    }

    /**
     * DingTalk scan code login callback
     * @param code coding. JS gets the login Tmp Code, redirects and returns after jumping to the specified connection
     * @param state declare value. Used to prevent replay attacks
     * @param type Type (0: scan code to log in; 1: account binding;)
     */
    public callback3(code: string, state: string, type?: number, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.callback3(code, state, type, _options);
        return result.toPromise();
    }


}



import { ObservableGMWidgetAPIApi } from './ObservableAPI';

import { GMWidgetAPIApiRequestFactory, GMWidgetAPIApiResponseProcessor} from "../apis/GMWidgetAPIApi";
export class PromiseGMWidgetAPIApi {
    private api: ObservableGMWidgetAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: GMWidgetAPIApiRequestFactory,
        responseProcessor?: GMWidgetAPIApiResponseProcessor
    ) {
        this.api = new ObservableGMWidgetAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * widget-cli ban/unban widget
     * Ban/Unban widget
     * @param widgetPackageBanRo
     * @param authorization developer token
     */
    public banWidgetWithHttpInfo(widgetPackageBanRo: WidgetPackageBanRo, authorization?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.banWidgetWithHttpInfo(widgetPackageBanRo, authorization, _options);
        return result.toPromise();
    }

    /**
     * widget-cli ban/unban widget
     * Ban/Unban widget
     * @param widgetPackageBanRo
     * @param authorization developer token
     */
    public banWidget(widgetPackageBanRo: WidgetPackageBanRo, authorization?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.banWidget(widgetPackageBanRo, authorization, _options);
        return result.toPromise();
    }

    /**
     * Refresh the global component DB data
     * @param globalWidgetListRo
     */
    public globalWidgetDbDataRefreshWithHttpInfo(globalWidgetListRo: GlobalWidgetListRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.globalWidgetDbDataRefreshWithHttpInfo(globalWidgetListRo, _options);
        return result.toPromise();
    }

    /**
     * Refresh the global component DB data
     * @param globalWidgetListRo
     */
    public globalWidgetDbDataRefresh(globalWidgetListRo: GlobalWidgetListRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.globalWidgetDbDataRefresh(globalWidgetListRo, _options);
        return result.toPromise();
    }

    /**
     * Gets a list of global widget stores
     * @param globalWidgetListRo
     */
    public globalWidgetListWithHttpInfo(globalWidgetListRo: GlobalWidgetListRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListGlobalWidgetInfo>> {
        const result = this.api.globalWidgetListWithHttpInfo(globalWidgetListRo, _options);
        return result.toPromise();
    }

    /**
     * Gets a list of global widget stores
     * @param globalWidgetListRo
     */
    public globalWidgetList(globalWidgetListRo: GlobalWidgetListRo, _options?: Configuration): Promise<ResponseDataListGlobalWidgetInfo> {
        const result = this.api.globalWidgetList(globalWidgetListRo, _options);
        return result.toPromise();
    }


}



import { ObservableIDaaSAddressBookApi } from './ObservableAPI';

import { IDaaSAddressBookApiRequestFactory, IDaaSAddressBookApiResponseProcessor} from "../apis/IDaaSAddressBookApi";
export class PromiseIDaaSAddressBookApi {
    private api: ObservableIDaaSAddressBookApi

    public constructor(
        configuration: Configuration,
        requestFactory?: IDaaSAddressBookApiRequestFactory,
        responseProcessor?: IDaaSAddressBookApiResponseProcessor
    ) {
        this.api = new ObservableIDaaSAddressBookApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Synchronize address book
     */
    public postSyncWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.postSyncWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Synchronize address book
     */
    public postSync(_options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.postSync(_options);
        return result.toPromise();
    }


}



import { ObservableIDaaSLoginAuthorizationApi } from './ObservableAPI';

import { IDaaSLoginAuthorizationApiRequestFactory, IDaaSLoginAuthorizationApiResponseProcessor} from "../apis/IDaaSLoginAuthorizationApi";
export class PromiseIDaaSLoginAuthorizationApi {
    private api: ObservableIDaaSLoginAuthorizationApi

    public constructor(
        configuration: Configuration,
        requestFactory?: IDaaSLoginAuthorizationApiRequestFactory,
        responseProcessor?: IDaaSLoginAuthorizationApiResponseProcessor
    ) {
        this.api = new ObservableIDaaSLoginAuthorizationApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get the IDaaS information bound to the space
     * @param spaceId
     */
    public getBindInfoWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataIdaasBindInfoVo>> {
        const result = this.api.getBindInfoWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Get the IDaaS information bound to the space
     * @param spaceId
     */
    public getBindInfo(spaceId: string, _options?: Configuration): Promise<ResponseDataIdaasBindInfoVo> {
        const result = this.api.getBindInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Get the link to log in to the IDaaS system
     * @param clientId
     */
    public getLoginWithHttpInfo(clientId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataIdaasAuthLoginVo>> {
        const result = this.api.getLoginWithHttpInfo(clientId, _options);
        return result.toPromise();
    }

    /**
     * Get the link to log in to the IDaaS system
     * @param clientId
     */
    public getLogin(clientId: string, _options?: Configuration): Promise<ResponseDataIdaasAuthLoginVo> {
        const result = this.api.getLogin(clientId, _options);
        return result.toPromise();
    }

    /**
     * Jump to the IDaaS system for automatic login
     * @param clientId
     */
    public getLoginRedirectWithHttpInfo(clientId: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.getLoginRedirectWithHttpInfo(clientId, _options);
        return result.toPromise();
    }

    /**
     * Jump to the IDaaS system for automatic login
     * @param clientId
     */
    public getLoginRedirect(clientId: string, _options?: Configuration): Promise<void> {
        const result = this.api.getLoginRedirect(clientId, _options);
        return result.toPromise();
    }

    /**
     * For private deployment only
     * The user completes subsequent operations after logging in to the IDaaS system
     * @param idaasAuthCallbackRo
     * @param clientId
     */
    public postCallback1WithHttpInfo(idaasAuthCallbackRo: IdaasAuthCallbackRo, clientId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.postCallback1WithHttpInfo(idaasAuthCallbackRo, clientId, _options);
        return result.toPromise();
    }

    /**
     * For private deployment only
     * The user completes subsequent operations after logging in to the IDaaS system
     * @param idaasAuthCallbackRo
     * @param clientId
     */
    public postCallback1(idaasAuthCallbackRo: IdaasAuthCallbackRo, clientId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.postCallback1(idaasAuthCallbackRo, clientId, _options);
        return result.toPromise();
    }

    /**
     * For Sass version only
     * The user completes subsequent operations after logging in to the IDaaS system
     * @param idaasAuthCallbackRo
     * @param clientId
     * @param spaceId
     */
    public postSpaceCallbackWithHttpInfo(idaasAuthCallbackRo: IdaasAuthCallbackRo, clientId: string, spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.postSpaceCallbackWithHttpInfo(idaasAuthCallbackRo, clientId, spaceId, _options);
        return result.toPromise();
    }

    /**
     * For Sass version only
     * The user completes subsequent operations after logging in to the IDaaS system
     * @param idaasAuthCallbackRo
     * @param clientId
     * @param spaceId
     */
    public postSpaceCallback(idaasAuthCallbackRo: IdaasAuthCallbackRo, clientId: string, spaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.postSpaceCallback(idaasAuthCallbackRo, clientId, spaceId, _options);
        return result.toPromise();
    }


}



import { ObservableIntegralApiApi } from './ObservableAPI';

import { IntegralApiApiRequestFactory, IntegralApiApiResponseProcessor} from "../apis/IntegralApiApi";
export class PromiseIntegralApiApi {
    private api: ObservableIntegralApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: IntegralApiApiRequestFactory,
        responseProcessor?: IntegralApiApiResponseProcessor
    ) {
        this.api = new ObservableIntegralApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Page by page query of integral revenue and expenditure details
     * @param page
     * @param pageObjectParams Page parameter
     */
    public integralRecordsWithHttpInfo(page: Page, pageObjectParams: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoIntegralRecordVO>> {
        const result = this.api.integralRecordsWithHttpInfo(page, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Page by page query of integral revenue and expenditure details
     * @param page
     * @param pageObjectParams Page parameter
     */
    public integralRecords(page: Page, pageObjectParams: string, _options?: Configuration): Promise<ResponseDataPageInfoIntegralRecordVO> {
        const result = this.api.integralRecords(page, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Query account integral information
     */
    public integralsWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataUserIntegralVo>> {
        const result = this.api.integralsWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Query account integral information
     */
    public integrals(_options?: Configuration): Promise<ResponseDataUserIntegralVo> {
        const result = this.api.integrals(_options);
        return result.toPromise();
    }

    /**
     * Users fill in the invitation code and get rewards
     * Fill in invitation code reward
     * @param inviteCodeRewardRo
     */
    public inviteCodeRewardWithHttpInfo(inviteCodeRewardRo: InviteCodeRewardRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.inviteCodeRewardWithHttpInfo(inviteCodeRewardRo, _options);
        return result.toPromise();
    }

    /**
     * Users fill in the invitation code and get rewards
     * Fill in invitation code reward
     * @param inviteCodeRewardRo
     */
    public inviteCodeReward(inviteCodeRewardRo: InviteCodeRewardRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.inviteCodeReward(inviteCodeRewardRo, _options);
        return result.toPromise();
    }


}



import { ObservableInternalContactsApiApi } from './ObservableAPI';

import { InternalContactsApiApiRequestFactory, InternalContactsApiApiResponseProcessor} from "../apis/InternalContactsApiApi";
export class PromiseInternalContactsApiApi {
    private api: ObservableInternalContactsApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalContactsApiApiRequestFactory,
        responseProcessor?: InternalContactsApiApiResponseProcessor
    ) {
        this.api = new ObservableInternalContactsApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * create new role
     * create new role
     * @param createRoleRo
     * @param xSpaceId space id
     */
    public createUnitRoleWithHttpInfo(createRoleRo: CreateRoleRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataUnitRoleInfoVo>> {
        const result = this.api.createUnitRoleWithHttpInfo(createRoleRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * create new role
     * create new role
     * @param createRoleRo
     * @param xSpaceId space id
     */
    public createUnitRole(createRoleRo: CreateRoleRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataUnitRoleInfoVo> {
        const result = this.api.createUnitRole(createRoleRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Add a sub team
     * Add a sub team
     * @param createUnitTeamRo
     * @param xSpaceId space id
     */
    public createUnitTeamWithHttpInfo(createUnitTeamRo: CreateUnitTeamRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataUnitTeamInfoVo>> {
        const result = this.api.createUnitTeamWithHttpInfo(createUnitTeamRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Add a sub team
     * Add a sub team
     * @param createUnitTeamRo
     * @param xSpaceId space id
     */
    public createUnitTeam(createUnitTeamRo: CreateUnitTeamRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataUnitTeamInfoVo> {
        const result = this.api.createUnitTeam(createUnitTeamRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete a Member from organization
     * Delete a Member from organization
     * @param unitId unit uuid
     * @param xSpaceId space id
     */
    public deleteMember1WithHttpInfo(unitId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteMember1WithHttpInfo(unitId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete a Member from organization
     * Delete a Member from organization
     * @param unitId unit uuid
     * @param xSpaceId space id
     */
    public deleteMember1(unitId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteMember1(unitId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete role. If role has members, it can be deleted.
     * Delete team
     * @param unitId unit uuid
     * @param xSpaceId space id
     */
    public deleteUnitRoleWithHttpInfo(unitId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteUnitRoleWithHttpInfo(unitId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete role. If role has members, it can be deleted.
     * Delete team
     * @param unitId unit uuid
     * @param xSpaceId space id
     */
    public deleteUnitRole(unitId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteUnitRole(unitId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete team. If team has members, it can be deleted.
     * Delete team
     * @param unitId unit uuid
     * @param xSpaceId space id
     */
    public deleteUnitTeamWithHttpInfo(unitId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteUnitTeamWithHttpInfo(unitId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete team. If team has members, it can be deleted.
     * Delete team
     * @param unitId unit uuid
     * @param xSpaceId space id
     */
    public deleteUnitTeam(unitId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteUnitTeam(unitId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Query roles information
     * Query roles information
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     */
    public getRolePageListWithHttpInfo(page: PageRoleBaseInfoDto, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoUnitRoleInfoVo>> {
        const result = this.api.getRolePageListWithHttpInfo(page, xSpaceId, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Query roles information
     * Query roles information
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     */
    public getRolePageList(page: PageRoleBaseInfoDto, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<ResponseDataPageInfoUnitRoleInfoVo> {
        const result = this.api.getRolePageList(page, xSpaceId, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Query department information. if team id lack, default root team
     * Query team information
     * @param unitId unit uuid
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     */
    public getTeamChildrenPageListWithHttpInfo(unitId: string, page: PageLong, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoUnitTeamInfoVo>> {
        const result = this.api.getTeamChildrenPageListWithHttpInfo(unitId, page, xSpaceId, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Query department information. if team id lack, default root team
     * Query team information
     * @param unitId unit uuid
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     */
    public getTeamChildrenPageList(unitId: string, page: PageLong, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<ResponseDataPageInfoUnitTeamInfoVo> {
        const result = this.api.getTeamChildrenPageList(unitId, page, xSpaceId, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Query department members information. if team id lack, default root team
     * Query team members information
     * @param unitId unit uuid
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     * @param sensitiveData includes mobile number and email
     */
    public getTeamMembersPageInfoWithHttpInfo(unitId: string, page: PageLong, xSpaceId: string, pageObjectParams: string, sensitiveData?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoUnitMemberInfoVo>> {
        const result = this.api.getTeamMembersPageInfoWithHttpInfo(unitId, page, xSpaceId, pageObjectParams, sensitiveData, _options);
        return result.toPromise();
    }

    /**
     * Query department members information. if team id lack, default root team
     * Query team members information
     * @param unitId unit uuid
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     * @param sensitiveData includes mobile number and email
     */
    public getTeamMembersPageInfo(unitId: string, page: PageLong, xSpaceId: string, pageObjectParams: string, sensitiveData?: boolean, _options?: Configuration): Promise<ResponseDataPageInfoUnitMemberInfoVo> {
        const result = this.api.getTeamMembersPageInfo(unitId, page, xSpaceId, pageObjectParams, sensitiveData, _options);
        return result.toPromise();
    }

    /**
     * Query team information
     * Query team information
     * @param unitId unit uuid
     * @param xSpaceId space id
     * @param sensitiveData includes mobile number and email
     */
    public getUnitMemberDetailsWithHttpInfo(unitId: string, xSpaceId: string, sensitiveData?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataUnitMemberInfoVo>> {
        const result = this.api.getUnitMemberDetailsWithHttpInfo(unitId, xSpaceId, sensitiveData, _options);
        return result.toPromise();
    }

    /**
     * Query team information
     * Query team information
     * @param unitId unit uuid
     * @param xSpaceId space id
     * @param sensitiveData includes mobile number and email
     */
    public getUnitMemberDetails(unitId: string, xSpaceId: string, sensitiveData?: boolean, _options?: Configuration): Promise<ResponseDataUnitMemberInfoVo> {
        const result = this.api.getUnitMemberDetails(unitId, xSpaceId, sensitiveData, _options);
        return result.toPromise();
    }

    /**
     * query the role\'s members
     * query role members
     * @param unitId unit uuid
     * @param xSpaceId space id
     * @param sensitiveData includes mobile number and email
     */
    public getUnitRoleMembersWithHttpInfo(unitId: string, xSpaceId: string, sensitiveData?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataUnitRoleMemberVo>> {
        const result = this.api.getUnitRoleMembersWithHttpInfo(unitId, xSpaceId, sensitiveData, _options);
        return result.toPromise();
    }

    /**
     * query the role\'s members
     * query role members
     * @param unitId unit uuid
     * @param xSpaceId space id
     * @param sensitiveData includes mobile number and email
     */
    public getUnitRoleMembers(unitId: string, xSpaceId: string, sensitiveData?: boolean, _options?: Configuration): Promise<ResponseDataUnitRoleMemberVo> {
        const result = this.api.getUnitRoleMembers(unitId, xSpaceId, sensitiveData, _options);
        return result.toPromise();
    }

    /**
     * Edit member info
     * Edit member info
     * @param updateUnitMemberRo
     * @param unitId unit uuid
     * @param xSpaceId space id
     * @param sensitiveData includes mobile number and email
     */
    public updateUnitMemberWithHttpInfo(updateUnitMemberRo: UpdateUnitMemberRo, unitId: string, xSpaceId: string, sensitiveData?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataUnitMemberInfoVo>> {
        const result = this.api.updateUnitMemberWithHttpInfo(updateUnitMemberRo, unitId, xSpaceId, sensitiveData, _options);
        return result.toPromise();
    }

    /**
     * Edit member info
     * Edit member info
     * @param updateUnitMemberRo
     * @param unitId unit uuid
     * @param xSpaceId space id
     * @param sensitiveData includes mobile number and email
     */
    public updateUnitMember(updateUnitMemberRo: UpdateUnitMemberRo, unitId: string, xSpaceId: string, sensitiveData?: boolean, _options?: Configuration): Promise<ResponseDataUnitMemberInfoVo> {
        const result = this.api.updateUnitMember(updateUnitMemberRo, unitId, xSpaceId, sensitiveData, _options);
        return result.toPromise();
    }

    /**
     * Update role info.
     * Update team info
     * @param updateUnitRoleRo
     * @param unitId unit uuid
     * @param xSpaceId space id
     */
    public updateUnitRoleWithHttpInfo(updateUnitRoleRo: UpdateUnitRoleRo, unitId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataUnitRoleInfoVo>> {
        const result = this.api.updateUnitRoleWithHttpInfo(updateUnitRoleRo, unitId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Update role info.
     * Update team info
     * @param updateUnitRoleRo
     * @param unitId unit uuid
     * @param xSpaceId space id
     */
    public updateUnitRole(updateUnitRoleRo: UpdateUnitRoleRo, unitId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataUnitRoleInfoVo> {
        const result = this.api.updateUnitRole(updateUnitRoleRo, unitId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Update team info. If modify team level, default sort in the end of parent team.
     * Update team info
     * @param updateUnitTeamRo
     * @param unitId unit uuid
     * @param xSpaceId space id
     */
    public updateUnitTeamWithHttpInfo(updateUnitTeamRo: UpdateUnitTeamRo, unitId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataUnitTeamInfoVo>> {
        const result = this.api.updateUnitTeamWithHttpInfo(updateUnitTeamRo, unitId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Update team info. If modify team level, default sort in the end of parent team.
     * Update team info
     * @param updateUnitTeamRo
     * @param unitId unit uuid
     * @param xSpaceId space id
     */
    public updateUnitTeam(updateUnitTeamRo: UpdateUnitTeamRo, unitId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataUnitTeamInfoVo> {
        const result = this.api.updateUnitTeam(updateUnitTeamRo, unitId, xSpaceId, _options);
        return result.toPromise();
    }


}



import { ObservableInternalServerAssetAPIApi } from './ObservableAPI';

import { InternalServerAssetAPIApiRequestFactory, InternalServerAssetAPIApiResponseProcessor} from "../apis/InternalServerAssetAPIApi";
export class PromiseInternalServerAssetAPIApi {
    private api: ObservableInternalServerAssetAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServerAssetAPIApiRequestFactory,
        responseProcessor?: InternalServerAssetAPIApiResponseProcessor
    ) {
        this.api = new ObservableInternalServerAssetAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * scene：Fusion server query the attachment field data before writing
     * Get Asset Info
     * @param token resource key
     */
    public getWithHttpInfo(token: string, _options?: Configuration): Promise<HttpInfo<ResponseDataAssetUploadResult>> {
        const result = this.api.getWithHttpInfo(token, _options);
        return result.toPromise();
    }

    /**
     * scene：Fusion server query the attachment field data before writing
     * Get Asset Info
     * @param token resource key
     */
    public get(token: string, _options?: Configuration): Promise<ResponseDataAssetUploadResult> {
        const result = this.api.get(token, _options);
        return result.toPromise();
    }

    /**
     * Batch get asset signature url
     * @param resourceKeys
     */
    public getSignatureUrls1WithHttpInfo(resourceKeys: Array<string>, _options?: Configuration): Promise<HttpInfo<ResponseDataListAssetUrlSignatureVo>> {
        const result = this.api.getSignatureUrls1WithHttpInfo(resourceKeys, _options);
        return result.toPromise();
    }

    /**
     * Batch get asset signature url
     * @param resourceKeys
     */
    public getSignatureUrls1(resourceKeys: Array<string>, _options?: Configuration): Promise<ResponseDataListAssetUrlSignatureVo> {
        const result = this.api.getSignatureUrls1(resourceKeys, _options);
        return result.toPromise();
    }

    /**
     * Get Upload PreSigned URL
     * @param nodeId node custom id
     * @param count number to create (default 1, max 20)
     */
    public getSpaceCapacity1WithHttpInfo(nodeId: string, count?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListAssetUploadCertificateVO>> {
        const result = this.api.getSpaceCapacity1WithHttpInfo(nodeId, count, _options);
        return result.toPromise();
    }

    /**
     * Get Upload PreSigned URL
     * @param nodeId node custom id
     * @param count number to create (default 1, max 20)
     */
    public getSpaceCapacity1(nodeId: string, count?: string, _options?: Configuration): Promise<ResponseDataListAssetUploadCertificateVO> {
        const result = this.api.getSpaceCapacity1(nodeId, count, _options);
        return result.toPromise();
    }


}



import { ObservableInternalServerOrgAPIApi } from './ObservableAPI';

import { InternalServerOrgAPIApiRequestFactory, InternalServerOrgAPIApiResponseProcessor} from "../apis/InternalServerOrgAPIApi";
export class PromiseInternalServerOrgAPIApi {
    private api: ObservableInternalServerOrgAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServerOrgAPIApiRequestFactory,
        responseProcessor?: InternalServerOrgAPIApiResponseProcessor
    ) {
        this.api = new ObservableInternalServerOrgAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10
     * Load/search departments and members
     * @param params
     * @param xSpaceId space id
     * @param userId user id
     * @param keyword keyword
     * @param unitIds unitIds
     * @param filterIds specifies the organizational unit to filter
     * @param all whether to load all departments and members
     * @param searchEmail whether to search for emails
     */
    public loadOrSearch1WithHttpInfo(params: LoadSearchDTO, xSpaceId?: string, userId?: string, keyword?: string, unitIds?: string, filterIds?: string, all?: boolean, searchEmail?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataListUnitInfoVo>> {
        const result = this.api.loadOrSearch1WithHttpInfo(params, xSpaceId, userId, keyword, unitIds, filterIds, all, searchEmail, _options);
        return result.toPromise();
    }

    /**
     * The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10
     * Load/search departments and members
     * @param params
     * @param xSpaceId space id
     * @param userId user id
     * @param keyword keyword
     * @param unitIds unitIds
     * @param filterIds specifies the organizational unit to filter
     * @param all whether to load all departments and members
     * @param searchEmail whether to search for emails
     */
    public loadOrSearch1(params: LoadSearchDTO, xSpaceId?: string, userId?: string, keyword?: string, unitIds?: string, filterIds?: string, all?: boolean, searchEmail?: boolean, _options?: Configuration): Promise<ResponseDataListUnitInfoVo> {
        const result = this.api.loadOrSearch1(params, xSpaceId, userId, keyword, unitIds, filterIds, all, searchEmail, _options);
        return result.toPromise();
    }


}



import { ObservableInternalServiceDataTableFieldPermissionInterfaceApi } from './ObservableAPI';

import { InternalServiceDataTableFieldPermissionInterfaceApiRequestFactory, InternalServiceDataTableFieldPermissionInterfaceApiResponseProcessor} from "../apis/InternalServiceDataTableFieldPermissionInterfaceApi";
export class PromiseInternalServiceDataTableFieldPermissionInterfaceApi {
    private api: ObservableInternalServiceDataTableFieldPermissionInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceDataTableFieldPermissionInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceDataTableFieldPermissionInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableInternalServiceDataTableFieldPermissionInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * room layer ot delete field operation call
     * turn off multiple field permissions
     * @param dstId table id
     * @param fieldIds list of field ids
     */
    public disableRolesWithHttpInfo(dstId: ModelString, fieldIds: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.disableRolesWithHttpInfo(dstId, fieldIds, _options);
        return result.toPromise();
    }

    /**
     * room layer ot delete field operation call
     * turn off multiple field permissions
     * @param dstId table id
     * @param fieldIds list of field ids
     */
    public disableRoles(dstId: ModelString, fieldIds: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.disableRoles(dstId, fieldIds, _options);
        return result.toPromise();
    }

    /**
     * get field permissions
     * @param nodeId node id
     * @param userId user id
     * @param shareId share id
     */
    public getFieldPermissionWithHttpInfo(nodeId: string, userId: string, shareId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataFieldPermissionView>> {
        const result = this.api.getFieldPermissionWithHttpInfo(nodeId, userId, shareId, _options);
        return result.toPromise();
    }

    /**
     * get field permissions
     * @param nodeId node id
     * @param userId user id
     * @param shareId share id
     */
    public getFieldPermission(nodeId: string, userId: string, shareId?: string, _options?: Configuration): Promise<ResponseDataFieldPermissionView> {
        const result = this.api.getFieldPermission(nodeId, userId, shareId, _options);
        return result.toPromise();
    }

    /**
     * get field permission set for multiple nodes
     * @param internalPermissionRo
     */
    public getMultiFieldPermissionViewsWithHttpInfo(internalPermissionRo: InternalPermissionRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListFieldPermissionView>> {
        const result = this.api.getMultiFieldPermissionViewsWithHttpInfo(internalPermissionRo, _options);
        return result.toPromise();
    }

    /**
     * get field permission set for multiple nodes
     * @param internalPermissionRo
     */
    public getMultiFieldPermissionViews(internalPermissionRo: InternalPermissionRo, _options?: Configuration): Promise<ResponseDataListFieldPermissionView> {
        const result = this.api.getMultiFieldPermissionViews(internalPermissionRo, _options);
        return result.toPromise();
    }


}



import { ObservableInternalServiceEnterpriseMicroInterfaceApi } from './ObservableAPI';

import { InternalServiceEnterpriseMicroInterfaceApiRequestFactory, InternalServiceEnterpriseMicroInterfaceApiResponseProcessor} from "../apis/InternalServiceEnterpriseMicroInterfaceApi";
export class PromiseInternalServiceEnterpriseMicroInterfaceApi {
    private api: ObservableInternalServiceEnterpriseMicroInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceEnterpriseMicroInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceEnterpriseMicroInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableInternalServiceEnterpriseMicroInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Batch processing pending interface license delay information
     */
    public postPermitDelayBatchProcessWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.postPermitDelayBatchProcessWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Batch processing pending interface license delay information
     */
    public postPermitDelayBatchProcess(_options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.postPermitDelayBatchProcess(_options);
        return result.toPromise();
    }


}



import { ObservableInternalServiceFieldServiceInterfaceApi } from './ObservableAPI';

import { InternalServiceFieldServiceInterfaceApiRequestFactory, InternalServiceFieldServiceInterfaceApiResponseProcessor} from "../apis/InternalServiceFieldServiceInterfaceApi";
export class PromiseInternalServiceFieldServiceInterfaceApi {
    private api: ObservableInternalServiceFieldServiceInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceFieldServiceInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceFieldServiceInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableInternalServiceFieldServiceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * get url related information
     * get url related information
     * @param urlsWrapperRo
     */
    public urlContentsAwareFillWithHttpInfo(urlsWrapperRo: UrlsWrapperRo, _options?: Configuration): Promise<HttpInfo<ResponseDataUrlAwareContentsVo>> {
        const result = this.api.urlContentsAwareFillWithHttpInfo(urlsWrapperRo, _options);
        return result.toPromise();
    }

    /**
     * get url related information
     * get url related information
     * @param urlsWrapperRo
     */
    public urlContentsAwareFill(urlsWrapperRo: UrlsWrapperRo, _options?: Configuration): Promise<ResponseDataUrlAwareContentsVo> {
        const result = this.api.urlContentsAwareFill(urlsWrapperRo, _options);
        return result.toPromise();
    }


}



import { ObservableInternalServiceNodeInterfaceApi } from './ObservableAPI';

import { InternalServiceNodeInterfaceApiRequestFactory, InternalServiceNodeInterfaceApiResponseProcessor} from "../apis/InternalServiceNodeInterfaceApi";
export class PromiseInternalServiceNodeInterfaceApi {
    private api: ObservableInternalServiceNodeInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceNodeInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceNodeInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableInternalServiceNodeInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * create a table node
     * create a table node
     * @param createDatasheetRo
     * @param spaceId
     */
    public createDatasheetWithHttpInfo(createDatasheetRo: CreateDatasheetRo, spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataCreateDatasheetVo>> {
        const result = this.api.createDatasheetWithHttpInfo(createDatasheetRo, spaceId, _options);
        return result.toPromise();
    }

    /**
     * create a table node
     * create a table node
     * @param createDatasheetRo
     * @param spaceId
     */
    public createDatasheet(createDatasheetRo: CreateDatasheetRo, spaceId: string, _options?: Configuration): Promise<ResponseDataCreateDatasheetVo> {
        const result = this.api.createDatasheet(createDatasheetRo, spaceId, _options);
        return result.toPromise();
    }

    /**
     * delete node
     * delete node
     * @param spaceId
     * @param nodeId
     */
    public deleteNodeWithHttpInfo(spaceId: string, nodeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteNodeWithHttpInfo(spaceId, nodeId, _options);
        return result.toPromise();
    }

    /**
     * delete node
     * delete node
     * @param spaceId
     * @param nodeId
     */
    public deleteNode(spaceId: string, nodeId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteNode(spaceId, nodeId, _options);
        return result.toPromise();
    }

    /**
     * scenario: query an existing read-only dashboard
     * Get filter nodes by type, permissions and node name.
     * @param spaceId
     * @param type
     * @param nodePermissions
     * @param keyword
     */
    public filterWithHttpInfo(spaceId: string, type: number, nodePermissions?: Array<number>, keyword?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfo>> {
        const result = this.api.filterWithHttpInfo(spaceId, type, nodePermissions, keyword, _options);
        return result.toPromise();
    }

    /**
     * scenario: query an existing read-only dashboard
     * Get filter nodes by type, permissions and node name.
     * @param spaceId
     * @param type
     * @param nodePermissions
     * @param keyword
     */
    public filter(spaceId: string, type: number, nodePermissions?: Array<number>, keyword?: string, _options?: Configuration): Promise<ResponseDataListNodeInfo> {
        const result = this.api.filter(spaceId, type, nodePermissions, keyword, _options);
        return result.toPromise();
    }


}



import { ObservableInternalServiceNodePermissionInterfaceApi } from './ObservableAPI';

import { InternalServiceNodePermissionInterfaceApiRequestFactory, InternalServiceNodePermissionInterfaceApiResponseProcessor} from "../apis/InternalServiceNodePermissionInterfaceApi";
export class PromiseInternalServiceNodePermissionInterfaceApi {
    private api: ObservableInternalServiceNodePermissionInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceNodePermissionInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceNodePermissionInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableInternalServiceNodePermissionInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get permission set for multiple nodes
     * @param internalPermissionRo
     */
    public getMultiNodePermissionsWithHttpInfo(internalPermissionRo: InternalPermissionRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListDatasheetPermissionView>> {
        const result = this.api.getMultiNodePermissionsWithHttpInfo(internalPermissionRo, _options);
        return result.toPromise();
    }

    /**
     * Get permission set for multiple nodes
     * @param internalPermissionRo
     */
    public getMultiNodePermissions(internalPermissionRo: InternalPermissionRo, _options?: Configuration): Promise<ResponseDataListDatasheetPermissionView> {
        const result = this.api.getMultiNodePermissions(internalPermissionRo, _options);
        return result.toPromise();
    }

    /**
     * Get Node permission
     * @param nodeId Node ID
     * @param shareId Share ID
     */
    public getNodePermissionWithHttpInfo(nodeId: string, shareId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataDatasheetPermissionView>> {
        const result = this.api.getNodePermissionWithHttpInfo(nodeId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Get Node permission
     * @param nodeId Node ID
     * @param shareId Share ID
     */
    public getNodePermission(nodeId: string, shareId?: string, _options?: Configuration): Promise<ResponseDataDatasheetPermissionView> {
        const result = this.api.getNodePermission(nodeId, shareId, _options);
        return result.toPromise();
    }


}



import { ObservableInternalServiceNotificationInterfaceApi } from './ObservableAPI';

import { InternalServiceNotificationInterfaceApiRequestFactory, InternalServiceNotificationInterfaceApiResponseProcessor} from "../apis/InternalServiceNotificationInterfaceApi";
export class PromiseInternalServiceNotificationInterfaceApi {
    private api: ObservableInternalServiceNotificationInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceNotificationInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceNotificationInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableInternalServiceNotificationInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * send a message
     * send a message
     * @param notificationCreateRo
     */
    public create7WithHttpInfo(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.create7WithHttpInfo(notificationCreateRo, _options);
        return result.toPromise();
    }

    /**
     * send a message
     * send a message
     * @param notificationCreateRo
     */
    public create7(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.create7(notificationCreateRo, _options);
        return result.toPromise();
    }


}



import { ObservableInternalServiceSpaceInterfaceApi } from './ObservableAPI';

import { InternalServiceSpaceInterfaceApiRequestFactory, InternalServiceSpaceInterfaceApiResponseProcessor} from "../apis/InternalServiceSpaceInterfaceApi";
export class PromiseInternalServiceSpaceInterfaceApi {
    private api: ObservableInternalServiceSpaceInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceSpaceInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceSpaceInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableInternalServiceSpaceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API aps information in the subscription plan corresponding to the space.
     * get api qps information of a specified space
     * @param spaceId
     */
    public apiRateLimitWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceApiRateLimitVo>> {
        const result = this.api.apiRateLimitWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API aps information in the subscription plan corresponding to the space.
     * get api qps information of a specified space
     * @param spaceId
     */
    public apiRateLimit(spaceId: string, _options?: Configuration): Promise<ResponseDataInternalSpaceApiRateLimitVo> {
        const result = this.api.apiRateLimit(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API usage information in the subscription plan corresponding to the space.
     * get api usage information of a specified space
     * @param spaceId
     */
    public apiUsagesWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceApiUsageVo>> {
        const result = this.api.apiUsagesWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API usage information in the subscription plan corresponding to the space.
     * get api usage information of a specified space
     * @param spaceId
     */
    public apiUsages(spaceId: string, _options?: Configuration): Promise<ResponseDataInternalSpaceApiUsageVo> {
        const result = this.api.apiUsages(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get space automation run message
     * @param spaceId space id
     */
    public getAutomationRunMessageWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceAutomationRunMessageV0>> {
        const result = this.api.getAutomationRunMessageWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get space automation run message
     * @param spaceId space id
     */
    public getAutomationRunMessage(spaceId: string, _options?: Configuration): Promise<ResponseDataInternalSpaceAutomationRunMessageV0> {
        const result = this.api.getAutomationRunMessage(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get space credit used usage
     * @param spaceId space id
     */
    public getCreditUsages1WithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataInternalCreditUsageVo>> {
        const result = this.api.getCreditUsages1WithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get space credit used usage
     * @param spaceId space id
     */
    public getCreditUsages1(spaceId: string, _options?: Configuration): Promise<ResponseDataInternalCreditUsageVo> {
        const result = this.api.getCreditUsages1(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get attachment capacity information for a space
     * @param spaceId space id
     */
    public getSpaceCapacityWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceCapacityVo>> {
        const result = this.api.getSpaceCapacityWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get attachment capacity information for a space
     * @param spaceId space id
     */
    public getSpaceCapacity(spaceId: string, _options?: Configuration): Promise<ResponseDataInternalSpaceCapacityVo> {
        const result = this.api.getSpaceCapacity(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get subscription information for a space
     * @param spaceId space id
     */
    public getSpaceSubscriptionWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceSubscriptionVo>> {
        const result = this.api.getSpaceSubscriptionWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get subscription information for a space
     * @param spaceId space id
     */
    public getSpaceSubscription(spaceId: string, _options?: Configuration): Promise<ResponseDataInternalSpaceSubscriptionVo> {
        const result = this.api.getSpaceSubscription(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get space used usage information
     * @param spaceId space id
     */
    public getSpaceUsagesWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceUsageVo>> {
        const result = this.api.getSpaceUsagesWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get space used usage information
     * @param spaceId space id
     */
    public getSpaceUsages(spaceId: string, _options?: Configuration): Promise<ResponseDataInternalSpaceUsageVo> {
        const result = this.api.getSpaceUsages(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get space information
     * @param spaceId
     */
    public labsWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataInternalSpaceInfoVo>> {
        const result = this.api.labsWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get space information
     * @param spaceId
     */
    public labs(spaceId: string, _options?: Configuration): Promise<ResponseDataInternalSpaceInfoVo> {
        const result = this.api.labs(spaceId, _options);
        return result.toPromise();
    }

    /**
     * get space information
     * @param spaceStatisticsRo
     * @param spaceId
     */
    public statisticsWithHttpInfo(spaceStatisticsRo: SpaceStatisticsRo, spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.statisticsWithHttpInfo(spaceStatisticsRo, spaceId, _options);
        return result.toPromise();
    }

    /**
     * get space information
     * @param spaceStatisticsRo
     * @param spaceId
     */
    public statistics(spaceStatisticsRo: SpaceStatisticsRo, spaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.statistics(spaceStatisticsRo, spaceId, _options);
        return result.toPromise();
    }


}



import { ObservableInternalServiceUserInterfaceApi } from './ObservableAPI';

import { InternalServiceUserInterfaceApiRequestFactory, InternalServiceUserInterfaceApiResponseProcessor} from "../apis/InternalServiceUserInterfaceApi";
export class PromiseInternalServiceUserInterfaceApi {
    private api: ObservableInternalServiceUserInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceUserInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceUserInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableInternalServiceUserInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Close and log off the cooling-off period user account
     * Close and log off the cooling-off period user account
     * @param userId
     */
    public closePausedUserAccountWithHttpInfo(userId: number, _options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        const result = this.api.closePausedUserAccountWithHttpInfo(userId, _options);
        return result.toPromise();
    }

    /**
     * Close and log off the cooling-off period user account
     * Close and log off the cooling-off period user account
     * @param userId
     */
    public closePausedUserAccount(userId: number, _options?: Configuration): Promise<ResponseDataBoolean> {
        const result = this.api.closePausedUserAccount(userId, _options);
        return result.toPromise();
    }

    /**
     * get cooling off users
     * get cooling off users
     */
    public getPausedUsersWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataListUserInPausedDto>> {
        const result = this.api.getPausedUsersWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * get cooling off users
     * get cooling off users
     */
    public getPausedUsers(_options?: Configuration): Promise<ResponseDataListUserInPausedDto> {
        const result = this.api.getPausedUsers(_options);
        return result.toPromise();
    }

    /**
     * get the cooling-off period user operation record
     * get the cooling-off period user operation record
     * @param pausedUserHistoryRo
     */
    public getUserHistoriesWithHttpInfo(pausedUserHistoryRo: PausedUserHistoryRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListPausedUserHistoryDto>> {
        const result = this.api.getUserHistoriesWithHttpInfo(pausedUserHistoryRo, _options);
        return result.toPromise();
    }

    /**
     * get the cooling-off period user operation record
     * get the cooling-off period user operation record
     * @param pausedUserHistoryRo
     */
    public getUserHistories(pausedUserHistoryRo: PausedUserHistoryRo, _options?: Configuration): Promise<ResponseDataListPausedUserHistoryDto> {
        const result = this.api.getUserHistories(pausedUserHistoryRo, _options);
        return result.toPromise();
    }

    /**
     * get the necessary information
     * check whether logged in
     */
    public meSessionWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        const result = this.api.meSessionWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * get the necessary information
     * check whether logged in
     */
    public meSession(_options?: Configuration): Promise<ResponseDataBoolean> {
        const result = this.api.meSession(_options);
        return result.toPromise();
    }

    /**
     * get the necessary information
     * get the necessary information
     */
    public userBaseInfoWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataUserBaseInfoVo>> {
        const result = this.api.userBaseInfoWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * get the necessary information
     * get the necessary information
     */
    public userBaseInfo(_options?: Configuration): Promise<ResponseDataUserBaseInfoVo> {
        const result = this.api.userBaseInfo(_options);
        return result.toPromise();
    }


}



import { ObservableK11LoginInterfaceApi } from './ObservableAPI';

import { K11LoginInterfaceApiRequestFactory, K11LoginInterfaceApiResponseProcessor} from "../apis/K11LoginInterfaceApi";
export class PromiseK11LoginInterfaceApi {
    private api: ObservableK11LoginInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: K11LoginInterfaceApiRequestFactory,
        responseProcessor?: K11LoginInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableK11LoginInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * k11 Synchronous login with token
     * @param token
     */
    public loginBySsoTokenWithHttpInfo(token: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.loginBySsoTokenWithHttpInfo(token, _options);
        return result.toPromise();
    }

    /**
     * k11 Synchronous login with token
     * @param token
     */
    public loginBySsoToken(token: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.loginBySsoToken(token, _options);
        return result.toPromise();
    }


}



import { ObservableLaboratoryModuleExperimentalFunctionInterfaceApi } from './ObservableAPI';

import { LaboratoryModuleExperimentalFunctionInterfaceApiRequestFactory, LaboratoryModuleExperimentalFunctionInterfaceApiResponseProcessor} from "../apis/LaboratoryModuleExperimentalFunctionInterfaceApi";
export class PromiseLaboratoryModuleExperimentalFunctionInterfaceApi {
    private api: ObservableLaboratoryModuleExperimentalFunctionInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: LaboratoryModuleExperimentalFunctionInterfaceApiRequestFactory,
        responseProcessor?: LaboratoryModuleExperimentalFunctionInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableLaboratoryModuleExperimentalFunctionInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get Lab Function List
     */
    public showAvailableLabsFeaturesWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataUserSpaceLabsFeatureVo>> {
        const result = this.api.showAvailableLabsFeaturesWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get Lab Function List
     */
    public showAvailableLabsFeatures(_options?: Configuration): Promise<ResponseDataUserSpaceLabsFeatureVo> {
        const result = this.api.showAvailableLabsFeatures(_options);
        return result.toPromise();
    }


}



import { ObservableLarkInterfaceApi } from './ObservableAPI';

import { LarkInterfaceApiRequestFactory, LarkInterfaceApiResponseProcessor} from "../apis/LarkInterfaceApi";
export class PromiseLarkInterfaceApi {
    private api: ObservableLarkInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: LarkInterfaceApiRequestFactory,
        responseProcessor?: LarkInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableLarkInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Replace the master administrator
     * Tenant space replacement master administrator
     * @param feishuTenantMainAdminChangeRo
     */
    public changeAdminWithHttpInfo(feishuTenantMainAdminChangeRo: FeishuTenantMainAdminChangeRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.changeAdminWithHttpInfo(feishuTenantMainAdminChangeRo, _options);
        return result.toPromise();
    }

    /**
     * Replace the master administrator
     * Tenant space replacement master administrator
     * @param feishuTenantMainAdminChangeRo
     */
    public changeAdmin(feishuTenantMainAdminChangeRo: FeishuTenantMainAdminChangeRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.changeAdmin(feishuTenantMainAdminChangeRo, _options);
        return result.toPromise();
    }

    /**
     * Get the space information bound by the tenant
     * Get tenant binding information
     * @param tenantKey Lark Tenant ID
     */
    public getTenantInfo1WithHttpInfo(tenantKey: string, _options?: Configuration): Promise<HttpInfo<ResponseDataFeishuTenantDetailVO>> {
        const result = this.api.getTenantInfo1WithHttpInfo(tenantKey, _options);
        return result.toPromise();
    }

    /**
     * Get the space information bound by the tenant
     * Get tenant binding information
     * @param tenantKey Lark Tenant ID
     */
    public getTenantInfo1(tenantKey: string, _options?: Configuration): Promise<ResponseDataFeishuTenantDetailVO> {
        const result = this.api.getTenantInfo1(tenantKey, _options);
        return result.toPromise();
    }


}



import { ObservableMigrationResourcesAPIApi } from './ObservableAPI';

import { MigrationResourcesAPIApiRequestFactory, MigrationResourcesAPIApiResponseProcessor} from "../apis/MigrationResourcesAPIApi";
export class PromiseMigrationResourcesAPIApi {
    private api: ObservableMigrationResourcesAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: MigrationResourcesAPIApiRequestFactory,
        responseProcessor?: MigrationResourcesAPIApiResponseProcessor
    ) {
        this.api = new ObservableMigrationResourcesAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * migration resources
     * @param migrationResourcesRo
     */
    public migrationResourcesWithHttpInfo(migrationResourcesRo: MigrationResourcesRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.migrationResourcesWithHttpInfo(migrationResourcesRo, _options);
        return result.toPromise();
    }

    /**
     * migration resources
     * @param migrationResourcesRo
     */
    public migrationResources(migrationResourcesRo: MigrationResourcesRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.migrationResources(migrationResourcesRo, _options);
        return result.toPromise();
    }


}



import { ObservableOfficeOperationAPIApi } from './ObservableAPI';

import { OfficeOperationAPIApiRequestFactory, OfficeOperationAPIApiResponseProcessor} from "../apis/OfficeOperationAPIApi";
export class PromiseOfficeOperationAPIApi {
    private api: ObservableOfficeOperationAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: OfficeOperationAPIApiRequestFactory,
        responseProcessor?: OfficeOperationAPIApiResponseProcessor
    ) {
        this.api = new ObservableOfficeOperationAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Office document preview conversion,call Yongzhong office conversion interface
     * Office document preview conversion
     * @param attachOfficePreviewRo
     * @param spaceId
     */
    public officePreviewWithHttpInfo(attachOfficePreviewRo: AttachOfficePreviewRo, spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.officePreviewWithHttpInfo(attachOfficePreviewRo, spaceId, _options);
        return result.toPromise();
    }

    /**
     * Office document preview conversion,call Yongzhong office conversion interface
     * Office document preview conversion
     * @param attachOfficePreviewRo
     * @param spaceId
     */
    public officePreview(attachOfficePreviewRo: AttachOfficePreviewRo, spaceId: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.officePreview(attachOfficePreviewRo, spaceId, _options);
        return result.toPromise();
    }


}



import { ObservableOpenApiApi } from './ObservableAPI';

import { OpenApiApiRequestFactory, OpenApiApiResponseProcessor} from "../apis/OpenApiApi";
export class PromiseOpenApiApi {
    private api: ObservableOpenApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: OpenApiApiRequestFactory,
        responseProcessor?: OpenApiApiResponseProcessor
    ) {
        this.api = new ObservableOpenApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get information that the applet can expose
     * Get information that the applet can expose
     * @param widgetId
     */
    public validateApiKey1WithHttpInfo(widgetId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataWidgetInfoVo>> {
        const result = this.api.validateApiKey1WithHttpInfo(widgetId, _options);
        return result.toPromise();
    }

    /**
     * Get information that the applet can expose
     * Get information that the applet can expose
     * @param widgetId
     */
    public validateApiKey1(widgetId: string, _options?: Configuration): Promise<ResponseDataWidgetInfoVo> {
        const result = this.api.validateApiKey1(widgetId, _options);
        return result.toPromise();
    }


}



import { ObservablePlayerSystemActivityAPIApi } from './ObservableAPI';

import { PlayerSystemActivityAPIApiRequestFactory, PlayerSystemActivityAPIApiResponseProcessor} from "../apis/PlayerSystemActivityAPIApi";
export class PromisePlayerSystemActivityAPIApi {
    private api: ObservablePlayerSystemActivityAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: PlayerSystemActivityAPIApiRequestFactory,
        responseProcessor?: PlayerSystemActivityAPIApiResponseProcessor
    ) {
        this.api = new ObservablePlayerSystemActivityAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Scene: After triggering the guided click event, modify the state or the cumulative number of times.
     * Trigger Wizard
     * @param activityStatusRo
     */
    public triggerWizardWithHttpInfo(activityStatusRo: ActivityStatusRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.triggerWizardWithHttpInfo(activityStatusRo, _options);
        return result.toPromise();
    }

    /**
     * Scene: After triggering the guided click event, modify the state or the cumulative number of times.
     * Trigger Wizard
     * @param activityStatusRo
     */
    public triggerWizard(activityStatusRo: ActivityStatusRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.triggerWizard(activityStatusRo, _options);
        return result.toPromise();
    }


}



import { ObservablePlayerSystemNotificationAPIApi } from './ObservableAPI';

import { PlayerSystemNotificationAPIApiRequestFactory, PlayerSystemNotificationAPIApiResponseProcessor} from "../apis/PlayerSystemNotificationAPIApi";
export class PromisePlayerSystemNotificationAPIApi {
    private api: ObservablePlayerSystemNotificationAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: PlayerSystemNotificationAPIApiRequestFactory,
        responseProcessor?: PlayerSystemNotificationAPIApiResponseProcessor
    ) {
        this.api = new ObservablePlayerSystemNotificationAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Notification
     * @param notificationCreateRo
     */
    public create5WithHttpInfo(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.create5WithHttpInfo(notificationCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Create Notification
     * @param notificationCreateRo
     */
    public create5(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.create5(notificationCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Delete Notification
     * @param notificationReadRo
     */
    public delete10WithHttpInfo(notificationReadRo: NotificationReadRo, _options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        const result = this.api.delete10WithHttpInfo(notificationReadRo, _options);
        return result.toPromise();
    }

    /**
     * Delete Notification
     * @param notificationReadRo
     */
    public delete10(notificationReadRo: NotificationReadRo, _options?: Configuration): Promise<ResponseDataBoolean> {
        const result = this.api.delete10(notificationReadRo, _options);
        return result.toPromise();
    }

    /**
     * Default: System Notification
     * Get Notification Detail List
     * @param notificationListRo
     */
    public list4WithHttpInfo(notificationListRo: NotificationListRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListNotificationDetailVo>> {
        const result = this.api.list4WithHttpInfo(notificationListRo, _options);
        return result.toPromise();
    }

    /**
     * Default: System Notification
     * Get Notification Detail List
     * @param notificationListRo
     */
    public list4(notificationListRo: NotificationListRo, _options?: Configuration): Promise<ResponseDataListNotificationDetailVo> {
        const result = this.api.list4(notificationListRo, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Get Notification Page Info
     * @param notificationPageRo
     */
    public page3WithHttpInfo(notificationPageRo: NotificationPageRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListNotificationDetailVo>> {
        const result = this.api.page3WithHttpInfo(notificationPageRo, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Get Notification Page Info
     * @param notificationPageRo
     */
    public page3(notificationPageRo: NotificationPageRo, _options?: Configuration): Promise<ResponseDataListNotificationDetailVo> {
        const result = this.api.page3(notificationPageRo, _options);
        return result.toPromise();
    }

    /**
     * Mark Notification Read
     * @param notificationReadRo
     */
    public readWithHttpInfo(notificationReadRo: NotificationReadRo, _options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        const result = this.api.readWithHttpInfo(notificationReadRo, _options);
        return result.toPromise();
    }

    /**
     * Mark Notification Read
     * @param notificationReadRo
     */
    public read(notificationReadRo: NotificationReadRo, _options?: Configuration): Promise<ResponseDataBoolean> {
        const result = this.api.read(notificationReadRo, _options);
        return result.toPromise();
    }

    /**
     * Get Notification\' Statistics
     */
    public statistics1WithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataNotificationStatisticsVo>> {
        const result = this.api.statistics1WithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get Notification\' Statistics
     */
    public statistics1(_options?: Configuration): Promise<ResponseDataNotificationStatisticsVo> {
        const result = this.api.statistics1(_options);
        return result.toPromise();
    }


}



import { ObservableProductControllerApi } from './ObservableAPI';

import { ProductControllerApiRequestFactory, ProductControllerApiResponseProcessor} from "../apis/ProductControllerApi";
export class PromiseProductControllerApi {
    private api: ObservableProductControllerApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ProductControllerApiRequestFactory,
        responseProcessor?: ProductControllerApiResponseProcessor
    ) {
        this.api = new ObservableProductControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public getListWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataListProductVO>> {
        const result = this.api.getListWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public getList(_options?: Configuration): Promise<ResponseDataListProductVO> {
        const result = this.api.getList(_options);
        return result.toPromise();
    }


}



import { ObservableProductOperationSystemAPIApi } from './ObservableAPI';

import { ProductOperationSystemAPIApiRequestFactory, ProductOperationSystemAPIApiResponseProcessor} from "../apis/ProductOperationSystemAPIApi";
export class PromiseProductOperationSystemAPIApi {
    private api: ObservableProductOperationSystemAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ProductOperationSystemAPIApiRequestFactory,
        responseProcessor?: ProductOperationSystemAPIApiResponseProcessor
    ) {
        this.api = new ObservableProductOperationSystemAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Indicates the attachment resource of the specified template. Users refer to this part of the resource without occupying the space station capacity
     * Template Asset Remark
     * @param templateId Template Custom ID
     * @param isReversed Whether it is a reverse operation, that is, cancel the flag (default false)
     */
    public markTemplateAssetWithHttpInfo(templateId: string, isReversed?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.markTemplateAssetWithHttpInfo(templateId, isReversed, _options);
        return result.toPromise();
    }

    /**
     * Indicates the attachment resource of the specified template. Users refer to this part of the resource without occupying the space station capacity
     * Template Asset Remark
     * @param templateId Template Custom ID
     * @param isReversed Whether it is a reverse operation, that is, cancel the flag (default false)
     */
    public markTemplateAsset(templateId: string, isReversed?: boolean, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.markTemplateAsset(templateId, isReversed, _options);
        return result.toPromise();
    }


}



import { ObservableProductOperationSystemTemplateAPIApi } from './ObservableAPI';

import { ProductOperationSystemTemplateAPIApiRequestFactory, ProductOperationSystemTemplateAPIApiResponseProcessor} from "../apis/ProductOperationSystemTemplateAPIApi";
export class PromiseProductOperationSystemTemplateAPIApi {
    private api: ObservableProductOperationSystemTemplateAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ProductOperationSystemTemplateAPIApiRequestFactory,
        responseProcessor?: ProductOperationSystemTemplateAPIApiResponseProcessor
    ) {
        this.api = new ObservableProductOperationSystemTemplateAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Only supply to people in template space
     * Create Template Category
     * @param templateCategoryCreateRo
     */
    public createTemplateCategoryWithHttpInfo(templateCategoryCreateRo: TemplateCategoryCreateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.createTemplateCategoryWithHttpInfo(templateCategoryCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Only supply to people in template space
     * Create Template Category
     * @param templateCategoryCreateRo
     */
    public createTemplateCategory(templateCategoryCreateRo: TemplateCategoryCreateRo, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.createTemplateCategory(templateCategoryCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Only supply to people in template space
     * Delete Template Category
     * @param categoryCode
     */
    public deleteTemplateCategoryWithHttpInfo(categoryCode: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteTemplateCategoryWithHttpInfo(categoryCode, _options);
        return result.toPromise();
    }

    /**
     * Only supply to people in template space
     * Delete Template Category
     * @param categoryCode
     */
    public deleteTemplateCategory(categoryCode: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteTemplateCategory(categoryCode, _options);
        return result.toPromise();
    }

    /**
     * Only supply to people in template space
     * Publish Template in Specified Template Category
     * @param templatePublishRo
     * @param templateId template id
     */
    public publishWithHttpInfo(templatePublishRo: TemplatePublishRo, templateId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.publishWithHttpInfo(templatePublishRo, templateId, _options);
        return result.toPromise();
    }

    /**
     * Only supply to people in template space
     * Publish Template in Specified Template Category
     * @param templatePublishRo
     * @param templateId template id
     */
    public publish(templatePublishRo: TemplatePublishRo, templateId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.publish(templatePublishRo, templateId, _options);
        return result.toPromise();
    }

    /**
     * Only supply to people in template space
     * UnPublish Template
     * @param templateUnpublishRo
     * @param templateId template id
     */
    public unpublishWithHttpInfo(templateUnpublishRo: TemplateUnpublishRo, templateId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.unpublishWithHttpInfo(templateUnpublishRo, templateId, _options);
        return result.toPromise();
    }

    /**
     * Only supply to people in template space
     * UnPublish Template
     * @param templateUnpublishRo
     * @param templateId template id
     */
    public unpublish(templateUnpublishRo: TemplateUnpublishRo, templateId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.unpublish(templateUnpublishRo, templateId, _options);
        return result.toPromise();
    }


}



import { ObservableProductOperationSystemUserAPIApi } from './ObservableAPI';

import { ProductOperationSystemUserAPIApiRequestFactory, ProductOperationSystemUserAPIApiResponseProcessor} from "../apis/ProductOperationSystemUserAPIApi";
export class PromiseProductOperationSystemUserAPIApi {
    private api: ObservableProductOperationSystemUserAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ProductOperationSystemUserAPIApiRequestFactory,
        responseProcessor?: ProductOperationSystemUserAPIApiResponseProcessor
    ) {
        this.api = new ObservableProductOperationSystemUserAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Only supply to customized customers
     * Update Appoint Account Password
     * @param registerRO
     */
    public updatePwd1WithHttpInfo(registerRO: RegisterRO, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updatePwd1WithHttpInfo(registerRO, _options);
        return result.toPromise();
    }

    /**
     * Only supply to customized customers
     * Update Appoint Account Password
     * @param registerRO
     */
    public updatePwd1(registerRO: RegisterRO, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updatePwd1(registerRO, _options);
        return result.toPromise();
    }


}



import { ObservableSpaceApplyJoiningSpaceApiApi } from './ObservableAPI';

import { SpaceApplyJoiningSpaceApiApiRequestFactory, SpaceApplyJoiningSpaceApiApiResponseProcessor} from "../apis/SpaceApplyJoiningSpaceApiApi";
export class PromiseSpaceApplyJoiningSpaceApiApi {
    private api: ObservableSpaceApplyJoiningSpaceApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: SpaceApplyJoiningSpaceApiApiRequestFactory,
        responseProcessor?: SpaceApplyJoiningSpaceApiApiResponseProcessor
    ) {
        this.api = new ObservableSpaceApplyJoiningSpaceApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Applying to join the space
     * @param spaceJoinApplyRo
     */
    public applyWithHttpInfo(spaceJoinApplyRo: SpaceJoinApplyRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.applyWithHttpInfo(spaceJoinApplyRo, _options);
        return result.toPromise();
    }

    /**
     * Applying to join the space
     * @param spaceJoinApplyRo
     */
    public apply(spaceJoinApplyRo: SpaceJoinApplyRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.apply(spaceJoinApplyRo, _options);
        return result.toPromise();
    }

    /**
     * Process joining application
     * @param spaceJoinProcessRo
     */
    public processWithHttpInfo(spaceJoinProcessRo: SpaceJoinProcessRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.processWithHttpInfo(spaceJoinProcessRo, _options);
        return result.toPromise();
    }

    /**
     * Process joining application
     * @param spaceJoinProcessRo
     */
    public process(spaceJoinProcessRo: SpaceJoinProcessRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.process(spaceJoinProcessRo, _options);
        return result.toPromise();
    }


}



import { ObservableSpaceAuditApiApi } from './ObservableAPI';

import { SpaceAuditApiApiRequestFactory, SpaceAuditApiApiResponseProcessor} from "../apis/SpaceAuditApiApi";
export class PromiseSpaceAuditApiApi {
    private api: ObservableSpaceAuditApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: SpaceAuditApiApiRequestFactory,
        responseProcessor?: SpaceAuditApiApiResponseProcessor
    ) {
        this.api = new ObservableSpaceAuditApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Query space audit logs in pages
     * @param spaceId space id
     * @param beginTime beginTime(format：yyyy-MM-dd HH:mm:ss)
     * @param endTime endTime(format：yyyy-MM-dd HH:mm:ss)
     * @param memberIds member ids
     * @param actions actions
     * @param keyword keyword
     * @param pageNo page no(default 1)
     * @param pageSize page size(default 20，max 100)
     */
    public auditWithHttpInfo(spaceId: string, beginTime?: Date, endTime?: Date, memberIds?: string, actions?: string, keyword?: string, pageNo?: number, pageSize?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoSpaceAuditPageVO>> {
        const result = this.api.auditWithHttpInfo(spaceId, beginTime, endTime, memberIds, actions, keyword, pageNo, pageSize, _options);
        return result.toPromise();
    }

    /**
     * Query space audit logs in pages
     * @param spaceId space id
     * @param beginTime beginTime(format：yyyy-MM-dd HH:mm:ss)
     * @param endTime endTime(format：yyyy-MM-dd HH:mm:ss)
     * @param memberIds member ids
     * @param actions actions
     * @param keyword keyword
     * @param pageNo page no(default 1)
     * @param pageSize page size(default 20，max 100)
     */
    public audit(spaceId: string, beginTime?: Date, endTime?: Date, memberIds?: string, actions?: string, keyword?: string, pageNo?: number, pageSize?: number, _options?: Configuration): Promise<ResponseDataPageInfoSpaceAuditPageVO> {
        const result = this.api.audit(spaceId, beginTime, endTime, memberIds, actions, keyword, pageNo, pageSize, _options);
        return result.toPromise();
    }


}



import { ObservableSpaceInviteLinkApiApi } from './ObservableAPI';

import { SpaceInviteLinkApiApiRequestFactory, SpaceInviteLinkApiApiResponseProcessor} from "../apis/SpaceInviteLinkApiApi";
export class PromiseSpaceInviteLinkApiApi {
    private api: ObservableSpaceInviteLinkApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: SpaceInviteLinkApiApiRequestFactory,
        responseProcessor?: SpaceInviteLinkApiApiResponseProcessor
    ) {
        this.api = new ObservableSpaceInviteLinkApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete link
     * @param spaceLinkOpRo
     * @param xSpaceId space id
     */
    public delete15WithHttpInfo(spaceLinkOpRo: SpaceLinkOpRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete15WithHttpInfo(spaceLinkOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete link
     * @param spaceLinkOpRo
     * @param xSpaceId space id
     */
    public delete15(spaceLinkOpRo: SpaceLinkOpRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete15(spaceLinkOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * return token，the front end stitching $DOMAIN/invite/link?token=:token
     * Generate or refresh link
     * @param spaceLinkOpRo
     * @param xSpaceId space id
     */
    public generateWithHttpInfo(spaceLinkOpRo: SpaceLinkOpRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.generateWithHttpInfo(spaceLinkOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * return token，the front end stitching $DOMAIN/invite/link?token=:token
     * Generate or refresh link
     * @param spaceLinkOpRo
     * @param xSpaceId space id
     */
    public generate(spaceLinkOpRo: SpaceLinkOpRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.generate(spaceLinkOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * If return code status 201,the user redirects to the login page due to unauthorized.
     * Join the space using the public link
     * @param inviteValidRo
     */
    public joinWithHttpInfo(inviteValidRo: InviteValidRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.joinWithHttpInfo(inviteValidRo, _options);
        return result.toPromise();
    }

    /**
     * If return code status 201,the user redirects to the login page due to unauthorized.
     * Join the space using the public link
     * @param inviteValidRo
     */
    public join(inviteValidRo: InviteValidRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.join(inviteValidRo, _options);
        return result.toPromise();
    }

    /**
     * Get a list of links
     * @param xSpaceId space id
     */
    public list3WithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListSpaceLinkVo>> {
        const result = this.api.list3WithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get a list of links
     * @param xSpaceId space id
     */
    public list3(xSpaceId: string, _options?: Configuration): Promise<ResponseDataListSpaceLinkVo> {
        const result = this.api.list3(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * After the verification is successful, it can obtain related invitation information
     * Valid invite link token
     * @param inviteValidRo
     */
    public validWithHttpInfo(inviteValidRo: InviteValidRo, _options?: Configuration): Promise<HttpInfo<ResponseDataSpaceLinkInfoVo>> {
        const result = this.api.validWithHttpInfo(inviteValidRo, _options);
        return result.toPromise();
    }

    /**
     * After the verification is successful, it can obtain related invitation information
     * Valid invite link token
     * @param inviteValidRo
     */
    public valid(inviteValidRo: InviteValidRo, _options?: Configuration): Promise<ResponseDataSpaceLinkInfoVo> {
        const result = this.api.valid(inviteValidRo, _options);
        return result.toPromise();
    }


}



import { ObservableSpaceMainAdminApiApi } from './ObservableAPI';

import { SpaceMainAdminApiApiRequestFactory, SpaceMainAdminApiApiResponseProcessor} from "../apis/SpaceMainAdminApiApi";
export class PromiseSpaceMainAdminApiApi {
    private api: ObservableSpaceMainAdminApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: SpaceMainAdminApiApiRequestFactory,
        responseProcessor?: SpaceMainAdminApiApiResponseProcessor
    ) {
        this.api = new ObservableSpaceMainAdminApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get main admin info
     * @param xSpaceId space id
     */
    public getMainAdminInfoWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataMainAdminInfoVo>> {
        const result = this.api.getMainAdminInfoWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get main admin info
     * @param xSpaceId space id
     */
    public getMainAdminInfo(xSpaceId: string, _options?: Configuration): Promise<ResponseDataMainAdminInfoVo> {
        const result = this.api.getMainAdminInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Change main admin
     * @param spaceMainAdminChangeOpRo
     * @param xSpaceId space id
     */
    public replaceWithHttpInfo(spaceMainAdminChangeOpRo: SpaceMainAdminChangeOpRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.replaceWithHttpInfo(spaceMainAdminChangeOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Change main admin
     * @param spaceMainAdminChangeOpRo
     * @param xSpaceId space id
     */
    public replace(spaceMainAdminChangeOpRo: SpaceMainAdminChangeOpRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.replace(spaceMainAdminChangeOpRo, xSpaceId, _options);
        return result.toPromise();
    }


}



import { ObservableSpaceSpaceApiApi } from './ObservableAPI';

import { SpaceSpaceApiApiRequestFactory, SpaceSpaceApiApiResponseProcessor} from "../apis/SpaceSpaceApiApi";
export class PromiseSpaceSpaceApiApi {
    private api: ObservableSpaceSpaceApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: SpaceSpaceApiApiRequestFactory,
        responseProcessor?: SpaceSpaceApiApiResponseProcessor
    ) {
        this.api = new ObservableSpaceSpaceApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Undo delete space
     * @param spaceId space id
     */
    public cancelWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.cancelWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Undo delete space
     * @param spaceId space id
     */
    public cancel(spaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.cancel(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Get space capacity info
     * @param xSpaceId space id
     */
    public capacityWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataSpaceCapacityVO>> {
        const result = this.api.capacityWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get space capacity info
     * @param xSpaceId space id
     */
    public capacity(xSpaceId: string, _options?: Configuration): Promise<ResponseDataSpaceCapacityVO> {
        const result = this.api.capacity(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Create Space
     * @param spaceOpRo
     */
    public create4WithHttpInfo(spaceOpRo: SpaceOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataCreateSpaceResultVo>> {
        const result = this.api.create4WithHttpInfo(spaceOpRo, _options);
        return result.toPromise();
    }

    /**
     * Create Space
     * @param spaceOpRo
     */
    public create4(spaceOpRo: SpaceOpRo, _options?: Configuration): Promise<ResponseDataCreateSpaceResultVo> {
        const result = this.api.create4(spaceOpRo, _options);
        return result.toPromise();
    }

    /**
     * Delete space immediately
     */
    public delWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Delete space immediately
     */
    public del(_options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.del(_options);
        return result.toPromise();
    }

    /**
     * Delete space
     * @param spaceDeleteRo
     * @param spaceId space id
     */
    public delete16WithHttpInfo(spaceDeleteRo: SpaceDeleteRo, spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete16WithHttpInfo(spaceDeleteRo, spaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete space
     * @param spaceDeleteRo
     * @param spaceId space id
     */
    public delete16(spaceDeleteRo: SpaceDeleteRo, spaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete16(spaceDeleteRo, spaceId, _options);
        return result.toPromise();
    }

    /**
     * Get space feature
     * @param xSpaceId space id
     */
    public featureWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataSpaceGlobalFeature>> {
        const result = this.api.featureWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get space feature
     * @param xSpaceId space id
     */
    public feature(xSpaceId: string, _options?: Configuration): Promise<ResponseDataSpaceGlobalFeature> {
        const result = this.api.feature(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Gets message credit chart data for the space
     * @param spaceId space id
     * @param timeDimension
     */
    public getCreditUsagesWithHttpInfo(spaceId: string, timeDimension?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataCreditUsages>> {
        const result = this.api.getCreditUsagesWithHttpInfo(spaceId, timeDimension, _options);
        return result.toPromise();
    }

    /**
     * Gets message credit chart data for the space
     * @param spaceId space id
     * @param timeDimension
     */
    public getCreditUsages(spaceId: string, timeDimension?: string, _options?: Configuration): Promise<ResponseDataCreditUsages> {
        const result = this.api.getCreditUsages(spaceId, timeDimension, _options);
        return result.toPromise();
    }

    /**
     * Get user space resource
     * @param xSpaceId space id
     */
    public getSpaceResourceWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataUserSpaceVo>> {
        const result = this.api.getSpaceResourceWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get user space resource
     * @param xSpaceId space id
     */
    public getSpaceResource(xSpaceId: string, _options?: Configuration): Promise<ResponseDataUserSpaceVo> {
        const result = this.api.getSpaceResource(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get space info
     * @param spaceId space id
     */
    public info1WithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataSpaceInfoVO>> {
        const result = this.api.info1WithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Get space info
     * @param spaceId space id
     */
    public info1(spaceId: string, _options?: Configuration): Promise<ResponseDataSpaceInfoVO> {
        const result = this.api.info1(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Get space list
     * @param onlyManageable Whether to query only the managed space list. By default, not include
     */
    public list2WithHttpInfo(onlyManageable?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataListSpaceVO>> {
        const result = this.api.list2WithHttpInfo(onlyManageable, _options);
        return result.toPromise();
    }

    /**
     * Get space list
     * @param onlyManageable Whether to query only the managed space list. By default, not include
     */
    public list2(onlyManageable?: boolean, _options?: Configuration): Promise<ResponseDataListSpaceVO> {
        const result = this.api.list2(onlyManageable, _options);
        return result.toPromise();
    }

    /**
     * Quit space
     * @param spaceId space id
     */
    public quitWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.quitWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Quit space
     * @param spaceId space id
     */
    public quit(spaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.quit(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Scenario: Remove the red dot in the inactive space
     * Remove hot point in space
     * @param spaceId space id
     */
    public removeWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.removeWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Scenario: Remove the red dot in the inactive space
     * Remove hot point in space
     * @param spaceId space id
     */
    public remove(spaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.remove(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Gets subscription information for the space
     * @param spaceId space id
     */
    public subscribeWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataSpaceSubscribeVo>> {
        const result = this.api.subscribeWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Gets subscription information for the space
     * @param spaceId space id
     */
    public subscribe(spaceId: string, _options?: Configuration): Promise<ResponseDataSpaceSubscribeVo> {
        const result = this.api.subscribe(spaceId, _options);
        return result.toPromise();
    }

    /**
     * switch space
     * @param spaceId space id
     */
    public switchSpaceWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.switchSpaceWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * switch space
     * @param spaceId space id
     */
    public switchSpace(spaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.switchSpace(spaceId, _options);
        return result.toPromise();
    }

    /**
     * at least one item is name and logo
     * Update space
     * @param spaceUpdateOpRo
     * @param xSpaceId space id
     */
    public update3WithHttpInfo(spaceUpdateOpRo: SpaceUpdateOpRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.update3WithHttpInfo(spaceUpdateOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * at least one item is name and logo
     * Update space
     * @param spaceUpdateOpRo
     * @param xSpaceId space id
     */
    public update3(spaceUpdateOpRo: SpaceUpdateOpRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.update3(spaceUpdateOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Update member setting
     * @param spaceMemberSettingRo
     * @param xSpaceId space id
     */
    public updateMemberSettingWithHttpInfo(spaceMemberSettingRo: SpaceMemberSettingRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateMemberSettingWithHttpInfo(spaceMemberSettingRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Update member setting
     * @param spaceMemberSettingRo
     * @param xSpaceId space id
     */
    public updateMemberSetting(spaceMemberSettingRo: SpaceMemberSettingRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateMemberSetting(spaceMemberSettingRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Update security setting
     * @param spaceSecuritySettingRo
     * @param xSpaceId space id
     */
    public updateSecuritySettingWithHttpInfo(spaceSecuritySettingRo: SpaceSecuritySettingRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateSecuritySettingWithHttpInfo(spaceSecuritySettingRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Update security setting
     * @param spaceSecuritySettingRo
     * @param xSpaceId space id
     */
    public updateSecuritySetting(spaceSecuritySettingRo: SpaceSecuritySettingRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateSecuritySetting(spaceSecuritySettingRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Update workbench setting
     * @param spaceWorkbenchSettingRo
     * @param xSpaceId space id
     */
    public updateWorkbenchSettingWithHttpInfo(spaceWorkbenchSettingRo: SpaceWorkbenchSettingRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateWorkbenchSettingWithHttpInfo(spaceWorkbenchSettingRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Update workbench setting
     * @param spaceWorkbenchSettingRo
     * @param xSpaceId space id
     */
    public updateWorkbenchSetting(spaceWorkbenchSettingRo: SpaceWorkbenchSettingRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateWorkbenchSetting(spaceWorkbenchSettingRo, xSpaceId, _options);
        return result.toPromise();
    }


}



import { ObservableSpaceSubAdminApiApi } from './ObservableAPI';

import { SpaceSubAdminApiApiRequestFactory, SpaceSubAdminApiApiResponseProcessor} from "../apis/SpaceSubAdminApiApi";
export class PromiseSpaceSubAdminApiApi {
    private api: ObservableSpaceSubAdminApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: SpaceSubAdminApiApiRequestFactory,
        responseProcessor?: SpaceSubAdminApiApiResponseProcessor
    ) {
        this.api = new ObservableSpaceSubAdminApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create space role
     * @param addSpaceRoleRo
     * @param xSpaceId space id
     */
    public addRoleWithHttpInfo(addSpaceRoleRo: AddSpaceRoleRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.addRoleWithHttpInfo(addSpaceRoleRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Create space role
     * @param addSpaceRoleRo
     * @param xSpaceId space id
     */
    public addRole(addSpaceRoleRo: AddSpaceRoleRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.addRole(addSpaceRoleRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * delete admin
     * delete admin
     * @param memberId
     * @param xSpaceId space id
     */
    public deleteRoleWithHttpInfo(memberId: number, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseData>> {
        const result = this.api.deleteRoleWithHttpInfo(memberId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * delete admin
     * delete admin
     * @param memberId
     * @param xSpaceId space id
     */
    public deleteRole(memberId: number, xSpaceId: string, _options?: Configuration): Promise<ResponseData> {
        const result = this.api.deleteRole(memberId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Edite space role
     * @param updateSpaceRoleRo
     * @param xSpaceId space id
     */
    public editRoleWithHttpInfo(updateSpaceRoleRo: UpdateSpaceRoleRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseData>> {
        const result = this.api.editRoleWithHttpInfo(updateSpaceRoleRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Edite space role
     * @param updateSpaceRoleRo
     * @param xSpaceId space id
     */
    public editRole(updateSpaceRoleRo: UpdateSpaceRoleRo, xSpaceId: string, _options?: Configuration): Promise<ResponseData> {
        const result = this.api.editRole(updateSpaceRoleRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * query admin detail
     * @param memberId
     * @param xSpaceId space id
     */
    public getRoleDetailWithHttpInfo(memberId: number, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataSpaceRoleDetailVo>> {
        const result = this.api.getRoleDetailWithHttpInfo(memberId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * query admin detail
     * @param memberId
     * @param xSpaceId space id
     */
    public getRoleDetail(memberId: number, xSpaceId: string, _options?: Configuration): Promise<ResponseDataSpaceRoleDetailVo> {
        const result = this.api.getRoleDetail(memberId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Page query sub admin.Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query admins
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams paging parameters
     */
    public listRoleWithHttpInfo(page: Page, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoSpaceRoleVo>> {
        const result = this.api.listRoleWithHttpInfo(page, xSpaceId, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Page query sub admin.Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query admins
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams paging parameters
     */
    public listRole(page: Page, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<ResponseDataPageInfoSpaceRoleVo> {
        const result = this.api.listRole(page, xSpaceId, pageObjectParams, _options);
        return result.toPromise();
    }


}



import { ObservableStoreAPIApi } from './ObservableAPI';

import { StoreAPIApiRequestFactory, StoreAPIApiResponseProcessor} from "../apis/StoreAPIApi";
export class PromiseStoreAPIApi {
    private api: ObservableStoreAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: StoreAPIApiRequestFactory,
        responseProcessor?: StoreAPIApiResponseProcessor
    ) {
        this.api = new ObservableStoreAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Self-operated product price list
     * Get Price List for A Product
     * @param product product name
     */
    public getPricesWithHttpInfo(product: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListProductPriceVo>> {
        const result = this.api.getPricesWithHttpInfo(product, _options);
        return result.toPromise();
    }

    /**
     * Self-operated product price list
     * Get Price List for A Product
     * @param product product name
     */
    public getPrices(product: string, _options?: Configuration): Promise<ResponseDataListProductPriceVo> {
        const result = this.api.getPrices(product, _options);
        return result.toPromise();
    }


}



import { ObservableStripeWebhookControllerApi } from './ObservableAPI';

import { StripeWebhookControllerApiRequestFactory, StripeWebhookControllerApiResponseProcessor} from "../apis/StripeWebhookControllerApi";
export class PromiseStripeWebhookControllerApi {
    private api: ObservableStripeWebhookControllerApi

    public constructor(
        configuration: Configuration,
        requestFactory?: StripeWebhookControllerApiRequestFactory,
        responseProcessor?: StripeWebhookControllerApiResponseProcessor
    ) {
        this.api = new ObservableStripeWebhookControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public retrieveStripeEventWithHttpInfo(_options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.retrieveStripeEventWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public retrieveStripeEvent(_options?: Configuration): Promise<string> {
        const result = this.api.retrieveStripeEvent(_options);
        return result.toPromise();
    }


}



import { ObservableTemplateCenterTemplateAPIApi } from './ObservableAPI';

import { TemplateCenterTemplateAPIApiRequestFactory, TemplateCenterTemplateAPIApiResponseProcessor} from "../apis/TemplateCenterTemplateAPIApi";
export class PromiseTemplateCenterTemplateAPIApi {
    private api: ObservableTemplateCenterTemplateAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: TemplateCenterTemplateAPIApiRequestFactory,
        responseProcessor?: TemplateCenterTemplateAPIApiResponseProcessor
    ) {
        this.api = new ObservableTemplateCenterTemplateAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Created nodes (including child descendant nodes) have administrative rights and are not associated with data tables other than nodes.
     * Create Template
     * @param createTemplateRo
     */
    public create3WithHttpInfo(createTemplateRo: CreateTemplateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.create3WithHttpInfo(createTemplateRo, _options);
        return result.toPromise();
    }

    /**
     * Created nodes (including child descendant nodes) have administrative rights and are not associated with data tables other than nodes.
     * Create Template
     * @param createTemplateRo
     */
    public create3(createTemplateRo: CreateTemplateRo, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.create3(createTemplateRo, _options);
        return result.toPromise();
    }

    /**
     * Deletion objects: main administrator, sub-admins with template permissions, creator of the template
     * Delete Template
     * @param templateId Template ID
     */
    public delete14WithHttpInfo(templateId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete14WithHttpInfo(templateId, _options);
        return result.toPromise();
    }

    /**
     * Deletion objects: main administrator, sub-admins with template permissions, creator of the template
     * Delete Template
     * @param templateId Template ID
     */
    public delete14(templateId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete14(templateId, _options);
        return result.toPromise();
    }

    /**
     * Get Template Directory Info
     * @param templateId Template Id
     * @param categoryCode Official Template Category Code
     * @param isPrivate Whether it is a private template in the space station
     */
    public directoryWithHttpInfo(templateId: string, categoryCode?: string, isPrivate?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataTemplateDirectoryVo>> {
        const result = this.api.directoryWithHttpInfo(templateId, categoryCode, isPrivate, _options);
        return result.toPromise();
    }

    /**
     * Get Template Directory Info
     * @param templateId Template Id
     * @param categoryCode Official Template Category Code
     * @param isPrivate Whether it is a private template in the space station
     */
    public directory(templateId: string, categoryCode?: string, isPrivate?: boolean, _options?: Configuration): Promise<ResponseDataTemplateDirectoryVo> {
        const result = this.api.directory(templateId, categoryCode, isPrivate, _options);
        return result.toPromise();
    }

    /**
     * Get The Template Category Content
     * @param categoryCode Template Category Code
     */
    public getCategoryContentWithHttpInfo(categoryCode: string, _options?: Configuration): Promise<HttpInfo<ResponseDataTemplateCategoryContentVo>> {
        const result = this.api.getCategoryContentWithHttpInfo(categoryCode, _options);
        return result.toPromise();
    }

    /**
     * Get The Template Category Content
     * @param categoryCode Template Category Code
     */
    public getCategoryContent(categoryCode: string, _options?: Configuration): Promise<ResponseDataTemplateCategoryContentVo> {
        const result = this.api.getCategoryContent(categoryCode, _options);
        return result.toPromise();
    }

    /**
     * Get Template Category List
     */
    public getCategoryListWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataListTemplateCategoryMenuVo>> {
        const result = this.api.getCategoryListWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get Template Category List
     */
    public getCategoryList(_options?: Configuration): Promise<ResponseDataListTemplateCategoryMenuVo> {
        const result = this.api.getCategoryList(_options);
        return result.toPromise();
    }

    /**
     * Get Space Templates
     * @param spaceId
     * @param xSpaceId Space Id
     */
    public getSpaceTemplatesWithHttpInfo(spaceId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListTemplateVo>> {
        const result = this.api.getSpaceTemplatesWithHttpInfo(spaceId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get Space Templates
     * @param spaceId
     * @param xSpaceId Space Id
     */
    public getSpaceTemplates(spaceId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataListTemplateVo> {
        const result = this.api.getSpaceTemplates(spaceId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Template Global Search
     * @param keyword Search Keyword
     * @param className Highlight Style Class Name
     */
    public globalSearchWithHttpInfo(keyword: string, className?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataTemplateSearchResultVo>> {
        const result = this.api.globalSearchWithHttpInfo(keyword, className, _options);
        return result.toPromise();
    }

    /**
     * Template Global Search
     * @param keyword Search Keyword
     * @param className Highlight Style Class Name
     */
    public globalSearch(keyword: string, className?: string, _options?: Configuration): Promise<ResponseDataTemplateSearchResultVo> {
        const result = this.api.globalSearch(keyword, className, _options);
        return result.toPromise();
    }

    /**
     * Quote Template
     * @param quoteTemplateRo
     * @param xSocketId user socket id
     */
    public quoteWithHttpInfo(quoteTemplateRo: QuoteTemplateRo, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        const result = this.api.quoteWithHttpInfo(quoteTemplateRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Quote Template
     * @param quoteTemplateRo
     * @param xSocketId user socket id
     */
    public quote(quoteTemplateRo: QuoteTemplateRo, xSocketId?: string, _options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        const result = this.api.quote(quoteTemplateRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Get Template Recommend Content
     */
    public recommendWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataRecommendVo>> {
        const result = this.api.recommendWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get Template Recommend Content
     */
    public recommend(_options?: Configuration): Promise<ResponseDataRecommendVo> {
        const result = this.api.recommend(_options);
        return result.toPromise();
    }

    /**
     * Called before creating a template, the same name will overwrite the old template. you need to confirm the operation again
     * Check if the template name already exists
     * @param name Template Name
     * @param xSpaceId Space Id
     */
    public validateWithHttpInfo(name: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        const result = this.api.validateWithHttpInfo(name, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Called before creating a template, the same name will overwrite the old template. you need to confirm the operation again
     * Check if the template name already exists
     * @param name Template Name
     * @param xSpaceId Space Id
     */
    public validate(name: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataBoolean> {
        const result = this.api.validate(name, xSpaceId, _options);
        return result.toPromise();
    }


}



import { ObservableTemplateCenterTemplateAlbumAPIApi } from './ObservableAPI';

import { TemplateCenterTemplateAlbumAPIApiRequestFactory, TemplateCenterTemplateAlbumAPIApiResponseProcessor} from "../apis/TemplateCenterTemplateAlbumAPIApi";
export class PromiseTemplateCenterTemplateAlbumAPIApi {
    private api: ObservableTemplateCenterTemplateAlbumAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: TemplateCenterTemplateAlbumAPIApiRequestFactory,
        responseProcessor?: TemplateCenterTemplateAlbumAPIApiResponseProcessor
    ) {
        this.api = new ObservableTemplateCenterTemplateAlbumAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get The Template Album Content
     * @param albumId Template Album ID
     */
    public getAlbumContentWithHttpInfo(albumId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataAlbumContentVo>> {
        const result = this.api.getAlbumContentWithHttpInfo(albumId, _options);
        return result.toPromise();
    }

    /**
     * Get The Template Album Content
     * @param albumId Template Album ID
     */
    public getAlbumContent(albumId: string, _options?: Configuration): Promise<ResponseDataAlbumContentVo> {
        const result = this.api.getAlbumContent(albumId, _options);
        return result.toPromise();
    }

    /**
     * Get Recommended Template Albums
     * @param excludeAlbumId Exclude Album
     * @param maxCount Max Count of Load.The number of response result may be smaller than it
     */
    public getRecommendedAlbumsWithHttpInfo(excludeAlbumId?: string, maxCount?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataListAlbumVo>> {
        const result = this.api.getRecommendedAlbumsWithHttpInfo(excludeAlbumId, maxCount, _options);
        return result.toPromise();
    }

    /**
     * Get Recommended Template Albums
     * @param excludeAlbumId Exclude Album
     * @param maxCount Max Count of Load.The number of response result may be smaller than it
     */
    public getRecommendedAlbums(excludeAlbumId?: string, maxCount?: number, _options?: Configuration): Promise<ResponseDataListAlbumVo> {
        const result = this.api.getRecommendedAlbums(excludeAlbumId, maxCount, _options);
        return result.toPromise();
    }


}



import { ObservableTencentQQModuleTencentQQRelatedServiceInterfaceApi } from './ObservableAPI';

import { TencentQQModuleTencentQQRelatedServiceInterfaceApiRequestFactory, TencentQQModuleTencentQQRelatedServiceInterfaceApiResponseProcessor} from "../apis/TencentQQModuleTencentQQRelatedServiceInterfaceApi";
export class PromiseTencentQQModuleTencentQQRelatedServiceInterfaceApi {
    private api: ObservableTencentQQModuleTencentQQRelatedServiceInterfaceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: TencentQQModuleTencentQQRelatedServiceInterfaceApiRequestFactory,
        responseProcessor?: TencentQQModuleTencentQQRelatedServiceInterfaceApiResponseProcessor
    ) {
        this.api = new ObservableTencentQQModuleTencentQQRelatedServiceInterfaceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * code、accessToken, At least one is passed in
     * Website application callback
     * @param type Type (0: Scan code for login; 1: Account binding;)
     * @param code Code (build the request yourself and call back the parameter)
     * @param accessToken Authorization token (use the JS SDK to call back this parameter)
     * @param expiresIn access token\&#39;s TERM OF VALIDITY
     */
    public callback2WithHttpInfo(type?: number, code?: string, accessToken?: string, expiresIn?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.callback2WithHttpInfo(type, code, accessToken, expiresIn, _options);
        return result.toPromise();
    }

    /**
     * code、accessToken, At least one is passed in
     * Website application callback
     * @param type Type (0: Scan code for login; 1: Account binding;)
     * @param code Code (build the request yourself and call back the parameter)
     * @param accessToken Authorization token (use the JS SDK to call back this parameter)
     * @param expiresIn access token\&#39;s TERM OF VALIDITY
     */
    public callback2(type?: number, code?: string, accessToken?: string, expiresIn?: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.callback2(type, code, accessToken, expiresIn, _options);
        return result.toPromise();
    }


}



import { ObservableThirdPartyPlatformIntegrationInterfaceDingTalkApi } from './ObservableAPI';

import { ThirdPartyPlatformIntegrationInterfaceDingTalkApiRequestFactory, ThirdPartyPlatformIntegrationInterfaceDingTalkApiResponseProcessor} from "../apis/ThirdPartyPlatformIntegrationInterfaceDingTalkApi";
export class PromiseThirdPartyPlatformIntegrationInterfaceDingTalkApi {
    private api: ObservableThirdPartyPlatformIntegrationInterfaceDingTalkApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ThirdPartyPlatformIntegrationInterfaceDingTalkApiRequestFactory,
        responseProcessor?: ThirdPartyPlatformIntegrationInterfaceDingTalkApiResponseProcessor
    ) {
        this.api = new ObservableThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * DingTalk application bind space
     * DingTalk The application enterprise binds the space
     * @param dingTalkAgentBindSpaceDTO
     * @param agentId
     */
    public bindSpace1WithHttpInfo(dingTalkAgentBindSpaceDTO: DingTalkAgentBindSpaceDTO, agentId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.bindSpace1WithHttpInfo(dingTalkAgentBindSpaceDTO, agentId, _options);
        return result.toPromise();
    }

    /**
     * DingTalk application bind space
     * DingTalk The application enterprise binds the space
     * @param dingTalkAgentBindSpaceDTO
     * @param agentId
     */
    public bindSpace1(dingTalkAgentBindSpaceDTO: DingTalkAgentBindSpaceDTO, agentId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.bindSpace1(dingTalkAgentBindSpaceDTO, agentId, _options);
        return result.toPromise();
    }

    /**
     * Get the space station ID of the application binding, and jump to the login page when success=false
     * Get the space station ID bound by the application
     * @param agentId
     */
    public bindSpaceInfo1WithHttpInfo(agentId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkBindSpaceVo>> {
        const result = this.api.bindSpaceInfo1WithHttpInfo(agentId, _options);
        return result.toPromise();
    }

    /**
     * Get the space station ID of the application binding, and jump to the login page when success=false
     * Get the space station ID bound by the application
     * @param agentId
     */
    public bindSpaceInfo1(agentId: string, _options?: Configuration): Promise<ResponseDataDingTalkBindSpaceVo> {
        const result = this.api.bindSpaceInfo1(agentId, _options);
        return result.toPromise();
    }

    /**
     * Replace the master administrator
     * Tenant space replacement master administrator
     * @param dingTalkTenantMainAdminChangeRo
     * @param suiteId kit ID
     */
    public changeAdmin1WithHttpInfo(dingTalkTenantMainAdminChangeRo: DingTalkTenantMainAdminChangeRo, suiteId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.changeAdmin1WithHttpInfo(dingTalkTenantMainAdminChangeRo, suiteId, _options);
        return result.toPromise();
    }

    /**
     * Replace the master administrator
     * Tenant space replacement master administrator
     * @param dingTalkTenantMainAdminChangeRo
     * @param suiteId kit ID
     */
    public changeAdmin1(dingTalkTenantMainAdminChangeRo: DingTalkTenantMainAdminChangeRo, suiteId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.changeAdmin1(dingTalkTenantMainAdminChangeRo, suiteId, _options);
        return result.toPromise();
    }

    /**
     * DingTalk Callback interface--Template Creation
     * DingTalk Callback interface--Template Creation
     * @param dingTalkDaTemplateCreateRo
     * @param dingTalkDaAppId
     */
    public dingTalkDaTemplateCreateWithHttpInfo(dingTalkDaTemplateCreateRo: DingTalkDaTemplateCreateRo, dingTalkDaAppId: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.dingTalkDaTemplateCreateWithHttpInfo(dingTalkDaTemplateCreateRo, dingTalkDaAppId, _options);
        return result.toPromise();
    }

    /**
     * DingTalk Callback interface--Template Creation
     * DingTalk Callback interface--Template Creation
     * @param dingTalkDaTemplateCreateRo
     * @param dingTalkDaAppId
     */
    public dingTalkDaTemplateCreate(dingTalkDaTemplateCreateRo: DingTalkDaTemplateCreateRo, dingTalkDaAppId: string, _options?: Configuration): Promise<void> {
        const result = this.api.dingTalkDaTemplateCreate(dingTalkDaTemplateCreateRo, dingTalkDaAppId, _options);
        return result.toPromise();
    }

    /**
     * DingTalk Callback interface--Template application deletion
     * DingTalk Callback interface--Template application deletion
     * @param dingTalkDaTemplateDeleteRo
     * @param dingTalkDaAppId
     */
    public dingTalkDaTemplateDeleteWithHttpInfo(dingTalkDaTemplateDeleteRo: DingTalkDaTemplateDeleteRo, dingTalkDaAppId: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.dingTalkDaTemplateDeleteWithHttpInfo(dingTalkDaTemplateDeleteRo, dingTalkDaAppId, _options);
        return result.toPromise();
    }

    /**
     * DingTalk Callback interface--Template application deletion
     * DingTalk Callback interface--Template application deletion
     * @param dingTalkDaTemplateDeleteRo
     * @param dingTalkDaAppId
     */
    public dingTalkDaTemplateDelete(dingTalkDaTemplateDeleteRo: DingTalkDaTemplateDeleteRo, dingTalkDaAppId: string, _options?: Configuration): Promise<void> {
        const result = this.api.dingTalkDaTemplateDelete(dingTalkDaTemplateDeleteRo, dingTalkDaAppId, _options);
        return result.toPromise();
    }

    /**
     * DingTalk Callback interface--Template application modification
     * DingTalk Callback interface--Template application modification
     * @param dingTalkDaTemplateUpdateRo
     * @param dingTalkDaAppId
     */
    public dingTalkDaTemplateUpdateWithHttpInfo(dingTalkDaTemplateUpdateRo: DingTalkDaTemplateUpdateRo, dingTalkDaAppId: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.dingTalkDaTemplateUpdateWithHttpInfo(dingTalkDaTemplateUpdateRo, dingTalkDaAppId, _options);
        return result.toPromise();
    }

    /**
     * DingTalk Callback interface--Template application modification
     * DingTalk Callback interface--Template application modification
     * @param dingTalkDaTemplateUpdateRo
     * @param dingTalkDaAppId
     */
    public dingTalkDaTemplateUpdate(dingTalkDaTemplateUpdateRo: DingTalkDaTemplateUpdateRo, dingTalkDaAppId: string, _options?: Configuration): Promise<void> {
        const result = this.api.dingTalkDaTemplateUpdate(dingTalkDaTemplateUpdateRo, dingTalkDaAppId, _options);
        return result.toPromise();
    }

    /**
     * Use DingTalk login user identity to authorize login. If no user is bound, return parameters to guide registration
     * DingTalk Application user login
     * @param dingTalkUserLoginRo
     * @param agentId
     */
    public dingTalkUserLoginWithHttpInfo(dingTalkUserLoginRo: DingTalkUserLoginRo, agentId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkUserLoginVo>> {
        const result = this.api.dingTalkUserLoginWithHttpInfo(dingTalkUserLoginRo, agentId, _options);
        return result.toPromise();
    }

    /**
     * Use DingTalk login user identity to authorize login. If no user is bound, return parameters to guide registration
     * DingTalk Application user login
     * @param dingTalkUserLoginRo
     * @param agentId
     */
    public dingTalkUserLogin(dingTalkUserLoginRo: DingTalkUserLoginRo, agentId: string, _options?: Configuration): Promise<ResponseDataDingTalkUserLoginVo> {
        const result = this.api.dingTalkUserLogin(dingTalkUserLoginRo, agentId, _options);
        return result.toPromise();
    }

    /**
     * Get the dd.config parameter
     * Get the dd.config parameter
     * @param dingTalkDdConfigRo
     */
    public getDdConfigParamWithHttpInfo(dingTalkDdConfigRo: DingTalkDdConfigRo, _options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkDdConfigVo>> {
        const result = this.api.getDdConfigParamWithHttpInfo(dingTalkDdConfigRo, _options);
        return result.toPromise();
    }

    /**
     * Get the dd.config parameter
     * Get the dd.config parameter
     * @param dingTalkDdConfigRo
     */
    public getDdConfigParam(dingTalkDdConfigRo: DingTalkDdConfigRo, _options?: Configuration): Promise<ResponseDataDingTalkDdConfigVo> {
        const result = this.api.getDdConfigParam(dingTalkDdConfigRo, _options);
        return result.toPromise();
    }

    /**
     * Get the SKU page address of domestic products
     * Get the SKU page address of domestic products
     * @param dingTalkInternalSkuPageRo
     */
    public getSkuPageWithHttpInfo(dingTalkInternalSkuPageRo: DingTalkInternalSkuPageRo, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.getSkuPageWithHttpInfo(dingTalkInternalSkuPageRo, _options);
        return result.toPromise();
    }

    /**
     * Get the SKU page address of domestic products
     * Get the SKU page address of domestic products
     * @param dingTalkInternalSkuPageRo
     */
    public getSkuPage(dingTalkInternalSkuPageRo: DingTalkInternalSkuPageRo, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.getSkuPage(dingTalkInternalSkuPageRo, _options);
        return result.toPromise();
    }

    /**
     * Get the space information bound by the tenant
     * Get tenant binding information
     * @param suiteId kit ID
     * @param corpId current organization ID
     */
    public getTenantInfo2WithHttpInfo(suiteId: string, corpId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataTenantDetailVO>> {
        const result = this.api.getTenantInfo2WithHttpInfo(suiteId, corpId, _options);
        return result.toPromise();
    }

    /**
     * Get the space information bound by the tenant
     * Get tenant binding information
     * @param suiteId kit ID
     * @param corpId current organization ID
     */
    public getTenantInfo2(suiteId: string, corpId: string, _options?: Configuration): Promise<ResponseDataTenantDetailVO> {
        const result = this.api.getTenantInfo2(suiteId, corpId, _options);
        return result.toPromise();
    }

    /**
     * DingTalk workbench entry, administrator login
     * ISV third-party DingTalk application background administrator login
     * @param dingTalkIsvAminUserLoginRo
     * @param suiteId kit ID
     */
    public isvAminUserLoginWithHttpInfo(dingTalkIsvAminUserLoginRo: DingTalkIsvAminUserLoginRo, suiteId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkIsvAdminUserLoginVo>> {
        const result = this.api.isvAminUserLoginWithHttpInfo(dingTalkIsvAminUserLoginRo, suiteId, _options);
        return result.toPromise();
    }

    /**
     * DingTalk workbench entry, administrator login
     * ISV third-party DingTalk application background administrator login
     * @param dingTalkIsvAminUserLoginRo
     * @param suiteId kit ID
     */
    public isvAminUserLogin(dingTalkIsvAminUserLoginRo: DingTalkIsvAminUserLoginRo, suiteId: string, _options?: Configuration): Promise<ResponseDataDingTalkIsvAdminUserLoginVo> {
        const result = this.api.isvAminUserLogin(dingTalkIsvAminUserLoginRo, suiteId, _options);
        return result.toPromise();
    }

    /**
     * Get the space station ID of the application binding, and jump to the login page when success=false
     * ISV Third party application obtains the space ID bound by the application
     * @param suiteId kit ID
     * @param corpId Current Organization ID
     */
    public isvBindSpaceInfoWithHttpInfo(suiteId: string, corpId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkBindSpaceVo>> {
        const result = this.api.isvBindSpaceInfoWithHttpInfo(suiteId, corpId, _options);
        return result.toPromise();
    }

    /**
     * Get the space station ID of the application binding, and jump to the login page when success=false
     * ISV Third party application obtains the space ID bound by the application
     * @param suiteId kit ID
     * @param corpId Current Organization ID
     */
    public isvBindSpaceInfo(suiteId: string, corpId: string, _options?: Configuration): Promise<ResponseDataDingTalkBindSpaceVo> {
        const result = this.api.isvBindSpaceInfo(suiteId, corpId, _options);
        return result.toPromise();
    }

    /**
     * Use the third-party DingTalk login user identity to authorize login. If no user is bound, return the parameter to guide the registration
     * ISV Third party Ding Talk application user login
     * @param dingTalkIsvUserLoginRo
     * @param suiteId kit ID
     */
    public isvUserLoginWithHttpInfo(dingTalkIsvUserLoginRo: DingTalkIsvUserLoginRo, suiteId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataDingTalkIsvUserLoginVo>> {
        const result = this.api.isvUserLoginWithHttpInfo(dingTalkIsvUserLoginRo, suiteId, _options);
        return result.toPromise();
    }

    /**
     * Use the third-party DingTalk login user identity to authorize login. If no user is bound, return the parameter to guide the registration
     * ISV Third party Ding Talk application user login
     * @param dingTalkIsvUserLoginRo
     * @param suiteId kit ID
     */
    public isvUserLogin(dingTalkIsvUserLoginRo: DingTalkIsvUserLoginRo, suiteId: string, _options?: Configuration): Promise<ResponseDataDingTalkIsvUserLoginVo> {
        const result = this.api.isvUserLogin(dingTalkIsvUserLoginRo, suiteId, _options);
        return result.toPromise();
    }

    /**
     * Refresh the address book of DingTalk application
     * Refresh the address book of DingTalk application
     * @param xSpaceId space id
     */
    public refreshContact1WithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.refreshContact1WithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Refresh the address book of DingTalk application
     * Refresh the address book of DingTalk application
     * @param xSpaceId space id
     */
    public refreshContact1(xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.refreshContact1(xSpaceId, _options);
        return result.toPromise();
    }


}



import { ObservableThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi } from './ObservableAPI';

import { ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiRequestFactory, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiResponseProcessor} from "../apis/ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi";
export class PromiseThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi {
    private api: ObservableThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiRequestFactory,
        responseProcessor?: ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiResponseProcessor
    ) {
        this.api = new ObservableThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Synchronize a group or member to the current station
     * Sync group or member to Honma station
     * @param oneAccessCopyInfoRo
     */
    public copyTeamAndMembersWithHttpInfo(oneAccessCopyInfoRo: OneAccessCopyInfoRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.copyTeamAndMembersWithHttpInfo(oneAccessCopyInfoRo, _options);
        return result.toPromise();
    }

    /**
     * Synchronize a group or member to the current station
     * Sync group or member to Honma station
     * @param oneAccessCopyInfoRo
     */
    public copyTeamAndMembers(oneAccessCopyInfoRo: OneAccessCopyInfoRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.copyTeamAndMembers(oneAccessCopyInfoRo, _options);
        return result.toPromise();
    }

    /**
     * login
     * Unified login interface
     */
    public login2WithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.login2WithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * login
     * Unified login interface
     */
    public login2(_options?: Configuration): Promise<void> {
        const result = this.api.login2(_options);
        return result.toPromise();
    }

    /**
     * Accept the authorization interface of OneAccess and call back the login
     * Login callback interface
     * @param code
     * @param state
     */
    public oauth2CallbackWithHttpInfo(code: string, state: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.oauth2CallbackWithHttpInfo(code, state, _options);
        return result.toPromise();
    }

    /**
     * Accept the authorization interface of OneAccess and call back the login
     * Login callback interface
     * @param code
     * @param state
     */
    public oauth2Callback(code: string, state: string, _options?: Configuration): Promise<void> {
        const result = this.api.oauth2Callback(code, state, _options);
        return result.toPromise();
    }

    /**
     * Organizations are created by oneAccess
     * organization creation
     */
    public orgCreateWithHttpInfo(_options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.orgCreateWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Organizations are created by oneAccess
     * organization creation
     */
    public orgCreate(_options?: Configuration): Promise<string> {
        const result = this.api.orgCreate(_options);
        return result.toPromise();
    }

    /**
     * Active deletion of an organization by OneAccess
     * Organization deletion
     */
    public orgDeleteWithHttpInfo(_options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.orgDeleteWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Active deletion of an organization by OneAccess
     * Organization deletion
     */
    public orgDelete(_options?: Configuration): Promise<string> {
        const result = this.api.orgDelete(_options);
        return result.toPromise();
    }

    /**
     * Organizations are updated by OneAccess
     * Organizational update
     */
    public orgUpdateWithHttpInfo(_options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.orgUpdateWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Organizations are updated by OneAccess
     * Organizational update
     */
    public orgUpdate(_options?: Configuration): Promise<string> {
        const result = this.api.orgUpdate(_options);
        return result.toPromise();
    }

    /**
     * query org by params
     * query org
     */
    public queryOrgByIdServiceWithHttpInfo(_options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.queryOrgByIdServiceWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * query org by params
     * query org
     */
    public queryOrgByIdService(_options?: Configuration): Promise<string> {
        const result = this.api.queryOrgByIdService(_options);
        return result.toPromise();
    }

    /**
     * query user by params
     * query user
     */
    public queryUserByIdServiceWithHttpInfo(_options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.queryUserByIdServiceWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * query user by params
     * query user
     */
    public queryUserByIdService(_options?: Configuration): Promise<string> {
        const result = this.api.queryUserByIdService(_options);
        return result.toPromise();
    }

    /**
     * The account is actively created by the oneAccess platform
     * Account creation
     */
    public userCreateWithHttpInfo(_options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.userCreateWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * The account is actively created by the oneAccess platform
     * Account creation
     */
    public userCreate(_options?: Configuration): Promise<string> {
        const result = this.api.userCreate(_options);
        return result.toPromise();
    }

    /**
     * Delete the account by the oneAccess platform
     * user delete
     */
    public userDeleteWithHttpInfo(_options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.userDeleteWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Delete the account by the oneAccess platform
     * user delete
     */
    public userDelete(_options?: Configuration): Promise<string> {
        const result = this.api.userDelete(_options);
        return result.toPromise();
    }

    /**
     * Log in to the openaccess interface, redirect iam single sign-on
     * login
     */
    public userLogin1WithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.userLogin1WithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Log in to the openaccess interface, redirect iam single sign-on
     * login
     */
    public userLogin1(_options?: Configuration): Promise<void> {
        const result = this.api.userLogin1(_options);
        return result.toPromise();
    }

    /**
     * Get all information about objects such as system account, institution role, etc.
     * Get schema information
     */
    public userSchemaWithHttpInfo(_options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.userSchemaWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get all information about objects such as system account, institution role, etc.
     * Get schema information
     */
    public userSchema(_options?: Configuration): Promise<string> {
        const result = this.api.userSchema(_options);
        return result.toPromise();
    }

    /**
     * The user information is actively updated by the OneAccess platform
     * User update
     */
    public userUpdateWithHttpInfo(_options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.userUpdateWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * The user information is actively updated by the OneAccess platform
     * User update
     */
    public userUpdate(_options?: Configuration): Promise<string> {
        const result = this.api.userUpdate(_options);
        return result.toPromise();
    }

    /**
     * Government WeCom Login
     * Government Affairs WeCom Login Interface
     * @param code
     */
    public wecomLoginWithHttpInfo(code: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.wecomLoginWithHttpInfo(code, _options);
        return result.toPromise();
    }

    /**
     * Government WeCom Login
     * Government Affairs WeCom Login Interface
     * @param code
     */
    public wecomLogin(code: string, _options?: Configuration): Promise<void> {
        const result = this.api.wecomLogin(code, _options);
        return result.toPromise();
    }


}



import { ObservableThirdPartyPlatformIntegrationInterfaceWeComApi } from './ObservableAPI';

import { ThirdPartyPlatformIntegrationInterfaceWeComApiRequestFactory, ThirdPartyPlatformIntegrationInterfaceWeComApiResponseProcessor} from "../apis/ThirdPartyPlatformIntegrationInterfaceWeComApi";
export class PromiseThirdPartyPlatformIntegrationInterfaceWeComApi {
    private api: ObservableThirdPartyPlatformIntegrationInterfaceWeComApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ThirdPartyPlatformIntegrationInterfaceWeComApiRequestFactory,
        responseProcessor?: ThirdPartyPlatformIntegrationInterfaceWeComApiResponseProcessor
    ) {
        this.api = new ObservableThirdPartyPlatformIntegrationInterfaceWeComApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get the space ID bound to the self built application of WeCom, and jump to the login page when success=false
     * Obtain the space ID bound by the self built application of WeCom
     * @param corpId
     * @param agentId
     */
    public bindSpaceInfoWithHttpInfo(corpId: string, agentId: number, _options?: Configuration): Promise<HttpInfo<ResponseDataWeComBindSpaceVo>> {
        const result = this.api.bindSpaceInfoWithHttpInfo(corpId, agentId, _options);
        return result.toPromise();
    }

    /**
     * Get the space ID bound to the self built application of WeCom, and jump to the login page when success=false
     * Obtain the space ID bound by the self built application of WeCom
     * @param corpId
     * @param agentId
     */
    public bindSpaceInfo(corpId: string, agentId: number, _options?: Configuration): Promise<ResponseDataWeComBindSpaceVo> {
        const result = this.api.bindSpaceInfo(corpId, agentId, _options);
        return result.toPromise();
    }

    /**
     * Get the bound WeCom application configuration of the space station
     * Get the bound WeCom application configuration of the space station
     * @param xSpaceId space ID
     */
    public getTenantBindWeComConfigWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataWeComBindConfigVo>> {
        const result = this.api.getTenantBindWeComConfigWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get the bound WeCom application configuration of the space station
     * Get the bound WeCom application configuration of the space station
     * @param xSpaceId space ID
     */
    public getTenantBindWeComConfig(xSpaceId: string, _options?: Configuration): Promise<ResponseDataWeComBindConfigVo> {
        const result = this.api.getTenantBindWeComConfig(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Used to generate We Com scanning code to log in and verify whether the domain name can be accessed
     * WeCom Verification domain name conversion IP
     * @param hotsTransformIpRo
     */
    public hotsTransformIpWithHttpInfo(hotsTransformIpRo: HotsTransformIpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        const result = this.api.hotsTransformIpWithHttpInfo(hotsTransformIpRo, _options);
        return result.toPromise();
    }

    /**
     * Used to generate We Com scanning code to log in and verify whether the domain name can be accessed
     * WeCom Verification domain name conversion IP
     * @param hotsTransformIpRo
     */
    public hotsTransformIp(hotsTransformIpRo: HotsTransformIpRo, _options?: Configuration): Promise<ResponseDataBoolean> {
        const result = this.api.hotsTransformIp(hotsTransformIpRo, _options);
        return result.toPromise();
    }

    /**
     * Get integrated tenant environment configuration
     * Get integrated tenant environment configuration
     * @param xRealHost Real request address
     */
    public socialTenantEnvWithHttpInfo(xRealHost: string, _options?: Configuration): Promise<HttpInfo<ResponseDataSocialTenantEnvVo>> {
        const result = this.api.socialTenantEnvWithHttpInfo(xRealHost, _options);
        return result.toPromise();
    }

    /**
     * Get integrated tenant environment configuration
     * Get integrated tenant environment configuration
     * @param xRealHost Real request address
     */
    public socialTenantEnv(xRealHost: string, _options?: Configuration): Promise<ResponseDataSocialTenantEnvVo> {
        const result = this.api.socialTenantEnv(xRealHost, _options);
        return result.toPromise();
    }

    /**
     * WeCom Application binding space
     * WeCom Application binding space
     * @param weComAgentBindSpaceRo
     * @param configSha
     */
    public weComBindConfigWithHttpInfo(weComAgentBindSpaceRo: WeComAgentBindSpaceRo, configSha: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.weComBindConfigWithHttpInfo(weComAgentBindSpaceRo, configSha, _options);
        return result.toPromise();
    }

    /**
     * WeCom Application binding space
     * WeCom Application binding space
     * @param weComAgentBindSpaceRo
     * @param configSha
     */
    public weComBindConfig(weComAgentBindSpaceRo: WeComAgentBindSpaceRo, configSha: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.weComBindConfig(weComAgentBindSpaceRo, configSha, _options);
        return result.toPromise();
    }

    /**
     * Before binding We Com, verify the third-party application configuration in advance. If the code scanning verification is not successful, the configuration file is not effective
     * WeCom Verification - Authorization Application Configuration
     * @param weComCheckConfigRo
     * @param xSpaceId space id
     */
    public weComCheckConfigWithHttpInfo(weComCheckConfigRo: WeComCheckConfigRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataWeComCheckConfigVo>> {
        const result = this.api.weComCheckConfigWithHttpInfo(weComCheckConfigRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Before binding We Com, verify the third-party application configuration in advance. If the code scanning verification is not successful, the configuration file is not effective
     * WeCom Verification - Authorization Application Configuration
     * @param weComCheckConfigRo
     * @param xSpaceId space id
     */
    public weComCheckConfig(weComCheckConfigRo: WeComCheckConfigRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataWeComCheckConfigVo> {
        const result = this.api.weComCheckConfig(weComCheckConfigRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * WeCom Apply to refresh the address book manually
     * WeCom App Refresh Address Book
     * @param xSpaceId space ID
     */
    public weComRefreshContactWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.weComRefreshContactWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * WeCom Apply to refresh the address book manually
     * WeCom App Refresh Address Book
     * @param xSpaceId space ID
     */
    public weComRefreshContact(xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.weComRefreshContact(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Use WeCom login user identity to authorize login, and return parameters to guide registration when no user is bound
     * WeCom Application user login
     * @param weComUserLoginRo
     */
    public weComUserLoginWithHttpInfo(weComUserLoginRo: WeComUserLoginRo, _options?: Configuration): Promise<HttpInfo<ResponseDataWeComUserLoginVo>> {
        const result = this.api.weComUserLoginWithHttpInfo(weComUserLoginRo, _options);
        return result.toPromise();
    }

    /**
     * Use WeCom login user identity to authorize login, and return parameters to guide registration when no user is bound
     * WeCom Application user login
     * @param weComUserLoginRo
     */
    public weComUserLogin(weComUserLoginRo: WeComUserLoginRo, _options?: Configuration): Promise<ResponseDataWeComUserLoginVo> {
        const result = this.api.weComUserLogin(weComUserLoginRo, _options);
        return result.toPromise();
    }


}



import { ObservableThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi } from './ObservableAPI';

import { ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiRequestFactory, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiResponseProcessor} from "../apis/ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi";
export class PromiseThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi {
    private api: ObservableThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiRequestFactory,
        responseProcessor?: ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiResponseProcessor
    ) {
        this.api = new ObservableThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param msgSignature
     * @param timestamp
     * @param nonce
     * @param echostr
     */
    public getCallbackWithHttpInfo(msgSignature: string, timestamp: string, nonce: string, echostr: string, _options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.getCallbackWithHttpInfo(msgSignature, timestamp, nonce, echostr, _options);
        return result.toPromise();
    }

    /**
     * @param msgSignature
     * @param timestamp
     * @param nonce
     * @param echostr
     */
    public getCallback(msgSignature: string, timestamp: string, nonce: string, echostr: string, _options?: Configuration): Promise<string> {
        const result = this.api.getCallback(msgSignature, timestamp, nonce, echostr, _options);
        return result.toPromise();
    }

    /**
     * JS-SDK Verify the configuration parameters of application identity and permission
     * JS-SDK Verify the configuration parameters of application identity and permission
     * @param spaceId
     * @param url
     */
    public getJsSdkAgentConfigWithHttpInfo(spaceId: string, url: string, _options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvJsSdkAgentConfigVo>> {
        const result = this.api.getJsSdkAgentConfigWithHttpInfo(spaceId, url, _options);
        return result.toPromise();
    }

    /**
     * JS-SDK Verify the configuration parameters of application identity and permission
     * JS-SDK Verify the configuration parameters of application identity and permission
     * @param spaceId
     * @param url
     */
    public getJsSdkAgentConfig(spaceId: string, url: string, _options?: Configuration): Promise<ResponseDataWeComIsvJsSdkAgentConfigVo> {
        const result = this.api.getJsSdkAgentConfig(spaceId, url, _options);
        return result.toPromise();
    }

    /**
     * JS-SDK Verify the configuration parameters of enterprise identity and authority
     * JS-SDK Verify the configuration parameters of enterprise identity and authority
     * @param spaceId
     * @param url
     */
    public getJsSdkConfigWithHttpInfo(spaceId: string, url: string, _options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvJsSdkConfigVo>> {
        const result = this.api.getJsSdkConfigWithHttpInfo(spaceId, url, _options);
        return result.toPromise();
    }

    /**
     * JS-SDK Verify the configuration parameters of enterprise identity and authority
     * JS-SDK Verify the configuration parameters of enterprise identity and authority
     * @param spaceId
     * @param url
     */
    public getJsSdkConfig(spaceId: string, url: string, _options?: Configuration): Promise<ResponseDataWeComIsvJsSdkConfigVo> {
        const result = this.api.getJsSdkConfig(spaceId, url, _options);
        return result.toPromise();
    }

    /**
     * Get the authorization link for installing vika
     * Get the authorization link for installing vika
     * @param finalPath
     */
    public getRegisterInstallSelfUrlWithHttpInfo(finalPath: string, _options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvRegisterInstallSelfUrlVo>> {
        const result = this.api.getRegisterInstallSelfUrlWithHttpInfo(finalPath, _options);
        return result.toPromise();
    }

    /**
     * Get the authorization link for installing vika
     * Get the authorization link for installing vika
     * @param finalPath
     */
    public getRegisterInstallSelfUrl(finalPath: string, _options?: Configuration): Promise<ResponseDataWeComIsvRegisterInstallSelfUrlVo> {
        const result = this.api.getRegisterInstallSelfUrl(finalPath, _options);
        return result.toPromise();
    }

    /**
     * Get the registration code for registering WeCom and installing vika
     * Get the registration code for registering WeCom and installing vika
     */
    public getRegisterInstallWeComWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvRegisterInstallWeComVo>> {
        const result = this.api.getRegisterInstallWeComWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get the registration code for registering WeCom and installing vika
     * Get the registration code for registering WeCom and installing vika
     */
    public getRegisterInstallWeCom(_options?: Configuration): Promise<ResponseDataWeComIsvRegisterInstallWeComVo> {
        const result = this.api.getRegisterInstallWeCom(_options);
        return result.toPromise();
    }

    /**
     * Get tenant binding information
     * Get tenant binding information
     * @param suiteId
     * @param authCorpId
     */
    public getTenantInfoWithHttpInfo(suiteId: string, authCorpId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataTenantDetailVO>> {
        const result = this.api.getTenantInfoWithHttpInfo(suiteId, authCorpId, _options);
        return result.toPromise();
    }

    /**
     * Get tenant binding information
     * Get tenant binding information
     * @param suiteId
     * @param authCorpId
     */
    public getTenantInfo(suiteId: string, authCorpId: string, _options?: Configuration): Promise<ResponseDataTenantDetailVO> {
        const result = this.api.getTenantInfo(suiteId, authCorpId, _options);
        return result.toPromise();
    }

    /**
     * Tenant space replacement master administrator
     * Tenant space replacement master administrator
     * @param weComIsvAdminChangeRo
     */
    public postAdminChangeWithHttpInfo(weComIsvAdminChangeRo: WeComIsvAdminChangeRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.postAdminChangeWithHttpInfo(weComIsvAdminChangeRo, _options);
        return result.toPromise();
    }

    /**
     * Tenant space replacement master administrator
     * Tenant space replacement master administrator
     * @param weComIsvAdminChangeRo
     */
    public postAdminChange(weComIsvAdminChangeRo: WeComIsvAdminChangeRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.postAdminChange(weComIsvAdminChangeRo, _options);
        return result.toPromise();
    }

    /**
     * @param body
     * @param type
     * @param msgSignature
     * @param timestamp
     * @param nonce
     * @param suiteId
     */
    public postCallbackWithHttpInfo(body: string, type: string, msgSignature: string, timestamp: string, nonce: string, suiteId?: string, _options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.postCallbackWithHttpInfo(body, type, msgSignature, timestamp, nonce, suiteId, _options);
        return result.toPromise();
    }

    /**
     * @param body
     * @param type
     * @param msgSignature
     * @param timestamp
     * @param nonce
     * @param suiteId
     */
    public postCallback(body: string, type: string, msgSignature: string, timestamp: string, nonce: string, suiteId?: string, _options?: Configuration): Promise<string> {
        const result = this.api.postCallback(body, type, msgSignature, timestamp, nonce, suiteId, _options);
        return result.toPromise();
    }

    /**
     * Invite unauthorized users
     * Invite unauthorized users
     * @param weComIsvInviteUnauthMemberRo
     */
    public postInviteUnauthMemberWithHttpInfo(weComIsvInviteUnauthMemberRo: WeComIsvInviteUnauthMemberRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.postInviteUnauthMemberWithHttpInfo(weComIsvInviteUnauthMemberRo, _options);
        return result.toPromise();
    }

    /**
     * Invite unauthorized users
     * Invite unauthorized users
     * @param weComIsvInviteUnauthMemberRo
     */
    public postInviteUnauthMember(weComIsvInviteUnauthMemberRo: WeComIsvInviteUnauthMemberRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.postInviteUnauthMember(weComIsvInviteUnauthMemberRo, _options);
        return result.toPromise();
    }

    /**
     * WeCom administrator jumps to the third-party application management page and automatically logs in
     * WeCom administrator jumps to the third-party application management page and automatically logs in
     * @param weComIsvLoginAdminCodeRo
     */
    public postLoginAdminCodeWithHttpInfo(weComIsvLoginAdminCodeRo: WeComIsvLoginAdminCodeRo, _options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvUserLoginVo>> {
        const result = this.api.postLoginAdminCodeWithHttpInfo(weComIsvLoginAdminCodeRo, _options);
        return result.toPromise();
    }

    /**
     * WeCom administrator jumps to the third-party application management page and automatically logs in
     * WeCom administrator jumps to the third-party application management page and automatically logs in
     * @param weComIsvLoginAdminCodeRo
     */
    public postLoginAdminCode(weComIsvLoginAdminCodeRo: WeComIsvLoginAdminCodeRo, _options?: Configuration): Promise<ResponseDataWeComIsvUserLoginVo> {
        const result = this.api.postLoginAdminCode(weComIsvLoginAdminCodeRo, _options);
        return result.toPromise();
    }

    /**
     * WeCom third-party application scanning code login
     * WeCom third-party application scanning code login
     * @param weComIsvLoginAuthCodeRo
     */
    public postLoginAuthCodeWithHttpInfo(weComIsvLoginAuthCodeRo: WeComIsvLoginAuthCodeRo, _options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvUserLoginVo>> {
        const result = this.api.postLoginAuthCodeWithHttpInfo(weComIsvLoginAuthCodeRo, _options);
        return result.toPromise();
    }

    /**
     * WeCom third-party application scanning code login
     * WeCom third-party application scanning code login
     * @param weComIsvLoginAuthCodeRo
     */
    public postLoginAuthCode(weComIsvLoginAuthCodeRo: WeComIsvLoginAuthCodeRo, _options?: Configuration): Promise<ResponseDataWeComIsvUserLoginVo> {
        const result = this.api.postLoginAuthCode(weComIsvLoginAuthCodeRo, _options);
        return result.toPromise();
    }

    /**
     * Auto login to third-party applications within WeCom
     * Auto login to third-party applications within WeCom
     * @param weComIsvLoginCodeRo
     */
    public postLoginCodeWithHttpInfo(weComIsvLoginCodeRo: WeComIsvLoginCodeRo, _options?: Configuration): Promise<HttpInfo<ResponseDataWeComIsvUserLoginVo>> {
        const result = this.api.postLoginCodeWithHttpInfo(weComIsvLoginCodeRo, _options);
        return result.toPromise();
    }

    /**
     * Auto login to third-party applications within WeCom
     * Auto login to third-party applications within WeCom
     * @param weComIsvLoginCodeRo
     */
    public postLoginCode(weComIsvLoginCodeRo: WeComIsvLoginCodeRo, _options?: Configuration): Promise<ResponseDataWeComIsvUserLoginVo> {
        const result = this.api.postLoginCode(weComIsvLoginCodeRo, _options);
        return result.toPromise();
    }


}



import { ObservableThirdPartyPlatformIntegrationInterfaceWoaApi } from './ObservableAPI';

import { ThirdPartyPlatformIntegrationInterfaceWoaApiRequestFactory, ThirdPartyPlatformIntegrationInterfaceWoaApiResponseProcessor} from "../apis/ThirdPartyPlatformIntegrationInterfaceWoaApi";
export class PromiseThirdPartyPlatformIntegrationInterfaceWoaApi {
    private api: ObservableThirdPartyPlatformIntegrationInterfaceWoaApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ThirdPartyPlatformIntegrationInterfaceWoaApiRequestFactory,
        responseProcessor?: ThirdPartyPlatformIntegrationInterfaceWoaApiResponseProcessor
    ) {
        this.api = new ObservableThirdPartyPlatformIntegrationInterfaceWoaApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Woa Application Binding Space
     * @param woaAppBindSpaceRo
     */
    public bindSpaceWithHttpInfo(woaAppBindSpaceRo: WoaAppBindSpaceRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.bindSpaceWithHttpInfo(woaAppBindSpaceRo, _options);
        return result.toPromise();
    }

    /**
     * Woa Application Binding Space
     * @param woaAppBindSpaceRo
     */
    public bindSpace(woaAppBindSpaceRo: WoaAppBindSpaceRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.bindSpace(woaAppBindSpaceRo, _options);
        return result.toPromise();
    }

    /**
     * Apply to refresh the address book manually
     * Woa App Refresh Address Book
     * @param xSpaceId Space ID
     */
    public refreshContactWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.refreshContactWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Apply to refresh the address book manually
     * Woa App Refresh Address Book
     * @param xSpaceId Space ID
     */
    public refreshContact(xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.refreshContact(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Woa Application User Login
     * @param woaUserLoginRo
     */
    public userLoginWithHttpInfo(woaUserLoginRo: WoaUserLoginRo, _options?: Configuration): Promise<HttpInfo<ResponseDataWoaUserLoginVo>> {
        const result = this.api.userLoginWithHttpInfo(woaUserLoginRo, _options);
        return result.toPromise();
    }

    /**
     * Woa Application User Login
     * @param woaUserLoginRo
     */
    public userLogin(woaUserLoginRo: WoaUserLoginRo, _options?: Configuration): Promise<ResponseDataWoaUserLoginVo> {
        const result = this.api.userLogin(woaUserLoginRo, _options);
        return result.toPromise();
    }


}



import { ObservableVCodeActivityAPIApi } from './ObservableAPI';

import { VCodeActivityAPIApiRequestFactory, VCodeActivityAPIApiResponseProcessor} from "../apis/VCodeActivityAPIApi";
export class PromiseVCodeActivityAPIApi {
    private api: ObservableVCodeActivityAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: VCodeActivityAPIApiRequestFactory,
        responseProcessor?: VCodeActivityAPIApiResponseProcessor
    ) {
        this.api = new ObservableVCodeActivityAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Activity
     * @param vCodeActivityRo
     */
    public create2WithHttpInfo(vCodeActivityRo: VCodeActivityRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVCodeActivityVo>> {
        const result = this.api.create2WithHttpInfo(vCodeActivityRo, _options);
        return result.toPromise();
    }

    /**
     * Create Activity
     * @param vCodeActivityRo
     */
    public create2(vCodeActivityRo: VCodeActivityRo, _options?: Configuration): Promise<ResponseDataVCodeActivityVo> {
        const result = this.api.create2(vCodeActivityRo, _options);
        return result.toPromise();
    }

    /**
     * Delete Activity
     * @param activityId Activity ID
     */
    public delete4WithHttpInfo(activityId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete4WithHttpInfo(activityId, _options);
        return result.toPromise();
    }

    /**
     * Delete Activity
     * @param activityId Activity ID
     */
    public delete4(activityId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete4(activityId, _options);
        return result.toPromise();
    }

    /**
     * Delete Activity
     * @param activityId Activity ID
     */
    public delete5WithHttpInfo(activityId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete5WithHttpInfo(activityId, _options);
        return result.toPromise();
    }

    /**
     * Delete Activity
     * @param activityId Activity ID
     */
    public delete5(activityId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete5(activityId, _options);
        return result.toPromise();
    }

    /**
     * Edit Activity Info
     * @param vCodeActivityRo
     * @param activityId Activity ID
     */
    public edit2WithHttpInfo(vCodeActivityRo: VCodeActivityRo, activityId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.edit2WithHttpInfo(vCodeActivityRo, activityId, _options);
        return result.toPromise();
    }

    /**
     * Edit Activity Info
     * @param vCodeActivityRo
     * @param activityId Activity ID
     */
    public edit2(vCodeActivityRo: VCodeActivityRo, activityId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.edit2(vCodeActivityRo, activityId, _options);
        return result.toPromise();
    }

    /**
     * Query Activity List
     * @param keyword Keyword
     */
    public list1WithHttpInfo(keyword?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListVCodeActivityVo>> {
        const result = this.api.list1WithHttpInfo(keyword, _options);
        return result.toPromise();
    }

    /**
     * Query Activity List
     * @param keyword Keyword
     */
    public list1(keyword?: string, _options?: Configuration): Promise<ResponseDataListVCodeActivityVo> {
        const result = this.api.list1(keyword, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Activity Page
     * @param page
     * @param pageObjectParams Page params
     * @param keyword Keyword
     */
    public page2WithHttpInfo(page: Page, pageObjectParams: string, keyword?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoVCodeActivityPageVo>> {
        const result = this.api.page2WithHttpInfo(page, pageObjectParams, keyword, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Activity Page
     * @param page
     * @param pageObjectParams Page params
     * @param keyword Keyword
     */
    public page2(page: Page, pageObjectParams: string, keyword?: string, _options?: Configuration): Promise<ResponseDataPageInfoVCodeActivityPageVo> {
        const result = this.api.page2(page, pageObjectParams, keyword, _options);
        return result.toPromise();
    }


}



import { ObservableVCodeSystemCouponAPIApi } from './ObservableAPI';

import { VCodeSystemCouponAPIApiRequestFactory, VCodeSystemCouponAPIApiResponseProcessor} from "../apis/VCodeSystemCouponAPIApi";
export class PromiseVCodeSystemCouponAPIApi {
    private api: ObservableVCodeSystemCouponAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: VCodeSystemCouponAPIApiRequestFactory,
        responseProcessor?: VCodeSystemCouponAPIApiResponseProcessor
    ) {
        this.api = new ObservableVCodeSystemCouponAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create Coupon Template
     * @param vCodeCouponRo
     */
    public create1WithHttpInfo(vCodeCouponRo: VCodeCouponRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVCodeCouponVo>> {
        const result = this.api.create1WithHttpInfo(vCodeCouponRo, _options);
        return result.toPromise();
    }

    /**
     * Create Coupon Template
     * @param vCodeCouponRo
     */
    public create1(vCodeCouponRo: VCodeCouponRo, _options?: Configuration): Promise<ResponseDataVCodeCouponVo> {
        const result = this.api.create1(vCodeCouponRo, _options);
        return result.toPromise();
    }

    /**
     * Delete Coupon Template
     * @param templateId Coupon Template ID
     */
    public delete2WithHttpInfo(templateId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete2WithHttpInfo(templateId, _options);
        return result.toPromise();
    }

    /**
     * Delete Coupon Template
     * @param templateId Coupon Template ID
     */
    public delete2(templateId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete2(templateId, _options);
        return result.toPromise();
    }

    /**
     * Delete Coupon Template
     * @param templateId Coupon Template ID
     */
    public delete3WithHttpInfo(templateId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete3WithHttpInfo(templateId, _options);
        return result.toPromise();
    }

    /**
     * Delete Coupon Template
     * @param templateId Coupon Template ID
     */
    public delete3(templateId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete3(templateId, _options);
        return result.toPromise();
    }

    /**
     * Edit Coupon Template
     * @param vCodeCouponRo
     * @param templateId Coupon Template ID
     */
    public edit1WithHttpInfo(vCodeCouponRo: VCodeCouponRo, templateId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.edit1WithHttpInfo(vCodeCouponRo, templateId, _options);
        return result.toPromise();
    }

    /**
     * Edit Coupon Template
     * @param vCodeCouponRo
     * @param templateId Coupon Template ID
     */
    public edit1(vCodeCouponRo: VCodeCouponRo, templateId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.edit1(vCodeCouponRo, templateId, _options);
        return result.toPromise();
    }

    /**
     * Query Coupon View List
     * @param keyword Keyword
     */
    public listWithHttpInfo(keyword?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListVCodeCouponVo>> {
        const result = this.api.listWithHttpInfo(keyword, _options);
        return result.toPromise();
    }

    /**
     * Query Coupon View List
     * @param keyword Keyword
     */
    public list(keyword?: string, _options?: Configuration): Promise<ResponseDataListVCodeCouponVo> {
        const result = this.api.list(keyword, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Coupon Page
     * @param page
     * @param pageObjectParams Page Params
     * @param keyword Keyword
     */
    public page1WithHttpInfo(page: Page, pageObjectParams: string, keyword?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoVCodeCouponPageVo>> {
        const result = this.api.page1WithHttpInfo(page, pageObjectParams, keyword, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Coupon Page
     * @param page
     * @param pageObjectParams Page Params
     * @param keyword Keyword
     */
    public page1(page: Page, pageObjectParams: string, keyword?: string, _options?: Configuration): Promise<ResponseDataPageInfoVCodeCouponPageVo> {
        const result = this.api.page1(page, pageObjectParams, keyword, _options);
        return result.toPromise();
    }


}



import { ObservableVCodeSystemVCodeAPIApi } from './ObservableAPI';

import { VCodeSystemVCodeAPIApiRequestFactory, VCodeSystemVCodeAPIApiResponseProcessor} from "../apis/VCodeSystemVCodeAPIApi";
export class PromiseVCodeSystemVCodeAPIApi {
    private api: ObservableVCodeSystemVCodeAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: VCodeSystemVCodeAPIApiRequestFactory,
        responseProcessor?: VCodeSystemVCodeAPIApiResponseProcessor
    ) {
        this.api = new ObservableVCodeSystemVCodeAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete VCode
     * @param code VCode
     */
    public _deleteWithHttpInfo(code: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api._deleteWithHttpInfo(code, _options);
        return result.toPromise();
    }

    /**
     * Delete VCode
     * @param code VCode
     */
    public _delete(code: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api._delete(code, _options);
        return result.toPromise();
    }

    /**
     * Create VCode
     * @param vCodeCreateRo
     */
    public createWithHttpInfo(vCodeCreateRo: VCodeCreateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListString>> {
        const result = this.api.createWithHttpInfo(vCodeCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Create VCode
     * @param vCodeCreateRo
     */
    public create(vCodeCreateRo: VCodeCreateRo, _options?: Configuration): Promise<ResponseDataListString> {
        const result = this.api.create(vCodeCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Delete VCode
     * @param code VCode
     */
    public delete1WithHttpInfo(code: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete1WithHttpInfo(code, _options);
        return result.toPromise();
    }

    /**
     * Delete VCode
     * @param code VCode
     */
    public delete1(code: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete1(code, _options);
        return result.toPromise();
    }

    /**
     * Edit VCode Setting
     * @param vCodeUpdateRo
     * @param code VCode
     */
    public editWithHttpInfo(vCodeUpdateRo: VCodeUpdateRo, code: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.editWithHttpInfo(vCodeUpdateRo, code, _options);
        return result.toPromise();
    }

    /**
     * Edit VCode Setting
     * @param vCodeUpdateRo
     * @param code VCode
     */
    public edit(vCodeUpdateRo: VCodeUpdateRo, code: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.edit(vCodeUpdateRo, code, _options);
        return result.toPromise();
    }

    /**
     * Exchange VCode
     * @param code VCode
     */
    public exchangeWithHttpInfo(code: string, _options?: Configuration): Promise<HttpInfo<ResponseDataInteger>> {
        const result = this.api.exchangeWithHttpInfo(code, _options);
        return result.toPromise();
    }

    /**
     * Exchange VCode
     * @param code VCode
     */
    public exchange(code: string, _options?: Configuration): Promise<ResponseDataInteger> {
        const result = this.api.exchange(code, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query VCode Page
     * @param page
     * @param pageObjectParams Page Params
     * @param type Type (0: official invitation code; 2: redemption code)
     * @param activityId Activity ID
     */
    public pageWithHttpInfo(page: Page, pageObjectParams: string, type?: number, activityId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoVCodePageVo>> {
        const result = this.api.pageWithHttpInfo(page, pageObjectParams, type, activityId, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query VCode Page
     * @param page
     * @param pageObjectParams Page Params
     * @param type Type (0: official invitation code; 2: redemption code)
     * @param activityId Activity ID
     */
    public page(page: Page, pageObjectParams: string, type?: number, activityId?: string, _options?: Configuration): Promise<ResponseDataPageInfoVCodePageVo> {
        const result = this.api.page(page, pageObjectParams, type, activityId, _options);
        return result.toPromise();
    }


}



import { ObservableWeChatMiniAppAPIApi } from './ObservableAPI';

import { WeChatMiniAppAPIApiRequestFactory, WeChatMiniAppAPIApiResponseProcessor} from "../apis/WeChatMiniAppAPIApi";
export class PromiseWeChatMiniAppAPIApi {
    private api: ObservableWeChatMiniAppAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WeChatMiniAppAPIApiRequestFactory,
        responseProcessor?: WeChatMiniAppAPIApiResponseProcessor
    ) {
        this.api = new ObservableWeChatMiniAppAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Mini Program Authorized Login (Silent Authorization)
     * Authorized Login(wx.login user)
     * @param code Wechat login credentials obtained by wx.login
     */
    public authorizeWithHttpInfo(code: string, _options?: Configuration): Promise<HttpInfo<ResponseDataLoginResultVo>> {
        const result = this.api.authorizeWithHttpInfo(code, _options);
        return result.toPromise();
    }

    /**
     * Mini Program Authorized Login (Silent Authorization)
     * Authorized Login(wx.login user)
     * @param code Wechat login credentials obtained by wx.login
     */
    public authorize(code: string, _options?: Configuration): Promise<ResponseDataLoginResultVo> {
        const result = this.api.authorize(code, _options);
        return result.toPromise();
    }

    /**
     * Get User Information
     */
    public getInfoWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataWechatInfoVo>> {
        const result = this.api.getInfoWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get User Information
     */
    public getInfo(_options?: Configuration): Promise<ResponseDataWechatInfoVo> {
        const result = this.api.getInfo(_options);
        return result.toPromise();
    }

    /**
     * Synchronize WeChat User Information
     * @param signature signature
     * @param rawData data
     * @param encryptedData encrypted data
     * @param iv initial vector for encryption algorithm
     */
    public infoWithHttpInfo(signature: string, rawData: string, encryptedData: string, iv: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.infoWithHttpInfo(signature, rawData, encryptedData, iv, _options);
        return result.toPromise();
    }

    /**
     * Synchronize WeChat User Information
     * @param signature signature
     * @param rawData data
     * @param encryptedData encrypted data
     * @param iv initial vector for encryption algorithm
     */
    public info(signature: string, rawData: string, encryptedData: string, iv: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.info(signature, rawData, encryptedData, iv, _options);
        return result.toPromise();
    }

    /**
     * The Operation of The Applet Code
     * @param type type (0: Enter verification validity; 1: Confirm the login (the WeChat account of the Weige account is bound); 2: Cancel the login/bind the account; 3: Confirm the binding account)
     * @param mark mini program code unique identifier
     */
    public operateWithHttpInfo(type: number, mark: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.operateWithHttpInfo(type, mark, _options);
        return result.toPromise();
    }

    /**
     * The Operation of The Applet Code
     * @param type type (0: Enter verification validity; 1: Confirm the login (the WeChat account of the Weige account is bound); 2: Cancel the login/bind the account; 3: Confirm the binding account)
     * @param mark mini program code unique identifier
     */
    public operate(type: number, mark: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.operate(type, mark, _options);
        return result.toPromise();
    }

    /**
     * User authorized to use WeChat mobile number
     * @param encryptedData encrypted data
     * @param iv initial vector for encryption algorithm
     * @param mark mini program code unique identifier
     */
    public phoneWithHttpInfo(encryptedData: string, iv: string, mark?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataLoginResultVo>> {
        const result = this.api.phoneWithHttpInfo(encryptedData, iv, mark, _options);
        return result.toPromise();
    }

    /**
     * User authorized to use WeChat mobile number
     * @param encryptedData encrypted data
     * @param iv initial vector for encryption algorithm
     * @param mark mini program code unique identifier
     */
    public phone(encryptedData: string, iv: string, mark?: string, _options?: Configuration): Promise<ResponseDataLoginResultVo> {
        const result = this.api.phone(encryptedData, iv, mark, _options);
        return result.toPromise();
    }


}



import { ObservableWeChatMpAPIApi } from './ObservableAPI';

import { WeChatMpAPIApiRequestFactory, WeChatMpAPIApiResponseProcessor} from "../apis/WeChatMpAPIApi";
export class PromiseWeChatMpAPIApi {
    private api: ObservableWeChatMpAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WeChatMpAPIApiRequestFactory,
        responseProcessor?: WeChatMpAPIApiResponseProcessor
    ) {
        this.api = new ObservableWeChatMpAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Web Page Authorization Callback
     * @param code coding. JS gets the loginTmpCode, redirects and returns after jumping to the specified connection
     * @param state declare value. Used to prevent replay attacks
     */
    public callback1WithHttpInfo(code: string, state: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.callback1WithHttpInfo(code, state, _options);
        return result.toPromise();
    }

    /**
     * Web Page Authorization Callback
     * @param code coding. JS gets the loginTmpCode, redirects and returns after jumping to the specified connection
     * @param state declare value. Used to prevent replay attacks
     */
    public callback1(code: string, state: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.callback1(code, state, _options);
        return result.toPromise();
    }

    /**
     * Scene: Scan code login, account binding polling results
     * Scan poll
     * @param type type (0: scan code to log in; 1: account binding)
     * @param mark the unique identifier of the qrcode
     */
    public pollWithHttpInfo(type: number, mark: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.pollWithHttpInfo(type, mark, _options);
        return result.toPromise();
    }

    /**
     * Scene: Scan code login, account binding polling results
     * Scan poll
     * @param type type (0: scan code to log in; 1: account binding)
     * @param mark the unique identifier of the qrcode
     */
    public poll(type: number, mark: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.poll(type, mark, _options);
        return result.toPromise();
    }

    /**
     * Get qrcode
     */
    public qrcodeWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataQrCodeVo>> {
        const result = this.api.qrcodeWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get qrcode
     */
    public qrcode(_options?: Configuration): Promise<ResponseDataQrCodeVo> {
        const result = this.api.qrcode(_options);
        return result.toPromise();
    }

    /**
     * Get wechat signature
     * @param mpSignatureRo
     */
    public signatureWithHttpInfo(mpSignatureRo: MpSignatureRo, _options?: Configuration): Promise<HttpInfo<ResponseDataWxJsapiSignature>> {
        const result = this.api.signatureWithHttpInfo(mpSignatureRo, _options);
        return result.toPromise();
    }

    /**
     * Get wechat signature
     * @param mpSignatureRo
     */
    public signature(mpSignatureRo: MpSignatureRo, _options?: Configuration): Promise<ResponseDataWxJsapiSignature> {
        const result = this.api.signature(mpSignatureRo, _options);
        return result.toPromise();
    }


}



import { ObservableWeChatOpenPlatformAPIApi } from './ObservableAPI';

import { WeChatOpenPlatformAPIApiRequestFactory, WeChatOpenPlatformAPIApiResponseProcessor} from "../apis/WeChatOpenPlatformAPIApi";
export class PromiseWeChatOpenPlatformAPIApi {
    private api: ObservableWeChatOpenPlatformAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WeChatOpenPlatformAPIApiRequestFactory,
        responseProcessor?: WeChatOpenPlatformAPIApiResponseProcessor
    ) {
        this.api = new ObservableWeChatOpenPlatformAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * WeChat Message Push Callback
     * @param appId
     * @param signature
     * @param timestamp
     * @param nonce
     * @param openid
     * @param encryptType
     * @param msgSignature
     * @param body
     */
    public callbackWithHttpInfo(appId: string, signature: string, timestamp: string, nonce: string, openid: string, encryptType: string, msgSignature: string, body?: string, _options?: Configuration): Promise<HttpInfo<any>> {
        const result = this.api.callbackWithHttpInfo(appId, signature, timestamp, nonce, openid, encryptType, msgSignature, body, _options);
        return result.toPromise();
    }

    /**
     * WeChat Message Push Callback
     * @param appId
     * @param signature
     * @param timestamp
     * @param nonce
     * @param openid
     * @param encryptType
     * @param msgSignature
     * @param body
     */
    public callback(appId: string, signature: string, timestamp: string, nonce: string, openid: string, encryptType: string, msgSignature: string, body?: string, _options?: Configuration): Promise<any> {
        const result = this.api.callback(appId, signature, timestamp, nonce, openid, encryptType, msgSignature, body, _options);
        return result.toPromise();
    }

    /**
     * Create Pre-authorization URL
     * @param authType Authorized account type, 1. Only the official account authorization list is displayed, 2. Only the applet authorization list is displayed, 3. Both are displayed
     * @param componentAppid Authorized Official Account or Mini Program AppId
     */
    public createPreAuthUrlWithHttpInfo(authType: string, componentAppid: string, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.createPreAuthUrlWithHttpInfo(authType, componentAppid, _options);
        return result.toPromise();
    }

    /**
     * Create Pre-authorization URL
     * @param authType Authorized account type, 1. Only the official account authorization list is displayed, 2. Only the applet authorization list is displayed, 3. Both are displayed
     * @param componentAppid Authorized Official Account or Mini Program AppId
     */
    public createPreAuthUrl(authType: string, componentAppid: string, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.createPreAuthUrl(authType, componentAppid, _options);
        return result.toPromise();
    }

    /**
     * The scene value cannot be passed at all, and the string type is preferred.
     * Generates Qrcode
     * @param type qrcode type, type value (temporary integer value: QR_SCENE, temporary string value: QR_STR_SCENE; permanent integer value: QR_LIMIT_SCENE, permanent string value: QR_LIMIT_STR_SCENE)
     * @param expireSeconds the valid time of the QR code, in seconds. The maximum is not more than 2592000 (that is, 30 days), and the default is 30 seconds.
     * @param sceneId scene value ID, a 32-bit non-zero integer for a temporary QR code, and a maximum value of 100000 for a permanent QR code (current parameters only support 1--100000)
     * @param sceneStr Scene value ID (ID in string form), string type, length limited from 1 to 64.
     * @param appId wechat public account appId
     */
    public createWxQrCodeWithHttpInfo(type?: string, expireSeconds?: number, sceneId?: number, sceneStr?: string, appId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataQrCodeVo>> {
        const result = this.api.createWxQrCodeWithHttpInfo(type, expireSeconds, sceneId, sceneStr, appId, _options);
        return result.toPromise();
    }

    /**
     * The scene value cannot be passed at all, and the string type is preferred.
     * Generates Qrcode
     * @param type qrcode type, type value (temporary integer value: QR_SCENE, temporary string value: QR_STR_SCENE; permanent integer value: QR_LIMIT_SCENE, permanent string value: QR_LIMIT_STR_SCENE)
     * @param expireSeconds the valid time of the QR code, in seconds. The maximum is not more than 2592000 (that is, 30 days), and the default is 30 seconds.
     * @param sceneId scene value ID, a 32-bit non-zero integer for a temporary QR code, and a maximum value of 100000 for a permanent QR code (current parameters only support 1--100000)
     * @param sceneStr Scene value ID (ID in string form), string type, length limited from 1 to 64.
     * @param appId wechat public account appId
     */
    public createWxQrCode(type?: string, expireSeconds?: number, sceneId?: number, sceneStr?: string, appId?: string, _options?: Configuration): Promise<ResponseDataQrCodeVo> {
        const result = this.api.createWxQrCode(type, expireSeconds, sceneId, sceneStr, appId, _options);
        return result.toPromise();
    }

    /**
     * Delete Qrcode
     * @param qrCodeId qrcode ID
     * @param appId wechat public account appId
     */
    public delQrCodeWithHttpInfo(qrCodeId: string, appId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delQrCodeWithHttpInfo(qrCodeId, appId, _options);
        return result.toPromise();
    }

    /**
     * Delete Qrcode
     * @param qrCodeId qrcode ID
     * @param appId wechat public account appId
     */
    public delQrCode(qrCodeId: string, appId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delQrCode(qrCodeId, appId, _options);
        return result.toPromise();
    }

    /**
     * Delete Qrcode
     * @param qrCodeId qrcode ID
     * @param appId wechat public account appId
     */
    public delQrCode1WithHttpInfo(qrCodeId: string, appId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delQrCode1WithHttpInfo(qrCodeId, appId, _options);
        return result.toPromise();
    }

    /**
     * Delete Qrcode
     * @param qrCodeId qrcode ID
     * @param appId wechat public account appId
     */
    public delQrCode1(qrCodeId: string, appId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delQrCode1(qrCodeId, appId, _options);
        return result.toPromise();
    }

    /**
     * Obtain the basic information of the authorized account
     * @param authorizerAppid
     */
    public getAuthorizerInfoWithHttpInfo(authorizerAppid?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataWechatAuthorizationEntity>> {
        const result = this.api.getAuthorizerInfoWithHttpInfo(authorizerAppid, _options);
        return result.toPromise();
    }

    /**
     * Obtain the basic information of the authorized account
     * @param authorizerAppid
     */
    public getAuthorizerInfo(authorizerAppid?: string, _options?: Configuration): Promise<ResponseDataWechatAuthorizationEntity> {
        const result = this.api.getAuthorizerInfo(authorizerAppid, _options);
        return result.toPromise();
    }

    /**
     * Get All Authorized Account Information
     */
    public getAuthorizerListWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataWxOpenAuthorizerListResult>> {
        const result = this.api.getAuthorizerListWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get All Authorized Account Information
     */
    public getAuthorizerList(_options?: Configuration): Promise<ResponseDataWxOpenAuthorizerListResult> {
        const result = this.api.getAuthorizerList(_options);
        return result.toPromise();
    }

    /**
     * Receive Verification Ticket
     * @param timestamp
     * @param nonce
     * @param signature
     * @param body
     * @param encryptType
     * @param msgSignature
     */
    public getComponentVerifyTicketWithHttpInfo(timestamp: string, nonce: string, signature: string, body?: string, encryptType?: string, msgSignature?: string, _options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.getComponentVerifyTicketWithHttpInfo(timestamp, nonce, signature, body, encryptType, msgSignature, _options);
        return result.toPromise();
    }

    /**
     * Receive Verification Ticket
     * @param timestamp
     * @param nonce
     * @param signature
     * @param body
     * @param encryptType
     * @param msgSignature
     */
    public getComponentVerifyTicket(timestamp: string, nonce: string, signature: string, body?: string, encryptType?: string, msgSignature?: string, _options?: Configuration): Promise<string> {
        const result = this.api.getComponentVerifyTicket(timestamp, nonce, signature, body, encryptType, msgSignature, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Qrcode pagination list
     * @param page
     * @param pageObjectParams page params
     * @param appId wechat public account appId
     */
    public getQrCodePageWithHttpInfo(page: Page, pageObjectParams: string, appId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoQrCodePageVo>> {
        const result = this.api.getQrCodePageWithHttpInfo(page, pageObjectParams, appId, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query Qrcode pagination list
     * @param page
     * @param pageObjectParams page params
     * @param appId wechat public account appId
     */
    public getQrCodePage(page: Page, pageObjectParams: string, appId?: string, _options?: Configuration): Promise<ResponseDataPageInfoQrCodePageVo> {
        const result = this.api.getQrCodePage(page, pageObjectParams, appId, _options);
        return result.toPromise();
    }

    /**
     * Get Authorization Code Get Authorization Information
     * @param authCode
     */
    public getQueryAuthWithHttpInfo(authCode?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataWechatAuthorizationEntity>> {
        const result = this.api.getQueryAuthWithHttpInfo(authCode, _options);
        return result.toPromise();
    }

    /**
     * Get Authorization Code Get Authorization Information
     * @param authCode
     */
    public getQueryAuth(authCode?: string, _options?: Configuration): Promise<ResponseDataWechatAuthorizationEntity> {
        const result = this.api.getQueryAuth(authCode, _options);
        return result.toPromise();
    }

    /**
     * Get WeChat server IP list
     * @param appId
     */
    public getWechatIpListWithHttpInfo(appId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListString>> {
        const result = this.api.getWechatIpListWithHttpInfo(appId, _options);
        return result.toPromise();
    }

    /**
     * Get WeChat server IP list
     * @param appId
     */
    public getWechatIpList(appId?: string, _options?: Configuration): Promise<ResponseDataListString> {
        const result = this.api.getWechatIpList(appId, _options);
        return result.toPromise();
    }

    /**
     * Be sure to add keyword replies first in the background of the official account
     * Synchronously update WeChat keyword automatic reply rules
     * @param appId
     */
    public updateWxReplyWithHttpInfo(appId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateWxReplyWithHttpInfo(appId, _options);
        return result.toPromise();
    }

    /**
     * Be sure to add keyword replies first in the background of the official account
     * Synchronously update WeChat keyword automatic reply rules
     * @param appId
     */
    public updateWxReply(appId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateWxReply(appId, _options);
        return result.toPromise();
    }


}



import { ObservableWidgetSDKPackageApiApi } from './ObservableAPI';

import { WidgetSDKPackageApiApiRequestFactory, WidgetSDKPackageApiApiResponseProcessor} from "../apis/WidgetSDKPackageApiApi";
export class PromiseWidgetSDKPackageApiApi {
    private api: ObservableWidgetSDKPackageApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WidgetSDKPackageApiApiRequestFactory,
        responseProcessor?: WidgetSDKPackageApiApiResponseProcessor
    ) {
        this.api = new ObservableWidgetSDKPackageApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * widget-cli initialization create widget
     * Create widget
     * @param widgetPackageCreateRo
     * @param authorization developer token
     */
    public createWidgetWithHttpInfo(widgetPackageCreateRo: WidgetPackageCreateRo, authorization: string, _options?: Configuration): Promise<HttpInfo<ResponseDataWidgetReleaseCreateVo>> {
        const result = this.api.createWidgetWithHttpInfo(widgetPackageCreateRo, authorization, _options);
        return result.toPromise();
    }

    /**
     * widget-cli initialization create widget
     * Create widget
     * @param widgetPackageCreateRo
     * @param authorization developer token
     */
    public createWidget(widgetPackageCreateRo: WidgetPackageCreateRo, authorization: string, _options?: Configuration): Promise<ResponseDataWidgetReleaseCreateVo> {
        const result = this.api.createWidget(widgetPackageCreateRo, authorization, _options);
        return result.toPromise();
    }

    /**
     * widget-cli get widget package info
     * Get widget package info
     * @param packageId
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public getWidgetPackageInfoWithHttpInfo(packageId: string, authorization: string, acceptLanguage?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataWidgetPackageInfoVo>> {
        const result = this.api.getWidgetPackageInfoWithHttpInfo(packageId, authorization, acceptLanguage, _options);
        return result.toPromise();
    }

    /**
     * widget-cli get widget package info
     * Get widget package info
     * @param packageId
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public getWidgetPackageInfo(packageId: string, authorization: string, acceptLanguage?: string, _options?: Configuration): Promise<ResponseDataWidgetPackageInfoVo> {
        const result = this.api.getWidgetPackageInfo(packageId, authorization, acceptLanguage, _options);
        return result.toPromise();
    }

    /**
     * widget-cli get widget store information
     * Get widget store information
     * @param spaceId
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public getWidgetPackageListInfoWithHttpInfo(spaceId: string, authorization: string, acceptLanguage?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetPackageInfoVo>> {
        const result = this.api.getWidgetPackageListInfoWithHttpInfo(spaceId, authorization, acceptLanguage, _options);
        return result.toPromise();
    }

    /**
     * widget-cli get widget store information
     * Get widget store information
     * @param spaceId
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public getWidgetPackageListInfo(spaceId: string, authorization: string, acceptLanguage?: string, _options?: Configuration): Promise<ResponseDataListWidgetPackageInfoVo> {
        const result = this.api.getWidgetPackageListInfo(spaceId, authorization, acceptLanguage, _options);
        return result.toPromise();
    }

    /**
     * Get widget release history
     * @param packageId widget package id
     * @param page
     * @param authorization developer token
     * @param pageObjectParams page
     */
    public releaseListWidgetWithHttpInfo(packageId: number, page: Page, authorization: string, pageObjectParams?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetReleaseListVo>> {
        const result = this.api.releaseListWidgetWithHttpInfo(packageId, page, authorization, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Get widget release history
     * @param packageId widget package id
     * @param page
     * @param authorization developer token
     * @param pageObjectParams page
     */
    public releaseListWidget(packageId: number, page: Page, authorization: string, pageObjectParams?: string, _options?: Configuration): Promise<ResponseDataListWidgetReleaseListVo> {
        const result = this.api.releaseListWidget(packageId, page, authorization, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * widget-cli release widget
     * release widget v2
     * @param widgetPackageReleaseV2Ro
     * @param authorization developer token
     */
    public releaseWidgetV2WithHttpInfo(widgetPackageReleaseV2Ro: WidgetPackageReleaseV2Ro, authorization: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.releaseWidgetV2WithHttpInfo(widgetPackageReleaseV2Ro, authorization, _options);
        return result.toPromise();
    }

    /**
     * widget-cli release widget
     * release widget v2
     * @param widgetPackageReleaseV2Ro
     * @param authorization developer token
     */
    public releaseWidgetV2(widgetPackageReleaseV2Ro: WidgetPackageReleaseV2Ro, authorization: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.releaseWidgetV2(widgetPackageReleaseV2Ro, authorization, _options);
        return result.toPromise();
    }

    /**
     * Rollback widget
     * @param widgetPackageRollbackRo
     * @param authorization developer token
     */
    public rollbackWidgetWithHttpInfo(widgetPackageRollbackRo: WidgetPackageRollbackRo, authorization: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.rollbackWidgetWithHttpInfo(widgetPackageRollbackRo, authorization, _options);
        return result.toPromise();
    }

    /**
     * Rollback widget
     * @param widgetPackageRollbackRo
     * @param authorization developer token
     */
    public rollbackWidget(widgetPackageRollbackRo: WidgetPackageRollbackRo, authorization: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.rollbackWidget(widgetPackageRollbackRo, authorization, _options);
        return result.toPromise();
    }

    /**
     * widget-cli submit widget
     * submit widget v2
     * @param widgetPackageSubmitV2Ro
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public submitWidgetV2WithHttpInfo(widgetPackageSubmitV2Ro: WidgetPackageSubmitV2Ro, authorization: string, acceptLanguage?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.submitWidgetV2WithHttpInfo(widgetPackageSubmitV2Ro, authorization, acceptLanguage, _options);
        return result.toPromise();
    }

    /**
     * widget-cli submit widget
     * submit widget v2
     * @param widgetPackageSubmitV2Ro
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public submitWidgetV2(widgetPackageSubmitV2Ro: WidgetPackageSubmitV2Ro, authorization: string, acceptLanguage?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.submitWidgetV2(widgetPackageSubmitV2Ro, authorization, acceptLanguage, _options);
        return result.toPromise();
    }

    /**
     * widget-cli transfer widget owner
     * Transfer widget owner
     * @param widgetTransferOwnerRo
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public transferWidgetOwnerWithHttpInfo(widgetTransferOwnerRo: WidgetTransferOwnerRo, authorization: string, acceptLanguage?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.transferWidgetOwnerWithHttpInfo(widgetTransferOwnerRo, authorization, acceptLanguage, _options);
        return result.toPromise();
    }

    /**
     * widget-cli transfer widget owner
     * Transfer widget owner
     * @param widgetTransferOwnerRo
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public transferWidgetOwner(widgetTransferOwnerRo: WidgetTransferOwnerRo, authorization: string, acceptLanguage?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.transferWidgetOwner(widgetTransferOwnerRo, authorization, acceptLanguage, _options);
        return result.toPromise();
    }

    /**
     * Unpublish widget
     * @param widgetPackageUnpublishRo
     * @param authorization developer token
     */
    public unpublishWidgetWithHttpInfo(widgetPackageUnpublishRo: WidgetPackageUnpublishRo, authorization: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.unpublishWidgetWithHttpInfo(widgetPackageUnpublishRo, authorization, _options);
        return result.toPromise();
    }

    /**
     * Unpublish widget
     * @param widgetPackageUnpublishRo
     * @param authorization developer token
     */
    public unpublishWidget(widgetPackageUnpublishRo: WidgetPackageUnpublishRo, authorization: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.unpublishWidget(widgetPackageUnpublishRo, authorization, _options);
        return result.toPromise();
    }

    /**
     * widget-cli widget development authentication verification
     * Auth widget
     * @param widgetPackageAuthRo
     * @param authorization developer token
     */
    public widgetAuthWithHttpInfo(widgetPackageAuthRo: WidgetPackageAuthRo, authorization: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.widgetAuthWithHttpInfo(widgetPackageAuthRo, authorization, _options);
        return result.toPromise();
    }

    /**
     * widget-cli widget development authentication verification
     * Auth widget
     * @param widgetPackageAuthRo
     * @param authorization developer token
     */
    public widgetAuth(widgetPackageAuthRo: WidgetPackageAuthRo, authorization: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.widgetAuth(widgetPackageAuthRo, authorization, _options);
        return result.toPromise();
    }


}



import { ObservableWidgetSDKWidgetApiApi } from './ObservableAPI';

import { WidgetSDKWidgetApiApiRequestFactory, WidgetSDKWidgetApiApiResponseProcessor} from "../apis/WidgetSDKWidgetApiApi";
export class PromiseWidgetSDKWidgetApiApi {
    private api: ObservableWidgetSDKWidgetApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WidgetSDKWidgetApiApiRequestFactory,
        responseProcessor?: WidgetSDKWidgetApiApiResponseProcessor
    ) {
        this.api = new ObservableWidgetSDKWidgetApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Scenario: 1、dashboard import widget2:the widget panel sends applets to the dashboard; 3:copy widget
     * Copy widget
     * @param widgetCopyRo
     */
    public copyWidgetWithHttpInfo(widgetCopyRo: WidgetCopyRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetPack>> {
        const result = this.api.copyWidgetWithHttpInfo(widgetCopyRo, _options);
        return result.toPromise();
    }

    /**
     * Scenario: 1、dashboard import widget2:the widget panel sends applets to the dashboard; 3:copy widget
     * Copy widget
     * @param widgetCopyRo
     */
    public copyWidget(widgetCopyRo: WidgetCopyRo, _options?: Configuration): Promise<ResponseDataListWidgetPack> {
        const result = this.api.copyWidget(widgetCopyRo, _options);
        return result.toPromise();
    }

    /**
     * Scenario:1、dashboard new applet 2、datasheet widget panel new widget
     * Create widget
     * @param widgetCreateRo
     */
    public createWidget1WithHttpInfo(widgetCreateRo: WidgetCreateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataWidgetPack>> {
        const result = this.api.createWidget1WithHttpInfo(widgetCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Scenario:1、dashboard new applet 2、datasheet widget panel new widget
     * Create widget
     * @param widgetCreateRo
     */
    public createWidget1(widgetCreateRo: WidgetCreateRo, _options?: Configuration): Promise<ResponseDataWidgetPack> {
        const result = this.api.createWidget1(widgetCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Get package teamplates
     */
    public findTemplatePackageListWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetTemplatePackageInfo>> {
        const result = this.api.findTemplatePackageListWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * Get package teamplates
     */
    public findTemplatePackageList(_options?: Configuration): Promise<ResponseDataListWidgetTemplatePackageInfo> {
        const result = this.api.findTemplatePackageList(_options);
        return result.toPromise();
    }

    /**
     * get the widget information of the node
     * @param nodeId node id
     */
    public findWidgetInfoByNodeIdWithHttpInfo(nodeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetInfo>> {
        const result = this.api.findWidgetInfoByNodeIdWithHttpInfo(nodeId, _options);
        return result.toPromise();
    }

    /**
     * get the widget information of the node
     * @param nodeId node id
     */
    public findWidgetInfoByNodeId(nodeId: string, _options?: Configuration): Promise<ResponseDataListWidgetInfo> {
        const result = this.api.findWidgetInfoByNodeId(nodeId, _options);
        return result.toPromise();
    }

    /**
     * get the widgets under the entire space
     * Get the space widgets
     * @param spaceId space id
     * @param count load quantity
     */
    public findWidgetInfoBySpaceIdWithHttpInfo(spaceId: string, count?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetInfo>> {
        const result = this.api.findWidgetInfoBySpaceIdWithHttpInfo(spaceId, count, _options);
        return result.toPromise();
    }

    /**
     * get the widgets under the entire space
     * Get the space widgets
     * @param spaceId space id
     * @param count load quantity
     */
    public findWidgetInfoBySpaceId(spaceId: string, count?: number, _options?: Configuration): Promise<ResponseDataListWidgetInfo> {
        const result = this.api.findWidgetInfoBySpaceId(spaceId, count, _options);
        return result.toPromise();
    }

    /**
     * Node types are limited to dashboards and datasheet
     * Get the node widget package
     * @param nodeId node id
     * @param linkId association id：node share id、template id
     * @param xSpaceId space id
     */
    public findWidgetPackByNodeIdWithHttpInfo(nodeId: string, linkId?: string, xSpaceId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetPack>> {
        const result = this.api.findWidgetPackByNodeIdWithHttpInfo(nodeId, linkId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Node types are limited to dashboards and datasheet
     * Get the node widget package
     * @param nodeId node id
     * @param linkId association id：node share id、template id
     * @param xSpaceId space id
     */
    public findWidgetPackByNodeId(nodeId: string, linkId?: string, xSpaceId?: string, _options?: Configuration): Promise<ResponseDataListWidgetPack> {
        const result = this.api.findWidgetPackByNodeId(nodeId, linkId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * get widget info by widget id
     * Get widget info
     * @param widgetIds widget ids
     * @param linkId Association ID: node sharing ID and template ID
     */
    public findWidgetPackByWidgetIdsWithHttpInfo(widgetIds: string, linkId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetPack>> {
        const result = this.api.findWidgetPackByWidgetIdsWithHttpInfo(widgetIds, linkId, _options);
        return result.toPromise();
    }

    /**
     * get widget info by widget id
     * Get widget info
     * @param widgetIds widget ids
     * @param linkId Association ID: node sharing ID and template ID
     */
    public findWidgetPackByWidgetIds(widgetIds: string, linkId?: string, _options?: Configuration): Promise<ResponseDataListWidgetPack> {
        const result = this.api.findWidgetPackByWidgetIds(widgetIds, linkId, _options);
        return result.toPromise();
    }

    /**
     * Get widget store
     * @param widgetStoreListRo
     * @param xSpaceId space id
     */
    public widgetStoreListWithHttpInfo(widgetStoreListRo: WidgetStoreListRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetStoreListInfo>> {
        const result = this.api.widgetStoreListWithHttpInfo(widgetStoreListRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get widget store
     * @param widgetStoreListRo
     * @param xSpaceId space id
     */
    public widgetStoreList(widgetStoreListRo: WidgetStoreListRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataListWidgetStoreListInfo> {
        const result = this.api.widgetStoreList(widgetStoreListRo, xSpaceId, _options);
        return result.toPromise();
    }


}



import { ObservableWidgetSDKWidgetAuditApiApi } from './ObservableAPI';

import { WidgetSDKWidgetAuditApiApiRequestFactory, WidgetSDKWidgetAuditApiApiResponseProcessor} from "../apis/WidgetSDKWidgetAuditApiApi";
export class PromiseWidgetSDKWidgetAuditApiApi {
    private api: ObservableWidgetSDKWidgetAuditApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WidgetSDKWidgetAuditApiApiRequestFactory,
        responseProcessor?: WidgetSDKWidgetAuditApiApiResponseProcessor
    ) {
        this.api = new ObservableWidgetSDKWidgetAuditApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Audit global widget submit data
     * @param widgetAuditSubmitDataRo
     */
    public auditSubmitDataWithHttpInfo(widgetAuditSubmitDataRo: WidgetAuditSubmitDataRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.auditSubmitDataWithHttpInfo(widgetAuditSubmitDataRo, _options);
        return result.toPromise();
    }

    /**
     * Audit global widget submit data
     * @param widgetAuditSubmitDataRo
     */
    public auditSubmitData(widgetAuditSubmitDataRo: WidgetAuditSubmitDataRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.auditSubmitData(widgetAuditSubmitDataRo, _options);
        return result.toPromise();
    }

    /**
     * Issue global id
     * @param widgetAuditGlobalIdRo
     */
    public issuedGlobalIdWithHttpInfo(widgetAuditGlobalIdRo: WidgetAuditGlobalIdRo, _options?: Configuration): Promise<HttpInfo<ResponseDataWidgetIssuedGlobalIdVo>> {
        const result = this.api.issuedGlobalIdWithHttpInfo(widgetAuditGlobalIdRo, _options);
        return result.toPromise();
    }

    /**
     * Issue global id
     * @param widgetAuditGlobalIdRo
     */
    public issuedGlobalId(widgetAuditGlobalIdRo: WidgetAuditGlobalIdRo, _options?: Configuration): Promise<ResponseDataWidgetIssuedGlobalIdVo> {
        const result = this.api.issuedGlobalId(widgetAuditGlobalIdRo, _options);
        return result.toPromise();
    }


}



import { ObservableWidgetUploadAPIApi } from './ObservableAPI';

import { WidgetUploadAPIApiRequestFactory, WidgetUploadAPIApiResponseProcessor} from "../apis/WidgetUploadAPIApi";
export class PromiseWidgetUploadAPIApi {
    private api: ObservableWidgetUploadAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WidgetUploadAPIApiRequestFactory,
        responseProcessor?: WidgetUploadAPIApiResponseProcessor
    ) {
        this.api = new ObservableWidgetUploadAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get widget file upload pre signed url
     * @param widgetAssetUploadCertificateRO
     * @param packageId
     */
    public generateWidgetPreSignedUrlWithHttpInfo(widgetAssetUploadCertificateRO: WidgetAssetUploadCertificateRO, packageId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListWidgetUploadTokenVo>> {
        const result = this.api.generateWidgetPreSignedUrlWithHttpInfo(widgetAssetUploadCertificateRO, packageId, _options);
        return result.toPromise();
    }

    /**
     * Get widget file upload pre signed url
     * @param widgetAssetUploadCertificateRO
     * @param packageId
     */
    public generateWidgetPreSignedUrl(widgetAssetUploadCertificateRO: WidgetAssetUploadCertificateRO, packageId: string, _options?: Configuration): Promise<ResponseDataListWidgetUploadTokenVo> {
        const result = this.api.generateWidgetPreSignedUrl(widgetAssetUploadCertificateRO, packageId, _options);
        return result.toPromise();
    }

    /**
     * get widget upload meta
     * get widget upload meta
     */
    public getWidgetUploadMetaWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ResponseDataWidgetUploadMetaVo>> {
        const result = this.api.getWidgetUploadMetaWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     * get widget upload meta
     * get widget upload meta
     */
    public getWidgetUploadMeta(_options?: Configuration): Promise<ResponseDataWidgetUploadMetaVo> {
        const result = this.api.getWidgetUploadMeta(_options);
        return result.toPromise();
    }


}



import { ObservableWorkbenchFieldRoleAPIApi } from './ObservableAPI';

import { WorkbenchFieldRoleAPIApiRequestFactory, WorkbenchFieldRoleAPIApiResponseProcessor} from "../apis/WorkbenchFieldRoleAPIApi";
export class PromiseWorkbenchFieldRoleAPIApi {
    private api: ObservableWorkbenchFieldRoleAPIApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WorkbenchFieldRoleAPIApiRequestFactory,
        responseProcessor?: WorkbenchFieldRoleAPIApiResponseProcessor
    ) {
        this.api = new ObservableWorkbenchFieldRoleAPIApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Add field role
     * @param fieldRoleCreateRo
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public addRole1WithHttpInfo(fieldRoleCreateRo: FieldRoleCreateRo, dstId: string, fieldId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.addRole1WithHttpInfo(fieldRoleCreateRo, dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Add field role
     * @param fieldRoleCreateRo
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public addRole1(fieldRoleCreateRo: FieldRoleCreateRo, dstId: string, fieldId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.addRole1(fieldRoleCreateRo, dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Batch delete role
     * @param batchFieldRoleDeleteRo
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public batchDeleteRole1WithHttpInfo(batchFieldRoleDeleteRo: BatchFieldRoleDeleteRo, dstId: string, fieldId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.batchDeleteRole1WithHttpInfo(batchFieldRoleDeleteRo, dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Batch delete role
     * @param batchFieldRoleDeleteRo
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public batchDeleteRole1(batchFieldRoleDeleteRo: BatchFieldRoleDeleteRo, dstId: string, fieldId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.batchDeleteRole1(batchFieldRoleDeleteRo, dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Batch edit field role
     * @param batchFieldRoleEditRo
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public batchEditRole1WithHttpInfo(batchFieldRoleEditRo: BatchFieldRoleEditRo, dstId: string, fieldId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.batchEditRole1WithHttpInfo(batchFieldRoleEditRo, dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Batch edit field role
     * @param batchFieldRoleEditRo
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public batchEditRole1(batchFieldRoleEditRo: BatchFieldRoleEditRo, dstId: string, fieldId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.batchEditRole1(batchFieldRoleEditRo, dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Delete field role
     * @param fieldRoleDeleteRo
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public deleteRole3WithHttpInfo(fieldRoleDeleteRo: FieldRoleDeleteRo, dstId: string, fieldId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteRole3WithHttpInfo(fieldRoleDeleteRo, dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Delete field role
     * @param fieldRoleDeleteRo
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public deleteRole3(fieldRoleDeleteRo: FieldRoleDeleteRo, dstId: string, fieldId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteRole3(fieldRoleDeleteRo, dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Disable field role
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public disableRoleWithHttpInfo(dstId: string, fieldId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.disableRoleWithHttpInfo(dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Disable field role
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public disableRole(dstId: string, fieldId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.disableRole(dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Edit field role
     * @param fieldRoleEditRo
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public editRole2WithHttpInfo(fieldRoleEditRo: FieldRoleEditRo, dstId: string, fieldId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.editRole2WithHttpInfo(fieldRoleEditRo, dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Edit field role
     * @param fieldRoleEditRo
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public editRole2(fieldRoleEditRo: FieldRoleEditRo, dstId: string, fieldId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.editRole2(fieldRoleEditRo, dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Enable field role
     * @param dstId datasheet id
     * @param fieldId field id
     * @param roleControlOpenRo
     */
    public enableRoleWithHttpInfo(dstId: string, fieldId: string, roleControlOpenRo?: RoleControlOpenRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.enableRoleWithHttpInfo(dstId, fieldId, roleControlOpenRo, _options);
        return result.toPromise();
    }

    /**
     * Enable field role
     * @param dstId datasheet id
     * @param fieldId field id
     * @param roleControlOpenRo
     */
    public enableRole(dstId: string, fieldId: string, roleControlOpenRo?: RoleControlOpenRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.enableRole(dstId, fieldId, roleControlOpenRo, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page Query the Field\' Collaborator
     * @param dstId datasheet id
     * @param fieldId field id
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     */
    public getCollaboratorPage1WithHttpInfo(dstId: string, fieldId: string, page: Page, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoFieldRoleMemberVo>> {
        const result = this.api.getCollaboratorPage1WithHttpInfo(dstId, fieldId, page, xSpaceId, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page Query the Field\' Collaborator
     * @param dstId datasheet id
     * @param fieldId field id
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     */
    public getCollaboratorPage1(dstId: string, fieldId: string, page: Page, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<ResponseDataPageInfoFieldRoleMemberVo> {
        const result = this.api.getCollaboratorPage1(dstId, fieldId, page, xSpaceId, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Get multi datasheet field permission
     * @param dstIds datasheet id
     * @param shareId share id
     */
    public getMultiDatasheetFieldPermissionWithHttpInfo(dstIds: string, shareId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListFieldPermissionView>> {
        const result = this.api.getMultiDatasheetFieldPermissionWithHttpInfo(dstIds, shareId, _options);
        return result.toPromise();
    }

    /**
     * Get multi datasheet field permission
     * @param dstIds datasheet id
     * @param shareId share id
     */
    public getMultiDatasheetFieldPermission(dstIds: string, shareId?: string, _options?: Configuration): Promise<ResponseDataListFieldPermissionView> {
        const result = this.api.getMultiDatasheetFieldPermission(dstIds, shareId, _options);
        return result.toPromise();
    }

    /**
     * Gets the field role infos in datasheet.
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public listRole2WithHttpInfo(dstId: string, fieldId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataFieldCollaboratorVO>> {
        const result = this.api.listRole2WithHttpInfo(dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Gets the field role infos in datasheet.
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public listRole2(dstId: string, fieldId: string, _options?: Configuration): Promise<ResponseDataFieldCollaboratorVO> {
        const result = this.api.listRole2(dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Update field role setting
     * @param fieldControlProp
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public updateRoleSettingWithHttpInfo(fieldControlProp: FieldControlProp, dstId: string, fieldId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateRoleSettingWithHttpInfo(fieldControlProp, dstId, fieldId, _options);
        return result.toPromise();
    }

    /**
     * Update field role setting
     * @param fieldControlProp
     * @param dstId datasheet id
     * @param fieldId field id
     */
    public updateRoleSetting(fieldControlProp: FieldControlProp, dstId: string, fieldId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateRoleSetting(fieldControlProp, dstId, fieldId, _options);
        return result.toPromise();
    }


}



import { ObservableWorkbenchNodeApiApi } from './ObservableAPI';

import { WorkbenchNodeApiApiRequestFactory, WorkbenchNodeApiApiResponseProcessor} from "../apis/WorkbenchNodeApiApi";
export class PromiseWorkbenchNodeApiApi {
    private api: ObservableWorkbenchNodeApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WorkbenchNodeApiApiRequestFactory,
        responseProcessor?: WorkbenchNodeApiApiResponseProcessor
    ) {
        this.api = new ObservableWorkbenchNodeApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * node id and view id are not required（do not pass means all closed）
     * Record active node
     * @param activeSheetsOpRo
     * @param xSpaceId space id
     */
    public activeSheetsWithHttpInfo(activeSheetsOpRo: ActiveSheetsOpRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.activeSheetsWithHttpInfo(activeSheetsOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * node id and view id are not required（do not pass means all closed）
     * Record active node
     * @param activeSheetsOpRo
     * @param xSpaceId space id
     */
    public activeSheets(activeSheetsOpRo: ActiveSheetsOpRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.activeSheets(activeSheetsOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * The front node is saved in the first place of the parent node when it is not under the parent node. Save in the first place of the first level directory when it is not transmitted.
     * Analyze Bundle
     * @param nodeBundleOpRo
     */
    public analyzeBundleWithHttpInfo(nodeBundleOpRo?: NodeBundleOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.analyzeBundleWithHttpInfo(nodeBundleOpRo, _options);
        return result.toPromise();
    }

    /**
     * The front node is saved in the first place of the parent node when it is not under the parent node. Save in the first place of the first level directory when it is not transmitted.
     * Analyze Bundle
     * @param nodeBundleOpRo
     */
    public analyzeBundle(nodeBundleOpRo?: NodeBundleOpRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.analyzeBundle(nodeBundleOpRo, _options);
        return result.toPromise();
    }

    /**
     * permission of the associated node is not required. Scenario: Check whether the view associated mirror before deleting the table.
     * check for associated nodes
     * @param nodeId node id
     * @param viewId view id（do not specify full return）
     * @param type node type（do not specify full return，form:3/mirror:5）
     */
    public checkRelNodeWithHttpInfo(nodeId: string, viewId?: string, type?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfo>> {
        const result = this.api.checkRelNodeWithHttpInfo(nodeId, viewId, type, _options);
        return result.toPromise();
    }

    /**
     * permission of the associated node is not required. Scenario: Check whether the view associated mirror before deleting the table.
     * check for associated nodes
     * @param nodeId node id
     * @param viewId view id（do not specify full return）
     * @param type node type（do not specify full return，form:3/mirror:5）
     */
    public checkRelNode(nodeId: string, viewId?: string, type?: number, _options?: Configuration): Promise<ResponseDataListNodeInfo> {
        const result = this.api.checkRelNode(nodeId, viewId, type, _options);
        return result.toPromise();
    }

    /**
     * node id is required, whether to copy data is not required.
     * Copy node
     * @param nodeCopyOpRo
     * @param xSocketId user socket id
     */
    public copyWithHttpInfo(nodeCopyOpRo: NodeCopyOpRo, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        const result = this.api.copyWithHttpInfo(nodeCopyOpRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * node id is required, whether to copy data is not required.
     * Copy node
     * @param nodeCopyOpRo
     * @param xSocketId user socket id
     */
    public copy(nodeCopyOpRo: NodeCopyOpRo, xSocketId?: string, _options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        const result = this.api.copy(nodeCopyOpRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * create a new node under the node<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Create child node
     * @param nodeOpRo
     * @param xSocketId user socket id
     */
    public create6WithHttpInfo(nodeOpRo: NodeOpRo, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        const result = this.api.create6WithHttpInfo(nodeOpRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * create a new node under the node<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Create child node
     * @param nodeOpRo
     * @param xSocketId user socket id
     */
    public create6(nodeOpRo: NodeOpRo, xSocketId?: string, _options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        const result = this.api.create6(nodeOpRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete8WithHttpInfo(nodeId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete8WithHttpInfo(nodeId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete8(nodeId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete8(nodeId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete9WithHttpInfo(nodeId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete9WithHttpInfo(nodeId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete9(nodeId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete9(nodeId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Export Bundle
     * @param nodeId node id
     * @param saveData whether to retain data
     * @param password encrypted password
     */
    public exportBundleWithHttpInfo(nodeId: string, saveData?: boolean, password?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.exportBundleWithHttpInfo(nodeId, saveData, password, _options);
        return result.toPromise();
    }

    /**
     * Export Bundle
     * @param nodeId node id
     * @param saveData whether to retain data
     * @param password encrypted password
     */
    public exportBundle(nodeId: string, saveData?: boolean, password?: string, _options?: Configuration): Promise<void> {
        const result = this.api.exportBundle(nodeId, saveData, password, _options);
        return result.toPromise();
    }

    /**
     * obtain information about the node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query nodes
     * @param nodeIds node ids
     */
    public getByNodeIdWithHttpInfo(nodeIds: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfoVo>> {
        const result = this.api.getByNodeIdWithHttpInfo(nodeIds, _options);
        return result.toPromise();
    }

    /**
     * obtain information about the node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query nodes
     * @param nodeIds node ids
     */
    public getByNodeId(nodeIds: string, _options?: Configuration): Promise<ResponseDataListNodeInfoVo> {
        const result = this.api.getByNodeId(nodeIds, _options);
        return result.toPromise();
    }

    /**
     * Obtain the list of child nodes of the specified node. The nodes are classified into folders or datasheet by type <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get child nodes
     * @param nodeId node id
     * @param nodeType node type 1:folder,2:datasheet
     */
    public getNodeChildrenListWithHttpInfo(nodeId: string, nodeType?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfoVo>> {
        const result = this.api.getNodeChildrenListWithHttpInfo(nodeId, nodeType, _options);
        return result.toPromise();
    }

    /**
     * Obtain the list of child nodes of the specified node. The nodes are classified into folders or datasheet by type <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get child nodes
     * @param nodeId node id
     * @param nodeType node type 1:folder,2:datasheet
     */
    public getNodeChildrenList(nodeId: string, nodeType?: number, _options?: Configuration): Promise<ResponseDataListNodeInfoVo> {
        const result = this.api.getNodeChildrenList(nodeId, nodeType, _options);
        return result.toPromise();
    }

    /**
     * This interface requires readable or above permissions of the associated node. Scenario: Open the display columns of form and mirror in the datasheet.
     * Get associated node
     * @param nodeId node id
     * @param viewId view id（do not specify full return）
     * @param type node type（do not specify full return，form:3/mirror:5）
     */
    public getNodeRelWithHttpInfo(nodeId: string, viewId?: string, type?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfo>> {
        const result = this.api.getNodeRelWithHttpInfo(nodeId, viewId, type, _options);
        return result.toPromise();
    }

    /**
     * This interface requires readable or above permissions of the associated node. Scenario: Open the display columns of form and mirror in the datasheet.
     * Get associated node
     * @param nodeId node id
     * @param viewId view id（do not specify full return）
     * @param type node type（do not specify full return，form:3/mirror:5）
     */
    public getNodeRel(nodeId: string, viewId?: string, type?: number, _options?: Configuration): Promise<ResponseDataListNodeInfo> {
        const result = this.api.getNodeRel(nodeId, viewId, type, _options);
        return result.toPromise();
    }

    /**
     * Gets a list of all parent nodes of the specified node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get parent nodes
     * @param nodeId node id
     */
    public getParentNodesWithHttpInfo(nodeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListNodePathVo>> {
        const result = this.api.getParentNodesWithHttpInfo(nodeId, _options);
        return result.toPromise();
    }

    /**
     * Gets a list of all parent nodes of the specified node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get parent nodes
     * @param nodeId node id
     */
    public getParentNodes(nodeId: string, _options?: Configuration): Promise<ResponseDataListNodePathVo> {
        const result = this.api.getParentNodes(nodeId, _options);
        return result.toPromise();
    }

    /**
     * Query the node tree of workbench, restricted to two levels.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query tree node
     * @param xSpaceId space id
     * @param depth tree depth, we can specify the query depth, maximum 2 layers depth.
     */
    public getTreeWithHttpInfo(xSpaceId: string, depth?: number, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoTreeVo>> {
        const result = this.api.getTreeWithHttpInfo(xSpaceId, depth, _options);
        return result.toPromise();
    }

    /**
     * Query the node tree of workbench, restricted to two levels.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query tree node
     * @param xSpaceId space id
     * @param depth tree depth, we can specify the query depth, maximum 2 layers depth.
     */
    public getTree(xSpaceId: string, depth?: number, _options?: Configuration): Promise<ResponseDataNodeInfoTreeVo> {
        const result = this.api.getTree(xSpaceId, depth, _options);
        return result.toPromise();
    }

    /**
     * all parameters must be
     * Import excel
     * @param importExcelOpRo
     */
    public importExcelWithHttpInfo(importExcelOpRo?: ImportExcelOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        const result = this.api.importExcelWithHttpInfo(importExcelOpRo, _options);
        return result.toPromise();
    }

    /**
     * all parameters must be
     * Import excel
     * @param importExcelOpRo
     */
    public importExcel(importExcelOpRo?: ImportExcelOpRo, _options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        const result = this.api.importExcel(importExcelOpRo, _options);
        return result.toPromise();
    }

    /**
     * all parameters must be
     * Import excel
     * @param importExcelOpRo
     */
    public importExcel1WithHttpInfo(importExcelOpRo?: ImportExcelOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        const result = this.api.importExcel1WithHttpInfo(importExcelOpRo, _options);
        return result.toPromise();
    }

    /**
     * all parameters must be
     * Import excel
     * @param importExcelOpRo
     */
    public importExcel1(importExcelOpRo?: ImportExcelOpRo, _options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        const result = this.api.importExcel1(importExcelOpRo, _options);
        return result.toPromise();
    }

    /**
     * scenario: query an existing dashboard
     * Get nodes of the specified type
     * @param type node type
     * @param xSpaceId space id
     * @param role role（manageable by default）
     */
    public list6WithHttpInfo(type: number, xSpaceId: string, role?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfo>> {
        const result = this.api.list6WithHttpInfo(type, xSpaceId, role, _options);
        return result.toPromise();
    }

    /**
     * scenario: query an existing dashboard
     * Get nodes of the specified type
     * @param type node type
     * @param xSpaceId space id
     * @param role role（manageable by default）
     */
    public list6(type: number, xSpaceId: string, role?: string, _options?: Configuration): Promise<ResponseDataListNodeInfo> {
        const result = this.api.list6(type, xSpaceId, role, _options);
        return result.toPromise();
    }

    /**
     * Node ID and parent node ID are required, and pre Node Id is not required.
     * Move node
     * @param nodeMoveOpRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public moveWithHttpInfo(nodeMoveOpRo: NodeMoveOpRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfoVo>> {
        const result = this.api.moveWithHttpInfo(nodeMoveOpRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Node ID and parent node ID are required, and pre Node Id is not required.
     * Move node
     * @param nodeMoveOpRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public move(nodeMoveOpRo: NodeMoveOpRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataListNodeInfoVo> {
        const result = this.api.move(nodeMoveOpRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * node in must <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Position node
     * @param nodeId node id
     */
    public positionWithHttpInfo(nodeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoTreeVo>> {
        const result = this.api.positionWithHttpInfo(nodeId, _options);
        return result.toPromise();
    }

    /**
     * node in must <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Position node
     * @param nodeId node id
     */
    public position(nodeId: string, _options?: Configuration): Promise<ResponseDataNodeInfoTreeVo> {
        const result = this.api.position(nodeId, _options);
        return result.toPromise();
    }

    /**
     * Gets no permission member before remind
     * @param remindUnitsNoPermissionRo
     */
    public postRemindUnitsNoPermissionWithHttpInfo(remindUnitsNoPermissionRo: RemindUnitsNoPermissionRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListMemberBriefInfoVo>> {
        const result = this.api.postRemindUnitsNoPermissionWithHttpInfo(remindUnitsNoPermissionRo, _options);
        return result.toPromise();
    }

    /**
     * Gets no permission member before remind
     * @param remindUnitsNoPermissionRo
     */
    public postRemindUnitsNoPermission(remindUnitsNoPermissionRo: RemindUnitsNoPermissionRo, _options?: Configuration): Promise<ResponseDataListMemberBriefInfoVo> {
        const result = this.api.postRemindUnitsNoPermission(remindUnitsNoPermissionRo, _options);
        return result.toPromise();
    }

    /**
     * member recent open node list
     * member recent open node list
     * @param xSpaceId space id
     */
    public recentListWithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListNodeSearchResult>> {
        const result = this.api.recentListWithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * member recent open node list
     * member recent open node list
     * @param xSpaceId space id
     */
    public recentList(xSpaceId: string, _options?: Configuration): Promise<ResponseDataListNodeSearchResult> {
        const result = this.api.recentList(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Remind notification
     * @param remindMemberRo
     */
    public remindWithHttpInfo(remindMemberRo: RemindMemberRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.remindWithHttpInfo(remindMemberRo, _options);
        return result.toPromise();
    }

    /**
     * Remind notification
     * @param remindMemberRo
     */
    public remind(remindMemberRo: RemindMemberRo, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.remind(remindMemberRo, _options);
        return result.toPromise();
    }

    /**
     * Enter the search term to search for the node of the working directory.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Fuzzy search node
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className highlight style
     */
    public searchNodeWithHttpInfo(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListNodeSearchResult>> {
        const result = this.api.searchNodeWithHttpInfo(keyword, xSpaceId, className, _options);
        return result.toPromise();
    }

    /**
     * Enter the search term to search for the node of the working directory.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Fuzzy search node
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className highlight style
     */
    public searchNode(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Promise<ResponseDataListNodeSearchResult> {
        const result = this.api.searchNode(keyword, xSpaceId, className, _options);
        return result.toPromise();
    }

    /**
     * Nodes that are not in the center of the template, make spatial judgments.
     * Node info window
     * @param nodeId
     */
    public showNodeInfoWindowWithHttpInfo(nodeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoWindowVo>> {
        const result = this.api.showNodeInfoWindowWithHttpInfo(nodeId, _options);
        return result.toPromise();
    }

    /**
     * Nodes that are not in the center of the template, make spatial judgments.
     * Node info window
     * @param nodeId
     */
    public showNodeInfoWindow(nodeId: string, _options?: Configuration): Promise<ResponseDataNodeInfoWindowVo> {
        const result = this.api.showNodeInfoWindow(nodeId, _options);
        return result.toPromise();
    }

    /**
     * Nodes that are not in the center of the template, make cross-space judgments.
     * Folder preview
     * @param nodeId node id
     * @param shareId share id
     */
    public showcaseWithHttpInfo(nodeId: string, shareId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataShowcaseVo>> {
        const result = this.api.showcaseWithHttpInfo(nodeId, shareId, _options);
        return result.toPromise();
    }

    /**
     * Nodes that are not in the center of the template, make cross-space judgments.
     * Folder preview
     * @param nodeId node id
     * @param shareId share id
     */
    public showcase(nodeId: string, shareId?: string, _options?: Configuration): Promise<ResponseDataShowcaseVo> {
        const result = this.api.showcase(nodeId, shareId, _options);
        return result.toPromise();
    }

    /**
     * node id must. name, icon is not required<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Edit node
     * @param nodeUpdateOpRo
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public update5WithHttpInfo(nodeUpdateOpRo: NodeUpdateOpRo, nodeId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        const result = this.api.update5WithHttpInfo(nodeUpdateOpRo, nodeId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * node id must. name, icon is not required<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Edit node
     * @param nodeUpdateOpRo
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public update5(nodeUpdateOpRo: NodeUpdateOpRo, nodeId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        const result = this.api.update5(nodeUpdateOpRo, nodeId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Update node description
     * @param nodeDescOpRo
     * @param xSocketId user socket id
     */
    public updateDescWithHttpInfo(nodeDescOpRo: NodeDescOpRo, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateDescWithHttpInfo(nodeDescOpRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Update node description
     * @param nodeDescOpRo
     * @param xSocketId user socket id
     */
    public updateDesc(nodeDescOpRo: NodeDescOpRo, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateDesc(nodeDescOpRo, xSocketId, _options);
        return result.toPromise();
    }


}



import { ObservableWorkbenchNodeFavoriteApiApi } from './ObservableAPI';

import { WorkbenchNodeFavoriteApiApiRequestFactory, WorkbenchNodeFavoriteApiApiResponseProcessor} from "../apis/WorkbenchNodeFavoriteApiApi";
export class PromiseWorkbenchNodeFavoriteApiApi {
    private api: ObservableWorkbenchNodeFavoriteApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WorkbenchNodeFavoriteApiApiRequestFactory,
        responseProcessor?: WorkbenchNodeFavoriteApiApiResponseProcessor
    ) {
        this.api = new ObservableWorkbenchNodeFavoriteApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get favorite nodes
     * @param xSpaceId space id
     */
    public list7WithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListFavoriteNodeInfo>> {
        const result = this.api.list7WithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get favorite nodes
     * @param xSpaceId space id
     */
    public list7(xSpaceId: string, _options?: Configuration): Promise<ResponseDataListFavoriteNodeInfo> {
        const result = this.api.list7(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Move favorite node
     * @param markNodeMoveRo
     * @param xSpaceId space id
     */
    public move1WithHttpInfo(markNodeMoveRo: MarkNodeMoveRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.move1WithHttpInfo(markNodeMoveRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Move favorite node
     * @param markNodeMoveRo
     * @param xSpaceId space id
     */
    public move1(markNodeMoveRo: MarkNodeMoveRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.move1(markNodeMoveRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Change favorite status
     * @param nodeId node id
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public updateStatusWithHttpInfo(nodeId: string, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.updateStatusWithHttpInfo(nodeId, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Change favorite status
     * @param nodeId node id
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public updateStatus(nodeId: string, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.updateStatus(nodeId, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }


}



import { ObservableWorkbenchNodeRoleApiApi } from './ObservableAPI';

import { WorkbenchNodeRoleApiApiRequestFactory, WorkbenchNodeRoleApiApiResponseProcessor} from "../apis/WorkbenchNodeRoleApiApi";
export class PromiseWorkbenchNodeRoleApiApi {
    private api: ObservableWorkbenchNodeRoleApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WorkbenchNodeRoleApiApiRequestFactory,
        responseProcessor?: WorkbenchNodeRoleApiApiResponseProcessor
    ) {
        this.api = new ObservableWorkbenchNodeRoleApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Batch delete node role
     * @param batchDeleteNodeRoleRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public batchDeleteRoleWithHttpInfo(batchDeleteNodeRoleRo: BatchDeleteNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.batchDeleteRoleWithHttpInfo(batchDeleteNodeRoleRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Batch delete node role
     * @param batchDeleteNodeRoleRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public batchDeleteRole(batchDeleteNodeRoleRo: BatchDeleteNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.batchDeleteRole(batchDeleteNodeRoleRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Batch modify the role of the organizational unit of the node
     * Batch edit role
     * @param batchModifyNodeRoleRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public batchEditRoleWithHttpInfo(batchModifyNodeRoleRo: BatchModifyNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.batchEditRoleWithHttpInfo(batchModifyNodeRoleRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Batch modify the role of the organizational unit of the node
     * Batch edit role
     * @param batchModifyNodeRoleRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public batchEditRole(batchModifyNodeRoleRo: BatchModifyNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.batchEditRole(batchModifyNodeRoleRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Add the organizational unit of the node specified role
     * Create node role
     * @param addNodeRoleRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public createRole1WithHttpInfo(addNodeRoleRo: AddNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.createRole1WithHttpInfo(addNodeRoleRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Add the organizational unit of the node specified role
     * Create node role
     * @param addNodeRoleRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public createRole1(addNodeRoleRo: AddNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.createRole1(addNodeRoleRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Delete role
     * @param deleteNodeRoleRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public deleteRole2WithHttpInfo(deleteNodeRoleRo: DeleteNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.deleteRole2WithHttpInfo(deleteNodeRoleRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Delete role
     * @param deleteNodeRoleRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public deleteRole2(deleteNodeRoleRo: DeleteNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.deleteRole2(deleteNodeRoleRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Disable role extend
     * @param nodeId node id
     * @param xSpaceId space id
     * @param roleControlOpenRo
     * @param xSocketId user socket id
     */
    public disableRoleExtendWithHttpInfo(nodeId: string, xSpaceId: string, roleControlOpenRo?: RoleControlOpenRo, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.disableRoleExtendWithHttpInfo(nodeId, xSpaceId, roleControlOpenRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Disable role extend
     * @param nodeId node id
     * @param xSpaceId space id
     * @param roleControlOpenRo
     * @param xSocketId user socket id
     */
    public disableRoleExtend(nodeId: string, xSpaceId: string, roleControlOpenRo?: RoleControlOpenRo, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.disableRoleExtend(nodeId, xSpaceId, roleControlOpenRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Modify the role of the organizational unit of the node
     * Edit node role
     * @param modifyNodeRoleRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public editRole1WithHttpInfo(modifyNodeRoleRo: ModifyNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.editRole1WithHttpInfo(modifyNodeRoleRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Modify the role of the organizational unit of the node
     * Edit node role
     * @param modifyNodeRoleRo
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public editRole1(modifyNodeRoleRo: ModifyNodeRoleRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.editRole1(modifyNodeRoleRo, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Enable role extend
     * @param nodeId node id
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public enableRoleExtendWithHttpInfo(nodeId: string, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.enableRoleExtendWithHttpInfo(nodeId, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Enable role extend
     * @param nodeId node id
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public enableRoleExtend(nodeId: string, xSpaceId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.enableRoleExtend(nodeId, xSpaceId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Scene: Collaborator Card Information
     * Get Collaborator Info
     * @param uuid
     * @param nodeId
     * @param xSpaceId space id
     */
    public getCollaboratorInfoWithHttpInfo(uuid: string, nodeId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeCollaboratorVO>> {
        const result = this.api.getCollaboratorInfoWithHttpInfo(uuid, nodeId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Scene: Collaborator Card Information
     * Get Collaborator Info
     * @param uuid
     * @param nodeId
     * @param xSpaceId space id
     */
    public getCollaboratorInfo(uuid: string, nodeId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataNodeCollaboratorVO> {
        const result = this.api.getCollaboratorInfo(uuid, nodeId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page Query the Node\' Collaborator
     * @param nodeId node id
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     */
    public getCollaboratorPageWithHttpInfo(nodeId: string, page: Page, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<HttpInfo<ResponseDataPageInfoNodeRoleMemberVo>> {
        const result = this.api.getCollaboratorPageWithHttpInfo(nodeId, page, xSpaceId, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Page Query the Node\' Collaborator
     * @param nodeId node id
     * @param page
     * @param xSpaceId space id
     * @param pageObjectParams page\&#39;s parameter
     */
    public getCollaboratorPage(nodeId: string, page: Page, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Promise<ResponseDataPageInfoNodeRoleMemberVo> {
        const result = this.api.getCollaboratorPage(nodeId, page, xSpaceId, pageObjectParams, _options);
        return result.toPromise();
    }

    /**
     * Get node roles
     * @param nodeId node id
     * @param xSpaceId space id
     * @param includeAdmin Whether to include the master administrator, can not be passed, the default includes
     * @param includeSelf Whether to get userself, do not pass, the default contains
     * @param includeExtend Contains superior inherited permissions. By default, it does not include
     */
    public listRole1WithHttpInfo(nodeId: string, xSpaceId: string, includeAdmin?: boolean, includeSelf?: boolean, includeExtend?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeCollaboratorsVo>> {
        const result = this.api.listRole1WithHttpInfo(nodeId, xSpaceId, includeAdmin, includeSelf, includeExtend, _options);
        return result.toPromise();
    }

    /**
     * Get node roles
     * @param nodeId node id
     * @param xSpaceId space id
     * @param includeAdmin Whether to include the master administrator, can not be passed, the default includes
     * @param includeSelf Whether to get userself, do not pass, the default contains
     * @param includeExtend Contains superior inherited permissions. By default, it does not include
     */
    public listRole1(nodeId: string, xSpaceId: string, includeAdmin?: boolean, includeSelf?: boolean, includeExtend?: boolean, _options?: Configuration): Promise<ResponseDataNodeCollaboratorsVo> {
        const result = this.api.listRole1(nodeId, xSpaceId, includeAdmin, includeSelf, includeExtend, _options);
        return result.toPromise();
    }


}



import { ObservableWorkbenchNodeRubbishApiApi } from './ObservableAPI';

import { WorkbenchNodeRubbishApiApiRequestFactory, WorkbenchNodeRubbishApiApiResponseProcessor} from "../apis/WorkbenchNodeRubbishApiApi";
export class PromiseWorkbenchNodeRubbishApiApi {
    private api: ObservableWorkbenchNodeRubbishApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WorkbenchNodeRubbishApiApiRequestFactory,
        responseProcessor?: WorkbenchNodeRubbishApiApiResponseProcessor
    ) {
        this.api = new ObservableWorkbenchNodeRubbishApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete node in rubbish
     * @param nodeId node id
     * @param xSpaceId space id
     */
    public delete6WithHttpInfo(nodeId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete6WithHttpInfo(nodeId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete node in rubbish
     * @param nodeId node id
     * @param xSpaceId space id
     */
    public delete6(nodeId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete6(nodeId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete node in rubbish
     * @param nodeId node id
     * @param xSpaceId space id
     */
    public delete7WithHttpInfo(nodeId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete7WithHttpInfo(nodeId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete node in rubbish
     * @param nodeId node id
     * @param xSpaceId space id
     */
    public delete7(nodeId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete7(nodeId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * If the last node id is passed in, the service status code 422 is returned.It means that the node is no longer in the recovery compartment, the positioning fails, and the last node can be requested again.
     * Get node in rubbish
     * @param xSpaceId space id
     * @param size expected load quantity（May be because the total number or permissions are not enough）
     * @param isOverLimit whether to request an overrun node（default FALSE）
     * @param lastNodeId id of the last node in the loaded list
     */
    public list5WithHttpInfo(xSpaceId: string, size?: number, isOverLimit?: boolean, lastNodeId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListRubbishNodeVo>> {
        const result = this.api.list5WithHttpInfo(xSpaceId, size, isOverLimit, lastNodeId, _options);
        return result.toPromise();
    }

    /**
     * If the last node id is passed in, the service status code 422 is returned.It means that the node is no longer in the recovery compartment, the positioning fails, and the last node can be requested again.
     * Get node in rubbish
     * @param xSpaceId space id
     * @param size expected load quantity（May be because the total number or permissions are not enough）
     * @param isOverLimit whether to request an overrun node（default FALSE）
     * @param lastNodeId id of the last node in the loaded list
     */
    public list5(xSpaceId: string, size?: number, isOverLimit?: boolean, lastNodeId?: string, _options?: Configuration): Promise<ResponseDataListRubbishNodeVo> {
        const result = this.api.list5(xSpaceId, size, isOverLimit, lastNodeId, _options);
        return result.toPromise();
    }

    /**
     * Recover node
     * @param nodeRecoverRo
     * @param xSpaceId space id
     */
    public recoverWithHttpInfo(nodeRecoverRo: NodeRecoverRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        const result = this.api.recoverWithHttpInfo(nodeRecoverRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Recover node
     * @param nodeRecoverRo
     * @param xSpaceId space id
     */
    public recover(nodeRecoverRo: NodeRecoverRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        const result = this.api.recover(nodeRecoverRo, xSpaceId, _options);
        return result.toPromise();
    }


}



import { ObservableWorkbenchNodeShareApiApi } from './ObservableAPI';

import { WorkbenchNodeShareApiApiRequestFactory, WorkbenchNodeShareApiApiResponseProcessor} from "../apis/WorkbenchNodeShareApiApi";
export class PromiseWorkbenchNodeShareApiApi {
    private api: ObservableWorkbenchNodeShareApiApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WorkbenchNodeShareApiApiRequestFactory,
        responseProcessor?: WorkbenchNodeShareApiApiResponseProcessor
    ) {
        this.api = new ObservableWorkbenchNodeShareApiApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Disable node sharing
     * @param nodeId node id
     */
    public disableShareWithHttpInfo(nodeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.disableShareWithHttpInfo(nodeId, _options);
        return result.toPromise();
    }

    /**
     * Disable node sharing
     * @param nodeId node id
     */
    public disableShare(nodeId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.disableShare(nodeId, _options);
        return result.toPromise();
    }

    /**
     * Get node share info
     * @param nodeId node id
     */
    public nodeShareInfoWithHttpInfo(nodeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeShareSettingInfoVO>> {
        const result = this.api.nodeShareInfoWithHttpInfo(nodeId, _options);
        return result.toPromise();
    }

    /**
     * Get node share info
     * @param nodeId node id
     */
    public nodeShareInfo(nodeId: string, _options?: Configuration): Promise<ResponseDataNodeShareSettingInfoVO> {
        const result = this.api.nodeShareInfo(nodeId, _options);
        return result.toPromise();
    }

    /**
     * get shared content according to share id
     * Get share node info
     * @param shareId share id
     */
    public readShareInfoWithHttpInfo(shareId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeShareInfoVO>> {
        const result = this.api.readShareInfoWithHttpInfo(shareId, _options);
        return result.toPromise();
    }

    /**
     * get shared content according to share id
     * Get share node info
     * @param shareId share id
     */
    public readShareInfo(shareId: string, _options?: Configuration): Promise<ResponseDataNodeShareInfoVO> {
        const result = this.api.readShareInfo(shareId, _options);
        return result.toPromise();
    }

    /**
     * Sotre share data
     * @param storeShareNodeRo
     * @param xSocketId user socket id
     */
    public storeShareDataWithHttpInfo(storeShareNodeRo: StoreShareNodeRo, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataStoreNodeInfoVO>> {
        const result = this.api.storeShareDataWithHttpInfo(storeShareNodeRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Sotre share data
     * @param storeShareNodeRo
     * @param xSocketId user socket id
     */
    public storeShareData(storeShareNodeRo: StoreShareNodeRo, xSocketId?: string, _options?: Configuration): Promise<ResponseDataStoreNodeInfoVO> {
        const result = this.api.storeShareData(storeShareNodeRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * Update node share setting  stringObjectParams share setting parameter description: <br/> There are three option parameters for sharing settings. Only one can be set true, and more than two cannot be set to true at the same time.<br/>onlyRead: Bool, whether to set sharing only for others to view.<br/>canBeEdited: Bool, whether to set up sharing to others for collaborative editing.<br/>canBeStored: Bool, whether to set up sharing to others and save as a copy.<br/>Example: Set <Share Only for Others to View>, parameters:{\"onlyRead\": true}
     * Update node share setting
     * @param updateNodeShareSettingRo
     * @param nodeId node id
     */
    public updateNodeShareWithHttpInfo(updateNodeShareSettingRo: UpdateNodeShareSettingRo, nodeId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataShareBaseInfoVo>> {
        const result = this.api.updateNodeShareWithHttpInfo(updateNodeShareSettingRo, nodeId, _options);
        return result.toPromise();
    }

    /**
     * Update node share setting  stringObjectParams share setting parameter description: <br/> There are three option parameters for sharing settings. Only one can be set true, and more than two cannot be set to true at the same time.<br/>onlyRead: Bool, whether to set sharing only for others to view.<br/>canBeEdited: Bool, whether to set up sharing to others for collaborative editing.<br/>canBeStored: Bool, whether to set up sharing to others and save as a copy.<br/>Example: Set <Share Only for Others to View>, parameters:{\"onlyRead\": true}
     * Update node share setting
     * @param updateNodeShareSettingRo
     * @param nodeId node id
     */
    public updateNodeShare(updateNodeShareSettingRo: UpdateNodeShareSettingRo, nodeId: string, _options?: Configuration): Promise<ResponseDataShareBaseInfoVo> {
        const result = this.api.updateNodeShare(updateNodeShareSettingRo, nodeId, _options);
        return result.toPromise();
    }


}



