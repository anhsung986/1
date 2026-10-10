// Hash helper for integrity / non-password uses. Firebase Auth must handle account passwords.
export async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2,"0")).join("");
}
const toB64 = b => btoa(String.fromCharCode(...new Uint8Array(b)));
const fromB64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
export async function generateVaultKey(passphrase, saltB64) {
  const salt = saltB64 ? fromB64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:250000,hash:"SHA-256"},material,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
  return {key, salt:toB64(salt)};
}
export async function encryptText(text, passphrase, saltB64) {
  const {key,salt} = await generateVaultKey(passphrase,saltB64);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({name:"AES-GCM",iv},key,new TextEncoder().encode(text));
  return {v:1,salt,iv:toB64(iv),data:toB64(encrypted)};
}
export async function decryptText(payload, passphrase) {
  const {key} = await generateVaultKey(passphrase,payload.salt);
  const plain = await crypto.subtle.decrypt({name:"AES-GCM",iv:fromB64(payload.iv)},key,fromB64(payload.data));
  return new TextDecoder().decode(plain);
}
