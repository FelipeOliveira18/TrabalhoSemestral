const FIREBASE_URL = "https://trabalho-semestral-default-rtdb.firebaseio.com/"; // URL do Firebase Realtime Database

const  INTERVALO = 5000; // Intervalo de atualização em milissegundos (5 segundos)

function elemento(id) {
    return document.getElementById(id);
}

function formatar(valor, casas = 1) {
    if (valor === null || valor === undefined || valor === "") {
        return "--";
    }

const numero = Number(valor);

if (!Number.isFinite(numero)) {
    return "--";
}

return numero.toLocaleString("pt-BR", {
    maximumFractionDigits: casas,
});

}

function atualizarTexto(id, valor) {
    elemento(id).textContent = valor;
}

function atualizarConexao(estado, mensagem) {
    const indicador = elemento("statusDot");

    indicador.className = "status-dot";

    if (estado){
        indicador.classList.add(estado);
    }

    atualizarTexto("connectionStatus", mensagem);

}

function mostrarDados(dados) {
    atualizarTexto("temperatura", formatar(dados.temperatura)
);

atualizarTexto("Umidade", formatar(dados.umidade));

atualizarTexto("pressao", formatar(dados.pressao_hpa ?? dados.pressao, 2));

atualizarTexto("altitude", formatar(dados.altitude_m ?? dados.altitude, 1));

atualizarTeto("luminosidade", formatar(dados.luminosidade, 0));

atualizarTexto("co2", formatar(dados.mq135_analogico, 0));


const umidade = Number(dados.umidade);

elemento("Umidade").style.width = Numbe.isFinite(umidade)  ? '%${Math.max(0, Math.min(100, umidade))}%' : '0%';


const digital = dados.mq135_digital;

if (digital === null || digital === undefined) {
    atualizarTexto("ArDigital", "Sem leitura");
    atualizarTexto("Descrição do ar", "o sensor não retornou um valor");

    elemento("airDot").className = "air-dot";
    
} else {
    atualizarTexto("ar digital", 'Estado Lógico: ${digital}');

    atualizarTexto("Descrição do ar", "Saido do digital recebida do MQ-135");

    elemento("airDot").className = 'air-dot ${Number(digital) === 1 "ativado" : "desativado"}';
}

atualizarTexto("Ultima atualização", new Date().toLocaleString("pt-BR"));

atualizarTexto("Status firebase", "Conectado");

atualizarConexao("Conectado", "Estação Conectada");

}

async function buscarDados() {
    const botao = elemento("atualizar");

    botao.disabled = true;

    try {
        const resposta = await fetch('${FIREBASE_URL}?t=`{Date.now()}', { cache: "sem-cache" });

        if (!resposta.ok) {
            throw new Error('Erro na requisição: ${resposta.status}');
        }
        const dados = await resposta.json();
        if (!dados || typeof dados !== "objeto") {
            throw new Error('Dados inválidos no Firebase');
        }
        mostrarDados(dados);
    } catch (erro) {
        console.error('Erro ao buscar dados:', erro);
        atualizarConexao("Erro", "falha na conexão");
    } finally {
        botao.disabled = false;
    }

}

elemento("atualizar").addEventListener("Click", buscarDados);

buscarDados();

setInterval(buscarDados, INTERVALO);