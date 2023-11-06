# .ProductOperationSystemUserAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**updatePwd1**](ProductOperationSystemUserAPIApi.md#updatePwd1) | **POST** /ops/user/updatePwd | Update Appoint Account Password


# **updatePwd1**
> ResponseDataVoid updatePwd1(registerRO)

Only supply to customized customers

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ProductOperationSystemUserAPIApi(configuration);

let body:.ProductOperationSystemUserAPIApiUpdatePwd1Request = {
  // RegisterRO
  registerRO: {
    username: "xxxx@apitable.com",
    credential: "qwer1234 || 261527",
  },
};

apiInstance.updatePwd1(body).then((data:any) => {
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


