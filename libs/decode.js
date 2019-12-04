/**
 * Created by panzhichao on 16/8/18.
 */
"use strict";
const decoder = require("hessian.js").DecoderV2;
const { Response } = require("./constants");
const RpcException = require("./errors");

const RESPONSE_WITH_EXCEPTION = 0;
const RESPONSE_VALUE = 1;
const RESPONSE_NULL_VALUE = 2;

function decode(heap, cb) {
  const result = new decoder(heap.slice(16, heap.length));
  if (heap[3] !== Response.OK) {
    return cb(new RpcException(result.readString()));
  }
  try {
    const flag = result.readInt();
    switch (flag) {
      case RESPONSE_NULL_VALUE:
        cb(null, null);
        break;
      case RESPONSE_VALUE:
        cb(null, result.read());
        break;
      case RESPONSE_WITH_EXCEPTION:
        const excep = result.read();
        // console.log(excep instanceof Error);
        // !(excep instanceof Error) && (excep = new RpcException(result.readString()));
        cb(new RpcException(excep));
        break;
      default:
        cb(new Error(`Unknown result flag, expect '0' '1' '2', get ${flag}`));
    }
  } catch (err) {
    cb(err);
  }
}

module.exports = decode;
