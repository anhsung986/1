// AI Bot: Firebase Realtime Database helpers. Uploads require Firebase Storage configuration.
import { db, auth } from "./auth.js";
import { ref, push, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
export function watchAiBot(uid, callback) {
  return onValue(ref(db, "aiBot/" + (uid || auth.currentUser?.uid || "public")), snap => callback(snap.val() || {}));
}
export async function saveAiBot(data, uid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập.");
  const owner = uid || user.uid;
  if (owner !== user.uid) throw new Error("Không được ghi dữ liệu cho người khác.");
  const item = push(ref(db, "aiBot/" + owner));
  await set(item, {...data, owner: user.uid, updatedAt: Date.now()});
  return item.key;
}
export async function deleteAiBot(id, uid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Bạn cần đăng nhập.");
  await remove(ref(db, "aiBot/" + (uid || user.uid) + "/" + id));
}

export async function askAIBot(prompt) {
  // Không nhúng API key AI vào frontend. Hãy nối Cloud Function/server riêng để gọi nhà cung cấp AI.
  const text = prompt.trim();
  if (!text) return "Bạn hãy nhập câu hỏi nhé.";
  return "Mình đã nhận câu hỏi: “" + text + "”. Để bật AI thật, hãy cấu hình endpoint an toàn qua Firebase Cloud Functions.";
}
