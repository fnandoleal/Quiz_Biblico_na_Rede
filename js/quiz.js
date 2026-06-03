let perguntas = [];
let perguntasSorteadas = [];
let indiceAtual = 0;
let pontos = 0;
let tempo = 20;
let timer;

async function carregarPerguntas() {

    const resposta = await fetch("data/perguntas.txt");
    const texto = await resposta.text();

    const linhas = texto.split("\n");

    let perguntaAtual = null;

    linhas.forEach(linha => {

        linha = linha.trim();

        if(linha.startsWith("Q:")) {

            perguntaAtual = {
                pergunta: linha.replace("Q:", "").trim(),
                resposta: ""
            };

        } else if(linha.startsWith("R:") && perguntaAtual) {

            perguntaAtual.resposta =
                linha.replace("R:", "").trim();

            perguntas.push(perguntaAtual);

            perguntaAtual = null;
        }
    });

    iniciarQuiz();
}

function embaralhar(array) {

    return [...array].sort(
        () => Math.random() - 0.5
    );
}

function iniciarQuiz() {

    perguntasSorteadas =
        embaralhar(perguntas)
        .slice(0, 20);

    indiceAtual = 0;
    pontos = 0;

    mostrarPergunta();
}

function mostrarPergunta() {

    if(indiceAtual >= perguntasSorteadas.length) {

        document.getElementById("pergunta").innerHTML =
            `🏆 Fim do Quiz!<br><br>Pontuação: ${pontos}/${perguntasSorteadas.length}`;

        document.getElementById("respostas").innerHTML = "";

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
            id="respostaJogador"
            class="form-control"
            placeholder="Digite sua resposta">
        `;

    iniciarTempo();
}

function iniciarTempo() {

    if (timer) {
        clearInterval(timer);
    }

    tempo = 20;

    document.getElementById("tempo").innerText =
        `⏱️ ${tempo}`;

    timer = setInterval(() => {

        tempo--;

        document.getElementById("tempo").innerText =
            `⏱️ ${tempo}`;

        if (tempo <= 0) {

            clearInterval(timer);

            document.getElementById("feedback").innerHTML =
                "⏰ Tempo esgotado!";

            indiceAtual++;

            setTimeout(() => {

                document.getElementById("feedback").innerHTML = "";

                mostrarPergunta();

            }, 1500);
        }

    }, 1000);
}

window.responder = function() {

    const respostaJogador =
        document
        .getElementById("respostaJogador")
        .value
        .trim()
        .toLowerCase();

    const respostaCorreta =
        perguntasSorteadas[indiceAtual]
        .resposta
        .trim()
        .toLowerCase();

    clearInterval(timer);

    const acertou =
        respostaJogador.includes(respostaCorreta) ||
        respostaCorreta.includes(respostaJogador);

    if(acertou){

        pontos++;

        document.getElementById("feedback").innerHTML =
            "✅ Acertou!";

    }else{

        document.getElementById("feedback").innerHTML =
            `❌ Errou! Resposta correta: ${perguntasSorteadas[indiceAtual].resposta}`;
    }

    indiceAtual++;

    setTimeout(() => {

        document.getElementById("feedback").innerHTML = "";

        mostrarPergunta();

    }, 1500);
} else {

        document.getElementById("feedback").innerHTML =
            `❌ Errou! Resposta correta: ${perguntasSorteadas[indiceAtual].resposta}`;
    }

    indiceAtual++;

    setTimeout(
        mostrarPergunta,
        1500
    );
}

window.addEventListener(
    "load",
    carregarPerguntas
);
