# .BillingCapacityApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getCapacityDetail**](BillingCapacityApiApi.md#getCapacityDetail) | **GET** /space/capacity/detail | Get space capacity detail info


# **getCapacityDetail**
> ResponseDataPageInfoSpaceCapacityPageVO getCapacityDetail()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingCapacityApiApi(configuration);

let body:.BillingCapacityApiApiGetCapacityDetailRequest = {
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
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
  // string | paging parameter
  pageObjectParams: "{"pageNo":1,"pageSize":20}",
  // boolean | Whether the attachment capacity has expired. By default, it has not expired (optional)
  isExpire: true,
};

apiInstance.getCapacityDetail(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Page** |  | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **pageObjectParams** | [**string**] | paging parameter | defaults to undefined
 **isExpire** | [**boolean**] | Whether the attachment capacity has expired. By default, it has not expired | (optional) defaults to undefined


### Return type

**ResponseDataPageInfoSpaceCapacityPageVO**

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


