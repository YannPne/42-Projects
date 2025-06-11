import base32 from "hi-base32";

function numberToBytes(num: number) {
  let bytes = new Array(8);
  for (let i = 7; i >= 0; i--) {
    bytes[i] = num & 0xff;
    num >>= 8;
  }
  return new Uint8Array(bytes);
}

async function hmacSha1(key: Uint8Array, data: Uint8Array) {
  const keyObj = await crypto.subtle.importKey("raw", key,
    { name: "HMAC", hash: { name: "SHA-1" } },
    false, [ "sign" ]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", keyObj, data));
}

export async function getTotpCode(secret: string, timeStep: number = 30, digits: number = 6) {
  const hmac = await hmacSha1(
    new TextEncoder().encode(base32.decode(secret)),
    numberToBytes(Math.floor(Date.now() / 1000 / timeStep)));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (hmac[offset] & 0x7f) << 24 |
    (hmac[offset + 1] & 0xff) << 16 |
    (hmac[offset + 2] & 0xff) << 8 |
    (hmac[offset + 3] & 0xff);
  return (code % Math.pow(10, digits)).toString().padStart(digits, "0");
}

export function generateRandomSecret() {
  return base32.encode(new TextDecoder().decode(crypto.getRandomValues(new Uint8Array(20))));
}