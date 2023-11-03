export * from "./http/http";
export * from "./auth/auth";
export * from "./models/all";
export { createConfiguration } from "./configuration"
export { Configuration } from "./configuration"
export * from "./apis/exception";
export * from "./servers";
export { RequiredError } from "./apis/baseapi";

export { PromiseMiddleware as Middleware } from './middleware';
export { AIApiCreateFeedback1Request, AIApiGetConversationFeedback1Request, AIApiGetCreditUsageRequest, AIApiGetLastTrainingStatus1Request, AIApiGetMessagePagination1Request, AIApiGetMessagesFeedback1Request, AIApiGetSuggestions1Request, AIApiRetrieve1Request, AIApiRetrieveSettingRequest, AIApiRetrieveTrainingsRequest, AIApiSendMessage1Request, AIApiTrain1Request, AIApiTrainPredict1Request, AIApiUpdate1Request, AIApiUpdateFeedback1Request, ObjectAIApi as AIApi,  AccountCenterModuleUserManagementInterfaceApiApplyForClosingRequest, AccountCenterModuleUserManagementInterfaceApiBindEmailRequest, AccountCenterModuleUserManagementInterfaceApiCancelClosingRequest, AccountCenterModuleUserManagementInterfaceApiCheckForClosingRequest, AccountCenterModuleUserManagementInterfaceApiDelActiveSpaceCacheRequest, AccountCenterModuleUserManagementInterfaceApiGetEnabledLabFeaturesRequest, AccountCenterModuleUserManagementInterfaceApiLinkInviteEmailRequest, AccountCenterModuleUserManagementInterfaceApiResetPasswordRequest, AccountCenterModuleUserManagementInterfaceApiRetrievePwdRequest, AccountCenterModuleUserManagementInterfaceApiUnbindEmailRequest, AccountCenterModuleUserManagementInterfaceApiUnbindPhoneRequest, AccountCenterModuleUserManagementInterfaceApiUpdate2Request, AccountCenterModuleUserManagementInterfaceApiUpdateLabsFeatureStatusRequest, AccountCenterModuleUserManagementInterfaceApiUpdatePwdRequest, AccountCenterModuleUserManagementInterfaceApiUserInfoRequest, AccountCenterModuleUserManagementInterfaceApiValidBindEmailRequest, AccountCenterModuleUserManagementInterfaceApiValidSameEmailRequest, AccountCenterModuleUserManagementInterfaceApiVerifyPhoneRequest, ObjectAccountCenterModuleUserManagementInterfaceApi as AccountCenterModuleUserManagementInterfaceApi,  AccountLinkManagementInterfaceApiBindDingTalkRequest, AccountLinkManagementInterfaceApiUnbindRequest, ObjectAccountLinkManagementInterfaceApi as AccountLinkManagementInterfaceApi,  AirAgentAIAgentResourceApiCreate11Request, AirAgentAIAgentResourceApiCreateFeedbackRequest, AirAgentAIAgentResourceApiDelete18Request, AirAgentAIAgentResourceApiGetConversationFeedbackRequest, AirAgentAIAgentResourceApiGetLastTrainingStatusRequest, AirAgentAIAgentResourceApiGetMessagePaginationRequest, AirAgentAIAgentResourceApiGetMessagesFeedbackRequest, AirAgentAIAgentResourceApiGetSuggestionsRequest, AirAgentAIAgentResourceApiList8Request, AirAgentAIAgentResourceApiRetrieveRequest, AirAgentAIAgentResourceApiSendMessageRequest, AirAgentAIAgentResourceApiTrainRequest, AirAgentAIAgentResourceApiTrainPredictRequest, AirAgentAIAgentResourceApiUpdateRequest, AirAgentAIAgentResourceApiUpdateFeedbackRequest, ObjectAirAgentAIAgentResourceApi as AirAgentAIAgentResourceApi,  AirAgentAuthResourceApiCallback5Request, AirAgentAuthResourceApiLogin4Request, AirAgentAuthResourceApiLogout2Request, AirAgentAuthResourceApiLogout3Request, ObjectAirAgentAuthResourceApi as AirAgentAuthResourceApi,  AirAgentUserResourceApiGetUserProfileRequest, ObjectAirAgentUserResourceApi as AirAgentUserResourceApi,  AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiFetchAppStoreAppsRequest, ObjectAppStoreRelevantServiceInterfacesOfTheApplicationStoreApi as AppStoreRelevantServiceInterfacesOfTheApplicationStoreApi,  ApplicationManagementApplicationManagementRelatedServiceInterfaceApiCreateAppInstanceRequest, ApplicationManagementApplicationManagementRelatedServiceInterfaceApiDelete17Request, ApplicationManagementApplicationManagementRelatedServiceInterfaceApiFetchAppInstancesRequest, ApplicationManagementApplicationManagementRelatedServiceInterfaceApiGetAppInstanceRequest, ObjectApplicationManagementApplicationManagementRelatedServiceInterfaceApi as ApplicationManagementApplicationManagementRelatedServiceInterfaceApi,  ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiEventConfigRequest, ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApiInitConfigRequest, ObjectApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi as ApplicationManagementLarkSelfBuiltApplicationConfigurationInterfaceApi,  ApplicationMarketApplicationAPIApiBlockSpaceAppRequest, ApplicationMarketApplicationAPIApiGetSpaceAppListRequest, ApplicationMarketApplicationAPIApiOpenSpaceAppRequest, ObjectApplicationMarketApplicationAPIApi as ApplicationMarketApplicationAPIApi,  Auth0ControllerApiCallback4Request, Auth0ControllerApiInvitationCallbackRequest, Auth0ControllerApiLogin3Request, ObjectAuth0ControllerApi as Auth0ControllerApi,  AuthorizationRelatedInterfaceApiLoginRequest, AuthorizationRelatedInterfaceApiLogoutRequest, AuthorizationRelatedInterfaceApiLogout1Request, AuthorizationRelatedInterfaceApiRegisterRequest, ObjectAuthorizationRelatedInterfaceApi as AuthorizationRelatedInterfaceApi,  AutoNaviInterfaceApiProxyRequest, ObjectAutoNaviInterfaceApi as AutoNaviInterfaceApi,  AutomationApiCreateActionRequest, AutomationApiCreateTriggerRequest, AutomationApiDeleteActionRequest, AutomationApiDeleteRobotRequest, AutomationApiDeleteTriggerRequest, AutomationApiGetNodeRobotRequest, AutomationApiGetResourceRobotsRequest, AutomationApiGetRunHistoryRequest, AutomationApiModifyRobotRequest, AutomationApiUpdateActionRequest, AutomationApiUpdateTriggerRequest, ObjectAutomationApi as AutomationApi,  AutomationAPIApiCreate9Request, AutomationAPIApiDelete12Request, AutomationAPIApiEdit4Request, ObjectAutomationAPIApi as AutomationAPIApi,  AutomationActionTypeAPIApiCreate10Request, AutomationActionTypeAPIApiDelete13Request, AutomationActionTypeAPIApiEdit5Request, ObjectAutomationActionTypeAPIApi as AutomationActionTypeAPIApi,  AutomationOpenApiControllerApiCreateOrUpdateTriggerRequest, AutomationOpenApiControllerApiDeleteTrigger1Request, ObjectAutomationOpenApiControllerApi as AutomationOpenApiControllerApi,  AutomationTriggerTypeAPIApiCreate8Request, AutomationTriggerTypeAPIApiDelete11Request, AutomationTriggerTypeAPIApiEdit3Request, ObjectAutomationTriggerTypeAPIApi as AutomationTriggerTypeAPIApi,  BasicModuleAccessoryCallbackInterfaceApiNotifyCallbackRequest, BasicModuleAccessoryCallbackInterfaceApiWidgetCallbackRequest, ObjectBasicModuleAccessoryCallbackInterfaceApi as BasicModuleAccessoryCallbackInterfaceApi,  BasicModuleAttachmentInterfaceApiCiteRequest, BasicModuleAttachmentInterfaceApiReadReviewsRequest, BasicModuleAttachmentInterfaceApiSubmitAuditResultRequest, BasicModuleAttachmentInterfaceApiUploadRequest, BasicModuleAttachmentInterfaceApiUrlUploadRequest, ObjectBasicModuleAttachmentInterfaceApi as BasicModuleAttachmentInterfaceApi,  BasicModuleVerifyActionModuleInterfaceApiInviteTokenValidRequest, BasicModuleVerifyActionModuleInterfaceApiMailRequest, BasicModuleVerifyActionModuleInterfaceApiSendRequest, BasicModuleVerifyActionModuleInterfaceApiValidateEmailRequest, BasicModuleVerifyActionModuleInterfaceApiVerifyPhone1Request, ObjectBasicModuleVerifyActionModuleInterfaceApi as BasicModuleVerifyActionModuleInterfaceApi,  BasicsAttachmentUploadTokenInterfaceApiGeneratePreSignedUrlRequest, BasicsAttachmentUploadTokenInterfaceApiGetSignatureUrlRequest, BasicsAttachmentUploadTokenInterfaceApiGetSignatureUrlsRequest, ObjectBasicsAttachmentUploadTokenInterfaceApi as BasicsAttachmentUploadTokenInterfaceApi,  BillingCapacityApiApiGetCapacityDetailRequest, ObjectBillingCapacityApiApi as BillingCapacityApiApi,  BillingControllerApiCancelSubscriptionRequest, BillingControllerApiChangePaymentMethodRequest, BillingControllerApiCustomerPortalUrlRequest, BillingControllerApiGetInvoicesRequest, BillingControllerApiGetSubscriptionsRequest, BillingControllerApiUpdateSubscriptionRequest, BillingControllerApiUpdateSubscriptionConfirmRequest, ObjectBillingControllerApi as BillingControllerApi,  BillingEventApiApiFetchEventListRequest, ObjectBillingEventApiApi as BillingEventApiApi,  BillingOrderAPIApiCheckOrderPaidStatusRequest, BillingOrderAPIApiCreateOrderRequest, BillingOrderAPIApiCreateOrderPaymentRequest, BillingOrderAPIApiFetchOrderByIdRequest, BillingOrderAPIApiGenerateDryRunOrderRequest, BillingOrderAPIApiGetOrderPaidStatusRequest, ObjectBillingOrderAPIApi as BillingOrderAPIApi,  CheckoutControllerApiCreateCheckoutRequest, ObjectCheckoutControllerApi as CheckoutControllerApi,  CliAuthorizationAPIApiAuthLoginRequest, CliAuthorizationAPIApiGraphqlRequest, CliAuthorizationAPIApiNewAppletRequest, CliAuthorizationAPIApiNewTokenRequest, CliAuthorizationAPIApiNewWebhookRequest, CliAuthorizationAPIApiPublishAppletRequest, CliAuthorizationAPIApiShowAppletsRequest, CliAuthorizationAPIApiShowSpacesRequest, CliAuthorizationAPIApiShowWebhooksRequest, CliAuthorizationAPIApiUploadPluginRequest, ObjectCliAuthorizationAPIApi as CliAuthorizationAPIApi,  CliOfficeBanAPIApiBanSpaceRequest, CliOfficeBanAPIApiBanUserRequest, ObjectCliOfficeBanAPIApi as CliOfficeBanAPIApi,  CliOfficeGMAPIApiActivityRewardRequest, CliOfficeGMAPIApiAddPlayerNotifyRequest, CliOfficeGMAPIApiApplyLabsFeatureRequest, CliOfficeGMAPIApiAssignActivityRequest, CliOfficeGMAPIApiCloseAccountDirectlyRequest, CliOfficeGMAPIApiConfigRequest, CliOfficeGMAPIApiCreateLabsFeatureRequest, CliOfficeGMAPIApiCreateUserRequest, CliOfficeGMAPIApiCreateUsersRequest, CliOfficeGMAPIApiDeductRequest, CliOfficeGMAPIApiDeleteLabsFeatureRequest, CliOfficeGMAPIApiEnableChatbotRequest, CliOfficeGMAPIApiFeishuTenantEventRequest, CliOfficeGMAPIApiGet1Request, CliOfficeGMAPIApiLockRequest, CliOfficeGMAPIApiResetActivityRequest, CliOfficeGMAPIApiRevokePlayerNotifyRequest, CliOfficeGMAPIApiSyncDingTalkAppRequest, CliOfficeGMAPIApiUnlockRequest, CliOfficeGMAPIApiUpdateLabsFeaturesAttributeRequest, CliOfficeGMAPIApiUpdatePermissionRequest, CliOfficeGMAPIApiUserContactInfoQueryRequest, ObjectCliOfficeGMAPIApi as CliOfficeGMAPIApi,  ClientInterfaceApiGetTemplateInfoRequest, ObjectClientInterfaceApi as ClientInterfaceApi,  ConfigurationRelatedInterfacesApiGeneralRequest, ConfigurationRelatedInterfacesApiGet2Request, ObjectConfigurationRelatedInterfacesApi as ConfigurationRelatedInterfacesApi,  ContactMemberApiApiAddMemberRequest, ContactMemberApiApiCheckEmailInSpaceRequest, ContactMemberApiApiDeleteBatchMemberRequest, ContactMemberApiApiDeleteMemberRequest, ContactMemberApiApiDownloadTemplateRequest, ContactMemberApiApiGetMemberListRequest, ContactMemberApiApiGetMembersRequest, ContactMemberApiApiGetUnitsRequest, ContactMemberApiApiInviteMemberRequest, ContactMemberApiApiInviteMemberSingleRequest, ContactMemberApiApiRead1Request, ContactMemberApiApiReadPageRequest, ContactMemberApiApiUpdate4Request, ContactMemberApiApiUpdateInfoRequest, ContactMemberApiApiUpdateTeam1Request, ContactMemberApiApiUploadExcelRequest, ObjectContactMemberApiApi as ContactMemberApiApi,  ContactOrganizationApiApiGetSubUnitListRequest, ContactOrganizationApiApiLoadOrSearchRequest, ContactOrganizationApiApiSearchRequest, ContactOrganizationApiApiSearchSubTeamAndMembersRequest, ContactOrganizationApiApiSearchTeamInfoRequest, ContactOrganizationApiApiSearchUnitInfoVoRequest, ObjectContactOrganizationApiApi as ContactOrganizationApiApi,  ContactsRoleApiApiAddRoleMembersRequest, ContactsRoleApiApiCreateRoleRequest, ContactsRoleApiApiDeleteRole1Request, ContactsRoleApiApiGetRoleMembersRequest, ContactsRoleApiApiGetRolesRequest, ContactsRoleApiApiInitRolesRequest, ContactsRoleApiApiRemoveRoleMembersRequest, ContactsRoleApiApiUpdateRoleRequest, ObjectContactsRoleApiApi as ContactsRoleApiApi,  ContactsTeamApiApiCreateTeamRequest, ContactsTeamApiApiDeleteTeamRequest, ContactsTeamApiApiGetSubTeamsRequest, ContactsTeamApiApiGetTeamBranchRequest, ContactsTeamApiApiGetTeamMembersRequest, ContactsTeamApiApiGetTeamTreeRequest, ContactsTeamApiApiReadTeamInfoRequest, ContactsTeamApiApiUpdateTeamRequest, ObjectContactsTeamApiApi as ContactsTeamApiApi,  ContentRiskControlAPIApiCreateReportsRequest, ContentRiskControlAPIApiReadReportsRequest, ContentRiskControlAPIApiUpdateReportsRequest, ObjectContentRiskControlAPIApi as ContentRiskControlAPIApi,  DeveloperConfigAPIApiCreateApiKeyRequest, DeveloperConfigAPIApiRefreshApiKeyRequest, DeveloperConfigAPIApiValidateApiKeyRequest, ObjectDeveloperConfigAPIApi as DeveloperConfigAPIApi,  DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApiLogin1Request, ObjectDingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi as DingTalkEnterpriseInternalApplicationRelatedServiceInterfaceApi,  DingTalkServiceInterfaceApiCallback3Request, ObjectDingTalkServiceInterfaceApi as DingTalkServiceInterfaceApi,  GMWidgetAPIApiBanWidgetRequest, GMWidgetAPIApiGlobalWidgetDbDataRefreshRequest, GMWidgetAPIApiGlobalWidgetListRequest, ObjectGMWidgetAPIApi as GMWidgetAPIApi,  IDaaSAddressBookApiPostSyncRequest, ObjectIDaaSAddressBookApi as IDaaSAddressBookApi,  IDaaSLoginAuthorizationApiGetBindInfoRequest, IDaaSLoginAuthorizationApiGetLoginRequest, IDaaSLoginAuthorizationApiGetLoginRedirectRequest, IDaaSLoginAuthorizationApiPostCallback1Request, IDaaSLoginAuthorizationApiPostSpaceCallbackRequest, ObjectIDaaSLoginAuthorizationApi as IDaaSLoginAuthorizationApi,  IntegralApiApiIntegralRecordsRequest, IntegralApiApiIntegralsRequest, IntegralApiApiInviteCodeRewardRequest, ObjectIntegralApiApi as IntegralApiApi,  InternalContactsApiApiCreateUnitRoleRequest, InternalContactsApiApiCreateUnitTeamRequest, InternalContactsApiApiDeleteMember1Request, InternalContactsApiApiDeleteUnitRoleRequest, InternalContactsApiApiDeleteUnitTeamRequest, InternalContactsApiApiGetRolePageListRequest, InternalContactsApiApiGetTeamChildrenPageListRequest, InternalContactsApiApiGetTeamMembersPageInfoRequest, InternalContactsApiApiGetUnitMemberDetailsRequest, InternalContactsApiApiGetUnitRoleMembersRequest, InternalContactsApiApiUpdateUnitMemberRequest, InternalContactsApiApiUpdateUnitRoleRequest, InternalContactsApiApiUpdateUnitTeamRequest, ObjectInternalContactsApiApi as InternalContactsApiApi,  InternalServerAssetAPIApiGetRequest, InternalServerAssetAPIApiGetSignatureUrls1Request, InternalServerAssetAPIApiGetSpaceCapacity1Request, ObjectInternalServerAssetAPIApi as InternalServerAssetAPIApi,  InternalServerOrgAPIApiLoadOrSearch1Request, ObjectInternalServerOrgAPIApi as InternalServerOrgAPIApi,  InternalServiceDataTableFieldPermissionInterfaceApiDisableRolesRequest, InternalServiceDataTableFieldPermissionInterfaceApiGetFieldPermissionRequest, InternalServiceDataTableFieldPermissionInterfaceApiGetMultiFieldPermissionViewsRequest, ObjectInternalServiceDataTableFieldPermissionInterfaceApi as InternalServiceDataTableFieldPermissionInterfaceApi,  InternalServiceEnterpriseMicroInterfaceApiPostPermitDelayBatchProcessRequest, ObjectInternalServiceEnterpriseMicroInterfaceApi as InternalServiceEnterpriseMicroInterfaceApi,  InternalServiceFieldServiceInterfaceApiUrlContentsAwareFillRequest, ObjectInternalServiceFieldServiceInterfaceApi as InternalServiceFieldServiceInterfaceApi,  InternalServiceNodeInterfaceApiCreateDatasheetRequest, InternalServiceNodeInterfaceApiDeleteNodeRequest, InternalServiceNodeInterfaceApiFilterRequest, ObjectInternalServiceNodeInterfaceApi as InternalServiceNodeInterfaceApi,  InternalServiceNodePermissionInterfaceApiGetMultiNodePermissionsRequest, InternalServiceNodePermissionInterfaceApiGetNodePermissionRequest, ObjectInternalServiceNodePermissionInterfaceApi as InternalServiceNodePermissionInterfaceApi,  InternalServiceNotificationInterfaceApiCreate7Request, ObjectInternalServiceNotificationInterfaceApi as InternalServiceNotificationInterfaceApi,  InternalServiceSpaceInterfaceApiApiRateLimitRequest, InternalServiceSpaceInterfaceApiApiUsagesRequest, InternalServiceSpaceInterfaceApiGetAutomationRunMessageRequest, InternalServiceSpaceInterfaceApiGetCreditUsages1Request, InternalServiceSpaceInterfaceApiGetSpaceCapacityRequest, InternalServiceSpaceInterfaceApiGetSpaceSubscriptionRequest, InternalServiceSpaceInterfaceApiGetSpaceUsagesRequest, InternalServiceSpaceInterfaceApiLabsRequest, InternalServiceSpaceInterfaceApiStatisticsRequest, ObjectInternalServiceSpaceInterfaceApi as InternalServiceSpaceInterfaceApi,  InternalServiceUserInterfaceApiClosePausedUserAccountRequest, InternalServiceUserInterfaceApiGetPausedUsersRequest, InternalServiceUserInterfaceApiGetUserHistoriesRequest, InternalServiceUserInterfaceApiMeSessionRequest, InternalServiceUserInterfaceApiUserBaseInfoRequest, ObjectInternalServiceUserInterfaceApi as InternalServiceUserInterfaceApi,  K11LoginInterfaceApiLoginBySsoTokenRequest, ObjectK11LoginInterfaceApi as K11LoginInterfaceApi,  LaboratoryModuleExperimentalFunctionInterfaceApiShowAvailableLabsFeaturesRequest, ObjectLaboratoryModuleExperimentalFunctionInterfaceApi as LaboratoryModuleExperimentalFunctionInterfaceApi,  LarkInterfaceApiChangeAdminRequest, LarkInterfaceApiGetTenantInfo1Request, ObjectLarkInterfaceApi as LarkInterfaceApi,  MigrationResourcesAPIApiMigrationResourcesRequest, ObjectMigrationResourcesAPIApi as MigrationResourcesAPIApi,  OfficeOperationAPIApiOfficePreviewRequest, ObjectOfficeOperationAPIApi as OfficeOperationAPIApi,  OpenApiApiValidateApiKey1Request, ObjectOpenApiApi as OpenApiApi,  PlayerSystemActivityAPIApiTriggerWizardRequest, ObjectPlayerSystemActivityAPIApi as PlayerSystemActivityAPIApi,  PlayerSystemNotificationAPIApiCreate5Request, PlayerSystemNotificationAPIApiDelete10Request, PlayerSystemNotificationAPIApiList4Request, PlayerSystemNotificationAPIApiPage3Request, PlayerSystemNotificationAPIApiReadRequest, PlayerSystemNotificationAPIApiStatistics1Request, ObjectPlayerSystemNotificationAPIApi as PlayerSystemNotificationAPIApi,  ProductControllerApiGetListRequest, ObjectProductControllerApi as ProductControllerApi,  ProductOperationSystemAPIApiMarkTemplateAssetRequest, ObjectProductOperationSystemAPIApi as ProductOperationSystemAPIApi,  ProductOperationSystemTemplateAPIApiCreateTemplateCategoryRequest, ProductOperationSystemTemplateAPIApiDeleteTemplateCategoryRequest, ProductOperationSystemTemplateAPIApiPublishRequest, ProductOperationSystemTemplateAPIApiUnpublishRequest, ObjectProductOperationSystemTemplateAPIApi as ProductOperationSystemTemplateAPIApi,  ProductOperationSystemUserAPIApiUpdatePwd1Request, ObjectProductOperationSystemUserAPIApi as ProductOperationSystemUserAPIApi,  SpaceApplyJoiningSpaceApiApiApplyRequest, SpaceApplyJoiningSpaceApiApiProcessRequest, ObjectSpaceApplyJoiningSpaceApiApi as SpaceApplyJoiningSpaceApiApi,  SpaceAuditApiApiAuditRequest, ObjectSpaceAuditApiApi as SpaceAuditApiApi,  SpaceInviteLinkApiApiDelete15Request, SpaceInviteLinkApiApiGenerateRequest, SpaceInviteLinkApiApiJoinRequest, SpaceInviteLinkApiApiList3Request, SpaceInviteLinkApiApiValidRequest, ObjectSpaceInviteLinkApiApi as SpaceInviteLinkApiApi,  SpaceMainAdminApiApiGetMainAdminInfoRequest, SpaceMainAdminApiApiReplaceRequest, ObjectSpaceMainAdminApiApi as SpaceMainAdminApiApi,  SpaceSpaceApiApiCancelRequest, SpaceSpaceApiApiCapacityRequest, SpaceSpaceApiApiCreate4Request, SpaceSpaceApiApiDelRequest, SpaceSpaceApiApiDelete16Request, SpaceSpaceApiApiFeatureRequest, SpaceSpaceApiApiGetCreditUsagesRequest, SpaceSpaceApiApiGetSpaceResourceRequest, SpaceSpaceApiApiInfo1Request, SpaceSpaceApiApiList2Request, SpaceSpaceApiApiQuitRequest, SpaceSpaceApiApiRemoveRequest, SpaceSpaceApiApiSubscribeRequest, SpaceSpaceApiApiSwitchSpaceRequest, SpaceSpaceApiApiUpdate3Request, SpaceSpaceApiApiUpdateMemberSettingRequest, SpaceSpaceApiApiUpdateSecuritySettingRequest, SpaceSpaceApiApiUpdateWorkbenchSettingRequest, ObjectSpaceSpaceApiApi as SpaceSpaceApiApi,  SpaceSubAdminApiApiAddRoleRequest, SpaceSubAdminApiApiDeleteRoleRequest, SpaceSubAdminApiApiEditRoleRequest, SpaceSubAdminApiApiGetRoleDetailRequest, SpaceSubAdminApiApiListRoleRequest, ObjectSpaceSubAdminApiApi as SpaceSubAdminApiApi,  StoreAPIApiGetPricesRequest, ObjectStoreAPIApi as StoreAPIApi,  StripeWebhookControllerApiRetrieveStripeEventRequest, ObjectStripeWebhookControllerApi as StripeWebhookControllerApi,  TemplateCenterTemplateAPIApiCreate3Request, TemplateCenterTemplateAPIApiDelete14Request, TemplateCenterTemplateAPIApiDirectoryRequest, TemplateCenterTemplateAPIApiGetCategoryContentRequest, TemplateCenterTemplateAPIApiGetCategoryListRequest, TemplateCenterTemplateAPIApiGetSpaceTemplatesRequest, TemplateCenterTemplateAPIApiGlobalSearchRequest, TemplateCenterTemplateAPIApiQuoteRequest, TemplateCenterTemplateAPIApiRecommendRequest, TemplateCenterTemplateAPIApiValidateRequest, ObjectTemplateCenterTemplateAPIApi as TemplateCenterTemplateAPIApi,  TemplateCenterTemplateAlbumAPIApiGetAlbumContentRequest, TemplateCenterTemplateAlbumAPIApiGetRecommendedAlbumsRequest, ObjectTemplateCenterTemplateAlbumAPIApi as TemplateCenterTemplateAlbumAPIApi,  TencentQQModuleTencentQQRelatedServiceInterfaceApiCallback2Request, ObjectTencentQQModuleTencentQQRelatedServiceInterfaceApi as TencentQQModuleTencentQQRelatedServiceInterfaceApi,  ThirdPartyPlatformIntegrationInterfaceDingTalkApiBindSpace1Request, ThirdPartyPlatformIntegrationInterfaceDingTalkApiBindSpaceInfo1Request, ThirdPartyPlatformIntegrationInterfaceDingTalkApiChangeAdmin1Request, ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateCreateRequest, ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateDeleteRequest, ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateUpdateRequest, ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkUserLoginRequest, ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetDdConfigParamRequest, ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetSkuPageRequest, ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetTenantInfo2Request, ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvAminUserLoginRequest, ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvBindSpaceInfoRequest, ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvUserLoginRequest, ThirdPartyPlatformIntegrationInterfaceDingTalkApiRefreshContact1Request, ObjectThirdPartyPlatformIntegrationInterfaceDingTalkApi as ThirdPartyPlatformIntegrationInterfaceDingTalkApi,  ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiCopyTeamAndMembersRequest, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiLogin2Request, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOauth2CallbackRequest, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgCreateRequest, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgDeleteRequest, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOrgUpdateRequest, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiQueryOrgByIdServiceRequest, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiQueryUserByIdServiceRequest, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserCreateRequest, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserDeleteRequest, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserLogin1Request, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserSchemaRequest, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiUserUpdateRequest, ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiWecomLoginRequest, ObjectThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi as ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi,  ThirdPartyPlatformIntegrationInterfaceWeComApiBindSpaceInfoRequest, ThirdPartyPlatformIntegrationInterfaceWeComApiGetTenantBindWeComConfigRequest, ThirdPartyPlatformIntegrationInterfaceWeComApiHotsTransformIpRequest, ThirdPartyPlatformIntegrationInterfaceWeComApiSocialTenantEnvRequest, ThirdPartyPlatformIntegrationInterfaceWeComApiWeComBindConfigRequest, ThirdPartyPlatformIntegrationInterfaceWeComApiWeComCheckConfigRequest, ThirdPartyPlatformIntegrationInterfaceWeComApiWeComRefreshContactRequest, ThirdPartyPlatformIntegrationInterfaceWeComApiWeComUserLoginRequest, ObjectThirdPartyPlatformIntegrationInterfaceWeComApi as ThirdPartyPlatformIntegrationInterfaceWeComApi,  ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetCallbackRequest, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetJsSdkAgentConfigRequest, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetJsSdkConfigRequest, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetRegisterInstallSelfUrlRequest, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetRegisterInstallWeComRequest, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetTenantInfoRequest, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostAdminChangeRequest, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostCallbackRequest, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostInviteUnauthMemberRequest, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginAdminCodeRequest, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginAuthCodeRequest, ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginCodeRequest, ObjectThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi as ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi,  ThirdPartyPlatformIntegrationInterfaceWoaApiBindSpaceRequest, ThirdPartyPlatformIntegrationInterfaceWoaApiRefreshContactRequest, ThirdPartyPlatformIntegrationInterfaceWoaApiUserLoginRequest, ObjectThirdPartyPlatformIntegrationInterfaceWoaApi as ThirdPartyPlatformIntegrationInterfaceWoaApi,  VCodeActivityAPIApiCreate2Request, VCodeActivityAPIApiDelete4Request, VCodeActivityAPIApiDelete5Request, VCodeActivityAPIApiEdit2Request, VCodeActivityAPIApiList1Request, VCodeActivityAPIApiPage2Request, ObjectVCodeActivityAPIApi as VCodeActivityAPIApi,  VCodeSystemCouponAPIApiCreate1Request, VCodeSystemCouponAPIApiDelete2Request, VCodeSystemCouponAPIApiDelete3Request, VCodeSystemCouponAPIApiEdit1Request, VCodeSystemCouponAPIApiListRequest, VCodeSystemCouponAPIApiPage1Request, ObjectVCodeSystemCouponAPIApi as VCodeSystemCouponAPIApi,  VCodeSystemVCodeAPIApiDeleteRequest, VCodeSystemVCodeAPIApiCreateRequest, VCodeSystemVCodeAPIApiDelete1Request, VCodeSystemVCodeAPIApiEditRequest, VCodeSystemVCodeAPIApiExchangeRequest, VCodeSystemVCodeAPIApiPageRequest, ObjectVCodeSystemVCodeAPIApi as VCodeSystemVCodeAPIApi,  WeChatMiniAppAPIApiAuthorizeRequest, WeChatMiniAppAPIApiGetInfoRequest, WeChatMiniAppAPIApiInfoRequest, WeChatMiniAppAPIApiOperateRequest, WeChatMiniAppAPIApiPhoneRequest, ObjectWeChatMiniAppAPIApi as WeChatMiniAppAPIApi,  WeChatMpAPIApiCallback1Request, WeChatMpAPIApiPollRequest, WeChatMpAPIApiQrcodeRequest, WeChatMpAPIApiSignatureRequest, ObjectWeChatMpAPIApi as WeChatMpAPIApi,  WeChatOpenPlatformAPIApiCallbackRequest, WeChatOpenPlatformAPIApiCreatePreAuthUrlRequest, WeChatOpenPlatformAPIApiCreateWxQrCodeRequest, WeChatOpenPlatformAPIApiDelQrCodeRequest, WeChatOpenPlatformAPIApiDelQrCode1Request, WeChatOpenPlatformAPIApiGetAuthorizerInfoRequest, WeChatOpenPlatformAPIApiGetAuthorizerListRequest, WeChatOpenPlatformAPIApiGetComponentVerifyTicketRequest, WeChatOpenPlatformAPIApiGetQrCodePageRequest, WeChatOpenPlatformAPIApiGetQueryAuthRequest, WeChatOpenPlatformAPIApiGetWechatIpListRequest, WeChatOpenPlatformAPIApiUpdateWxReplyRequest, ObjectWeChatOpenPlatformAPIApi as WeChatOpenPlatformAPIApi,  WidgetSDKPackageApiApiCreateWidgetRequest, WidgetSDKPackageApiApiGetWidgetPackageInfoRequest, WidgetSDKPackageApiApiGetWidgetPackageListInfoRequest, WidgetSDKPackageApiApiReleaseListWidgetRequest, WidgetSDKPackageApiApiReleaseWidgetV2Request, WidgetSDKPackageApiApiRollbackWidgetRequest, WidgetSDKPackageApiApiSubmitWidgetV2Request, WidgetSDKPackageApiApiTransferWidgetOwnerRequest, WidgetSDKPackageApiApiUnpublishWidgetRequest, WidgetSDKPackageApiApiWidgetAuthRequest, ObjectWidgetSDKPackageApiApi as WidgetSDKPackageApiApi,  WidgetSDKWidgetApiApiCopyWidgetRequest, WidgetSDKWidgetApiApiCreateWidget1Request, WidgetSDKWidgetApiApiFindTemplatePackageListRequest, WidgetSDKWidgetApiApiFindWidgetInfoByNodeIdRequest, WidgetSDKWidgetApiApiFindWidgetInfoBySpaceIdRequest, WidgetSDKWidgetApiApiFindWidgetPackByNodeIdRequest, WidgetSDKWidgetApiApiFindWidgetPackByWidgetIdsRequest, WidgetSDKWidgetApiApiWidgetStoreListRequest, ObjectWidgetSDKWidgetApiApi as WidgetSDKWidgetApiApi,  WidgetSDKWidgetAuditApiApiAuditSubmitDataRequest, WidgetSDKWidgetAuditApiApiIssuedGlobalIdRequest, ObjectWidgetSDKWidgetAuditApiApi as WidgetSDKWidgetAuditApiApi,  WidgetUploadAPIApiGenerateWidgetPreSignedUrlRequest, WidgetUploadAPIApiGetWidgetUploadMetaRequest, ObjectWidgetUploadAPIApi as WidgetUploadAPIApi,  WorkbenchFieldRoleAPIApiAddRole1Request, WorkbenchFieldRoleAPIApiBatchDeleteRole1Request, WorkbenchFieldRoleAPIApiBatchEditRole1Request, WorkbenchFieldRoleAPIApiDeleteRole3Request, WorkbenchFieldRoleAPIApiDisableRoleRequest, WorkbenchFieldRoleAPIApiEditRole2Request, WorkbenchFieldRoleAPIApiEnableRoleRequest, WorkbenchFieldRoleAPIApiGetCollaboratorPage1Request, WorkbenchFieldRoleAPIApiGetMultiDatasheetFieldPermissionRequest, WorkbenchFieldRoleAPIApiListRole2Request, WorkbenchFieldRoleAPIApiUpdateRoleSettingRequest, ObjectWorkbenchFieldRoleAPIApi as WorkbenchFieldRoleAPIApi,  WorkbenchNodeApiApiActiveSheetsRequest, WorkbenchNodeApiApiAnalyzeBundleRequest, WorkbenchNodeApiApiCheckRelNodeRequest, WorkbenchNodeApiApiCopyRequest, WorkbenchNodeApiApiCreate6Request, WorkbenchNodeApiApiDelete8Request, WorkbenchNodeApiApiDelete9Request, WorkbenchNodeApiApiExportBundleRequest, WorkbenchNodeApiApiGetByNodeIdRequest, WorkbenchNodeApiApiGetNodeChildrenListRequest, WorkbenchNodeApiApiGetNodeRelRequest, WorkbenchNodeApiApiGetParentNodesRequest, WorkbenchNodeApiApiGetTreeRequest, WorkbenchNodeApiApiImportExcelRequest, WorkbenchNodeApiApiImportExcel1Request, WorkbenchNodeApiApiList6Request, WorkbenchNodeApiApiMoveRequest, WorkbenchNodeApiApiPositionRequest, WorkbenchNodeApiApiPostRemindUnitsNoPermissionRequest, WorkbenchNodeApiApiRecentListRequest, WorkbenchNodeApiApiRemindRequest, WorkbenchNodeApiApiSearchNodeRequest, WorkbenchNodeApiApiShowNodeInfoWindowRequest, WorkbenchNodeApiApiShowcaseRequest, WorkbenchNodeApiApiUpdate5Request, WorkbenchNodeApiApiUpdateDescRequest, ObjectWorkbenchNodeApiApi as WorkbenchNodeApiApi,  WorkbenchNodeFavoriteApiApiList7Request, WorkbenchNodeFavoriteApiApiMove1Request, WorkbenchNodeFavoriteApiApiUpdateStatusRequest, ObjectWorkbenchNodeFavoriteApiApi as WorkbenchNodeFavoriteApiApi,  WorkbenchNodeRoleApiApiBatchDeleteRoleRequest, WorkbenchNodeRoleApiApiBatchEditRoleRequest, WorkbenchNodeRoleApiApiCreateRole1Request, WorkbenchNodeRoleApiApiDeleteRole2Request, WorkbenchNodeRoleApiApiDisableRoleExtendRequest, WorkbenchNodeRoleApiApiEditRole1Request, WorkbenchNodeRoleApiApiEnableRoleExtendRequest, WorkbenchNodeRoleApiApiGetCollaboratorInfoRequest, WorkbenchNodeRoleApiApiGetCollaboratorPageRequest, WorkbenchNodeRoleApiApiListRole1Request, ObjectWorkbenchNodeRoleApiApi as WorkbenchNodeRoleApiApi,  WorkbenchNodeRubbishApiApiDelete6Request, WorkbenchNodeRubbishApiApiDelete7Request, WorkbenchNodeRubbishApiApiList5Request, WorkbenchNodeRubbishApiApiRecoverRequest, ObjectWorkbenchNodeRubbishApiApi as WorkbenchNodeRubbishApiApi,  WorkbenchNodeShareApiApiDisableShareRequest, WorkbenchNodeShareApiApiNodeShareInfoRequest, WorkbenchNodeShareApiApiReadShareInfoRequest, WorkbenchNodeShareApiApiStoreShareDataRequest, WorkbenchNodeShareApiApiUpdateNodeShareRequest, ObjectWorkbenchNodeShareApiApi as WorkbenchNodeShareApiApi } from './types/ObjectParamAPI';

