# .AuthorizationRelatedInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**login**](AuthorizationRelatedInterfaceApi.md#login) | **POST** /signIn | login
[**logout**](AuthorizationRelatedInterfaceApi.md#logout) | **GET** /signOut | sign out
[**logout1**](AuthorizationRelatedInterfaceApi.md#logout1) | **POST** /signOut | sign out
[**register**](AuthorizationRelatedInterfaceApi.md#register) | **POST** /register | register


# **login**
> ResponseDataLoginResultVO login(loginRo)

description:verifyType，available values: password sms_code email_code

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AuthorizationRelatedInterfaceApi(configuration);

let body:.AuthorizationRelatedInterfaceApiLoginRequest = {
  // LoginRo
  loginRo: {
    username: "13829291111 ｜ xxxx@apitable.com",
    credential: "qwer1234 || 261527",
    type: "password",
    areaCode: "+86",
    data: "FutureIsComing",
    token: "this_is_token",
    spaceId: "spcaq8UwsxjAc",
  },
};

apiInstance.login(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginRo** | **LoginRo**|  |


### Return type

**ResponseDataLoginResultVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **logout**
> ResponseDataLogoutVO logout()

log out of current user

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AuthorizationRelatedInterfaceApi(configuration);

let body:any = {};

apiInstance.logout(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataLogoutVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **logout1**
> ResponseDataLogoutVO logout1()

log out of current user

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AuthorizationRelatedInterfaceApi(configuration);

let body:any = {};

apiInstance.logout1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataLogoutVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **register**
> ResponseDataVoid register(registerRO)

serving for community edition

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AuthorizationRelatedInterfaceApi(configuration);

let body:.AuthorizationRelatedInterfaceApiRegisterRequest = {
  // RegisterRO
  registerRO: {
    username: "xxxx@apitable.com",
    credential: "qwer1234 || 261527",
  },
};

apiInstance.register(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **registerRO** | **RegisterRO**|  |


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


