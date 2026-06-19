let perguntas = [];
let perguntasSorteadas = [];

let indiceAtual = 0;
let pontos = 0;

let segundosRestantes = 30;
let cronometro;

async function carregarPerguntas() {
    try {
        const resposta = await fetch("data/perguntas.txt");
        const conteudoArquivo = await resposta.text();
        const linhas = conteudoArquivo.split("\n");
        let perguntaAtual = null;

        linhas.forEach((linha) => {
            linha = linha.trim();

            if (linha.startsWith("Q:")) {
                perguntaAtual = {
                    pergunta: linha.replace("Q:", "").trim(),
                    resposta: ""
                };
            }
            else if (linha.startsWith("R:") && perguntaAtual) {
                perguntaAtual.resposta = linha.replace("R:", "").trim();
                perguntas.push(perguntaAtual);
                perguntaAtual = null;
            }
        });

        console.log("Perguntas carregadas:", perguntas.length);
        iniciarPartida();
    }
    catch (erro) {
        console.error("Erro ao carregar perguntas:", erro);
        document.getElementById("pergunta").innerHTML = "Erro ao carregar perguntas.";
    }
}

function embaralharPerguntas(listaPerguntas) {
    return [...listaPerguntas].sort(() => Math.random() - 0.5);
}

function iniciarPartida() {
    perguntasSorteadas = embaralharPerguntas(perguntas).slice(0, 20);
    indiceAtual = 0;
    pontos = 0;
    document.getElementById("btnResponder").style.display = "block";
    document.getElementById("barraProgresso").style.width = "0%";
    atualizarPontuacao();
    exibirPergunta();
}

function atualizarPontuacao() {
    const elementoPontuacao = document.getElementById("pontuacaoAtual");
    if (elementoPontuacao) {
        elementoPontuacao.innerHTML = `Pontuação: ${pontos}`;
    }
}

function exibirPergunta() {
    clearInterval(cronometro);

    if (indiceAtual >= perguntasSorteadas.length) {
        const quantidadeErros = perguntasSorteadas.length - pontos;
        const nomeJogador = localStorage.getItem("nomeJogador") || "Visitante";

        document.getElementById("pergunta").innerHTML =
            `
    <h3>
        🏆 Quiz Finalizado
    </h3>

    <br>

    <p>
        <strong>Jogador:</strong>
        ${nomeJogador}
    </p>

    <p>
        <strong>Acertos:</strong>
        ${pontos}
    </p>

    <p>
        <strong>Erros:</strong>
        ${quantidadeErros}
    </p>

    <br>

    <h4>
        Pontuação Final:
        ${pontos}/${perguntasSorteadas.length}
    </h4>
    `;

        document.getElementById("respostas").innerHTML = "";
        document.getElementById("cronometro").innerHTML = "";
        document.getElementById("mensagemResultado").innerHTML = "";
        document.getElementById("btnResponder").style.display = "none";
        return;
    }

    const perguntaAtual = perguntasSorteadas[indiceAtual];

    document.getElementById("contadorPerguntas").innerText =
        `Pergunta ${indiceAtual + 1} de ${perguntasSorteadas.length}`;

    const percentualConclusao = ((indiceAtual + 1) / perguntasSorteadas.length) * 100;

    document.getElementById("barraProgresso").style.width = percentualConclusao + "%";
    document.getElementById("pergunta").innerText = perguntaAtual.pergunta;

    document.getElementById("respostas").innerHTML =
        `
    <input
        type="text"
        id="respostaJogador"
        class="form-control"
        placeholder="Digite sua resposta">
    `;

    setTimeout(() => {
        const campoResposta = document.getElementById("respostaJogador");

        if (campoResposta) {
            campoResposta.focus();
            campoResposta.addEventListener("keydown", (evento) => {
                if (evento.key === "Enter") {
                    evento.preventDefault();
                    responder();
                }
            });
        }
    }, 100);

    document.getElementById("mensagemResultado").innerHTML = "";
    iniciarCronometro();
}

function iniciarCronometro() {
    clearInterval(cronometro);
    segundosRestantes = 30;
    document.getElementById("cronometro").innerHTML = `⏱️ ${segundosRestantes}`;

    cronometro = setInterval(() => {
        segundosRestantes--;
        document.getElementById("cronometro").innerHTML = `⏱️ ${segundosRestantes}`;

        if (segundosRestantes <= 0) {
            clearInterval(cronometro);
            document.getElementById("mensagemResultado").innerHTML = "⏰ Tempo esgotado!";
            indiceAtual++;
            setTimeout(exibirPergunta, 1500);
        }
    }, 1000);
}

window.responder = function () {
    const campoResposta = document.getElementById("respostaJogador");
    if (!campoResposta) return;

    const respostaJogador = campoResposta.value.trim().toLowerCase();
    if (!respostaJogador) {
        document.getElementById("mensagemResultado").innerHTML = "Digite uma resposta.";
        return;
    }

    const respostaCorreta = perguntasSorteadas[indiceAtual].resposta.trim().toLowerCase();
    clearInterval(cronometro);

    const jogadorAcertou = respostaJogador === respostaCorreta ||
        respostaJogador.includes(respostaCorreta) ||
        respostaCorreta.includes(respostaJogador);

    if (jogadorAcertou) {
        pontos++;
        atualizarPontuacao();
        document.getElementById("mensagemResultado").innerHTML = "✅ Acertou!";
    } else {
        document.getElementById("mensagemResultado").innerHTML =
            `
        ❌ Errou!

        <br>

        <strong>
            Resposta correta:
            ${perguntasSorteadas[indiceAtual].resposta}
        </strong>
        `;
    }

    indiceAtual++;
    setTimeout(exibirPergunta, 1500);
};

window.addEventListener("load", () => {
    carregarPerguntas();

    const botaoResponder = document.getElementById("btnResponder");
    if (botaoResponder) {
        botaoResponder.addEventListener("click", responder);
    }
});
