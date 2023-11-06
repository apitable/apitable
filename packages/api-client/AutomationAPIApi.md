# .AutomationAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create9**](AutomationAPIApi.md#create9) | **POST** /automation/service/create | Create Service
[**delete12**](AutomationAPIApi.md#delete12) | **POST** /automation/service/delete/{serviceId} | Delete Service
[**edit4**](AutomationAPIApi.md#edit4) | **POST** /automation/service/edit/{serviceId} | Edit Service


# **create9**
> ResponseDataString create9(automationServiceCreateRO)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationAPIApi(configuration);

let body:.AutomationAPIApiCreate9Request = {
  // AutomationServiceCreateRO
  automationServiceCreateRO: {
    serviceId: "serviceId_example",
    slug: "slug_example",
    name: "name_example",
    description: "description_example",
    logo: "logo_example",
    baseUrl: "baseUrl_example",
    i18n: "i18n_example",
  },
};

apiInstance.create9(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **automationServiceCreateRO** | **AutomationServiceCreateRO**|  |


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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **delete12**
> ResponseDataVoid delete12()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationAPIApi(configuration);

let body:.AutomationAPIApiDelete12Request = {
  // string
  serviceId: "serviceId_example",
};

apiInstance.delete12(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **serviceId** | [**string**] |  | defaults to undefined


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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **edit4**
> ResponseDataVoid edit4(automationServiceEditRO, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationAPIApi(configuration);

let body:.AutomationAPIApiEdit4Request = {
  // AutomationServiceEditRO
  automationServiceEditRO: {
    name: "name_example",
    description: "description_example",
    logo: "logo_example",
    baseUrl: "baseUrl_example",
    i18n: "i18n_example",
  },
  // string
  serviceId: "serviceId_example",
};

apiInstance.edit4(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **automationServiceEditRO** | **AutomationServiceEditRO**|  |
 **serviceId** | [**string**] |  | defaults to undefined


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


