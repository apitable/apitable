# .SpaceSubAdminApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addRole**](SpaceSubAdminApiApi.md#addRole) | **POST** /space/addRole | Create space role
[**deleteRole**](SpaceSubAdminApiApi.md#deleteRole) | **DELETE** /space/deleteRole/{memberId} | delete admin
[**editRole**](SpaceSubAdminApiApi.md#editRole) | **POST** /space/editRole | Edite space role
[**getRoleDetail**](SpaceSubAdminApiApi.md#getRoleDetail) | **GET** /space/getRoleDetail | query admin detail
[**listRole**](SpaceSubAdminApiApi.md#listRole) | **GET** /space/listRole | Query admins


# **addRole**
> ResponseDataVoid addRole(addSpaceRoleRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSubAdminApiApi(configuration);

let body:.SpaceSubAdminApiApiAddRoleRequest = {
  // AddSpaceRoleRo
  addSpaceRoleRo: {
    memberIds: [1,2],
    resourceCodes: ["MANAGE_TEAM","MANAGE_MEMBER"],
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.addRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addSpaceRoleRo** | **AddSpaceRoleRo**|  |
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

# **deleteRole**
> ResponseData deleteRole()

delete admin

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSubAdminApiApi(configuration);

let body:.SpaceSubAdminApiApiDeleteRoleRequest = {
  // number
  memberId: 1,
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.deleteRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **memberId** | [**number**] |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseData**

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

# **editRole**
> ResponseData editRole(updateSpaceRoleRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSubAdminApiApi(configuration);

let body:.SpaceSubAdminApiApiEditRoleRequest = {
  // UpdateSpaceRoleRo
  updateSpaceRoleRo: {
    id: 1,
    memberId: 1,
    resourceCodes: ["MANAGE_TEAM","MANAGE_MEMBER"],
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.editRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateSpaceRoleRo** | **UpdateSpaceRoleRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseData**

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

# **getRoleDetail**
> ResponseDataSpaceRoleDetailVo getRoleDetail()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSubAdminApiApi(configuration);

let body:.SpaceSubAdminApiApiGetRoleDetailRequest = {
  // number
  memberId: 1,
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.getRoleDetail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **memberId** | [**number**] |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataSpaceRoleDetailVo**

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

# **listRole**
> ResponseDataPageInfoSpaceRoleVo listRole()

Page query sub admin.Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSubAdminApiApi(configuration);

let body:.SpaceSubAdminApiApiListRoleRequest = {
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
  // string | paging parameters
  pageObjectParams: "{"pageNo":1,"pageSize":20}",
};

apiInstance.listRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Page** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **pageObjectParams** | [**string**] | paging parameters | defaults to undefined


### Return type

**ResponseDataPageInfoSpaceRoleVo**

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


