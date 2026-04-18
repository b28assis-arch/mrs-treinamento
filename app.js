import { db } from './firebase.js';
import {
  collection,
  addDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.criarPassagem = async function () {
  const prefixo = document.getElementById("prefixo").value;
  const vagoes = document.getElementById("vagoes").value;
  const peso = document.getElementById("peso").value;

  if (!prefixo) {
    alert("Preencha o prefixo!");
    return;
  }

  const docRef = await addDoc(collection(db, "passagens"), {
    prefixo,
    vagoes,
    peso,
    status: "pendente",
    criado: new Date()
  });

  const link = location.origin + "/confirm.html?id=" + docRef.id;

  const canvas = document.getElementById("qrcode");
  QRCode.toCanvas(canvas, link);

  alert("QR gerado! Mostre para o outro maquinista.");
};

window.confirmar = async function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("QR inválido");
    return;
  }

  const ref = doc(db, "passagens", id);

  await updateDoc(ref, {
    status: "confirmado",
    confirmado_em: new Date()
  });

  alert("✅ Passagem confirmada!");
};
