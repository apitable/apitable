# .WorkbenchNodeFavoriteApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**list5**](WorkbenchNodeFavoriteApiApi.md#list5) | **GET** /node/favorite/list | Get favorite nodes
[**move1**](WorkbenchNodeFavoriteApiApi.md#move1) | **POST** /node/favorite/move | Move favorite node
[**updateStatus**](WorkbenchNodeFavoriteApiApi.md#updateStatus) | **POST** /node/favorite/updateStatus/{nodeId} | Change favorite status


# **list5**
> ResponseDataListFavoriteNodeInfo list5()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeFavoriteApiApi(configuration);

let body:.WorkbenchNodeFavoriteApiApiList5Request = {
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.list5(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataListFavoriteNodeInfo**

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

# **move1**
> ResponseDataVoid move1(markNodeMoveRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeFavoriteApiApi(configuration);

let body:.WorkbenchNodeFavoriteApiApiMove1Request = {
  // MarkNodeMoveRo
  markNodeMoveRo: {
    nodeId: "nod10",
    preNodeId: "nod10",
  },
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.move1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **markNodeMoveRo** | **MarkNodeMoveRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined


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

# **updateStatus**
> ResponseDataVoid updateStatus()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeFavoriteApiApi(configuration);

let body:.WorkbenchNodeFavoriteApiApiUpdateStatusRequest = {
  // string | node id
  nodeId: "fod8mXUeiXyVo",
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.updateStatus(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **xSocketId** | [**string**] | user socket id | (optional) defaults to undefined


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


