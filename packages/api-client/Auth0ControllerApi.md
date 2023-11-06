# .Auth0ControllerApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**callback4**](Auth0ControllerApi.md#callback4) | **GET** /auth0/callback | 
[**invitationCallback**](Auth0ControllerApi.md#invitationCallback) | **GET** /invitation/callback | 
[**login3**](Auth0ControllerApi.md#login3) | **GET** /auth0/login | 


# **callback4**
> RedirectView callback4()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .Auth0ControllerApi(configuration);

let body:.Auth0ControllerApiCallback4Request = {
  // string (optional)
  code: "code_example",
  // string (optional)
  error: "error_example",
  // string (optional)
  errorDescription: "error_description_example",
};

apiInstance.callback4(body).then((data:any) => {
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

# **invitationCallback**
> RedirectView invitationCallback()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .Auth0ControllerApi(configuration);

let body:.Auth0ControllerApiInvitationCallbackRequest = {
  // string
  email: "email_example",
  // boolean
  success: true,
};

apiInstance.invitationCallback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **email** | [**string**] |  | defaults to undefined
 **success** | [**boolean**] |  | defaults to undefined


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

# **login3**
> RedirectView login3()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .Auth0ControllerApi(configuration);

let body:.Auth0ControllerApiLogin3Request = {
  // string (optional)
  message: "message_example",
};

apiInstance.login3(body).then((data:any) => {
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


