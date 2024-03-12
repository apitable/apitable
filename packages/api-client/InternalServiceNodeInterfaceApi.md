# .InternalServiceNodeInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createDatasheet**](InternalServiceNodeInterfaceApi.md#createDatasheet) | **POST** /internal/spaces/{spaceId}/datasheets | create a table node
[**deleteNode**](InternalServiceNodeInterfaceApi.md#deleteNode) | **POST** /internal/spaces/{spaceId}/nodes/{nodeId}/delete | delete node
[**filter**](InternalServiceNodeInterfaceApi.md#filter) | **GET** /internal/spaces/{spaceId}/nodes | Get filter nodes by type, permissions and node name.


# **createDatasheet**
> ResponseDataCreateDatasheetVo createDatasheet(createDatasheetRo, )

create a table node

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceNodeInterfaceApi(configuration);

let body:.InternalServiceNodeInterfaceApiCreateDatasheetRequest = {
  // CreateDatasheetRo
  createDatasheetRo: {
    name: "This is a node",
    folderId: "nod10",
    preNodeId: "nod10",
    description: "This is a table",
  },
  // string
  spaceId: "spaceId_example",
};

apiInstance.createDatasheet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createDatasheetRo** | **CreateDatasheetRo**|  |
 **spaceId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataCreateDatasheetVo**

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

# **deleteNode**
> ResponseDataVoid deleteNode()

delete node

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceNodeInterfaceApi(configuration);

let body:.InternalServiceNodeInterfaceApiDeleteNodeRequest = {
  // string
  spaceId: "spaceId_example",
  // string
  nodeId: "nodeId_example",
};

apiInstance.deleteNode(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **nodeId** | [**string**] |  | defaults to undefined


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

# **filter**
> ResponseDataListNodeInfo filter()

scenario: query an existing read-only dashboard

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceNodeInterfaceApi(configuration);

let body:.InternalServiceNodeInterfaceApiFilterRequest = {
  // string
  spaceId: "spaceId_example",
  // number
  type: 1,
  // Array<number> (optional)
  nodePermissions: [0,1,2,3],
  // string (optional)
  keyword: "",
};

apiInstance.filter(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **type** | [**number**] |  | defaults to undefined
 **nodePermissions** | **Array&lt;number&gt;** |  | (optional) defaults to undefined
 **keyword** | [**string**] |  | (optional) defaults to ''


### Return type

**ResponseDataListNodeInfo**

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


