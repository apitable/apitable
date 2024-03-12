import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'

import { ActionExecutionVO } from '../models/ActionExecutionVO';
import { ActionSimpleVO } from '../models/ActionSimpleVO';
import { ActionVO } from '../models/ActionVO';
import { ActiveSheetsOpRo } from '../models/ActiveSheetsOpRo';
import { ActivityStatusRo } from '../models/ActivityStatusRo';
import { AddRoleMemberRo } from '../models/AddRoleMemberRo';
import { AddSpaceRoleRo } from '../models/AddSpaceRoleRo';
import { AlbumContentVo } from '../models/AlbumContentVo';
import { AlbumGroupVo } from '../models/AlbumGroupVo';
import { AlbumVo } from '../models/AlbumVo';
import { AssetUploadCertificateRO } from '../models/AssetUploadCertificateRO';
import { AssetUploadCertificateVO } from '../models/AssetUploadCertificateVO';
import { AssetUploadNotifyRO } from '../models/AssetUploadNotifyRO';
import { AssetUploadResult } from '../models/AssetUploadResult';
import { AssetUrlSignatureRo } from '../models/AssetUrlSignatureRo';
import { AssetUrlSignatureVo } from '../models/AssetUrlSignatureVo';
import { AssetsAuditOpRo } from '../models/AssetsAuditOpRo';
import { AssetsAuditRo } from '../models/AssetsAuditRo';
import { AssetsAuditVo } from '../models/AssetsAuditVo';
import { AttachOpRo } from '../models/AttachOpRo';
import { AttachUrlOpRo } from '../models/AttachUrlOpRo';
import { AutomationPropertyRO } from '../models/AutomationPropertyRO';
import { AutomationPropertyVO } from '../models/AutomationPropertyVO';
import { AutomationSimpleVO } from '../models/AutomationSimpleVO';
import { AutomationTaskSimpleVO } from '../models/AutomationTaskSimpleVO';
import { AutomationVO } from '../models/AutomationVO';
import { Banner } from '../models/Banner';
import { CheckUserEmailRo } from '../models/CheckUserEmailRo';
import { ClientInfoVO } from '../models/ClientInfoVO';
import { CodeValidateRo } from '../models/CodeValidateRo';
import { CreateActionRO } from '../models/CreateActionRO';
import { CreateDatasheetRo } from '../models/CreateDatasheetRo';
import { CreateDatasheetVo } from '../models/CreateDatasheetVo';
import { CreateRoleRo } from '../models/CreateRoleRo';
import { CreateSpaceResultVo } from '../models/CreateSpaceResultVo';
import { CreateTeamRo } from '../models/CreateTeamRo';
import { CreateTemplateRo } from '../models/CreateTemplateRo';
import { CreateTriggerRO } from '../models/CreateTriggerRO';
import { CreatedMemberInfoVo } from '../models/CreatedMemberInfoVo';
import { CreditUsage } from '../models/CreditUsage';
import { DatasheetPermissionView } from '../models/DatasheetPermissionView';
import { DeleteBatchMemberRo } from '../models/DeleteBatchMemberRo';
import { DeleteMemberRo } from '../models/DeleteMemberRo';
import { DeleteRoleMemberRo } from '../models/DeleteRoleMemberRo';
import { DeveloperInfoVo } from '../models/DeveloperInfoVo';
import { EmailCodeValidateRo } from '../models/EmailCodeValidateRo';
import { EmailOpRo } from '../models/EmailOpRo';
import { FavoriteNodeInfo } from '../models/FavoriteNodeInfo';
import { FeatureVo } from '../models/FeatureVo';
import { FieldPermission } from '../models/FieldPermission';
import { FieldPermissionInfo } from '../models/FieldPermissionInfo';
import { FieldPermissionView } from '../models/FieldPermissionView';
import { FieldRoleSetting } from '../models/FieldRoleSetting';
import { ImportExcelOpRo } from '../models/ImportExcelOpRo';
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
import { InviteInfoVo } from '../models/InviteInfoVo';
import { InviteMemberAgainRo } from '../models/InviteMemberAgainRo';
import { InviteMemberRo } from '../models/InviteMemberRo';
import { InviteRo } from '../models/InviteRo';
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
import { MemberBriefInfoVo } from '../models/MemberBriefInfoVo';
import { MemberInfo } from '../models/MemberInfo';
import { MemberInfoVo } from '../models/MemberInfoVo';
import { MemberPageVo } from '../models/MemberPageVo';
import { MemberTeamPathInfo } from '../models/MemberTeamPathInfo';
import { MemberUnitsVo } from '../models/MemberUnitsVo';
import { Node } from '../models/Node';
import { NodeBundleOpRo } from '../models/NodeBundleOpRo';
import { NodeCollaboratorVO } from '../models/NodeCollaboratorVO';
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
import { NotificationStatisticsVo } from '../models/NotificationStatisticsVo';
import { NotifyBody } from '../models/NotifyBody';
import { OpAssetRo } from '../models/OpAssetRo';
import { OrderItem } from '../models/OrderItem';
import { OrgUnitRo } from '../models/OrgUnitRo';
import { OrganizationUnitVo } from '../models/OrganizationUnitVo';
import { Page } from '../models/Page';
import { PageInfoAssetsAuditVo } from '../models/PageInfoAssetsAuditVo';
import { PageInfoMemberPageVo } from '../models/PageInfoMemberPageVo';
import { PageInfoRoleMemberVo } from '../models/PageInfoRoleMemberVo';
import { PageInfoSpaceRoleVo } from '../models/PageInfoSpaceRoleVo';
import { PageVoid } from '../models/PageVoid';
import { ParseErrorRecordVO } from '../models/ParseErrorRecordVO';
import { PausedUserHistoryDto } from '../models/PausedUserHistoryDto';
import { PausedUserHistoryRo } from '../models/PausedUserHistoryRo';
import { PlayerBaseVo } from '../models/PlayerBaseVo';
import { QuoteTemplateRo } from '../models/QuoteTemplateRo';
import { RecommendVo } from '../models/RecommendVo';
import { RefreshApiKeyRo } from '../models/RefreshApiKeyRo';
import { RegisterRO } from '../models/RegisterRO';
import { RemindExtraRo } from '../models/RemindExtraRo';
import { RemindMemberRo } from '../models/RemindMemberRo';
import { RemindUnitRecRo } from '../models/RemindUnitRecRo';
import { RemindUnitsNoPermissionRo } from '../models/RemindUnitsNoPermissionRo';
import { ResponseData } from '../models/ResponseData';
import { ResponseDataAlbumContentVo } from '../models/ResponseDataAlbumContentVo';
import { ResponseDataAssetUploadResult } from '../models/ResponseDataAssetUploadResult';
import { ResponseDataAutomationVO } from '../models/ResponseDataAutomationVO';
import { ResponseDataBoolean } from '../models/ResponseDataBoolean';
import { ResponseDataCreateDatasheetVo } from '../models/ResponseDataCreateDatasheetVo';
import { ResponseDataCreateSpaceResultVo } from '../models/ResponseDataCreateSpaceResultVo';
import { ResponseDataCreditUsages } from '../models/ResponseDataCreditUsages';
import { ResponseDataDatasheetPermissionView } from '../models/ResponseDataDatasheetPermissionView';
import { ResponseDataDeveloperInfoVo } from '../models/ResponseDataDeveloperInfoVo';
import { ResponseDataFieldPermissionView } from '../models/ResponseDataFieldPermissionView';
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
import { ResponseDataListAlbumVo } from '../models/ResponseDataListAlbumVo';
import { ResponseDataListAssetUploadCertificateVO } from '../models/ResponseDataListAssetUploadCertificateVO';
import { ResponseDataListAssetUploadResult } from '../models/ResponseDataListAssetUploadResult';
import { ResponseDataListAssetUrlSignatureVo } from '../models/ResponseDataListAssetUrlSignatureVo';
import { ResponseDataListAutomationSimpleVO } from '../models/ResponseDataListAutomationSimpleVO';
import { ResponseDataListAutomationTaskSimpleVO } from '../models/ResponseDataListAutomationTaskSimpleVO';
import { ResponseDataListDatasheetPermissionView } from '../models/ResponseDataListDatasheetPermissionView';
import { ResponseDataListFavoriteNodeInfo } from '../models/ResponseDataListFavoriteNodeInfo';
import { ResponseDataListFieldPermissionView } from '../models/ResponseDataListFieldPermissionView';
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
import { ResponseDataListRoleInfoVo } from '../models/ResponseDataListRoleInfoVo';
import { ResponseDataListRubbishNodeVo } from '../models/ResponseDataListRubbishNodeVo';
import { ResponseDataListSearchMemberVo } from '../models/ResponseDataListSearchMemberVo';
import { ResponseDataListSpaceLinkVo } from '../models/ResponseDataListSpaceLinkVo';
import { ResponseDataListSpaceVO } from '../models/ResponseDataListSpaceVO';
import { ResponseDataListTeamTreeVo } from '../models/ResponseDataListTeamTreeVo';
import { ResponseDataListTemplateCategoryMenuVo } from '../models/ResponseDataListTemplateCategoryMenuVo';
import { ResponseDataListTemplateVo } from '../models/ResponseDataListTemplateVo';
import { ResponseDataListTriggerVO } from '../models/ResponseDataListTriggerVO';
import { ResponseDataListUnitInfoVo } from '../models/ResponseDataListUnitInfoVo';
import { ResponseDataListUserInPausedDto } from '../models/ResponseDataListUserInPausedDto';
import { ResponseDataListWidgetInfo } from '../models/ResponseDataListWidgetInfo';
import { ResponseDataListWidgetPack } from '../models/ResponseDataListWidgetPack';
import { ResponseDataListWidgetPackageInfoVo } from '../models/ResponseDataListWidgetPackageInfoVo';
import { ResponseDataListWidgetReleaseListVo } from '../models/ResponseDataListWidgetReleaseListVo';
import { ResponseDataListWidgetStoreListInfo } from '../models/ResponseDataListWidgetStoreListInfo';
import { ResponseDataListWidgetTemplatePackageInfo } from '../models/ResponseDataListWidgetTemplatePackageInfo';
import { ResponseDataListWidgetUploadTokenVo } from '../models/ResponseDataListWidgetUploadTokenVo';
import { ResponseDataLoginResultVO } from '../models/ResponseDataLoginResultVO';
import { ResponseDataLogoutVO } from '../models/ResponseDataLogoutVO';
import { ResponseDataMainAdminInfoVo } from '../models/ResponseDataMainAdminInfoVo';
import { ResponseDataMemberInfoVo } from '../models/ResponseDataMemberInfoVo';
import { ResponseDataMemberUnitsVo } from '../models/ResponseDataMemberUnitsVo';
import { ResponseDataNodeCollaboratorVO } from '../models/ResponseDataNodeCollaboratorVO';
import { ResponseDataNodeInfoTreeVo } from '../models/ResponseDataNodeInfoTreeVo';
import { ResponseDataNodeInfoVo } from '../models/ResponseDataNodeInfoVo';
import { ResponseDataNodeInfoWindowVo } from '../models/ResponseDataNodeInfoWindowVo';
import { ResponseDataNodeShareInfoVO } from '../models/ResponseDataNodeShareInfoVO';
import { ResponseDataNodeShareSettingInfoVO } from '../models/ResponseDataNodeShareSettingInfoVO';
import { ResponseDataNotificationStatisticsVo } from '../models/ResponseDataNotificationStatisticsVo';
import { ResponseDataPageInfoAssetsAuditVo } from '../models/ResponseDataPageInfoAssetsAuditVo';
import { ResponseDataPageInfoMemberPageVo } from '../models/ResponseDataPageInfoMemberPageVo';
import { ResponseDataPageInfoRoleMemberVo } from '../models/ResponseDataPageInfoRoleMemberVo';
import { ResponseDataPageInfoSpaceRoleVo } from '../models/ResponseDataPageInfoSpaceRoleVo';
import { ResponseDataRecommendVo } from '../models/ResponseDataRecommendVo';
import { ResponseDataSearchResultVo } from '../models/ResponseDataSearchResultVo';
import { ResponseDataShareBaseInfoVo } from '../models/ResponseDataShareBaseInfoVo';
import { ResponseDataShowcaseVo } from '../models/ResponseDataShowcaseVo';
import { ResponseDataSpaceCapacityVO } from '../models/ResponseDataSpaceCapacityVO';
import { ResponseDataSpaceGlobalFeature } from '../models/ResponseDataSpaceGlobalFeature';
import { ResponseDataSpaceInfoVO } from '../models/ResponseDataSpaceInfoVO';
import { ResponseDataSpaceLinkInfoVo } from '../models/ResponseDataSpaceLinkInfoVo';
import { ResponseDataSpaceRoleDetailVo } from '../models/ResponseDataSpaceRoleDetailVo';
import { ResponseDataSpaceSubscribeVo } from '../models/ResponseDataSpaceSubscribeVo';
import { ResponseDataStoreNodeInfoVO } from '../models/ResponseDataStoreNodeInfoVO';
import { ResponseDataString } from '../models/ResponseDataString';
import { ResponseDataSubUnitResultVo } from '../models/ResponseDataSubUnitResultVo';
import { ResponseDataTeamInfoVo } from '../models/ResponseDataTeamInfoVo';
import { ResponseDataTemplateCategoryContentVo } from '../models/ResponseDataTemplateCategoryContentVo';
import { ResponseDataTemplateDirectoryVo } from '../models/ResponseDataTemplateDirectoryVo';
import { ResponseDataTemplateSearchResultVo } from '../models/ResponseDataTemplateSearchResultVo';
import { ResponseDataUnitSearchResultVo } from '../models/ResponseDataUnitSearchResultVo';
import { ResponseDataUploadParseResultVO } from '../models/ResponseDataUploadParseResultVO';
import { ResponseDataUrlAwareContentsVo } from '../models/ResponseDataUrlAwareContentsVo';
import { ResponseDataUserBaseInfoVo } from '../models/ResponseDataUserBaseInfoVo';
import { ResponseDataUserInfoVo } from '../models/ResponseDataUserInfoVo';
import { ResponseDataUserSpaceLabsFeatureVo } from '../models/ResponseDataUserSpaceLabsFeatureVo';
import { ResponseDataUserSpaceVo } from '../models/ResponseDataUserSpaceVo';
import { ResponseDataVoid } from '../models/ResponseDataVoid';
import { ResponseDataWidgetPack } from '../models/ResponseDataWidgetPack';
import { ResponseDataWidgetPackageInfoVo } from '../models/ResponseDataWidgetPackageInfoVo';
import { ResponseDataWidgetReleaseCreateVo } from '../models/ResponseDataWidgetReleaseCreateVo';
import { ResponseDataWidgetUploadMetaVo } from '../models/ResponseDataWidgetUploadMetaVo';
import { RetrievePwdOpRo } from '../models/RetrievePwdOpRo';
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
import { ShareBaseInfoVo } from '../models/ShareBaseInfoVo';
import { ShowcaseVo } from '../models/ShowcaseVo';
import { SmsCodeValidateRo } from '../models/SmsCodeValidateRo';
import { SmsOpRo } from '../models/SmsOpRo';
import { Social } from '../models/Social';
import { Space } from '../models/Space';
import { SpaceAssetOpRo } from '../models/SpaceAssetOpRo';
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
import { SpaceOpRo } from '../models/SpaceOpRo';
import { SpaceRoleDetailVo } from '../models/SpaceRoleDetailVo';
import { SpaceRoleVo } from '../models/SpaceRoleVo';
import { SpaceSecuritySettingRo } from '../models/SpaceSecuritySettingRo';
import { SpaceSocialConfig } from '../models/SpaceSocialConfig';
import { SpaceStatisticsRo } from '../models/SpaceStatisticsRo';
import { SpaceSubscribeVo } from '../models/SpaceSubscribeVo';
import { SpaceUpdateOpRo } from '../models/SpaceUpdateOpRo';
import { SpaceVO } from '../models/SpaceVO';
import { StoreNodeInfoVO } from '../models/StoreNodeInfoVO';
import { StoreShareNodeRo } from '../models/StoreShareNodeRo';
import { SubUnitResultVo } from '../models/SubUnitResultVo';
import { TagVo } from '../models/TagVo';
import { TeamAddMemberRo } from '../models/TeamAddMemberRo';
import { TeamInfoVo } from '../models/TeamInfoVo';
import { TeamTreeVo } from '../models/TeamTreeVo';
import { TeamVo } from '../models/TeamVo';
import { TemplateCategoryContentVo } from '../models/TemplateCategoryContentVo';
import { TemplateCategoryMenuVo } from '../models/TemplateCategoryMenuVo';
import { TemplateDirectoryVo } from '../models/TemplateDirectoryVo';
import { TemplateGroupVo } from '../models/TemplateGroupVo';
import { TemplateSearchResult } from '../models/TemplateSearchResult';
import { TemplateSearchResultVo } from '../models/TemplateSearchResultVo';
import { TemplateVo } from '../models/TemplateVo';
import { TriggerSimpleVO } from '../models/TriggerSimpleVO';
import { TriggerVO } from '../models/TriggerVO';
import { UnitInfoVo } from '../models/UnitInfoVo';
import { UnitMemberVo } from '../models/UnitMemberVo';
import { UnitSearchResultVo } from '../models/UnitSearchResultVo';
import { UnitTagVo } from '../models/UnitTagVo';
import { UnitTeamVo } from '../models/UnitTeamVo';
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
import { UploadMemberTemplateRo } from '../models/UploadMemberTemplateRo';
import { UploadParseResultVO } from '../models/UploadParseResultVO';
import { UrlAwareContentVo } from '../models/UrlAwareContentVo';
import { UrlAwareContentsVo } from '../models/UrlAwareContentsVo';
import { UrlsWrapperRo } from '../models/UrlsWrapperRo';
import { UserBaseInfoVo } from '../models/UserBaseInfoVo';
import { UserInPausedDto } from '../models/UserInPausedDto';
import { UserInfoVo } from '../models/UserInfoVo';
import { UserLabsFeatureRo } from '../models/UserLabsFeatureRo';
import { UserLinkEmailRo } from '../models/UserLinkEmailRo';
import { UserLinkVo } from '../models/UserLinkVo';
import { UserOpRo } from '../models/UserOpRo';
import { UserSimpleVO } from '../models/UserSimpleVO';
import { UserSpaceLabsFeatureVo } from '../models/UserSpaceLabsFeatureVo';
import { UserSpaceVo } from '../models/UserSpaceVo';
import { WidgetAssetUploadCertificateRO } from '../models/WidgetAssetUploadCertificateRO';
import { WidgetCopyRo } from '../models/WidgetCopyRo';
import { WidgetCreateRo } from '../models/WidgetCreateRo';
import { WidgetInfo } from '../models/WidgetInfo';
import { WidgetPack } from '../models/WidgetPack';
import { WidgetPackageAuthRo } from '../models/WidgetPackageAuthRo';
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

export interface AccountCenterModuleUserManagementInterfaceApiUpdateRequest {
    /**
     * 
     * @type UserOpRo
     * @memberof AccountCenterModuleUserManagementInterfaceApiupdate
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
    public updateWithHttpInfo(param: AccountCenterModuleUserManagementInterfaceApiUpdateRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.updateWithHttpInfo(param.userOpRo,  options).toPromise();
    }

    /**
     * Request parameters cannot be all empty
     * Edit user information
     * @param param the request object
     */
    public update(param: AccountCenterModuleUserManagementInterfaceApiUpdateRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.update(param.userOpRo,  options).toPromise();
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
     * SMS type; 1: Registration, 2:Login, 3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, 6: (Remove replacement) mobile phone binding 7: Modify mailbox binding,8: Delete space, 9: Replace main administrator 10: General verification, 11: Change developer configuration, 12: Bind third-party platform account
     * Send SMS verification code
     * @param param the request object
     */
    public sendWithHttpInfo(param: BasicModuleVerifyActionModuleInterfaceApiSendRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.sendWithHttpInfo(param.smsOpRo,  options).toPromise();
    }

    /**
     * SMS type; 1: Registration, 2:Login, 3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, 6: (Remove replacement) mobile phone binding 7: Modify mailbox binding,8: Delete space, 9: Replace main administrator 10: General verification, 11: Change developer configuration, 12: Bind third-party platform account
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

export interface ContactMemberApiApiUpdate2Request {
    /**
     * 
     * @type UpdateMemberOpRo
     * @memberof ContactMemberApiApiupdate2
     */
    updateMemberOpRo: UpdateMemberOpRo
    /**
     * space id
     * @type string
     * @memberof ContactMemberApiApiupdate2
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
    public update2WithHttpInfo(param: ContactMemberApiApiUpdate2Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.update2WithHttpInfo(param.updateMemberOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Edit self member information
     * Edit self member information
     * @param param the request object
     */
    public update2(param: ContactMemberApiApiUpdate2Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.update2(param.updateMemberOpRo, param.xSpaceId,  options).toPromise();
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
     * @type string
     * @memberof InternalServiceDataTableFieldPermissionInterfaceApidisableRoles
     */
    dstId: string
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

export interface InternalServiceNotificationInterfaceApiCreate4Request {
    /**
     * 
     * @type Array&lt;NotificationCreateRo&gt;
     * @memberof InternalServiceNotificationInterfaceApicreate4
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
    public create4WithHttpInfo(param: InternalServiceNotificationInterfaceApiCreate4Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.create4WithHttpInfo(param.notificationCreateRo,  options).toPromise();
    }

    /**
     * send a message
     * send a message
     * @param param the request object
     */
    public create4(param: InternalServiceNotificationInterfaceApiCreate4Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.create4(param.notificationCreateRo,  options).toPromise();
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

export interface PlayerSystemNotificationAPIApiCreate2Request {
    /**
     * 
     * @type Array&lt;NotificationCreateRo&gt;
     * @memberof PlayerSystemNotificationAPIApicreate2
     */
    notificationCreateRo: Array<NotificationCreateRo>
}

export interface PlayerSystemNotificationAPIApiDelete4Request {
    /**
     * 
     * @type NotificationReadRo
     * @memberof PlayerSystemNotificationAPIApidelete4
     */
    notificationReadRo: NotificationReadRo
}

export interface PlayerSystemNotificationAPIApiList2Request {
    /**
     * 
     * @type NotificationListRo
     * @memberof PlayerSystemNotificationAPIApilist2
     */
    notificationListRo: NotificationListRo
}

export interface PlayerSystemNotificationAPIApiPageRequest {
    /**
     * 
     * @type NotificationPageRo
     * @memberof PlayerSystemNotificationAPIApipage
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
    public create2WithHttpInfo(param: PlayerSystemNotificationAPIApiCreate2Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.create2WithHttpInfo(param.notificationCreateRo,  options).toPromise();
    }

    /**
     * Create Notification
     * @param param the request object
     */
    public create2(param: PlayerSystemNotificationAPIApiCreate2Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.create2(param.notificationCreateRo,  options).toPromise();
    }

    /**
     * Delete Notification
     * @param param the request object
     */
    public delete4WithHttpInfo(param: PlayerSystemNotificationAPIApiDelete4Request, options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        return this.api.delete4WithHttpInfo(param.notificationReadRo,  options).toPromise();
    }

    /**
     * Delete Notification
     * @param param the request object
     */
    public delete4(param: PlayerSystemNotificationAPIApiDelete4Request, options?: Configuration): Promise<ResponseDataBoolean> {
        return this.api.delete4(param.notificationReadRo,  options).toPromise();
    }

    /**
     * Default: System Notification
     * Get Notification Detail List
     * @param param the request object
     */
    public list2WithHttpInfo(param: PlayerSystemNotificationAPIApiList2Request, options?: Configuration): Promise<HttpInfo<ResponseDataListNotificationDetailVo>> {
        return this.api.list2WithHttpInfo(param.notificationListRo,  options).toPromise();
    }

    /**
     * Default: System Notification
     * Get Notification Detail List
     * @param param the request object
     */
    public list2(param: PlayerSystemNotificationAPIApiList2Request, options?: Configuration): Promise<ResponseDataListNotificationDetailVo> {
        return this.api.list2(param.notificationListRo,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Get Notification Page Info
     * @param param the request object
     */
    public pageWithHttpInfo(param: PlayerSystemNotificationAPIApiPageRequest, options?: Configuration): Promise<HttpInfo<ResponseDataListNotificationDetailVo>> {
        return this.api.pageWithHttpInfo(param.notificationPageRo,  options).toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Get Notification Page Info
     * @param param the request object
     */
    public page(param: PlayerSystemNotificationAPIApiPageRequest, options?: Configuration): Promise<ResponseDataListNotificationDetailVo> {
        return this.api.page(param.notificationPageRo,  options).toPromise();
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

import { ObservableSpaceInviteLinkApiApi } from "./ObservableAPI";
import { SpaceInviteLinkApiApiRequestFactory, SpaceInviteLinkApiApiResponseProcessor} from "../apis/SpaceInviteLinkApiApi";

export interface SpaceInviteLinkApiApiDelete6Request {
    /**
     * 
     * @type SpaceLinkOpRo
     * @memberof SpaceInviteLinkApiApidelete6
     */
    spaceLinkOpRo: SpaceLinkOpRo
    /**
     * space id
     * @type string
     * @memberof SpaceInviteLinkApiApidelete6
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

export interface SpaceInviteLinkApiApiList1Request {
    /**
     * space id
     * @type string
     * @memberof SpaceInviteLinkApiApilist1
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
    public delete6WithHttpInfo(param: SpaceInviteLinkApiApiDelete6Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete6WithHttpInfo(param.spaceLinkOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete link
     * @param param the request object
     */
    public delete6(param: SpaceInviteLinkApiApiDelete6Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete6(param.spaceLinkOpRo, param.xSpaceId,  options).toPromise();
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
    public list1WithHttpInfo(param: SpaceInviteLinkApiApiList1Request, options?: Configuration): Promise<HttpInfo<ResponseDataListSpaceLinkVo>> {
        return this.api.list1WithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Get a list of links
     * @param param the request object
     */
    public list1(param: SpaceInviteLinkApiApiList1Request, options?: Configuration): Promise<ResponseDataListSpaceLinkVo> {
        return this.api.list1(param.xSpaceId,  options).toPromise();
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

export interface SpaceSpaceApiApiCreate1Request {
    /**
     * 
     * @type SpaceOpRo
     * @memberof SpaceSpaceApiApicreate1
     */
    spaceOpRo: SpaceOpRo
}

export interface SpaceSpaceApiApiDelRequest {
}

export interface SpaceSpaceApiApiDelete7Request {
    /**
     * 
     * @type SpaceDeleteRo
     * @memberof SpaceSpaceApiApidelete7
     */
    spaceDeleteRo: SpaceDeleteRo
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApidelete7
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

export interface SpaceSpaceApiApiInfoRequest {
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApiinfo
     */
    spaceId: string
}

export interface SpaceSpaceApiApiListRequest {
    /**
     * Whether to query only the managed space list. By default, not include
     * @type boolean
     * @memberof SpaceSpaceApiApilist
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

export interface SpaceSpaceApiApiUpdate1Request {
    /**
     * 
     * @type SpaceUpdateOpRo
     * @memberof SpaceSpaceApiApiupdate1
     */
    spaceUpdateOpRo: SpaceUpdateOpRo
    /**
     * space id
     * @type string
     * @memberof SpaceSpaceApiApiupdate1
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
    public create1WithHttpInfo(param: SpaceSpaceApiApiCreate1Request, options?: Configuration): Promise<HttpInfo<ResponseDataCreateSpaceResultVo>> {
        return this.api.create1WithHttpInfo(param.spaceOpRo,  options).toPromise();
    }

    /**
     * Create Space
     * @param param the request object
     */
    public create1(param: SpaceSpaceApiApiCreate1Request, options?: Configuration): Promise<ResponseDataCreateSpaceResultVo> {
        return this.api.create1(param.spaceOpRo,  options).toPromise();
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
    public delete7WithHttpInfo(param: SpaceSpaceApiApiDelete7Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete7WithHttpInfo(param.spaceDeleteRo, param.spaceId,  options).toPromise();
    }

    /**
     * Delete space
     * @param param the request object
     */
    public delete7(param: SpaceSpaceApiApiDelete7Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete7(param.spaceDeleteRo, param.spaceId,  options).toPromise();
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
    public infoWithHttpInfo(param: SpaceSpaceApiApiInfoRequest, options?: Configuration): Promise<HttpInfo<ResponseDataSpaceInfoVO>> {
        return this.api.infoWithHttpInfo(param.spaceId,  options).toPromise();
    }

    /**
     * Get space info
     * @param param the request object
     */
    public info(param: SpaceSpaceApiApiInfoRequest, options?: Configuration): Promise<ResponseDataSpaceInfoVO> {
        return this.api.info(param.spaceId,  options).toPromise();
    }

    /**
     * Get space list
     * @param param the request object
     */
    public listWithHttpInfo(param: SpaceSpaceApiApiListRequest = {}, options?: Configuration): Promise<HttpInfo<ResponseDataListSpaceVO>> {
        return this.api.listWithHttpInfo(param.onlyManageable,  options).toPromise();
    }

    /**
     * Get space list
     * @param param the request object
     */
    public list(param: SpaceSpaceApiApiListRequest = {}, options?: Configuration): Promise<ResponseDataListSpaceVO> {
        return this.api.list(param.onlyManageable,  options).toPromise();
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
    public update1WithHttpInfo(param: SpaceSpaceApiApiUpdate1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.update1WithHttpInfo(param.spaceUpdateOpRo, param.xSpaceId,  options).toPromise();
    }

    /**
     * at least one item is name and logo
     * Update space
     * @param param the request object
     */
    public update1(param: SpaceSpaceApiApiUpdate1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.update1(param.spaceUpdateOpRo, param.xSpaceId,  options).toPromise();
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

import { ObservableTemplateCenterTemplateAPIApi } from "./ObservableAPI";
import { TemplateCenterTemplateAPIApiRequestFactory, TemplateCenterTemplateAPIApiResponseProcessor} from "../apis/TemplateCenterTemplateAPIApi";

export interface TemplateCenterTemplateAPIApiCreateRequest {
    /**
     * 
     * @type CreateTemplateRo
     * @memberof TemplateCenterTemplateAPIApicreate
     */
    createTemplateRo: CreateTemplateRo
}

export interface TemplateCenterTemplateAPIApiDelete5Request {
    /**
     * Template ID
     * @type string
     * @memberof TemplateCenterTemplateAPIApidelete5
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
    public createWithHttpInfo(param: TemplateCenterTemplateAPIApiCreateRequest, options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        return this.api.createWithHttpInfo(param.createTemplateRo,  options).toPromise();
    }

    /**
     * Created nodes (including child descendant nodes) have administrative rights and are not associated with data tables other than nodes.
     * Create Template
     * @param param the request object
     */
    public create(param: TemplateCenterTemplateAPIApiCreateRequest, options?: Configuration): Promise<ResponseDataString> {
        return this.api.create(param.createTemplateRo,  options).toPromise();
    }

    /**
     * Deletion objects: main administrator, sub-admins with template permissions, creator of the template
     * Delete Template
     * @param param the request object
     */
    public delete5WithHttpInfo(param: TemplateCenterTemplateAPIApiDelete5Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete5WithHttpInfo(param.templateId,  options).toPromise();
    }

    /**
     * Deletion objects: main administrator, sub-admins with template permissions, creator of the template
     * Delete Template
     * @param param the request object
     */
    public delete5(param: TemplateCenterTemplateAPIApiDelete5Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete5(param.templateId,  options).toPromise();
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

export interface WorkbenchNodeApiApiCreate3Request {
    /**
     * 
     * @type NodeOpRo
     * @memberof WorkbenchNodeApiApicreate3
     */
    nodeOpRo: NodeOpRo
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeApiApicreate3
     */
    xSocketId?: string
}

export interface WorkbenchNodeApiApiDelete2Request {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApidelete2
     */
    nodeId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeApiApidelete2
     */
    xSocketId?: string
}

export interface WorkbenchNodeApiApiDelete3Request {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApidelete3
     */
    nodeId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeApiApidelete3
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

export interface WorkbenchNodeApiApiList4Request {
    /**
     * node type
     * @type number
     * @memberof WorkbenchNodeApiApilist4
     */
    type: number
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeApiApilist4
     */
    xSpaceId: string
    /**
     * role（manageable by default）
     * @type string
     * @memberof WorkbenchNodeApiApilist4
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

export interface WorkbenchNodeApiApiUpdate3Request {
    /**
     * 
     * @type NodeUpdateOpRo
     * @memberof WorkbenchNodeApiApiupdate3
     */
    nodeUpdateOpRo: NodeUpdateOpRo
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeApiApiupdate3
     */
    nodeId: string
    /**
     * user socket id
     * @type string
     * @memberof WorkbenchNodeApiApiupdate3
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
    public create3WithHttpInfo(param: WorkbenchNodeApiApiCreate3Request, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        return this.api.create3WithHttpInfo(param.nodeOpRo, param.xSocketId,  options).toPromise();
    }

    /**
     * create a new node under the node<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Create child node
     * @param param the request object
     */
    public create3(param: WorkbenchNodeApiApiCreate3Request, options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        return this.api.create3(param.nodeOpRo, param.xSocketId,  options).toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param param the request object
     */
    public delete2WithHttpInfo(param: WorkbenchNodeApiApiDelete2Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete2WithHttpInfo(param.nodeId, param.xSocketId,  options).toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param param the request object
     */
    public delete2(param: WorkbenchNodeApiApiDelete2Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete2(param.nodeId, param.xSocketId,  options).toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param param the request object
     */
    public delete3WithHttpInfo(param: WorkbenchNodeApiApiDelete3Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete3WithHttpInfo(param.nodeId, param.xSocketId,  options).toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param param the request object
     */
    public delete3(param: WorkbenchNodeApiApiDelete3Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete3(param.nodeId, param.xSocketId,  options).toPromise();
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
    public list4WithHttpInfo(param: WorkbenchNodeApiApiList4Request, options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfo>> {
        return this.api.list4WithHttpInfo(param.type, param.xSpaceId, param.role,  options).toPromise();
    }

    /**
     * scenario: query an existing dashboard
     * Get nodes of the specified type
     * @param param the request object
     */
    public list4(param: WorkbenchNodeApiApiList4Request, options?: Configuration): Promise<ResponseDataListNodeInfo> {
        return this.api.list4(param.type, param.xSpaceId, param.role,  options).toPromise();
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
    public update3WithHttpInfo(param: WorkbenchNodeApiApiUpdate3Request, options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        return this.api.update3WithHttpInfo(param.nodeUpdateOpRo, param.nodeId, param.xSocketId,  options).toPromise();
    }

    /**
     * node id must. name, icon is not required<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Edit node
     * @param param the request object
     */
    public update3(param: WorkbenchNodeApiApiUpdate3Request, options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        return this.api.update3(param.nodeUpdateOpRo, param.nodeId, param.xSocketId,  options).toPromise();
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

export interface WorkbenchNodeFavoriteApiApiList5Request {
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeFavoriteApiApilist5
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
    public list5WithHttpInfo(param: WorkbenchNodeFavoriteApiApiList5Request, options?: Configuration): Promise<HttpInfo<ResponseDataListFavoriteNodeInfo>> {
        return this.api.list5WithHttpInfo(param.xSpaceId,  options).toPromise();
    }

    /**
     * Get favorite nodes
     * @param param the request object
     */
    public list5(param: WorkbenchNodeFavoriteApiApiList5Request, options?: Configuration): Promise<ResponseDataListFavoriteNodeInfo> {
        return this.api.list5(param.xSpaceId,  options).toPromise();
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

export class ObjectWorkbenchNodeRoleApiApi {
    private api: ObservableWorkbenchNodeRoleApiApi

    public constructor(configuration: Configuration, requestFactory?: WorkbenchNodeRoleApiApiRequestFactory, responseProcessor?: WorkbenchNodeRoleApiApiResponseProcessor) {
        this.api = new ObservableWorkbenchNodeRoleApiApi(configuration, requestFactory, responseProcessor);
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

}

import { ObservableWorkbenchNodeRubbishApiApi } from "./ObservableAPI";
import { WorkbenchNodeRubbishApiApiRequestFactory, WorkbenchNodeRubbishApiApiResponseProcessor} from "../apis/WorkbenchNodeRubbishApiApi";

export interface WorkbenchNodeRubbishApiApiDeleteRequest {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeRubbishApiApi_delete
     */
    nodeId: string
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRubbishApiApi_delete
     */
    xSpaceId: string
}

export interface WorkbenchNodeRubbishApiApiDelete1Request {
    /**
     * node id
     * @type string
     * @memberof WorkbenchNodeRubbishApiApidelete1
     */
    nodeId: string
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRubbishApiApidelete1
     */
    xSpaceId: string
}

export interface WorkbenchNodeRubbishApiApiList3Request {
    /**
     * space id
     * @type string
     * @memberof WorkbenchNodeRubbishApiApilist3
     */
    xSpaceId: string
    /**
     * expected load quantity（May be because the total number or permissions are not enough）
     * @type number
     * @memberof WorkbenchNodeRubbishApiApilist3
     */
    size?: number
    /**
     * whether to request an overrun node（default FALSE）
     * @type boolean
     * @memberof WorkbenchNodeRubbishApiApilist3
     */
    isOverLimit?: boolean
    /**
     * id of the last node in the loaded list
     * @type string
     * @memberof WorkbenchNodeRubbishApiApilist3
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
    public _deleteWithHttpInfo(param: WorkbenchNodeRubbishApiApiDeleteRequest, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api._deleteWithHttpInfo(param.nodeId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete node in rubbish
     * @param param the request object
     */
    public _delete(param: WorkbenchNodeRubbishApiApiDeleteRequest, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api._delete(param.nodeId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete node in rubbish
     * @param param the request object
     */
    public delete1WithHttpInfo(param: WorkbenchNodeRubbishApiApiDelete1Request, options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        return this.api.delete1WithHttpInfo(param.nodeId, param.xSpaceId,  options).toPromise();
    }

    /**
     * Delete node in rubbish
     * @param param the request object
     */
    public delete1(param: WorkbenchNodeRubbishApiApiDelete1Request, options?: Configuration): Promise<ResponseDataVoid> {
        return this.api.delete1(param.nodeId, param.xSpaceId,  options).toPromise();
    }

    /**
     * If the last node id is passed in, the service status code 422 is returned.It means that the node is no longer in the recovery compartment, the positioning fails, and the last node can be requested again.
     * Get node in rubbish
     * @param param the request object
     */
    public list3WithHttpInfo(param: WorkbenchNodeRubbishApiApiList3Request, options?: Configuration): Promise<HttpInfo<ResponseDataListRubbishNodeVo>> {
        return this.api.list3WithHttpInfo(param.xSpaceId, param.size, param.isOverLimit, param.lastNodeId,  options).toPromise();
    }

    /**
     * If the last node id is passed in, the service status code 422 is returned.It means that the node is no longer in the recovery compartment, the positioning fails, and the last node can be requested again.
     * Get node in rubbish
     * @param param the request object
     */
    public list3(param: WorkbenchNodeRubbishApiApiList3Request, options?: Configuration): Promise<ResponseDataListRubbishNodeVo> {
        return this.api.list3(param.xSpaceId, param.size, param.isOverLimit, param.lastNodeId,  options).toPromise();
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
