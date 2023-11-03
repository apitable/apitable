# .AccountLinkManagementInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**bindDingTalk**](AccountLinkManagementInterfaceApi.md#bindDingTalk) | **POST** /user/bindDingTalk | Associated DingTalk
[**unbind**](AccountLinkManagementInterfaceApi.md#unbind) | **POST** /user/unbind | Unbind the third-party account


# **bindDingTalk**
> ResponseDataVoid bindDingTalk(dingTalkBindOpRo)

Associated DingTalk

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountLinkManagementInterfaceApi(configuration);

let body:.AccountLinkManagementInterfaceApiBindDingTalkRequest = {
  // DingTalkBindOpRo
  dingTalkBindOpRo: {
    areaCode: "+86",
    phone: "133...",
    openId: "liSii8KC",
    unionId: "PiiiPyQqBNBii0HnCJ3zljcuAiEiE",
  },
};

apiInstance.bindDingTalk(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dingTalkBindOpRo** | **DingTalkBindOpRo**|  |


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

# **unbind**
> ResponseDataVoid unbind(userLinkOpRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountLinkManagementInterfaceApi(configuration);

let body:.AccountLinkManagementInterfaceApiUnbindRequest = {
  // UserLinkOpRo
  userLinkOpRo: {
    type: 1,
  },
};

apiInstance.unbind(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userLinkOpRo** | **UserLinkOpRo**|  |


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


