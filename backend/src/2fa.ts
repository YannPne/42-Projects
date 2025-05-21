function stringToBytes(str: string) {
  let bytes = [];
  for (let i = 0; i < str.length; i++)
    bytes.push(str.charCodeAt(i));
  return new Uint8Array(bytes);
}

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
    false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", keyObj, data));
}

export async function getTotpCode(secret: string, timeStep: number = 30, digits: number = 6) {
  const hmac = await hmacSha1(
    stringToBytes(secret),
    numberToBytes(Math.floor(Date.now() / 1000 / timeStep)));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (hmac[offset] & 0x7f) << 24 |
    (hmac[offset + 1] & 0xff) << 16 |
    (hmac[offset + 2] & 0xff) << 8 |
    (hmac[offset + 3] & 0xff);
  return (code % Math.pow(10, digits)).toString().padStart(digits, "0");
}

function base32Encode(buffer: any) {
  const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let output = "";
  let bits = 0;
  let currentByte = 0;

  for (let i = 0; i < buffer.length; i++) {
    currentByte = buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += base32Alphabet[(currentByte >> (bits - 5)) & 0x1F];
      bits -= 5;
    }
    currentByte &= (1 << bits) - 1;
  }

  if (bits > 0)
    output += base32Alphabet[currentByte << (5 - bits)];

  while (output.length % 8 !== 0)
    output += "=";
  return output;
}

export function generateRandomSecret() {
  return base32Encode(crypto.getRandomValues(new Uint8Array(20)));
}