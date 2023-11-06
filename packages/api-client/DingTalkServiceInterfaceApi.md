# .DingTalkServiceInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**callback3**](DingTalkServiceInterfaceApi.md#callback3) | **GET** /dingtalk/login/callback | DingTalk scan code login callback


# **callback3**
> ResponseDataString callback3()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DingTalkServiceInterfaceApi(configuration);

let body:.DingTalkServiceInterfaceApiCallback3Request = {
  // string | coding. JS gets the login Tmp Code, redirects and returns after jumping to the specified connection
  code: "ABC123",
  // string | declare value. Used to prevent replay attacks
  state: "STATE",
  // number | Type (0: scan code to log in; 1: account binding;) (optional)
  type: 0,
};

apiInstance.callback3(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | [**string**] | coding. JS gets the login Tmp Code, redirects and returns after jumping to the specified connection | defaults to undefined
 **state** | [**string**] | declare value. Used to prevent replay attacks | defaults to undefined
 **type** | [**number**] | Type (0: scan code to log in; 1: account binding;) | (optional) defaults to undefined


### Return type

**ResponseDataString**

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


