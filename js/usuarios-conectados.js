import {
    bancoTempoReal
} from "./firebase-config.js";

import {
    ref,
    set,
    onValue,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ======================================
// Identificação do Usuário
// ======================================

const identificadorUsuario =

    "usuario_" +

    Math.random()
    .toString(36)
    .substring(2, 10);


// ======================================
// Registro de Conexão
// ======================================

const referenciaUsuario =

    ref(
        bancoTempoReal,

        "usuariosConectados/" +
        identificadorUsuario
    );


set(

    referenciaUsuario,

    {
        conectadoEm:
            Date.now()
    }

);


// Remove automaticamente ao sair

onDisconnect(
    referenciaUsuario
).remove();


// ======================================
// Contador de Usuários Conectados
// ======================================

const referenciaConectados =

    ref(
        bancoTempoReal,

        "usuariosConectados"
    );


onValue(

    referenciaConectados,

    (resultadoConsulta) => {

        const usuariosConectados =

            resultadoConsulta.val();

        const quantidadeConectados =

            usuariosConectados

            ? Object.keys(
                usuariosConectados
              ).length

            : 0;


        const contadorConectados =

            document.getElementById(
                "contadorConectados"
            );


        if (contadorConectados) {

            contadorConectados.innerHTML =

                `👥 Usuários conectados: ${quantidadeConectados}`;

        }

    }

);