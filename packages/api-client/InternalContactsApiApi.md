# .InternalContactsApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUnitRole**](InternalContactsApiApi.md#createUnitRole) | **POST** /internal/org/roles | create new role
[**createUnitTeam**](InternalContactsApiApi.md#createUnitTeam) | **POST** /internal/org/teams/create | Add a sub team
[**deleteMember1**](InternalContactsApiApi.md#deleteMember1) | **DELETE** /internal/org/members/{unitId} | Delete a Member from organization
[**deleteUnitRole**](InternalContactsApiApi.md#deleteUnitRole) | **DELETE** /internal/org/roles/{unitId} | Delete team
[**deleteUnitTeam**](InternalContactsApiApi.md#deleteUnitTeam) | **DELETE** /internal/org/teams/delete/{unitId} | Delete team
[**getRolePageList**](InternalContactsApiApi.md#getRolePageList) | **GET** /internal/org/roles | Query roles information
[**getTeamChildrenPageList**](InternalContactsApiApi.md#getTeamChildrenPageList) | **GET** /internal/org/teams/{unitId}/children | Query team information
[**getTeamMembersPageInfo**](InternalContactsApiApi.md#getTeamMembersPageInfo) | **GET** /internal/org/teams/{unitId}/members | Query team members information
[**getUnitMemberDetails**](InternalContactsApiApi.md#getUnitMemberDetails) | **GET** /internal/org/members/{unitId} | Query team information
[**getUnitRoleMembers**](InternalContactsApiApi.md#getUnitRoleMembers) | **GET** /internal/org/roles/{unitId}/members | query role members
[**updateUnitMember**](InternalContactsApiApi.md#updateUnitMember) | **POST** /internal/org/members/{unitId} | Edit member info
[**updateUnitRole**](InternalContactsApiApi.md#updateUnitRole) | **POST** /internal/org/roles/{unitId} | Update team info
[**updateUnitTeam**](InternalContactsApiApi.md#updateUnitTeam) | **POST** /internal/org/teams/update/{unitId} | Update team info


# **createUnitRole**
> ResponseDataUnitRoleInfoVo createUnitRole(createRoleRo, )

create new role

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiCreateUnitRoleRequest = {
  // CreateRoleRo
  createRoleRo: {
    roleName: "Finance",
    position: 2000,
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.createUnitRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createRoleRo** | **CreateRoleRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataUnitRoleInfoVo**

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

# **createUnitTeam**
> ResponseDataUnitTeamInfoVo createUnitTeam(createUnitTeamRo, )

Add a sub team

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiCreateUnitTeamRequest = {
  // CreateUnitTeamRo
  createUnitTeamRo: {
    teamName: "Finance Department",
    parentIdUnitId: "0",
    roleUnitIds: ["aaa"],
    sequence: 0,
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.createUnitTeam(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createUnitTeamRo** | **CreateUnitTeamRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataUnitTeamInfoVo**

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

# **deleteMember1**
> ResponseDataVoid deleteMember1()

Delete a Member from organization

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiDeleteMember1Request = {
  // string | unit uuid
  unitId: "abcdefg",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.deleteMember1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unitId** | [**string**] | unit uuid | defaults to undefined
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteUnitRole**
> ResponseDataVoid deleteUnitRole()

Delete role. If role has members, it can be deleted.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiDeleteUnitRoleRequest = {
  // string | unit uuid
  unitId: "abcdefg",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.deleteUnitRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unitId** | [**string**] | unit uuid | defaults to undefined
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteUnitTeam**
> ResponseDataVoid deleteUnitTeam()

Delete team. If team has members, it can be deleted.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiDeleteUnitTeamRequest = {
  // string | unit uuid
  unitId: "abcdefg",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.deleteUnitTeam(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unitId** | [**string**] | unit uuid | defaults to undefined
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getRolePageList**
> ResponseDataPageInfoUnitRoleInfoVo getRolePageList()

Query roles information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiGetRolePageListRequest = {
  // PageRoleBaseInfoDto
  page: {
    records: [
      {
        id: 1,
        roleName: "roleName_example",
        position: 1,
      },
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

apiInstance.getRolePageList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **PageRoleBaseInfoDto** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **pageObjectParams** | [**string**] | page\&#39;s parameter | defaults to undefined


### Return type

**ResponseDataPageInfoUnitRoleInfoVo**

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

# **getTeamChildrenPageList**
> ResponseDataPageInfoUnitTeamInfoVo getTeamChildrenPageList()

Query department information. if team id lack, default root team

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiGetTeamChildrenPageListRequest = {
  // string | unit uuid
  unitId: "abcdefg",
  // PageLong
  page: {
    records: [
      1,
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

apiInstance.getTeamChildrenPageList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unitId** | [**string**] | unit uuid | defaults to undefined
 **page** | **PageLong** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **pageObjectParams** | [**string**] | page\&#39;s parameter | defaults to undefined


### Return type

**ResponseDataPageInfoUnitTeamInfoVo**

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

# **getTeamMembersPageInfo**
> ResponseDataPageInfoUnitMemberInfoVo getTeamMembersPageInfo()

Query department members information. if team id lack, default root team

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiGetTeamMembersPageInfoRequest = {
  // string | unit uuid
  unitId: "abcdefg",
  // PageLong
  page: {
    records: [
      1,
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
  // boolean | includes mobile number and email (optional)
  sensitiveData: false,
};

apiInstance.getTeamMembersPageInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unitId** | [**string**] | unit uuid | defaults to undefined
 **page** | **PageLong** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **pageObjectParams** | [**string**] | page\&#39;s parameter | defaults to undefined
 **sensitiveData** | [**boolean**] | includes mobile number and email | (optional) defaults to undefined


### Return type

**ResponseDataPageInfoUnitMemberInfoVo**

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

# **getUnitMemberDetails**
> ResponseDataUnitMemberInfoVo getUnitMemberDetails()

Query team information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiGetUnitMemberDetailsRequest = {
  // string | unit uuid
  unitId: "abcdefg",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // boolean | includes mobile number and email (optional)
  sensitiveData: false,
};

apiInstance.getUnitMemberDetails(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unitId** | [**string**] | unit uuid | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **sensitiveData** | [**boolean**] | includes mobile number and email | (optional) defaults to undefined


### Return type

**ResponseDataUnitMemberInfoVo**

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

# **getUnitRoleMembers**
> ResponseDataUnitRoleMemberVo getUnitRoleMembers()

query the role\'s members

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiGetUnitRoleMembersRequest = {
  // string | unit uuid
  unitId: "abcdefg",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // boolean | includes mobile number and email (optional)
  sensitiveData: false,
};

apiInstance.getUnitRoleMembers(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unitId** | [**string**] | unit uuid | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **sensitiveData** | [**boolean**] | includes mobile number and email | (optional) defaults to undefined


### Return type

**ResponseDataUnitRoleMemberVo**

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

# **updateUnitMember**
> ResponseDataUnitMemberInfoVo updateUnitMember(updateUnitMemberRo, )

Edit member info

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiUpdateUnitMemberRequest = {
  // UpdateUnitMemberRo
  updateUnitMemberRo: {
    memberName: "Zhang San",
    teamUnitIds: [
      "teamUnitIds_example",
    ],
    roleUnitIds: ["aaa"],
  },
  // string | unit uuid
  unitId: "abcdefg",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // boolean | includes mobile number and email (optional)
  sensitiveData: false,
};

apiInstance.updateUnitMember(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateUnitMemberRo** | **UpdateUnitMemberRo**|  |
 **unitId** | [**string**] | unit uuid | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **sensitiveData** | [**boolean**] | includes mobile number and email | (optional) defaults to undefined


### Return type

**ResponseDataUnitMemberInfoVo**

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

# **updateUnitRole**
> ResponseDataUnitRoleInfoVo updateUnitRole(updateUnitRoleRo, )

Update role info.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiUpdateUnitRoleRequest = {
  // UpdateUnitRoleRo
  updateUnitRoleRo: {
    roleName: "Design Role",
    position: 0,
  },
  // string | unit uuid
  unitId: "abcdefg",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.updateUnitRole(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateUnitRoleRo** | **UpdateUnitRoleRo**|  |
 **unitId** | [**string**] | unit uuid | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataUnitRoleInfoVo**

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

# **updateUnitTeam**
> ResponseDataUnitTeamInfoVo updateUnitTeam(updateUnitTeamRo, )

Update team info. If modify team level, default sort in the end of parent team.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalContactsApiApi(configuration);

let body:.InternalContactsApiApiUpdateUnitTeamRequest = {
  // UpdateUnitTeamRo
  updateUnitTeamRo: {
    teamName: "Design Department",
    parentIdUnitId: "0",
    roleUnitIds: ["aaa"],
    sequence: 0,
  },
  // string | unit uuid
  unitId: "abcdefg",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.updateUnitTeam(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateUnitTeamRo** | **UpdateUnitTeamRo**|  |
 **unitId** | [**string**] | unit uuid | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataUnitTeamInfoVo**

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


