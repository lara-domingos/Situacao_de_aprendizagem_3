const API_URL =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=-21.4678" +
    "&longitude=-47.0047" +
    "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
    "&timezone=America%2FSao_Paulo";


const botaoMenu = document.getElementById("hamburguer");
const menu = document.getElementById("menu");

if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", () => {
        const menuAberto = menu.classList.toggle("aberto");

        botaoMenu.setAttribute(
            "aria-expanded",
            menuAberto.toString()
        );
    });
}

async function carregarClima() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Não foi possível obter os dados do clima.");
        }

        const dados = await resposta.json();
        const climaAtual = dados.current;

        atualizarElemento("temperatura", `${climaAtual.temperature_2m}°C`);
        atualizarElemento("icone-clima", obterIconeClima(climaAtual.weather_code));

        atualizarElemento(
            "temperatura-pagina",
            `${climaAtual.temperature_2m}°C`
        );
        atualizarElemento(
            "umidade",
            `${climaAtual.relative_humidity_2m}%`
        );
        atualizarElemento(
            "vento",
            `${climaAtual.wind_speed_10m} km/h`
        );

        mostrarMensagem("Dados atualizados com sucesso.");
    } catch (erro) {
        console.error("Erro ao carregar o clima:", erro);

        atualizarElemento("temperatura", "--°C");

        atualizarElemento("temperatura-pagina", "--°C");
        atualizarElemento("umidade", "--%");
        atualizarElemento("vento", "-- km/h");

        mostrarMensagem("Não foi possível atualizar os dados do clima.");
    }
}

function atualizarElemento(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

function mostrarMensagem(texto) {
    const mensagemAnterior = document.getElementById("mensagem-clima");

    // Remove a mensagem anterior antes de criar a nova.
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }

    const mensagem = document.createElement("p");
    mensagem.id = "mensagem-clima";
    mensagem.className = "mensagem-clima";
    mensagem.textContent = texto;

    const paginaClima = document.querySelector(".clima-pagina");

    if (paginaClima) {
        paginaClima.appendChild(mensagem);
    }
}

function obterIconeClima(codigo) {
    if (codigo === 0) {
        return "☀️";
    }

    if (codigo >= 1 && codigo <= 3) {
        return "⛅";
    }

    if (codigo >= 45 && codigo <= 48) {
        return "🌫️";
    }

    if (codigo >= 51 && codigo <= 67) {
        return "🌧️";
    }

    if (codigo >= 71 && codigo <= 77) {
        return "❄️";
    }

    if (codigo >= 80 && codigo <= 82) {
        return "🌦️";
    }

    if (codigo >= 95 && codigo <= 99) {
        return "⛈️";
    }

    return "🌤️";
}

const botaoAtualizar = document.getElementById("atualizar-clima");

if (botaoAtualizar) {
    botaoAtualizar.addEventListener("click", carregarClima);
}

carregarClima();

// Atualiza os dados automaticamente a cada uma hora.
setInterval(carregarClima, 3600000);
