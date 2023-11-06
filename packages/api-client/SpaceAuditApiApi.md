# .SpaceAuditApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**audit**](SpaceAuditApiApi.md#audit) | **GET** /space/{spaceId}/audit | Query space audit logs in pages


# **audit**
> ResponseDataPageInfoSpaceAuditPageVO audit()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceAuditApiApi(configuration);

let body:.SpaceAuditApiApiAuditRequest = {
  // string | space id
  spaceId: "spc8mXUeiXyVo",
  // Date | beginTime(format：yyyy-MM-dd HH:mm:ss) (optional)
  beginTime: new Date('1'),
  // Date | endTime(format：yyyy-MM-dd HH:mm:ss) (optional)
  endTime: new Date('1'),
  // string | member ids (optional)
  memberIds: "1,3,5",
  // string | actions (optional)
  actions: "create_node,rename_node",
  // string | keyword (optional)
  keyword: "1",
  // number | page no(default 1) (optional)
  pageNo: 1,
  // number | page size(default 20，max 100) (optional)
  pageSize: 20,
};

apiInstance.audit(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined
 **beginTime** | [**Date**] | beginTime(format：yyyy-MM-dd HH:mm:ss) | (optional) defaults to undefined
 **endTime** | [**Date**] | endTime(format：yyyy-MM-dd HH:mm:ss) | (optional) defaults to undefined
 **memberIds** | [**string**] | member ids | (optional) defaults to undefined
 **actions** | [**string**] | actions | (optional) defaults to undefined
 **keyword** | [**string**] | keyword | (optional) defaults to undefined
 **pageNo** | [**number**] | page no(default 1) | (optional) defaults to undefined
 **pageSize** | [**number**] | page size(default 20，max 100) | (optional) defaults to undefined


### Return type

**ResponseDataPageInfoSpaceAuditPageVO**

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


