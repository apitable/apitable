# .BasicModuleAccessoryCallbackInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**notifyCallback**](BasicModuleAccessoryCallbackInterfaceApi.md#notifyCallback) | **POST** /asset/upload/callback | Resource upload completion notification callback
[**widgetCallback**](BasicModuleAccessoryCallbackInterfaceApi.md#widgetCallback) | **POST** /asset/widget/uploadCallback | widget upload callback


# **notifyCallback**
> ResponseDataListAssetUploadResult notifyCallback(assetUploadNotifyRO)

After S3 completes the client upload, it actively reaches the notification server

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleAccessoryCallbackInterfaceApi(configuration);

let body:.BasicModuleAccessoryCallbackInterfaceApiNotifyCallbackRequest = {
  // AssetUploadNotifyRO
  assetUploadNotifyRO: {
    type: 0,
    resourceKeys: ["spc10/2019/12/10/159","spc10/2019/12/10/168"],
  },
};

apiInstance.notifyCallback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **assetUploadNotifyRO** | **AssetUploadNotifyRO**|  |


### Return type

**ResponseDataListAssetUploadResult**

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

# **widgetCallback**
> ResponseDataVoid widgetCallback(widgetUploadNotifyRO)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleAccessoryCallbackInterfaceApi(configuration);

let body:.BasicModuleAccessoryCallbackInterfaceApiWidgetCallbackRequest = {
  // WidgetUploadNotifyRO
  widgetUploadNotifyRO: {
    resourceKeys: ["widget/asset/adflkajadfj"],
  },
};

apiInstance.widgetCallback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetUploadNotifyRO** | **WidgetUploadNotifyRO**|  |


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


