import { auth, db, firebaseConfigured } from "./db.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { ref, set, get, update, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
export { auth, db, firebaseConfigured, onAuthStateChanged, signOut };
export async function registerAccount({name,email,password,level5}) {
  if (!firebaseConfigured) throw new Error("Bạn cần cấu hình Firebase trong js/db.js trước.");
  if (!name.trim()) throw new Error("Vui lòng nhập tên hiển thị.");
  if (password.length < 8) throw new Error("Mật khẩu phải có ít nhất 8 ký tự.");
  if (level5 !== "CHIDOI") throw new Error("Mật khẩu Cấp 5 chưa đúng. Hãy nhập mã Cấp 5 do quản trị viên cung cấp.");
  const cred = await createUserWithEmailAndPassword(auth,email.trim(),password);
  await updateProfile(cred.user,{displayName:name.trim()});
  await set(ref(db,`users/${cred.user.uid}`),{uid:cred.user.uid,name:name.trim(),email:email.trim().toLowerCase(),bio:"Xin chào! Mình đang dùng CHI-DOI-CHAT.",createdAt:Date.now(),role:"user",online:true});
  await set(ref(db,`usernames/${cred.user.uid}`),name.trim());
  return cred.user;
}
export async function loginAccount(email,password) {
  if (!firebaseConfigured) throw new Error("Bạn cần cấu hình Firebase trong js/db.js trước.");
  const cred = await signInWithEmailAndPassword(auth,email.trim(),password);
  await update(ref(db,`users/${cred.user.uid}`),{online:true,lastSeen:Date.now()});
  return cred.user;
}
export async function requireUser(redirect="login.html") {
  return new Promise(resolve=>onAuthStateChanged(auth,user=>{if(!user){if(!location.pathname.endsWith("login.html")&&!location.pathname.endsWith("register.html")) location.href=redirect;resolve(null);}else resolve(user);},{onlyOnce:true}));
}
