# .WorkbenchFieldRoleAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addRole1**](WorkbenchFieldRoleAPIApi.md#addRole1) | **POST** /datasheet/{dstId}/field/{fieldId}/addRole | Add field role
[**batchDeleteRole1**](WorkbenchFieldRoleAPIApi.md#batchDeleteRole1) | **DELETE** /datasheet/{dstId}/field/{fieldId}/batchDeleteRole | Batch delete role
[**batchEditRole1**](WorkbenchFieldRoleAPIApi.md#batchEditRole1) | **POST** /datasheet/{dstId}/field/{fieldId}/batchEditRole | Batch edit field role
[**deleteRole3**](WorkbenchFieldRoleAPIApi.md#deleteRole3) | **DELETE** /datasheet/{dstId}/field/{fieldId}/deleteRole | Delete field role
[**disableRole**](WorkbenchFieldRoleAPIApi.md#disableRole) | **POST** /datasheet/{dstId}/field/{fieldId}/permission/disable | Disable field role
[**editRole2**](WorkbenchFieldRoleAPIApi.md#editRole2) | **POST** /datasheet/{dstId}/field/{fieldId}/editRole | Edit field role
[**enableRole**](WorkbenchFieldRoleAPIApi.md#enableRole) | **POST** /datasheet/{dstId}/field/{fieldId}/permission/enable | Enable field role
[**getCollaboratorPage1**](WorkbenchFieldRoleAPIApi.md#getCollaboratorPage1) | **GET** /datasheet/{dstId}/field/{fieldId}/collaborator/page | Page Query the Field\&#39; Collaborator
[**getMultiDatasheetFieldPermission**](WorkbenchFieldRoleAPIApi.md#getMultiDatasheetFieldPermission) | **GET** /datasheet/field/permission | Get multi datasheet field permission
[**listRole2**](WorkbenchFieldRoleAPIApi.md#listRole2) | **GET** /datasheet/{dstId}/field/{fieldId}/listRole | Gets the field role infos in datasheet.
[**updateRoleSetting**](WorkbenchFieldRoleAPIApi.md#updateRoleSetting) | **POST** /datasheet/{dstId}/field/{fieldId}/updateRoleSetting | Update field role setting


# **addRole1**
> ResponseDataVoid addRole1(fieldRoleCreateRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchFieldRoleAPIApi(configuration);

let body:.WorkbenchFieldRoleAPIApiAddRole1Request = {
  // FieldRoleCreateRo
  fieldRoleCreateRo: {
    unitIds: [
      10101,10102,10103,10104,
    ],
    role: "editor",
  },
  // string | datasheet id
  dstId: "dstCgcfixAKyeeN",
  // string | field id
  fieldId: "fldRg1cGlAFWG",
};

apiInstance.addRole1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fieldRoleCreateRo** | **FieldRoleCreateRo**|  |
 **dstId** | [**string**] | datasheet id | defaults to undefined
 **fieldId** | [**string**] | field id | defaults to undefined


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

# **batchDeleteRole1**
> ResponseDataVoid batchDeleteRole1(batchFieldRoleDeleteRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchFieldRoleAPIApi(configuration);

let body:.WorkbenchFieldRoleAPIApiBatchDeleteRole1Request = {
  // BatchFieldRoleDeleteRo
  batchFieldRoleDeleteRo: {
    unitIds: ["1","2","3"],
  },
  // string | datasheet id
  dstId: "dstCgcfixAKyeeP",
  // string | field id
  fieldId: "fldRg1cGlAFWG",
};

apiInstance.batchDeleteRole1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **batchFieldRoleDeleteRo** | **BatchFieldRoleDeleteRo**|  |
 **dstId** | [**string**] | datasheet id | defaults to undefined
 **fieldId** | [**string**] | field id | defaults to undefined


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

# **batchEditRole1**
> ResponseDataVoid batchEditRole1(batchFieldRoleEditRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchFieldRoleAPIApi(configuration);

let body:.WorkbenchFieldRoleAPIApiBatchEditRole1Request = {
  // BatchFieldRoleEditRo
  batchFieldRoleEditRo: {
    unitIds: ["1","2","3"],
    role: "editor",
  },
  // string | datasheet id
  dstId: "dstCgcfixAKyeeNs",
  // string | field id
  fieldId: "fldRg1cGlAFWG",
};

apiInstance.batchEditRole1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **batchFieldRoleEditRo** | **BatchFieldRoleEditRo**|  |
 **dstId** | [**string**] | datasheet id | defaults to undefined
 **fieldId** | [**string**] | field id | defaults to undefined


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

# **deleteRole3**
> ResponseDataVoid deleteRole3(fieldRoleDeleteRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchFieldRoleAPIApi(configuration);

let body:.WorkbenchFieldRoleAPIApiDeleteRole3Request = {
  // FieldRoleDeleteRo
  fieldRoleDeleteRo: {
    unitId: 761263712638,
  },
  // string | datasheet id
  dstId: "dstCgcfixAKyeeN",
  // string | field id
  fieldId: "fldRg1cGlAFWG",
};

apiInstance.deleteRole3(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fieldRoleDeleteRo** | **FieldRoleDeleteRo**|  |
 **dstId** | [**string**] | datasheet id | defaults to undefined
 **fieldId** | [**string**] | field id | defaults to undefined


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

# **disableRole**
> ResponseDataVoid disableRole()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchFieldRoleAPIApi(configuration);

let body:.WorkbenchFieldRoleAPIApiDisableRoleRequest = {
  // string | datasheet id
  dstId: "dstCgcfixAKyeeNP",
  // string | field id
  fieldId: "fldRg1cGlAFWG",
};

apiInstance.disableRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dstId** | [**string**] | datasheet id | defaults to undefined
 **fieldId** | [**string**] | field id | defaults to undefined


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

# **editRole2**
> ResponseDataVoid editRole2(fieldRoleEditRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchFieldRoleAPIApi(configuration);

let body:.WorkbenchFieldRoleAPIApiEditRole2Request = {
  // FieldRoleEditRo
  fieldRoleEditRo: {
    unitId: 761263712638,
    role: "editor",
  },
  // string | datasheet id
  dstId: "dstCgcfixAKyeeNs",
  // string | field id
  fieldId: "fldRg1cGlAFWG",
};

apiInstance.editRole2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fieldRoleEditRo** | **FieldRoleEditRo**|  |
 **dstId** | [**string**] | datasheet id | defaults to undefined
 **fieldId** | [**string**] | field id | defaults to undefined


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

# **enableRole**
> ResponseDataVoid enableRole()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchFieldRoleAPIApi(configuration);

let body:.WorkbenchFieldRoleAPIApiEnableRoleRequest = {
  // string | datasheet id
  dstId: "dstCgcfixAKyee",
  // string | field id
  fieldId: "fldRg1cGlAFWG",
  // RoleControlOpenRo (optional)
  roleControlOpenRo: {
    includeExtend: true,
  },
};

apiInstance.enableRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **roleControlOpenRo** | **RoleControlOpenRo**|  |
 **dstId** | [**string**] | datasheet id | defaults to undefined
 **fieldId** | [**string**] | field id | defaults to undefined


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

# **getCollaboratorPage1**
> ResponseDataPageInfoFieldRoleMemberVo getCollaboratorPage1()

Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchFieldRoleAPIApi(configuration);

let body:.WorkbenchFieldRoleAPIApiGetCollaboratorPage1Request = {
  // string | datasheet id
  dstId: "dstCgcfixAKyeeNs",
  // string | field id
  fieldId: "fldRg1cGlAFWG",
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

apiInstance.getCollaboratorPage1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dstId** | [**string**] | datasheet id | defaults to undefined
 **fieldId** | [**string**] | field id | defaults to undefined
 **page** | **Page** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **pageObjectParams** | [**string**] | page\&#39;s parameter | defaults to undefined


### Return type

**ResponseDataPageInfoFieldRoleMemberVo**

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

# **getMultiDatasheetFieldPermission**
> ResponseDataListFieldPermissionView getMultiDatasheetFieldPermission()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchFieldRoleAPIApi(configuration);

let body:.WorkbenchFieldRoleAPIApiGetMultiDatasheetFieldPermissionRequest = {
  // string | datasheet id
  dstIds: "dstCgcfixAKyeeNsaP,dstGxznHFXf9pvF1LZ",
  // string | share id (optional)
  shareId: "shrFPXT8qnyFJglX6elJi",
};

apiInstance.getMultiDatasheetFieldPermission(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dstIds** | [**string**] | datasheet id | defaults to undefined
 **shareId** | [**string**] | share id | (optional) defaults to undefined


### Return type

**ResponseDataListFieldPermissionView**

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

# **listRole2**
> ResponseDataFieldCollaboratorVO listRole2()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchFieldRoleAPIApi(configuration);

let body:.WorkbenchFieldRoleAPIApiListRole2Request = {
  // string | datasheet id
  dstId: "dstCgcfixAKyeeNs",
  // string | field id
  fieldId: "fldRg1cGlAFWG",
};

apiInstance.listRole2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dstId** | [**string**] | datasheet id | defaults to undefined
 **fieldId** | [**string**] | field id | defaults to undefined


### Return type

**ResponseDataFieldCollaboratorVO**

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

# **updateRoleSetting**
> ResponseDataVoid updateRoleSetting(fieldControlProp, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchFieldRoleAPIApi(configuration);

let body:.WorkbenchFieldRoleAPIApiUpdateRoleSettingRequest = {
  // FieldControlProp
  fieldControlProp: {
    formSheetAccessible: true,
  },
  // string | datasheet id
  dstId: "dstCgcfixAKyeeNP",
  // string | field id
  fieldId: "fldRg1cGlAFWG",
};

apiInstance.updateRoleSetting(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fieldControlProp** | **FieldControlProp**|  |
 **dstId** | [**string**] | datasheet id | defaults to undefined
 **fieldId** | [**string**] | field id | defaults to undefined


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


