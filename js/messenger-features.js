import { db, auth } from "./auth.js";
import { ref, set, remove, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
export async function reactToMessage(conversationId,messageId,emoji){const u=auth.currentUser;if(!u)throw Error("Chưa đăng nhập");await set(ref(db,`reactions/${conversationId}/${messageId}/${u.uid}`),{emoji,uid:u.uid});}
export async function setTyping(conversationId,isTyping){const u=auth.currentUser;if(!u)return;const r=ref(db,`typing/${conversationId}/${u.uid}`);if(isTyping)await set(r,{name:u.displayName||"Thành viên",at:Date.now()});else await remove(r);}
export function watchTyping(conversationId,cb){return onValue(ref(db,`typing/${conversationId}`),s=>cb(Object.values(s.val()||{}).filter(v=>Date.now()-v.at<5000)));}
