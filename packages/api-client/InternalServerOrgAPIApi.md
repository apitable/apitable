# .InternalServerOrgAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**loadOrSearch1**](InternalServerOrgAPIApi.md#loadOrSearch1) | **GET** /internal/org/loadOrSearch | Load/search departments and members


# **loadOrSearch1**
> ResponseDataListUnitInfoVo loadOrSearch1()

The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServerOrgAPIApi(configuration);

let body:.InternalServerOrgAPIApiLoadOrSearch1Request = {
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
  // string | user id (optional)
  userId: "23232",
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

apiInstance.loadOrSearch1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **params** | **LoadSearchDTO** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | (optional) defaults to undefined
 **userId** | [**string**] | user id | (optional) defaults to undefined
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


