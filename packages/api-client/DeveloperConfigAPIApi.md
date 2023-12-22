# .DeveloperConfigAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createApiKey**](DeveloperConfigAPIApi.md#createApiKey) | **POST** /user/createApiKey | Create the developer access token
[**refreshApiKey**](DeveloperConfigAPIApi.md#refreshApiKey) | **POST** /user/refreshApiKey | Refresh the developer access token
[**validateApiKey**](DeveloperConfigAPIApi.md#validateApiKey) | **GET** /user/valid/{apiKey} | Verify the access token


# **createApiKey**
> ResponseDataDeveloperInfoVo createApiKey()

Create developer access tokens to access open platform functionality.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DeveloperConfigAPIApi(configuration);

let body:any = {};

apiInstance.createApiKey(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataDeveloperInfoVo**

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

# **refreshApiKey**
> ResponseDataDeveloperInfoVo refreshApiKey(refreshApiKeyRo)

Refresh developer access token before verifying phone number.If there is no verification mailbox, skip verification.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DeveloperConfigAPIApi(configuration);

let body:.DeveloperConfigAPIApiRefreshApiKeyRequest = {
  // RefreshApiKeyRo
  refreshApiKeyRo: {
    type: "sms_code",
    code: "125484",
  },
};

apiInstance.refreshApiKey(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **refreshApiKeyRo** | **RefreshApiKeyRo**|  |


### Return type

**ResponseDataDeveloperInfoVo**

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

# **validateApiKey**
> ResponseDataBoolean validateApiKey()

Provides a mid-tier validation access token.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DeveloperConfigAPIApi(configuration);

let body:.DeveloperConfigAPIApiValidateApiKeyRequest = {
  // string
  apiKey: "apiKey_example",
};

apiInstance.validateApiKey(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apiKey** | [**string**] |  | defaults to undefined


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


