# .ContactsRoleApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addRoleMembers**](ContactsRoleApiApi.md#addRoleMembers) | **POST** /org/roles/{roleId}/members | add role members
[**createRole**](ContactsRoleApiApi.md#createRole) | **POST** /org/roles | create new role
[**deleteRole1**](ContactsRoleApiApi.md#deleteRole1) | **DELETE** /org/roles/{roleId} | delete role
[**getRoleMembers**](ContactsRoleApiApi.md#getRoleMembers) | **GET** /org/roles/{roleId}/members | query role members
[**getRoles**](ContactsRoleApiApi.md#getRoles) | **GET** /org/roles | query roles
[**initRoles**](ContactsRoleApiApi.md#initRoles) | **POST** /org/roles/init | create init role
[**removeRoleMembers**](ContactsRoleApiApi.md#removeRoleMembers) | **DELETE** /org/roles/{roleId}/members | remove role members
[**updateRole**](ContactsRoleApiApi.md#updateRole) | **PATCH** /org/roles/{roleId} | update role information


# **addRoleMembers**
> ResponseDataVoid addRoleMembers(addRoleMemberRo, )

add role members

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsRoleApiApi(configuration);

let body:.ContactsRoleApiApiAddRoleMembersRequest = {
  // AddRoleMemberRo
  addRoleMemberRo: {
    unitList: [
      {
        id: 120322719823,
        type: 1,
      },
    ],
  },
  // number
  roleId: 1,
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string
  roleId2: "15622",
};

apiInstance.addRoleMembers(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addRoleMemberRo** | **AddRoleMemberRo**|  |
 **roleId** | [**number**] |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **roleId2** | [**string**] |  | defaults to undefined


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

# **createRole**
> ResponseDataVoid createRole(createRoleRo, )

create new role

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsRoleApiApi(configuration);

let body:.ContactsRoleApiApiCreateRoleRequest = {
  // CreateRoleRo
  createRoleRo: {
    roleName: "Finance",
    position: 2000,
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.createRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createRoleRo** | **CreateRoleRo**|  |
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

# **deleteRole1**
> ResponseDataVoid deleteRole1()

delete role

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsRoleApiApi(configuration);

let body:.ContactsRoleApiApiDeleteRole1Request = {
  // number
  roleId: 1,
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string
  roleId2: "15622",
};

apiInstance.deleteRole1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **roleId** | [**number**] |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **roleId2** | [**string**] |  | defaults to undefined


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

# **getRoleMembers**
> ResponseDataPageInfoRoleMemberVo getRoleMembers()

query the role\'s members

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsRoleApiApi(configuration);

let body:.ContactsRoleApiApiGetRoleMembersRequest = {
  // number
  roleId: 1,
  // PageVoid
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
  // string
  roleId2: "15622",
  // string | page parameters
  pageObjectParams: "{"pageNo":1,"pageSize":20}",
};

apiInstance.getRoleMembers(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **roleId** | [**number**] |  | defaults to undefined
 **page** | **PageVoid** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **roleId2** | [**string**] |  | defaults to undefined
 **pageObjectParams** | [**string**] | page parameters | defaults to undefined


### Return type

**ResponseDataPageInfoRoleMemberVo**

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

# **getRoles**
> ResponseDataListRoleInfoVo getRoles()

query the space\'s roles

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsRoleApiApi(configuration);

let body:.ContactsRoleApiApiGetRolesRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.getRoles(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataListRoleInfoVo**

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

# **initRoles**
> ResponseDataVoid initRoles()

create init role

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsRoleApiApi(configuration);

let body:.ContactsRoleApiApiInitRolesRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.initRoles(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


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

# **removeRoleMembers**
> ResponseDataVoid removeRoleMembers(deleteRoleMemberRo, )

remove role members

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsRoleApiApi(configuration);

let body:.ContactsRoleApiApiRemoveRoleMembersRequest = {
  // DeleteRoleMemberRo
  deleteRoleMemberRo: {
    unitIds: [
      1,
    ],
  },
  // number
  roleId: 1,
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string
  roleId2: "15622",
};

apiInstance.removeRoleMembers(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteRoleMemberRo** | **DeleteRoleMemberRo**|  |
 **roleId** | [**number**] |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **roleId2** | [**string**] |  | defaults to undefined


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

# **updateRole**
> ResponseDataVoid updateRole(updateRoleRo, )

update role information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsRoleApiApi(configuration);

let body:.ContactsRoleApiApiUpdateRoleRequest = {
  // UpdateRoleRo
  updateRoleRo: {
    roleName: "finance",
  },
  // number
  roleId: 1,
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string
  roleId2: "15622",
};

apiInstance.updateRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateRoleRo** | **UpdateRoleRo**|  |
 **roleId** | [**number**] |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **roleId2** | [**string**] |  | defaults to undefined


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


