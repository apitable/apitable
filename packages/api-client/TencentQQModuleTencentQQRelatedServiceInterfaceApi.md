# .TencentQQModuleTencentQQRelatedServiceInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**callback2**](TencentQQModuleTencentQQRelatedServiceInterfaceApi.md#callback2) | **GET** /tencent/web/callback | Website application callback


# **callback2**
> ResponseDataString callback2()

code、accessToken, At least one is passed in

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TencentQQModuleTencentQQRelatedServiceInterfaceApi(configuration);

let body:.TencentQQModuleTencentQQRelatedServiceInterfaceApiCallback2Request = {
  // number | Type (0: Scan code for login; 1: Account binding;) (optional)
  type: 0,
  // string | Code (build the request yourself and call back the parameter) (optional)
  code: "ABC123",
  // string | Authorization token (use the JS SDK to call back this parameter) (optional)
  accessToken: "05C5374834",
  // string | access token\'s TERM OF VALIDITY (optional)
  expiresIn: "7776000",
};

apiInstance.callback2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | [**number**] | Type (0: Scan code for login; 1: Account binding;) | (optional) defaults to undefined
 **code** | [**string**] | Code (build the request yourself and call back the parameter) | (optional) defaults to undefined
 **accessToken** | [**string**] | Authorization token (use the JS SDK to call back this parameter) | (optional) defaults to undefined
 **expiresIn** | [**string**] | access token\&#39;s TERM OF VALIDITY | (optional) defaults to undefined


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


