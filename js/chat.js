// Importa a instância do banco de dados Firebase
// configurada no arquivo firebase-config.js
import { db } from "./firebase-config.js";

// Importa funções do Firestore necessárias para o chat
import {
  collection,       // Acessa uma coleção do banco
  addDoc,           // Adiciona um documento à coleção
  query,            // Cria consultas personalizadas
  orderBy,          // Ordena os resultados
  onSnapshot,       // Escuta alterações em tempo real
  serverTimestamp   // Gera data/hora do servidor Firebase
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Cria uma referência para a coleção "chat"
// Caso ela não exista, será criada automaticamente
const chatRef = collection(db, "chat");


// Cria uma função global para enviar mensagens
// O "window." permite chamá-la diretamente pelo HTML:
// <button onclick="enviarMensagem()">
window.enviarMensagem = async function() {

    // Obtém o campo de texto onde o usuário digita a mensagem
    const input = document.getElementById("mensagem");

    // Busca o nome do jogador armazenado no navegador
    // Caso não exista, utiliza "Visitante"
    const nome =
        localStorage.getItem("nomeJogador") || "Visitante";

    // Remove espaços extras no início e no final da mensagem
    const texto = input.value.trim();

    // Se a mensagem estiver vazia,
    // interrompe a execução da função
    if(!texto) return;

    // Adiciona uma nova mensagem ao Firestore
    await addDoc(chatRef,{

        // Nome do usuário
        nome,

        // Texto digitado
        texto,

        // Horário gerado pelo servidor Firebase
        // É mais confiável que usar Date.now()
        data: serverTimestamp()
    });

    // Limpa o campo após o envio
    input.value = "";
};


// Cria uma consulta para buscar mensagens
// ordenadas pela data de envio
const q = query(
    chatRef,
    orderBy("data")
);


// Escuta alterações em tempo real na coleção
// Sempre que alguém enviar mensagem,
// este código será executado novamente
onSnapshot(q,(snapshot)=>{

    // Obtém o elemento HTML que exibirá o chat
    const chat =
        document.getElementById("chat");

    // Se o elemento não existir,
    // interrompe a execução
    if(!chat) return;

    // Variável que armazenará todo o HTML do chat
    let html = "";

    // Percorre todos os documentos retornados
    snapshot.forEach((doc)=>{

        // Obtém os dados da mensagem
        const msg = doc.data();

        // Adiciona a mensagem ao HTML
        html += `
            <div class="chat-msg">

                <!-- Nome do usuário -->
                <span class="chat-nome">
                    ${msg.nome}
                </span>:

                <!-- Texto da mensagem -->
                ${msg.texto}

            </div>
        `;
    });

    // Atualiza o conteúdo do chat
    // exibindo todas as mensagens
    chat.innerHTML = html;

    // Faz o scroll descer automaticamente
    // até a última mensagem enviada
    chat.scrollTop =
        chat.scrollHeight;
});