import argon2 from "argon2";

export async function hash(password: string): Promise<string> {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
}

export async function verify(
  hashedPassword: string,
  plaintextPassword: string
): Promise<boolean> {
  return argon2.verify(hashedPassword, plaintextPassword);
}
