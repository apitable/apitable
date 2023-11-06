# .WidgetSDKWidgetAuditApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**auditSubmitData**](WidgetSDKWidgetAuditApiApi.md#auditSubmitData) | **POST** /widget/audit/submit/data | Audit global widget submit data
[**issuedGlobalId**](WidgetSDKWidgetAuditApiApi.md#issuedGlobalId) | **POST** /widget/audit/issued/globalId | Issue global id


# **auditSubmitData**
> ResponseDataVoid auditSubmitData(widgetAuditSubmitDataRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKWidgetAuditApiApi(configuration);

let body:.WidgetSDKWidgetAuditApiApiAuditSubmitDataRequest = {
  // WidgetAuditSubmitDataRo
  widgetAuditSubmitDataRo: {
    globalPackageId: "globalPackageId_example",
    submitVersion: "submitVersion_example",
    auditResult: true,
    auditRemark: "auditRemark_example",
    dstId: "dstId_example",
    fieldId: "fieldId_example",
    recordId: "recordId_example",
    isTemplate: true,
    isEnabled: true,
    widgetOpenSource: "widgetOpenSource_example",
    templateCover: "templateCover_example",
  },
};

apiInstance.auditSubmitData(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetAuditSubmitDataRo** | **WidgetAuditSubmitDataRo**|  |


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

# **issuedGlobalId**
> ResponseDataWidgetIssuedGlobalIdVo issuedGlobalId(widgetAuditGlobalIdRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKWidgetAuditApiApi(configuration);

let body:.WidgetSDKWidgetAuditApiApiIssuedGlobalIdRequest = {
  // WidgetAuditGlobalIdRo
  widgetAuditGlobalIdRo: {
    globalPackageId: "globalPackageId_example",
    auditWidgetName: "auditWidgetName_example",
    auditResult: true,
    auditRemark: "auditRemark_example",
    noticeEmail: "noticeEmail_example",
    packageType: 1,
    dstId: "dstId_example",
    fieldId: "fieldId_example",
    recordId: "recordId_example",
  },
};

apiInstance.issuedGlobalId(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetAuditGlobalIdRo** | **WidgetAuditGlobalIdRo**|  |


### Return type

**ResponseDataWidgetIssuedGlobalIdVo**

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


