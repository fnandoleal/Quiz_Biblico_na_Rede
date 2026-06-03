let perguntas = [];
let perguntasSorteadas = [];
let indiceAtual = 0;
let pontos = 0;
let tempo = 20;
let timer;

// Carrega perguntas do TXT
async function carregarPerguntas() {

    try {

        const resposta = await fetch("data/perguntas.txt");
        const texto = await resposta.text();

        const linhas = texto.split("\n");

        let perguntaAtual = null;

        linhas.forEach(linha => {

            linha = linha.trim();

            if (linha.startsWith("Q:")) {

                perguntaAtual = {
                    pergunta: linha.replace("Q:", "").trim(),
                    resposta: ""
                };

            } else if (linha.startsWith("R:") && perguntaAtual) {

                perguntaAtual.resposta =
                    linha.replace("R:", "").trim();

                perguntas.push(perguntaAtual);

                perguntaAtual = null;
            }

        });

        console.log("Perguntas carregadas:", perguntas.length);
        console.log(perguntas[0]);

        iniciarQuiz();

    } catch (erro) {

        console.error("Erro ao carregar perguntas:", erro);

        document.getElementById("pergunta").innerHTML =
            "Erro ao carregar perguntas.";
    }
}

// Embaralha perguntas
function embaralhar(array) {

    return [...array].sort(
        () => Math.random() - 0.5
    );
}

// Inicia quiz
function iniciarQuiz() {

    perguntasSorteadas =
        embaralhar(perguntas)
        .slice(0, 20);

    indiceAtual = 0;
    pontos = 0;

    mostrarPergunta();
}

// Mostra pergunta atual
function mostrarPergunta() {

    clearInterval(timer);

    if (indiceAtual >= perguntasSorteadas.length) {

        document.getElementById("pergunta").innerHTML =
            `🏆 Fim do Quiz!<br><br>Pontuação: ${pontos}/${perguntasSorteadas.length}`;

        document.getElementById("respostas").innerHTML = "";

        document.getElementById("tempo").innerHTML = "";

        document.getElementById("btnResponder").style.display =
            "none";

        return;
    }

    const atual =
        perguntasSorteadas[indiceAtual];

    document.getElementById("contador").innerText =
        `Pergunta ${indiceAtual + 1} de ${perguntasSorteadas.length}`;

    document.getElementById("pergunta").innerText =
        atual.pergunta;

    document.getElementById("respostas").innerHTML =
        `
        <input
            type="text"
            id="respostaJogador"
            class="form-control"
            placeholder="Digite sua resposta">
        `;

    document.getElementById("feedback").innerHTML = "";

    iniciarTempo();
}

// Cronômetro
function iniciarTempo() {

    clearInterval(timer);

    tempo = 20;

    document.getElementById("tempo").innerHTML =
        `⏱️ ${tempo}`;

    timer = setInterval(() => {

        tempo--;

        document.getElementById("tempo").innerHTML =
            `⏱️ ${tempo}`;

        if (tempo <= 0) {

            clearInterval(timer);

            document.getElementById("feedback").innerHTML =
                "⏰ Tempo esgotado!";

            indiceAtual++;

            setTimeout(() => {

                mostrarPergunta();

            }, 1500);
        }

    }, 1000);
}

// Botão responder
window.responder = function () {

    const campo =
        document.getElementById("respostaJogador");

    if (!campo) return;

    const respostaJogador =
        campo.value
        .trim()
        .toLowerCase();

    const respostaCorreta =
        perguntasSorteadas[indiceAtual]
        .resposta
        .trim()
        .toLowerCase();

    clearInterval(timer);

    const acertou =
        respostaJogador === respostaCorreta ||
        respostaJogador.includes(respostaCorreta) ||
        respostaCorreta.includes(respostaJogador);

    if (acertou) {

        pontos++;

        document.getElementById("feedback").innerHTML =
            "✅ Acertou!";

    } else {

        document.getElementById("feedback").innerHTML =
            `❌ Errou! Resposta correta: ${perguntasSorteadas[indiceAtual].resposta}`;
    }

    indiceAtual++;

    setTimeout(() => {

        mostrarPergunta();

    }, 1500);
};

// Liga botão responder
window.addEventListener("load", () => {

    carregarPerguntas();

    const botao =
        document.getElementById("btnResponder");

    if (botao) {

        botao.addEventListener(
            "click",
            responder
        );
    }

});
