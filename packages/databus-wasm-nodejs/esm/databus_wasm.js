import * as wasm from "./databus_wasm_bg.wasm";
import { __wbg_set_wasm } from "./databus_wasm_bg.js";
__wbg_set_wasm(wasm);
export * from "./databus_wasm_bg.js";
