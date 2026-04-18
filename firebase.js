// Import Firebase (modo web)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// CONFIG DO SEU PROJETO (JÁ COM SEUS DADOS)
const firebaseConfig = {
  apiKey: "AIzaSyBsum70fbk3AWpH1Qyvmk", 
  authDomain: "psdigital-9cc99.firebaseapp.com",
  projectId: "psdigital-9cc99",
  storageBucket: "psdigital-9cc99.appspot.com",
  messagingSenderId: "384128063838",
  appId: "1:384128063838:web:67e835eba"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Banco de dados
const db = getFirestore(app);

// Função pra salvar no banco
export async function salvarPassagem(dados) {
  try {
    await addDoc(collection(db, "passagens"), dados);
    alert("✅ Enviado para coordenação!");
  } catch (e) {
    alert("❌ Erro ao enviar: " + e);
  }
}
