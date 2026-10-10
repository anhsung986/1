// Thư viện: Firebase Realtime Database helpers. Uploads require Firebase Storage configuration.
import { db, auth } from "./auth.js";
import { ref, push, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
export function watchGallery(uid, callback) {
  return onValue(ref(db, "gallery/" + (uid || auth.currentUser?.uid || "public")), snap => callback(snap.val() || {}));
}
export async function saveGallery(data, uid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập.");
  const owner = uid || user.uid;
  if (owner !== user.uid) throw new Error("Không được ghi dữ liệu cho người khác.");
  const item = push(ref(db, "gallery/" + owner));
  await set(item, {...data, owner: user.uid, updatedAt: Date.now()});
  return item.key;
}
export async function deleteGallery(id, uid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập.");
  await remove(ref(db, "gallery/" + (uid || user.uid) + "/" + id));
}
