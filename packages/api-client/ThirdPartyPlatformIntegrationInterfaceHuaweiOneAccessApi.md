# .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**copyTeamAndMembers**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#copyTeamAndMembers) | **POST** /social/oneaccess/copyTeamAndMembers | Sync group or member to Honma station
[**login2**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#login2) | **GET** /social/oneaccess/login | Unified login interface
[**oauth2Callback**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#oauth2Callback) | **GET** /social/oneaccess/oauth2/callback | Login callback interface
[**orgCreate**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#orgCreate) | **POST** /social/oneaccess/OrgCreateService | organization creation
[**orgDelete**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#orgDelete) | **POST** /social/oneaccess/OrgDeleteService | Organization deletion
[**orgUpdate**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#orgUpdate) | **POST** /social/oneaccess/OrgUpdateService | Organizational update
[**queryOrgByIdService**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#queryOrgByIdService) | **POST** /social/oneaccess/QueryOrgByIdService | query org
[**queryUserByIdService**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#queryUserByIdService) | **POST** /social/oneaccess/QueryUserByIdService | query user
[**userCreate**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#userCreate) | **POST** /social/oneaccess/UserCreateService | Account creation
[**userDelete**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#userDelete) | **POST** /social/oneaccess/UserDeleteService | user delete
[**userLogin1**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#userLogin1) | **GET** /social/oneaccess/user/login | login
[**userSchema**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#userSchema) | **POST** /social/oneaccess/SchemaService | Get schema information
[**userUpdate**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#userUpdate) | **POST** /social/oneaccess/UserUpdateService | User update
[**wecomLogin**](ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi.md#wecomLogin) | **GET** /social/oneaccess/wecom/login | Government Affairs WeCom Login Interface


# **copyTeamAndMembers**
> ResponseDataVoid copyTeamAndMembers(oneAccessCopyInfoRo)

Synchronize a group or member to the current station

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiCopyTeamAndMembersRequest = {
  // OneAccessCopyInfoRo
  oneAccessCopyInfoRo: {
    linkId: "linkId_example",
    members: [
      {
        memberId: "memberId_example",
        unitId: "unitId_example",
        teamId: "teamId_example",
      },
    ],
    teamIds: [
      "teamIds_example",
    ],
  },
};

apiInstance.copyTeamAndMembers(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **oneAccessCopyInfoRo** | **OneAccessCopyInfoRo**|  |


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

# **login2**
> void login2()

login

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:any = {};

apiInstance.login2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **oauth2Callback**
> void oauth2Callback()

Accept the authorization interface of OneAccess and call back the login

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiOauth2CallbackRequest = {
  // string
  code: "code_example",
  // string
  state: "state_example",
};

apiInstance.oauth2Callback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | [**string**] |  | defaults to undefined
 **state** | [**string**] |  | defaults to undefined


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

# **orgCreate**
> string orgCreate()

Organizations are created by oneAccess

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:any = {};

apiInstance.orgCreate(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **orgDelete**
> string orgDelete()

Active deletion of an organization by OneAccess

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:any = {};

apiInstance.orgDelete(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **orgUpdate**
> string orgUpdate()

Organizations are updated by OneAccess

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:any = {};

apiInstance.orgUpdate(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **queryOrgByIdService**
> string queryOrgByIdService()

query org by params

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:any = {};

apiInstance.queryOrgByIdService(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **queryUserByIdService**
> string queryUserByIdService()

query user by params

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:any = {};

apiInstance.queryUserByIdService(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **userCreate**
> string userCreate()

The account is actively created by the oneAccess platform

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:any = {};

apiInstance.userCreate(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **userDelete**
> string userDelete()

Delete the account by the oneAccess platform

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:any = {};

apiInstance.userDelete(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **userLogin1**
> void userLogin1()

Log in to the openaccess interface, redirect iam single sign-on

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:any = {};

apiInstance.userLogin1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **userSchema**
> string userSchema()

Get all information about objects such as system account, institution role, etc.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:any = {};

apiInstance.userSchema(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **userUpdate**
> string userUpdate()

The user information is actively updated by the OneAccess platform

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:any = {};

apiInstance.userUpdate(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **wecomLogin**
> void wecomLogin()

Government WeCom Login

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApi(configuration);

let body:.ThirdPartyPlatformIntegrationInterfaceHuaweiOneAccessApiWecomLoginRequest = {
  // string
  code: "code_example",
};

apiInstance.wecomLogin(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | [**string**] |  | defaults to undefined


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


