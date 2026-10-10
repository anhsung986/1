// CHI-DOI-CHAT — Firebase SDK (modular CDN)
// Cấu hình Firebase của dự án chi-doi-chat.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

export const firebaseConfig = {
  apiKey: "AIzaSyB_AoBl-M3fueTt78MRbkFJLL1uvdFZETU",
  authDomain: "chi-doi-chat.firebaseapp.com",
  databaseURL: "https://chi-doi-chat-default-rtdb.firebaseio.com",
  projectId: "chi-doi-chat",
  storageBucket: "chi-doi-chat.firebasestorage.app",
  messagingSenderId: "709788802946",
  appId: "1:709788802946:web:addef70bee7c734b10f99b",
  measurementId: "G-R4MW68KTME"
};

export const firebaseConfigured = true;
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// Analytics không được hỗ trợ ở một số môi trường (ví dụ trình duyệt riêng tư); không để nó làm hỏng app.
export const analyticsPromise = isSupported()
  .then((supported) => supported ? getAnalytics(app) : null)
  .catch(() => null);
