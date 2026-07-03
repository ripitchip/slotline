import assert from "assert";
import { getHttpResponseErrorMessage } from "./server";

assert.strictEqual(
  getHttpResponseErrorMessage(
    { data: { message: "Authentication required" }, statusCode: 401 },
    "Poll creation failed"
  ),
  "Authentication required"
);

assert.strictEqual(
  getHttpResponseErrorMessage(
    { data: {}, statusCode: 400 },
    "Poll creation failed"
  ),
  "Poll creation failed"
);
