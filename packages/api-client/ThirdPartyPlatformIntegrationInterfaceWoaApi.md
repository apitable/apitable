# .ThirdPartyPlatformIntegrationInterfaceWoaApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**bindSpace**](ThirdPartyPlatformIntegrationInterfaceWoaApi.md#bindSpace) | **POST** /social/woa/bindSpace | Woa Application Binding Space
[**refreshContact**](ThirdPartyPlatformIntegrationInterfaceWoaApi.md#refreshContact) | **POST** /social/woa/refresh/contact | Woa App Refresh Address Book
[**userLogin**](ThirdPartyPlatformIntegrationInterfaceWoaApi.md#userLogin) | **POST** /social/woa/user/login | Woa Application User Login


# **bindSpace**
> ResponseDataVoid bindSpace(woaAppBindSpaceRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWoaApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWoaApiBindSpaceRequest = {
  // WoaAppBindSpaceRo
  woaAppBindSpaceRo: {
    spaceId: "spc2123hjhasd",
    appId: "AK2023xxx",
    secretKey: "abcxxx",
  },
};

apiInstance.bindSpace(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **woaAppBindSpaceRo** | **WoaAppBindSpaceRo**|  |


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

# **refreshContact**
> ResponseDataVoid refreshContact()

Apply to refresh the address book manually

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWoaApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWoaApiRefreshContactRequest = {
  // string | Space ID
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.refreshContact(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | Space ID | defaults to undefined


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

# **userLogin**
> ResponseDataWoaUserLoginVo userLogin(woaUserLoginRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceWoaApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceWoaApiUserLoginRequest = {
  // WoaUserLoginRo
  woaUserLoginRo: {
    appId: "appId_example",
    code: "code_example",
  },
};

apiInstance.userLogin(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **woaUserLoginRo** | **WoaUserLoginRo**|  |


### Return type

**ResponseDataWoaUserLoginVo**

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


