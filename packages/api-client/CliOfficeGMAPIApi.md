# .CliOfficeGMAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**activityReward**](CliOfficeGMAPIApi.md#activityReward) | **POST** /activity/reward | Activity Integral Reward
[**addPlayerNotify**](CliOfficeGMAPIApi.md#addPlayerNotify) | **POST** /gm/new/player/notify | Create a player notification
[**applyLabsFeature**](CliOfficeGMAPIApi.md#applyLabsFeature) | **POST** /gm/labs | Open laboratory feature for applicants
[**assignActivity**](CliOfficeGMAPIApi.md#assignActivity) | **POST** /gm/assign/activity | Specifies the active state of the user
[**closeAccountDirectly**](CliOfficeGMAPIApi.md#closeAccountDirectly) | **POST** /gm/users/{uuid}/close | Close paused account
[**config**](CliOfficeGMAPIApi.md#config) | **POST** /template/config | Update Template Center Config
[**createLabsFeature**](CliOfficeGMAPIApi.md#createLabsFeature) | **POST** /gm/labs/features | Create laboratory feature
[**createUser**](CliOfficeGMAPIApi.md#createUser) | **POST** /gm/new/user | Create user(Irregular vest number, used for testing)
[**createUsers**](CliOfficeGMAPIApi.md#createUsers) | **POST** /gm/new/users | Batch Create user(Irregular vest number, used for testing)
[**deduct**](CliOfficeGMAPIApi.md#deduct) | **POST** /integral/deduct | Deduct User Integral
[**deleteLabsFeature**](CliOfficeGMAPIApi.md#deleteLabsFeature) | **POST** /gm/labs/features/{featureKey}/delete | Remove laboratory feature
[**enableChatbot**](CliOfficeGMAPIApi.md#enableChatbot) | **POST** /chatbot/enable | Enable specified space chatbot feature
[**feishuTenantEvent**](CliOfficeGMAPIApi.md#feishuTenantEvent) | **POST** /gm/social/tenant/{tenantId}/event | Manually execute compensation of feishu event
[**get1**](CliOfficeGMAPIApi.md#get1) | **GET** /integral/get | Query User Integral
[**lock**](CliOfficeGMAPIApi.md#lock) | **POST** /gm/lock | Lock verification
[**resetActivity**](CliOfficeGMAPIApi.md#resetActivity) | **POST** /gm/reset/activity | Reset the active state of the user
[**revokePlayerNotify**](CliOfficeGMAPIApi.md#revokePlayerNotify) | **POST** /gm/revoke/player/notify | Cancel a player notification
[**syncDingTalkApp**](CliOfficeGMAPIApi.md#syncDingTalkApp) | **POST** /gm/social/dingtalk/app | create dingTalk app
[**unlock**](CliOfficeGMAPIApi.md#unlock) | **POST** /gm/unlock | Unlock verification
[**updateLabsFeaturesAttribute**](CliOfficeGMAPIApi.md#updateLabsFeaturesAttribute) | **POST** /gm/labs/updateAttribute | Modify laboratory feature attribute
[**updatePermission**](CliOfficeGMAPIApi.md#updatePermission) | **POST** /gm/permission/update | Update GM permission config
[**userContactInfoQuery**](CliOfficeGMAPIApi.md#userContactInfoQuery) | **POST** /gm/user/writeContactInfo | query user\&#39;s mobile phone and email by user\&#39;s id


# **activityReward**
> ResponseDataVoid activityReward()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:any = {};

apiInstance.activityReward(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **addPlayerNotify**
> ResponseDataVoid addPlayerNotify(notificationCreateRo)

Adding system notification.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiAddPlayerNotifyRequest = {
  // NotificationCreateRo
  notificationCreateRo: {
    toUserId: [
      "toUserId_example",
    ],
    toMemberId: [
      "toMemberId_example",
    ],
    toUnitId: [
      "toUnitId_example",
    ],
    fromUserId: "1261273764218",
    nodeId: "nod10",
    spaceId: "spcHKrd0liUcl",
    templateId: "tplxx",
    body: 
      key: {},
    ,
    version: "v0.12.1.release",
    expireAt: "1614587900000",
    notifyId: "1614587900000",
  },
};

apiInstance.addPlayerNotify(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **notificationCreateRo** | **NotificationCreateRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **applyLabsFeature**
> ResponseDataVoid applyLabsFeature(gmApplyFeatureRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiApplyLabsFeatureRequest = {
  // GmApplyFeatureRo
  gmApplyFeatureRo: {
    spaceId: "spchhRu3xQqt9",
    applyUserId: "a83ec20f15c9459893d133c2c369eff6",
    featureKey: "render_prompt|async_compute|robot|widget_center",
    enable: true,
  },
};

apiInstance.applyLabsFeature(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gmApplyFeatureRo** | **GmApplyFeatureRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **assignActivity**
> ResponseDataVoid assignActivity(userActivityAssignRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiAssignActivityRequest = {
  // UserActivityAssignRo
  userActivityAssignRo: {
    wizardId: 7,
    value: 7,
    userIds: ["10101","10102","10103","10104"],
    testMobile: "1340000",
  },
};

apiInstance.assignActivity(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userActivityAssignRo** | **UserActivityAssignRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **closeAccountDirectly**
> ResponseDataVoid closeAccountDirectly()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiCloseAccountDirectlyRequest = {
  // string
  uuid: "uuid_example",
};

apiInstance.closeAccountDirectly(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uuid** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **config**
> ResponseDataVoid config(templateCenterConfigRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiConfigRequest = {
  // TemplateCenterConfigRo
  templateCenterConfigRo: {
    host: "https://api.com",
    token: "uskxx",
    recommendDatasheetId: "dstxxx",
    recommendViewId: "viwxxx",
    categoryDatasheetId: "dstxxx",
    categoryViewId: "viwxxx",
    albumDatasheetId: "dstxxx",
    albumViewId: "viwxxx",
    templateDatasheetId: "dstxxx",
    templateViewId: "viwxxx",
  },
};

apiInstance.config(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **templateCenterConfigRo** | **TemplateCenterConfigRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createLabsFeature**
> ResponseDataGmLabFeatureVo createLabsFeature(gmLabsFeatureCreatorRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiCreateLabsFeatureRequest = {
  // GmLabsFeatureCreatorRo
  gmLabsFeatureCreatorRo: {
    scope: "user|space",
    key: "render_prompt|async_compute|robot|widget_center",
    type: "static|review|normal",
    url: "url_example",
  },
};

apiInstance.createLabsFeature(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gmLabsFeatureCreatorRo** | **GmLabsFeatureCreatorRo**|  |


### Return type

**ResponseDataGmLabFeatureVo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createUser**
> ResponseDataHqAddUserVo createUser(hqAddUserRo)

create a user by username and password.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiCreateUserRequest = {
  // HqAddUserRo
  hqAddUserRo: {
    username: "username_example",
    phone: "phone_example",
    password: "password_example",
  },
};

apiInstance.createUser(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **hqAddUserRo** | **HqAddUserRo**|  |


### Return type

**ResponseDataHqAddUserVo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createUsers**
> ResponseDataVoid createUsers()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:any = {};

apiInstance.createUsers(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deduct**
> ResponseDataVoid deduct(integralDeductRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiDeductRequest = {
  // IntegralDeductRo
  integralDeductRo: {
    userId: 12511,
    areaCode: "+86",
    credential: "xx@gmail.com",
    credit: 100,
  },
};

apiInstance.deduct(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **integralDeductRo** | **IntegralDeductRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteLabsFeature**
> ResponseDataVoid deleteLabsFeature()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiDeleteLabsFeatureRequest = {
  // string | laboratory feature unique identifier
  featureKey: "render_prompt|async_compute|robot|widget_center",
};

apiInstance.deleteLabsFeature(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **featureKey** | [**string**] | laboratory feature unique identifier | defaults to undefined


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **enableChatbot**
> ResponseDataVoid enableChatbot(chatbotEnableRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiEnableChatbotRequest = {
  // ChatbotEnableRo
  chatbotEnableRo: {
    spaceId: "spc11",
    token: "aqq",
    days: 30,
    isOff: true,
  },
};

apiInstance.enableChatbot(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **chatbotEnableRo** | **ChatbotEnableRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **feishuTenantEvent**
> ResponseDataVoid feishuTenantEvent()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiFeishuTenantEventRequest = {
  // string
  tenantId: "tenantId_example",
};

apiInstance.feishuTenantEvent(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenantId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **get1**
> ResponseDataInteger get1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiGet1Request = {
  // number | User ID (optional)
  userId: 12511,
  // number | Area Code (optional)
  areaCode: +1,
  // string | Account Credential（mobile or email） (optional)
  credential: "xx@gmail.com",
};

apiInstance.get1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **number** | User ID | (optional) defaults to undefined
 **areaCode** | [**number**] | Area Code | (optional) defaults to undefined
 **credential** | [**string**] | Account Credential（mobile or email） | (optional) defaults to undefined


### Return type

**ResponseDataInteger**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **lock**
> ResponseDataVoid lock(unlockRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiLockRequest = {
  // UnlockRo
  unlockRo: {
    target: "13800138000",
    type: 0,
  },
};

apiInstance.lock(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unlockRo** | **UnlockRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **resetActivity**
> ResponseDataVoid resetActivity()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiResetActivityRequest = {
  // UserActivityRo (optional)
  userActivityRo: {
    wizardId: 7,
  },
};

apiInstance.resetActivity(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userActivityRo** | **UserActivityRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **revokePlayerNotify**
> ResponseDataVoid revokePlayerNotify(notificationRevokeRo)

Cancel a player notification, deleted from the notification center

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiRevokePlayerNotifyRequest = {
  // NotificationRevokeRo
  notificationRevokeRo: {
    uuid: [
      "uuid_example",
    ],
    spaceId: "spcHKrd0liUcl",
    templateId: "tplxx",
    version: "v0.12.1.release",
    expireAt: "1614587900000",
    revokeType: 1614587900000,
  },
};

apiInstance.revokePlayerNotify(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **notificationRevokeRo** | **NotificationRevokeRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **syncDingTalkApp**
> ResponseDataVoid syncDingTalkApp(syncSocialDingTalkAppRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiSyncDingTalkAppRequest = {
  // Array<SyncSocialDingTalkAppRo>
  syncSocialDingTalkAppRo: [
    {
      suiteId: "suite***",
      suiteSecret: "***",
      agentId: "1248***",
      token: "***",
      aesKey: "***",
      appType: 1,
      authCorpId: "ding***",
      suiteTicket: "***",
    },
  ],
};

apiInstance.syncDingTalkApp(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **syncSocialDingTalkAppRo** | **Array<SyncSocialDingTalkAppRo>**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **unlock**
> ResponseDataVoid unlock(unlockRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiUnlockRequest = {
  // UnlockRo
  unlockRo: {
    target: "13800138000",
    type: 0,
  },
};

apiInstance.unlock(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unlockRo** | **UnlockRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateLabsFeaturesAttribute**
> ResponseDataVoid updateLabsFeaturesAttribute(gmLabsFeatureCreatorRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiUpdateLabsFeaturesAttributeRequest = {
  // GmLabsFeatureCreatorRo
  gmLabsFeatureCreatorRo: {
    scope: "user|space",
    key: "render_prompt|async_compute|robot|widget_center",
    type: "static|review|normal",
    url: "url_example",
  },
};

apiInstance.updateLabsFeaturesAttribute(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **gmLabsFeatureCreatorRo** | **GmLabsFeatureCreatorRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updatePermission**
> ResponseDataVoid updatePermission(configDatasheetRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiUpdatePermissionRequest = {
  // ConfigDatasheetRo
  configDatasheetRo: {
    datasheetId: "dst11",
  },
};

apiInstance.updatePermission(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **configDatasheetRo** | **ConfigDatasheetRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **userContactInfoQuery**
> ResponseDataVoid userContactInfoQuery(queryUserInfoRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliOfficeGMAPIApi(configuration);

let body:.CliOfficeGMAPIApiUserContactInfoQueryRequest = {
  // QueryUserInfoRo
  queryUserInfoRo: {
    host: "https://apitable",
    datasheetId: "dstyLyo90skGTTfPkw",
    viewId: "viwQBpMksyCqy",
    token: "uskxVwqyXWmpzM3jxCXBcGK",
  },
};

apiInstance.userContactInfoQuery(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **queryUserInfoRo** | **QueryUserInfoRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


