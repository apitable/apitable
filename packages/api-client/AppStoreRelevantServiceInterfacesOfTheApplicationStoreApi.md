# .AppStoreRelevantServiceInterfacesOfTheApplicationStoreApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**fetchAppStoreApps**](AppStoreRelevantServiceInterfacesOfTheApplicationStoreApi.md#fetchAppStoreApps) | **GET** /appstores/apps | Query application list


# **fetchAppStoreApps**
> ResponseDataPageInfoAppInfo fetchAppStoreApps()

Pagination query. If no query parameter is transferred, the default query will be used

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AppStoreRelevantServiceInterfacesOfTheApplicationStoreApi(configuration);

let body:.AppStoreRelevantServiceInterfacesOfTheApplicationStoreApiFetchAppStoreAppsRequest = {
  // string | Page Index (optional)
  pageIndex: "1",
  // string | Quantity per page (optional)
  pageSize: "50",
  // string | Sort field (optional)
  orderBy: "createdAt",
  // string | Collation,asc=positive sequence,desc=reverse order (optional)
  sortBy: "desc",
};

apiInstance.fetchAppStoreApps(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pageIndex** | [**string**] | Page Index | (optional) defaults to undefined
 **pageSize** | [**string**] | Quantity per page | (optional) defaults to undefined
 **orderBy** | [**string**] | Sort field | (optional) defaults to undefined
 **sortBy** | [**string**] | Collation,asc&#x3D;positive sequence,desc&#x3D;reverse order | (optional) defaults to undefined


### Return type

**ResponseDataPageInfoAppInfo**

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


