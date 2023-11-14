# .WorkbenchNodeApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**activeSheets**](WorkbenchNodeApiApi.md#activeSheets) | **POST** /node/active | Record active node
[**analyzeBundle**](WorkbenchNodeApiApi.md#analyzeBundle) | **POST** /node/analyzeBundle | Analyze Bundle
[**checkRelNode**](WorkbenchNodeApiApi.md#checkRelNode) | **GET** /node/checkRelNode | check for associated nodes
[**copy**](WorkbenchNodeApiApi.md#copy) | **POST** /node/copy | Copy node
[**create3**](WorkbenchNodeApiApi.md#create3) | **POST** /node/create | Create child node
[**delete2**](WorkbenchNodeApiApi.md#delete2) | **POST** /node/delete/{nodeId} | Delete node
[**delete3**](WorkbenchNodeApiApi.md#delete3) | **DELETE** /node/delete/{nodeId} | Delete node
[**exportBundle**](WorkbenchNodeApiApi.md#exportBundle) | **GET** /node/exportBundle | Export Bundle
[**getByNodeId**](WorkbenchNodeApiApi.md#getByNodeId) | **GET** /node/get | Query nodes
[**getNodeChildrenList**](WorkbenchNodeApiApi.md#getNodeChildrenList) | **GET** /node/children | Get child nodes
[**getNodeRel**](WorkbenchNodeApiApi.md#getNodeRel) | **GET** /node/getRelNode | Get associated node
[**getParentNodes**](WorkbenchNodeApiApi.md#getParentNodes) | **GET** /node/parents | Get parent nodes
[**getTree**](WorkbenchNodeApiApi.md#getTree) | **GET** /node/tree | Query tree node
[**importExcel**](WorkbenchNodeApiApi.md#importExcel) | **POST** /node/import | Import excel
[**importExcel1**](WorkbenchNodeApiApi.md#importExcel1) | **POST** /node/{parentId}/importExcel | Import excel
[**list4**](WorkbenchNodeApiApi.md#list4) | **GET** /node/list | Get nodes of the specified type
[**move**](WorkbenchNodeApiApi.md#move) | **POST** /node/move | Move node
[**position**](WorkbenchNodeApiApi.md#position) | **GET** /node/position/{nodeId} | Position node
[**postRemindUnitsNoPermission**](WorkbenchNodeApiApi.md#postRemindUnitsNoPermission) | **POST** /node/remind/units/noPermission | Gets no permission member before remind
[**recentList**](WorkbenchNodeApiApi.md#recentList) | **GET** /node/recentList | member recent open node list
[**remind**](WorkbenchNodeApiApi.md#remind) | **POST** /node/remind | Remind notification
[**searchNode**](WorkbenchNodeApiApi.md#searchNode) | **GET** /node/search | Fuzzy search node
[**showNodeInfoWindow**](WorkbenchNodeApiApi.md#showNodeInfoWindow) | **GET** /node/window | Node info window
[**showcase**](WorkbenchNodeApiApi.md#showcase) | **GET** /node/showcase | Folder preview
[**update3**](WorkbenchNodeApiApi.md#update3) | **POST** /node/update/{nodeId} | Edit node
[**updateDesc**](WorkbenchNodeApiApi.md#updateDesc) | **POST** /node/updateDesc | Update node description


# **activeSheets**
> ResponseDataVoid activeSheets(activeSheetsOpRo, )

node id and view id are not required（do not pass means all closed）

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiActiveSheetsRequest = {
  // ActiveSheetsOpRo
  activeSheetsOpRo: {
    nodeId: "dst15",
    viewId: "views135",
    position: 1,
  },
  // string | space id
  xSpaceId: "spcBrtP3ulTXR",
};

apiInstance.activeSheets(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **activeSheetsOpRo** | **ActiveSheetsOpRo**|  |
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

# **analyzeBundle**
> ResponseDataVoid analyzeBundle()

The front node is saved in the first place of the parent node when it is not under the parent node. Save in the first place of the first level directory when it is not transmitted.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiAnalyzeBundleRequest = {
  // NodeBundleOpRo (optional)
  nodeBundleOpRo: {
    file: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
    parentId: "fodSf4PZBNwut",
    preNodeId: "nod10",
    password: "***",
  },
};

apiInstance.analyzeBundle(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeBundleOpRo** | **NodeBundleOpRo**|  |


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

# **checkRelNode**
> ResponseDataListNodeInfo checkRelNode()

permission of the associated node is not required. Scenario: Check whether the view associated mirror before deleting the table.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiCheckRelNodeRequest = {
  // string | node id
  nodeId: "dstU8Agt2",
  // string | view id（do not specify full return） (optional)
  viewId: "viwF1CqEW2GxY",
  // number | node type（do not specify full return，form:3/mirror:5） (optional)
  type: 5,
};

apiInstance.checkRelNode(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **viewId** | [**string**] | view id（do not specify full return） | (optional) defaults to undefined
 **type** | [**number**] | node type（do not specify full return，form:3/mirror:5） | (optional) defaults to undefined


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

# **copy**
> ResponseDataNodeInfoVo copy(nodeCopyOpRo)

node id is required, whether to copy data is not required.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiCopyRequest = {
  // NodeCopyOpRo
  nodeCopyOpRo: {
    nodeId: "nod10",
    data: true,
  },
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.copy(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeCopyOpRo** | **NodeCopyOpRo**|  |
 **xSocketId** | [**string**] | user socket id | (optional) defaults to undefined


### Return type

**ResponseDataNodeInfoVo**

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

# **create3**
> ResponseDataNodeInfoVo create3(nodeOpRo)

create a new node under the node<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiCreate3Request = {
  // NodeOpRo
  nodeOpRo: {
    parentId: "nod10",
    nodeName: "This is a node",
    type: 1,
    preNodeId: "nod10",
    extra: {
      datasheetId: "datasheetId_example",
      viewId: "viewId_example",
      viewName: "viewName_example",
    },
    checkDuplicateName: true,
  },
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.create3(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeOpRo** | **NodeOpRo**|  |
 **xSocketId** | [**string**] | user socket id | (optional) defaults to undefined


### Return type

**ResponseDataNodeInfoVo**

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

# **delete2**
> ResponseDataVoid delete2()

You can pass in an ID array and delete multiple nodes.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiDelete2Request = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.delete2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
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

# **delete3**
> ResponseDataVoid delete3()

You can pass in an ID array and delete multiple nodes.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiDelete3Request = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.delete3(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
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

# **exportBundle**
> void exportBundle()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiExportBundleRequest = {
  // string | node id
  nodeId: "fod8mXUeiXyVo",
  // boolean | whether to retain data (optional)
  saveData: true,
  // string | encrypted password (optional)
  password: "qwer1234",
};

apiInstance.exportBundle(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **saveData** | [**boolean**] | whether to retain data | (optional) defaults to undefined
 **password** | [**string**] | encrypted password | (optional) defaults to undefined


### Return type

**void**

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

# **getByNodeId**
> ResponseDataListNodeInfoVo getByNodeId()

obtain information about the node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiGetByNodeIdRequest = {
  // string | node ids
  nodeIds: "nodRTGSy43DJ9,nodRTGSy43DJ9",
};

apiInstance.getByNodeId(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeIds** | [**string**] | node ids | defaults to undefined


### Return type

**ResponseDataListNodeInfoVo**

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

# **getNodeChildrenList**
> ResponseDataListNodeInfoVo getNodeChildrenList()

Obtain the list of child nodes of the specified node. The nodes are classified into folders or datasheet by type <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiGetNodeChildrenListRequest = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
  // number | node type 1:folder,2:datasheet (optional)
  nodeType: 1,
};

apiInstance.getNodeChildrenList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **nodeType** | [**number**] | node type 1:folder,2:datasheet | (optional) defaults to undefined


### Return type

**ResponseDataListNodeInfoVo**

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

# **getNodeRel**
> ResponseDataListNodeInfo getNodeRel()

This interface requires readable or above permissions of the associated node. Scenario: Open the display columns of form and mirror in the datasheet.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiGetNodeRelRequest = {
  // string | node id
  nodeId: "dstU8Agt2Jv",
  // string | view id（do not specify full return） (optional)
  viewId: "viwF1CqEW2GxY",
  // number | node type（do not specify full return，form:3/mirror:5） (optional)
  type: 5,
};

apiInstance.getNodeRel(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **viewId** | [**string**] | view id（do not specify full return） | (optional) defaults to undefined
 **type** | [**number**] | node type（do not specify full return，form:3/mirror:5） | (optional) defaults to undefined


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

# **getParentNodes**
> ResponseDataListNodePathVo getParentNodes()

Gets a list of all parent nodes of the specified node <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiGetParentNodesRequest = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
};

apiInstance.getParentNodes(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined


### Return type

**ResponseDataListNodePathVo**

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

# **getTree**
> ResponseDataNodeInfoTreeVo getTree()

Query the node tree of workbench, restricted to two levels.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiGetTreeRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // number | tree depth, we can specify the query depth, maximum 2 layers depth. (optional)
  depth: 2,
};

apiInstance.getTree(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **depth** | [**number**] | tree depth, we can specify the query depth, maximum 2 layers depth. | (optional) defaults to undefined


### Return type

**ResponseDataNodeInfoTreeVo**

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

# **importExcel**
> ResponseDataNodeInfoVo importExcel()

all parameters must be

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiImportExcelRequest = {
  // ImportExcelOpRo (optional)
  importExcelOpRo: {
    parentId: "nod10",
    file: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
    viewName: "nod10",
  },
};

apiInstance.importExcel(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **importExcelOpRo** | **ImportExcelOpRo**|  |


### Return type

**ResponseDataNodeInfoVo**

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

# **importExcel1**
> ResponseDataNodeInfoVo importExcel1()

all parameters must be

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiImportExcel1Request = {
  // ImportExcelOpRo (optional)
  importExcelOpRo: {
    parentId: "nod10",
    file: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
    viewName: "nod10",
  },
};

apiInstance.importExcel1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **importExcelOpRo** | **ImportExcelOpRo**|  |


### Return type

**ResponseDataNodeInfoVo**

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

# **list4**
> ResponseDataListNodeInfo list4()

scenario: query an existing dashboard

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiList4Request = {
  // number | node type
  type: 2,
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
  // string | role（manageable by default） (optional)
  role: "manager",
};

apiInstance.list4(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | [**number**] | node type | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **role** | [**string**] | role（manageable by default） | (optional) defaults to undefined


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

# **move**
> ResponseDataListNodeInfoVo move(nodeMoveOpRo, )

Node ID and parent node ID are required, and pre Node Id is not required.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiMoveRequest = {
  // NodeMoveOpRo
  nodeMoveOpRo: {
    nodeId: "nod10",
    parentId: "nod10",
    preNodeId: "nod10",
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.move(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeMoveOpRo** | **NodeMoveOpRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **xSocketId** | [**string**] | user socket id | (optional) defaults to undefined


### Return type

**ResponseDataListNodeInfoVo**

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

# **position**
> ResponseDataNodeInfoTreeVo position()

node in must <br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiPositionRequest = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
};

apiInstance.position(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined


### Return type

**ResponseDataNodeInfoTreeVo**

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

# **postRemindUnitsNoPermission**
> ResponseDataListMemberBriefInfoVo postRemindUnitsNoPermission(remindUnitsNoPermissionRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiPostRemindUnitsNoPermissionRequest = {
  // RemindUnitsNoPermissionRo
  remindUnitsNoPermissionRo: {
    nodeId: "nodeId_example",
    unitIds: [
      1,
    ],
  },
};

apiInstance.postRemindUnitsNoPermission(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **remindUnitsNoPermissionRo** | **RemindUnitsNoPermissionRo**|  |


### Return type

**ResponseDataListMemberBriefInfoVo**

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

# **recentList**
> ResponseDataListNodeSearchResult recentList()

member recent open node list

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiRecentListRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.recentList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataListNodeSearchResult**

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

# **remind**
> ResponseDataVoid remind(remindMemberRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiRemindRequest = {
  // RemindMemberRo
  remindMemberRo: {
    isNotify: true,
    nodeId: "dstiHMuQnhWkVxBKkU",
    viewId: "viwwkxEZ3XaDg",
    unitRecs: [
      {
        recordIds: ["rec037CbsaKcN","recFa9VgsXMrS"],
        unitIds: [1217029304827183105,1217029304827183106],
        recordTitle: "This is a record",
        fieldName: "This is a column name",
      },
    ],
    linkId: "shr8T8vAfehg3yj3McmDG",
    type: 1,
    extra: {
      recordTitle: "First column",
      content: "@zoe&nbsp;&nbsp;Comments",
      createdAt: "2020.11.26 10:30:36",
    },
  },
};

apiInstance.remind(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **remindMemberRo** | **RemindMemberRo**|  |


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

# **searchNode**
> ResponseDataListNodeSearchResult searchNode()

Enter the search term to search for the node of the working directory.<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiSearchNodeRequest = {
  // string | keyword
  keyword: "datasheet",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | highlight style (optional)
  className: "highLight",
};

apiInstance.searchNode(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] | keyword | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **className** | [**string**] | highlight style | (optional) defaults to undefined


### Return type

**ResponseDataListNodeSearchResult**

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

# **showNodeInfoWindow**
> ResponseDataNodeInfoWindowVo showNodeInfoWindow()

Nodes that are not in the center of the template, make spatial judgments.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiShowNodeInfoWindowRequest = {
  // string
  nodeId: "nodeId_example",
};

apiInstance.showNodeInfoWindow(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataNodeInfoWindowVo**

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

# **showcase**
> ResponseDataShowcaseVo showcase()

Nodes that are not in the center of the template, make cross-space judgments.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiShowcaseRequest = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
  // string | share id (optional)
  shareId: "shrRTGSy43DJ9",
};

apiInstance.showcase(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **shareId** | [**string**] | share id | (optional) defaults to undefined


### Return type

**ResponseDataShowcaseVo**

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

# **update3**
> ResponseDataNodeInfoVo update3(nodeUpdateOpRo, )

node id must. name, icon is not required<br/>Role Type：<br/>1.owner can add, edit, move, sort, delete, copy folders in the specified working directory。<br/>2.manager can add, edit, move, sort, delete, and copy folders in the specified working directory.<br/>3.editor can only edit records and views of the data table, but not edit fields<br/>4.readonly can only view the number table, you cannot make any edits and modifications, you can only assign read-only permissions to other members。<br/>

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiUpdate3Request = {
  // NodeUpdateOpRo
  nodeUpdateOpRo: {
    nodeName: "This is a new node name",
    icon: ":smile",
    cover: "space/2020/5/19/..",
    showRecordHistory: 1,
  },
  // string | node id
  nodeId: "nodRTGSy43DJ9",
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.update3(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeUpdateOpRo** | **NodeUpdateOpRo**|  |
 **nodeId** | [**string**] | node id | defaults to undefined
 **xSocketId** | [**string**] | user socket id | (optional) defaults to undefined


### Return type

**ResponseDataNodeInfoVo**

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

# **updateDesc**
> ResponseDataVoid updateDesc(nodeDescOpRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeApiApi(configuration);

let body:.WorkbenchNodeApiApiUpdateDescRequest = {
  // NodeDescOpRo
  nodeDescOpRo: {
    nodeId: "nod10",
    description: "This is a node description",
  },
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.updateDesc(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeDescOpRo** | **NodeDescOpRo**|  |
 **xSocketId** | [**string**] | user socket id | (optional) defaults to undefined


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


