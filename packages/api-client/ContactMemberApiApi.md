# .ContactMemberApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addMember**](ContactMemberApiApi.md#addMember) | **POST** /org/member/addMember | Add member
[**checkEmailInSpace**](ContactMemberApiApi.md#checkEmailInSpace) | **GET** /org/member/checkEmail | Check whether email in space
[**deleteBatchMember**](ContactMemberApiApi.md#deleteBatchMember) | **DELETE** /org/member/deleteBatch | Delete members
[**deleteMember**](ContactMemberApiApi.md#deleteMember) | **DELETE** /org/member/delete | Delete a Member
[**downloadTemplate**](ContactMemberApiApi.md#downloadTemplate) | **GET** /org/member/downloadTemplate | Download contact template
[**getMemberList**](ContactMemberApiApi.md#getMemberList) | **GET** /org/member/list | Query the team\&#39;s members
[**getMembers**](ContactMemberApiApi.md#getMembers) | **GET** /org/member/search | Fuzzy Search Members
[**getUnits**](ContactMemberApiApi.md#getUnits) | **GET** /org/member/units | Query the units which a user belongs in space
[**inviteMember**](ContactMemberApiApi.md#inviteMember) | **POST** /org/member/sendInvite | Send an email to invite members
[**inviteMemberSingle**](ContactMemberApiApi.md#inviteMemberSingle) | **POST** /org/member/sendInviteSingle | Again send an email to invite members
[**read1**](ContactMemberApiApi.md#read1) | **GET** /org/member/read | Get member\&#39;s detail info
[**readPage**](ContactMemberApiApi.md#readPage) | **GET** /org/member/page | Page query the team\&#39;s member
[**update2**](ContactMemberApiApi.md#update2) | **POST** /org/member/update | Edit self member information
[**updateInfo**](ContactMemberApiApi.md#updateInfo) | **POST** /org/member/updateInfo | Edit member info
[**updateTeam1**](ContactMemberApiApi.md#updateTeam1) | **POST** /org/member/updateMemberTeam | Update team
[**uploadExcel**](ContactMemberApiApi.md#uploadExcel) | **POST** /org/member/uploadExcel | Upload employee sheet


# **addMember**
> ResponseDataVoid addMember(teamAddMemberRo, )

When adding new members, they can only be selected from within the organization structure and can be transferred by department

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiAddMemberRequest = {
  // TeamAddMemberRo
  teamAddMemberRo: {
    teamId: 12032,
    unitList: [
      {
        id: 120322719823,
        type: 1,
      },
    ],
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.addMember(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **teamAddMemberRo** | **TeamAddMemberRo**|  |
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

# **checkEmailInSpace**
> ResponseDataBoolean checkEmailInSpace()

Check whether email in space

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiCheckEmailInSpaceRequest = {
  // string | email
  email: "xxx@admin.com",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.checkEmailInSpace(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **email** | [**string**] | email | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataBoolean**

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

# **deleteBatchMember**
> ResponseDataVoid deleteBatchMember(deleteBatchMemberRo, )

action provides two deletion modes，1.delete from organization 2. delete from team

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiDeleteBatchMemberRequest = {
  // DeleteBatchMemberRo
  deleteBatchMemberRo: {
    action: 0,
    memberId: ["10101","10102","10103","10104"],
    teamId: 1,
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.deleteBatchMember(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteBatchMemberRo** | **DeleteBatchMemberRo**|  |
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

# **deleteMember**
> ResponseDataVoid deleteMember(deleteMemberRo, )

action provides two deletion modes.1.delete from organization 2. delete from team

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiDeleteMemberRequest = {
  // DeleteMemberRo
  deleteMemberRo: {
    action: 0,
    memberId: 1,
    teamId: 1,
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.deleteMember(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteMemberRo** | **DeleteMemberRo**|  |
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

# **downloadTemplate**
> void downloadTemplate()

Download contact template

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:any = {};

apiInstance.downloadTemplate(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **getMemberList**
> ResponseDataListMemberInfoVo getMemberList()

Query all the members of the department, including the members of the sub department.if root team can lack teamId, teamId default 0.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiGetMemberListRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | team id. if root team can lack teamId, teamId default 0. (optional)
  teamId: "0",
};

apiInstance.getMemberList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **teamId** | [**string**] | team id. if root team can lack teamId, teamId default 0. | (optional) defaults to undefined


### Return type

**ResponseDataListMemberInfoVo**

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

# **getMembers**
> ResponseDataListSearchMemberVo getMembers()

Fuzzy Search Members

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiGetMembersRequest = {
  // string | keyword
  keyword: "Luck",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // boolean | whether to filter unadded members (optional)
  filter: true,
  // string | the highlighting style (optional)
  className: "highLight",
};

apiInstance.getMembers(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] | keyword | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **filter** | [**boolean**] | whether to filter unadded members | (optional) defaults to undefined
 **className** | [**string**] | the highlighting style | (optional) defaults to undefined


### Return type

**ResponseDataListSearchMemberVo**

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

# **getUnits**
> ResponseDataMemberUnitsVo getUnits()

Query the units which a user belongs, include self

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiGetUnitsRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.getUnits(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataMemberUnitsVo**

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

# **inviteMember**
> ResponseDataMemberUnitsVo inviteMember(inviteRo, )

Send an email to invite. The email is automatically bound to the platform user. The invited member will be in the state to be activated, and will not take effect until the user self activates.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiInviteMemberRequest = {
  // InviteRo
  inviteRo: {
    invite: [
      {
        email: "123456@qq.com",
        teamId: 16272126,
      },
    ],
    data: "FutureIsComing",
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.inviteMember(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inviteRo** | **InviteRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataMemberUnitsVo**

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

# **inviteMemberSingle**
> ResponseDataVoid inviteMemberSingle(inviteMemberAgainRo, )

If a member is not activated, it can send an invitation again regardless of whether the invitation has expired. After the invitation is successfully sent, the invitation link sent last time will be invalid.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiInviteMemberSingleRequest = {
  // InviteMemberAgainRo
  inviteMemberAgainRo: {
    email: "123456@qq.com",
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.inviteMemberSingle(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inviteMemberAgainRo** | **InviteMemberAgainRo**|  |
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

# **read1**
> ResponseDataMemberInfoVo read1()

Get member\'s detail info

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiRead1Request = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | member id (optional)
  memberId: "1",
  // string | user uuid (optional)
  uuid: "1",
};

apiInstance.read1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **memberId** | [**string**] | member id | (optional) defaults to undefined
 **uuid** | [**string**] | user uuid | (optional) defaults to undefined


### Return type

**ResponseDataMemberInfoVo**

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

# **readPage**
> ResponseDataPageInfoMemberPageVo readPage()

Query all the members of the department,  including the members of the sub department. The query must be paging not full query. Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiReadPageRequest = {
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
  // string | team id. if root team can lack teamId, teamId default 0. (optional)
  teamId: "1",
  // string | whether to filter unadded members (optional)
  isActive: "1",
};

apiInstance.readPage(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Page** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **pageObjectParams** | [**string**] | page\&#39;s parameter | defaults to undefined
 **teamId** | [**string**] | team id. if root team can lack teamId, teamId default 0. | (optional) defaults to undefined
 **isActive** | [**string**] | whether to filter unadded members | (optional) defaults to undefined


### Return type

**ResponseDataPageInfoMemberPageVo**

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

# **update2**
> ResponseDataVoid update2(updateMemberOpRo, )

Edit self member information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiUpdate2Request = {
  // UpdateMemberOpRo
  updateMemberOpRo: {
    memberName: "Zhang San",
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.update2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateMemberOpRo** | **UpdateMemberOpRo**|  |
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

# **updateInfo**
> ResponseDataVoid updateInfo(updateMemberRo, )

Edit member info

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiUpdateInfoRequest = {
  // UpdateMemberRo
  updateMemberRo: {
    memberId: 1,
    memberName: "Zhang San",
    position: "Manager",
    email: "example@qq.com",
    jobNumber: "143613308",
    teamIds: ["10101","10102","10103","10104"],
    roleIds: ["10101","10102","10103","10104"],
    tagIds: ["10101","10102","10103","10104"],
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.updateInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateMemberRo** | **UpdateMemberRo**|  |
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

# **updateTeam1**
> ResponseDataVoid updateTeam1(updateMemberTeamRo, )

assign members to departments

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiUpdateTeam1Request = {
  // UpdateMemberTeamRo
  updateMemberTeamRo: {
    memberIds: ["10101","10102","10103","10104"],
    preTeamId: 271632,
    newTeamIds: ["10101","10102","10103","10104"],
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.updateTeam1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateMemberTeamRo** | **UpdateMemberTeamRo**|  |
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

# **uploadExcel**
> ResponseDataUploadParseResultVO uploadExcel()

Upload employee sheet，then parse it.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactMemberApiApi(configuration);

let body:.ContactMemberApiApiUploadExcelRequest = {
  // UploadMemberTemplateRo
  data: {
    file: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
    data: "FutureIsComing",
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.uploadExcel(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | **UploadMemberTemplateRo** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataUploadParseResultVO**

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


