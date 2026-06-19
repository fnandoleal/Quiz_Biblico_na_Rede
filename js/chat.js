import { bancoDados } from "./firebase-config.js";

import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================
// Referência da Conversa
// ======================================

const referenciaConversa =
    collection(
        bancoDados,
        "conversa"
    );


// ======================================
// Envio de Mensagens
// ======================================

window.enviarMensagem = async function () {

    const campoMensagem =
        document.getElementById(
            "campoMensagem"
        );

    if (!campoMensagem) return;

    const nomeJogador =
        localStorage.getItem(
            "nomeJogador"
        ) || "Visitante";

    const mensagemDigitada =
        campoMensagem.value.trim();

    if (!mensagemDigitada) return;

    await addDoc(
        referenciaConversa,
        {
            nome: nomeJogador,

            texto:
                mensagemDigitada,

            data:
                serverTimestamp()
        }
    );

    campoMensagem.value = "";

};


// ======================================
// Consulta das Mensagens
// ======================================

const consultaMensagens =
    query(
        referenciaConversa,
        orderBy("data")
    );


// ======================================
// Atualização em Tempo Real
// ======================================

onSnapshot(

    consultaMensagens,

    (resultadoConsulta) => {

        const conversa =
            document.getElementById(
                "conversa"
            );

        if (!conversa) return;

        let html = "";

        resultadoConsulta.forEach(

            (mensagem) => {

                const dadosMensagem =
                    mensagem.data();

                html += `
                    <div class="chat-msg">

                        <span class="chat-nome">

                            ${dadosMensagem.nome}

                        </span>

                        :

                        ${dadosMensagem.texto}

                    </div>
                `;
            }

        );

        conversa.innerHTML =
            html;

        conversa.scrollTop =
            conversa.scrollHeight;

    }

);