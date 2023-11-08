# .LaboratoryModuleExperimentalFunctionInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**showAvailableLabsFeatures**](LaboratoryModuleExperimentalFunctionInterfaceApi.md#showAvailableLabsFeatures) | **GET** /labs/features | Get Lab Function List


# **showAvailableLabsFeatures**
> ResponseDataUserSpaceLabsFeatureVo showAvailableLabsFeatures()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .LaboratoryModuleExperimentalFunctionInterfaceApi(configuration);

let body:any = {};

apiInstance.showAvailableLabsFeatures(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataUserSpaceLabsFeatureVo**

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


