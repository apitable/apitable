# .MigrationResourcesAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**migrationResources**](MigrationResourcesAPIApi.md#migrationResources) | **POST** /ops/asset/migration | migration resources


# **migrationResources**
> ResponseDataVoid migrationResources(migrationResourcesRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .MigrationResourcesAPIApi(configuration);

let body:.MigrationResourcesAPIApiMigrationResourcesRequest = {
  // MigrationResourcesRo
  migrationResourcesRo: {
    token: "K9vvkTLy2eaViE4BAjpuCHEn",
    sourceBucket: "vk-assets-ltd",
    targetBucket: "vk-datasheet",
    resourceKeys: [
      "resourceKeys_example",
    ],
  },
};

apiInstance.migrationResources(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **migrationResourcesRo** | **MigrationResourcesRo**|  |


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


