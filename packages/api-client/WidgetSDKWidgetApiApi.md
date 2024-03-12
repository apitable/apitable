# .WidgetSDKWidgetApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**copyWidget**](WidgetSDKWidgetApiApi.md#copyWidget) | **POST** /widget/copy | Copy widget
[**createWidget1**](WidgetSDKWidgetApiApi.md#createWidget1) | **POST** /widget/create | Create widget
[**findTemplatePackageList**](WidgetSDKWidgetApiApi.md#findTemplatePackageList) | **GET** /widget/template/package/list | Get package teamplates
[**findWidgetInfoByNodeId**](WidgetSDKWidgetApiApi.md#findWidgetInfoByNodeId) | **GET** /node/{nodeId}/widget | get the widget information of the node
[**findWidgetInfoBySpaceId**](WidgetSDKWidgetApiApi.md#findWidgetInfoBySpaceId) | **GET** /space/{spaceId}/widget | Get the space widgets
[**findWidgetPackByNodeId**](WidgetSDKWidgetApiApi.md#findWidgetPackByNodeId) | **GET** /node/{nodeId}/widgetPack | Get the node widget package
[**findWidgetPackByWidgetIds**](WidgetSDKWidgetApiApi.md#findWidgetPackByWidgetIds) | **GET** /widget/get | Get widget info
[**widgetStoreList**](WidgetSDKWidgetApiApi.md#widgetStoreList) | **POST** /widget/package/store/list | Get widget store


# **copyWidget**
> ResponseDataListWidgetPack copyWidget(widgetCopyRo)

Scenario: 1、dashboard import widget2:the widget panel sends applets to the dashboard; 3:copy widget

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKWidgetApiApi(configuration);

let body:.WidgetSDKWidgetApiApiCopyWidgetRequest = {
  // WidgetCopyRo
  widgetCopyRo: {
    nodeId: "dst11/dsb11",
    widgetIds: ["wdtiJjVmNFcFmNtQFA","wdtSbp8TkH7gTGAYR1"],
  },
};

apiInstance.copyWidget(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetCopyRo** | **WidgetCopyRo**|  |


### Return type

**ResponseDataListWidgetPack**

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

# **createWidget1**
> ResponseDataWidgetPack createWidget1(widgetCreateRo)

Scenario:1、dashboard new applet 2、datasheet widget panel new widget

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKWidgetApiApi(configuration);

let body:.WidgetSDKWidgetApiApiCreateWidget1Request = {
  // WidgetCreateRo
  widgetCreateRo: {
    nodeId: "dstAAA/dsbBBB",
    widgetPackageId: "wpkBBB",
    name: "This is a widget",
  },
};

apiInstance.createWidget1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetCreateRo** | **WidgetCreateRo**|  |


### Return type

**ResponseDataWidgetPack**

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

# **findTemplatePackageList**
> ResponseDataListWidgetTemplatePackageInfo findTemplatePackageList()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKWidgetApiApi(configuration);

let body:any = {};

apiInstance.findTemplatePackageList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataListWidgetTemplatePackageInfo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **findWidgetInfoByNodeId**
> ResponseDataListWidgetInfo findWidgetInfoByNodeId()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKWidgetApiApi(configuration);

let body:.WidgetSDKWidgetApiApiFindWidgetInfoByNodeIdRequest = {
  // string | node id
  nodeId: "dstJ2oRZxsh2yld4MA",
};

apiInstance.findWidgetInfoByNodeId(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined


### Return type

**ResponseDataListWidgetInfo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **findWidgetInfoBySpaceId**
> ResponseDataListWidgetInfo findWidgetInfoBySpaceId()

get the widgets under the entire space

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKWidgetApiApi(configuration);

let body:.WidgetSDKWidgetApiApiFindWidgetInfoBySpaceIdRequest = {
  // string | space id
  spaceId: "spczJrh2i3tLW",
  // number | load quantity (optional)
  count: 10,
};

apiInstance.findWidgetInfoBySpaceId(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined
 **count** | [**number**] | load quantity | (optional) defaults to undefined


### Return type

**ResponseDataListWidgetInfo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **findWidgetPackByNodeId**
> ResponseDataListWidgetPack findWidgetPackByNodeId()

Node types are limited to dashboards and datasheet

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKWidgetApiApi(configuration);

let body:.WidgetSDKWidgetApiApiFindWidgetPackByNodeIdRequest = {
  // string | node id
  nodeId: "dstJ2oRZxsh2yld4MA",
  // string | association id：node share id、template id (optional)
  linkId: "shr8T8vAfehg3yj3McmDG",
  // string | space id (optional)
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.findWidgetPackByNodeId(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **linkId** | [**string**] | association id：node share id、template id | (optional) defaults to undefined
 **xSpaceId** | [**string**] | space id | (optional) defaults to undefined


### Return type

**ResponseDataListWidgetPack**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **findWidgetPackByWidgetIds**
> ResponseDataListWidgetPack findWidgetPackByWidgetIds()

get widget info by widget id

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKWidgetApiApi(configuration);

let body:.WidgetSDKWidgetApiApiFindWidgetPackByWidgetIdsRequest = {
  // string | widget ids
  widgetIds: "wdtlMDweJzTsbSJAFY,wdt923ZpvvRhD8kVLs",
  // string | Association ID: node sharing ID and template ID (optional)
  linkId: "shr8T8vAfehg3yj3McmDG",
};

apiInstance.findWidgetPackByWidgetIds(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetIds** | [**string**] | widget ids | defaults to undefined
 **linkId** | [**string**] | Association ID: node sharing ID and template ID | (optional) defaults to undefined


### Return type

**ResponseDataListWidgetPack**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **widgetStoreList**
> ResponseDataListWidgetStoreListInfo widgetStoreList(widgetStoreListRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKWidgetApiApi(configuration);

let body:.WidgetSDKWidgetApiApiWidgetStoreListRequest = {
  // WidgetStoreListRo
  widgetStoreListRo: {
    filter: false,
    type: 1,
    previewSearchKeyword: "previewSearchKeyword_example",
  },
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.widgetStoreList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetStoreListRo** | **WidgetStoreListRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataListWidgetStoreListInfo**

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


