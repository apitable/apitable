# .IDaaSLoginAuthorizationApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getBindInfo**](IDaaSLoginAuthorizationApi.md#getBindInfo) | **GET** /idaas/auth/{spaceId}/bindInfo | Get the IDaaS information bound to the space
[**getLogin**](IDaaSLoginAuthorizationApi.md#getLogin) | **GET** /idaas/auth/login/{clientId} | Get the link to log in to the IDaaS system
[**getLoginRedirect**](IDaaSLoginAuthorizationApi.md#getLoginRedirect) | **GET** /idaas/auth/login/redirect/{clientId} | Jump to the IDaaS system for automatic login
[**postCallback1**](IDaaSLoginAuthorizationApi.md#postCallback1) | **POST** /idaas/auth/callback/{clientId} | The user completes subsequent operations after logging in to the IDaaS system
[**postSpaceCallback**](IDaaSLoginAuthorizationApi.md#postSpaceCallback) | **POST** /idaas/auth/callback/{clientId}/{spaceId} | The user completes subsequent operations after logging in to the IDaaS system


# **getBindInfo**
> ResponseDataIdaasBindInfoVo getBindInfo()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IDaaSLoginAuthorizationApi(configuration);

let body:.IDaaSLoginAuthorizationApiGetBindInfoRequest = {
  // string
  spaceId: "spaceId_example",
};

apiInstance.getBindInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataIdaasBindInfoVo**

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

# **getLogin**
> ResponseDataIdaasAuthLoginVo getLogin()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IDaaSLoginAuthorizationApi(configuration);

let body:.IDaaSLoginAuthorizationApiGetLoginRequest = {
  // string
  clientId: "clientId_example",
};

apiInstance.getLogin(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataIdaasAuthLoginVo**

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

# **getLoginRedirect**
> void getLoginRedirect()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IDaaSLoginAuthorizationApi(configuration);

let body:.IDaaSLoginAuthorizationApiGetLoginRedirectRequest = {
  // string
  clientId: "clientId_example",
};

apiInstance.getLoginRedirect(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | [**string**] |  | defaults to undefined


### Return type

**void**

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

# **postCallback1**
> ResponseDataVoid postCallback1(idaasAuthCallbackRo, )

For private deployment only

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IDaaSLoginAuthorizationApi(configuration);

let body:.IDaaSLoginAuthorizationApiPostCallback1Request = {
  // IdaasAuthCallbackRo
  idaasAuthCallbackRo: {
    code: "code_example",
    state: "state_example",
  },
  // string
  clientId: "clientId_example",
};

apiInstance.postCallback1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **idaasAuthCallbackRo** | **IdaasAuthCallbackRo**|  |
 **clientId** | [**string**] |  | defaults to undefined


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

# **postSpaceCallback**
> ResponseDataVoid postSpaceCallback(idaasAuthCallbackRo, )

For Sass version only

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IDaaSLoginAuthorizationApi(configuration);

let body:.IDaaSLoginAuthorizationApiPostSpaceCallbackRequest = {
  // IdaasAuthCallbackRo
  idaasAuthCallbackRo: {
    code: "code_example",
    state: "state_example",
  },
  // string
  clientId: "clientId_example",
  // string
  spaceId: "spaceId_example",
};

apiInstance.postSpaceCallback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **idaasAuthCallbackRo** | **IdaasAuthCallbackRo**|  |
 **clientId** | [**string**] |  | defaults to undefined
 **spaceId** | [**string**] |  | defaults to undefined


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


