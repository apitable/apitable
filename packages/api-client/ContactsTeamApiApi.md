# .ContactsTeamApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTeam**](ContactsTeamApiApi.md#createTeam) | **POST** /org/team/create | Create team
[**deleteTeam**](ContactsTeamApiApi.md#deleteTeam) | **DELETE** /org/team/delete/{teamId} | Delete team
[**getSubTeams**](ContactsTeamApiApi.md#getSubTeams) | **GET** /org/team/subTeams | Query direct sub departments
[**getTeamBranch**](ContactsTeamApiApi.md#getTeamBranch) | **GET** /org/team/branch | team branch
[**getTeamMembers**](ContactsTeamApiApi.md#getTeamMembers) | **GET** /org/team/members | Query the team\&#39;s members
[**getTeamTree**](ContactsTeamApiApi.md#getTeamTree) | **GET** /org/team/tree | Query team tree
[**readTeamInfo**](ContactsTeamApiApi.md#readTeamInfo) | **GET** /org/team/read | Query team information
[**updateTeam**](ContactsTeamApiApi.md#updateTeam) | **POST** /org/team/update | Update team info


# **createTeam**
> ResponseDataVoid createTeam(createTeamRo, )

Create team

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsTeamApiApi(configuration);

let body:.ContactsTeamApiApiCreateTeamRequest = {
  // CreateTeamRo
  createTeamRo: {
    name: "Finance Department",
    superId: 0,
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.createTeam(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createTeamRo** | **CreateTeamRo**|  |
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

# **deleteTeam**
> ResponseDataVoid deleteTeam()

Delete team. If team has members, it can be deleted.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsTeamApiApi(configuration);

let body:.ContactsTeamApiApiDeleteTeamRequest = {
  // string | team id
  teamId: "1",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.deleteTeam(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **teamId** | [**string**] | team id | defaults to undefined
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

# **getSubTeams**
> ResponseDataListTeamTreeVo getSubTeams()

query sub team by team id. if team id lack, default root team.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsTeamApiApi(configuration);

let body:.ContactsTeamApiApiGetSubTeamsRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | team id (optional)
  teamId: "1",
};

apiInstance.getSubTeams(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **teamId** | [**string**] | team id | (optional) defaults to undefined


### Return type

**ResponseDataListTeamTreeVo**

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

# **getTeamBranch**
> ResponseDataListTeamTreeVo getTeamBranch()

team branch. result is tree

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsTeamApiApi(configuration);

let body:.ContactsTeamApiApiGetTeamBranchRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.getTeamBranch(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataListTeamTreeVo**

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

# **getTeamMembers**
> ResponseDataListMemberPageVo getTeamMembers()

Query the team\'s members, no include sub team\'s

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsTeamApiApi(configuration);

let body:.ContactsTeamApiApiGetTeamMembersRequest = {
  // string | team id
  teamId: "0",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.getTeamMembers(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **teamId** | [**string**] | team id | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataListMemberPageVo**

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

# **getTeamTree**
> ResponseDataListTeamTreeVo getTeamTree()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsTeamApiApi(configuration);

let body:.ContactsTeamApiApiGetTeamTreeRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // number | tree depth(default:1,max:2) (optional)
  depth: 2,
};

apiInstance.getTeamTree(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **depth** | [**number**] | tree depth(default:1,max:2) | (optional) defaults to undefined


### Return type

**ResponseDataListTeamTreeVo**

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

# **readTeamInfo**
> ResponseDataTeamInfoVo readTeamInfo()

Query department information. if team id lack, default root team

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsTeamApiApi(configuration);

let body:.ContactsTeamApiApiReadTeamInfoRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | team id (optional)
  teamId: "1",
};

apiInstance.readTeamInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **teamId** | [**string**] | team id | (optional) defaults to undefined


### Return type

**ResponseDataTeamInfoVo**

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

# **updateTeam**
> ResponseDataVoid updateTeam(updateTeamRo, )

Update team info. If modify team level,default sort in the end of parent team.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactsTeamApiApi(configuration);

let body:.ContactsTeamApiApiUpdateTeamRequest = {
  // UpdateTeamRo
  updateTeamRo: {
    teamId: 1,
    teamName: "Design Department",
    superId: 0,
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.updateTeam(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateTeamRo** | **UpdateTeamRo**|  |
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


