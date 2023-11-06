# .ThirdPartyPlatformIntegrationInterfaceDingTalkApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**bindSpace1**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#bindSpace1) | **POST** /social/dingtalk/agent/{agentId}/bindSpace | DingTalk The application enterprise binds the space
[**bindSpaceInfo1**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#bindSpaceInfo1) | **GET** /social/dingtalk/agent/{agentId}/bindSpace | Get the space station ID bound by the application
[**changeAdmin1**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#changeAdmin1) | **POST** /social/dingtalk/suite/{suiteId}/changeAdmin | Tenant space replacement master administrator
[**dingTalkDaTemplateCreate**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#dingTalkDaTemplateCreate) | **POST** /social/dingtalk/template/{dingTalkDaAppId}/create | DingTalk Callback interface--Template Creation
[**dingTalkDaTemplateDelete**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#dingTalkDaTemplateDelete) | **POST** /social/dingtalk/template/{dingTalkDaAppId}/delete | DingTalk Callback interface--Template application deletion
[**dingTalkDaTemplateUpdate**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#dingTalkDaTemplateUpdate) | **POST** /social/dingtalk/template/{dingTalkDaAppId}/update | DingTalk Callback interface--Template application modification
[**dingTalkUserLogin**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#dingTalkUserLogin) | **POST** /social/dingtalk/agent/{agentId}/user/login | DingTalk Application user login
[**getDdConfigParam**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#getDdConfigParam) | **POST** /social/dingtalk/ddconfig | Get the dd.config parameter
[**getSkuPage**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#getSkuPage) | **POST** /social/dingtalk/skuPage | Get the SKU page address of domestic products
[**getTenantInfo2**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#getTenantInfo2) | **GET** /social/dingtalk/suite/{suiteId}/detail | Get tenant binding information
[**isvAminUserLogin**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#isvAminUserLogin) | **POST** /social/dingtalk/suite/{suiteId}/admin/login | ISV third-party DingTalk application background administrator login
[**isvBindSpaceInfo**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#isvBindSpaceInfo) | **GET** /social/dingtalk/suite/{suiteId}/bindSpace | ISV Third party application obtains the space ID bound by the application
[**isvUserLogin**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#isvUserLogin) | **POST** /social/dingtalk/suite/{suiteId}/user/login | ISV Third party Ding Talk application user login
[**refreshContact1**](ThirdPartyPlatformIntegrationInterfaceDingTalkApi.md#refreshContact1) | **GET** /social/dingtalk/agent/refresh/contact | Refresh the address book of DingTalk application


# **bindSpace1**
> ResponseDataVoid bindSpace1(dingTalkAgentBindSpaceDTO, )

DingTalk application bind space

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiBindSpace1Request = {
  // DingTalkAgentBindSpaceDTO
  dingTalkAgentBindSpaceDTO: {
    spaceId: "spc2123hjhasd",
  },
  // string
  agentId: "agentId_example",
};

apiInstance.bindSpace1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dingTalkAgentBindSpaceDTO** | **DingTalkAgentBindSpaceDTO**|  |
 **agentId** | [**string**] |  | defaults to undefined


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

# **bindSpaceInfo1**
> ResponseDataDingTalkBindSpaceVo bindSpaceInfo1()

Get the space station ID of the application binding, and jump to the login page when success=false

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiBindSpaceInfo1Request = {
  // string
  agentId: "agentId_example",
};

apiInstance.bindSpaceInfo1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **agentId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataDingTalkBindSpaceVo**

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

# **changeAdmin1**
> ResponseDataVoid changeAdmin1(dingTalkTenantMainAdminChangeRo, )

Replace the master administrator

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiChangeAdmin1Request = {
  // DingTalkTenantMainAdminChangeRo
  dingTalkTenantMainAdminChangeRo: {
    spaceId: "spc2123hjhasd",
    memberId: 123456,
    corpId: "ddsddd",
  },
  // string | kit ID
  suiteId: "111108bb8e6dbc2xxxx",
};

apiInstance.changeAdmin1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dingTalkTenantMainAdminChangeRo** | **DingTalkTenantMainAdminChangeRo**|  |
 **suiteId** | [**string**] | kit ID | defaults to undefined


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

# **dingTalkDaTemplateCreate**
> void dingTalkDaTemplateCreate(dingTalkDaTemplateCreateRo, )

DingTalk Callback interface--Template Creation

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateCreateRequest = {
  // DingTalkDaTemplateCreateRo
  dingTalkDaTemplateCreateRo: {
    corpId: "corpId_example",
    name: "name_example",
    opUserId: "opUserId_example",
    templateKey: "templateKey_example",
    keepSampleData: true,
    timestamp: "timestamp_example",
    signature: "signature_example",
    requestId: "requestId_example",
  },
  // string
  dingTalkDaAppId: "dingTalkDaAppId_example",
};

apiInstance.dingTalkDaTemplateCreate(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dingTalkDaTemplateCreateRo** | **DingTalkDaTemplateCreateRo**|  |
 **dingTalkDaAppId** | [**string**] |  | defaults to undefined


### Return type

**void**

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

# **dingTalkDaTemplateDelete**
> void dingTalkDaTemplateDelete(dingTalkDaTemplateDeleteRo, )

DingTalk Callback interface--Template application deletion

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateDeleteRequest = {
  // DingTalkDaTemplateDeleteRo
  dingTalkDaTemplateDeleteRo: {
    corpId: "corpId_example",
    opUserId: "opUserId_example",
    bizAppId: "bizAppId_example",
    timestamp: "timestamp_example",
    signature: "signature_example",
    requestId: "requestId_example",
  },
  // string
  dingTalkDaAppId: "dingTalkDaAppId_example",
};

apiInstance.dingTalkDaTemplateDelete(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dingTalkDaTemplateDeleteRo** | **DingTalkDaTemplateDeleteRo**|  |
 **dingTalkDaAppId** | [**string**] |  | defaults to undefined


### Return type

**void**

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

# **dingTalkDaTemplateUpdate**
> void dingTalkDaTemplateUpdate(dingTalkDaTemplateUpdateRo, )

DingTalk Callback interface--Template application modification

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkDaTemplateUpdateRequest = {
  // DingTalkDaTemplateUpdateRo
  dingTalkDaTemplateUpdateRo: {
    corpId: "corpId_example",
    opUserId: "opUserId_example",
    bizAppId: "bizAppId_example",
    name: "name_example",
    appStatus: 1,
    timestamp: "timestamp_example",
    signature: "signature_example",
    requestId: "requestId_example",
  },
  // string
  dingTalkDaAppId: "dingTalkDaAppId_example",
};

apiInstance.dingTalkDaTemplateUpdate(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dingTalkDaTemplateUpdateRo** | **DingTalkDaTemplateUpdateRo**|  |
 **dingTalkDaAppId** | [**string**] |  | defaults to undefined


### Return type

**void**

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

# **dingTalkUserLogin**
> ResponseDataDingTalkUserLoginVo dingTalkUserLogin(dingTalkUserLoginRo, )

Use DingTalk login user identity to authorize login. If no user is bound, return parameters to guide registration

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiDingTalkUserLoginRequest = {
  // DingTalkUserLoginRo
  dingTalkUserLoginRo: {
    code: "code_example",
  },
  // string
  agentId: "agentId_example",
};

apiInstance.dingTalkUserLogin(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dingTalkUserLoginRo** | **DingTalkUserLoginRo**|  |
 **agentId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataDingTalkUserLoginVo**

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

# **getDdConfigParam**
> ResponseDataDingTalkDdConfigVo getDdConfigParam(dingTalkDdConfigRo)

Get the dd.config parameter

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetDdConfigParamRequest = {
  // DingTalkDdConfigRo
  dingTalkDdConfigRo: {
    spaceId: "spaceId_example",
    url: "url_example",
  },
};

apiInstance.getDdConfigParam(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dingTalkDdConfigRo** | **DingTalkDdConfigRo**|  |


### Return type

**ResponseDataDingTalkDdConfigVo**

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

# **getSkuPage**
> ResponseDataString getSkuPage(dingTalkInternalSkuPageRo)

Get the SKU page address of domestic products

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetSkuPageRequest = {
  // DingTalkInternalSkuPageRo
  dingTalkInternalSkuPageRo: {
    spaceId: "spaceId_example",
    callbackPage: "callbackPage_example",
    extendParam: "extendParam_example",
  },
};

apiInstance.getSkuPage(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dingTalkInternalSkuPageRo** | **DingTalkInternalSkuPageRo**|  |


### Return type

**ResponseDataString**

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

# **getTenantInfo2**
> ResponseDataTenantDetailVO getTenantInfo2()

Get the space information bound by the tenant

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiGetTenantInfo2Request = {
  // string | kit ID
  suiteId: "111108bb8e6dbc2xxxx",
  // string | current organization ID
  corpId: "aaadd",
};

apiInstance.getTenantInfo2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **suiteId** | [**string**] | kit ID | defaults to undefined
 **corpId** | [**string**] | current organization ID | defaults to undefined


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

# **isvAminUserLogin**
> ResponseDataDingTalkIsvAdminUserLoginVo isvAminUserLogin(dingTalkIsvAminUserLoginRo, )

DingTalk workbench entry, administrator login

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvAminUserLoginRequest = {
  // DingTalkIsvAminUserLoginRo
  dingTalkIsvAminUserLoginRo: {
    code: "code_example",
    corpId: "corpId_example",
  },
  // string | kit ID
  suiteId: "111108bb8e6dbc2xxxx",
};

apiInstance.isvAminUserLogin(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dingTalkIsvAminUserLoginRo** | **DingTalkIsvAminUserLoginRo**|  |
 **suiteId** | [**string**] | kit ID | defaults to undefined


### Return type

**ResponseDataDingTalkIsvAdminUserLoginVo**

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

# **isvBindSpaceInfo**
> ResponseDataDingTalkBindSpaceVo isvBindSpaceInfo()

Get the space station ID of the application binding, and jump to the login page when success=false

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvBindSpaceInfoRequest = {
  // string | kit ID
  suiteId: "111108bb8e6dbc2xxxx",
  // string | Current Organization ID
  corpId: "aaadd",
};

apiInstance.isvBindSpaceInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **suiteId** | [**string**] | kit ID | defaults to undefined
 **corpId** | [**string**] | Current Organization ID | defaults to undefined


### Return type

**ResponseDataDingTalkBindSpaceVo**

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

# **isvUserLogin**
> ResponseDataDingTalkIsvUserLoginVo isvUserLogin(dingTalkIsvUserLoginRo, )

Use the third-party DingTalk login user identity to authorize login. If no user is bound, return the parameter to guide the registration

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiIsvUserLoginRequest = {
  // DingTalkIsvUserLoginRo
  dingTalkIsvUserLoginRo: {
    code: "code_example",
    corpId: "corpId_example",
    bizAppId: "bizAppId_example",
  },
  // string | kit ID
  suiteId: "111108bb8e6dbc2xxxx",
};

apiInstance.isvUserLogin(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dingTalkIsvUserLoginRo** | **DingTalkIsvUserLoginRo**|  |
 **suiteId** | [**string**] | kit ID | defaults to undefined


### Return type

**ResponseDataDingTalkIsvUserLoginVo**

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

# **refreshContact1**
> ResponseDataVoid refreshContact1()

Refresh the address book of DingTalk application

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceDingTalkApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceDingTalkApiRefreshContact1Request = {
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.refreshContact1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


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


