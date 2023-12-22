import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
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

import { AccountCenterModuleUserManagementInterfaceApiRequestFactory, AccountCenterModuleUserManagementInterfaceApiResponseProcessor} from "../apis/AccountCenterModuleUserManagementInterfaceApi";
export class ObservableAccountCenterModuleUserManagementInterfaceApi {
    private requestFactory: AccountCenterModuleUserManagementInterfaceApiRequestFactory;
    private responseProcessor: AccountCenterModuleUserManagementInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: AccountCenterModuleUserManagementInterfaceApiRequestFactory,
        responseProcessor?: AccountCenterModuleUserManagementInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new AccountCenterModuleUserManagementInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new AccountCenterModuleUserManagementInterfaceApiResponseProcessor();
    }

    /**
     * Registered login user applies for account cancellation
     * Apply for cancellation of user account
     */
    public applyForClosingWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.applyForClosing(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.applyForClosingWithHttpInfo(rsp)));
            }));
    }

    /**
     * Registered login user applies for account cancellation
     * Apply for cancellation of user account
     */
    public applyForClosing(_options?: Configuration): Observable<ResponseDataVoid> {
        return this.applyForClosingWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Bind mail and modify mail
     * Bind mail
     * @param emailCodeValidateRo 
     */
    public bindEmailWithHttpInfo(emailCodeValidateRo: EmailCodeValidateRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.bindEmail(emailCodeValidateRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.bindEmailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Bind mail and modify mail
     * Bind mail
     * @param emailCodeValidateRo 
     */
    public bindEmail(emailCodeValidateRo: EmailCodeValidateRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.bindEmailWithHttpInfo(emailCodeValidateRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * User recovery account has been applied for cancellation
     * Apply for account restoration
     */
    public cancelClosingWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.cancelClosing(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.cancelClosingWithHttpInfo(rsp)));
            }));
    }

    /**
     * User recovery account has been applied for cancellation
     * Apply for account restoration
     */
    public cancelClosing(_options?: Configuration): Observable<ResponseDataVoid> {
        return this.cancelClosingWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Unregistered users verify whether the account meets the cancellation conditions
     * Verify whether the account can be cancelled
     */
    public checkForClosingWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.checkForClosing(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.checkForClosingWithHttpInfo(rsp)));
            }));
    }

    /**
     * Unregistered users verify whether the account meets the cancellation conditions
     * Verify whether the account can be cancelled
     */
    public checkForClosing(_options?: Configuration): Observable<ResponseDataVoid> {
        return this.checkForClosingWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Delete Active Space Cache
     */
    public delActiveSpaceCacheWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.delActiveSpaceCache(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.delActiveSpaceCacheWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete Active Space Cache
     */
    public delActiveSpaceCache(_options?: Configuration): Observable<ResponseDataVoid> {
        return this.delActiveSpaceCacheWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Get the enabled experimental functions
     * @param spaceId 
     */
    public getEnabledLabFeaturesWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataLabsFeatureVo>> {
        const requestContextPromise = this.requestFactory.getEnabledLabFeatures(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getEnabledLabFeaturesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get the enabled experimental functions
     * @param spaceId 
     */
    public getEnabledLabFeatures(spaceId: string, _options?: Configuration): Observable<ResponseDataLabsFeatureVo> {
        return this.getEnabledLabFeaturesWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataLabsFeatureVo>) => apiResponse.data));
    }

    /**
     * Users can only associate with invited mail when they have no other mail
     * Associate the invited mail
     * @param userLinkEmailRo 
     */
    public linkInviteEmailWithHttpInfo(userLinkEmailRo: UserLinkEmailRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.linkInviteEmail(userLinkEmailRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.linkInviteEmailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Users can only associate with invited mail when they have no other mail
     * Associate the invited mail
     * @param userLinkEmailRo 
     */
    public linkInviteEmail(userLinkEmailRo: UserLinkEmailRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.linkInviteEmailWithHttpInfo(userLinkEmailRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * reset password router
     */
    public resetPasswordWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.resetPassword(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.resetPasswordWithHttpInfo(rsp)));
            }));
    }

    /**
     * reset password router
     */
    public resetPassword(_options?: Configuration): Observable<ResponseDataVoid> {
        return this.resetPasswordWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Retrieve password
     * @param retrievePwdOpRo 
     */
    public retrievePwdWithHttpInfo(retrievePwdOpRo: RetrievePwdOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.retrievePwd(retrievePwdOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.retrievePwdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Retrieve password
     * @param retrievePwdOpRo 
     */
    public retrievePwd(retrievePwdOpRo: RetrievePwdOpRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.retrievePwdWithHttpInfo(retrievePwdOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Bind mail and modify mail
     * Unbind mail
     * @param codeValidateRo 
     */
    public unbindEmailWithHttpInfo(codeValidateRo: CodeValidateRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.unbindEmail(codeValidateRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.unbindEmailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Bind mail and modify mail
     * Unbind mail
     * @param codeValidateRo 
     */
    public unbindEmail(codeValidateRo: CodeValidateRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.unbindEmailWithHttpInfo(codeValidateRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Unbind mobile phone
     * @param codeValidateRo 
     */
    public unbindPhoneWithHttpInfo(codeValidateRo: CodeValidateRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.unbindPhone(codeValidateRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.unbindPhoneWithHttpInfo(rsp)));
            }));
    }

    /**
     * Unbind mobile phone
     * @param codeValidateRo 
     */
    public unbindPhone(codeValidateRo: CodeValidateRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.unbindPhoneWithHttpInfo(codeValidateRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Request parameters cannot be all empty
     * Edit user information
     * @param userOpRo 
     */
    public updateWithHttpInfo(userOpRo: UserOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataString>> {
        const requestContextPromise = this.requestFactory.update(userOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateWithHttpInfo(rsp)));
            }));
    }

    /**
     * Request parameters cannot be all empty
     * Edit user information
     * @param userOpRo 
     */
    public update(userOpRo: UserOpRo, _options?: Configuration): Observable<ResponseDataString> {
        return this.updateWithHttpInfo(userOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataString>) => apiResponse.data));
    }

    /**
     * Update the usage status of laboratory functions
     * Update the usage status of laboratory functions
     * @param userLabsFeatureRo 
     */
    public updateLabsFeatureStatusWithHttpInfo(userLabsFeatureRo: UserLabsFeatureRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.updateLabsFeatureStatus(userLabsFeatureRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateLabsFeatureStatusWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update the usage status of laboratory functions
     * Update the usage status of laboratory functions
     * @param userLabsFeatureRo 
     */
    public updateLabsFeatureStatus(userLabsFeatureRo: UserLabsFeatureRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.updateLabsFeatureStatusWithHttpInfo(userLabsFeatureRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Scene: 1. Personal setting and password modification; 2. Initialize after login for accounts without password
     * Change Password
     * @param updatePwdOpRo 
     */
    public updatePwdWithHttpInfo(updatePwdOpRo: UpdatePwdOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.updatePwd(updatePwdOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updatePwdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Scene: 1. Personal setting and password modification; 2. Initialize after login for accounts without password
     * Change Password
     * @param updatePwdOpRo 
     */
    public updatePwd(updatePwdOpRo: UpdatePwdOpRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.updatePwdWithHttpInfo(updatePwdOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * get personal information
     * @param spaceId space id
     * @param nodeId node id
     * @param filter whether to filter space related information
     */
    public userInfoWithHttpInfo(spaceId?: string, nodeId?: string, filter?: boolean, _options?: Configuration): Observable<HttpInfo<ResponseDataUserInfoVo>> {
        const requestContextPromise = this.requestFactory.userInfo(spaceId, nodeId, filter, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.userInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * get personal information
     * @param spaceId space id
     * @param nodeId node id
     * @param filter whether to filter space related information
     */
    public userInfo(spaceId?: string, nodeId?: string, filter?: boolean, _options?: Configuration): Observable<ResponseDataUserInfoVo> {
        return this.userInfoWithHttpInfo(spaceId, nodeId, filter, _options).pipe(map((apiResponse: HttpInfo<ResponseDataUserInfoVo>) => apiResponse.data));
    }

    /**
     * Query whether users bind mail
     * Query whether users bind mail
     */
    public validBindEmailWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataBoolean>> {
        const requestContextPromise = this.requestFactory.validBindEmail(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.validBindEmailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Query whether users bind mail
     * Query whether users bind mail
     */
    public validBindEmail(_options?: Configuration): Observable<ResponseDataBoolean> {
        return this.validBindEmailWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataBoolean>) => apiResponse.data));
    }

    /**
     * Query whether the user is consistent with the specified mail. It can only be determined if the user has bound the mail
     * Query whether the user is consistent with the specified mail
     * @param checkUserEmailRo 
     */
    public validSameEmailWithHttpInfo(checkUserEmailRo: CheckUserEmailRo, _options?: Configuration): Observable<HttpInfo<ResponseDataBoolean>> {
        const requestContextPromise = this.requestFactory.validSameEmail(checkUserEmailRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.validSameEmailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Query whether the user is consistent with the specified mail. It can only be determined if the user has bound the mail
     * Query whether the user is consistent with the specified mail
     * @param checkUserEmailRo 
     */
    public validSameEmail(checkUserEmailRo: CheckUserEmailRo, _options?: Configuration): Observable<ResponseDataBoolean> {
        return this.validSameEmailWithHttpInfo(checkUserEmailRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataBoolean>) => apiResponse.data));
    }

    /**
     * Bind a new phone
     * Bind a new phone
     * @param smsCodeValidateRo 
     */
    public verifyPhoneWithHttpInfo(smsCodeValidateRo: SmsCodeValidateRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.verifyPhone(smsCodeValidateRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.verifyPhoneWithHttpInfo(rsp)));
            }));
    }

    /**
     * Bind a new phone
     * Bind a new phone
     * @param smsCodeValidateRo 
     */
    public verifyPhone(smsCodeValidateRo: SmsCodeValidateRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.verifyPhoneWithHttpInfo(smsCodeValidateRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { AuthorizationRelatedInterfaceApiRequestFactory, AuthorizationRelatedInterfaceApiResponseProcessor} from "../apis/AuthorizationRelatedInterfaceApi";
export class ObservableAuthorizationRelatedInterfaceApi {
    private requestFactory: AuthorizationRelatedInterfaceApiRequestFactory;
    private responseProcessor: AuthorizationRelatedInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: AuthorizationRelatedInterfaceApiRequestFactory,
        responseProcessor?: AuthorizationRelatedInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new AuthorizationRelatedInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new AuthorizationRelatedInterfaceApiResponseProcessor();
    }

    /**
     * description:verifyType，available values: password sms_code email_code
     * login
     * @param loginRo 
     */
    public loginWithHttpInfo(loginRo: LoginRo, _options?: Configuration): Observable<HttpInfo<ResponseDataLoginResultVO>> {
        const requestContextPromise = this.requestFactory.login(loginRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.loginWithHttpInfo(rsp)));
            }));
    }

    /**
     * description:verifyType，available values: password sms_code email_code
     * login
     * @param loginRo 
     */
    public login(loginRo: LoginRo, _options?: Configuration): Observable<ResponseDataLoginResultVO> {
        return this.loginWithHttpInfo(loginRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataLoginResultVO>) => apiResponse.data));
    }

    /**
     * log out of current user
     * sign out
     */
    public logoutWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataLogoutVO>> {
        const requestContextPromise = this.requestFactory.logout(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.logoutWithHttpInfo(rsp)));
            }));
    }

    /**
     * log out of current user
     * sign out
     */
    public logout(_options?: Configuration): Observable<ResponseDataLogoutVO> {
        return this.logoutWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataLogoutVO>) => apiResponse.data));
    }

    /**
     * log out of current user
     * sign out
     */
    public logout1WithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataLogoutVO>> {
        const requestContextPromise = this.requestFactory.logout1(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.logout1WithHttpInfo(rsp)));
            }));
    }

    /**
     * log out of current user
     * sign out
     */
    public logout1(_options?: Configuration): Observable<ResponseDataLogoutVO> {
        return this.logout1WithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataLogoutVO>) => apiResponse.data));
    }

    /**
     * serving for community edition
     * register
     * @param registerRO 
     */
    public registerWithHttpInfo(registerRO: RegisterRO, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.register(registerRO, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.registerWithHttpInfo(rsp)));
            }));
    }

    /**
     * serving for community edition
     * register
     * @param registerRO 
     */
    public register(registerRO: RegisterRO, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.registerWithHttpInfo(registerRO, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { AutomationApiRequestFactory, AutomationApiResponseProcessor} from "../apis/AutomationApi";
export class ObservableAutomationApi {
    private requestFactory: AutomationApiRequestFactory;
    private responseProcessor: AutomationApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: AutomationApiRequestFactory,
        responseProcessor?: AutomationApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new AutomationApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new AutomationApiResponseProcessor();
    }

    /**
     * Create automation action
     * @param createActionRO 
     * @param resourceId node id
     * @param shareId share id
     */
    public createActionWithHttpInfo(createActionRO: CreateActionRO, resourceId: string, shareId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListActionVO>> {
        const requestContextPromise = this.requestFactory.createAction(createActionRO, resourceId, shareId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createActionWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create automation action
     * @param createActionRO 
     * @param resourceId node id
     * @param shareId share id
     */
    public createAction(createActionRO: CreateActionRO, resourceId: string, shareId: string, _options?: Configuration): Observable<ResponseDataListActionVO> {
        return this.createActionWithHttpInfo(createActionRO, resourceId, shareId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListActionVO>) => apiResponse.data));
    }

    /**
     * Create automation robot trigger
     * @param createTriggerRO 
     * @param resourceId node id
     * @param shareId share id
     */
    public createTriggerWithHttpInfo(createTriggerRO: CreateTriggerRO, resourceId: string, shareId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListTriggerVO>> {
        const requestContextPromise = this.requestFactory.createTrigger(createTriggerRO, resourceId, shareId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createTriggerWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create automation robot trigger
     * @param createTriggerRO 
     * @param resourceId node id
     * @param shareId share id
     */
    public createTrigger(createTriggerRO: CreateTriggerRO, resourceId: string, shareId: string, _options?: Configuration): Observable<ResponseDataListTriggerVO> {
        return this.createTriggerWithHttpInfo(createTriggerRO, resourceId, shareId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListTriggerVO>) => apiResponse.data));
    }

    /**
     * Delete automation action
     * @param resourceId node id
     * @param actionId action id
     * @param robotId robot id
     */
    public deleteActionWithHttpInfo(resourceId: string, actionId: string, robotId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.deleteAction(resourceId, actionId, robotId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteActionWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete automation action
     * @param resourceId node id
     * @param actionId action id
     * @param robotId robot id
     */
    public deleteAction(resourceId: string, actionId: string, robotId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.deleteActionWithHttpInfo(resourceId, actionId, robotId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Delete automation robot
     * @param resourceId node id
     * @param robotId robot id
     */
    public deleteRobotWithHttpInfo(resourceId: string, robotId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.deleteRobot(resourceId, robotId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteRobotWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete automation robot
     * @param resourceId node id
     * @param robotId robot id
     */
    public deleteRobot(resourceId: string, robotId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.deleteRobotWithHttpInfo(resourceId, robotId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Delete automation trigger
     * @param resourceId node id
     * @param triggerId trigger id
     * @param robotId robot id
     */
    public deleteTriggerWithHttpInfo(resourceId: string, triggerId: string, robotId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.deleteTrigger(resourceId, triggerId, robotId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteTriggerWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete automation trigger
     * @param resourceId node id
     * @param triggerId trigger id
     * @param robotId robot id
     */
    public deleteTrigger(resourceId: string, triggerId: string, robotId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.deleteTriggerWithHttpInfo(resourceId, triggerId, robotId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Get node automation detail. 
     * @param resourceId node id
     * @param robotId robot id
     * @param shareId share id
     */
    public getNodeRobotWithHttpInfo(resourceId: string, robotId: string, shareId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataAutomationVO>> {
        const requestContextPromise = this.requestFactory.getNodeRobot(resourceId, robotId, shareId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getNodeRobotWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get node automation detail. 
     * @param resourceId node id
     * @param robotId robot id
     * @param shareId share id
     */
    public getNodeRobot(resourceId: string, robotId: string, shareId: string, _options?: Configuration): Observable<ResponseDataAutomationVO> {
        return this.getNodeRobotWithHttpInfo(resourceId, robotId, shareId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataAutomationVO>) => apiResponse.data));
    }

    /**
     * Get automation robots
     * @param resourceId node id
     * @param shareId share id
     */
    public getResourceRobotsWithHttpInfo(resourceId: string, shareId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListAutomationSimpleVO>> {
        const requestContextPromise = this.requestFactory.getResourceRobots(resourceId, shareId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getResourceRobotsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get automation robots
     * @param resourceId node id
     * @param shareId share id
     */
    public getResourceRobots(resourceId: string, shareId: string, _options?: Configuration): Observable<ResponseDataListAutomationSimpleVO> {
        return this.getResourceRobotsWithHttpInfo(resourceId, shareId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListAutomationSimpleVO>) => apiResponse.data));
    }

    /**
     * Get automation run history
     * @param pageNum Current page number, default: 1
     * @param shareId share id
     * @param resourceId node id
     * @param robotId robot id
     * @param pageSize Page size, default: 20
     */
    public getRunHistoryWithHttpInfo(pageNum: number, shareId: string, resourceId: string, robotId: string, pageSize?: number, _options?: Configuration): Observable<HttpInfo<ResponseDataListAutomationTaskSimpleVO>> {
        const requestContextPromise = this.requestFactory.getRunHistory(pageNum, shareId, resourceId, robotId, pageSize, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getRunHistoryWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get automation run history
     * @param pageNum Current page number, default: 1
     * @param shareId share id
     * @param resourceId node id
     * @param robotId robot id
     * @param pageSize Page size, default: 20
     */
    public getRunHistory(pageNum: number, shareId: string, resourceId: string, robotId: string, pageSize?: number, _options?: Configuration): Observable<ResponseDataListAutomationTaskSimpleVO> {
        return this.getRunHistoryWithHttpInfo(pageNum, shareId, resourceId, robotId, pageSize, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListAutomationTaskSimpleVO>) => apiResponse.data));
    }

    /**
     * Update automation info.
     * @param updateRobotRO 
     * @param resourceId node id
     * @param robotId robot id
     * @param shareId share id
     */
    public modifyRobotWithHttpInfo(updateRobotRO: UpdateRobotRO, resourceId: string, robotId: string, shareId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.modifyRobot(updateRobotRO, resourceId, robotId, shareId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.modifyRobotWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update automation info.
     * @param updateRobotRO 
     * @param resourceId node id
     * @param robotId robot id
     * @param shareId share id
     */
    public modifyRobot(updateRobotRO: UpdateRobotRO, resourceId: string, robotId: string, shareId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.modifyRobotWithHttpInfo(updateRobotRO, resourceId, robotId, shareId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Update automation action
     * @param updateActionRO 
     * @param resourceId node id
     * @param actionId action id
     * @param shareId share id
     */
    public updateActionWithHttpInfo(updateActionRO: UpdateActionRO, resourceId: string, actionId: string, shareId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListActionVO>> {
        const requestContextPromise = this.requestFactory.updateAction(updateActionRO, resourceId, actionId, shareId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateActionWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update automation action
     * @param updateActionRO 
     * @param resourceId node id
     * @param actionId action id
     * @param shareId share id
     */
    public updateAction(updateActionRO: UpdateActionRO, resourceId: string, actionId: string, shareId: string, _options?: Configuration): Observable<ResponseDataListActionVO> {
        return this.updateActionWithHttpInfo(updateActionRO, resourceId, actionId, shareId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListActionVO>) => apiResponse.data));
    }

    /**
     * Update automation robot trigger
     * @param updateTriggerRO 
     * @param resourceId node id
     * @param triggerId trigger id
     * @param shareId share id
     */
    public updateTriggerWithHttpInfo(updateTriggerRO: UpdateTriggerRO, resourceId: string, triggerId: string, shareId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListTriggerVO>> {
        const requestContextPromise = this.requestFactory.updateTrigger(updateTriggerRO, resourceId, triggerId, shareId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateTriggerWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update automation robot trigger
     * @param updateTriggerRO 
     * @param resourceId node id
     * @param triggerId trigger id
     * @param shareId share id
     */
    public updateTrigger(updateTriggerRO: UpdateTriggerRO, resourceId: string, triggerId: string, shareId: string, _options?: Configuration): Observable<ResponseDataListTriggerVO> {
        return this.updateTriggerWithHttpInfo(updateTriggerRO, resourceId, triggerId, shareId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListTriggerVO>) => apiResponse.data));
    }

}

import { BasicModuleAccessoryCallbackInterfaceApiRequestFactory, BasicModuleAccessoryCallbackInterfaceApiResponseProcessor} from "../apis/BasicModuleAccessoryCallbackInterfaceApi";
export class ObservableBasicModuleAccessoryCallbackInterfaceApi {
    private requestFactory: BasicModuleAccessoryCallbackInterfaceApiRequestFactory;
    private responseProcessor: BasicModuleAccessoryCallbackInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: BasicModuleAccessoryCallbackInterfaceApiRequestFactory,
        responseProcessor?: BasicModuleAccessoryCallbackInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new BasicModuleAccessoryCallbackInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new BasicModuleAccessoryCallbackInterfaceApiResponseProcessor();
    }

    /**
     * After S3 completes the client upload, it actively reaches the notification server
     * Resource upload completion notification callback
     * @param assetUploadNotifyRO 
     */
    public notifyCallbackWithHttpInfo(assetUploadNotifyRO: AssetUploadNotifyRO, _options?: Configuration): Observable<HttpInfo<ResponseDataListAssetUploadResult>> {
        const requestContextPromise = this.requestFactory.notifyCallback(assetUploadNotifyRO, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.notifyCallbackWithHttpInfo(rsp)));
            }));
    }

    /**
     * After S3 completes the client upload, it actively reaches the notification server
     * Resource upload completion notification callback
     * @param assetUploadNotifyRO 
     */
    public notifyCallback(assetUploadNotifyRO: AssetUploadNotifyRO, _options?: Configuration): Observable<ResponseDataListAssetUploadResult> {
        return this.notifyCallbackWithHttpInfo(assetUploadNotifyRO, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListAssetUploadResult>) => apiResponse.data));
    }

    /**
     * widget upload callback
     * @param widgetUploadNotifyRO 
     */
    public widgetCallbackWithHttpInfo(widgetUploadNotifyRO: WidgetUploadNotifyRO, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.widgetCallback(widgetUploadNotifyRO, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.widgetCallbackWithHttpInfo(rsp)));
            }));
    }

    /**
     * widget upload callback
     * @param widgetUploadNotifyRO 
     */
    public widgetCallback(widgetUploadNotifyRO: WidgetUploadNotifyRO, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.widgetCallbackWithHttpInfo(widgetUploadNotifyRO, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { BasicModuleAttachmentInterfaceApiRequestFactory, BasicModuleAttachmentInterfaceApiResponseProcessor} from "../apis/BasicModuleAttachmentInterfaceApi";
export class ObservableBasicModuleAttachmentInterfaceApi {
    private requestFactory: BasicModuleAttachmentInterfaceApiRequestFactory;
    private responseProcessor: BasicModuleAttachmentInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: BasicModuleAttachmentInterfaceApiRequestFactory,
        responseProcessor?: BasicModuleAttachmentInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new BasicModuleAttachmentInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new BasicModuleAttachmentInterfaceApiResponseProcessor();
    }

    /**
     * The same attachment needs to pass the token repeatedly
     * Changes in the number of references to space attachment resources
     * @param spaceAssetOpRo 
     */
    public citeWithHttpInfo(spaceAssetOpRo: SpaceAssetOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.cite(spaceAssetOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.citeWithHttpInfo(rsp)));
            }));
    }

    /**
     * The same attachment needs to pass the token repeatedly
     * Changes in the number of references to space attachment resources
     * @param spaceAssetOpRo 
     */
    public cite(spaceAssetOpRo: SpaceAssetOpRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.citeWithHttpInfo(spaceAssetOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Paging query pictures that need manual review
     * @param page 
     * @param pageObjectParams Page params
     */
    public readReviewsWithHttpInfo(page: Page, pageObjectParams: string, _options?: Configuration): Observable<HttpInfo<ResponseDataPageInfoAssetsAuditVo>> {
        const requestContextPromise = this.requestFactory.readReviews(page, pageObjectParams, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.readReviewsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Paging query pictures that need manual review
     * @param page 
     * @param pageObjectParams Page params
     */
    public readReviews(page: Page, pageObjectParams: string, _options?: Configuration): Observable<ResponseDataPageInfoAssetsAuditVo> {
        return this.readReviewsWithHttpInfo(page, pageObjectParams, _options).pipe(map((apiResponse: HttpInfo<ResponseDataPageInfoAssetsAuditVo>) => apiResponse.data));
    }

    /**
     * Submit the image review results, enter the reviewer\'s name when submitting
     * Submit image review results
     * @param assetsAuditRo 
     */
    public submitAuditResultWithHttpInfo(assetsAuditRo: AssetsAuditRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.submitAuditResult(assetsAuditRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.submitAuditResultWithHttpInfo(rsp)));
            }));
    }

    /**
     * Submit the image review results, enter the reviewer\'s name when submitting
     * Submit image review results
     * @param assetsAuditRo 
     */
    public submitAuditResult(assetsAuditRo: AssetsAuditRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.submitAuditResultWithHttpInfo(assetsAuditRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Upload resource files, any file type is unlimited
     * Upload resources
     * @param attachOpRo 
     */
    public uploadWithHttpInfo(attachOpRo?: AttachOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataAssetUploadResult>> {
        const requestContextPromise = this.requestFactory.upload(attachOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.uploadWithHttpInfo(rsp)));
            }));
    }

    /**
     * Upload resource files, any file type is unlimited
     * Upload resources
     * @param attachOpRo 
     */
    public upload(attachOpRo?: AttachOpRo, _options?: Configuration): Observable<ResponseDataAssetUploadResult> {
        return this.uploadWithHttpInfo(attachOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataAssetUploadResult>) => apiResponse.data));
    }

    /**
     * Image URL upload interface
     * @param attachUrlOpRo 
     */
    public urlUploadWithHttpInfo(attachUrlOpRo?: AttachUrlOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataAssetUploadResult>> {
        const requestContextPromise = this.requestFactory.urlUpload(attachUrlOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.urlUploadWithHttpInfo(rsp)));
            }));
    }

    /**
     * Image URL upload interface
     * @param attachUrlOpRo 
     */
    public urlUpload(attachUrlOpRo?: AttachUrlOpRo, _options?: Configuration): Observable<ResponseDataAssetUploadResult> {
        return this.urlUploadWithHttpInfo(attachUrlOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataAssetUploadResult>) => apiResponse.data));
    }

}

import { BasicModuleVerifyActionModuleInterfaceApiRequestFactory, BasicModuleVerifyActionModuleInterfaceApiResponseProcessor} from "../apis/BasicModuleVerifyActionModuleInterfaceApi";
export class ObservableBasicModuleVerifyActionModuleInterfaceApi {
    private requestFactory: BasicModuleVerifyActionModuleInterfaceApiRequestFactory;
    private responseProcessor: BasicModuleVerifyActionModuleInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: BasicModuleVerifyActionModuleInterfaceApiRequestFactory,
        responseProcessor?: BasicModuleVerifyActionModuleInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new BasicModuleVerifyActionModuleInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new BasicModuleVerifyActionModuleInterfaceApiResponseProcessor();
    }

    /**
     * Invitation link token verification, the relevant invitation information can be obtained after the verification is successful
     * Invitation temporary code verification
     * @param inviteValidRo 
     */
    public inviteTokenValidWithHttpInfo(inviteValidRo: InviteValidRo, _options?: Configuration): Observable<HttpInfo<ResponseDataInviteInfoVo>> {
        const requestContextPromise = this.requestFactory.inviteTokenValid(inviteValidRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.inviteTokenValidWithHttpInfo(rsp)));
            }));
    }

    /**
     * Invitation link token verification, the relevant invitation information can be obtained after the verification is successful
     * Invitation temporary code verification
     * @param inviteValidRo 
     */
    public inviteTokenValid(inviteValidRo: InviteValidRo, _options?: Configuration): Observable<ResponseDataInviteInfoVo> {
        return this.inviteTokenValidWithHttpInfo(inviteValidRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataInviteInfoVo>) => apiResponse.data));
    }

    /**
     * Email verification code; 1:Email binding, 2: Email registration, 3: General verification
     * Send email verification code
     * @param emailOpRo 
     */
    public mailWithHttpInfo(emailOpRo: EmailOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.mail(emailOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.mailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Email verification code; 1:Email binding, 2: Email registration, 3: General verification
     * Send email verification code
     * @param emailOpRo 
     */
    public mail(emailOpRo: EmailOpRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.mailWithHttpInfo(emailOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * SMS type; 1: Registration, 2:Login, 3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, 6: (Remove replacement) mobile phone binding 7: Modify mailbox binding,8: Delete space, 9: Replace main administrator 10: General verification, 11: Change developer configuration, 12: Bind third-party platform account
     * Send SMS verification code
     * @param smsOpRo 
     */
    public sendWithHttpInfo(smsOpRo: SmsOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.send(smsOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.sendWithHttpInfo(rsp)));
            }));
    }

    /**
     * SMS type; 1: Registration, 2:Login, 3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, 6: (Remove replacement) mobile phone binding 7: Modify mailbox binding,8: Delete space, 9: Replace main administrator 10: General verification, 11: Change developer configuration, 12: Bind third-party platform account
     * Send SMS verification code
     * @param smsOpRo 
     */
    public send(smsOpRo: SmsOpRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.sendWithHttpInfo(smsOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Usage scenario: Verify identity before changing email address when no mobile phone, change the main administrator
     * Email verification code verification
     * @param emailCodeValidateRo 
     */
    public validateEmailWithHttpInfo(emailCodeValidateRo: EmailCodeValidateRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.validateEmail(emailCodeValidateRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.validateEmailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Usage scenario: Verify identity before changing email address when no mobile phone, change the main administrator
     * Email verification code verification
     * @param emailCodeValidateRo 
     */
    public validateEmail(emailCodeValidateRo: EmailCodeValidateRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.validateEmailWithHttpInfo(emailCodeValidateRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Usage scenarios: DingTalk binding, identity verification before changing the mobile phone mailbox, changing the main administrator
     * Mobile verification code verification
     * @param smsCodeValidateRo 
     */
    public verifyPhone1WithHttpInfo(smsCodeValidateRo: SmsCodeValidateRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.verifyPhone1(smsCodeValidateRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.verifyPhone1WithHttpInfo(rsp)));
            }));
    }

    /**
     * Usage scenarios: DingTalk binding, identity verification before changing the mobile phone mailbox, changing the main administrator
     * Mobile verification code verification
     * @param smsCodeValidateRo 
     */
    public verifyPhone1(smsCodeValidateRo: SmsCodeValidateRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.verifyPhone1WithHttpInfo(smsCodeValidateRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { BasicsAttachmentUploadTokenInterfaceApiRequestFactory, BasicsAttachmentUploadTokenInterfaceApiResponseProcessor} from "../apis/BasicsAttachmentUploadTokenInterfaceApi";
export class ObservableBasicsAttachmentUploadTokenInterfaceApi {
    private requestFactory: BasicsAttachmentUploadTokenInterfaceApiRequestFactory;
    private responseProcessor: BasicsAttachmentUploadTokenInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: BasicsAttachmentUploadTokenInterfaceApiRequestFactory,
        responseProcessor?: BasicsAttachmentUploadTokenInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new BasicsAttachmentUploadTokenInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new BasicsAttachmentUploadTokenInterfaceApiResponseProcessor();
    }

    /**
     * Get upload presigned URL
     * @param assetUploadCertificateRO 
     */
    public generatePreSignedUrlWithHttpInfo(assetUploadCertificateRO: AssetUploadCertificateRO, _options?: Configuration): Observable<HttpInfo<ResponseDataListAssetUploadCertificateVO>> {
        const requestContextPromise = this.requestFactory.generatePreSignedUrl(assetUploadCertificateRO, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.generatePreSignedUrlWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get upload presigned URL
     * @param assetUploadCertificateRO 
     */
    public generatePreSignedUrl(assetUploadCertificateRO: AssetUploadCertificateRO, _options?: Configuration): Observable<ResponseDataListAssetUploadCertificateVO> {
        return this.generatePreSignedUrlWithHttpInfo(assetUploadCertificateRO, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListAssetUploadCertificateVO>) => apiResponse.data));
    }

    /**
     * Get asset signature url
     * @param token 
     */
    public getSignatureUrlWithHttpInfo(token: string, _options?: Configuration): Observable<HttpInfo<ResponseDataString>> {
        const requestContextPromise = this.requestFactory.getSignatureUrl(token, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSignatureUrlWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get asset signature url
     * @param token 
     */
    public getSignatureUrl(token: string, _options?: Configuration): Observable<ResponseDataString> {
        return this.getSignatureUrlWithHttpInfo(token, _options).pipe(map((apiResponse: HttpInfo<ResponseDataString>) => apiResponse.data));
    }

    /**
     * Batch get asset signature url
     * @param assetUrlSignatureRo 
     */
    public getSignatureUrlsWithHttpInfo(assetUrlSignatureRo: AssetUrlSignatureRo, _options?: Configuration): Observable<HttpInfo<ResponseDataListAssetUrlSignatureVo>> {
        const requestContextPromise = this.requestFactory.getSignatureUrls(assetUrlSignatureRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSignatureUrlsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Batch get asset signature url
     * @param assetUrlSignatureRo 
     */
    public getSignatureUrls(assetUrlSignatureRo: AssetUrlSignatureRo, _options?: Configuration): Observable<ResponseDataListAssetUrlSignatureVo> {
        return this.getSignatureUrlsWithHttpInfo(assetUrlSignatureRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListAssetUrlSignatureVo>) => apiResponse.data));
    }

}

import { ClientInterfaceApiRequestFactory, ClientInterfaceApiResponseProcessor} from "../apis/ClientInterfaceApi";
export class ObservableClientInterfaceApi {
    private requestFactory: ClientInterfaceApiRequestFactory;
    private responseProcessor: ClientInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ClientInterfaceApiRequestFactory,
        responseProcessor?: ClientInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ClientInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ClientInterfaceApiResponseProcessor();
    }

    /**
     * Get the application client version rendering information
     * Get application version information
     * @param spaceId 
     * @param pipeline Construction serial number
     */
    public getTemplateInfoWithHttpInfo(spaceId?: string, pipeline?: string, _options?: Configuration): Observable<HttpInfo<ClientInfoVO>> {
        const requestContextPromise = this.requestFactory.getTemplateInfo(spaceId, pipeline, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getTemplateInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get the application client version rendering information
     * Get application version information
     * @param spaceId 
     * @param pipeline Construction serial number
     */
    public getTemplateInfo(spaceId?: string, pipeline?: string, _options?: Configuration): Observable<ClientInfoVO> {
        return this.getTemplateInfoWithHttpInfo(spaceId, pipeline, _options).pipe(map((apiResponse: HttpInfo<ClientInfoVO>) => apiResponse.data));
    }

}

import { ContactMemberApiApiRequestFactory, ContactMemberApiApiResponseProcessor} from "../apis/ContactMemberApiApi";
export class ObservableContactMemberApiApi {
    private requestFactory: ContactMemberApiApiRequestFactory;
    private responseProcessor: ContactMemberApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ContactMemberApiApiRequestFactory,
        responseProcessor?: ContactMemberApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ContactMemberApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ContactMemberApiApiResponseProcessor();
    }

    /**
     * When adding new members, they can only be selected from within the organization structure and can be transferred by department
     * Add member
     * @param teamAddMemberRo 
     * @param xSpaceId space id
     */
    public addMemberWithHttpInfo(teamAddMemberRo: TeamAddMemberRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.addMember(teamAddMemberRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.addMemberWithHttpInfo(rsp)));
            }));
    }

    /**
     * When adding new members, they can only be selected from within the organization structure and can be transferred by department
     * Add member
     * @param teamAddMemberRo 
     * @param xSpaceId space id
     */
    public addMember(teamAddMemberRo: TeamAddMemberRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.addMemberWithHttpInfo(teamAddMemberRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Check whether email in space
     * Check whether email in space
     * @param email email
     * @param xSpaceId space id
     */
    public checkEmailInSpaceWithHttpInfo(email: string, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataBoolean>> {
        const requestContextPromise = this.requestFactory.checkEmailInSpace(email, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.checkEmailInSpaceWithHttpInfo(rsp)));
            }));
    }

    /**
     * Check whether email in space
     * Check whether email in space
     * @param email email
     * @param xSpaceId space id
     */
    public checkEmailInSpace(email: string, xSpaceId: string, _options?: Configuration): Observable<ResponseDataBoolean> {
        return this.checkEmailInSpaceWithHttpInfo(email, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataBoolean>) => apiResponse.data));
    }

    /**
     * action provides two deletion modes，1.delete from organization 2. delete from team
     * Delete members
     * @param deleteBatchMemberRo 
     * @param xSpaceId space id
     */
    public deleteBatchMemberWithHttpInfo(deleteBatchMemberRo: DeleteBatchMemberRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.deleteBatchMember(deleteBatchMemberRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteBatchMemberWithHttpInfo(rsp)));
            }));
    }

    /**
     * action provides two deletion modes，1.delete from organization 2. delete from team
     * Delete members
     * @param deleteBatchMemberRo 
     * @param xSpaceId space id
     */
    public deleteBatchMember(deleteBatchMemberRo: DeleteBatchMemberRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.deleteBatchMemberWithHttpInfo(deleteBatchMemberRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * action provides two deletion modes.1.delete from organization 2. delete from team
     * Delete a Member
     * @param deleteMemberRo 
     * @param xSpaceId space id
     */
    public deleteMemberWithHttpInfo(deleteMemberRo: DeleteMemberRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.deleteMember(deleteMemberRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteMemberWithHttpInfo(rsp)));
            }));
    }

    /**
     * action provides two deletion modes.1.delete from organization 2. delete from team
     * Delete a Member
     * @param deleteMemberRo 
     * @param xSpaceId space id
     */
    public deleteMember(deleteMemberRo: DeleteMemberRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.deleteMemberWithHttpInfo(deleteMemberRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Download contact template
     * Download contact template
     */
    public downloadTemplateWithHttpInfo(_options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.downloadTemplate(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.downloadTemplateWithHttpInfo(rsp)));
            }));
    }

    /**
     * Download contact template
     * Download contact template
     */
    public downloadTemplate(_options?: Configuration): Observable<void> {
        return this.downloadTemplateWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Query all the members of the department, including the members of the sub department.if root team can lack teamId, teamId default 0.
     * Query the team\'s members
     * @param xSpaceId space id
     * @param teamId team id. if root team can lack teamId, teamId default 0.
     */
    public getMemberListWithHttpInfo(xSpaceId: string, teamId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListMemberInfoVo>> {
        const requestContextPromise = this.requestFactory.getMemberList(xSpaceId, teamId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getMemberListWithHttpInfo(rsp)));
            }));
    }

    /**
     * Query all the members of the department, including the members of the sub department.if root team can lack teamId, teamId default 0.
     * Query the team\'s members
     * @param xSpaceId space id
     * @param teamId team id. if root team can lack teamId, teamId default 0.
     */
    public getMemberList(xSpaceId: string, teamId?: string, _options?: Configuration): Observable<ResponseDataListMemberInfoVo> {
        return this.getMemberListWithHttpInfo(xSpaceId, teamId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListMemberInfoVo>) => apiResponse.data));
    }

    /**
     * Fuzzy Search Members
     * Fuzzy Search Members
     * @param keyword keyword
     * @param xSpaceId space id
     * @param filter whether to filter unadded members
     * @param className the highlighting style
     */
    public getMembersWithHttpInfo(keyword: string, xSpaceId: string, filter?: boolean, className?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListSearchMemberVo>> {
        const requestContextPromise = this.requestFactory.getMembers(keyword, xSpaceId, filter, className, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getMembersWithHttpInfo(rsp)));
            }));
    }

    /**
     * Fuzzy Search Members
     * Fuzzy Search Members
     * @param keyword keyword
     * @param xSpaceId space id
     * @param filter whether to filter unadded members
     * @param className the highlighting style
     */
    public getMembers(keyword: string, xSpaceId: string, filter?: boolean, className?: string, _options?: Configuration): Observable<ResponseDataListSearchMemberVo> {
        return this.getMembersWithHttpInfo(keyword, xSpaceId, filter, className, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListSearchMemberVo>) => apiResponse.data));
    }

    /**
     * Query the units which a user belongs, include self
     * Query the units which a user belongs in space
     * @param xSpaceId space id
     */
    public getUnitsWithHttpInfo(xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataMemberUnitsVo>> {
        const requestContextPromise = this.requestFactory.getUnits(xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getUnitsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Query the units which a user belongs, include self
     * Query the units which a user belongs in space
     * @param xSpaceId space id
     */
    public getUnits(xSpaceId: string, _options?: Configuration): Observable<ResponseDataMemberUnitsVo> {
        return this.getUnitsWithHttpInfo(xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataMemberUnitsVo>) => apiResponse.data));
    }

    /**
     * Send an email to invite. The email is automatically bound to the platform user. The invited member will be in the state to be activated, and will not take effect until the user self activates.
     * Send an email to invite members
     * @param inviteRo 
     * @param xSpaceId space id
     */
    public inviteMemberWithHttpInfo(inviteRo: InviteRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataMemberUnitsVo>> {
        const requestContextPromise = this.requestFactory.inviteMember(inviteRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.inviteMemberWithHttpInfo(rsp)));
            }));
    }

    /**
     * Send an email to invite. The email is automatically bound to the platform user. The invited member will be in the state to be activated, and will not take effect until the user self activates.
     * Send an email to invite members
     * @param inviteRo 
     * @param xSpaceId space id
     */
    public inviteMember(inviteRo: InviteRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataMemberUnitsVo> {
        return this.inviteMemberWithHttpInfo(inviteRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataMemberUnitsVo>) => apiResponse.data));
    }

    /**
     * If a member is not activated, it can send an invitation again regardless of whether the invitation has expired. After the invitation is successfully sent, the invitation link sent last time will be invalid.
     * Again send an email to invite members
     * @param inviteMemberAgainRo 
     * @param xSpaceId space id
     */
    public inviteMemberSingleWithHttpInfo(inviteMemberAgainRo: InviteMemberAgainRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.inviteMemberSingle(inviteMemberAgainRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.inviteMemberSingleWithHttpInfo(rsp)));
            }));
    }

    /**
     * If a member is not activated, it can send an invitation again regardless of whether the invitation has expired. After the invitation is successfully sent, the invitation link sent last time will be invalid.
     * Again send an email to invite members
     * @param inviteMemberAgainRo 
     * @param xSpaceId space id
     */
    public inviteMemberSingle(inviteMemberAgainRo: InviteMemberAgainRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.inviteMemberSingleWithHttpInfo(inviteMemberAgainRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Get member\'s detail info
     * Get member\'s detail info
     * @param xSpaceId space id
     * @param memberId member id
     * @param uuid user uuid
     */
    public read1WithHttpInfo(xSpaceId: string, memberId?: string, uuid?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataMemberInfoVo>> {
        const requestContextPromise = this.requestFactory.read1(xSpaceId, memberId, uuid, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.read1WithHttpInfo(rsp)));
            }));
    }

    /**
     * Get member\'s detail info
     * Get member\'s detail info
     * @param xSpaceId space id
     * @param memberId member id
     * @param uuid user uuid
     */
    public read1(xSpaceId: string, memberId?: string, uuid?: string, _options?: Configuration): Observable<ResponseDataMemberInfoVo> {
        return this.read1WithHttpInfo(xSpaceId, memberId, uuid, _options).pipe(map((apiResponse: HttpInfo<ResponseDataMemberInfoVo>) => apiResponse.data));
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
    public readPageWithHttpInfo(page: Page, xSpaceId: string, pageObjectParams: string, teamId?: string, isActive?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataPageInfoMemberPageVo>> {
        const requestContextPromise = this.requestFactory.readPage(page, xSpaceId, pageObjectParams, teamId, isActive, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.readPageWithHttpInfo(rsp)));
            }));
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
    public readPage(page: Page, xSpaceId: string, pageObjectParams: string, teamId?: string, isActive?: string, _options?: Configuration): Observable<ResponseDataPageInfoMemberPageVo> {
        return this.readPageWithHttpInfo(page, xSpaceId, pageObjectParams, teamId, isActive, _options).pipe(map((apiResponse: HttpInfo<ResponseDataPageInfoMemberPageVo>) => apiResponse.data));
    }

    /**
     * Edit self member information
     * Edit self member information
     * @param updateMemberOpRo 
     * @param xSpaceId space id
     */
    public update2WithHttpInfo(updateMemberOpRo: UpdateMemberOpRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.update2(updateMemberOpRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.update2WithHttpInfo(rsp)));
            }));
    }

    /**
     * Edit self member information
     * Edit self member information
     * @param updateMemberOpRo 
     * @param xSpaceId space id
     */
    public update2(updateMemberOpRo: UpdateMemberOpRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.update2WithHttpInfo(updateMemberOpRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Edit member info
     * Edit member info
     * @param updateMemberRo 
     * @param xSpaceId space id
     */
    public updateInfoWithHttpInfo(updateMemberRo: UpdateMemberRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.updateInfo(updateMemberRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * Edit member info
     * Edit member info
     * @param updateMemberRo 
     * @param xSpaceId space id
     */
    public updateInfo(updateMemberRo: UpdateMemberRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.updateInfoWithHttpInfo(updateMemberRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * assign members to departments
     * Update team
     * @param updateMemberTeamRo 
     * @param xSpaceId space id
     */
    public updateTeam1WithHttpInfo(updateMemberTeamRo: UpdateMemberTeamRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.updateTeam1(updateMemberTeamRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateTeam1WithHttpInfo(rsp)));
            }));
    }

    /**
     * assign members to departments
     * Update team
     * @param updateMemberTeamRo 
     * @param xSpaceId space id
     */
    public updateTeam1(updateMemberTeamRo: UpdateMemberTeamRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.updateTeam1WithHttpInfo(updateMemberTeamRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Upload employee sheet，then parse it.
     * Upload employee sheet
     * @param data 
     * @param xSpaceId space id
     */
    public uploadExcelWithHttpInfo(data: UploadMemberTemplateRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataUploadParseResultVO>> {
        const requestContextPromise = this.requestFactory.uploadExcel(data, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.uploadExcelWithHttpInfo(rsp)));
            }));
    }

    /**
     * Upload employee sheet，then parse it.
     * Upload employee sheet
     * @param data 
     * @param xSpaceId space id
     */
    public uploadExcel(data: UploadMemberTemplateRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataUploadParseResultVO> {
        return this.uploadExcelWithHttpInfo(data, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataUploadParseResultVO>) => apiResponse.data));
    }

}

import { ContactOrganizationApiApiRequestFactory, ContactOrganizationApiApiResponseProcessor} from "../apis/ContactOrganizationApiApi";
export class ObservableContactOrganizationApiApi {
    private requestFactory: ContactOrganizationApiApiRequestFactory;
    private responseProcessor: ContactOrganizationApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ContactOrganizationApiApiRequestFactory,
        responseProcessor?: ContactOrganizationApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ContactOrganizationApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ContactOrganizationApiApiResponseProcessor();
    }

    /**
     * Query the sub departments and members of department. if team id lack, default is 0
     * Query the sub departments and members of department
     * @param teamId team id
     * @param linkId link id: node share id | template id
     * @param xSpaceId space id
     */
    public getSubUnitListWithHttpInfo(teamId?: string, linkId?: string, xSpaceId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataSubUnitResultVo>> {
        const requestContextPromise = this.requestFactory.getSubUnitList(teamId, linkId, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSubUnitListWithHttpInfo(rsp)));
            }));
    }

    /**
     * Query the sub departments and members of department. if team id lack, default is 0
     * Query the sub departments and members of department
     * @param teamId team id
     * @param linkId link id: node share id | template id
     * @param xSpaceId space id
     */
    public getSubUnitList(teamId?: string, linkId?: string, xSpaceId?: string, _options?: Configuration): Observable<ResponseDataSubUnitResultVo> {
        return this.getSubUnitListWithHttpInfo(teamId, linkId, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataSubUnitResultVo>) => apiResponse.data));
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
    public loadOrSearchWithHttpInfo(params: LoadSearchDTO, xSpaceId?: string, linkId?: string, keyword?: string, unitIds?: string, filterIds?: string, all?: boolean, searchEmail?: boolean, _options?: Configuration): Observable<HttpInfo<ResponseDataListUnitInfoVo>> {
        const requestContextPromise = this.requestFactory.loadOrSearch(params, xSpaceId, linkId, keyword, unitIds, filterIds, all, searchEmail, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.loadOrSearchWithHttpInfo(rsp)));
            }));
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
    public loadOrSearch(params: LoadSearchDTO, xSpaceId?: string, linkId?: string, keyword?: string, unitIds?: string, filterIds?: string, all?: boolean, searchEmail?: boolean, _options?: Configuration): Observable<ResponseDataListUnitInfoVo> {
        return this.loadOrSearchWithHttpInfo(params, xSpaceId, linkId, keyword, unitIds, filterIds, all, searchEmail, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListUnitInfoVo>) => apiResponse.data));
    }

    /**
     * Provide input word fuzzy search organization resources
     * search organization resources
     * @param keyword keyword
     * @param linkId link id: node share id | template id
     * @param className the highlight style
     * @param xSpaceId space id
     */
    public searchWithHttpInfo(keyword: string, linkId?: string, className?: string, xSpaceId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataUnitSearchResultVo>> {
        const requestContextPromise = this.requestFactory.search(keyword, linkId, className, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.searchWithHttpInfo(rsp)));
            }));
    }

    /**
     * Provide input word fuzzy search organization resources
     * search organization resources
     * @param keyword keyword
     * @param linkId link id: node share id | template id
     * @param className the highlight style
     * @param xSpaceId space id
     */
    public search(keyword: string, linkId?: string, className?: string, xSpaceId?: string, _options?: Configuration): Observable<ResponseDataUnitSearchResultVo> {
        return this.searchWithHttpInfo(keyword, linkId, className, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataUnitSearchResultVo>) => apiResponse.data));
    }

    /**
     * fuzzy search unit
     * Search departments or members（it will be abandoned）
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className the highlight style
     */
    public searchSubTeamAndMembersWithHttpInfo(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListOrganizationUnitVo>> {
        const requestContextPromise = this.requestFactory.searchSubTeamAndMembers(keyword, xSpaceId, className, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.searchSubTeamAndMembersWithHttpInfo(rsp)));
            }));
    }

    /**
     * fuzzy search unit
     * Search departments or members（it will be abandoned）
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className the highlight style
     */
    public searchSubTeamAndMembers(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Observable<ResponseDataListOrganizationUnitVo> {
        return this.searchSubTeamAndMembersWithHttpInfo(keyword, xSpaceId, className, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListOrganizationUnitVo>) => apiResponse.data));
    }

    /**
     * fuzzy search department or members
     * Global search
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className the highlight style
     */
    public searchTeamInfoWithHttpInfo(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataSearchResultVo>> {
        const requestContextPromise = this.requestFactory.searchTeamInfo(keyword, xSpaceId, className, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.searchTeamInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * fuzzy search department or members
     * Global search
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className the highlight style
     */
    public searchTeamInfo(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Observable<ResponseDataSearchResultVo> {
        return this.searchTeamInfoWithHttpInfo(keyword, xSpaceId, className, _options).pipe(map((apiResponse: HttpInfo<ResponseDataSearchResultVo>) => apiResponse.data));
    }

    /**
     * scenario field conversion（If the amount of data is large, the content requested by GET will exceed the limit.）
     * accurately query departments and members
     * @param searchUnitRo 
     * @param xSpaceId space id
     */
    public searchUnitInfoVoWithHttpInfo(searchUnitRo: SearchUnitRo, xSpaceId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListUnitInfoVo>> {
        const requestContextPromise = this.requestFactory.searchUnitInfoVo(searchUnitRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.searchUnitInfoVoWithHttpInfo(rsp)));
            }));
    }

    /**
     * scenario field conversion（If the amount of data is large, the content requested by GET will exceed the limit.）
     * accurately query departments and members
     * @param searchUnitRo 
     * @param xSpaceId space id
     */
    public searchUnitInfoVo(searchUnitRo: SearchUnitRo, xSpaceId?: string, _options?: Configuration): Observable<ResponseDataListUnitInfoVo> {
        return this.searchUnitInfoVoWithHttpInfo(searchUnitRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListUnitInfoVo>) => apiResponse.data));
    }

}

import { ContactsRoleApiApiRequestFactory, ContactsRoleApiApiResponseProcessor} from "../apis/ContactsRoleApiApi";
export class ObservableContactsRoleApiApi {
    private requestFactory: ContactsRoleApiApiRequestFactory;
    private responseProcessor: ContactsRoleApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ContactsRoleApiApiRequestFactory,
        responseProcessor?: ContactsRoleApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ContactsRoleApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ContactsRoleApiApiResponseProcessor();
    }

    /**
     * add role members
     * add role members
     * @param addRoleMemberRo 
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public addRoleMembersWithHttpInfo(addRoleMemberRo: AddRoleMemberRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.addRoleMembers(addRoleMemberRo, roleId, xSpaceId, roleId2, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.addRoleMembersWithHttpInfo(rsp)));
            }));
    }

    /**
     * add role members
     * add role members
     * @param addRoleMemberRo 
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public addRoleMembers(addRoleMemberRo: AddRoleMemberRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.addRoleMembersWithHttpInfo(addRoleMemberRo, roleId, xSpaceId, roleId2, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * create new role
     * create new role
     * @param createRoleRo 
     * @param xSpaceId space id
     */
    public createRoleWithHttpInfo(createRoleRo: CreateRoleRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.createRole(createRoleRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createRoleWithHttpInfo(rsp)));
            }));
    }

    /**
     * create new role
     * create new role
     * @param createRoleRo 
     * @param xSpaceId space id
     */
    public createRole(createRoleRo: CreateRoleRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.createRoleWithHttpInfo(createRoleRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * delete role
     * delete role
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public deleteRole1WithHttpInfo(roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.deleteRole1(roleId, xSpaceId, roleId2, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteRole1WithHttpInfo(rsp)));
            }));
    }

    /**
     * delete role
     * delete role
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public deleteRole1(roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.deleteRole1WithHttpInfo(roleId, xSpaceId, roleId2, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
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
    public getRoleMembersWithHttpInfo(roleId: number, page: PageVoid, xSpaceId: string, roleId2: string, pageObjectParams: string, _options?: Configuration): Observable<HttpInfo<ResponseDataPageInfoRoleMemberVo>> {
        const requestContextPromise = this.requestFactory.getRoleMembers(roleId, page, xSpaceId, roleId2, pageObjectParams, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getRoleMembersWithHttpInfo(rsp)));
            }));
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
    public getRoleMembers(roleId: number, page: PageVoid, xSpaceId: string, roleId2: string, pageObjectParams: string, _options?: Configuration): Observable<ResponseDataPageInfoRoleMemberVo> {
        return this.getRoleMembersWithHttpInfo(roleId, page, xSpaceId, roleId2, pageObjectParams, _options).pipe(map((apiResponse: HttpInfo<ResponseDataPageInfoRoleMemberVo>) => apiResponse.data));
    }

    /**
     * query the space\'s roles
     * query roles
     * @param xSpaceId space id
     */
    public getRolesWithHttpInfo(xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListRoleInfoVo>> {
        const requestContextPromise = this.requestFactory.getRoles(xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getRolesWithHttpInfo(rsp)));
            }));
    }

    /**
     * query the space\'s roles
     * query roles
     * @param xSpaceId space id
     */
    public getRoles(xSpaceId: string, _options?: Configuration): Observable<ResponseDataListRoleInfoVo> {
        return this.getRolesWithHttpInfo(xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListRoleInfoVo>) => apiResponse.data));
    }

    /**
     * create init role
     * create init role
     * @param xSpaceId space id
     */
    public initRolesWithHttpInfo(xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.initRoles(xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.initRolesWithHttpInfo(rsp)));
            }));
    }

    /**
     * create init role
     * create init role
     * @param xSpaceId space id
     */
    public initRoles(xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.initRolesWithHttpInfo(xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * remove role members
     * remove role members
     * @param deleteRoleMemberRo 
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public removeRoleMembersWithHttpInfo(deleteRoleMemberRo: DeleteRoleMemberRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.removeRoleMembers(deleteRoleMemberRo, roleId, xSpaceId, roleId2, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.removeRoleMembersWithHttpInfo(rsp)));
            }));
    }

    /**
     * remove role members
     * remove role members
     * @param deleteRoleMemberRo 
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public removeRoleMembers(deleteRoleMemberRo: DeleteRoleMemberRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.removeRoleMembersWithHttpInfo(deleteRoleMemberRo, roleId, xSpaceId, roleId2, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * update role information
     * update role information
     * @param updateRoleRo 
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public updateRoleWithHttpInfo(updateRoleRo: UpdateRoleRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.updateRole(updateRoleRo, roleId, xSpaceId, roleId2, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateRoleWithHttpInfo(rsp)));
            }));
    }

    /**
     * update role information
     * update role information
     * @param updateRoleRo 
     * @param roleId 
     * @param xSpaceId space id
     * @param roleId2 
     */
    public updateRole(updateRoleRo: UpdateRoleRo, roleId: number, xSpaceId: string, roleId2: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.updateRoleWithHttpInfo(updateRoleRo, roleId, xSpaceId, roleId2, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { ContactsTeamApiApiRequestFactory, ContactsTeamApiApiResponseProcessor} from "../apis/ContactsTeamApiApi";
export class ObservableContactsTeamApiApi {
    private requestFactory: ContactsTeamApiApiRequestFactory;
    private responseProcessor: ContactsTeamApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ContactsTeamApiApiRequestFactory,
        responseProcessor?: ContactsTeamApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ContactsTeamApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ContactsTeamApiApiResponseProcessor();
    }

    /**
     * Create team
     * Create team
     * @param createTeamRo 
     * @param xSpaceId space id
     */
    public createTeamWithHttpInfo(createTeamRo: CreateTeamRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.createTeam(createTeamRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createTeamWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create team
     * Create team
     * @param createTeamRo 
     * @param xSpaceId space id
     */
    public createTeam(createTeamRo: CreateTeamRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.createTeamWithHttpInfo(createTeamRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Delete team. If team has members, it can be deleted.
     * Delete team
     * @param teamId team id
     * @param xSpaceId space id
     */
    public deleteTeamWithHttpInfo(teamId: string, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.deleteTeam(teamId, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteTeamWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete team. If team has members, it can be deleted.
     * Delete team
     * @param teamId team id
     * @param xSpaceId space id
     */
    public deleteTeam(teamId: string, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.deleteTeamWithHttpInfo(teamId, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * query sub team by team id. if team id lack, default root team.
     * Query direct sub departments
     * @param xSpaceId space id
     * @param teamId team id
     */
    public getSubTeamsWithHttpInfo(xSpaceId: string, teamId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListTeamTreeVo>> {
        const requestContextPromise = this.requestFactory.getSubTeams(xSpaceId, teamId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSubTeamsWithHttpInfo(rsp)));
            }));
    }

    /**
     * query sub team by team id. if team id lack, default root team.
     * Query direct sub departments
     * @param xSpaceId space id
     * @param teamId team id
     */
    public getSubTeams(xSpaceId: string, teamId?: string, _options?: Configuration): Observable<ResponseDataListTeamTreeVo> {
        return this.getSubTeamsWithHttpInfo(xSpaceId, teamId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListTeamTreeVo>) => apiResponse.data));
    }

    /**
     * team branch. result is tree
     * team branch
     * @param xSpaceId space id
     */
    public getTeamBranchWithHttpInfo(xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListTeamTreeVo>> {
        const requestContextPromise = this.requestFactory.getTeamBranch(xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getTeamBranchWithHttpInfo(rsp)));
            }));
    }

    /**
     * team branch. result is tree
     * team branch
     * @param xSpaceId space id
     */
    public getTeamBranch(xSpaceId: string, _options?: Configuration): Observable<ResponseDataListTeamTreeVo> {
        return this.getTeamBranchWithHttpInfo(xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListTeamTreeVo>) => apiResponse.data));
    }

    /**
     * Query the team\'s members, no include sub team\'s
     * Query the team\'s members
     * @param teamId team id
     * @param xSpaceId space id
     */
    public getTeamMembersWithHttpInfo(teamId: string, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListMemberPageVo>> {
        const requestContextPromise = this.requestFactory.getTeamMembers(teamId, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getTeamMembersWithHttpInfo(rsp)));
            }));
    }

    /**
     * Query the team\'s members, no include sub team\'s
     * Query the team\'s members
     * @param teamId team id
     * @param xSpaceId space id
     */
    public getTeamMembers(teamId: string, xSpaceId: string, _options?: Configuration): Observable<ResponseDataListMemberPageVo> {
        return this.getTeamMembersWithHttpInfo(teamId, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListMemberPageVo>) => apiResponse.data));
    }

    /**
     * Query team tree
     * @param xSpaceId space id
     * @param depth tree depth(default:1,max:2)
     */
    public getTeamTreeWithHttpInfo(xSpaceId: string, depth?: number, _options?: Configuration): Observable<HttpInfo<ResponseDataListTeamTreeVo>> {
        const requestContextPromise = this.requestFactory.getTeamTree(xSpaceId, depth, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getTeamTreeWithHttpInfo(rsp)));
            }));
    }

    /**
     * Query team tree
     * @param xSpaceId space id
     * @param depth tree depth(default:1,max:2)
     */
    public getTeamTree(xSpaceId: string, depth?: number, _options?: Configuration): Observable<ResponseDataListTeamTreeVo> {
        return this.getTeamTreeWithHttpInfo(xSpaceId, depth, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListTeamTreeVo>) => apiResponse.data));
    }

    /**
     * Query department information. if team id lack, default root team
     * Query team information
     * @param xSpaceId space id
     * @param teamId team id
     */
    public readTeamInfoWithHttpInfo(xSpaceId: string, teamId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataTeamInfoVo>> {
        const requestContextPromise = this.requestFactory.readTeamInfo(xSpaceId, teamId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.readTeamInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * Query department information. if team id lack, default root team
     * Query team information
     * @param xSpaceId space id
     * @param teamId team id
     */
    public readTeamInfo(xSpaceId: string, teamId?: string, _options?: Configuration): Observable<ResponseDataTeamInfoVo> {
        return this.readTeamInfoWithHttpInfo(xSpaceId, teamId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataTeamInfoVo>) => apiResponse.data));
    }

    /**
     * Update team info. If modify team level,default sort in the end of parent team.
     * Update team info
     * @param updateTeamRo 
     * @param xSpaceId space id
     */
    public updateTeamWithHttpInfo(updateTeamRo: UpdateTeamRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.updateTeam(updateTeamRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateTeamWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update team info. If modify team level,default sort in the end of parent team.
     * Update team info
     * @param updateTeamRo 
     * @param xSpaceId space id
     */
    public updateTeam(updateTeamRo: UpdateTeamRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.updateTeamWithHttpInfo(updateTeamRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { DeveloperConfigAPIApiRequestFactory, DeveloperConfigAPIApiResponseProcessor} from "../apis/DeveloperConfigAPIApi";
export class ObservableDeveloperConfigAPIApi {
    private requestFactory: DeveloperConfigAPIApiRequestFactory;
    private responseProcessor: DeveloperConfigAPIApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DeveloperConfigAPIApiRequestFactory,
        responseProcessor?: DeveloperConfigAPIApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DeveloperConfigAPIApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DeveloperConfigAPIApiResponseProcessor();
    }

    /**
     * Create developer access tokens to access open platform functionality.
     * Create the developer access token
     */
    public createApiKeyWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataDeveloperInfoVo>> {
        const requestContextPromise = this.requestFactory.createApiKey(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createApiKeyWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create developer access tokens to access open platform functionality.
     * Create the developer access token
     */
    public createApiKey(_options?: Configuration): Observable<ResponseDataDeveloperInfoVo> {
        return this.createApiKeyWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataDeveloperInfoVo>) => apiResponse.data));
    }

    /**
     * Refresh developer access token before verifying phone number.If there is no verification mailbox, skip verification.
     * Refresh the developer access token
     * @param refreshApiKeyRo 
     */
    public refreshApiKeyWithHttpInfo(refreshApiKeyRo: RefreshApiKeyRo, _options?: Configuration): Observable<HttpInfo<ResponseDataDeveloperInfoVo>> {
        const requestContextPromise = this.requestFactory.refreshApiKey(refreshApiKeyRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.refreshApiKeyWithHttpInfo(rsp)));
            }));
    }

    /**
     * Refresh developer access token before verifying phone number.If there is no verification mailbox, skip verification.
     * Refresh the developer access token
     * @param refreshApiKeyRo 
     */
    public refreshApiKey(refreshApiKeyRo: RefreshApiKeyRo, _options?: Configuration): Observable<ResponseDataDeveloperInfoVo> {
        return this.refreshApiKeyWithHttpInfo(refreshApiKeyRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataDeveloperInfoVo>) => apiResponse.data));
    }

    /**
     * Provides a mid-tier validation access token.
     * Verify the access token
     * @param apiKey 
     */
    public validateApiKeyWithHttpInfo(apiKey: string, _options?: Configuration): Observable<HttpInfo<ResponseDataBoolean>> {
        const requestContextPromise = this.requestFactory.validateApiKey(apiKey, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.validateApiKeyWithHttpInfo(rsp)));
            }));
    }

    /**
     * Provides a mid-tier validation access token.
     * Verify the access token
     * @param apiKey 
     */
    public validateApiKey(apiKey: string, _options?: Configuration): Observable<ResponseDataBoolean> {
        return this.validateApiKeyWithHttpInfo(apiKey, _options).pipe(map((apiResponse: HttpInfo<ResponseDataBoolean>) => apiResponse.data));
    }

}

import { InternalServerAssetAPIApiRequestFactory, InternalServerAssetAPIApiResponseProcessor} from "../apis/InternalServerAssetAPIApi";
export class ObservableInternalServerAssetAPIApi {
    private requestFactory: InternalServerAssetAPIApiRequestFactory;
    private responseProcessor: InternalServerAssetAPIApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServerAssetAPIApiRequestFactory,
        responseProcessor?: InternalServerAssetAPIApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new InternalServerAssetAPIApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new InternalServerAssetAPIApiResponseProcessor();
    }

    /**
     * scene：Fusion server query the attachment field data before writing
     * Get Asset Info
     * @param token resource key
     */
    public getWithHttpInfo(token: string, _options?: Configuration): Observable<HttpInfo<ResponseDataAssetUploadResult>> {
        const requestContextPromise = this.requestFactory.get(token, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getWithHttpInfo(rsp)));
            }));
    }

    /**
     * scene：Fusion server query the attachment field data before writing
     * Get Asset Info
     * @param token resource key
     */
    public get(token: string, _options?: Configuration): Observable<ResponseDataAssetUploadResult> {
        return this.getWithHttpInfo(token, _options).pipe(map((apiResponse: HttpInfo<ResponseDataAssetUploadResult>) => apiResponse.data));
    }

    /**
     * Batch get asset signature url
     * @param resourceKeys 
     */
    public getSignatureUrls1WithHttpInfo(resourceKeys: Array<string>, _options?: Configuration): Observable<HttpInfo<ResponseDataListAssetUrlSignatureVo>> {
        const requestContextPromise = this.requestFactory.getSignatureUrls1(resourceKeys, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSignatureUrls1WithHttpInfo(rsp)));
            }));
    }

    /**
     * Batch get asset signature url
     * @param resourceKeys 
     */
    public getSignatureUrls1(resourceKeys: Array<string>, _options?: Configuration): Observable<ResponseDataListAssetUrlSignatureVo> {
        return this.getSignatureUrls1WithHttpInfo(resourceKeys, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListAssetUrlSignatureVo>) => apiResponse.data));
    }

    /**
     * Get Upload PreSigned URL
     * @param nodeId node custom id
     * @param count number to create (default 1, max 20)
     */
    public getSpaceCapacity1WithHttpInfo(nodeId: string, count?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListAssetUploadCertificateVO>> {
        const requestContextPromise = this.requestFactory.getSpaceCapacity1(nodeId, count, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSpaceCapacity1WithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Upload PreSigned URL
     * @param nodeId node custom id
     * @param count number to create (default 1, max 20)
     */
    public getSpaceCapacity1(nodeId: string, count?: string, _options?: Configuration): Observable<ResponseDataListAssetUploadCertificateVO> {
        return this.getSpaceCapacity1WithHttpInfo(nodeId, count, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListAssetUploadCertificateVO>) => apiResponse.data));
    }

}

import { InternalServerOrgAPIApiRequestFactory, InternalServerOrgAPIApiResponseProcessor} from "../apis/InternalServerOrgAPIApi";
export class ObservableInternalServerOrgAPIApi {
    private requestFactory: InternalServerOrgAPIApiRequestFactory;
    private responseProcessor: InternalServerOrgAPIApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServerOrgAPIApiRequestFactory,
        responseProcessor?: InternalServerOrgAPIApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new InternalServerOrgAPIApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new InternalServerOrgAPIApiResponseProcessor();
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
    public loadOrSearch1WithHttpInfo(params: LoadSearchDTO, xSpaceId?: string, userId?: string, keyword?: string, unitIds?: string, filterIds?: string, all?: boolean, searchEmail?: boolean, _options?: Configuration): Observable<HttpInfo<ResponseDataListUnitInfoVo>> {
        const requestContextPromise = this.requestFactory.loadOrSearch1(params, xSpaceId, userId, keyword, unitIds, filterIds, all, searchEmail, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.loadOrSearch1WithHttpInfo(rsp)));
            }));
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
    public loadOrSearch1(params: LoadSearchDTO, xSpaceId?: string, userId?: string, keyword?: string, unitIds?: string, filterIds?: string, all?: boolean, searchEmail?: boolean, _options?: Configuration): Observable<ResponseDataListUnitInfoVo> {
        return this.loadOrSearch1WithHttpInfo(params, xSpaceId, userId, keyword, unitIds, filterIds, all, searchEmail, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListUnitInfoVo>) => apiResponse.data));
    }

}

import { InternalServiceDataTableFieldPermissionInterfaceApiRequestFactory, InternalServiceDataTableFieldPermissionInterfaceApiResponseProcessor} from "../apis/InternalServiceDataTableFieldPermissionInterfaceApi";
export class ObservableInternalServiceDataTableFieldPermissionInterfaceApi {
    private requestFactory: InternalServiceDataTableFieldPermissionInterfaceApiRequestFactory;
    private responseProcessor: InternalServiceDataTableFieldPermissionInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceDataTableFieldPermissionInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceDataTableFieldPermissionInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new InternalServiceDataTableFieldPermissionInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new InternalServiceDataTableFieldPermissionInterfaceApiResponseProcessor();
    }

    /**
     * room layer ot delete field operation call
     * turn off multiple field permissions
     * @param dstId table id
     * @param fieldIds list of field ids
     */
    public disableRolesWithHttpInfo(dstId: string, fieldIds: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.disableRoles(dstId, fieldIds, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.disableRolesWithHttpInfo(rsp)));
            }));
    }

    /**
     * room layer ot delete field operation call
     * turn off multiple field permissions
     * @param dstId table id
     * @param fieldIds list of field ids
     */
    public disableRoles(dstId: string, fieldIds: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.disableRolesWithHttpInfo(dstId, fieldIds, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * get field permissions
     * @param nodeId node id
     * @param userId user id
     * @param shareId share id
     */
    public getFieldPermissionWithHttpInfo(nodeId: string, userId: string, shareId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataFieldPermissionView>> {
        const requestContextPromise = this.requestFactory.getFieldPermission(nodeId, userId, shareId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getFieldPermissionWithHttpInfo(rsp)));
            }));
    }

    /**
     * get field permissions
     * @param nodeId node id
     * @param userId user id
     * @param shareId share id
     */
    public getFieldPermission(nodeId: string, userId: string, shareId?: string, _options?: Configuration): Observable<ResponseDataFieldPermissionView> {
        return this.getFieldPermissionWithHttpInfo(nodeId, userId, shareId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataFieldPermissionView>) => apiResponse.data));
    }

    /**
     * get field permission set for multiple nodes
     * @param internalPermissionRo 
     */
    public getMultiFieldPermissionViewsWithHttpInfo(internalPermissionRo: InternalPermissionRo, _options?: Configuration): Observable<HttpInfo<ResponseDataListFieldPermissionView>> {
        const requestContextPromise = this.requestFactory.getMultiFieldPermissionViews(internalPermissionRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getMultiFieldPermissionViewsWithHttpInfo(rsp)));
            }));
    }

    /**
     * get field permission set for multiple nodes
     * @param internalPermissionRo 
     */
    public getMultiFieldPermissionViews(internalPermissionRo: InternalPermissionRo, _options?: Configuration): Observable<ResponseDataListFieldPermissionView> {
        return this.getMultiFieldPermissionViewsWithHttpInfo(internalPermissionRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListFieldPermissionView>) => apiResponse.data));
    }

}

import { InternalServiceFieldServiceInterfaceApiRequestFactory, InternalServiceFieldServiceInterfaceApiResponseProcessor} from "../apis/InternalServiceFieldServiceInterfaceApi";
export class ObservableInternalServiceFieldServiceInterfaceApi {
    private requestFactory: InternalServiceFieldServiceInterfaceApiRequestFactory;
    private responseProcessor: InternalServiceFieldServiceInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceFieldServiceInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceFieldServiceInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new InternalServiceFieldServiceInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new InternalServiceFieldServiceInterfaceApiResponseProcessor();
    }

    /**
     * get url related information
     * get url related information
     * @param urlsWrapperRo 
     */
    public urlContentsAwareFillWithHttpInfo(urlsWrapperRo: UrlsWrapperRo, _options?: Configuration): Observable<HttpInfo<ResponseDataUrlAwareContentsVo>> {
        const requestContextPromise = this.requestFactory.urlContentsAwareFill(urlsWrapperRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.urlContentsAwareFillWithHttpInfo(rsp)));
            }));
    }

    /**
     * get url related information
     * get url related information
     * @param urlsWrapperRo 
     */
    public urlContentsAwareFill(urlsWrapperRo: UrlsWrapperRo, _options?: Configuration): Observable<ResponseDataUrlAwareContentsVo> {
        return this.urlContentsAwareFillWithHttpInfo(urlsWrapperRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataUrlAwareContentsVo>) => apiResponse.data));
    }

}

import { InternalServiceNodeInterfaceApiRequestFactory, InternalServiceNodeInterfaceApiResponseProcessor} from "../apis/InternalServiceNodeInterfaceApi";
export class ObservableInternalServiceNodeInterfaceApi {
    private requestFactory: InternalServiceNodeInterfaceApiRequestFactory;
    private responseProcessor: InternalServiceNodeInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceNodeInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceNodeInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new InternalServiceNodeInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new InternalServiceNodeInterfaceApiResponseProcessor();
    }

    /**
     * create a table node
     * create a table node
     * @param createDatasheetRo 
     * @param spaceId 
     */
    public createDatasheetWithHttpInfo(createDatasheetRo: CreateDatasheetRo, spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataCreateDatasheetVo>> {
        const requestContextPromise = this.requestFactory.createDatasheet(createDatasheetRo, spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createDatasheetWithHttpInfo(rsp)));
            }));
    }

    /**
     * create a table node
     * create a table node
     * @param createDatasheetRo 
     * @param spaceId 
     */
    public createDatasheet(createDatasheetRo: CreateDatasheetRo, spaceId: string, _options?: Configuration): Observable<ResponseDataCreateDatasheetVo> {
        return this.createDatasheetWithHttpInfo(createDatasheetRo, spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataCreateDatasheetVo>) => apiResponse.data));
    }

    /**
     * delete node
     * delete node
     * @param spaceId 
     * @param nodeId 
     */
    public deleteNodeWithHttpInfo(spaceId: string, nodeId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.deleteNode(spaceId, nodeId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteNodeWithHttpInfo(rsp)));
            }));
    }

    /**
     * delete node
     * delete node
     * @param spaceId 
     * @param nodeId 
     */
    public deleteNode(spaceId: string, nodeId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.deleteNodeWithHttpInfo(spaceId, nodeId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * scenario: query an existing read-only dashboard
     * Get filter nodes by type, permissions and node name.
     * @param spaceId 
     * @param type 
     * @param nodePermissions 
     * @param keyword 
     */
    public filterWithHttpInfo(spaceId: string, type: number, nodePermissions?: Array<number>, keyword?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListNodeInfo>> {
        const requestContextPromise = this.requestFactory.filter(spaceId, type, nodePermissions, keyword, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.filterWithHttpInfo(rsp)));
            }));
    }

    /**
     * scenario: query an existing read-only dashboard
     * Get filter nodes by type, permissions and node name.
     * @param spaceId 
     * @param type 
     * @param nodePermissions 
     * @param keyword 
     */
    public filter(spaceId: string, type: number, nodePermissions?: Array<number>, keyword?: string, _options?: Configuration): Observable<ResponseDataListNodeInfo> {
        return this.filterWithHttpInfo(spaceId, type, nodePermissions, keyword, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNodeInfo>) => apiResponse.data));
    }

}

import { InternalServiceNodePermissionInterfaceApiRequestFactory, InternalServiceNodePermissionInterfaceApiResponseProcessor} from "../apis/InternalServiceNodePermissionInterfaceApi";
export class ObservableInternalServiceNodePermissionInterfaceApi {
    private requestFactory: InternalServiceNodePermissionInterfaceApiRequestFactory;
    private responseProcessor: InternalServiceNodePermissionInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceNodePermissionInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceNodePermissionInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new InternalServiceNodePermissionInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new InternalServiceNodePermissionInterfaceApiResponseProcessor();
    }

    /**
     * Get permission set for multiple nodes
     * @param internalPermissionRo 
     */
    public getMultiNodePermissionsWithHttpInfo(internalPermissionRo: InternalPermissionRo, _options?: Configuration): Observable<HttpInfo<ResponseDataListDatasheetPermissionView>> {
        const requestContextPromise = this.requestFactory.getMultiNodePermissions(internalPermissionRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getMultiNodePermissionsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get permission set for multiple nodes
     * @param internalPermissionRo 
     */
    public getMultiNodePermissions(internalPermissionRo: InternalPermissionRo, _options?: Configuration): Observable<ResponseDataListDatasheetPermissionView> {
        return this.getMultiNodePermissionsWithHttpInfo(internalPermissionRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListDatasheetPermissionView>) => apiResponse.data));
    }

    /**
     * Get Node permission
     * @param nodeId Node ID
     * @param shareId Share ID
     */
    public getNodePermissionWithHttpInfo(nodeId: string, shareId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataDatasheetPermissionView>> {
        const requestContextPromise = this.requestFactory.getNodePermission(nodeId, shareId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getNodePermissionWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Node permission
     * @param nodeId Node ID
     * @param shareId Share ID
     */
    public getNodePermission(nodeId: string, shareId?: string, _options?: Configuration): Observable<ResponseDataDatasheetPermissionView> {
        return this.getNodePermissionWithHttpInfo(nodeId, shareId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataDatasheetPermissionView>) => apiResponse.data));
    }

}

import { InternalServiceNotificationInterfaceApiRequestFactory, InternalServiceNotificationInterfaceApiResponseProcessor} from "../apis/InternalServiceNotificationInterfaceApi";
export class ObservableInternalServiceNotificationInterfaceApi {
    private requestFactory: InternalServiceNotificationInterfaceApiRequestFactory;
    private responseProcessor: InternalServiceNotificationInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceNotificationInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceNotificationInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new InternalServiceNotificationInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new InternalServiceNotificationInterfaceApiResponseProcessor();
    }

    /**
     * send a message
     * send a message
     * @param notificationCreateRo 
     */
    public create4WithHttpInfo(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.create4(notificationCreateRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.create4WithHttpInfo(rsp)));
            }));
    }

    /**
     * send a message
     * send a message
     * @param notificationCreateRo 
     */
    public create4(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.create4WithHttpInfo(notificationCreateRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { InternalServiceSpaceInterfaceApiRequestFactory, InternalServiceSpaceInterfaceApiResponseProcessor} from "../apis/InternalServiceSpaceInterfaceApi";
export class ObservableInternalServiceSpaceInterfaceApi {
    private requestFactory: InternalServiceSpaceInterfaceApiRequestFactory;
    private responseProcessor: InternalServiceSpaceInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceSpaceInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceSpaceInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new InternalServiceSpaceInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new InternalServiceSpaceInterfaceApiResponseProcessor();
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API aps information in the subscription plan corresponding to the space.
     * get api qps information of a specified space
     * @param spaceId 
     */
    public apiRateLimitWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataInternalSpaceApiRateLimitVo>> {
        const requestContextPromise = this.requestFactory.apiRateLimit(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiRateLimitWithHttpInfo(rsp)));
            }));
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API aps information in the subscription plan corresponding to the space.
     * get api qps information of a specified space
     * @param spaceId 
     */
    public apiRateLimit(spaceId: string, _options?: Configuration): Observable<ResponseDataInternalSpaceApiRateLimitVo> {
        return this.apiRateLimitWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataInternalSpaceApiRateLimitVo>) => apiResponse.data));
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API usage information in the subscription plan corresponding to the space.
     * get api usage information of a specified space
     * @param spaceId 
     */
    public apiUsagesWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataInternalSpaceApiUsageVo>> {
        const requestContextPromise = this.requestFactory.apiUsages(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiUsagesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Provides the authentication function of the middle layer request, and queries the API usage information in the subscription plan corresponding to the space.
     * get api usage information of a specified space
     * @param spaceId 
     */
    public apiUsages(spaceId: string, _options?: Configuration): Observable<ResponseDataInternalSpaceApiUsageVo> {
        return this.apiUsagesWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataInternalSpaceApiUsageVo>) => apiResponse.data));
    }

    /**
     * get space automation run message
     * @param spaceId space id
     */
    public getAutomationRunMessageWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataInternalSpaceAutomationRunMessageV0>> {
        const requestContextPromise = this.requestFactory.getAutomationRunMessage(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getAutomationRunMessageWithHttpInfo(rsp)));
            }));
    }

    /**
     * get space automation run message
     * @param spaceId space id
     */
    public getAutomationRunMessage(spaceId: string, _options?: Configuration): Observable<ResponseDataInternalSpaceAutomationRunMessageV0> {
        return this.getAutomationRunMessageWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataInternalSpaceAutomationRunMessageV0>) => apiResponse.data));
    }

    /**
     * get space credit used usage
     * @param spaceId space id
     */
    public getCreditUsages1WithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataInternalCreditUsageVo>> {
        const requestContextPromise = this.requestFactory.getCreditUsages1(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getCreditUsages1WithHttpInfo(rsp)));
            }));
    }

    /**
     * get space credit used usage
     * @param spaceId space id
     */
    public getCreditUsages1(spaceId: string, _options?: Configuration): Observable<ResponseDataInternalCreditUsageVo> {
        return this.getCreditUsages1WithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataInternalCreditUsageVo>) => apiResponse.data));
    }

    /**
     * get attachment capacity information for a space
     * @param spaceId space id
     */
    public getSpaceCapacityWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataInternalSpaceCapacityVo>> {
        const requestContextPromise = this.requestFactory.getSpaceCapacity(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSpaceCapacityWithHttpInfo(rsp)));
            }));
    }

    /**
     * get attachment capacity information for a space
     * @param spaceId space id
     */
    public getSpaceCapacity(spaceId: string, _options?: Configuration): Observable<ResponseDataInternalSpaceCapacityVo> {
        return this.getSpaceCapacityWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataInternalSpaceCapacityVo>) => apiResponse.data));
    }

    /**
     * get subscription information for a space
     * @param spaceId space id
     */
    public getSpaceSubscriptionWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataInternalSpaceSubscriptionVo>> {
        const requestContextPromise = this.requestFactory.getSpaceSubscription(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSpaceSubscriptionWithHttpInfo(rsp)));
            }));
    }

    /**
     * get subscription information for a space
     * @param spaceId space id
     */
    public getSpaceSubscription(spaceId: string, _options?: Configuration): Observable<ResponseDataInternalSpaceSubscriptionVo> {
        return this.getSpaceSubscriptionWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataInternalSpaceSubscriptionVo>) => apiResponse.data));
    }

    /**
     * get space used usage information
     * @param spaceId space id
     */
    public getSpaceUsagesWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataInternalSpaceUsageVo>> {
        const requestContextPromise = this.requestFactory.getSpaceUsages(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSpaceUsagesWithHttpInfo(rsp)));
            }));
    }

    /**
     * get space used usage information
     * @param spaceId space id
     */
    public getSpaceUsages(spaceId: string, _options?: Configuration): Observable<ResponseDataInternalSpaceUsageVo> {
        return this.getSpaceUsagesWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataInternalSpaceUsageVo>) => apiResponse.data));
    }

    /**
     * get space information
     * @param spaceId 
     */
    public labsWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataInternalSpaceInfoVo>> {
        const requestContextPromise = this.requestFactory.labs(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.labsWithHttpInfo(rsp)));
            }));
    }

    /**
     * get space information
     * @param spaceId 
     */
    public labs(spaceId: string, _options?: Configuration): Observable<ResponseDataInternalSpaceInfoVo> {
        return this.labsWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataInternalSpaceInfoVo>) => apiResponse.data));
    }

    /**
     * get space information
     * @param spaceStatisticsRo 
     * @param spaceId 
     */
    public statisticsWithHttpInfo(spaceStatisticsRo: SpaceStatisticsRo, spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.statistics(spaceStatisticsRo, spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.statisticsWithHttpInfo(rsp)));
            }));
    }

    /**
     * get space information
     * @param spaceStatisticsRo 
     * @param spaceId 
     */
    public statistics(spaceStatisticsRo: SpaceStatisticsRo, spaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.statisticsWithHttpInfo(spaceStatisticsRo, spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { InternalServiceUserInterfaceApiRequestFactory, InternalServiceUserInterfaceApiResponseProcessor} from "../apis/InternalServiceUserInterfaceApi";
export class ObservableInternalServiceUserInterfaceApi {
    private requestFactory: InternalServiceUserInterfaceApiRequestFactory;
    private responseProcessor: InternalServiceUserInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: InternalServiceUserInterfaceApiRequestFactory,
        responseProcessor?: InternalServiceUserInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new InternalServiceUserInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new InternalServiceUserInterfaceApiResponseProcessor();
    }

    /**
     * Close and log off the cooling-off period user account
     * Close and log off the cooling-off period user account
     * @param userId 
     */
    public closePausedUserAccountWithHttpInfo(userId: number, _options?: Configuration): Observable<HttpInfo<ResponseDataBoolean>> {
        const requestContextPromise = this.requestFactory.closePausedUserAccount(userId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.closePausedUserAccountWithHttpInfo(rsp)));
            }));
    }

    /**
     * Close and log off the cooling-off period user account
     * Close and log off the cooling-off period user account
     * @param userId 
     */
    public closePausedUserAccount(userId: number, _options?: Configuration): Observable<ResponseDataBoolean> {
        return this.closePausedUserAccountWithHttpInfo(userId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataBoolean>) => apiResponse.data));
    }

    /**
     * get cooling off users
     * get cooling off users
     */
    public getPausedUsersWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataListUserInPausedDto>> {
        const requestContextPromise = this.requestFactory.getPausedUsers(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getPausedUsersWithHttpInfo(rsp)));
            }));
    }

    /**
     * get cooling off users
     * get cooling off users
     */
    public getPausedUsers(_options?: Configuration): Observable<ResponseDataListUserInPausedDto> {
        return this.getPausedUsersWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataListUserInPausedDto>) => apiResponse.data));
    }

    /**
     * get the cooling-off period user operation record
     * get the cooling-off period user operation record
     * @param pausedUserHistoryRo 
     */
    public getUserHistoriesWithHttpInfo(pausedUserHistoryRo: PausedUserHistoryRo, _options?: Configuration): Observable<HttpInfo<ResponseDataListPausedUserHistoryDto>> {
        const requestContextPromise = this.requestFactory.getUserHistories(pausedUserHistoryRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getUserHistoriesWithHttpInfo(rsp)));
            }));
    }

    /**
     * get the cooling-off period user operation record
     * get the cooling-off period user operation record
     * @param pausedUserHistoryRo 
     */
    public getUserHistories(pausedUserHistoryRo: PausedUserHistoryRo, _options?: Configuration): Observable<ResponseDataListPausedUserHistoryDto> {
        return this.getUserHistoriesWithHttpInfo(pausedUserHistoryRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListPausedUserHistoryDto>) => apiResponse.data));
    }

    /**
     * get the necessary information
     * check whether logged in
     */
    public meSessionWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataBoolean>> {
        const requestContextPromise = this.requestFactory.meSession(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.meSessionWithHttpInfo(rsp)));
            }));
    }

    /**
     * get the necessary information
     * check whether logged in
     */
    public meSession(_options?: Configuration): Observable<ResponseDataBoolean> {
        return this.meSessionWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataBoolean>) => apiResponse.data));
    }

    /**
     * get the necessary information
     * get the necessary information
     */
    public userBaseInfoWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataUserBaseInfoVo>> {
        const requestContextPromise = this.requestFactory.userBaseInfo(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.userBaseInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * get the necessary information
     * get the necessary information
     */
    public userBaseInfo(_options?: Configuration): Observable<ResponseDataUserBaseInfoVo> {
        return this.userBaseInfoWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataUserBaseInfoVo>) => apiResponse.data));
    }

}

import { LaboratoryModuleExperimentalFunctionInterfaceApiRequestFactory, LaboratoryModuleExperimentalFunctionInterfaceApiResponseProcessor} from "../apis/LaboratoryModuleExperimentalFunctionInterfaceApi";
export class ObservableLaboratoryModuleExperimentalFunctionInterfaceApi {
    private requestFactory: LaboratoryModuleExperimentalFunctionInterfaceApiRequestFactory;
    private responseProcessor: LaboratoryModuleExperimentalFunctionInterfaceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: LaboratoryModuleExperimentalFunctionInterfaceApiRequestFactory,
        responseProcessor?: LaboratoryModuleExperimentalFunctionInterfaceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new LaboratoryModuleExperimentalFunctionInterfaceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new LaboratoryModuleExperimentalFunctionInterfaceApiResponseProcessor();
    }

    /**
     * Get Lab Function List
     */
    public showAvailableLabsFeaturesWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataUserSpaceLabsFeatureVo>> {
        const requestContextPromise = this.requestFactory.showAvailableLabsFeatures(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.showAvailableLabsFeaturesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Lab Function List
     */
    public showAvailableLabsFeatures(_options?: Configuration): Observable<ResponseDataUserSpaceLabsFeatureVo> {
        return this.showAvailableLabsFeaturesWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataUserSpaceLabsFeatureVo>) => apiResponse.data));
    }

}

import { PlayerSystemActivityAPIApiRequestFactory, PlayerSystemActivityAPIApiResponseProcessor} from "../apis/PlayerSystemActivityAPIApi";
export class ObservablePlayerSystemActivityAPIApi {
    private requestFactory: PlayerSystemActivityAPIApiRequestFactory;
    private responseProcessor: PlayerSystemActivityAPIApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: PlayerSystemActivityAPIApiRequestFactory,
        responseProcessor?: PlayerSystemActivityAPIApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new PlayerSystemActivityAPIApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new PlayerSystemActivityAPIApiResponseProcessor();
    }

    /**
     * Scene: After triggering the guided click event, modify the state or the cumulative number of times.
     * Trigger Wizard
     * @param activityStatusRo 
     */
    public triggerWizardWithHttpInfo(activityStatusRo: ActivityStatusRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.triggerWizard(activityStatusRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.triggerWizardWithHttpInfo(rsp)));
            }));
    }

    /**
     * Scene: After triggering the guided click event, modify the state or the cumulative number of times.
     * Trigger Wizard
     * @param activityStatusRo 
     */
    public triggerWizard(activityStatusRo: ActivityStatusRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.triggerWizardWithHttpInfo(activityStatusRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { PlayerSystemNotificationAPIApiRequestFactory, PlayerSystemNotificationAPIApiResponseProcessor} from "../apis/PlayerSystemNotificationAPIApi";
export class ObservablePlayerSystemNotificationAPIApi {
    private requestFactory: PlayerSystemNotificationAPIApiRequestFactory;
    private responseProcessor: PlayerSystemNotificationAPIApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: PlayerSystemNotificationAPIApiRequestFactory,
        responseProcessor?: PlayerSystemNotificationAPIApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new PlayerSystemNotificationAPIApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new PlayerSystemNotificationAPIApiResponseProcessor();
    }

    /**
     * Create Notification
     * @param notificationCreateRo 
     */
    public create2WithHttpInfo(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.create2(notificationCreateRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.create2WithHttpInfo(rsp)));
            }));
    }

    /**
     * Create Notification
     * @param notificationCreateRo 
     */
    public create2(notificationCreateRo: Array<NotificationCreateRo>, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.create2WithHttpInfo(notificationCreateRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Delete Notification
     * @param notificationReadRo 
     */
    public delete4WithHttpInfo(notificationReadRo: NotificationReadRo, _options?: Configuration): Observable<HttpInfo<ResponseDataBoolean>> {
        const requestContextPromise = this.requestFactory.delete4(notificationReadRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.delete4WithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete Notification
     * @param notificationReadRo 
     */
    public delete4(notificationReadRo: NotificationReadRo, _options?: Configuration): Observable<ResponseDataBoolean> {
        return this.delete4WithHttpInfo(notificationReadRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataBoolean>) => apiResponse.data));
    }

    /**
     * Default: System Notification
     * Get Notification Detail List
     * @param notificationListRo 
     */
    public list2WithHttpInfo(notificationListRo: NotificationListRo, _options?: Configuration): Observable<HttpInfo<ResponseDataListNotificationDetailVo>> {
        const requestContextPromise = this.requestFactory.list2(notificationListRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.list2WithHttpInfo(rsp)));
            }));
    }

    /**
     * Default: System Notification
     * Get Notification Detail List
     * @param notificationListRo 
     */
    public list2(notificationListRo: NotificationListRo, _options?: Configuration): Observable<ResponseDataListNotificationDetailVo> {
        return this.list2WithHttpInfo(notificationListRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNotificationDetailVo>) => apiResponse.data));
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Get Notification Page Info
     * @param notificationPageRo 
     */
    public pageWithHttpInfo(notificationPageRo: NotificationPageRo, _options?: Configuration): Observable<HttpInfo<ResponseDataListNotificationDetailVo>> {
        const requestContextPromise = this.requestFactory.page(notificationPageRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.pageWithHttpInfo(rsp)));
            }));
    }

    /**
     * Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Get Notification Page Info
     * @param notificationPageRo 
     */
    public page(notificationPageRo: NotificationPageRo, _options?: Configuration): Observable<ResponseDataListNotificationDetailVo> {
        return this.pageWithHttpInfo(notificationPageRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNotificationDetailVo>) => apiResponse.data));
    }

    /**
     * Mark Notification Read
     * @param notificationReadRo 
     */
    public readWithHttpInfo(notificationReadRo: NotificationReadRo, _options?: Configuration): Observable<HttpInfo<ResponseDataBoolean>> {
        const requestContextPromise = this.requestFactory.read(notificationReadRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.readWithHttpInfo(rsp)));
            }));
    }

    /**
     * Mark Notification Read
     * @param notificationReadRo 
     */
    public read(notificationReadRo: NotificationReadRo, _options?: Configuration): Observable<ResponseDataBoolean> {
        return this.readWithHttpInfo(notificationReadRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataBoolean>) => apiResponse.data));
    }

    /**
     * Get Notification\' Statistics
     */
    public statistics1WithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataNotificationStatisticsVo>> {
        const requestContextPromise = this.requestFactory.statistics1(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.statistics1WithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Notification\' Statistics
     */
    public statistics1(_options?: Configuration): Observable<ResponseDataNotificationStatisticsVo> {
        return this.statistics1WithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataNotificationStatisticsVo>) => apiResponse.data));
    }

}

import { SpaceApplyJoiningSpaceApiApiRequestFactory, SpaceApplyJoiningSpaceApiApiResponseProcessor} from "../apis/SpaceApplyJoiningSpaceApiApi";
export class ObservableSpaceApplyJoiningSpaceApiApi {
    private requestFactory: SpaceApplyJoiningSpaceApiApiRequestFactory;
    private responseProcessor: SpaceApplyJoiningSpaceApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: SpaceApplyJoiningSpaceApiApiRequestFactory,
        responseProcessor?: SpaceApplyJoiningSpaceApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new SpaceApplyJoiningSpaceApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new SpaceApplyJoiningSpaceApiApiResponseProcessor();
    }

    /**
     * Applying to join the space
     * @param spaceJoinApplyRo 
     */
    public applyWithHttpInfo(spaceJoinApplyRo: SpaceJoinApplyRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.apply(spaceJoinApplyRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.applyWithHttpInfo(rsp)));
            }));
    }

    /**
     * Applying to join the space
     * @param spaceJoinApplyRo 
     */
    public apply(spaceJoinApplyRo: SpaceJoinApplyRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.applyWithHttpInfo(spaceJoinApplyRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Process joining application
     * @param spaceJoinProcessRo 
     */
    public processWithHttpInfo(spaceJoinProcessRo: SpaceJoinProcessRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.process(spaceJoinProcessRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.processWithHttpInfo(rsp)));
            }));
    }

    /**
     * Process joining application
     * @param spaceJoinProcessRo 
     */
    public process(spaceJoinProcessRo: SpaceJoinProcessRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.processWithHttpInfo(spaceJoinProcessRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { SpaceInviteLinkApiApiRequestFactory, SpaceInviteLinkApiApiResponseProcessor} from "../apis/SpaceInviteLinkApiApi";
export class ObservableSpaceInviteLinkApiApi {
    private requestFactory: SpaceInviteLinkApiApiRequestFactory;
    private responseProcessor: SpaceInviteLinkApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: SpaceInviteLinkApiApiRequestFactory,
        responseProcessor?: SpaceInviteLinkApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new SpaceInviteLinkApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new SpaceInviteLinkApiApiResponseProcessor();
    }

    /**
     * Delete link
     * @param spaceLinkOpRo 
     * @param xSpaceId space id
     */
    public delete6WithHttpInfo(spaceLinkOpRo: SpaceLinkOpRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.delete6(spaceLinkOpRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.delete6WithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete link
     * @param spaceLinkOpRo 
     * @param xSpaceId space id
     */
    public delete6(spaceLinkOpRo: SpaceLinkOpRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.delete6WithHttpInfo(spaceLinkOpRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * return token，the front end stitching $DOMAIN/invite/link?token=:token
     * Generate or refresh link
     * @param spaceLinkOpRo 
     * @param xSpaceId space id
     */
    public generateWithHttpInfo(spaceLinkOpRo: SpaceLinkOpRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataString>> {
        const requestContextPromise = this.requestFactory.generate(spaceLinkOpRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.generateWithHttpInfo(rsp)));
            }));
    }

    /**
     * return token，the front end stitching $DOMAIN/invite/link?token=:token
     * Generate or refresh link
     * @param spaceLinkOpRo 
     * @param xSpaceId space id
     */
    public generate(spaceLinkOpRo: SpaceLinkOpRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataString> {
        return this.generateWithHttpInfo(spaceLinkOpRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataString>) => apiResponse.data));
    }

    /**
     * If return code status 201,the user redirects to the login page due to unauthorized.
     * Join the space using the public link
     * @param inviteValidRo 
     */
    public joinWithHttpInfo(inviteValidRo: InviteValidRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.join(inviteValidRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.joinWithHttpInfo(rsp)));
            }));
    }

    /**
     * If return code status 201,the user redirects to the login page due to unauthorized.
     * Join the space using the public link
     * @param inviteValidRo 
     */
    public join(inviteValidRo: InviteValidRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.joinWithHttpInfo(inviteValidRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Get a list of links
     * @param xSpaceId space id
     */
    public list1WithHttpInfo(xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListSpaceLinkVo>> {
        const requestContextPromise = this.requestFactory.list1(xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.list1WithHttpInfo(rsp)));
            }));
    }

    /**
     * Get a list of links
     * @param xSpaceId space id
     */
    public list1(xSpaceId: string, _options?: Configuration): Observable<ResponseDataListSpaceLinkVo> {
        return this.list1WithHttpInfo(xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListSpaceLinkVo>) => apiResponse.data));
    }

    /**
     * After the verification is successful, it can obtain related invitation information
     * Valid invite link token
     * @param inviteValidRo 
     */
    public validWithHttpInfo(inviteValidRo: InviteValidRo, _options?: Configuration): Observable<HttpInfo<ResponseDataSpaceLinkInfoVo>> {
        const requestContextPromise = this.requestFactory.valid(inviteValidRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.validWithHttpInfo(rsp)));
            }));
    }

    /**
     * After the verification is successful, it can obtain related invitation information
     * Valid invite link token
     * @param inviteValidRo 
     */
    public valid(inviteValidRo: InviteValidRo, _options?: Configuration): Observable<ResponseDataSpaceLinkInfoVo> {
        return this.validWithHttpInfo(inviteValidRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataSpaceLinkInfoVo>) => apiResponse.data));
    }

}

import { SpaceMainAdminApiApiRequestFactory, SpaceMainAdminApiApiResponseProcessor} from "../apis/SpaceMainAdminApiApi";
export class ObservableSpaceMainAdminApiApi {
    private requestFactory: SpaceMainAdminApiApiRequestFactory;
    private responseProcessor: SpaceMainAdminApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: SpaceMainAdminApiApiRequestFactory,
        responseProcessor?: SpaceMainAdminApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new SpaceMainAdminApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new SpaceMainAdminApiApiResponseProcessor();
    }

    /**
     * Get main admin info
     * @param xSpaceId space id
     */
    public getMainAdminInfoWithHttpInfo(xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataMainAdminInfoVo>> {
        const requestContextPromise = this.requestFactory.getMainAdminInfo(xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getMainAdminInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get main admin info
     * @param xSpaceId space id
     */
    public getMainAdminInfo(xSpaceId: string, _options?: Configuration): Observable<ResponseDataMainAdminInfoVo> {
        return this.getMainAdminInfoWithHttpInfo(xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataMainAdminInfoVo>) => apiResponse.data));
    }

    /**
     * Change main admin
     * @param spaceMainAdminChangeOpRo 
     * @param xSpaceId space id
     */
    public replaceWithHttpInfo(spaceMainAdminChangeOpRo: SpaceMainAdminChangeOpRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.replace(spaceMainAdminChangeOpRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.replaceWithHttpInfo(rsp)));
            }));
    }

    /**
     * Change main admin
     * @param spaceMainAdminChangeOpRo 
     * @param xSpaceId space id
     */
    public replace(spaceMainAdminChangeOpRo: SpaceMainAdminChangeOpRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.replaceWithHttpInfo(spaceMainAdminChangeOpRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { SpaceSpaceApiApiRequestFactory, SpaceSpaceApiApiResponseProcessor} from "../apis/SpaceSpaceApiApi";
export class ObservableSpaceSpaceApiApi {
    private requestFactory: SpaceSpaceApiApiRequestFactory;
    private responseProcessor: SpaceSpaceApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: SpaceSpaceApiApiRequestFactory,
        responseProcessor?: SpaceSpaceApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new SpaceSpaceApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new SpaceSpaceApiApiResponseProcessor();
    }

    /**
     * Undo delete space
     * @param spaceId space id
     */
    public cancelWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.cancel(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.cancelWithHttpInfo(rsp)));
            }));
    }

    /**
     * Undo delete space
     * @param spaceId space id
     */
    public cancel(spaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.cancelWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Get space capacity info
     * @param xSpaceId space id
     */
    public capacityWithHttpInfo(xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataSpaceCapacityVO>> {
        const requestContextPromise = this.requestFactory.capacity(xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.capacityWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get space capacity info
     * @param xSpaceId space id
     */
    public capacity(xSpaceId: string, _options?: Configuration): Observable<ResponseDataSpaceCapacityVO> {
        return this.capacityWithHttpInfo(xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataSpaceCapacityVO>) => apiResponse.data));
    }

    /**
     * Create Space
     * @param spaceOpRo 
     */
    public create1WithHttpInfo(spaceOpRo: SpaceOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataCreateSpaceResultVo>> {
        const requestContextPromise = this.requestFactory.create1(spaceOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.create1WithHttpInfo(rsp)));
            }));
    }

    /**
     * Create Space
     * @param spaceOpRo 
     */
    public create1(spaceOpRo: SpaceOpRo, _options?: Configuration): Observable<ResponseDataCreateSpaceResultVo> {
        return this.create1WithHttpInfo(spaceOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataCreateSpaceResultVo>) => apiResponse.data));
    }

    /**
     * Delete space immediately
     */
    public delWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.del(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.delWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete space immediately
     */
    public del(_options?: Configuration): Observable<ResponseDataVoid> {
        return this.delWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Delete space
     * @param spaceDeleteRo 
     * @param spaceId space id
     */
    public delete7WithHttpInfo(spaceDeleteRo: SpaceDeleteRo, spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.delete7(spaceDeleteRo, spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.delete7WithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete space
     * @param spaceDeleteRo 
     * @param spaceId space id
     */
    public delete7(spaceDeleteRo: SpaceDeleteRo, spaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.delete7WithHttpInfo(spaceDeleteRo, spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Get space feature
     * @param xSpaceId space id
     */
    public featureWithHttpInfo(xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataSpaceGlobalFeature>> {
        const requestContextPromise = this.requestFactory.feature(xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.featureWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get space feature
     * @param xSpaceId space id
     */
    public feature(xSpaceId: string, _options?: Configuration): Observable<ResponseDataSpaceGlobalFeature> {
        return this.featureWithHttpInfo(xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataSpaceGlobalFeature>) => apiResponse.data));
    }

    /**
     * Gets message credit chart data for the space
     * @param spaceId space id
     * @param timeDimension 
     */
    public getCreditUsagesWithHttpInfo(spaceId: string, timeDimension?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataCreditUsages>> {
        const requestContextPromise = this.requestFactory.getCreditUsages(spaceId, timeDimension, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getCreditUsagesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Gets message credit chart data for the space
     * @param spaceId space id
     * @param timeDimension 
     */
    public getCreditUsages(spaceId: string, timeDimension?: string, _options?: Configuration): Observable<ResponseDataCreditUsages> {
        return this.getCreditUsagesWithHttpInfo(spaceId, timeDimension, _options).pipe(map((apiResponse: HttpInfo<ResponseDataCreditUsages>) => apiResponse.data));
    }

    /**
     * Get user space resource
     * @param xSpaceId space id
     */
    public getSpaceResourceWithHttpInfo(xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataUserSpaceVo>> {
        const requestContextPromise = this.requestFactory.getSpaceResource(xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSpaceResourceWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get user space resource
     * @param xSpaceId space id
     */
    public getSpaceResource(xSpaceId: string, _options?: Configuration): Observable<ResponseDataUserSpaceVo> {
        return this.getSpaceResourceWithHttpInfo(xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataUserSpaceVo>) => apiResponse.data));
    }

    /**
     * Get space info
     * @param spaceId space id
     */
    public infoWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataSpaceInfoVO>> {
        const requestContextPromise = this.requestFactory.info(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.infoWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get space info
     * @param spaceId space id
     */
    public info(spaceId: string, _options?: Configuration): Observable<ResponseDataSpaceInfoVO> {
        return this.infoWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataSpaceInfoVO>) => apiResponse.data));
    }

    /**
     * Get space list
     * @param onlyManageable Whether to query only the managed space list. By default, not include
     */
    public listWithHttpInfo(onlyManageable?: boolean, _options?: Configuration): Observable<HttpInfo<ResponseDataListSpaceVO>> {
        const requestContextPromise = this.requestFactory.list(onlyManageable, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get space list
     * @param onlyManageable Whether to query only the managed space list. By default, not include
     */
    public list(onlyManageable?: boolean, _options?: Configuration): Observable<ResponseDataListSpaceVO> {
        return this.listWithHttpInfo(onlyManageable, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListSpaceVO>) => apiResponse.data));
    }

    /**
     * Quit space
     * @param spaceId space id
     */
    public quitWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.quit(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.quitWithHttpInfo(rsp)));
            }));
    }

    /**
     * Quit space
     * @param spaceId space id
     */
    public quit(spaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.quitWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Gets subscription information for the space
     * @param spaceId space id
     */
    public subscribeWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataSpaceSubscribeVo>> {
        const requestContextPromise = this.requestFactory.subscribe(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.subscribeWithHttpInfo(rsp)));
            }));
    }

    /**
     * Gets subscription information for the space
     * @param spaceId space id
     */
    public subscribe(spaceId: string, _options?: Configuration): Observable<ResponseDataSpaceSubscribeVo> {
        return this.subscribeWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataSpaceSubscribeVo>) => apiResponse.data));
    }

    /**
     * switch space
     * @param spaceId space id
     */
    public switchSpaceWithHttpInfo(spaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.switchSpace(spaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.switchSpaceWithHttpInfo(rsp)));
            }));
    }

    /**
     * switch space
     * @param spaceId space id
     */
    public switchSpace(spaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.switchSpaceWithHttpInfo(spaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * at least one item is name and logo
     * Update space
     * @param spaceUpdateOpRo 
     * @param xSpaceId space id
     */
    public update1WithHttpInfo(spaceUpdateOpRo: SpaceUpdateOpRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.update1(spaceUpdateOpRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.update1WithHttpInfo(rsp)));
            }));
    }

    /**
     * at least one item is name and logo
     * Update space
     * @param spaceUpdateOpRo 
     * @param xSpaceId space id
     */
    public update1(spaceUpdateOpRo: SpaceUpdateOpRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.update1WithHttpInfo(spaceUpdateOpRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Update security setting
     * @param spaceSecuritySettingRo 
     * @param xSpaceId space id
     */
    public updateSecuritySettingWithHttpInfo(spaceSecuritySettingRo: SpaceSecuritySettingRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.updateSecuritySetting(spaceSecuritySettingRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateSecuritySettingWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update security setting
     * @param spaceSecuritySettingRo 
     * @param xSpaceId space id
     */
    public updateSecuritySetting(spaceSecuritySettingRo: SpaceSecuritySettingRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.updateSecuritySettingWithHttpInfo(spaceSecuritySettingRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { SpaceSubAdminApiApiRequestFactory, SpaceSubAdminApiApiResponseProcessor} from "../apis/SpaceSubAdminApiApi";
export class ObservableSpaceSubAdminApiApi {
    private requestFactory: SpaceSubAdminApiApiRequestFactory;
    private responseProcessor: SpaceSubAdminApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: SpaceSubAdminApiApiRequestFactory,
        responseProcessor?: SpaceSubAdminApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new SpaceSubAdminApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new SpaceSubAdminApiApiResponseProcessor();
    }

    /**
     * Create space role
     * @param addSpaceRoleRo 
     * @param xSpaceId space id
     */
    public addRoleWithHttpInfo(addSpaceRoleRo: AddSpaceRoleRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.addRole(addSpaceRoleRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.addRoleWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create space role
     * @param addSpaceRoleRo 
     * @param xSpaceId space id
     */
    public addRole(addSpaceRoleRo: AddSpaceRoleRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.addRoleWithHttpInfo(addSpaceRoleRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * delete admin
     * delete admin
     * @param memberId 
     * @param xSpaceId space id
     */
    public deleteRoleWithHttpInfo(memberId: number, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseData>> {
        const requestContextPromise = this.requestFactory.deleteRole(memberId, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteRoleWithHttpInfo(rsp)));
            }));
    }

    /**
     * delete admin
     * delete admin
     * @param memberId 
     * @param xSpaceId space id
     */
    public deleteRole(memberId: number, xSpaceId: string, _options?: Configuration): Observable<ResponseData> {
        return this.deleteRoleWithHttpInfo(memberId, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseData>) => apiResponse.data));
    }

    /**
     * Edite space role
     * @param updateSpaceRoleRo 
     * @param xSpaceId space id
     */
    public editRoleWithHttpInfo(updateSpaceRoleRo: UpdateSpaceRoleRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseData>> {
        const requestContextPromise = this.requestFactory.editRole(updateSpaceRoleRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.editRoleWithHttpInfo(rsp)));
            }));
    }

    /**
     * Edite space role
     * @param updateSpaceRoleRo 
     * @param xSpaceId space id
     */
    public editRole(updateSpaceRoleRo: UpdateSpaceRoleRo, xSpaceId: string, _options?: Configuration): Observable<ResponseData> {
        return this.editRoleWithHttpInfo(updateSpaceRoleRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseData>) => apiResponse.data));
    }

    /**
     * query admin detail
     * @param memberId 
     * @param xSpaceId space id
     */
    public getRoleDetailWithHttpInfo(memberId: number, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataSpaceRoleDetailVo>> {
        const requestContextPromise = this.requestFactory.getRoleDetail(memberId, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getRoleDetailWithHttpInfo(rsp)));
            }));
    }

    /**
     * query admin detail
     * @param memberId 
     * @param xSpaceId space id
     */
    public getRoleDetail(memberId: number, xSpaceId: string, _options?: Configuration): Observable<ResponseDataSpaceRoleDetailVo> {
        return this.getRoleDetailWithHttpInfo(memberId, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataSpaceRoleDetailVo>) => apiResponse.data));
    }

    /**
     * Page query sub admin.Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query admins
     * @param page 
     * @param xSpaceId space id
     * @param pageObjectParams paging parameters
     */
    public listRoleWithHttpInfo(page: Page, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Observable<HttpInfo<ResponseDataPageInfoSpaceRoleVo>> {
        const requestContextPromise = this.requestFactory.listRole(page, xSpaceId, pageObjectParams, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listRoleWithHttpInfo(rsp)));
            }));
    }

    /**
     * Page query sub admin.Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}
     * Query admins
     * @param page 
     * @param xSpaceId space id
     * @param pageObjectParams paging parameters
     */
    public listRole(page: Page, xSpaceId: string, pageObjectParams: string, _options?: Configuration): Observable<ResponseDataPageInfoSpaceRoleVo> {
        return this.listRoleWithHttpInfo(page, xSpaceId, pageObjectParams, _options).pipe(map((apiResponse: HttpInfo<ResponseDataPageInfoSpaceRoleVo>) => apiResponse.data));
    }

}

import { TemplateCenterTemplateAPIApiRequestFactory, TemplateCenterTemplateAPIApiResponseProcessor} from "../apis/TemplateCenterTemplateAPIApi";
export class ObservableTemplateCenterTemplateAPIApi {
    private requestFactory: TemplateCenterTemplateAPIApiRequestFactory;
    private responseProcessor: TemplateCenterTemplateAPIApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: TemplateCenterTemplateAPIApiRequestFactory,
        responseProcessor?: TemplateCenterTemplateAPIApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new TemplateCenterTemplateAPIApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new TemplateCenterTemplateAPIApiResponseProcessor();
    }

    /**
     * Created nodes (including child descendant nodes) have administrative rights and are not associated with data tables other than nodes.
     * Create Template
     * @param createTemplateRo 
     */
    public createWithHttpInfo(createTemplateRo: CreateTemplateRo, _options?: Configuration): Observable<HttpInfo<ResponseDataString>> {
        const requestContextPromise = this.requestFactory.create(createTemplateRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createWithHttpInfo(rsp)));
            }));
    }

    /**
     * Created nodes (including child descendant nodes) have administrative rights and are not associated with data tables other than nodes.
     * Create Template
     * @param createTemplateRo 
     */
    public create(createTemplateRo: CreateTemplateRo, _options?: Configuration): Observable<ResponseDataString> {
        return this.createWithHttpInfo(createTemplateRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataString>) => apiResponse.data));
    }

    /**
     * Deletion objects: main administrator, sub-admins with template permissions, creator of the template
     * Delete Template
     * @param templateId Template ID
     */
    public delete5WithHttpInfo(templateId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.delete5(templateId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.delete5WithHttpInfo(rsp)));
            }));
    }

    /**
     * Deletion objects: main administrator, sub-admins with template permissions, creator of the template
     * Delete Template
     * @param templateId Template ID
     */
    public delete5(templateId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.delete5WithHttpInfo(templateId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Get Template Directory Info
     * @param templateId Template Id
     * @param categoryCode Official Template Category Code
     * @param isPrivate Whether it is a private template in the space station
     */
    public directoryWithHttpInfo(templateId: string, categoryCode?: string, isPrivate?: boolean, _options?: Configuration): Observable<HttpInfo<ResponseDataTemplateDirectoryVo>> {
        const requestContextPromise = this.requestFactory.directory(templateId, categoryCode, isPrivate, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.directoryWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Template Directory Info
     * @param templateId Template Id
     * @param categoryCode Official Template Category Code
     * @param isPrivate Whether it is a private template in the space station
     */
    public directory(templateId: string, categoryCode?: string, isPrivate?: boolean, _options?: Configuration): Observable<ResponseDataTemplateDirectoryVo> {
        return this.directoryWithHttpInfo(templateId, categoryCode, isPrivate, _options).pipe(map((apiResponse: HttpInfo<ResponseDataTemplateDirectoryVo>) => apiResponse.data));
    }

    /**
     * Get The Template Category Content
     * @param categoryCode Template Category Code
     */
    public getCategoryContentWithHttpInfo(categoryCode: string, _options?: Configuration): Observable<HttpInfo<ResponseDataTemplateCategoryContentVo>> {
        const requestContextPromise = this.requestFactory.getCategoryContent(categoryCode, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getCategoryContentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get The Template Category Content
     * @param categoryCode Template Category Code
     */
    public getCategoryContent(categoryCode: string, _options?: Configuration): Observable<ResponseDataTemplateCategoryContentVo> {
        return this.getCategoryContentWithHttpInfo(categoryCode, _options).pipe(map((apiResponse: HttpInfo<ResponseDataTemplateCategoryContentVo>) => apiResponse.data));
    }

    /**
     * Get Template Category List
     */
    public getCategoryListWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataListTemplateCategoryMenuVo>> {
        const requestContextPromise = this.requestFactory.getCategoryList(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getCategoryListWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Template Category List
     */
    public getCategoryList(_options?: Configuration): Observable<ResponseDataListTemplateCategoryMenuVo> {
        return this.getCategoryListWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataListTemplateCategoryMenuVo>) => apiResponse.data));
    }

    /**
     * Get Space Templates
     * @param spaceId 
     * @param xSpaceId Space Id
     */
    public getSpaceTemplatesWithHttpInfo(spaceId: string, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListTemplateVo>> {
        const requestContextPromise = this.requestFactory.getSpaceTemplates(spaceId, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSpaceTemplatesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Space Templates
     * @param spaceId 
     * @param xSpaceId Space Id
     */
    public getSpaceTemplates(spaceId: string, xSpaceId: string, _options?: Configuration): Observable<ResponseDataListTemplateVo> {
        return this.getSpaceTemplatesWithHttpInfo(spaceId, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListTemplateVo>) => apiResponse.data));
    }

    /**
     * Template Global Search
     * @param keyword Search Keyword
     * @param className Highlight Style Class Name
     */
    public globalSearchWithHttpInfo(keyword: string, className?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataTemplateSearchResultVo>> {
        const requestContextPromise = this.requestFactory.globalSearch(keyword, className, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.globalSearchWithHttpInfo(rsp)));
            }));
    }

    /**
     * Template Global Search
     * @param keyword Search Keyword
     * @param className Highlight Style Class Name
     */
    public globalSearch(keyword: string, className?: string, _options?: Configuration): Observable<ResponseDataTemplateSearchResultVo> {
        return this.globalSearchWithHttpInfo(keyword, className, _options).pipe(map((apiResponse: HttpInfo<ResponseDataTemplateSearchResultVo>) => apiResponse.data));
    }

    /**
     * Quote Template
     * @param quoteTemplateRo 
     * @param xSocketId user socket id
     */
    public quoteWithHttpInfo(quoteTemplateRo: QuoteTemplateRo, xSocketId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeInfoVo>> {
        const requestContextPromise = this.requestFactory.quote(quoteTemplateRo, xSocketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.quoteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Quote Template
     * @param quoteTemplateRo 
     * @param xSocketId user socket id
     */
    public quote(quoteTemplateRo: QuoteTemplateRo, xSocketId?: string, _options?: Configuration): Observable<ResponseDataNodeInfoVo> {
        return this.quoteWithHttpInfo(quoteTemplateRo, xSocketId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeInfoVo>) => apiResponse.data));
    }

    /**
     * Get Template Recommend Content
     */
    public recommendWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataRecommendVo>> {
        const requestContextPromise = this.requestFactory.recommend(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.recommendWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Template Recommend Content
     */
    public recommend(_options?: Configuration): Observable<ResponseDataRecommendVo> {
        return this.recommendWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataRecommendVo>) => apiResponse.data));
    }

    /**
     * Called before creating a template, the same name will overwrite the old template. you need to confirm the operation again
     * Check if the template name already exists
     * @param name Template Name
     * @param xSpaceId Space Id
     */
    public validateWithHttpInfo(name: string, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataBoolean>> {
        const requestContextPromise = this.requestFactory.validate(name, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.validateWithHttpInfo(rsp)));
            }));
    }

    /**
     * Called before creating a template, the same name will overwrite the old template. you need to confirm the operation again
     * Check if the template name already exists
     * @param name Template Name
     * @param xSpaceId Space Id
     */
    public validate(name: string, xSpaceId: string, _options?: Configuration): Observable<ResponseDataBoolean> {
        return this.validateWithHttpInfo(name, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataBoolean>) => apiResponse.data));
    }

}

import { TemplateCenterTemplateAlbumAPIApiRequestFactory, TemplateCenterTemplateAlbumAPIApiResponseProcessor} from "../apis/TemplateCenterTemplateAlbumAPIApi";
export class ObservableTemplateCenterTemplateAlbumAPIApi {
    private requestFactory: TemplateCenterTemplateAlbumAPIApiRequestFactory;
    private responseProcessor: TemplateCenterTemplateAlbumAPIApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: TemplateCenterTemplateAlbumAPIApiRequestFactory,
        responseProcessor?: TemplateCenterTemplateAlbumAPIApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new TemplateCenterTemplateAlbumAPIApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new TemplateCenterTemplateAlbumAPIApiResponseProcessor();
    }

    /**
     * Get The Template Album Content
     * @param albumId Template Album ID
     */
    public getAlbumContentWithHttpInfo(albumId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataAlbumContentVo>> {
        const requestContextPromise = this.requestFactory.getAlbumContent(albumId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getAlbumContentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get The Template Album Content
     * @param albumId Template Album ID
     */
    public getAlbumContent(albumId: string, _options?: Configuration): Observable<ResponseDataAlbumContentVo> {
        return this.getAlbumContentWithHttpInfo(albumId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataAlbumContentVo>) => apiResponse.data));
    }

    /**
     * Get Recommended Template Albums
     * @param excludeAlbumId Exclude Album
     * @param maxCount Max Count of Load.The number of response result may be smaller than it
     */
    public getRecommendedAlbumsWithHttpInfo(excludeAlbumId?: string, maxCount?: number, _options?: Configuration): Observable<HttpInfo<ResponseDataListAlbumVo>> {
        const requestContextPromise = this.requestFactory.getRecommendedAlbums(excludeAlbumId, maxCount, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getRecommendedAlbumsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get Recommended Template Albums
     * @param excludeAlbumId Exclude Album
     * @param maxCount Max Count of Load.The number of response result may be smaller than it
     */
    public getRecommendedAlbums(excludeAlbumId?: string, maxCount?: number, _options?: Configuration): Observable<ResponseDataListAlbumVo> {
        return this.getRecommendedAlbumsWithHttpInfo(excludeAlbumId, maxCount, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListAlbumVo>) => apiResponse.data));
    }

}

import { WidgetSDKPackageApiApiRequestFactory, WidgetSDKPackageApiApiResponseProcessor} from "../apis/WidgetSDKPackageApiApi";
export class ObservableWidgetSDKPackageApiApi {
    private requestFactory: WidgetSDKPackageApiApiRequestFactory;
    private responseProcessor: WidgetSDKPackageApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: WidgetSDKPackageApiApiRequestFactory,
        responseProcessor?: WidgetSDKPackageApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new WidgetSDKPackageApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new WidgetSDKPackageApiApiResponseProcessor();
    }

    /**
     * widget-cli initialization create widget
     * Create widget
     * @param widgetPackageCreateRo 
     * @param authorization developer token
     */
    public createWidgetWithHttpInfo(widgetPackageCreateRo: WidgetPackageCreateRo, authorization: string, _options?: Configuration): Observable<HttpInfo<ResponseDataWidgetReleaseCreateVo>> {
        const requestContextPromise = this.requestFactory.createWidget(widgetPackageCreateRo, authorization, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createWidgetWithHttpInfo(rsp)));
            }));
    }

    /**
     * widget-cli initialization create widget
     * Create widget
     * @param widgetPackageCreateRo 
     * @param authorization developer token
     */
    public createWidget(widgetPackageCreateRo: WidgetPackageCreateRo, authorization: string, _options?: Configuration): Observable<ResponseDataWidgetReleaseCreateVo> {
        return this.createWidgetWithHttpInfo(widgetPackageCreateRo, authorization, _options).pipe(map((apiResponse: HttpInfo<ResponseDataWidgetReleaseCreateVo>) => apiResponse.data));
    }

    /**
     * widget-cli get widget package info
     * Get widget package info
     * @param packageId 
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public getWidgetPackageInfoWithHttpInfo(packageId: string, authorization: string, acceptLanguage?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataWidgetPackageInfoVo>> {
        const requestContextPromise = this.requestFactory.getWidgetPackageInfo(packageId, authorization, acceptLanguage, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getWidgetPackageInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * widget-cli get widget package info
     * Get widget package info
     * @param packageId 
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public getWidgetPackageInfo(packageId: string, authorization: string, acceptLanguage?: string, _options?: Configuration): Observable<ResponseDataWidgetPackageInfoVo> {
        return this.getWidgetPackageInfoWithHttpInfo(packageId, authorization, acceptLanguage, _options).pipe(map((apiResponse: HttpInfo<ResponseDataWidgetPackageInfoVo>) => apiResponse.data));
    }

    /**
     * widget-cli get widget store information
     * Get widget store information
     * @param spaceId 
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public getWidgetPackageListInfoWithHttpInfo(spaceId: string, authorization: string, acceptLanguage?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListWidgetPackageInfoVo>> {
        const requestContextPromise = this.requestFactory.getWidgetPackageListInfo(spaceId, authorization, acceptLanguage, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getWidgetPackageListInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * widget-cli get widget store information
     * Get widget store information
     * @param spaceId 
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public getWidgetPackageListInfo(spaceId: string, authorization: string, acceptLanguage?: string, _options?: Configuration): Observable<ResponseDataListWidgetPackageInfoVo> {
        return this.getWidgetPackageListInfoWithHttpInfo(spaceId, authorization, acceptLanguage, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListWidgetPackageInfoVo>) => apiResponse.data));
    }

    /**
     * Get widget release history
     * @param packageId widget package id
     * @param page 
     * @param authorization developer token
     * @param pageObjectParams page
     */
    public releaseListWidgetWithHttpInfo(packageId: number, page: Page, authorization: string, pageObjectParams?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListWidgetReleaseListVo>> {
        const requestContextPromise = this.requestFactory.releaseListWidget(packageId, page, authorization, pageObjectParams, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.releaseListWidgetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get widget release history
     * @param packageId widget package id
     * @param page 
     * @param authorization developer token
     * @param pageObjectParams page
     */
    public releaseListWidget(packageId: number, page: Page, authorization: string, pageObjectParams?: string, _options?: Configuration): Observable<ResponseDataListWidgetReleaseListVo> {
        return this.releaseListWidgetWithHttpInfo(packageId, page, authorization, pageObjectParams, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListWidgetReleaseListVo>) => apiResponse.data));
    }

    /**
     * widget-cli release widget
     * release widget v2
     * @param widgetPackageReleaseV2Ro 
     * @param authorization developer token
     */
    public releaseWidgetV2WithHttpInfo(widgetPackageReleaseV2Ro: WidgetPackageReleaseV2Ro, authorization: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.releaseWidgetV2(widgetPackageReleaseV2Ro, authorization, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.releaseWidgetV2WithHttpInfo(rsp)));
            }));
    }

    /**
     * widget-cli release widget
     * release widget v2
     * @param widgetPackageReleaseV2Ro 
     * @param authorization developer token
     */
    public releaseWidgetV2(widgetPackageReleaseV2Ro: WidgetPackageReleaseV2Ro, authorization: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.releaseWidgetV2WithHttpInfo(widgetPackageReleaseV2Ro, authorization, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Rollback widget
     * @param widgetPackageRollbackRo 
     * @param authorization developer token
     */
    public rollbackWidgetWithHttpInfo(widgetPackageRollbackRo: WidgetPackageRollbackRo, authorization: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.rollbackWidget(widgetPackageRollbackRo, authorization, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.rollbackWidgetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Rollback widget
     * @param widgetPackageRollbackRo 
     * @param authorization developer token
     */
    public rollbackWidget(widgetPackageRollbackRo: WidgetPackageRollbackRo, authorization: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.rollbackWidgetWithHttpInfo(widgetPackageRollbackRo, authorization, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * widget-cli submit widget
     * submit widget v2
     * @param widgetPackageSubmitV2Ro 
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public submitWidgetV2WithHttpInfo(widgetPackageSubmitV2Ro: WidgetPackageSubmitV2Ro, authorization: string, acceptLanguage?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.submitWidgetV2(widgetPackageSubmitV2Ro, authorization, acceptLanguage, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.submitWidgetV2WithHttpInfo(rsp)));
            }));
    }

    /**
     * widget-cli submit widget
     * submit widget v2
     * @param widgetPackageSubmitV2Ro 
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public submitWidgetV2(widgetPackageSubmitV2Ro: WidgetPackageSubmitV2Ro, authorization: string, acceptLanguage?: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.submitWidgetV2WithHttpInfo(widgetPackageSubmitV2Ro, authorization, acceptLanguage, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * widget-cli transfer widget owner
     * Transfer widget owner
     * @param widgetTransferOwnerRo 
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public transferWidgetOwnerWithHttpInfo(widgetTransferOwnerRo: WidgetTransferOwnerRo, authorization: string, acceptLanguage?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.transferWidgetOwner(widgetTransferOwnerRo, authorization, acceptLanguage, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.transferWidgetOwnerWithHttpInfo(rsp)));
            }));
    }

    /**
     * widget-cli transfer widget owner
     * Transfer widget owner
     * @param widgetTransferOwnerRo 
     * @param authorization developer token
     * @param acceptLanguage developer\&#39;s language
     */
    public transferWidgetOwner(widgetTransferOwnerRo: WidgetTransferOwnerRo, authorization: string, acceptLanguage?: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.transferWidgetOwnerWithHttpInfo(widgetTransferOwnerRo, authorization, acceptLanguage, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Unpublish widget
     * @param widgetPackageUnpublishRo 
     * @param authorization developer token
     */
    public unpublishWidgetWithHttpInfo(widgetPackageUnpublishRo: WidgetPackageUnpublishRo, authorization: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.unpublishWidget(widgetPackageUnpublishRo, authorization, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.unpublishWidgetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Unpublish widget
     * @param widgetPackageUnpublishRo 
     * @param authorization developer token
     */
    public unpublishWidget(widgetPackageUnpublishRo: WidgetPackageUnpublishRo, authorization: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.unpublishWidgetWithHttpInfo(widgetPackageUnpublishRo, authorization, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * widget-cli widget development authentication verification
     * Auth widget
     * @param widgetPackageAuthRo 
     * @param authorization developer token
     */
    public widgetAuthWithHttpInfo(widgetPackageAuthRo: WidgetPackageAuthRo, authorization: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.widgetAuth(widgetPackageAuthRo, authorization, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.widgetAuthWithHttpInfo(rsp)));
            }));
    }

    /**
     * widget-cli widget development authentication verification
     * Auth widget
     * @param widgetPackageAuthRo 
     * @param authorization developer token
     */
    public widgetAuth(widgetPackageAuthRo: WidgetPackageAuthRo, authorization: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.widgetAuthWithHttpInfo(widgetPackageAuthRo, authorization, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { WidgetSDKWidgetApiApiRequestFactory, WidgetSDKWidgetApiApiResponseProcessor} from "../apis/WidgetSDKWidgetApiApi";
export class ObservableWidgetSDKWidgetApiApi {
    private requestFactory: WidgetSDKWidgetApiApiRequestFactory;
    private responseProcessor: WidgetSDKWidgetApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: WidgetSDKWidgetApiApiRequestFactory,
        responseProcessor?: WidgetSDKWidgetApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new WidgetSDKWidgetApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new WidgetSDKWidgetApiApiResponseProcessor();
    }

    /**
     * Scenario: 1、dashboard import widget2:the widget panel sends applets to the dashboard; 3:copy widget
     * Copy widget
     * @param widgetCopyRo 
     */
    public copyWidgetWithHttpInfo(widgetCopyRo: WidgetCopyRo, _options?: Configuration): Observable<HttpInfo<ResponseDataListWidgetPack>> {
        const requestContextPromise = this.requestFactory.copyWidget(widgetCopyRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.copyWidgetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Scenario: 1、dashboard import widget2:the widget panel sends applets to the dashboard; 3:copy widget
     * Copy widget
     * @param widgetCopyRo 
     */
    public copyWidget(widgetCopyRo: WidgetCopyRo, _options?: Configuration): Observable<ResponseDataListWidgetPack> {
        return this.copyWidgetWithHttpInfo(widgetCopyRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListWidgetPack>) => apiResponse.data));
    }

    /**
     * Scenario:1、dashboard new applet 2、datasheet widget panel new widget
     * Create widget
     * @param widgetCreateRo 
     */
    public createWidget1WithHttpInfo(widgetCreateRo: WidgetCreateRo, _options?: Configuration): Observable<HttpInfo<ResponseDataWidgetPack>> {
        const requestContextPromise = this.requestFactory.createWidget1(widgetCreateRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createWidget1WithHttpInfo(rsp)));
            }));
    }

    /**
     * Scenario:1、dashboard new applet 2、datasheet widget panel new widget
     * Create widget
     * @param widgetCreateRo 
     */
    public createWidget1(widgetCreateRo: WidgetCreateRo, _options?: Configuration): Observable<ResponseDataWidgetPack> {
        return this.createWidget1WithHttpInfo(widgetCreateRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataWidgetPack>) => apiResponse.data));
    }

    /**
     * Get package teamplates
     */
    public findTemplatePackageListWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataListWidgetTemplatePackageInfo>> {
        const requestContextPromise = this.requestFactory.findTemplatePackageList(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.findTemplatePackageListWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get package teamplates
     */
    public findTemplatePackageList(_options?: Configuration): Observable<ResponseDataListWidgetTemplatePackageInfo> {
        return this.findTemplatePackageListWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataListWidgetTemplatePackageInfo>) => apiResponse.data));
    }

    /**
     * get the widget information of the node
     * @param nodeId node id
     */
    public findWidgetInfoByNodeIdWithHttpInfo(nodeId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListWidgetInfo>> {
        const requestContextPromise = this.requestFactory.findWidgetInfoByNodeId(nodeId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.findWidgetInfoByNodeIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * get the widget information of the node
     * @param nodeId node id
     */
    public findWidgetInfoByNodeId(nodeId: string, _options?: Configuration): Observable<ResponseDataListWidgetInfo> {
        return this.findWidgetInfoByNodeIdWithHttpInfo(nodeId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListWidgetInfo>) => apiResponse.data));
    }

    /**
     * get the widgets under the entire space
     * Get the space widgets
     * @param spaceId space id
     * @param count load quantity
     */
    public findWidgetInfoBySpaceIdWithHttpInfo(spaceId: string, count?: number, _options?: Configuration): Observable<HttpInfo<ResponseDataListWidgetInfo>> {
        const requestContextPromise = this.requestFactory.findWidgetInfoBySpaceId(spaceId, count, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.findWidgetInfoBySpaceIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * get the widgets under the entire space
     * Get the space widgets
     * @param spaceId space id
     * @param count load quantity
     */
    public findWidgetInfoBySpaceId(spaceId: string, count?: number, _options?: Configuration): Observable<ResponseDataListWidgetInfo> {
        return this.findWidgetInfoBySpaceIdWithHttpInfo(spaceId, count, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListWidgetInfo>) => apiResponse.data));
    }

    /**
     * Node types are limited to dashboards and datasheet
     * Get the node widget package
     * @param nodeId node id
     * @param linkId association id：node share id、template id
     * @param xSpaceId space id
     */
    public findWidgetPackByNodeIdWithHttpInfo(nodeId: string, linkId?: string, xSpaceId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListWidgetPack>> {
        const requestContextPromise = this.requestFactory.findWidgetPackByNodeId(nodeId, linkId, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.findWidgetPackByNodeIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * Node types are limited to dashboards and datasheet
     * Get the node widget package
     * @param nodeId node id
     * @param linkId association id：node share id、template id
     * @param xSpaceId space id
     */
    public findWidgetPackByNodeId(nodeId: string, linkId?: string, xSpaceId?: string, _options?: Configuration): Observable<ResponseDataListWidgetPack> {
        return this.findWidgetPackByNodeIdWithHttpInfo(nodeId, linkId, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListWidgetPack>) => apiResponse.data));
    }

    /**
     * get widget info by widget id
     * Get widget info
     * @param widgetIds widget ids
     * @param linkId Association ID: node sharing ID and template ID
     */
    public findWidgetPackByWidgetIdsWithHttpInfo(widgetIds: string, linkId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListWidgetPack>> {
        const requestContextPromise = this.requestFactory.findWidgetPackByWidgetIds(widgetIds, linkId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.findWidgetPackByWidgetIdsWithHttpInfo(rsp)));
            }));
    }

    /**
     * get widget info by widget id
     * Get widget info
     * @param widgetIds widget ids
     * @param linkId Association ID: node sharing ID and template ID
     */
    public findWidgetPackByWidgetIds(widgetIds: string, linkId?: string, _options?: Configuration): Observable<ResponseDataListWidgetPack> {
        return this.findWidgetPackByWidgetIdsWithHttpInfo(widgetIds, linkId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListWidgetPack>) => apiResponse.data));
    }

    /**
     * Get widget store
     * @param widgetStoreListRo 
     * @param xSpaceId space id
     */
    public widgetStoreListWithHttpInfo(widgetStoreListRo: WidgetStoreListRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListWidgetStoreListInfo>> {
        const requestContextPromise = this.requestFactory.widgetStoreList(widgetStoreListRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.widgetStoreListWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get widget store
     * @param widgetStoreListRo 
     * @param xSpaceId space id
     */
    public widgetStoreList(widgetStoreListRo: WidgetStoreListRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataListWidgetStoreListInfo> {
        return this.widgetStoreListWithHttpInfo(widgetStoreListRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListWidgetStoreListInfo>) => apiResponse.data));
    }

}

import { WidgetUploadAPIApiRequestFactory, WidgetUploadAPIApiResponseProcessor} from "../apis/WidgetUploadAPIApi";
export class ObservableWidgetUploadAPIApi {
    private requestFactory: WidgetUploadAPIApiRequestFactory;
    private responseProcessor: WidgetUploadAPIApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: WidgetUploadAPIApiRequestFactory,
        responseProcessor?: WidgetUploadAPIApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new WidgetUploadAPIApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new WidgetUploadAPIApiResponseProcessor();
    }

    /**
     * Get widget file upload pre signed url
     * @param widgetAssetUploadCertificateRO 
     * @param packageId 
     */
    public generateWidgetPreSignedUrlWithHttpInfo(widgetAssetUploadCertificateRO: WidgetAssetUploadCertificateRO, packageId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListWidgetUploadTokenVo>> {
        const requestContextPromise = this.requestFactory.generateWidgetPreSignedUrl(widgetAssetUploadCertificateRO, packageId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.generateWidgetPreSignedUrlWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get widget file upload pre signed url
     * @param widgetAssetUploadCertificateRO 
     * @param packageId 
     */
    public generateWidgetPreSignedUrl(widgetAssetUploadCertificateRO: WidgetAssetUploadCertificateRO, packageId: string, _options?: Configuration): Observable<ResponseDataListWidgetUploadTokenVo> {
        return this.generateWidgetPreSignedUrlWithHttpInfo(widgetAssetUploadCertificateRO, packageId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListWidgetUploadTokenVo>) => apiResponse.data));
    }

    /**
     * get widget upload meta
     * get widget upload meta
     */
    public getWidgetUploadMetaWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ResponseDataWidgetUploadMetaVo>> {
        const requestContextPromise = this.requestFactory.getWidgetUploadMeta(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getWidgetUploadMetaWithHttpInfo(rsp)));
            }));
    }

    /**
     * get widget upload meta
     * get widget upload meta
     */
    public getWidgetUploadMeta(_options?: Configuration): Observable<ResponseDataWidgetUploadMetaVo> {
        return this.getWidgetUploadMetaWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ResponseDataWidgetUploadMetaVo>) => apiResponse.data));
    }

}

import { WorkbenchNodeApiApiRequestFactory, WorkbenchNodeApiApiResponseProcessor} from "../apis/WorkbenchNodeApiApi";
export class ObservableWorkbenchNodeApiApi {
    private requestFactory: WorkbenchNodeApiApiRequestFactory;
    private responseProcessor: WorkbenchNodeApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: WorkbenchNodeApiApiRequestFactory,
        responseProcessor?: WorkbenchNodeApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new WorkbenchNodeApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new WorkbenchNodeApiApiResponseProcessor();
    }

    /**
     * node id and view id are not required（do not pass means all closed）
     * Record active node
     * @param activeSheetsOpRo 
     * @param xSpaceId space id
     */
    public activeSheetsWithHttpInfo(activeSheetsOpRo: ActiveSheetsOpRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.activeSheets(activeSheetsOpRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.activeSheetsWithHttpInfo(rsp)));
            }));
    }

    /**
     * node id and view id are not required（do not pass means all closed）
     * Record active node
     * @param activeSheetsOpRo 
     * @param xSpaceId space id
     */
    public activeSheets(activeSheetsOpRo: ActiveSheetsOpRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.activeSheetsWithHttpInfo(activeSheetsOpRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * The front node is saved in the first place of the parent node when it is not under the parent node. Save in the first place of the first level directory when it is not transmitted.
     * Analyze Bundle
     * @param nodeBundleOpRo 
     */
    public analyzeBundleWithHttpInfo(nodeBundleOpRo?: NodeBundleOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.analyzeBundle(nodeBundleOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.analyzeBundleWithHttpInfo(rsp)));
            }));
    }

    /**
     * The front node is saved in the first place of the parent node when it is not under the parent node. Save in the first place of the first level directory when it is not transmitted.
     * Analyze Bundle
     * @param nodeBundleOpRo 
     */
    public analyzeBundle(nodeBundleOpRo?: NodeBundleOpRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.analyzeBundleWithHttpInfo(nodeBundleOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * permission of the associated node is not required. Scenario: Check whether the view associated mirror before deleting the table.
     * check for associated nodes
     * @param nodeId node id
     * @param viewId view id（do not specify full return）
     * @param type node type（do not specify full return，form:3/mirror:5）
     */
    public checkRelNodeWithHttpInfo(nodeId: string, viewId?: string, type?: number, _options?: Configuration): Observable<HttpInfo<ResponseDataListNodeInfo>> {
        const requestContextPromise = this.requestFactory.checkRelNode(nodeId, viewId, type, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.checkRelNodeWithHttpInfo(rsp)));
            }));
    }

    /**
     * permission of the associated node is not required. Scenario: Check whether the view associated mirror before deleting the table.
     * check for associated nodes
     * @param nodeId node id
     * @param viewId view id（do not specify full return）
     * @param type node type（do not specify full return，form:3/mirror:5）
     */
    public checkRelNode(nodeId: string, viewId?: string, type?: number, _options?: Configuration): Observable<ResponseDataListNodeInfo> {
        return this.checkRelNodeWithHttpInfo(nodeId, viewId, type, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNodeInfo>) => apiResponse.data));
    }

    /**
     * node id is required, whether to copy data is not required.
     * Copy node
     * @param nodeCopyOpRo 
     * @param xSocketId user socket id
     */
    public copyWithHttpInfo(nodeCopyOpRo: NodeCopyOpRo, xSocketId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeInfoVo>> {
        const requestContextPromise = this.requestFactory.copy(nodeCopyOpRo, xSocketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.copyWithHttpInfo(rsp)));
            }));
    }

    /**
     * node id is required, whether to copy data is not required.
     * Copy node
     * @param nodeCopyOpRo 
     * @param xSocketId user socket id
     */
    public copy(nodeCopyOpRo: NodeCopyOpRo, xSocketId?: string, _options?: Configuration): Observable<ResponseDataNodeInfoVo> {
        return this.copyWithHttpInfo(nodeCopyOpRo, xSocketId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeInfoVo>) => apiResponse.data));
    }

    /**
     * create a new node under the node<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Create child node
     * @param nodeOpRo 
     * @param xSocketId user socket id
     */
    public create3WithHttpInfo(nodeOpRo: NodeOpRo, xSocketId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeInfoVo>> {
        const requestContextPromise = this.requestFactory.create3(nodeOpRo, xSocketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.create3WithHttpInfo(rsp)));
            }));
    }

    /**
     * create a new node under the node<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Create child node
     * @param nodeOpRo 
     * @param xSocketId user socket id
     */
    public create3(nodeOpRo: NodeOpRo, xSocketId?: string, _options?: Configuration): Observable<ResponseDataNodeInfoVo> {
        return this.create3WithHttpInfo(nodeOpRo, xSocketId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeInfoVo>) => apiResponse.data));
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete2WithHttpInfo(nodeId: string, xSocketId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.delete2(nodeId, xSocketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.delete2WithHttpInfo(rsp)));
            }));
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete2(nodeId: string, xSocketId?: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.delete2WithHttpInfo(nodeId, xSocketId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete3WithHttpInfo(nodeId: string, xSocketId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.delete3(nodeId, xSocketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.delete3WithHttpInfo(rsp)));
            }));
    }

    /**
     * You can pass in an ID array and delete multiple nodes.
     * Delete node
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public delete3(nodeId: string, xSocketId?: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.delete3WithHttpInfo(nodeId, xSocketId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Export Bundle
     * @param nodeId node id
     * @param saveData whether to retain data
     * @param password encrypted password
     */
    public exportBundleWithHttpInfo(nodeId: string, saveData?: boolean, password?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.exportBundle(nodeId, saveData, password, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.exportBundleWithHttpInfo(rsp)));
            }));
    }

    /**
     * Export Bundle
     * @param nodeId node id
     * @param saveData whether to retain data
     * @param password encrypted password
     */
    public exportBundle(nodeId: string, saveData?: boolean, password?: string, _options?: Configuration): Observable<void> {
        return this.exportBundleWithHttpInfo(nodeId, saveData, password, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * obtain information about the node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query nodes
     * @param nodeIds node ids
     */
    public getByNodeIdWithHttpInfo(nodeIds: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListNodeInfoVo>> {
        const requestContextPromise = this.requestFactory.getByNodeId(nodeIds, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getByNodeIdWithHttpInfo(rsp)));
            }));
    }

    /**
     * obtain information about the node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query nodes
     * @param nodeIds node ids
     */
    public getByNodeId(nodeIds: string, _options?: Configuration): Observable<ResponseDataListNodeInfoVo> {
        return this.getByNodeIdWithHttpInfo(nodeIds, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNodeInfoVo>) => apiResponse.data));
    }

    /**
     * Obtain the list of child nodes of the specified node. The nodes are classified into folders or datasheet by type <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get child nodes
     * @param nodeId node id
     * @param nodeType node type 1:folder,2:datasheet
     */
    public getNodeChildrenListWithHttpInfo(nodeId: string, nodeType?: number, _options?: Configuration): Observable<HttpInfo<ResponseDataListNodeInfoVo>> {
        const requestContextPromise = this.requestFactory.getNodeChildrenList(nodeId, nodeType, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getNodeChildrenListWithHttpInfo(rsp)));
            }));
    }

    /**
     * Obtain the list of child nodes of the specified node. The nodes are classified into folders or datasheet by type <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get child nodes
     * @param nodeId node id
     * @param nodeType node type 1:folder,2:datasheet
     */
    public getNodeChildrenList(nodeId: string, nodeType?: number, _options?: Configuration): Observable<ResponseDataListNodeInfoVo> {
        return this.getNodeChildrenListWithHttpInfo(nodeId, nodeType, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNodeInfoVo>) => apiResponse.data));
    }

    /**
     * This interface requires readable or above permissions of the associated node. Scenario: Open the display columns of form and mirror in the datasheet.
     * Get associated node
     * @param nodeId node id
     * @param viewId view id（do not specify full return）
     * @param type node type（do not specify full return，form:3/mirror:5）
     */
    public getNodeRelWithHttpInfo(nodeId: string, viewId?: string, type?: number, _options?: Configuration): Observable<HttpInfo<ResponseDataListNodeInfo>> {
        const requestContextPromise = this.requestFactory.getNodeRel(nodeId, viewId, type, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getNodeRelWithHttpInfo(rsp)));
            }));
    }

    /**
     * This interface requires readable or above permissions of the associated node. Scenario: Open the display columns of form and mirror in the datasheet.
     * Get associated node
     * @param nodeId node id
     * @param viewId view id（do not specify full return）
     * @param type node type（do not specify full return，form:3/mirror:5）
     */
    public getNodeRel(nodeId: string, viewId?: string, type?: number, _options?: Configuration): Observable<ResponseDataListNodeInfo> {
        return this.getNodeRelWithHttpInfo(nodeId, viewId, type, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNodeInfo>) => apiResponse.data));
    }

    /**
     * Gets a list of all parent nodes of the specified node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get parent nodes
     * @param nodeId node id
     */
    public getParentNodesWithHttpInfo(nodeId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListNodePathVo>> {
        const requestContextPromise = this.requestFactory.getParentNodes(nodeId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getParentNodesWithHttpInfo(rsp)));
            }));
    }

    /**
     * Gets a list of all parent nodes of the specified node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Get parent nodes
     * @param nodeId node id
     */
    public getParentNodes(nodeId: string, _options?: Configuration): Observable<ResponseDataListNodePathVo> {
        return this.getParentNodesWithHttpInfo(nodeId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNodePathVo>) => apiResponse.data));
    }

    /**
     * Query the node tree of workbench, restricted to two levels.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query tree node
     * @param xSpaceId space id
     * @param depth tree depth, we can specify the query depth, maximum 2 layers depth.
     */
    public getTreeWithHttpInfo(xSpaceId: string, depth?: number, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeInfoTreeVo>> {
        const requestContextPromise = this.requestFactory.getTree(xSpaceId, depth, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getTreeWithHttpInfo(rsp)));
            }));
    }

    /**
     * Query the node tree of workbench, restricted to two levels.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Query tree node
     * @param xSpaceId space id
     * @param depth tree depth, we can specify the query depth, maximum 2 layers depth.
     */
    public getTree(xSpaceId: string, depth?: number, _options?: Configuration): Observable<ResponseDataNodeInfoTreeVo> {
        return this.getTreeWithHttpInfo(xSpaceId, depth, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeInfoTreeVo>) => apiResponse.data));
    }

    /**
     * all parameters must be
     * Import excel
     * @param importExcelOpRo 
     */
    public importExcelWithHttpInfo(importExcelOpRo?: ImportExcelOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeInfoVo>> {
        const requestContextPromise = this.requestFactory.importExcel(importExcelOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.importExcelWithHttpInfo(rsp)));
            }));
    }

    /**
     * all parameters must be
     * Import excel
     * @param importExcelOpRo 
     */
    public importExcel(importExcelOpRo?: ImportExcelOpRo, _options?: Configuration): Observable<ResponseDataNodeInfoVo> {
        return this.importExcelWithHttpInfo(importExcelOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeInfoVo>) => apiResponse.data));
    }

    /**
     * all parameters must be
     * Import excel
     * @param importExcelOpRo 
     */
    public importExcel1WithHttpInfo(importExcelOpRo?: ImportExcelOpRo, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeInfoVo>> {
        const requestContextPromise = this.requestFactory.importExcel1(importExcelOpRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.importExcel1WithHttpInfo(rsp)));
            }));
    }

    /**
     * all parameters must be
     * Import excel
     * @param importExcelOpRo 
     */
    public importExcel1(importExcelOpRo?: ImportExcelOpRo, _options?: Configuration): Observable<ResponseDataNodeInfoVo> {
        return this.importExcel1WithHttpInfo(importExcelOpRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeInfoVo>) => apiResponse.data));
    }

    /**
     * scenario: query an existing dashboard
     * Get nodes of the specified type
     * @param type node type
     * @param xSpaceId space id
     * @param role role（manageable by default）
     */
    public list4WithHttpInfo(type: number, xSpaceId: string, role?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListNodeInfo>> {
        const requestContextPromise = this.requestFactory.list4(type, xSpaceId, role, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.list4WithHttpInfo(rsp)));
            }));
    }

    /**
     * scenario: query an existing dashboard
     * Get nodes of the specified type
     * @param type node type
     * @param xSpaceId space id
     * @param role role（manageable by default）
     */
    public list4(type: number, xSpaceId: string, role?: string, _options?: Configuration): Observable<ResponseDataListNodeInfo> {
        return this.list4WithHttpInfo(type, xSpaceId, role, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNodeInfo>) => apiResponse.data));
    }

    /**
     * Node ID and parent node ID are required, and pre Node Id is not required.
     * Move node
     * @param nodeMoveOpRo 
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public moveWithHttpInfo(nodeMoveOpRo: NodeMoveOpRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListNodeInfoVo>> {
        const requestContextPromise = this.requestFactory.move(nodeMoveOpRo, xSpaceId, xSocketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.moveWithHttpInfo(rsp)));
            }));
    }

    /**
     * Node ID and parent node ID are required, and pre Node Id is not required.
     * Move node
     * @param nodeMoveOpRo 
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public move(nodeMoveOpRo: NodeMoveOpRo, xSpaceId: string, xSocketId?: string, _options?: Configuration): Observable<ResponseDataListNodeInfoVo> {
        return this.moveWithHttpInfo(nodeMoveOpRo, xSpaceId, xSocketId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNodeInfoVo>) => apiResponse.data));
    }

    /**
     * node in must <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Position node
     * @param nodeId node id
     */
    public positionWithHttpInfo(nodeId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeInfoTreeVo>> {
        const requestContextPromise = this.requestFactory.position(nodeId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.positionWithHttpInfo(rsp)));
            }));
    }

    /**
     * node in must <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Position node
     * @param nodeId node id
     */
    public position(nodeId: string, _options?: Configuration): Observable<ResponseDataNodeInfoTreeVo> {
        return this.positionWithHttpInfo(nodeId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeInfoTreeVo>) => apiResponse.data));
    }

    /**
     * Gets no permission member before remind
     * @param remindUnitsNoPermissionRo 
     */
    public postRemindUnitsNoPermissionWithHttpInfo(remindUnitsNoPermissionRo: RemindUnitsNoPermissionRo, _options?: Configuration): Observable<HttpInfo<ResponseDataListMemberBriefInfoVo>> {
        const requestContextPromise = this.requestFactory.postRemindUnitsNoPermission(remindUnitsNoPermissionRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.postRemindUnitsNoPermissionWithHttpInfo(rsp)));
            }));
    }

    /**
     * Gets no permission member before remind
     * @param remindUnitsNoPermissionRo 
     */
    public postRemindUnitsNoPermission(remindUnitsNoPermissionRo: RemindUnitsNoPermissionRo, _options?: Configuration): Observable<ResponseDataListMemberBriefInfoVo> {
        return this.postRemindUnitsNoPermissionWithHttpInfo(remindUnitsNoPermissionRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListMemberBriefInfoVo>) => apiResponse.data));
    }

    /**
     * member recent open node list
     * member recent open node list
     * @param xSpaceId space id
     */
    public recentListWithHttpInfo(xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListNodeSearchResult>> {
        const requestContextPromise = this.requestFactory.recentList(xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.recentListWithHttpInfo(rsp)));
            }));
    }

    /**
     * member recent open node list
     * member recent open node list
     * @param xSpaceId space id
     */
    public recentList(xSpaceId: string, _options?: Configuration): Observable<ResponseDataListNodeSearchResult> {
        return this.recentListWithHttpInfo(xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNodeSearchResult>) => apiResponse.data));
    }

    /**
     * Remind notification
     * @param remindMemberRo 
     */
    public remindWithHttpInfo(remindMemberRo: RemindMemberRo, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.remind(remindMemberRo, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.remindWithHttpInfo(rsp)));
            }));
    }

    /**
     * Remind notification
     * @param remindMemberRo 
     */
    public remind(remindMemberRo: RemindMemberRo, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.remindWithHttpInfo(remindMemberRo, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Enter the search term to search for the node of the working directory.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Fuzzy search node
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className highlight style
     */
    public searchNodeWithHttpInfo(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListNodeSearchResult>> {
        const requestContextPromise = this.requestFactory.searchNode(keyword, xSpaceId, className, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.searchNodeWithHttpInfo(rsp)));
            }));
    }

    /**
     * Enter the search term to search for the node of the working directory.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Fuzzy search node
     * @param keyword keyword
     * @param xSpaceId space id
     * @param className highlight style
     */
    public searchNode(keyword: string, xSpaceId: string, className?: string, _options?: Configuration): Observable<ResponseDataListNodeSearchResult> {
        return this.searchNodeWithHttpInfo(keyword, xSpaceId, className, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListNodeSearchResult>) => apiResponse.data));
    }

    /**
     * Nodes that are not in the center of the template, make spatial judgments.
     * Node info window
     * @param nodeId 
     */
    public showNodeInfoWindowWithHttpInfo(nodeId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeInfoWindowVo>> {
        const requestContextPromise = this.requestFactory.showNodeInfoWindow(nodeId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.showNodeInfoWindowWithHttpInfo(rsp)));
            }));
    }

    /**
     * Nodes that are not in the center of the template, make spatial judgments.
     * Node info window
     * @param nodeId 
     */
    public showNodeInfoWindow(nodeId: string, _options?: Configuration): Observable<ResponseDataNodeInfoWindowVo> {
        return this.showNodeInfoWindowWithHttpInfo(nodeId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeInfoWindowVo>) => apiResponse.data));
    }

    /**
     * Nodes that are not in the center of the template, make cross-space judgments.
     * Folder preview
     * @param nodeId node id
     * @param shareId share id
     */
    public showcaseWithHttpInfo(nodeId: string, shareId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataShowcaseVo>> {
        const requestContextPromise = this.requestFactory.showcase(nodeId, shareId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.showcaseWithHttpInfo(rsp)));
            }));
    }

    /**
     * Nodes that are not in the center of the template, make cross-space judgments.
     * Folder preview
     * @param nodeId node id
     * @param shareId share id
     */
    public showcase(nodeId: string, shareId?: string, _options?: Configuration): Observable<ResponseDataShowcaseVo> {
        return this.showcaseWithHttpInfo(nodeId, shareId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataShowcaseVo>) => apiResponse.data));
    }

    /**
     * node id must. name, icon is not required<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Edit node
     * @param nodeUpdateOpRo 
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public update3WithHttpInfo(nodeUpdateOpRo: NodeUpdateOpRo, nodeId: string, xSocketId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeInfoVo>> {
        const requestContextPromise = this.requestFactory.update3(nodeUpdateOpRo, nodeId, xSocketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.update3WithHttpInfo(rsp)));
            }));
    }

    /**
     * node id must. name, icon is not required<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>
     * Edit node
     * @param nodeUpdateOpRo 
     * @param nodeId node id
     * @param xSocketId user socket id
     */
    public update3(nodeUpdateOpRo: NodeUpdateOpRo, nodeId: string, xSocketId?: string, _options?: Configuration): Observable<ResponseDataNodeInfoVo> {
        return this.update3WithHttpInfo(nodeUpdateOpRo, nodeId, xSocketId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeInfoVo>) => apiResponse.data));
    }

    /**
     * Update node description
     * @param nodeDescOpRo 
     * @param xSocketId user socket id
     */
    public updateDescWithHttpInfo(nodeDescOpRo: NodeDescOpRo, xSocketId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.updateDesc(nodeDescOpRo, xSocketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateDescWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update node description
     * @param nodeDescOpRo 
     * @param xSocketId user socket id
     */
    public updateDesc(nodeDescOpRo: NodeDescOpRo, xSocketId?: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.updateDescWithHttpInfo(nodeDescOpRo, xSocketId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { WorkbenchNodeFavoriteApiApiRequestFactory, WorkbenchNodeFavoriteApiApiResponseProcessor} from "../apis/WorkbenchNodeFavoriteApiApi";
export class ObservableWorkbenchNodeFavoriteApiApi {
    private requestFactory: WorkbenchNodeFavoriteApiApiRequestFactory;
    private responseProcessor: WorkbenchNodeFavoriteApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: WorkbenchNodeFavoriteApiApiRequestFactory,
        responseProcessor?: WorkbenchNodeFavoriteApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new WorkbenchNodeFavoriteApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new WorkbenchNodeFavoriteApiApiResponseProcessor();
    }

    /**
     * Get favorite nodes
     * @param xSpaceId space id
     */
    public list5WithHttpInfo(xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListFavoriteNodeInfo>> {
        const requestContextPromise = this.requestFactory.list5(xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.list5WithHttpInfo(rsp)));
            }));
    }

    /**
     * Get favorite nodes
     * @param xSpaceId space id
     */
    public list5(xSpaceId: string, _options?: Configuration): Observable<ResponseDataListFavoriteNodeInfo> {
        return this.list5WithHttpInfo(xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListFavoriteNodeInfo>) => apiResponse.data));
    }

    /**
     * Move favorite node
     * @param markNodeMoveRo 
     * @param xSpaceId space id
     */
    public move1WithHttpInfo(markNodeMoveRo: MarkNodeMoveRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.move1(markNodeMoveRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.move1WithHttpInfo(rsp)));
            }));
    }

    /**
     * Move favorite node
     * @param markNodeMoveRo 
     * @param xSpaceId space id
     */
    public move1(markNodeMoveRo: MarkNodeMoveRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.move1WithHttpInfo(markNodeMoveRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Change favorite status
     * @param nodeId node id
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public updateStatusWithHttpInfo(nodeId: string, xSpaceId: string, xSocketId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.updateStatus(nodeId, xSpaceId, xSocketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateStatusWithHttpInfo(rsp)));
            }));
    }

    /**
     * Change favorite status
     * @param nodeId node id
     * @param xSpaceId space id
     * @param xSocketId user socket id
     */
    public updateStatus(nodeId: string, xSpaceId: string, xSocketId?: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.updateStatusWithHttpInfo(nodeId, xSpaceId, xSocketId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

}

import { WorkbenchNodeRoleApiApiRequestFactory, WorkbenchNodeRoleApiApiResponseProcessor} from "../apis/WorkbenchNodeRoleApiApi";
export class ObservableWorkbenchNodeRoleApiApi {
    private requestFactory: WorkbenchNodeRoleApiApiRequestFactory;
    private responseProcessor: WorkbenchNodeRoleApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: WorkbenchNodeRoleApiApiRequestFactory,
        responseProcessor?: WorkbenchNodeRoleApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new WorkbenchNodeRoleApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new WorkbenchNodeRoleApiApiResponseProcessor();
    }

    /**
     * Scene: Collaborator Card Information
     * Get Collaborator Info
     * @param uuid 
     * @param nodeId 
     * @param xSpaceId space id
     */
    public getCollaboratorInfoWithHttpInfo(uuid: string, nodeId: string, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeCollaboratorVO>> {
        const requestContextPromise = this.requestFactory.getCollaboratorInfo(uuid, nodeId, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getCollaboratorInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * Scene: Collaborator Card Information
     * Get Collaborator Info
     * @param uuid 
     * @param nodeId 
     * @param xSpaceId space id
     */
    public getCollaboratorInfo(uuid: string, nodeId: string, xSpaceId: string, _options?: Configuration): Observable<ResponseDataNodeCollaboratorVO> {
        return this.getCollaboratorInfoWithHttpInfo(uuid, nodeId, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeCollaboratorVO>) => apiResponse.data));
    }

}

import { WorkbenchNodeRubbishApiApiRequestFactory, WorkbenchNodeRubbishApiApiResponseProcessor} from "../apis/WorkbenchNodeRubbishApiApi";
export class ObservableWorkbenchNodeRubbishApiApi {
    private requestFactory: WorkbenchNodeRubbishApiApiRequestFactory;
    private responseProcessor: WorkbenchNodeRubbishApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: WorkbenchNodeRubbishApiApiRequestFactory,
        responseProcessor?: WorkbenchNodeRubbishApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new WorkbenchNodeRubbishApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new WorkbenchNodeRubbishApiApiResponseProcessor();
    }

    /**
     * Delete node in rubbish
     * @param nodeId node id
     * @param xSpaceId space id
     */
    public _deleteWithHttpInfo(nodeId: string, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory._delete(nodeId, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor._deleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete node in rubbish
     * @param nodeId node id
     * @param xSpaceId space id
     */
    public _delete(nodeId: string, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this._deleteWithHttpInfo(nodeId, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Delete node in rubbish
     * @param nodeId node id
     * @param xSpaceId space id
     */
    public delete1WithHttpInfo(nodeId: string, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.delete1(nodeId, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.delete1WithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete node in rubbish
     * @param nodeId node id
     * @param xSpaceId space id
     */
    public delete1(nodeId: string, xSpaceId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.delete1WithHttpInfo(nodeId, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * If the last node id is passed in, the service status code 422 is returned.It means that the node is no longer in the recovery compartment, the positioning fails, and the last node can be requested again.
     * Get node in rubbish
     * @param xSpaceId space id
     * @param size expected load quantity（May be because the total number or permissions are not enough）
     * @param isOverLimit whether to request an overrun node（default FALSE）
     * @param lastNodeId id of the last node in the loaded list
     */
    public list3WithHttpInfo(xSpaceId: string, size?: number, isOverLimit?: boolean, lastNodeId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataListRubbishNodeVo>> {
        const requestContextPromise = this.requestFactory.list3(xSpaceId, size, isOverLimit, lastNodeId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.list3WithHttpInfo(rsp)));
            }));
    }

    /**
     * If the last node id is passed in, the service status code 422 is returned.It means that the node is no longer in the recovery compartment, the positioning fails, and the last node can be requested again.
     * Get node in rubbish
     * @param xSpaceId space id
     * @param size expected load quantity（May be because the total number or permissions are not enough）
     * @param isOverLimit whether to request an overrun node（default FALSE）
     * @param lastNodeId id of the last node in the loaded list
     */
    public list3(xSpaceId: string, size?: number, isOverLimit?: boolean, lastNodeId?: string, _options?: Configuration): Observable<ResponseDataListRubbishNodeVo> {
        return this.list3WithHttpInfo(xSpaceId, size, isOverLimit, lastNodeId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataListRubbishNodeVo>) => apiResponse.data));
    }

    /**
     * Recover node
     * @param nodeRecoverRo 
     * @param xSpaceId space id
     */
    public recoverWithHttpInfo(nodeRecoverRo: NodeRecoverRo, xSpaceId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeInfoVo>> {
        const requestContextPromise = this.requestFactory.recover(nodeRecoverRo, xSpaceId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.recoverWithHttpInfo(rsp)));
            }));
    }

    /**
     * Recover node
     * @param nodeRecoverRo 
     * @param xSpaceId space id
     */
    public recover(nodeRecoverRo: NodeRecoverRo, xSpaceId: string, _options?: Configuration): Observable<ResponseDataNodeInfoVo> {
        return this.recoverWithHttpInfo(nodeRecoverRo, xSpaceId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeInfoVo>) => apiResponse.data));
    }

}

import { WorkbenchNodeShareApiApiRequestFactory, WorkbenchNodeShareApiApiResponseProcessor} from "../apis/WorkbenchNodeShareApiApi";
export class ObservableWorkbenchNodeShareApiApi {
    private requestFactory: WorkbenchNodeShareApiApiRequestFactory;
    private responseProcessor: WorkbenchNodeShareApiApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: WorkbenchNodeShareApiApiRequestFactory,
        responseProcessor?: WorkbenchNodeShareApiApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new WorkbenchNodeShareApiApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new WorkbenchNodeShareApiApiResponseProcessor();
    }

    /**
     * Disable node sharing
     * @param nodeId node id
     */
    public disableShareWithHttpInfo(nodeId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataVoid>> {
        const requestContextPromise = this.requestFactory.disableShare(nodeId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.disableShareWithHttpInfo(rsp)));
            }));
    }

    /**
     * Disable node sharing
     * @param nodeId node id
     */
    public disableShare(nodeId: string, _options?: Configuration): Observable<ResponseDataVoid> {
        return this.disableShareWithHttpInfo(nodeId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataVoid>) => apiResponse.data));
    }

    /**
     * Get node share info
     * @param nodeId node id
     */
    public nodeShareInfoWithHttpInfo(nodeId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeShareSettingInfoVO>> {
        const requestContextPromise = this.requestFactory.nodeShareInfo(nodeId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.nodeShareInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get node share info
     * @param nodeId node id
     */
    public nodeShareInfo(nodeId: string, _options?: Configuration): Observable<ResponseDataNodeShareSettingInfoVO> {
        return this.nodeShareInfoWithHttpInfo(nodeId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeShareSettingInfoVO>) => apiResponse.data));
    }

    /**
     * get shared content according to share id
     * Get share node info
     * @param shareId share id
     */
    public readShareInfoWithHttpInfo(shareId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataNodeShareInfoVO>> {
        const requestContextPromise = this.requestFactory.readShareInfo(shareId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.readShareInfoWithHttpInfo(rsp)));
            }));
    }

    /**
     * get shared content according to share id
     * Get share node info
     * @param shareId share id
     */
    public readShareInfo(shareId: string, _options?: Configuration): Observable<ResponseDataNodeShareInfoVO> {
        return this.readShareInfoWithHttpInfo(shareId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataNodeShareInfoVO>) => apiResponse.data));
    }

    /**
     * Sotre share data
     * @param storeShareNodeRo 
     * @param xSocketId user socket id
     */
    public storeShareDataWithHttpInfo(storeShareNodeRo: StoreShareNodeRo, xSocketId?: string, _options?: Configuration): Observable<HttpInfo<ResponseDataStoreNodeInfoVO>> {
        const requestContextPromise = this.requestFactory.storeShareData(storeShareNodeRo, xSocketId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.storeShareDataWithHttpInfo(rsp)));
            }));
    }

    /**
     * Sotre share data
     * @param storeShareNodeRo 
     * @param xSocketId user socket id
     */
    public storeShareData(storeShareNodeRo: StoreShareNodeRo, xSocketId?: string, _options?: Configuration): Observable<ResponseDataStoreNodeInfoVO> {
        return this.storeShareDataWithHttpInfo(storeShareNodeRo, xSocketId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataStoreNodeInfoVO>) => apiResponse.data));
    }

    /**
     * Update node share setting  stringObjectParams share setting parameter description: <br/> There are three option parameters for sharing settings. Only one can be set true, and more than two cannot be set to true at the same time.<br/>onlyRead: Bool, whether to set sharing only for others to view.<br/>canBeEdited: Bool, whether to set up sharing to others for collaborative editing.<br/>canBeStored: Bool, whether to set up sharing to others and save as a copy.<br/>Example: Set <Share Only for Others to View>, parameters:{\"onlyRead\": true}
     * Update node share setting
     * @param updateNodeShareSettingRo 
     * @param nodeId node id
     */
    public updateNodeShareWithHttpInfo(updateNodeShareSettingRo: UpdateNodeShareSettingRo, nodeId: string, _options?: Configuration): Observable<HttpInfo<ResponseDataShareBaseInfoVo>> {
        const requestContextPromise = this.requestFactory.updateNodeShare(updateNodeShareSettingRo, nodeId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateNodeShareWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update node share setting  stringObjectParams share setting parameter description: <br/> There are three option parameters for sharing settings. Only one can be set true, and more than two cannot be set to true at the same time.<br/>onlyRead: Bool, whether to set sharing only for others to view.<br/>canBeEdited: Bool, whether to set up sharing to others for collaborative editing.<br/>canBeStored: Bool, whether to set up sharing to others and save as a copy.<br/>Example: Set <Share Only for Others to View>, parameters:{\"onlyRead\": true}
     * Update node share setting
     * @param updateNodeShareSettingRo 
     * @param nodeId node id
     */
    public updateNodeShare(updateNodeShareSettingRo: UpdateNodeShareSettingRo, nodeId: string, _options?: Configuration): Observable<ResponseDataShareBaseInfoVo> {
        return this.updateNodeShareWithHttpInfo(updateNodeShareSettingRo, nodeId, _options).pipe(map((apiResponse: HttpInfo<ResponseDataShareBaseInfoVo>) => apiResponse.data));
    }

}
