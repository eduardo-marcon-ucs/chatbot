const apiKey = "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";

let serviceKey = 0;
let questions  = []; // Utilização de um Array para controlar o fluxo da conversa

const inputQuestions = document.querySelector("#inputQuestion");

const response     = document.querySelector("#response");
const listServices = document.querySelector(".listServices");

const serviceOptions = "\nServiços oferecidos:\n1 - Corte de cabelo e modelagem\n2 - Coloração de cabelo\n3 - Tratamento capilares\n4 - Maquiagem para eventos ou para o dia a dia\n5 - Design de sobrançelhas\n6 - Depilação\n7 - Manicure e pedicure\n8 - Massagens\n9 - Alongamento de cílios\n10 - Escova matizadora\n\n0 - Estou com dúvida sobre os serviços\nS - Sair";

function responseQuestions(){ // Lógica que simula o chatbot, respondendo as perguntas
    if(inputQuestions.value == "" || inputQuestions.value == undefined){
        alert("Preencha o campo corretamente");
    }else{
        questions.push(inputQuestions.value.toUpperCase());
        if(questions.length == 1){
            presentation();
        }else{
            if(questions[questions.length-1] == "A"){
                response.innerText = serviceOptions;
            }else{
                if(questions[questions.length-1] == "S"){
                    response.innerText = "Ok, sem problemas, fico a sua disposição!";
                }
            }
            if((questions[questions.length-1] >= 1 && questions[questions.length-   1] <= 10) && questions[questions.length-2] == "A"){
                serviceKey = questions[questions.length-1];
                response.innerText = `OK! Agendamos seu horário para o dia ${gerarDataAleatoria()}\nTenha um bom dia!`;
            }else{
                if(questions[questions.length-1] == 0){
                    response.innerText = "Em qual serviço voce ficou com dúvida?";
                    listServices.innerHTML = 
                    `
                    <ol>
                        <li><input type="button" class="buttonGetKeyApi" onclick="getKeyApi(this.value)"value="1">  - Corte de cabelo e modelagem</li>
                        <li><input type="button" class="buttonGetKeyApi" onclick="getKeyApi(this.value)"value="2">  - Coloração de cabelo</li>
                        <li><input type="button" class="buttonGetKeyApi" onclick="getKeyApi(this.value)"value="3">  - Tratamento capilares</li>
                        <li><input type="button" class="buttonGetKeyApi" onclick="getKeyApi(this.value)"value="4">  - Maquiagem para eventos ou para o dia a dia</li>
                        <li><input type="button" class="buttonGetKeyApi" onclick="getKeyApi(this.value)"value="5">  - Design de sobrançelhas</li>
                        <li><input type="button" class="buttonGetKeyApi" onclick="getKeyApi(this.value)"value="6">  - Depilação</li>
                        <li><input type="button" class="buttonGetKeyApi" onclick="getKeyApi(this.value)"value="7">  - Manicure e pedicure</li>
                        <li><input type="button" class="buttonGetKeyApi" onclick="getKeyApi(this.value)"value="8">  - Massagens</li>
                        <li><input type="button" class="buttonGetKeyApi" onclick="getKeyApi(this.value)"value="9">  - Alongamento de cílios</li>
                        <li><input type="button" class="buttonGetKeyApi" onclick="getKeyApi(this.value)"value="10"> - Escova matizadora</li>
                    </ol>
                    `
                }
            }

        }
        clearFields();
    }   
}

function presentation(){ // Quando o usuairo iniciar a conversa
    response.innerText = "Olá! Obrigado por entrar em contato! Como posso ajudá-lo?\nA - Agendar um horário\nS - Sair";
}

function restartConversation(){ // Reiniciar a conversa
    questions = [];
    response.innerText = "";
    listServices.innerHTML = "";
}

function clearFields(){ // Limpar campos
    inputQuestions.value = "";
}

function gerarDataAleatoria() { // Gerar um data ficticia para realizar o agendamento
    // Define a data inicial e final (1º de janeiro de 2021 a 31 de dezembro de 2023)
    const dataInicial = new Date('2021-01-01T00:00:00');
    const dataFinal = new Date('2023-12-31T23:59:59');
  
    // Calcula a diferença em milissegundos entre as duas datas
    const diferenca = dataFinal.getTime() - dataInicial.getTime();
  
    // Gera um valor aleatório dentro do intervalo de tempo especificado
    const tempoAleatorio = Math.floor(Math.random() * diferenca);
  
    // Cria uma nova data adicionando o tempo aleatório ao timestamp da data inicial
    const dataAleatoria = new Date(dataInicial.getTime() + tempoAleatorio);
  
    // Retorna a data formatada como uma string
    return `${dataAleatoria.toLocaleDateString()} as ${dataAleatoria.toLocaleTimeString()}`;
}

function getKeyApi(value){ // Pegar o numero do service
    const message = getServices(value);
    response.innerText = "Carregando...";
    toSendApiGpt(message);
}

function getServices(param){ // Relacionar o numero do service com a sua label, para posteriormente montar a pergunta para fazer a requisição para a API
    const objService = {
        1: "Corte de cabelo e modelagem",
        2: "Coloração de cabelo",
        3: "Tratamento capilares",
        4: "Maquiagem para eventos",
        5: "Design de sobrançelhas",
        6: "Depilação",
        7: "Manicure e pedicure",
        8: "Massagens",
        9: "Alongamento de cílios",
        10: "Escova matizadora",
    }

    return objService[param];
}

function toSendApiGpt(message){ // Requisição para a API
    fetch("https://api.openai.com/v1/completions",{ // Envia uma solicitação para a URL da API OpenAI
        method: 'POST', // Usando o método HTTP POST para enviar dados para o servidor
        headers: { // Enviando os cabeçalhos da solicitação com informações adicionais
            Accept: "application/json", // Especifica que o servidor deve retornar dados em formato JSON
            "Content-Type": "application/json", // Especifica que os dados enviados para o servidor estão no formato JSON
            Authorization: `Bearer ${apiKey}`, // Enviando um token de autorização para autenticar a solicitação, onde a variável apiKey contém o token
        },
        body: JSON.stringify({ // Envia o corpo da solicitação no formato JSON
            model: "text-davinci-003", // Indica o modelo de linguagem a ser usado para gerar texto
            prompt: `Como funciona ${message}`, // Fornece uma entrada de texto como prompt para o modelo gerar uma resposta
            max_tokens: 2048, // Indica o número máximo de tokens (palavras) que a resposta pode conter
            temperature: 0.5 // Indica o grau de aleatoriedade na escolha de palavras pelo modelo
        })
    })
    .then((response) => response.json()) // Aguarda a resposta da API e converte a resposta em formato JSON
    .then((response) => {
        let r = response.choices[0]['text'] // Atribui o texto gerado pelo modelo à variável r
        restartConversation();
        this.response.innerText = r;
    })
    .catch((e) => {
        console.log(e); // Registra um erro na chamada da API no console do navegador
    })
}