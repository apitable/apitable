/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.workspace.listener;

import cn.hutool.core.util.StrUtil;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.excel.metadata.data.ReadCellData;
import com.apitable.shared.util.CollectionUtil;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;


/**
 * <p>
 * Excel worksheet data listener(can't be handed over to spring container management).
 * </p>
 */
@Slf4j
@Setter
@Getter
public class ExcelSheetsDataListener extends AnalysisEventListener<Map<Integer, String>> {

    /**
     * Excel worksheet header.
     */
    private List<Object> sheetHeader;

    /**
     * Excel worksheet data.
     */
    private List<List<Object>> sheetData;

    public ExcelSheetsDataListener() {
        this.sheetHeader = new ArrayList<>();
        this.sheetData = new ArrayList<>();
    }

    /**
     * analyzing excel worksheet data line by line.
     */
    @Override
    public void invoke(Map<Integer, String> data, AnalysisContext context) {
        if (Objects.isNull(data) || data.isEmpty()) {
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
        // filter excel blank lines
        if (isBlankRow(tempSheetData)) {
            return;
        }
        // Import data with empty header and remove the empty column in front of it.
        if (CollectionUtil.isEmpty(sheetHeader)) {
            sheetData.add(removeBlankColumns(tempSheetData));
        } else {
            sheetData.add(tempSheetData);
        }
    }

    /**
     * operations after all excel data rows are parsed.
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        log.info("finish to parse {}...", context.readSheetHolder().getSheetName());
    }

    /**
     * Parses the header information of each worksheet, and each worksheet is executed only once.
     */
    @Override
    public void invokeHead(Map<Integer, ReadCellData<?>> headMap, AnalysisContext context) {
        if (Objects.isNull(headMap) || headMap.isEmpty()) {
            return;
        }
        Integer[] headerKeyArr = headMap.keySet().toArray(new Integer[0]);
        int sum = headerKeyArr[headerKeyArr.length - 1] + 1;
        if (sum == headMap.size()) {
            // The cell type that is assigned first and then cleared is EMPTY, which is directly judged according to the cell type.
            headMap.forEach((index, cellData) -> {
                if (CellDataTypeEnum.EMPTY.equals(cellData.getType())) {
                    cellData.setColumnIndex(index + 1);
                    sheetHeader.add(String.format("the %s col", cellData.getColumnIndex()));
                }
                if (CellDataTypeEnum.STRING.equals(cellData.getType())) {
                    sheetHeader.add(cellData.getStringValue());
                }
                if (CellDataTypeEnum.NUMBER.equals(cellData.getType())) {
                    sheetHeader.add(cellData.getNumberValue());
                }
            });
        } else {
            // Cells that never assign data ignore empty cells and generate headers according to the length of the last index value
            Object[] tmpHeaderArr = new Object[sum];
            int i = 0;
            // Write non-empty header data into tmpHeaderArr according to index value
            while (i < headerKeyArr.length) {
                int index = headerKeyArr[i];
                ReadCellData<?> readCellData = headMap.get(index);
                tmpHeaderArr[index] = readCellData.getStringValue();
                i++;
            }
            // generate a cell data for all empty elements
            for (int j = 0; j < tmpHeaderArr.length; j++) {
                if (Objects.isNull(tmpHeaderArr[j])) {
                    tmpHeaderArr[j] = String.format("the %s col", j + 1);
                }
            }
            sheetHeader.addAll(Arrays.asList(tmpHeaderArr));
        }
    }

    private boolean isBlankRow(List<Object> list) {
        if (CollectionUtil.isEmpty(list)) {
            return true;
        }
        int count = 0;
        for (Object data : list) {
            count = Objects.equals(data, "")
                ? count + 1 : 0;
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
