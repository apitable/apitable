# .AirAgentAuthResourceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**callback5**](AirAgentAuthResourceApi.md#callback5) | **GET** /airagent/login/callback | 
[**login4**](AirAgentAuthResourceApi.md#login4) | **GET** /airagent/login | 
[**logout2**](AirAgentAuthResourceApi.md#logout2) | **GET** /airagent/logout | Logout
[**logout3**](AirAgentAuthResourceApi.md#logout3) | **POST** /airagent/logout | Logout


# **callback5**
> RedirectView callback5()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAuthResourceApi(configuration);

let body:.AirAgentAuthResourceApiCallback5Request = {
  // string (optional)
  code: "code_example",
  // string (optional)
  error: "error_example",
  // string (optional)
  errorDescription: "error_description_example",
};

apiInstance.callback5(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | [**string**] |  | (optional) defaults to undefined
 **error** | [**string**] |  | (optional) defaults to undefined
 **errorDescription** | [**string**] |  | (optional) defaults to undefined


### Return type

**RedirectView**

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

# **login4**
> RedirectView login4()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAuthResourceApi(configuration);

let body:.AirAgentAuthResourceApiLogin4Request = {
  // string (optional)
  message: "message_example",
};

apiInstance.login4(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **message** | [**string**] |  | (optional) defaults to undefined


### Return type

**RedirectView**

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

# **logout2**
> RedirectView logout2()

logout current user

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAuthResourceApi(configuration);

let body:any = {};

apiInstance.logout2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**RedirectView**

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

# **logout3**
> RedirectView logout3()

logout current user

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AirAgentAuthResourceApi(configuration);

let body:any = {};

apiInstance.logout3(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**RedirectView**

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


