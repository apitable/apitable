# .WorkbenchNodeRoleApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**batchDeleteRole**](WorkbenchNodeRoleApiApi.md#batchDeleteRole) | **DELETE** /node/batchDeleteRole | Batch delete node role
[**batchEditRole**](WorkbenchNodeRoleApiApi.md#batchEditRole) | **POST** /node/batchEditRole | Batch edit role
[**createRole1**](WorkbenchNodeRoleApiApi.md#createRole1) | **POST** /node/addRole | Create node role
[**deleteRole2**](WorkbenchNodeRoleApiApi.md#deleteRole2) | **DELETE** /node/deleteRole | Delete role
[**disableRoleExtend**](WorkbenchNodeRoleApiApi.md#disableRoleExtend) | **POST** /node/disableRoleExtend | Disable role extend
[**editRole1**](WorkbenchNodeRoleApiApi.md#editRole1) | **POST** /node/editRole | Edit node role
[**enableRoleExtend**](WorkbenchNodeRoleApiApi.md#enableRoleExtend) | **POST** /node/enableRoleExtend | Enable role extend
[**getCollaboratorInfo**](WorkbenchNodeRoleApiApi.md#getCollaboratorInfo) | **GET** /node/collaborator/info | Get Collaborator Info
[**getCollaboratorPage**](WorkbenchNodeRoleApiApi.md#getCollaboratorPage) | **GET** /node/collaborator/page | Page Query the Node\&#39; Collaborator
[**listRole1**](WorkbenchNodeRoleApiApi.md#listRole1) | **GET** /node/listRole | Get node roles


# **batchDeleteRole**
> ResponseDataVoid batchDeleteRole(batchDeleteNodeRoleRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRoleApiApi(configuration);

let body:.WorkbenchNodeRoleApiApiBatchDeleteRoleRequest = {
  // BatchDeleteNodeRoleRo
  batchDeleteNodeRoleRo: {
    nodeId: "nod10",
    unitIds: ["1","2","3"],
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.batchDeleteRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **batchDeleteNodeRoleRo** | **BatchDeleteNodeRoleRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **batchEditRole**
> ResponseDataVoid batchEditRole(batchModifyNodeRoleRo, )

Batch modify the role of the organizational unit of the node

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRoleApiApi(configuration);

let body:.WorkbenchNodeRoleApiApiBatchEditRoleRequest = {
  // BatchModifyNodeRoleRo
  batchModifyNodeRoleRo: {
    nodeId: "nod10",
    unitIds: ["1","2","3"],
    role: "readonly",
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.batchEditRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **batchModifyNodeRoleRo** | **BatchModifyNodeRoleRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **createRole1**
> ResponseDataVoid createRole1(addNodeRoleRo, )

Add the organizational unit of the node specified role

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRoleApiApi(configuration);

let body:.WorkbenchNodeRoleApiApiCreateRole1Request = {
  // AddNodeRoleRo
  addNodeRoleRo: {
    nodeId: "nod10",
    unitIds: ["10101","10102","10103","10104"],
    role: "editor",
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.createRole1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addNodeRoleRo** | **AddNodeRoleRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteRole2**
> ResponseDataVoid deleteRole2(deleteNodeRoleRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRoleApiApi(configuration);

let body:.WorkbenchNodeRoleApiApiDeleteRole2Request = {
  // DeleteNodeRoleRo
  deleteNodeRoleRo: {
    nodeId: "nod10",
    unitId: 71638172638,
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.deleteRole2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteNodeRoleRo** | **DeleteNodeRoleRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **disableRoleExtend**
> ResponseDataVoid disableRoleExtend()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRoleApiApi(configuration);

let body:.WorkbenchNodeRoleApiApiDisableRoleExtendRequest = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // RoleControlOpenRo (optional)
  roleControlOpenRo: {
    includeExtend: true,
  },
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.disableRoleExtend(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **roleControlOpenRo** | **RoleControlOpenRo**|  |
 **nodeId** | [**string**] | node id | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **editRole1**
> ResponseDataVoid editRole1(modifyNodeRoleRo, )

Modify the role of the organizational unit of the node

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRoleApiApi(configuration);

let body:.WorkbenchNodeRoleApiApiEditRole1Request = {
  // ModifyNodeRoleRo
  modifyNodeRoleRo: {
    nodeId: "nod10",
    unitId: 761263712638,
    role: "readonly",
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.editRole1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modifyNodeRoleRo** | **ModifyNodeRoleRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **enableRoleExtend**
> ResponseDataVoid enableRoleExtend()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRoleApiApi(configuration);

let body:.WorkbenchNodeRoleApiApiEnableRoleExtendRequest = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.enableRoleExtend(body).then((data:any) => {
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getCollaboratorInfo**
> ResponseDataNodeCollaboratorVO getCollaboratorInfo()

Scene: Collaborator Card Information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRoleApiApi(configuration);

let body:.WorkbenchNodeRoleApiApiGetCollaboratorInfoRequest = {
  // string
  uuid: "1",
  // string
  nodeId: "nodRTGSy43DJ9",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.getCollaboratorInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uuid** | [**string**] |  | defaults to undefined
 **nodeId** | [**string**] |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataNodeCollaboratorVO**

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

# **getCollaboratorPage**
> ResponseDataPageInfoNodeRoleMemberVo getCollaboratorPage()

Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRoleApiApi(configuration);

let body:.WorkbenchNodeRoleApiApiGetCollaboratorPageRequest = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
  // Page
  page: {
    records: [
      {},
    ],
    total: 1,
    size: 1,
    current: 1,
    orders: [
      {
        column: "column_example",
        asc: true,
      },
    ],
    optimizeCountSql: true,
    searchCount: true,
    optimizeJoinOfCountSql: true,
    countId: "countId_example",
    maxLimit: 1,
    pages: 1,
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | page\'s parameter
  pageObjectParams: "{"pageNo":1,"pageSize":20}",
};

apiInstance.getCollaboratorPage(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **page** | **Page** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **pageObjectParams** | [**string**] | page\&#39;s parameter | defaults to undefined


### Return type

**ResponseDataPageInfoNodeRoleMemberVo**

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

# **listRole1**
> ResponseDataNodeCollaboratorsVo listRole1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRoleApiApi(configuration);

let body:.WorkbenchNodeRoleApiApiListRole1Request = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // boolean | Whether to include the master administrator, can not be passed, the default includes (optional)
  includeAdmin: true,
  // boolean | Whether to get userself, do not pass, the default contains (optional)
  includeSelf: true,
  // boolean | Contains superior inherited permissions. By default, it does not include (optional)
  includeExtend: false,
};

apiInstance.listRole1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **includeAdmin** | [**boolean**] | Whether to include the master administrator, can not be passed, the default includes | (optional) defaults to undefined
 **includeSelf** | [**boolean**] | Whether to get userself, do not pass, the default contains | (optional) defaults to undefined
 **includeExtend** | [**boolean**] | Contains superior inherited permissions. By default, it does not include | (optional) defaults to undefined


### Return type

**ResponseDataNodeCollaboratorsVo**

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


