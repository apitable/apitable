# .ContactOrganizationApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSubUnitList**](ContactOrganizationApiApi.md#getSubUnitList) | **GET** /org/getSubUnitList | Query the sub departments and members of department
[**loadOrSearch**](ContactOrganizationApiApi.md#loadOrSearch) | **GET** /org/loadOrSearch | Load/search departments and members
[**search**](ContactOrganizationApiApi.md#search) | **GET** /org/searchUnit | search organization resources
[**searchSubTeamAndMembers**](ContactOrganizationApiApi.md#searchSubTeamAndMembers) | **GET** /org/search/unit | Search departments or members（it will be abandoned）
[**searchTeamInfo**](ContactOrganizationApiApi.md#searchTeamInfo) | **GET** /org/search | Global search
[**searchUnitInfoVo**](ContactOrganizationApiApi.md#searchUnitInfoVo) | **POST** /org/searchUnitInfoVo | accurately query departments and members


# **getSubUnitList**
> ResponseDataSubUnitResultVo getSubUnitList()

Query the sub departments and members of department. if team id lack, default is 0

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactOrganizationApiApi(configuration);

let body:.ContactOrganizationApiApiGetSubUnitListRequest = {
  // string | team id (optional)
  teamId: "0",
  // string | link id: node share id | template id (optional)
  linkId: "shr8Txx",
  // string | space id (optional)
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.getSubUnitList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **teamId** | [**string**] | team id | (optional) defaults to undefined
 **linkId** | [**string**] | link id: node share id | template id | (optional) defaults to undefined
 **xSpaceId** | [**string**] | space id | (optional) defaults to undefined


### Return type

**ResponseDataSubUnitResultVo**

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

# **loadOrSearch**
> ResponseDataListUnitInfoVo loadOrSearch()

The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactOrganizationApiApi(configuration);

let body:.ContactOrganizationApiApiLoadOrSearchRequest = {
  // LoadSearchDTO
  params: {
    keyword: "keyword_example",
    linkId: "linkId_example",
    unitIds: [
      1,
    ],
    filterIds: [
      1,
    ],
    all: true,
    searchEmail: true,
    userId: "userId_example",
  },
  // string | space id (optional)
  xSpaceId: "spczJrh2i3tLW",
  // string | link id: node share id | template id (optional)
  linkId: "shr8Tx",
  // string | keyword (optional)
  keyword: "Lili",
  // string | unitIds (optional)
  unitIds: "1271,1272",
  // string | specifies the organizational unit to filter (optional)
  filterIds: "123,124",
  // boolean | whether to load all departments and members (optional)
  all: true,
  // boolean | whether to search for emails (optional)
  searchEmail: true,
};

apiInstance.loadOrSearch(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **params** | **LoadSearchDTO** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | (optional) defaults to undefined
 **linkId** | [**string**] | link id: node share id | template id | (optional) defaults to undefined
 **keyword** | [**string**] | keyword | (optional) defaults to undefined
 **unitIds** | [**string**] | unitIds | (optional) defaults to undefined
 **filterIds** | [**string**] | specifies the organizational unit to filter | (optional) defaults to undefined
 **all** | [**boolean**] | whether to load all departments and members | (optional) defaults to undefined
 **searchEmail** | [**boolean**] | whether to search for emails | (optional) defaults to undefined


### Return type

**ResponseDataListUnitInfoVo**

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

# **search**
> ResponseDataUnitSearchResultVo search()

Provide input word fuzzy search organization resources

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactOrganizationApiApi(configuration);

let body:.ContactOrganizationApiApiSearchRequest = {
  // string | keyword
  keyword: "design",
  // string | link id: node share id | template id (optional)
  linkId: "shr8Tx",
  // string | the highlight style (optional)
  className: "highLight",
  // string | space id (optional)
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.search(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] | keyword | defaults to undefined
 **linkId** | [**string**] | link id: node share id | template id | (optional) defaults to undefined
 **className** | [**string**] | the highlight style | (optional) defaults to undefined
 **xSpaceId** | [**string**] | space id | (optional) defaults to undefined


### Return type

**ResponseDataUnitSearchResultVo**

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

# **searchSubTeamAndMembers**
> ResponseDataListOrganizationUnitVo searchSubTeamAndMembers()

fuzzy search unit

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactOrganizationApiApi(configuration);

let body:.ContactOrganizationApiApiSearchSubTeamAndMembersRequest = {
  // string | keyword
  keyword: "design",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | the highlight style (optional)
  className: "highLight",
};

apiInstance.searchSubTeamAndMembers(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] | keyword | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **className** | [**string**] | the highlight style | (optional) defaults to undefined


### Return type

**ResponseDataListOrganizationUnitVo**

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

# **searchTeamInfo**
> ResponseDataSearchResultVo searchTeamInfo()

fuzzy search department or members

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactOrganizationApiApi(configuration);

let body:.ContactOrganizationApiApiSearchTeamInfoRequest = {
  // string | keyword
  keyword: "design",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
  // string | the highlight style (optional)
  className: "highLight",
};

apiInstance.searchTeamInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | [**string**] | keyword | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **className** | [**string**] | the highlight style | (optional) defaults to undefined


### Return type

**ResponseDataSearchResultVo**

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

# **searchUnitInfoVo**
> ResponseDataListUnitInfoVo searchUnitInfoVo(searchUnitRo)

scenario field conversion（If the amount of data is large, the content requested by GET will exceed the limit.）

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContactOrganizationApiApi(configuration);

let body:.ContactOrganizationApiApiSearchUnitInfoVoRequest = {
  // SearchUnitRo
  searchUnitRo: {
    names: "Zhang San, Li Si",
    linkId: "shr8T8vAfehg3yj3McmDG",
  },
  // string | space id (optional)
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.searchUnitInfoVo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **searchUnitRo** | **SearchUnitRo**|  |
 **xSpaceId** | [**string**] | space id | (optional) defaults to undefined


### Return type

**ResponseDataListUnitInfoVo**

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


