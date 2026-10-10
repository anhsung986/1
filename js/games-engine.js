// Trò chơi: Firebase Realtime Database helpers. Uploads require Firebase Storage configuration.
import { db, auth } from "./auth.js";
import { ref, push, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
export function watchGames(uid, callback) {
  return onValue(ref(db, "games/" + (uid || auth.currentUser?.uid || "public")), snap => callback(snap.val() || {}));
}
export async function saveGames(data, uid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập.");
  const owner = uid || user.uid;
  if (owner !== user.uid) throw new Error("Không được ghi dữ liệu cho người khác.");
  const item = push(ref(db, "games/" + owner));
  await set(item, {...data, owner: user.uid, updatedAt: Date.now()});
  return item.key;
}
export async function deleteGames(id, uid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập.");
  await remove(ref(db, "games/" + (uid || user.uid) + "/" + id));
}
