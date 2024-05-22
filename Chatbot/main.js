
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



/*const chave = *Aqui vai ser add a chave que integra com o chat gpt*/

function mandarMensagem() {
    var mensagem = document.getElementById('colocar-mensagem').value;
    if (!mensagem) {
      document.getElementById('colocar-mensagem').style.border = '2px solid red';
      return;
    }
    document.getElementById('colocar-mensagem').style.border = 'none';


    var carregando = document.getElementById('status')/*Essa variavel vai pegar o status da mensagem*/
    var desabilitado = document.getElementById('btn-escrever')/*Essa variavel vai pegar o que a pessoa escreveu*/

    carregando.innerHTML = 'Carregando...'/*Esse vai atribuir o Carregando... na variavel carregando*/
    desabilitado.disabled = true /*Aqui vai desabilitar o botão assim que for clicado para mandar algo */
    desabilitado.style.cursor = 'not-allowed' /*Muda o cursor */
    document.getElementById('colocar-mensagem').disabled = true  /*Aqui vai desabilitar o local de escrever assim que for clicado para mandar algo */

    /*Abaixo temos a integraççao com o chat gpt em si*/
    /*O Fetch é uma API em JavaScript que fornece
     uma maneira moderna e flexível de fazer requisições de rede */

    fetch('https://api.openai.com/v1/completions',{
        method: 'POST',
        headers: {
            Accept: 'applications/json',
            'Content-Type':'applications/json',
            Authorization: `Bearer ${chave}`
        },
        body: JSON.stringify({
            model:'text-davinci-003',
            prompt: mensagem.value,
            max_tokens: 2048,
            temperature: 0.5 
        })
    })
    .then((response) => response.json())
    .then((response) => {
        let resposta = (response.choices[0]['text'])
        mostrarHistorico(mensagem , resposta)
    })
    .catch((e) => {
        console.log('Erro -> ', e)
        /*O catch serve para se caso ocorre um erro nessa integração
        ele vai retornar que algo errado aconteceu */
    })
    .finally(() => {
        desabilitado.disabled = false /*Aqui vai habilitar novamente o botão*/
        desabilitado.style.cursor = 'pointer'
        document.getElementById('colocar-mensagem').disabled = false
    }) 
}

function mostrarHistorico (mensagem, response) {
    var historico = document.getElementById('historico')

    //Minhas mensagens
    var minhacaixamensagem = document.createElement('div')
    //o creat element cria uma elemento em html
    minhacaixamensagem.className = 'minha-caixa-mensagem'

    var minhamensagem = document.createElement('p')
    minhamensagem.className = 'minha-mensagem'
    minhamensagem.innerHTML = mensagem

    minhacaixamensagem.appendChild(minhamensagem)
    historico.appendChild(minhacaixamensagem)
    // O appendchild serve para colocar um elemento dentro do outro


    
    //Mensagens do chat
    var resposta_caixamensagem = document.createElement('div')
    resposta_caixamensagem.className = 'caixa-resposta-mensagem'

    var chatmensagem = document.createElement('p')
    chatmensagem.className = 'chat-mensagem'
    chatmensagem.innerHTML = mensagem

    resposta_caixamensagem.appendChild(chatmensagem)
    historico.appendChild(resposta_caixamensagem)

}


