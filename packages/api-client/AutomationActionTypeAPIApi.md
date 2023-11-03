# .AutomationActionTypeAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create10**](AutomationActionTypeAPIApi.md#create10) | **POST** /automation/actionType/create | Create Action Type
[**delete13**](AutomationActionTypeAPIApi.md#delete13) | **POST** /automation/actionType/delete/{actionTypeId} | Delete Action Type
[**edit5**](AutomationActionTypeAPIApi.md#edit5) | **POST** /automation/actionType/edit/{actionTypeId} | Edit Action Type


# **create10**
> ResponseDataString create10(actionTypeCreateRO)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationActionTypeAPIApi(configuration);

let body:.AutomationActionTypeAPIApiCreate10Request = {
  // ActionTypeCreateRO
  actionTypeCreateRO: {
    serviceId: "serviceId_example",
    actionTypeId: "actionTypeId_example",
    name: "name_example",
    description: "description_example",
    inputJsonSchema: "inputJsonSchema_example",
    outputJsonSchema: "outputJsonSchema_example",
    endpoint: "endpoint_example",
    i18n: "i18n_example",
  },
};

apiInstance.create10(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **actionTypeCreateRO** | **ActionTypeCreateRO**|  |


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

# **delete13**
> ResponseDataVoid delete13()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationActionTypeAPIApi(configuration);

let body:.AutomationActionTypeAPIApiDelete13Request = {
  // string
  actionTypeId: "actionTypeId_example",
};

apiInstance.delete13(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **actionTypeId** | [**string**] |  | defaults to undefined


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

# **edit5**
> ResponseDataVoid edit5(actionTypeEditRO, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationActionTypeAPIApi(configuration);

let body:.AutomationActionTypeAPIApiEdit5Request = {
  // ActionTypeEditRO
  actionTypeEditRO: {
    name: "name_example",
    description: "description_example",
    inputJsonSchema: "inputJsonSchema_example",
    outputJsonSchema: "outputJsonSchema_example",
    endpoint: "endpoint_example",
    i18n: "i18n_example",
  },
  // string
  actionTypeId: "actionTypeId_example",
};

apiInstance.edit5(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **actionTypeEditRO** | **ActionTypeEditRO**|  |
 **actionTypeId** | [**string**] |  | defaults to undefined


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


