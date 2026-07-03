import assert from "assert";

const originalKey = process.env.ENCRYPTION_KEY;
const originalIv = process.env.ENCRYPTION_IV;

try {
  process.env.ENCRYPTION_KEY = "";
  process.env.ENCRYPTION_IV = "1234567890123456";
  delete require.cache[require.resolve("./encryption")];
  const { encrypt } = require("./encryption");

  assert.throws(
    () => encrypt("secret"),
    /^Error: ENCRYPTION_KEY must be exactly 32 characters/
  );
} finally {
  if (originalKey === undefined) {
    delete process.env.ENCRYPTION_KEY;
  } else {
    process.env.ENCRYPTION_KEY = originalKey;
  }

  if (originalIv === undefined) {
    delete process.env.ENCRYPTION_IV;
  } else {
    process.env.ENCRYPTION_IV = originalIv;
  }
}
