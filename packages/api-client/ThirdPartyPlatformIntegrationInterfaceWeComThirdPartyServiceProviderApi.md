# .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getCallback**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#getCallback) | **GET** /social/wecom/isv/datasheet/callback | 
[**getJsSdkAgentConfig**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#getJsSdkAgentConfig) | **GET** /social/wecom/isv/datasheet/jsSdk/agentConfig | JS-SDK Verify the configuration parameters of application identity and permission
[**getJsSdkConfig**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#getJsSdkConfig) | **GET** /social/wecom/isv/datasheet/jsSdk/config | JS-SDK Verify the configuration parameters of enterprise identity and authority
[**getRegisterInstallSelfUrl**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#getRegisterInstallSelfUrl) | **GET** /social/wecom/isv/datasheet/register/installSelf/url | Get the authorization link for installing vika
[**getRegisterInstallWeCom**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#getRegisterInstallWeCom) | **GET** /social/wecom/isv/datasheet/register/installWeCom | Get the registration code for registering WeCom and installing vika
[**getTenantInfo**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#getTenantInfo) | **GET** /social/wecom/isv/datasheet/tenant/info | Get tenant binding information
[**postAdminChange**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#postAdminChange) | **POST** /social/wecom/isv/datasheet/admin/change | Tenant space replacement master administrator
[**postCallback**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#postCallback) | **POST** /social/wecom/isv/datasheet/callback | 
[**postInviteUnauthMember**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#postInviteUnauthMember) | **POST** /social/wecom/isv/datasheet/invite/unauthMember | Invite unauthorized users
[**postLoginAdminCode**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#postLoginAdminCode) | **POST** /social/wecom/isv/datasheet/login/adminCode | WeCom administrator jumps to the third-party application management page and automatically logs in
[**postLoginAuthCode**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#postLoginAuthCode) | **POST** /social/wecom/isv/datasheet/login/authCode | WeCom third-party application scanning code login
[**postLoginCode**](ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi.md#postLoginCode) | **POST** /social/wecom/isv/datasheet/login/code | Auto login to third-party applications within WeCom


# **getCallback**
> string getCallback()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetCallbackRequest = {
  // string
  msgSignature: "msg_signature_example",
  // string
  timestamp: "timestamp_example",
  // string
  nonce: "nonce_example",
  // string
  echostr: "echostr_example",
};

apiInstance.getCallback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **msgSignature** | [**string**] |  | defaults to undefined
 **timestamp** | [**string**] |  | defaults to undefined
 **nonce** | [**string**] |  | defaults to undefined
 **echostr** | [**string**] |  | defaults to undefined


### Return type

**string**

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

# **getJsSdkAgentConfig**
> ResponseDataWeComIsvJsSdkAgentConfigVo getJsSdkAgentConfig()

JS-SDK Verify the configuration parameters of application identity and permission

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetJsSdkAgentConfigRequest = {
  // string
  spaceId: "spaceId_example",
  // string
  url: "url_example",
};

apiInstance.getJsSdkAgentConfig(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **url** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataWeComIsvJsSdkAgentConfigVo**

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

# **getJsSdkConfig**
> ResponseDataWeComIsvJsSdkConfigVo getJsSdkConfig()

JS-SDK Verify the configuration parameters of enterprise identity and authority

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetJsSdkConfigRequest = {
  // string
  spaceId: "spaceId_example",
  // string
  url: "url_example",
};

apiInstance.getJsSdkConfig(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **url** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataWeComIsvJsSdkConfigVo**

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

# **getRegisterInstallSelfUrl**
> ResponseDataWeComIsvRegisterInstallSelfUrlVo getRegisterInstallSelfUrl()

Get the authorization link for installing vika

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetRegisterInstallSelfUrlRequest = {
  // string
  finalPath: "finalPath_example",
};

apiInstance.getRegisterInstallSelfUrl(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **finalPath** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataWeComIsvRegisterInstallSelfUrlVo**

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

# **getRegisterInstallWeCom**
> ResponseDataWeComIsvRegisterInstallWeComVo getRegisterInstallWeCom()

Get the registration code for registering WeCom and installing vika

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:any = {};

apiInstance.getRegisterInstallWeCom(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataWeComIsvRegisterInstallWeComVo**

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

# **getTenantInfo**
> ResponseDataTenantDetailVO getTenantInfo()

Get tenant binding information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiGetTenantInfoRequest = {
  // string
  suiteId: "suiteId_example",
  // string
  authCorpId: "authCorpId_example",
};

apiInstance.getTenantInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **suiteId** | [**string**] |  | defaults to undefined
 **authCorpId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataTenantDetailVO**

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

# **postAdminChange**
> ResponseDataVoid postAdminChange(weComIsvAdminChangeRo)

Tenant space replacement master administrator

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostAdminChangeRequest = {
  // WeComIsvAdminChangeRo
  weComIsvAdminChangeRo: {
    suiteId: "suiteId_example",
    authCorpId: "authCorpId_example",
    spaceId: "spaceId_example",
    memberId: 1,
  },
};

apiInstance.postAdminChange(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **weComIsvAdminChangeRo** | **WeComIsvAdminChangeRo**|  |


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

# **postCallback**
> string postCallback(body, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostCallbackRequest = {
  // string
  body: "body_example",
  // string
  type: "type_example",
  // string
  msgSignature: "msg_signature_example",
  // string
  timestamp: "timestamp_example",
  // string
  nonce: "nonce_example",
  // string (optional)
  suiteId: "suite_id_example",
};

apiInstance.postCallback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **string**|  |
 **type** | [**string**] |  | defaults to undefined
 **msgSignature** | [**string**] |  | defaults to undefined
 **timestamp** | [**string**] |  | defaults to undefined
 **nonce** | [**string**] |  | defaults to undefined
 **suiteId** | [**string**] |  | (optional) defaults to undefined


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/xml;charset=UTF-8


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **postInviteUnauthMember**
> ResponseDataVoid postInviteUnauthMember(weComIsvInviteUnauthMemberRo)

Invite unauthorized users

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostInviteUnauthMemberRequest = {
  // WeComIsvInviteUnauthMemberRo
  weComIsvInviteUnauthMemberRo: {
    spaceId: "spaceId_example",
    selectedTickets: [
      "selectedTickets_example",
    ],
  },
};

apiInstance.postInviteUnauthMember(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **weComIsvInviteUnauthMemberRo** | **WeComIsvInviteUnauthMemberRo**|  |


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

# **postLoginAdminCode**
> ResponseDataWeComIsvUserLoginVo postLoginAdminCode(weComIsvLoginAdminCodeRo)

WeCom administrator jumps to the third-party application management page and automatically logs in

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginAdminCodeRequest = {
  // WeComIsvLoginAdminCodeRo
  weComIsvLoginAdminCodeRo: {
    suiteId: "suiteId_example",
    authCode: "authCode_example",
  },
};

apiInstance.postLoginAdminCode(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **weComIsvLoginAdminCodeRo** | **WeComIsvLoginAdminCodeRo**|  |


### Return type

**ResponseDataWeComIsvUserLoginVo**

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

# **postLoginAuthCode**
> ResponseDataWeComIsvUserLoginVo postLoginAuthCode(weComIsvLoginAuthCodeRo)

WeCom third-party application scanning code login

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginAuthCodeRequest = {
  // WeComIsvLoginAuthCodeRo
  weComIsvLoginAuthCodeRo: {
    suiteId: "suiteId_example",
    authCode: "authCode_example",
  },
};

apiInstance.postLoginAuthCode(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **weComIsvLoginAuthCodeRo** | **WeComIsvLoginAuthCodeRo**|  |


### Return type

**ResponseDataWeComIsvUserLoginVo**

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

# **postLoginCode**
> ResponseDataWeComIsvUserLoginVo postLoginCode(weComIsvLoginCodeRo)

Auto login to third-party applications within WeCom

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComThirdPartyServiceProviderApiPostLoginCodeRequest = {
  // WeComIsvLoginCodeRo
  weComIsvLoginCodeRo: {
    suiteId: "suiteId_example",
    code: "code_example",
  },
};

apiInstance.postLoginCode(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **weComIsvLoginCodeRo** | **WeComIsvLoginCodeRo**|  |


### Return type

**ResponseDataWeComIsvUserLoginVo**

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


