# .PlayerSystemActivityAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**triggerWizard**](PlayerSystemActivityAPIApi.md#triggerWizard) | **POST** /player/activity/triggerWizard | Trigger Wizard


# **triggerWizard**
> ResponseDataVoid triggerWizard(activityStatusRo)

Scene: After triggering the guided click event, modify the state or the cumulative number of times.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .PlayerSystemActivityAPIApi(configuration);

let body:.PlayerSystemActivityAPIApiTriggerWizardRequest = {
  // ActivityStatusRo
  activityStatusRo: {
    wizardId: 1,
  },
};

apiInstance.triggerWizard(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **activityStatusRo** | **ActivityStatusRo**|  |


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


