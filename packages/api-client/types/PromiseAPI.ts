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
    public updateWithHttpInfo(userOpRo: UserOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.updateWithHttpInfo(userOpRo, _options);
        return result.toPromise();
    }

    /**
     * Request parameters cannot be all empty
     * Edit user information
     * @param userOpRo 
     */
    public update(userOpRo: UserOpRo, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.update(userOpRo, _options);
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
     * SMS type; 1: Registration, 2:Login, 3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, 6: (Remove replacement) mobile phone binding 7: Modify mailbox binding,8: Delete space, 9: Replace main administrator 10: General verification, 11: Change developer configuration, 12: Bind third-party platform account
     * Send SMS verification code
     * @param smsOpRo 
     */
    public sendWithHttpInfo(smsOpRo: SmsOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.sendWithHttpInfo(smsOpRo, _options);
        return result.toPromise();
    }

    /**
     * SMS type; 1: Registration, 2:Login, 3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, 6: (Remove replacement) mobile phone binding 7: Modify mailbox binding,8: Delete space, 9: Replace main administrator 10: General verification, 11: Change developer configuration, 12: Bind third-party platform account
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
    public update2WithHttpInfo(updateMemberOpRo: UpdateMemberOpRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.update2WithHttpInfo(updateMemberOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Edit self member information
     * Edit self member information
     * @param updateMemberOpRo 
     * @param xSpaceId space id
     */
    public update2(updateMemberOpRo: UpdateMemberOpRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.update2(updateMemberOpRo, xSpaceId, _options);
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
    public disableRolesWithHttpInfo(dstId: string, fieldIds: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.disableRolesWithHttpInfo(dstId, fieldIds, _options);
        return result.toPromise();
    }

    /**
     * room layer ot delete field operation call
     * turn off multiple field permissions
     * @param dstId table id
     * @param fieldIds list of field ids
     */
    public disableRoles(dstId: string, fieldIds: string, _options?: Configuration): Promise<ResponseDataVoid> {
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
    public create4WithHttpInfo(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.create4WithHttpInfo(notificationCreateRo, _options);
        return result.toPromise();
    }

    /**
     * send a message
     * send a message
     * @param notificationCreateRo 
     */
    public create4(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.create4(notificationCreateRo, _options);
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
    public create2WithHttpInfo(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.create2WithHttpInfo(notificationCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Create Notification
     * @param notificationCreateRo 
     */
    public create2(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.create2(notificationCreateRo, _options);
        return result.toPromise();
    }

    /**
     * Delete Notification
     * @param notificationReadRo 
     */
    public delete4WithHttpInfo(notificationReadRo: NotificationReadRo, _options?: Configuration): Promise<HttpInfo<ResponseDataBoolean>> {
        const result = this.api.delete4WithHttpInfo(notificationReadRo, _options);
        return result.toPromise();
    }

    /**
     * Delete Notification
     * @param notificationReadRo 
     */
    public delete4(notificationReadRo: NotificationReadRo, _options?: Configuration): Promise<ResponseDataBoolean> {
        const result = this.api.delete4(notificationReadRo, _options);
        return result.toPromise();
    }

    /**
     * Default: System Notification
     * Get Notification Detail List
     * @param notificationListRo 
     */
    public list2WithHttpInfo(notificationListRo: NotificationListRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListNotificationDetailVo>> {
        const result = this.api.list2WithHttpInfo(notificationListRo, _options);
        return result.toPromise();
    }

    /**
     * Default: System Notification
     * Get Notification Detail List
     * @param notificationListRo 
     */
    public list2(notificationListRo: NotificationListRo, _options?: Configuration): Promise<ResponseDataListNotificationDetailVo> {
        const result = this.api.list2(notificationListRo, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Get Notification Page Info
     * @param notificationPageRo 
     */
    public pageWithHttpInfo(notificationPageRo: NotificationPageRo, _options?: Configuration): Promise<HttpInfo<ResponseDataListNotificationDetailVo>> {
        const result = this.api.pageWithHttpInfo(notificationPageRo, _options);
        return result.toPromise();
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Get Notification Page Info
     * @param notificationPageRo 
     */
    public page(notificationPageRo: NotificationPageRo, _options?: Configuration): Promise<ResponseDataListNotificationDetailVo> {
        const result = this.api.page(notificationPageRo, _options);
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
    public delete6WithHttpInfo(spaceLinkOpRo: SpaceLinkOpRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete6WithHttpInfo(spaceLinkOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete link
     * @param spaceLinkOpRo 
     * @param xSpaceId space id
     */
    public delete6(spaceLinkOpRo: SpaceLinkOpRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete6(spaceLinkOpRo, xSpaceId, _options);
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
    public list1WithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListSpaceLinkVo>> {
        const result = this.api.list1WithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get a list of links
     * @param xSpaceId space id
     */
    public list1(xSpaceId: string, _options?: Configuration): Promise<ResponseDataListSpaceLinkVo> {
        const result = this.api.list1(xSpaceId, _options);
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
    public create1WithHttpInfo(spaceOpRo: SpaceOpRo, _options?: Configuration): Promise<HttpInfo<ResponseDataCreateSpaceResultVo>> {
        const result = this.api.create1WithHttpInfo(spaceOpRo, _options);
        return result.toPromise();
    }

    /**
     * Create Space
     * @param spaceOpRo 
     */
    public create1(spaceOpRo: SpaceOpRo, _options?: Configuration): Promise<ResponseDataCreateSpaceResultVo> {
        const result = this.api.create1(spaceOpRo, _options);
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
    public delete7WithHttpInfo(spaceDeleteRo: SpaceDeleteRo, spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete7WithHttpInfo(spaceDeleteRo, spaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete space
     * @param spaceDeleteRo 
     * @param spaceId space id
     */
    public delete7(spaceDeleteRo: SpaceDeleteRo, spaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete7(spaceDeleteRo, spaceId, _options);
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
    public infoWithHttpInfo(spaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataSpaceInfoVO>> {
        const result = this.api.infoWithHttpInfo(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Get space info
     * @param spaceId space id
     */
    public info(spaceId: string, _options?: Configuration): Promise<ResponseDataSpaceInfoVO> {
        const result = this.api.info(spaceId, _options);
        return result.toPromise();
    }

    /**
     * Get space list
     * @param onlyManageable Whether to query only the managed space list. By default, not include
     */
    public listWithHttpInfo(onlyManageable?: boolean, _options?: Configuration): Promise<HttpInfo<ResponseDataListSpaceVO>> {
        const result = this.api.listWithHttpInfo(onlyManageable, _options);
        return result.toPromise();
    }

    /**
     * Get space list
     * @param onlyManageable Whether to query only the managed space list. By default, not include
     */
    public list(onlyManageable?: boolean, _options?: Configuration): Promise<ResponseDataListSpaceVO> {
        const result = this.api.list(onlyManageable, _options);
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
    public update1WithHttpInfo(spaceUpdateOpRo: SpaceUpdateOpRo, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.update1WithHttpInfo(spaceUpdateOpRo, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * at least one item is name and logo
     * Update space
     * @param spaceUpdateOpRo 
     * @param xSpaceId space id
     */
    public update1(spaceUpdateOpRo: SpaceUpdateOpRo, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.update1(spaceUpdateOpRo, xSpaceId, _options);
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
    public createWithHttpInfo(createTemplateRo: CreateTemplateRo, _options?: Configuration): Promise<HttpInfo<ResponseDataString>> {
        const result = this.api.createWithHttpInfo(createTemplateRo, _options);
        return result.toPromise();
    }

    /**
     * Created nodes (including child descendant nodes) have administrative rights and are not associated with data tables other than nodes.
     * Create Template
     * @param createTemplateRo 
     */
    public create(createTemplateRo: CreateTemplateRo, _options?: Configuration): Promise<ResponseDataString> {
        const result = this.api.create(createTemplateRo, _options);
        return result.toPromise();
    }

    /**
     * Deletion objects: main administrator, sub-admins with template permissions, creator of the template
     * Delete Template
     * @param templateId Template ID
     */
    public delete5WithHttpInfo(templateId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete5WithHttpInfo(templateId, _options);
        return result.toPromise();
    }

    /**
     * Deletion objects: main administrator, sub-admins with template permissions, creator of the template
     * Delete Template
     * @param templateId Template ID
     */
    public delete5(templateId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete5(templateId, _options);
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
    public create3WithHttpInfo(nodeOpRo: NodeOpRo, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        const result = this.api.create3WithHttpInfo(nodeOpRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * create a new node under the node<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Create child node
     * @param nodeOpRo 
     * @param xSocketId user socket id
     */
    public create3(nodeOpRo: NodeOpRo, xSocketId?: string, _options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        const result = this.api.create3(nodeOpRo, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete2WithHttpInfo(nodeId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete2WithHttpInfo(nodeId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete2(nodeId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete2(nodeId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete3WithHttpInfo(nodeId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete3WithHttpInfo(nodeId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete3(nodeId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete3(nodeId, xSocketId, _options);
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
    public list4WithHttpInfo(type: number, xSpaceId: string, role?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListNodeInfo>> {
        const result = this.api.list4WithHttpInfo(type, xSpaceId, role, _options);
        return result.toPromise();
    }

    /**
     * scenario: query an existing dashboard
     * Get nodes of the specified type
     * @param type node type
     * @param xSpaceId space id
     * @param role role（manageable by default）
     */
    public list4(type: number, xSpaceId: string, role?: string, _options?: Configuration): Promise<ResponseDataListNodeInfo> {
        const result = this.api.list4(type, xSpaceId, role, _options);
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
    public update3WithHttpInfo(nodeUpdateOpRo: NodeUpdateOpRo, nodeId: string, xSocketId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataNodeInfoVo>> {
        const result = this.api.update3WithHttpInfo(nodeUpdateOpRo, nodeId, xSocketId, _options);
        return result.toPromise();
    }

    /**
     * node id must. name, icon is not required<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Edit node
     * @param nodeUpdateOpRo 
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public update3(nodeUpdateOpRo: NodeUpdateOpRo, nodeId: string, xSocketId?: string, _options?: Configuration): Promise<ResponseDataNodeInfoVo> {
        const result = this.api.update3(nodeUpdateOpRo, nodeId, xSocketId, _options);
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
    public list5WithHttpInfo(xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListFavoriteNodeInfo>> {
        const result = this.api.list5WithHttpInfo(xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Get favorite nodes
     * @param xSpaceId space id
     */
    public list5(xSpaceId: string, _options?: Configuration): Promise<ResponseDataListFavoriteNodeInfo> {
        const result = this.api.list5(xSpaceId, _options);
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
    public _deleteWithHttpInfo(nodeId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api._deleteWithHttpInfo(nodeId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete node in rubbish
     * @param nodeId node id
     * @param xSpaceId space id
     */
    public _delete(nodeId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api._delete(nodeId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete node in rubbish
     * @param nodeId node id
     * @param xSpaceId space id
     */
    public delete1WithHttpInfo(nodeId: string, xSpaceId: string, _options?: Configuration): Promise<HttpInfo<ResponseDataVoid>> {
        const result = this.api.delete1WithHttpInfo(nodeId, xSpaceId, _options);
        return result.toPromise();
    }

    /**
     * Delete node in rubbish
     * @param nodeId node id
     * @param xSpaceId space id
     */
    public delete1(nodeId: string, xSpaceId: string, _options?: Configuration): Promise<ResponseDataVoid> {
        const result = this.api.delete1(nodeId, xSpaceId, _options);
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
    public list3WithHttpInfo(xSpaceId: string, size?: number, isOverLimit?: boolean, lastNodeId?: string, _options?: Configuration): Promise<HttpInfo<ResponseDataListRubbishNodeVo>> {
        const result = this.api.list3WithHttpInfo(xSpaceId, size, isOverLimit, lastNodeId, _options);
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
    public list3(xSpaceId: string, size?: number, isOverLimit?: boolean, lastNodeId?: string, _options?: Configuration): Promise<ResponseDataListRubbishNodeVo> {
        const result = this.api.list3(xSpaceId, size, isOverLimit, lastNodeId, _options);
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



