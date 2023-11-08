# .WidgetSDKPackageApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createWidget**](WidgetSDKPackageApiApi.md#createWidget) | **POST** /widget/package/create | Create widget
[**getWidgetPackageInfo**](WidgetSDKPackageApiApi.md#getWidgetPackageInfo) | **GET** /widget/package/{packageId} | Get widget package info
[**getWidgetPackageListInfo**](WidgetSDKPackageApiApi.md#getWidgetPackageListInfo) | **GET** /widget/package/store | Get widget store information
[**releaseListWidget**](WidgetSDKPackageApiApi.md#releaseListWidget) | **GET** /widget/package/release/history/{packageId} | Get widget release history
[**releaseWidgetV2**](WidgetSDKPackageApiApi.md#releaseWidgetV2) | **POST** /widget/package/v2/release | release widget v2
[**rollbackWidget**](WidgetSDKPackageApiApi.md#rollbackWidget) | **POST** /widget/package/rollback | Rollback widget
[**submitWidgetV2**](WidgetSDKPackageApiApi.md#submitWidgetV2) | **POST** /widget/package/v2/submit | submit widget v2
[**transferWidgetOwner**](WidgetSDKPackageApiApi.md#transferWidgetOwner) | **POST** /widget/package/transfer/owner | Transfer widget owner
[**unpublishWidget**](WidgetSDKPackageApiApi.md#unpublishWidget) | **POST** /widget/package/unpublish | Unpublish widget
[**widgetAuth**](WidgetSDKPackageApiApi.md#widgetAuth) | **POST** /widget/package/auth | Auth widget


# **createWidget**
> ResponseDataWidgetReleaseCreateVo createWidget(widgetPackageCreateRo, )

widget-cli initialization create widget

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKPackageApiApi(configuration);

let body:.WidgetSDKPackageApiApiCreateWidgetRequest = {
  // WidgetPackageCreateRo
  widgetPackageCreateRo: {
    packageId: "wpkAAA",
    spaceId: "spcyQkKp9XJEl",
    name: "{'zh-CN':'Chinese','en-US':'English'}",
    packageType: 1,
    releaseType: 1,
    isTemplate: true,
    sandbox: true,
    installEnv: [
      "dashboard",
    ],
    runtimeEnv: [
      "mobile",
    ],
  },
  // string | developer token
  authorization: "Bearer uskaoeiu",
};

apiInstance.createWidget(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetPackageCreateRo** | **WidgetPackageCreateRo**|  |
 **authorization** | [**string**] | developer token | defaults to undefined


### Return type

**ResponseDataWidgetReleaseCreateVo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getWidgetPackageInfo**
> ResponseDataWidgetPackageInfoVo getWidgetPackageInfo()

widget-cli get widget package info

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKPackageApiApi(configuration);

let body:.WidgetSDKPackageApiApiGetWidgetPackageInfoRequest = {
  // string
  packageId: "packageId_example",
  // string | developer token
  authorization: "Bearer uskaoeiu",
  // string | developer\'s language (optional)
  acceptLanguage: "「en-US/zh-CN」",
};

apiInstance.getWidgetPackageInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **packageId** | [**string**] |  | defaults to undefined
 **authorization** | [**string**] | developer token | defaults to undefined
 **acceptLanguage** | [**string**] | developer\&#39;s language | (optional) defaults to undefined


### Return type

**ResponseDataWidgetPackageInfoVo**

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

# **getWidgetPackageListInfo**
> ResponseDataListWidgetPackageInfoVo getWidgetPackageListInfo()

widget-cli get widget store information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKPackageApiApi(configuration);

let body:.WidgetSDKPackageApiApiGetWidgetPackageListInfoRequest = {
  // string
  spaceId: "spaceId_example",
  // string | developer token
  authorization: "Bearer uskaoeiu",
  // string | developer\'s language (optional)
  acceptLanguage: "「en-US/zh-CN」",
};

apiInstance.getWidgetPackageListInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **authorization** | [**string**] | developer token | defaults to undefined
 **acceptLanguage** | [**string**] | developer\&#39;s language | (optional) defaults to undefined


### Return type

**ResponseDataListWidgetPackageInfoVo**

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

# **releaseListWidget**
> ResponseDataListWidgetReleaseListVo releaseListWidget()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKPackageApiApi(configuration);

let body:.WidgetSDKPackageApiApiReleaseListWidgetRequest = {
  // number | widget package id
  packageId: wpkAbc,
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
  // string | developer token
  authorization: "Bearer uskaoeiu",
  // string | page (optional)
  pageObjectParams: "{"pageNo":1,"pageSize":20}",
};

apiInstance.releaseListWidget(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **packageId** | [**number**] | widget package id | defaults to undefined
 **page** | **Page** |  | defaults to undefined
 **authorization** | [**string**] | developer token | defaults to undefined
 **pageObjectParams** | [**string**] | page | (optional) defaults to undefined


### Return type

**ResponseDataListWidgetReleaseListVo**

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

# **releaseWidgetV2**
> ResponseDataVoid releaseWidgetV2(widgetPackageReleaseV2Ro, )

widget-cli release widget

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKPackageApiApi(configuration);

let body:.WidgetSDKPackageApiApiReleaseWidgetV2Request = {
  // WidgetPackageReleaseV2Ro
  widgetPackageReleaseV2Ro: {
    iconToken: "iconToken_example",
    coverToken: "coverToken_example",
    authorName: "authorName_example",
    authorIconToken: "authorIconToken_example",
    authorEmail: "authorEmail_example",
    authorLink: "http://MDTMv2D2ylmgd10Z3UB6UkJSISSB512iz2DiJykO4IVP7YNsKQHh9BsaMPOiOuo3_QLOpkB.KIPOf2Flbsh1TpRS00PDvgoKGNXgxLHoPJE._eVrdJNcY9CLxYxBbcfSJXXZGSCF7dC-lSY-7ZlQJLW1_GNchKk5EBLDz1ctzsIY4oI.cl12VtuaSfjvmymTJfYkic17VJpcq1X6tjkH36lFYtIUw23vATP5cgpgctxW3q4fsZS5Uz-fvg2bA4.I-r1orbd3s4Kdu4Q19mfvL0A7Rpn3Av26g7OJWsQ0WBkWv3CuuRrMkJf5gzLvv2wY.NPqhvoybcy8QU.0_1u6BhIo-27B5JIFoxlv9-BJxhRRelW6lINX6.1Elv8Z4qYvYNwb3t4awGG-6yh0-gMEzQ8uhi90kNEaHx.5LWBoOt62fDnfouEM59JJWYHa1Ya1DpwFCTpIA0Gnqa9PQ0lvjCR3UYpt1vrS1p.R1OzxrQfgrgcyvfHmHL7bSaRv9kZ_K.NGkIi19s7KrTBx8qCkWG3nkJgXYUf-2g1bLoF4Q2SDvsQvki_Gv.3xSglBiD_kTqWft7LgtQq8DkTxH9-GEgnhdskTUa-JGB99tBTH1m8LyVjqKCRWp6XS1rwkzrnn.h0XoK7cYVKPWx4kXAhG_GEdV9fi1LUY2eBXIK-aaNx-IAoUxtYKQpsS2HM0cvxv.88aJmQRbOi5pM9K4SWNKj0UeVyhnBjVWguY2vNQIw3D_aRMF2Tm7SelZBdyPOLRs2IImu0zJ-sEvqrLoPmgi.JrQNmT_4QLVs0oSHjB6pC-1mwGXNIZ-mK8w9K1xfp9OikxJ6eiOUAchnVGrwqvIGWHJ7Z1.eTeQr7h2GhDiufc8pTDOUcgYQwyEct13aGy9ShDDH49uy_cuS1qDT5br69Zb9J7ztaciXoL3UMxQsS4RhgPVNkMuBNIrWv_v.6kENTnbd0jYevK4Igno2LdfSDI1Cs6huybGb1zEpVJcz_sYPOWoI5540Y2OLcYufJVmh2PNuin04QumvvjetJ2wYXn.2W6zwIrDKlbs9CPExuzXJjOmov9hu5QjJ_xMDMiy-rwLYYugfVA0tbOL0.zdgU9sGpVxk.V0XsgBCaMb6w.WmQk2AHCmB9lVwewmjj04um-gQsMcYoZx6RzkDL1MAzcQRnYq9jshsHLjup_Xq1.S5JIFlA8s7VLbfJ8CdU1--K_bbEzgXW.tGc11HJjfPh9aPBMPn9vOOHdKkQ6_InnGXC1663IOeomDvz9sa4XpvFxFUjA2Vr.PYqBpPgKYJXJXx50oGq47BDC1bkGeAny7jvr.nVoFMKNnHvQ4AYmlmF-v4iCmrtetgOVivKk30FKcbp2YLd7pV.yS_oco2NX0KaIUr6IkqdrU12DLntCJlzZRgbiwPbeBEaozEh0SiWTzo35ic3_fxCN.JH7Ifx4drCfHNmicDnRnqH2lvbFg3LEqe7XaJ9kbxYSX1C_Lr7dDE3pdI47Y5OdDPkSvjK_RoQMDG8YTqdvQky1k.bXOyxDLVceMTPn2f1D8joDAWMEOKR7TA5Mr5sJj8HnYiNQw3dMfL85GQOI.PdtmSOAEKxeS.nf5zlDYDcZtAn2y3pBKKrVM3EsaoUBgV8gy30aITJ7uhAIMDUKTawsf6HUR.vzPAZ5l09xshFyzZ.iL2KN6CGlaHkPX2BJeFuAvdHCCkQfzG8UQdfdhrt6srAn0F.isE9LinMVcxjk_gX1iQ6En890DUqRq1QMsZdFRNoDtaPmlYuZyzIuPbP9BoKeUzcKrabe3xXH.Opr6PVcnpJXO1EjjhcsqEiC9dTSNBWTV28hLq4QrTzI9GtnaVV7h1gY.lMPOz0JlrLFiDe3KOjXDRBF9hN72JekIfNuG9Pqe8.sbStaCVPDJlO5QnMT8K8jKE9fe7M-6-c8yP711SfHIbsPGUzHQRu0X7ALLvsoFkc22LM5RF.KXIeel20-8t0dHGD.TMbINi8qq1WxwuHJ8xdW47netlfTR8n_uO18chNXvsqeiN.fhIlF4_xFhy.LI2aMQiq3xrYdwZZfj:8540924952563683359320854078659819794781411103924680743929136930965435543167614580652957431136054027:3763231602541073670910718352952:538806000508604966:457558080937212212693570119702724148127628318491556537310:860524706494479794716186434371109630204722512789789631539877185658176164516026655861206000417:791344273602411081975908504454776508852705547431834:46852464274776440429924093379933341913011038174223456661616808812692732341783395403119441980858:33860855774893769673801641334118116539205260279829:8079427282586146072038891330853121:3708039327300270224:330060131683699021734864618825496589250642444961192316997606697985903758440:6559432430231825331283331747113750504035:988811557572531590733576606974552415483899080412865191574657472504943862274358527:41401173919503766367423089674052878573298329827809927752545337671005390384191438526666080939090:0:10180338444873049065530898710911390079413719830:4713864792761764611807161543201777:5283737935993870760273143669309719968:7188704787526641600445292186:348520389287423567254074346175217622561451079129084002053973922446460250491608480:0231809141267960895199462641905482830637608:4960967606130933215691217:1:343668773775818452290466735608:762898531697761054983873087322770990879462345043957102276017229125982475171619800410570471:69263769658000:210077:903211439:474037664274918513870201369204845350097736465527250728319002896678:485096158329122577030795172540603354:061430729987039394399818446008603387:289718599814379453609220038153782182245281032099572164033721581224672323981202:69213402722910169804822420720825204365554026815623526817:9415529694367659402385962212891:93760330744530234378820709104449859817943519087673489977918043052459134:226553827185816779193441313:278909217288194025976314186072373010546802699176:1643:88804754485449633108537119431495415909071464405048248466:706737953720123644572754467726283214257418418129976294044877092128326570250973099169:684241619212141318125341058278774876552974666371131392227941:7082041801670183315404794371423949263324115317973318438381078646033441119972916505471505171905965:087866432276999368268429551508649554464707769429193084915357259078234149123027198:72553692148393114308758724071618824067954482096459722004220652368530:02500189995056528108078977492182848405899949254733346813:7055356932864496:8914877257990029443936323869010094722923853637950277771804259525795825095496056041422291309064189810:2:052082291753106830035151490256869799561068816483440:199884950186833751155887903319664919761957095280019287615747156930902327845611633994274092:544476311065283:58497084746310122072858684440878579840085893240888409681112624990466302035:967315314199568311535015508390399560555390282752816898390878882764815344976495501675207751914077:7321129340198098/bCHn9zIbB.4OJdnX/RgQIoMvUiOXNHwOpI8RIduLB4jMm5l_.xZBEyINNzBVt3SiNV?vCVDEeS5TZES_4if5a",
    description: "{'zh-CN':'Chinese','en-US':'English'}",
    releaseCodeBundleToken: "releaseCodeBundleToken_example",
    sourceCodeBundleToken: "sourceCodeBundleToken_example",
    secretKey: "secretKey_example",
    packageId: "wpkAAA",
    version: "1.0.0",
    spaceId: "spcyQkKp9XJEl",
    name: "{'zh-CN':'Chinese','en-US':'English'}",
    releaseNote: "releaseNote_example",
    sandbox: true,
    installEnv: [
      "dashboard",
    ],
    runtimeEnv: [
      "mobile",
    ],
  },
  // string | developer token
  authorization: "Bearer uskaoeiu",
};

apiInstance.releaseWidgetV2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetPackageReleaseV2Ro** | **WidgetPackageReleaseV2Ro**|  |
 **authorization** | [**string**] | developer token | defaults to undefined


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **rollbackWidget**
> ResponseDataVoid rollbackWidget(widgetPackageRollbackRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKPackageApiApi(configuration);

let body:.WidgetSDKPackageApiApiRollbackWidgetRequest = {
  // WidgetPackageRollbackRo
  widgetPackageRollbackRo: {
    packageId: "wpkAAA",
    version: "1.0.0",
  },
  // string | developer token
  authorization: "Bearer uskaoeiu",
};

apiInstance.rollbackWidget(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetPackageRollbackRo** | **WidgetPackageRollbackRo**|  |
 **authorization** | [**string**] | developer token | defaults to undefined


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **submitWidgetV2**
> ResponseDataVoid submitWidgetV2(widgetPackageSubmitV2Ro, )

widget-cli submit widget

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKPackageApiApi(configuration);

let body:.WidgetSDKPackageApiApiSubmitWidgetV2Request = {
  // WidgetPackageSubmitV2Ro
  widgetPackageSubmitV2Ro: {
    iconToken: "iconToken_example",
    coverToken: "coverToken_example",
    authorName: "authorName_example",
    authorIconToken: "authorIconToken_example",
    authorEmail: "authorEmail_example",
    authorLink: "http://MDTMv2D2ylmgd10Z3UB6UkJSISSB512iz2DiJykO4IVP7YNsKQHh9BsaMPOiOuo3_QLOpkB.KIPOf2Flbsh1TpRS00PDvgoKGNXgxLHoPJE._eVrdJNcY9CLxYxBbcfSJXXZGSCF7dC-lSY-7ZlQJLW1_GNchKk5EBLDz1ctzsIY4oI.cl12VtuaSfjvmymTJfYkic17VJpcq1X6tjkH36lFYtIUw23vATP5cgpgctxW3q4fsZS5Uz-fvg2bA4.I-r1orbd3s4Kdu4Q19mfvL0A7Rpn3Av26g7OJWsQ0WBkWv3CuuRrMkJf5gzLvv2wY.NPqhvoybcy8QU.0_1u6BhIo-27B5JIFoxlv9-BJxhRRelW6lINX6.1Elv8Z4qYvYNwb3t4awGG-6yh0-gMEzQ8uhi90kNEaHx.5LWBoOt62fDnfouEM59JJWYHa1Ya1DpwFCTpIA0Gnqa9PQ0lvjCR3UYpt1vrS1p.R1OzxrQfgrgcyvfHmHL7bSaRv9kZ_K.NGkIi19s7KrTBx8qCkWG3nkJgXYUf-2g1bLoF4Q2SDvsQvki_Gv.3xSglBiD_kTqWft7LgtQq8DkTxH9-GEgnhdskTUa-JGB99tBTH1m8LyVjqKCRWp6XS1rwkzrnn.h0XoK7cYVKPWx4kXAhG_GEdV9fi1LUY2eBXIK-aaNx-IAoUxtYKQpsS2HM0cvxv.88aJmQRbOi5pM9K4SWNKj0UeVyhnBjVWguY2vNQIw3D_aRMF2Tm7SelZBdyPOLRs2IImu0zJ-sEvqrLoPmgi.JrQNmT_4QLVs0oSHjB6pC-1mwGXNIZ-mK8w9K1xfp9OikxJ6eiOUAchnVGrwqvIGWHJ7Z1.eTeQr7h2GhDiufc8pTDOUcgYQwyEct13aGy9ShDDH49uy_cuS1qDT5br69Zb9J7ztaciXoL3UMxQsS4RhgPVNkMuBNIrWv_v.6kENTnbd0jYevK4Igno2LdfSDI1Cs6huybGb1zEpVJcz_sYPOWoI5540Y2OLcYufJVmh2PNuin04QumvvjetJ2wYXn.2W6zwIrDKlbs9CPExuzXJjOmov9hu5QjJ_xMDMiy-rwLYYugfVA0tbOL0.zdgU9sGpVxk.V0XsgBCaMb6w.WmQk2AHCmB9lVwewmjj04um-gQsMcYoZx6RzkDL1MAzcQRnYq9jshsHLjup_Xq1.S5JIFlA8s7VLbfJ8CdU1--K_bbEzgXW.tGc11HJjfPh9aPBMPn9vOOHdKkQ6_InnGXC1663IOeomDvz9sa4XpvFxFUjA2Vr.PYqBpPgKYJXJXx50oGq47BDC1bkGeAny7jvr.nVoFMKNnHvQ4AYmlmF-v4iCmrtetgOVivKk30FKcbp2YLd7pV.yS_oco2NX0KaIUr6IkqdrU12DLntCJlzZRgbiwPbeBEaozEh0SiWTzo35ic3_fxCN.JH7Ifx4drCfHNmicDnRnqH2lvbFg3LEqe7XaJ9kbxYSX1C_Lr7dDE3pdI47Y5OdDPkSvjK_RoQMDG8YTqdvQky1k.bXOyxDLVceMTPn2f1D8joDAWMEOKR7TA5Mr5sJj8HnYiNQw3dMfL85GQOI.PdtmSOAEKxeS.nf5zlDYDcZtAn2y3pBKKrVM3EsaoUBgV8gy30aITJ7uhAIMDUKTawsf6HUR.vzPAZ5l09xshFyzZ.iL2KN6CGlaHkPX2BJeFuAvdHCCkQfzG8UQdfdhrt6srAn0F.isE9LinMVcxjk_gX1iQ6En890DUqRq1QMsZdFRNoDtaPmlYuZyzIuPbP9BoKeUzcKrabe3xXH.Opr6PVcnpJXO1EjjhcsqEiC9dTSNBWTV28hLq4QrTzI9GtnaVV7h1gY.lMPOz0JlrLFiDe3KOjXDRBF9hN72JekIfNuG9Pqe8.sbStaCVPDJlO5QnMT8K8jKE9fe7M-6-c8yP711SfHIbsPGUzHQRu0X7ALLvsoFkc22LM5RF.KXIeel20-8t0dHGD.TMbINi8qq1WxwuHJ8xdW47netlfTR8n_uO18chNXvsqeiN.fhIlF4_xFhy.LI2aMQiq3xrYdwZZfj:8540924952563683359320854078659819794781411103924680743929136930965435543167614580652957431136054027:3763231602541073670910718352952:538806000508604966:457558080937212212693570119702724148127628318491556537310:860524706494479794716186434371109630204722512789789631539877185658176164516026655861206000417:791344273602411081975908504454776508852705547431834:46852464274776440429924093379933341913011038174223456661616808812692732341783395403119441980858:33860855774893769673801641334118116539205260279829:8079427282586146072038891330853121:3708039327300270224:330060131683699021734864618825496589250642444961192316997606697985903758440:6559432430231825331283331747113750504035:988811557572531590733576606974552415483899080412865191574657472504943862274358527:41401173919503766367423089674052878573298329827809927752545337671005390384191438526666080939090:0:10180338444873049065530898710911390079413719830:4713864792761764611807161543201777:5283737935993870760273143669309719968:7188704787526641600445292186:348520389287423567254074346175217622561451079129084002053973922446460250491608480:0231809141267960895199462641905482830637608:4960967606130933215691217:1:343668773775818452290466735608:762898531697761054983873087322770990879462345043957102276017229125982475171619800410570471:69263769658000:210077:903211439:474037664274918513870201369204845350097736465527250728319002896678:485096158329122577030795172540603354:061430729987039394399818446008603387:289718599814379453609220038153782182245281032099572164033721581224672323981202:69213402722910169804822420720825204365554026815623526817:9415529694367659402385962212891:93760330744530234378820709104449859817943519087673489977918043052459134:226553827185816779193441313:278909217288194025976314186072373010546802699176:1643:88804754485449633108537119431495415909071464405048248466:706737953720123644572754467726283214257418418129976294044877092128326570250973099169:684241619212141318125341058278774876552974666371131392227941:7082041801670183315404794371423949263324115317973318438381078646033441119972916505471505171905965:087866432276999368268429551508649554464707769429193084915357259078234149123027198:72553692148393114308758724071618824067954482096459722004220652368530:02500189995056528108078977492182848405899949254733346813:7055356932864496:8914877257990029443936323869010094722923853637950277771804259525795825095496056041422291309064189810:2:052082291753106830035151490256869799561068816483440:199884950186833751155887903319664919761957095280019287615747156930902327845611633994274092:544476311065283:58497084746310122072858684440878579840085893240888409681112624990466302035:967315314199568311535015508390399560555390282752816898390878882764815344976495501675207751914077:7321129340198098/bCHn9zIbB.4OJdnX/RgQIoMvUiOXNHwOpI8RIduLB4jMm5l_.xZBEyINNzBVt3SiNV?vCVDEeS5TZES_4if5a",
    description: "{'zh-CN':'Chinese','en-US':'English'}",
    releaseCodeBundleToken: "releaseCodeBundleToken_example",
    sourceCodeBundleToken: "sourceCodeBundleToken_example",
    secretKey: "secretKey_example",
    packageId: "wpkAAA",
    version: "1.0.0",
    website: "http://MDTMv2D2ylmgd10Z3UB6UkJSISSB512iz2DiJykO4IVP7YNsKQHh9BsaMPOiOuo3_QLOpkB.KIPOf2Flbsh1TpRS00PDvgoKGNXgxLHoPJE._eVrdJNcY9CLxYxBbcfSJXXZGSCF7dC-lSY-7ZlQJLW1_GNchKk5EBLDz1ctzsIY4oI.cl12VtuaSfjvmymTJfYkic17VJpcq1X6tjkH36lFYtIUw23vATP5cgpgctxW3q4fsZS5Uz-fvg2bA4.I-r1orbd3s4Kdu4Q19mfvL0A7Rpn3Av26g7OJWsQ0WBkWv3CuuRrMkJf5gzLvv2wY.NPqhvoybcy8QU.0_1u6BhIo-27B5JIFoxlv9-BJxhRRelW6lINX6.1Elv8Z4qYvYNwb3t4awGG-6yh0-gMEzQ8uhi90kNEaHx.5LWBoOt62fDnfouEM59JJWYHa1Ya1DpwFCTpIA0Gnqa9PQ0lvjCR3UYpt1vrS1p.R1OzxrQfgrgcyvfHmHL7bSaRv9kZ_K.NGkIi19s7KrTBx8qCkWG3nkJgXYUf-2g1bLoF4Q2SDvsQvki_Gv.3xSglBiD_kTqWft7LgtQq8DkTxH9-GEgnhdskTUa-JGB99tBTH1m8LyVjqKCRWp6XS1rwkzrnn.h0XoK7cYVKPWx4kXAhG_GEdV9fi1LUY2eBXIK-aaNx-IAoUxtYKQpsS2HM0cvxv.88aJmQRbOi5pM9K4SWNKj0UeVyhnBjVWguY2vNQIw3D_aRMF2Tm7SelZBdyPOLRs2IImu0zJ-sEvqrLoPmgi.JrQNmT_4QLVs0oSHjB6pC-1mwGXNIZ-mK8w9K1xfp9OikxJ6eiOUAchnVGrwqvIGWHJ7Z1.eTeQr7h2GhDiufc8pTDOUcgYQwyEct13aGy9ShDDH49uy_cuS1qDT5br69Zb9J7ztaciXoL3UMxQsS4RhgPVNkMuBNIrWv_v.6kENTnbd0jYevK4Igno2LdfSDI1Cs6huybGb1zEpVJcz_sYPOWoI5540Y2OLcYufJVmh2PNuin04QumvvjetJ2wYXn.2W6zwIrDKlbs9CPExuzXJjOmov9hu5QjJ_xMDMiy-rwLYYugfVA0tbOL0.zdgU9sGpVxk.V0XsgBCaMb6w.WmQk2AHCmB9lVwewmjj04um-gQsMcYoZx6RzkDL1MAzcQRnYq9jshsHLjup_Xq1.S5JIFlA8s7VLbfJ8CdU1--K_bbEzgXW.tGc11HJjfPh9aPBMPn9vOOHdKkQ6_InnGXC1663IOeomDvz9sa4XpvFxFUjA2Vr.PYqBpPgKYJXJXx50oGq47BDC1bkGeAny7jvr.nVoFMKNnHvQ4AYmlmF-v4iCmrtetgOVivKk30FKcbp2YLd7pV.yS_oco2NX0KaIUr6IkqdrU12DLntCJlzZRgbiwPbeBEaozEh0SiWTzo35ic3_fxCN.JH7Ifx4drCfHNmicDnRnqH2lvbFg3LEqe7XaJ9kbxYSX1C_Lr7dDE3pdI47Y5OdDPkSvjK_RoQMDG8YTqdvQky1k.bXOyxDLVceMTPn2f1D8joDAWMEOKR7TA5Mr5sJj8HnYiNQw3dMfL85GQOI.PdtmSOAEKxeS.nf5zlDYDcZtAn2y3pBKKrVM3EsaoUBgV8gy30aITJ7uhAIMDUKTawsf6HUR.vzPAZ5l09xshFyzZ.iL2KN6CGlaHkPX2BJeFuAvdHCCkQfzG8UQdfdhrt6srAn0F.isE9LinMVcxjk_gX1iQ6En890DUqRq1QMsZdFRNoDtaPmlYuZyzIuPbP9BoKeUzcKrabe3xXH.Opr6PVcnpJXO1EjjhcsqEiC9dTSNBWTV28hLq4QrTzI9GtnaVV7h1gY.lMPOz0JlrLFiDe3KOjXDRBF9hN72JekIfNuG9Pqe8.sbStaCVPDJlO5QnMT8K8jKE9fe7M-6-c8yP711SfHIbsPGUzHQRu0X7ALLvsoFkc22LM5RF.KXIeel20-8t0dHGD.TMbINi8qq1WxwuHJ8xdW47netlfTR8n_uO18chNXvsqeiN.fhIlF4_xFhy.LI2aMQiq3xrYdwZZfj:8540924952563683359320854078659819794781411103924680743929136930965435543167614580652957431136054027:3763231602541073670910718352952:538806000508604966:457558080937212212693570119702724148127628318491556537310:860524706494479794716186434371109630204722512789789631539877185658176164516026655861206000417:791344273602411081975908504454776508852705547431834:46852464274776440429924093379933341913011038174223456661616808812692732341783395403119441980858:33860855774893769673801641334118116539205260279829:8079427282586146072038891330853121:3708039327300270224:330060131683699021734864618825496589250642444961192316997606697985903758440:6559432430231825331283331747113750504035:988811557572531590733576606974552415483899080412865191574657472504943862274358527:41401173919503766367423089674052878573298329827809927752545337671005390384191438526666080939090:0:10180338444873049065530898710911390079413719830:4713864792761764611807161543201777:5283737935993870760273143669309719968:7188704787526641600445292186:348520389287423567254074346175217622561451079129084002053973922446460250491608480:0231809141267960895199462641905482830637608:4960967606130933215691217:1:343668773775818452290466735608:762898531697761054983873087322770990879462345043957102276017229125982475171619800410570471:69263769658000:210077:903211439:474037664274918513870201369204845350097736465527250728319002896678:485096158329122577030795172540603354:061430729987039394399818446008603387:289718599814379453609220038153782182245281032099572164033721581224672323981202:69213402722910169804822420720825204365554026815623526817:9415529694367659402385962212891:93760330744530234378820709104449859817943519087673489977918043052459134:226553827185816779193441313:278909217288194025976314186072373010546802699176:1643:88804754485449633108537119431495415909071464405048248466:706737953720123644572754467726283214257418418129976294044877092128326570250973099169:684241619212141318125341058278774876552974666371131392227941:7082041801670183315404794371423949263324115317973318438381078646033441119972916505471505171905965:087866432276999368268429551508649554464707769429193084915357259078234149123027198:72553692148393114308758724071618824067954482096459722004220652368530:02500189995056528108078977492182848405899949254733346813:7055356932864496:8914877257990029443936323869010094722923853637950277771804259525795825095496056041422291309064189810:2:052082291753106830035151490256869799561068816483440:199884950186833751155887903319664919761957095280019287615747156930902327845611633994274092:544476311065283:58497084746310122072858684440878579840085893240888409681112624990466302035:967315314199568311535015508390399560555390282752816898390878882764815344976495501675207751914077:7321129340198098/bCHn9zIbB.4OJdnX/RgQIoMvUiOXNHwOpI8RIduLB4jMm5l_.xZBEyINNzBVt3SiNV?vCVDEeS5TZES_4if5a",
    name: "{'zh-CN':'Chinese','en-US':'English'}",
    releaseNote: "releaseNote_example",
    sandbox: true,
    installEnv: [
      "dashboard",
    ],
    runtimeEnv: [
      "mobile",
    ],
  },
  // string | developer token
  authorization: "Bearer uskaoeiu",
  // string | developer\'s language (optional)
  acceptLanguage: "「en-US/zh-CN」",
};

apiInstance.submitWidgetV2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetPackageSubmitV2Ro** | **WidgetPackageSubmitV2Ro**|  |
 **authorization** | [**string**] | developer token | defaults to undefined
 **acceptLanguage** | [**string**] | developer\&#39;s language | (optional) defaults to undefined


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **transferWidgetOwner**
> ResponseDataVoid transferWidgetOwner(widgetTransferOwnerRo, )

widget-cli transfer widget owner

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKPackageApiApi(configuration);

let body:.WidgetSDKPackageApiApiTransferWidgetOwnerRequest = {
  // WidgetTransferOwnerRo
  widgetTransferOwnerRo: {
    packageId: "packageId_example",
    transferMemberId: 1,
  },
  // string | developer token
  authorization: "Bearer uskaoeiu",
  // string | developer\'s language (optional)
  acceptLanguage: "「en-US/zh-CN」",
};

apiInstance.transferWidgetOwner(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetTransferOwnerRo** | **WidgetTransferOwnerRo**|  |
 **authorization** | [**string**] | developer token | defaults to undefined
 **acceptLanguage** | [**string**] | developer\&#39;s language | (optional) defaults to undefined


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **unpublishWidget**
> ResponseDataVoid unpublishWidget(widgetPackageUnpublishRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKPackageApiApi(configuration);

let body:.WidgetSDKPackageApiApiUnpublishWidgetRequest = {
  // WidgetPackageUnpublishRo
  widgetPackageUnpublishRo: {
    packageId: "wpkAAA",
  },
  // string | developer token
  authorization: "Bearer uskaoeiu",
};

apiInstance.unpublishWidget(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetPackageUnpublishRo** | **WidgetPackageUnpublishRo**|  |
 **authorization** | [**string**] | developer token | defaults to undefined


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **widgetAuth**
> ResponseDataVoid widgetAuth(widgetPackageAuthRo, )

widget-cli widget development authentication verification

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetSDKPackageApiApi(configuration);

let body:.WidgetSDKPackageApiApiWidgetAuthRequest = {
  // WidgetPackageAuthRo
  widgetPackageAuthRo: {
    packageId: "wpkBBB",
  },
  // string | developer token
  authorization: "Bearer uskaoeiu",
};

apiInstance.widgetAuth(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetPackageAuthRo** | **WidgetPackageAuthRo**|  |
 **authorization** | [**string**] | developer token | defaults to undefined


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


