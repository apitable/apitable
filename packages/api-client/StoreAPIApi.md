# .StoreAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getPrices**](StoreAPIApi.md#getPrices) | **GET** /shop/prices | Get Price List for A Product


# **getPrices**
> ResponseDataListProductPriceVo getPrices()

Self-operated product price list

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .StoreAPIApi(configuration);

let body:.StoreAPIApiGetPricesRequest = {
  // string | product name
  product: "SILVER",
};

apiInstance.getPrices(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **product** | [**string**] | product name | defaults to undefined


### Return type

**ResponseDataListProductPriceVo**

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


