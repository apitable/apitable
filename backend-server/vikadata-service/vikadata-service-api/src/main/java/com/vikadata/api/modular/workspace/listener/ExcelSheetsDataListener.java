package com.vikadata.api.modular.workspace.listener;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import cn.hutool.core.util.StrUtil;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.excel.metadata.data.ReadCellData;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;

import com.vikadata.api.util.CollectionUtil;

/**
 * <p>
 * Excel工作表数据监听器（不能交给spring容器管理）
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/11/16 16:45:59
 */
@Slf4j
@Setter
@Getter
public class ExcelSheetsDataListener extends AnalysisEventListener<Map<Integer, String>> {
    /**
     * Excel工作表表头
     * */
    private List<Object> sheetHeader;

    /**
     * Excel工作表数据
     * */
    private List<List<Object>> sheetData;

    public ExcelSheetsDataListener() {
        this.sheetHeader = new ArrayList<>();
        this.sheetData = new ArrayList<>();
    }

    /**
     * 逐行解析Excel工作表数据
     * */
    @Override
    public void invoke(Map<Integer, String> data, AnalysisContext context) {
        if (Objects.isNull(data) || data.size() == 0) {
            return;
        }
        List<Object> tempSheetData = new ArrayList<>();
        data.forEach((index, dataValue) -> {
            if (StrUtil.isBlank(dataValue)) {
                tempSheetData.add("");
            } else {
                tempSheetData.add(dataValue);
            }
        });
        // 过滤Excel空行
        if (isBlankRow(tempSheetData)) {
            return;
        }
        // 导入表头为空的数据，去掉前面的空列
        if (CollectionUtil.isEmpty(sheetHeader)) {
            sheetData.add(removeBlankColumns(tempSheetData));
        } else {
            sheetData.add(tempSheetData);
        }
    }

    /**
     * 所有Excel数据行解析完成后的操作
     * */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        log.info("解析{}完成...", context.readSheetHolder().getSheetName());
    }

    /**
     * 解析每个工作表的表头信息，每个工作表只执行一次
     * */
    @Override
    public void invokeHead(Map<Integer, ReadCellData<?>> headMap, AnalysisContext context) {
        if (Objects.isNull(headMap) || headMap.size() == 0) {
            return;
        }
        Integer[] headerKeyArr = headMap.keySet().toArray(new Integer[0]);
        int sum = headerKeyArr[headerKeyArr.length - 1] + 1;
        if (sum == headMap.size()) {
            // 先赋值后清空数据的单元格类型为EMPTY，直接根据单元格类型判断
            headMap.forEach((index, cellData) -> {
                if (CellDataTypeEnum.EMPTY.equals(cellData.getType())) {
                    cellData.setColumnIndex(index + 1);
                    sheetHeader.add(String.format("第%s列", cellData.getColumnIndex()));
                }
                if (CellDataTypeEnum.STRING.equals(cellData.getType())) {
                    sheetHeader.add(cellData.getStringValue());
                }
                if (CellDataTypeEnum.NUMBER.equals(cellData.getType())) {
                    sheetHeader.add(cellData.getNumberValue());
                }
            });
        } else {
            // 从未赋值数据的单元格会忽略空单元格，按照最后一个索引值的长度生成表头
            Object[] tmpHeaderArr = new Object[sum];
            int i = 0;
            // 按照索引值把不为空的表头数据写进tmpArr
            while (i < headerKeyArr.length) {
                int index = headerKeyArr[i];
                ReadCellData<?> readCellData = headMap.get(index);
                tmpHeaderArr[index] = readCellData.getStringValue();
                i++;
            }
            // 给所有为空的元素生成一个单元格数据
            for (int j = 0; j < tmpHeaderArr.length; j++) {
                if (Objects.isNull(tmpHeaderArr[j])) {
                    tmpHeaderArr[j] = String.format("第%s列", j + 1);
                }
            }
            sheetHeader.addAll(Arrays.asList(tmpHeaderArr));
        }
    }

    private boolean isBlankRow(List<Object> list) {
        if (CollectionUtils.isEmpty(list)) {
            return true;
        }
        int count = 0;
        for (Object data : list) {
            count = Objects.equals(data, "") ?
                    count + 1 : 0;
        }
        return count == list.size();
    }

    private List<Object> removeBlankColumns(List<Object> origins) {
        int splitIndex = 0;
        Object first = origins.get(0);
        if (Objects.equals(first, "")) {
            for (int i = 1; i < origins.size(); i++) {
                if (!Objects.equals(origins.get(i), "")) {
                    splitIndex = i;
                    break;
                }
            }
        }
        return origins.subList(splitIndex, origins.size());
    }
}
