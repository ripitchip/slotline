import assert from "assert";

const originalKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
const originalIv = process.env.NEXT_PUBLIC_ENCRYPTION_IV;

try {
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY = "";
  process.env.NEXT_PUBLIC_ENCRYPTION_IV = "1234567890123456";
  delete require.cache[require.resolve("./index")];
  const { encrypt } = require("./index");

  assert.throws(
    () => encrypt("secret"),
    /NEXT_PUBLIC_ENCRYPTION_KEY must be exactly 32 characters/
  );
} finally {
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY = originalKey;
  process.env.NEXT_PUBLIC_ENCRYPTION_IV = originalIv;
}
