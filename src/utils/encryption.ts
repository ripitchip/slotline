import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || "";

const getEncryptionConfig = (): { key: Buffer; iv: string } => {
  if (ENCRYPTION_KEY.length !== 32) {
    throw new Error(
      "ENCRYPTION_KEY must be exactly 32 characters. Update the runtime environment and restart the app."
    );
  }

  if (ENCRYPTION_IV.length !== 16) {
    throw new Error(
      "ENCRYPTION_IV must be exactly 16 characters. Update the runtime environment and restart the app."
    );
  }

  return {
    key: Buffer.from(ENCRYPTION_KEY),
    iv: ENCRYPTION_IV,
  };
};

export const encrypt = (text: string): string => {
  const { key, iv } = getEncryptionConfig();
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};

export const decrypt = (text: string): string => {
  const { key, iv } = getEncryptionConfig();
  const encryptedText = Buffer.from(text, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
