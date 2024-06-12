// Define a chave da API (precisa ser preenchida)
const CHAVE_API = "Coloque a chave da api";
// Define a URL da API
const URL_API = "https://api.openai.com/v1/chat/completions";

// Variável para armazenar o histórico de mensagens com contexto específico
let historicoMensagens = [
    { role: 'system', content: 'Você é um assistente especializado em LGPD (Lei Geral de Proteção de Dados). Por favor, forneça respostas somente sobre LGPD.' }
];

// Controlador para impedir que novas perguntas sejam enviadas, antes de uma resposta está completa
let respondendo = false;

// Seleciona os elementos da interface
const barraMensagem = document.getElementById('colocar-mensagem');
const botaoEnviar = document.getElementById('btn-escrever');
const caixaMensagem = document.getElementById('historico');
const carregando = document.getElementById('status');

// Função para exibir o texto gradualmente
function exibirTextoGradualmente(elemento, texto, intervalo = 10, callback) {
    let indice = 0;
    function adicionarLetra() {
        if (indice < texto.length) {
            elemento.innerHTML += texto.charAt(indice);
            indice++;
            caixaMensagem.scrollTop = caixaMensagem.scrollHeight; // Atualiza a rolagem
            setTimeout(adicionarLetra, intervalo);
        } else if (callback) {
            callback();
        }
    }
    adicionarLetra();
}

// Função para enviar mensagem
function mandarMensagem() {
    if (respondendo) return;

    const mensagem = barraMensagem.value;
    if (!mensagem) {
        barraMensagem.style.border = '2px solid red';
        return;
    }
    barraMensagem.style.border = 'none';

    // Adicionar mensagem do usuário ao histórico
    historicoMensagens.push({ role: 'user', content: mensagem });

    // Limpar a barra de mensagem
    barraMensagem.value = "";

    // Indicador de carregamento e desabilitar elementos
    carregando.innerHTML = 'Carregando...';
    botaoEnviar.disabled = true;
    botaoEnviar.style.cursor = 'not-allowed';
    barraMensagem.disabled = true;
    respondendo = true;

    // Configura as opções para a requisição à API
    const opcoesRequisicao = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${CHAVE_API}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: historicoMensagens,
            max_tokens: 2048,
            temperature: 0.5
        })
    };

    // Envia a requisição à API e processa a resposta
    fetch(URL_API, opcoesRequisicao)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro HTTP! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            const resposta = data.choices[0].message.content;

            // Verifica se a resposta está relacionada à LGPD
            if (!resposta.toLowerCase().includes('lgpd')) {
                throw new Error('Resposta fora do contexto de LGPD.');
            }

            // Cria elementos para a mensagem e a resposta
            const novaMensagem = document.createElement('div');
            novaMensagem.innerHTML = `<div class='conversa mensagem'><span class='minha-mensagem'>${mensagem}</span></div>`;
            const novaResposta = document.createElement('div');
            novaResposta.innerHTML = `<div class='conversa resposta'><span class='mensagem-chat'></span></div>`;
            caixaMensagem.appendChild(novaMensagem);
            caixaMensagem.appendChild(novaResposta);
            caixaMensagem.scrollTop = caixaMensagem.scrollHeight; // Atualiza a rolagem

            // Exibir resposta gradualmente
            const respostaaospoucos = novaResposta.querySelector('.mensagem-chat');
            exibirTextoGradualmente(respostaaospoucos, resposta, 10, () => {
                botaoEnviar.disabled = false;
                botaoEnviar.style.cursor = 'pointer';
                barraMensagem.disabled = false;
                carregando.innerHTML = '';
                respondendo = false;
            });
        })
        .catch(error => {
            console.error('Erro:', error);
            const respostaErro = `<div class="conversa resposta"><span class='mensagem-chat'>Oops! Ocorreu um erro. Por favor, tente novamente com uma pergunta relacionada à LGPD.</span></div>`;
            caixaMensagem.insertAdjacentHTML("beforeend", respostaErro);

            botaoEnviar.disabled = false;
            botaoEnviar.style.cursor = 'pointer';
            barraMensagem.disabled = false;
            carregando.innerHTML = '';
            respondendo = false;
        });
}

// Define o evento de clique do botão de envio
botaoEnviar.onclick = mandarMensagem;

// Adiciona evento de teclado para enviar mensagem com Enter
barraMensagem.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        mandarMensagem();
    }
});
