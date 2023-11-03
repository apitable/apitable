# .AutomationTriggerTypeAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create8**](AutomationTriggerTypeAPIApi.md#create8) | **POST** /automation/triggerType/create | Create Trigger Type
[**delete11**](AutomationTriggerTypeAPIApi.md#delete11) | **POST** /automation/triggerType/delete/{triggerTypeId} | Delete Trigger Type
[**edit3**](AutomationTriggerTypeAPIApi.md#edit3) | **POST** /automation/triggerType/edit/{triggerTypeId} | Edit Trigger Type


# **create8**
> ResponseDataString create8(triggerTypeCreateRO)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationTriggerTypeAPIApi(configuration);

let body:.AutomationTriggerTypeAPIApiCreate8Request = {
  // TriggerTypeCreateRO
  triggerTypeCreateRO: {
    serviceId: "serviceId_example",
    triggerTypeId: "triggerTypeId_example",
    name: "name_example",
    description: "description_example",
    inputJsonSchema: "inputJsonSchema_example",
    outputJsonSchema: "outputJsonSchema_example",
    endpoint: "endpoint_example",
    i18n: "i18n_example",
  },
};

apiInstance.create8(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **triggerTypeCreateRO** | **TriggerTypeCreateRO**|  |


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

# **delete11**
> ResponseDataVoid delete11()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationTriggerTypeAPIApi(configuration);

let body:.AutomationTriggerTypeAPIApiDelete11Request = {
  // string
  triggerTypeId: "triggerTypeId_example",
};

apiInstance.delete11(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **triggerTypeId** | [**string**] |  | defaults to undefined


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

# **edit3**
> ResponseDataVoid edit3(triggerTypeEditRO, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationTriggerTypeAPIApi(configuration);

let body:.AutomationTriggerTypeAPIApiEdit3Request = {
  // TriggerTypeEditRO
  triggerTypeEditRO: {
    name: "name_example",
    description: "description_example",
    inputJsonSchema: "inputJsonSchema_example",
    outputJsonSchema: "outputJsonSchema_example",
    endpoint: "endpoint_example",
    i18n: "i18n_example",
  },
  // string
  triggerTypeId: "triggerTypeId_example",
};

apiInstance.edit3(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **triggerTypeEditRO** | **TriggerTypeEditRO**|  |
 **triggerTypeId** | [**string**] |  | defaults to undefined


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


