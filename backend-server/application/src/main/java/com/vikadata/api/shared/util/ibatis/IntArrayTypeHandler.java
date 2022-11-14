package com.vikadata.api.shared.util.ibatis;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

/**
 * <p>
 * Array of int type used to store mysql
 * </p>
 *
 * @author Benson Cheung
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
