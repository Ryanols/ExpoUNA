
/*
function mandarMensagem() {
    var mensagem = document.getElementById('colocar-mensagem')
    /*Essa variavel vai pegar o que for digitado 
    if (!mensagem) {
        document.getElementById('colocar-mensagem').style.border = '1px solid red';
        return;
      }
    /*Esse if é uma validação de se não tiver mensagem enviada a borda 
    irá ficar vermelha 
    mensagem.style.border = 'none'
}
*/

/*Tentei implementar da maneira acima mas não funcionou */



const chave = ;

function mandarMensagem() {
    var mensagem = document.getElementById('colocar-mensagem').value;
    if (!mensagem) {
        document.getElementById('colocar-mensagem').style.border = '2px solid red';
        return;
    }
    document.getElementById('colocar-mensagem').style.border = 'none';

    var carregando = document.getElementById('status');
    var desabilitado = document.getElementById('btn-escrever');

    carregando.innerHTML = 'Carregando...';
    desabilitado.disabled = true;
    desabilitado.style.cursor = 'not-allowed';
    document.getElementById('colocar-mensagem').disabled = true;

    fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${chave}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-0125',
            prompt: mensagem,
            max_tokens: 2048,
            temperature: 0.5 
        })
    })
    .then(response => {
        if (response.status === 429) {
            throw new Error("Limite de requisições atingido, tente novamente mais tarde.");
        }
        return response.json();
    })
    .then(response => {
        if (response.choices && response.choices.length > 0) {
            let resposta = response.choices[0].text;
            mostrarHistorico(mensagem, resposta);
        } else {
            throw new Error("Resposta da API não contém os dados esperados.");
        }
    })
    .catch(e => {
        console.log('Erro -> ', e);
        carregando.innerHTML = `Erro: ${e.message}`;
    })
    .finally(() => {
        desabilitado.disabled = false;
        desabilitado.style.cursor = 'pointer';
        document.getElementById('colocar-mensagem').disabled = false;
        if (carregando.innerHTML === 'Carregando...') {
            carregando.innerHTML = '';
        }
    });
}
