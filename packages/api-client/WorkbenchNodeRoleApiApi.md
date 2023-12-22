# .WorkbenchNodeRoleApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getCollaboratorInfo**](WorkbenchNodeRoleApiApi.md#getCollaboratorInfo) | **GET** /node/collaborator/info | Get Collaborator Info


# **getCollaboratorInfo**
> ResponseDataNodeCollaboratorVO getCollaboratorInfo()

Scene: Collaborator Card Information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRoleApiApi(configuration);

let body:.WorkbenchNodeRoleApiApiGetCollaboratorInfoRequest = {
  // string
  uuid: "1",
  // string
  nodeId: "nodRTGSy43DJ9",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.getCollaboratorInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uuid** | [**string**] |  | defaults to undefined
 **nodeId** | [**string**] |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataNodeCollaboratorVO**

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


