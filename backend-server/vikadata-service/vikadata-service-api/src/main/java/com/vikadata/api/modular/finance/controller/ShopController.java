package com.vikadata.api.modular.finance.controller;

import java.util.List;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.modular.finance.model.ProductPriceVo;
import com.vikadata.api.modular.finance.service.IShopService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 商店相关接口
 * @author Shawn Deng
 * @date 2022-05-13 22:18:32
 */
@RestController
@Api(tags = "商店模块相关接口")
@ApiResource(path = "/shop")
@Slf4j
public class ShopController {

    @Resource
    private IShopService iShopService;

    @GetResource(path = "/prices", requiredPermission = false)
    @ApiOperation(value = "获取产品的价目表", notes = "自营产品价目表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "product", value = "product name", required = true, dataTypeClass = String.class, paramType = "query", example = "SILVER"),
    })
    public ResponseData<List<ProductPriceVo>> getPrices(@RequestParam("product") String productName) {
        List<ProductPriceVo> prices = iShopService.getPricesByProduct(productName);
        return ResponseData.success(prices);
    }
}
