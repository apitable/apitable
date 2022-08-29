package com.vikadata.api.handler.mybatis;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * <p>
 * 用以将mysql存储的int类型数组，转换为数组的自定义转换器，转换为int[]的类型数据
 * 注意：mysql存储的int类型数组数据去除[]，示例数据：1，2，3，4
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/11/13 11:02
 */
public class IntArrayTypeHandler extends BaseTypeHandler<int[]> {

	@Override
	public void setNonNullParameter(PreparedStatement ps, int i, int[] parameter, JdbcType jdbcType) throws SQLException {
		List<String> list = new ArrayList<>();
		for (int item : parameter) {
			list.add(String.valueOf(item));
		}
		ps.setString(i, String.join(",", list));
	}

	@Override
	public int[] getNullableResult(ResultSet rs, String columnName) throws SQLException {
		String str = rs.getString(columnName);
		if (rs.wasNull()) {
			return null;
		}

		return Arrays.stream(str.split(",")).mapToInt(Integer::valueOf).toArray();
	}

	@Override
	public int[] getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
		String str = rs.getString(columnIndex);
		if (rs.wasNull()) {
			return null;
		}

		return Arrays.stream(str.split(",")).mapToInt(Integer::valueOf).toArray();
	}

	@Override
	public int[] getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
		String str = cs.getString(columnIndex);
		if (cs.wasNull()) {
			return null;
		}

		return Arrays.stream(str.split(",")).mapToInt(Integer::valueOf).toArray();
	}
}
