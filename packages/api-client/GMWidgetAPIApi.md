# .GMWidgetAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**banWidget**](GMWidgetAPIApi.md#banWidget) | **POST** /widget/package/ban | Ban/Unban widget
[**globalWidgetDbDataRefresh**](GMWidgetAPIApi.md#globalWidgetDbDataRefresh) | **POST** /gm/widget/global/refresh/db | Refresh the global component DB data
[**globalWidgetList**](GMWidgetAPIApi.md#globalWidgetList) | **POST** /gm/widget/global/list | Gets a list of global widget stores


# **banWidget**
> ResponseDataVoid banWidget(widgetPackageBanRo)

widget-cli ban/unban widget

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .GMWidgetAPIApi(configuration);

let body:.GMWidgetAPIApiBanWidgetRequest = {
  // WidgetPackageBanRo
  widgetPackageBanRo: {
    packageId: "wpkAAA",
    unban: false,
  },
  // string | developer token (optional)
  authorization: "AABBCC",
};

apiInstance.banWidget(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetPackageBanRo** | **WidgetPackageBanRo**|  |
 **authorization** | [**string**] | developer token | (optional) defaults to undefined


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

# **globalWidgetDbDataRefresh**
> ResponseDataVoid globalWidgetDbDataRefresh(globalWidgetListRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .GMWidgetAPIApi(configuration);

let body:.GMWidgetAPIApiGlobalWidgetDbDataRefreshRequest = {
  // GlobalWidgetListRo
  globalWidgetListRo: {
    nodeId: "nodeId_example",
    viewId: "viewId_example",
  },
};

apiInstance.globalWidgetDbDataRefresh(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **globalWidgetListRo** | **GlobalWidgetListRo**|  |


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

# **globalWidgetList**
> ResponseDataListGlobalWidgetInfo globalWidgetList(globalWidgetListRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .GMWidgetAPIApi(configuration);

let body:.GMWidgetAPIApiGlobalWidgetListRequest = {
  // GlobalWidgetListRo
  globalWidgetListRo: {
    nodeId: "nodeId_example",
    viewId: "viewId_example",
  },
};

apiInstance.globalWidgetList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **globalWidgetListRo** | **GlobalWidgetListRo**|  |


### Return type

**ResponseDataListGlobalWidgetInfo**

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


