# .AccountCenterModuleUserManagementInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**applyForClosing**](AccountCenterModuleUserManagementInterfaceApi.md#applyForClosing) | **POST** /user/applyForClosing | Apply for cancellation of user account
[**bindEmail**](AccountCenterModuleUserManagementInterfaceApi.md#bindEmail) | **POST** /user/bindEmail | Bind mail
[**cancelClosing**](AccountCenterModuleUserManagementInterfaceApi.md#cancelClosing) | **POST** /user/cancelClosing | Apply for account restoration
[**checkForClosing**](AccountCenterModuleUserManagementInterfaceApi.md#checkForClosing) | **GET** /user/checkForClosing | Verify whether the account can be cancelled
[**delActiveSpaceCache**](AccountCenterModuleUserManagementInterfaceApi.md#delActiveSpaceCache) | **GET** /user/delActiveSpaceCache | Delete Active Space Cache
[**getEnabledLabFeatures**](AccountCenterModuleUserManagementInterfaceApi.md#getEnabledLabFeatures) | **GET** /user/labs/features | Get the enabled experimental functions
[**linkInviteEmail**](AccountCenterModuleUserManagementInterfaceApi.md#linkInviteEmail) | **POST** /user/link/inviteEmail | Associate the invited mail
[**resetPassword**](AccountCenterModuleUserManagementInterfaceApi.md#resetPassword) | **POST** /user/resetPassword | reset password router
[**retrievePwd**](AccountCenterModuleUserManagementInterfaceApi.md#retrievePwd) | **POST** /user/retrievePwd | Retrieve password
[**unbindEmail**](AccountCenterModuleUserManagementInterfaceApi.md#unbindEmail) | **POST** /user/unbindEmail | Unbind mail
[**unbindPhone**](AccountCenterModuleUserManagementInterfaceApi.md#unbindPhone) | **POST** /user/unbindPhone | Unbind mobile phone
[**update**](AccountCenterModuleUserManagementInterfaceApi.md#update) | **POST** /user/update | Edit user information
[**updateLabsFeatureStatus**](AccountCenterModuleUserManagementInterfaceApi.md#updateLabsFeatureStatus) | **POST** /user/labs/features | Update the usage status of laboratory functions
[**updatePwd**](AccountCenterModuleUserManagementInterfaceApi.md#updatePwd) | **POST** /user/updatePwd | Change Password
[**userInfo**](AccountCenterModuleUserManagementInterfaceApi.md#userInfo) | **GET** /user/me | get personal information
[**validBindEmail**](AccountCenterModuleUserManagementInterfaceApi.md#validBindEmail) | **GET** /user/email/bind | Query whether users bind mail
[**validSameEmail**](AccountCenterModuleUserManagementInterfaceApi.md#validSameEmail) | **POST** /user/validate/email | Query whether the user is consistent with the specified mail
[**verifyPhone**](AccountCenterModuleUserManagementInterfaceApi.md#verifyPhone) | **POST** /user/bindPhone | Bind a new phone


# **applyForClosing**
> ResponseDataVoid applyForClosing()

Registered login user applies for account cancellation

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:any = {};

apiInstance.applyForClosing(body).then((data:any) => {
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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **bindEmail**
> ResponseDataVoid bindEmail(emailCodeValidateRo)

Bind mail and modify mail

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiBindEmailRequest = {
  // EmailCodeValidateRo
  emailCodeValidateRo: {
    email: "xxxx@apitable.com",
    code: "123456",
  },
};

apiInstance.bindEmail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **emailCodeValidateRo** | **EmailCodeValidateRo**|  |


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

# **cancelClosing**
> ResponseDataVoid cancelClosing()

User recovery account has been applied for cancellation

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:any = {};

apiInstance.cancelClosing(body).then((data:any) => {
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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **checkForClosing**
> ResponseDataVoid checkForClosing()

Unregistered users verify whether the account meets the cancellation conditions

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:any = {};

apiInstance.checkForClosing(body).then((data:any) => {
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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **delActiveSpaceCache**
> ResponseDataVoid delActiveSpaceCache()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:any = {};

apiInstance.delActiveSpaceCache(body).then((data:any) => {
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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getEnabledLabFeatures**
> ResponseDataLabsFeatureVo getEnabledLabFeatures()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiGetEnabledLabFeaturesRequest = {
  // string
  spaceId: "spaceId_example",
};

apiInstance.getEnabledLabFeatures(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataLabsFeatureVo**

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

# **linkInviteEmail**
> ResponseDataVoid linkInviteEmail(userLinkEmailRo)

Users can only associate with invited mail when they have no other mail

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiLinkInviteEmailRequest = {
  // UserLinkEmailRo
  userLinkEmailRo: {
    email: "123456@qq.com",
    spaceId: "spcyQkKp9XJEl",
  },
};

apiInstance.linkInviteEmail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userLinkEmailRo** | **UserLinkEmailRo**|  |


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

# **resetPassword**
> ResponseDataVoid resetPassword()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:any = {};

apiInstance.resetPassword(body).then((data:any) => {
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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **retrievePwd**
> ResponseDataVoid retrievePwd(retrievePwdOpRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiRetrievePwdRequest = {
  // RetrievePwdOpRo
  retrievePwdOpRo: {
    type: "sms_code",
    areaCode: "+86",
    username: "13829291111 ｜ xxx@xx.com",
    code: "123456",
    password: "qwer1234",
  },
};

apiInstance.retrievePwd(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **retrievePwdOpRo** | **RetrievePwdOpRo**|  |


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

# **unbindEmail**
> ResponseDataVoid unbindEmail(codeValidateRo)

Bind mail and modify mail

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiUnbindEmailRequest = {
  // CodeValidateRo
  codeValidateRo: {
    code: "123456",
  },
};

apiInstance.unbindEmail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **codeValidateRo** | **CodeValidateRo**|  |


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

# **unbindPhone**
> ResponseDataVoid unbindPhone(codeValidateRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiUnbindPhoneRequest = {
  // CodeValidateRo
  codeValidateRo: {
    code: "123456",
  },
};

apiInstance.unbindPhone(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **codeValidateRo** | **CodeValidateRo**|  |


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

# **update**
> ResponseDataString update(userOpRo)

Request parameters cannot be all empty

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiUpdateRequest = {
  // UserOpRo
  userOpRo: {
    maxSize: 1,
    avatar: "https://...",
    avatarColor: 1,
    nickName: "This is a nickname",
    init: true,
    locale: "zh-CN",
    timeZone: "America/Toronto",
  },
};

apiInstance.update(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userOpRo** | **UserOpRo**|  |


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateLabsFeatureStatus**
> ResponseDataVoid updateLabsFeatureStatus(userLabsFeatureRo)

Update the usage status of laboratory functions

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiUpdateLabsFeatureStatusRequest = {
  // UserLabsFeatureRo
  userLabsFeatureRo: {
    spaceId: "spc6e2CeZLBFN",
    key: "render_prompt",
    isEnabled: true,
  },
};

apiInstance.updateLabsFeatureStatus(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userLabsFeatureRo** | **UserLabsFeatureRo**|  |


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

# **updatePwd**
> ResponseDataVoid updatePwd(updatePwdOpRo)

Scene: 1. Personal setting and password modification; 2. Initialize after login for accounts without password

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiUpdatePwdRequest = {
  // UpdatePwdOpRo
  updatePwdOpRo: {
    type: "sms_code",
    code: "123456",
    password: "qwer1234",
  },
};

apiInstance.updatePwd(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updatePwdOpRo** | **UpdatePwdOpRo**|  |


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

# **userInfo**
> ResponseDataUserInfoVo userInfo()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiUserInfoRequest = {
  // string | space id (optional)
  spaceId: "spc8mXUeiXyVo",
  // string | node id (optional)
  nodeId: "dstS94qPZFXjC1LKns",
  // boolean | whether to filter space related information (optional)
  filter: true,
};

apiInstance.userInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | (optional) defaults to undefined
 **nodeId** | [**string**] | node id | (optional) defaults to undefined
 **filter** | [**boolean**] | whether to filter space related information | (optional) defaults to undefined


### Return type

**ResponseDataUserInfoVo**

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

# **validBindEmail**
> ResponseDataBoolean validBindEmail()

Query whether users bind mail

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:any = {};

apiInstance.validBindEmail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataBoolean**

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

# **validSameEmail**
> ResponseDataBoolean validSameEmail(checkUserEmailRo)

Query whether the user is consistent with the specified mail. It can only be determined if the user has bound the mail

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiValidSameEmailRequest = {
  // CheckUserEmailRo
  checkUserEmailRo: {
    email: "123456@qq.com",
  },
};

apiInstance.validSameEmail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **checkUserEmailRo** | **CheckUserEmailRo**|  |


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **verifyPhone**
> ResponseDataVoid verifyPhone(smsCodeValidateRo)

Bind a new phone

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountCenterModuleUserManagementInterfaceApi(configuration);

let body:.AccountCenterModuleUserManagementInterfaceApiVerifyPhoneRequest = {
  // SmsCodeValidateRo
  smsCodeValidateRo: {
    areaCode: "+86",
    phone: "13411112222",
    code: "123456",
  },
};

apiInstance.verifyPhone(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **smsCodeValidateRo** | **SmsCodeValidateRo**|  |


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


