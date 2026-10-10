// Ảnh & tệp: Firebase Realtime Database helpers. Uploads require Firebase Storage configuration.
import { db, auth } from "./auth.js";
import { ref, push, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
export function watchMedia(uid, callback) {
  return onValue(ref(db, "media/" + (uid || auth.currentUser?.uid || "public")), snap => callback(snap.val() || {}));
}
export async function saveMedia(data, uid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập.");
  const owner = uid || user.uid;
  if (owner !== user.uid) throw new Error("Không được ghi dữ liệu cho người khác.");
  const item = push(ref(db, "media/" + owner));
  await set(item, {...data, owner: user.uid, updatedAt: Date.now()});
  return item.key;
}
export async function deleteMedia(id, uid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập.");
  await remove(ref(db, "media/" + (uid || user.uid) + "/" + id));
}

export function openLightbox(url) { const w = window.open("", "_blank"); if(w){w.document.write(`<title>Xem ảnh</title><img src="${String(url).replace(/"/g,"&quot;")}" style="max-width:100%;height:auto;display:block;margin:auto">`);}}
