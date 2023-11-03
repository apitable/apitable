# .OpenApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**validateApiKey1**](OpenApiApi.md#validateApiKey1) | **GET** /openapi/widgetInfo/{widgetId} | Get information that the applet can expose


# **validateApiKey1**
> ResponseDataWidgetInfoVo validateApiKey1()

Get information that the applet can expose

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OpenApiApi(configuration);

let body:.OpenApiApiValidateApiKey1Request = {
  // string
  widgetId: "widgetId_example",
};

apiInstance.validateApiKey1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataWidgetInfoVo**

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


