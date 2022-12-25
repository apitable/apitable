/**
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

/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "google.protobuf";

/**
 * `NullValue` is a singleton enumeration to represent the null value for the
 * `Value` type union.
 *
 *  The JSON representation for `NullValue` is JSON `null`.
 */
export enum NullValue {
  /** NULL_VALUE - Null value. */
  NULL_VALUE = 0,
  UNRECOGNIZED = -1,
}

export function nullValueFromJSON(object: any): NullValue {
  switch (object) {
    case 0:
    case "NULL_VALUE":
      return NullValue.NULL_VALUE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return NullValue.UNRECOGNIZED;
  }
}

export function nullValueToJSON(object: NullValue): string {
  switch (object) {
    case NullValue.NULL_VALUE:
      return "NULL_VALUE";
    case NullValue.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * `Struct` represents a structured data value, consisting of fields
 * which map to dynamically typed values. In some languages, `Struct`
 * might be supported by a native representation. For example, in
 * scripting languages like JS a struct is represented as an
 * object. The details of that representation are described together
 * with the proto support for the language.
 *
 * The JSON representation for `Struct` is JSON object.
 */
export interface Struct {
  /** Unordered map of dynamically typed values. */
  fields: { [key: string]: any | undefined };
}

export interface Struct_FieldsEntry {
  key: string;
  value: any | undefined;
}

/**
 * `Value` represents a dynamically typed value which can be either
 * null, a number, a string, a boolean, a recursive struct value, or a
 * list of values. A producer of value is expected to set one of that
 * variants, absence of any variant indicates an error.
 *
 * The JSON representation for `Value` is JSON value.
 */
export interface Value {
  /** Represents a null value. */
  nullValue?:
    | NullValue
    | undefined;
  /** Represents a double value. */
  numberValue?:
    | number
    | undefined;
  /** Represents a string value. */
  stringValue?:
    | string
    | undefined;
  /** Represents a boolean value. */
  boolValue?:
    | boolean
    | undefined;
  /** Represents a structured value. */
  structValue?:
    | { [key: string]: any }
    | undefined;
  /** Represents a repeated `Value`. */
  listValue?: Array<any> | undefined;
}

/**
 * `ListValue` is a wrapper around a repeated field of values.
 *
 * The JSON representation for `ListValue` is JSON array.
 */
export interface ListValue {
  /** Repeated field of dynamically typed values. */
  values: any[];
}

function createBaseStruct(): Struct {
  return { fields: {} };
}

export const Struct = {
  encode(message: Struct, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.fields).forEach(([key, value]) => {
      if (value !== undefined) {
        Struct_FieldsEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
      }
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Struct {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseStruct()) as Struct;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = Struct_FieldsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.fields[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Struct {
    return {
      fields: isObject(object.fields)
        ? Object.entries(object.fields).reduce<{ [key: string]: any | undefined }>((acc, [key, value]) => {
          acc[key] = value as any | undefined;
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: Struct): unknown {
    const obj: any = {};
    obj.fields = {};
    if (message.fields) {
      Object.entries(message.fields).forEach(([k, v]) => {
        obj.fields[k] = v;
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Struct>, I>>(object: I): Struct {
    const message = Object.create(createBaseStruct()) as Struct;
    message.fields = Object.entries(object.fields ?? {}).reduce<{ [key: string]: any | undefined }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );
    return message;
  },

  wrap(object: { [key: string]: any } | undefined): Struct {
    const struct = createBaseStruct();
    if (object !== undefined) {
      Object.keys(object).forEach((key) => {
        struct.fields[key] = object[key];
      });
    }
    return struct;
  },

  unwrap(message: Struct): { [key: string]: any } {
    const object: { [key: string]: any } = {};
    Object.keys(message.fields).forEach((key) => {
      object[key] = message.fields[key];
    });
    return object;
  },
};

function createBaseStruct_FieldsEntry(): Struct_FieldsEntry {
  return { key: "", value: undefined };
}

export const Struct_FieldsEntry = {
  encode(message: Struct_FieldsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Value.encode(Value.wrap(message.value), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Struct_FieldsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseStruct_FieldsEntry()) as Struct_FieldsEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = Value.unwrap(Value.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Struct_FieldsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object?.value) ? object.value : undefined };
  },

  toJSON(message: Struct_FieldsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Struct_FieldsEntry>, I>>(object: I): Struct_FieldsEntry {
    const message = Object.create(createBaseStruct_FieldsEntry()) as Struct_FieldsEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? undefined;
    return message;
  },
};

function createBaseValue(): Value {
  return {
    nullValue: undefined,
    numberValue: undefined,
    stringValue: undefined,
    boolValue: undefined,
    structValue: undefined,
    listValue: undefined,
  };
}

export const Value = {
  encode(message: Value, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nullValue !== undefined) {
      writer.uint32(8).int32(message.nullValue);
    }
    if (message.numberValue !== undefined) {
      writer.uint32(17).double(message.numberValue);
    }
    if (message.stringValue !== undefined) {
      writer.uint32(26).string(message.stringValue);
    }
    if (message.boolValue !== undefined) {
      writer.uint32(32).bool(message.boolValue);
    }
    if (message.structValue !== undefined) {
      Struct.encode(Struct.wrap(message.structValue), writer.uint32(42).fork()).ldelim();
    }
    if (message.listValue !== undefined) {
      ListValue.encode(ListValue.wrap(message.listValue), writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Value {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseValue()) as Value;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nullValue = reader.int32() as any;
          break;
        case 2:
          message.numberValue = reader.double();
          break;
        case 3:
          message.stringValue = reader.string();
          break;
        case 4:
          message.boolValue = reader.bool();
          break;
        case 5:
          message.structValue = Struct.unwrap(Struct.decode(reader, reader.uint32()));
          break;
        case 6:
          message.listValue = ListValue.unwrap(ListValue.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Value {
    return {
      nullValue: isSet(object.nullValue) ? nullValueFromJSON(object.nullValue) : undefined,
      numberValue: isSet(object.numberValue) ? Number(object.numberValue) : undefined,
      stringValue: isSet(object.stringValue) ? String(object.stringValue) : undefined,
      boolValue: isSet(object.boolValue) ? Boolean(object.boolValue) : undefined,
      structValue: isObject(object.structValue) ? object.structValue : undefined,
      listValue: Array.isArray(object.listValue) ? [...object.listValue] : undefined,
    };
  },

  toJSON(message: Value): unknown {
    const obj: any = {};
    message.nullValue !== undefined &&
      (obj.nullValue = message.nullValue !== undefined ? nullValueToJSON(message.nullValue) : undefined);
    message.numberValue !== undefined && (obj.numberValue = message.numberValue);
    message.stringValue !== undefined && (obj.stringValue = message.stringValue);
    message.boolValue !== undefined && (obj.boolValue = message.boolValue);
    message.structValue !== undefined && (obj.structValue = message.structValue);
    message.listValue !== undefined && (obj.listValue = message.listValue);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Value>, I>>(object: I): Value {
    const message = Object.create(createBaseValue()) as Value;
    message.nullValue = object.nullValue ?? undefined;
    message.numberValue = object.numberValue ?? undefined;
    message.stringValue = object.stringValue ?? undefined;
    message.boolValue = object.boolValue ?? undefined;
    message.structValue = object.structValue ?? undefined;
    message.listValue = object.listValue ?? undefined;
    return message;
  },

  wrap(value: any): Value {
    const result = createBaseValue();

    if (value === null) {
      result.nullValue = NullValue.NULL_VALUE;
    } else if (typeof value === "boolean") {
      result.boolValue = value;
    } else if (typeof value === "number") {
      result.numberValue = value;
    } else if (typeof value === "string") {
      result.stringValue = value;
    } else if (Array.isArray(value)) {
      result.listValue = value;
    } else if (typeof value === "object") {
      result.structValue = value;
    } else if (typeof value !== "undefined") {
      throw new Error("Unsupported any value type: " + typeof value);
    }

    return result;
  },

  unwrap(message: Value): string | number | boolean | Object | null | Array<any> | undefined {
    if (message?.stringValue !== undefined) {
      return message.stringValue;
    } else if (message?.numberValue !== undefined) {
      return message.numberValue;
    } else if (message?.boolValue !== undefined) {
      return message.boolValue;
    } else if (message?.structValue !== undefined) {
      return message.structValue;
    } else if (message?.listValue !== undefined) {
      return message.listValue;
    } else if (message?.nullValue !== undefined) {
      return null;
    }
    return undefined;
  },
};

function createBaseListValue(): ListValue {
  return { values: [] };
}

export const ListValue = {
  encode(message: ListValue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.values) {
      Value.encode(Value.wrap(v!), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListValue {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseListValue()) as ListValue;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.values.push(Value.unwrap(Value.decode(reader, reader.uint32())));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListValue {
    return { values: Array.isArray(object?.values) ? [...object.values] : [] };
  },

  toJSON(message: ListValue): unknown {
    const obj: any = {};
    if (message.values) {
      obj.values = message.values.map((e) => e);
    } else {
      obj.values = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListValue>, I>>(object: I): ListValue {
    const message = Object.create(createBaseListValue()) as ListValue;
    message.values = object.values?.map((e) => e) || [];
    return message;
  },

  wrap(value: Array<any> | undefined): ListValue {
    const result = createBaseListValue();

    result.values = value ?? [];

    return result;
  },

  unwrap(message: ListValue): Array<any> {
    return message.values;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
