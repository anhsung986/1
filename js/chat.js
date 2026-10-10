import { db, auth } from "./auth.js";
import { ref, push, set, onValue, query, limitToLast, update, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
export function watchMessages(conversationId, callback) {
  const q=query(ref(db,`messages/${conversationId}`),limitToLast(100));
  return onValue(q,snap=>callback(Object.entries(snap.val()||{}).map(([id,m])=>({id,...m})).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0))));
}
export async function sendMessage(conversationId,text) {
  const user=auth.currentUser;if(!user) throw new Error("Bạn cần đăng nhập.");
  const clean=text.trim();if(!clean) return;
  const item=push(ref(db,`messages/${conversationId}`));
  await set(item,{text:clean,uid:user.uid,name:user.displayName||"Thành viên",createdAt:Date.now(),type:"text"});
  await update(ref(db,`conversations/${conversationId}`),{lastMessage:clean,lastMessageAt:Date.now(),updatedBy:user.uid});
}
export function watchConversations(uid,callback) {
  return onValue(ref(db,`userConversations/${uid}`),s=>callback(Object.entries(s.val()||{}).map(([id,v])=>({id,...v})).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0))));
}
