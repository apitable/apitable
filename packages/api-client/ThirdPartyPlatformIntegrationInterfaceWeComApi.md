# .ThirdPartyPlatformIntegrationInterfaceWeComApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**bindSpaceInfo**](ThirdPartyPlatformIntegrationInterfaceWeComApi.md#bindSpaceInfo) | **GET** /social/wecom/agent/get/bindSpace | Obtain the space ID bound by the self built application of WeCom
[**getTenantBindWeComConfig**](ThirdPartyPlatformIntegrationInterfaceWeComApi.md#getTenantBindWeComConfig) | **GET** /social/wecom/get/config | Get the bound WeCom application configuration of the space station
[**hotsTransformIp**](ThirdPartyPlatformIntegrationInterfaceWeComApi.md#hotsTransformIp) | **POST** /social/wecom/hotsTransformIp | WeCom Verification domain name conversion IP
[**socialTenantEnv**](ThirdPartyPlatformIntegrationInterfaceWeComApi.md#socialTenantEnv) | **GET** /social/tenant/env | Get integrated tenant environment configuration
[**weComBindConfig**](ThirdPartyPlatformIntegrationInterfaceWeComApi.md#weComBindConfig) | **POST** /social/wecom/bind/{configSha}/config | WeCom Application binding space
[**weComCheckConfig**](ThirdPartyPlatformIntegrationInterfaceWeComApi.md#weComCheckConfig) | **POST** /social/wecom/check/config | WeCom Verification - Authorization Application Configuration
[**weComRefreshContact**](ThirdPartyPlatformIntegrationInterfaceWeComApi.md#weComRefreshContact) | **GET** /social/wecom/refresh/contact | WeCom App Refresh Address Book
[**weComUserLogin**](ThirdPartyPlatformIntegrationInterfaceWeComApi.md#weComUserLogin) | **POST** /social/wecom/user/login | WeCom Application user login


# **bindSpaceInfo**
> ResponseDataWeComBindSpaceVo bindSpaceInfo()

Get the space ID bound to the self built application of WeCom, and jump to the login page when success=false

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComApiBindSpaceInfoRequest = {
  // string
  corpId: "corpId_example",
  // number
  agentId: 1,
};

apiInstance.bindSpaceInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **corpId** | [**string**] |  | defaults to undefined
 **agentId** | [**number**] |  | defaults to undefined


### Return type

**ResponseDataWeComBindSpaceVo**

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

# **getTenantBindWeComConfig**
> ResponseDataWeComBindConfigVo getTenantBindWeComConfig()

Get the bound WeCom application configuration of the space station

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComApiGetTenantBindWeComConfigRequest = {
  // string | space ID
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.getTenantBindWeComConfig(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space ID | defaults to undefined


### Return type

**ResponseDataWeComBindConfigVo**

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

# **hotsTransformIp**
> ResponseDataBoolean hotsTransformIp(hotsTransformIpRo)

Used to generate We Com scanning code to log in and verify whether the domain name can be accessed

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComApiHotsTransformIpRequest = {
  // HotsTransformIpRo
  hotsTransformIpRo: {
    domain: "spcxqmlr2lusd.enp.vika.ltd",
  },
};

apiInstance.hotsTransformIp(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **hotsTransformIpRo** | **HotsTransformIpRo**|  |


### Return type

**ResponseDataBoolean**

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

# **socialTenantEnv**
> ResponseDataSocialTenantEnvVo socialTenantEnv()

Get integrated tenant environment configuration

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComApiSocialTenantEnvRequest = {
  // string | Real request address
  xRealHost: "spch5n5x2572s.enp.vika.ltd",
};

apiInstance.socialTenantEnv(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xRealHost** | [**string**] | Real request address | defaults to undefined


### Return type

**ResponseDataSocialTenantEnvVo**

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

# **weComBindConfig**
> ResponseDataVoid weComBindConfig(weComAgentBindSpaceRo, )

WeCom Application binding space

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComApiWeComBindConfigRequest = {
  // WeComAgentBindSpaceRo
  weComAgentBindSpaceRo: {
    spaceId: "spc2123hjhasd",
    code: "CODE",
  },
  // string
  configSha: "configSha_example",
};

apiInstance.weComBindConfig(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **weComAgentBindSpaceRo** | **WeComAgentBindSpaceRo**|  |
 **configSha** | [**string**] |  | defaults to undefined


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

# **weComCheckConfig**
> ResponseDataWeComCheckConfigVo weComCheckConfig(weComCheckConfigRo, )

Before binding We Com, verify the third-party application configuration in advance. If the code scanning verification is not successful, the configuration file is not effective

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComApiWeComCheckConfigRequest = {
  // WeComCheckConfigRo
  weComCheckConfigRo: {
    corpId: "corpId_example",
    agentId: 1,
    agentSecret: "agentSecret_example",
  },
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.weComCheckConfig(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **weComCheckConfigRo** | **WeComCheckConfigRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataWeComCheckConfigVo**

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

# **weComRefreshContact**
> ResponseDataVoid weComRefreshContact()

WeCom Apply to refresh the address book manually

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComApiWeComRefreshContactRequest = {
  // string | space ID
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.weComRefreshContact(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space ID | defaults to undefined


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

# **weComUserLogin**
> ResponseDataWeComUserLoginVo weComUserLogin(weComUserLoginRo)

Use WeCom login user identity to authorize login, and return parameters to guide registration when no user is bound

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWeComApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWeComApiWeComUserLoginRequest = {
  // WeComUserLoginRo
  weComUserLoginRo: {
    corpId: "corpId_example",
    agentId: 1,
    code: "code_example",
  },
};

apiInstance.weComUserLogin(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **weComUserLoginRo** | **WeComUserLoginRo**|  |


### Return type

**ResponseDataWeComUserLoginVo**

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


