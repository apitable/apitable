# .AutomationOpenApiControllerApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createOrUpdateTrigger**](AutomationOpenApiControllerApi.md#createOrUpdateTrigger) | **POST** /automation/open/triggers/createOrUpdate | 
[**deleteTrigger1**](AutomationOpenApiControllerApi.md#deleteTrigger1) | **DELETE** /automation/open/triggers/datasheets/{datasheetId}/robots | 


# **createOrUpdateTrigger**
> ResponseDataAutomationTriggerCreateVo createOrUpdateTrigger(automationApiTriggerCreateRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationOpenApiControllerApi(configuration);

let body:.AutomationOpenApiControllerApiCreateOrUpdateTriggerRequest = {
  // AutomationApiTriggerCreateRo
  automationApiTriggerCreateRo: {
    robot: {
      name: "name_example",
      description: "description_example",
      resourceId: "resourceId_example",
    },
    trigger: {
      typeName: "typeName_example",
      input: 
        key: {},
      ,
    },
    webhookUrl: "webhookUrl_example",
    seqId: "seqId_example",
  },
  // string (optional)
  xServiceToken: "X-Service-Token_example",
};

apiInstance.createOrUpdateTrigger(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **automationApiTriggerCreateRo** | **AutomationApiTriggerCreateRo**|  |
 **xServiceToken** | [**string**] |  | (optional) defaults to undefined


### Return type

**ResponseDataAutomationTriggerCreateVo**

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

# **deleteTrigger1**
> ResponseDataString deleteTrigger1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AutomationOpenApiControllerApi(configuration);

let body:.AutomationOpenApiControllerApiDeleteTrigger1Request = {
  // string
  datasheetId: "datasheetId_example",
  // Array<string>
  robotIds: [
    "robotIds_example",
  ],
};

apiInstance.deleteTrigger1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **datasheetId** | [**string**] |  | defaults to undefined
 **robotIds** | **Array&lt;string&gt;** |  | defaults to undefined


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


