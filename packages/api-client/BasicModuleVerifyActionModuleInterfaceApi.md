# .BasicModuleVerifyActionModuleInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**inviteTokenValid**](BasicModuleVerifyActionModuleInterfaceApi.md#inviteTokenValid) | **POST** /base/action/invite/valid | Invitation temporary code verification
[**mail**](BasicModuleVerifyActionModuleInterfaceApi.md#mail) | **POST** /base/action/mail/code | Send email verification code
[**send**](BasicModuleVerifyActionModuleInterfaceApi.md#send) | **POST** /base/action/sms/code | Send SMS verification code
[**validateEmail**](BasicModuleVerifyActionModuleInterfaceApi.md#validateEmail) | **POST** /base/action/email/code/validate | Email verification code verification
[**verifyPhone1**](BasicModuleVerifyActionModuleInterfaceApi.md#verifyPhone1) | **POST** /base/action/sms/code/validate | Mobile verification code verification


# **inviteTokenValid**
> ResponseDataInviteInfoVo inviteTokenValid(inviteValidRo)

Invitation link token verification, the relevant invitation information can be obtained after the verification is successful

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleVerifyActionModuleInterfaceApi(configuration);

let body:.BasicModuleVerifyActionModuleInterfaceApiInviteTokenValidRequest = {
  // InviteValidRo
  inviteValidRo: {
    token: "b10e5e36cd7249bdaeab3e424308deed",
    nodeId: "dst****",
    data: "FutureIsComing",
  },
};

apiInstance.inviteTokenValid(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inviteValidRo** | **InviteValidRo**|  |


### Return type

**ResponseDataInviteInfoVo**

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

# **mail**
> ResponseDataVoid mail(emailOpRo)

Email verification code; 1:Email binding, 2: Email registration, 3: General verification

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleVerifyActionModuleInterfaceApi(configuration);

let body:.BasicModuleVerifyActionModuleInterfaceApiMailRequest = {
  // EmailOpRo
  emailOpRo: {
    email: "...@apitable.com",
    type: 1,
  },
};

apiInstance.mail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **emailOpRo** | **EmailOpRo**|  |


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

# **send**
> ResponseDataVoid send(smsOpRo)

SMS type; 1: Registration, 2:Login, 3: Modify login password, 4: DingTalk binding, 5: Bind mobile phone, 6: (Remove replacement) mobile phone binding 7: Modify mailbox binding,8: Delete space, 9: Replace main administrator 10: General verification, 11: Change developer configuration, 12: Bind third-party platform account

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleVerifyActionModuleInterfaceApi(configuration);

let body:.BasicModuleVerifyActionModuleInterfaceApiSendRequest = {
  // SmsOpRo
  smsOpRo: {
    areaCode: "+86",
    phone: "131...",
    type: 1,
    data: "BornForFuture",
  },
};

apiInstance.send(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **smsOpRo** | **SmsOpRo**|  |


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

# **validateEmail**
> ResponseDataVoid validateEmail(emailCodeValidateRo)

Usage scenario: Verify identity before changing email address when no mobile phone, change the main administrator

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleVerifyActionModuleInterfaceApi(configuration);

let body:.BasicModuleVerifyActionModuleInterfaceApiValidateEmailRequest = {
  // EmailCodeValidateRo
  emailCodeValidateRo: {
    email: "xxxx@apitable.com",
    code: "123456",
  },
};

apiInstance.validateEmail(body).then((data:any) => {
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

# **verifyPhone1**
> ResponseDataVoid verifyPhone1(smsCodeValidateRo)

Usage scenarios: DingTalk binding, identity verification before changing the mobile phone mailbox, changing the main administrator

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleVerifyActionModuleInterfaceApi(configuration);

let body:.BasicModuleVerifyActionModuleInterfaceApiVerifyPhone1Request = {
  // SmsCodeValidateRo
  smsCodeValidateRo: {
    areaCode: "+86",
    phone: "13411112222",
    code: "123456",
  },
};

apiInstance.verifyPhone1(body).then((data:any) => {
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


