// Lịch: Firebase Realtime Database helpers. Uploads require Firebase Storage configuration.
import { db, auth } from "./auth.js";
import { ref, push, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
export function watchEvents(uid, callback) {
  return onValue(ref(db, "events/" + (uid || auth.currentUser?.uid || "public")), snap => callback(snap.val() || {}));
}
export async function saveEvents(data, uid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập.");
  const owner = uid || user.uid;
  if (owner !== user.uid) throw new Error("Không được ghi dữ liệu cho người khác.");
  const item = push(ref(db, "events/" + owner));
  await set(item, {...data, owner: user.uid, updatedAt: Date.now()});
  return item.key;
}
export async function deleteEvents(id, uid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập.");
  await remove(ref(db, "events/" + (uid || user.uid) + "/" + id));
}
