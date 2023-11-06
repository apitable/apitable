# .ContentRiskControlAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createReports**](ContentRiskControlAPIApi.md#createReports) | **POST** /censor/createReports | Submit a report
[**readReports**](ContentRiskControlAPIApi.md#readReports) | **GET** /censor/reports/page | Paging query report information list
[**updateReports**](ContentRiskControlAPIApi.md#updateReports) | **POST** /censor/updateReports | Handling whistleblower information


# **createReports**
> ResponseDataVoid createReports(contentCensorReportRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContentRiskControlAPIApi(configuration);

let body:.ContentRiskControlAPIApiCreateReportsRequest = {
  // ContentCensorReportRo
  contentCensorReportRo: {
    nodeId: "dstjuHFsxyvH6751p1",
    reportReason: "Pornographic and vulgar",
  },
};

apiInstance.createReports(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contentCensorReportRo** | **ContentCensorReportRo**|  |


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

# **readReports**
> ResponseDataPageInfoContentCensorResultVo readReports()

Paging query report information list, each table corresponds to a row of records, and the number of reports is automatically accumulatedDescription of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContentRiskControlAPIApi(configuration);

let body:.ContentRiskControlAPIApiReadReportsRequest = {
  // number | Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)
  status: 1,
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
  // string | Paging parameters, see the interface description for instructions
  pageObjectParams: "{"pageNo":1,"pageSize":20}",
};

apiInstance.readReports(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | [**number**] | Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked) | defaults to undefined
 **page** | **Page** |  | defaults to undefined
 **pageObjectParams** | [**string**] | Paging parameters, see the interface description for instructions | defaults to undefined


### Return type

**ResponseDataPageInfoContentCensorResultVo**

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

# **updateReports**
> ResponseDataVoid updateReports()

Force to open in DingTalk, automatically acquire DingTalk users

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ContentRiskControlAPIApi(configuration);

let body:.ContentRiskControlAPIApiUpdateReportsRequest = {
  // string | node id
  nodeId: "dstPv5DSHqXknU6Skp",
  // number | Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)
  status: 1,
};

apiInstance.updateReports(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **status** | [**number**] | Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked) | defaults to undefined


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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


