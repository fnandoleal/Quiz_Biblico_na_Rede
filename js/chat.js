import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const chatRef = collection(db, "chat");

window.enviarMensagem = async function() {

    const input = document.getElementById("mensagem");

    const nome =
        localStorage.getItem("nomeJogador") || "Visitante";

    const texto = input.value.trim();

    if(!texto) return;

    await addDoc(chatRef,{
        nome,
        texto,
        data: serverTimestamp()
    });

    input.value = "";
};

const q = query(
    chatRef,
    orderBy("data")
);

onSnapshot(q,(snapshot)=>{

    const chat =
        document.getElementById("chat");

    if(!chat) return;

    let html = "";

    snapshot.forEach((doc)=>{

        const msg = doc.data();

        html += `
            <div class="chat-msg">
                <span class="chat-nome">
                    ${msg.nome}
                </span>:
                ${msg.texto}
            </div>
        `;
    });

    chat.innerHTML = html;

    chat.scrollTop =
        chat.scrollHeight;
});
