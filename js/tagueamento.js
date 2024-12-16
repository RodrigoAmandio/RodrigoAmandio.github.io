// Preencha este arquivo com qualquer código que você necessite para realizar a
// coleta, desde a biblioteca analytics.js, gtag.js ou o snippet do Google Tag 
// Manager. No último caso, não é necessário implementar a tag <noscript>.
// O ambiente dispõe da jQuery 3.5.1, então caso deseje, poderá utilizá-la
// para fazer a sua coleta.
// Caso tenha alguma dúvida sobre o case, não hesite em entrar em contato.


// Evento page_view: Automaticamente cedido pelo Google Analytics ao configurar o stream de dados


// DOM: Document Object Model
// A função somente é executada quando o DOM estiver completamente carregado
// TODO: Avaliar possíveis problemas ao se fazer desta forma
document.addEventListener('DOMContentLoaded', function() { 

    // Mapeamento para os eventos de cliques em botões de Download e Entre em Contato
    function addEventListener(
        classToSearch,
        eventType,
        eventName,
        buttonName
    ) {
        // Não há necessidade de informar o nome do arquivo html
        // A propriedade querySelector varre toda a estrutura HTML em busca da classe específica
        var button = document.querySelector(classToSearch);
        var linkUrl = button.getAttribute('href');
    
        if (button) {
            button.addEventListener(eventType, function(event) {
                
                dataLayer.push({
                    "event":eventName,
                    "page_location": linkUrl
                });
    
                console.log("Botão " + buttonName + " clicado")
                console.log(linkUrl)
            });
        } else {
            console.log("Botão " + buttonName + " não encontrado");
        }
    }


    // Mapeamento de evento para cliques no botão de Download
    addEventListener(
        '.menu-lista-link.menu-lista-download',
        'click',
        'download_button',
        'Download'
    )


    // Mapeamento de evento para cliques no botão de Entre em Contato
    addEventListener(
        '.menu-lista-link.menu-lista-contato',
        'click',
        'contact_button',
        'Entre em contato'
    )


    // Mapeamento dos cliques nos botões da página de análise
    function addEventListenerIterative(
        classToSearch,
        eventType,
        attribute
    ) {
        // Seleciona todos os objetos com a classe 'card card-montadoras'
        var cards = document.querySelectorAll(classToSearch);
        
        // O trecho abaixo vai iterar dentro dos objetos selecionados
        cards.forEach(function(card) {
            card.addEventListener(eventType, function() {
            // Acessa o atributo informado do código HTML
            
            var dataName = card.getAttribute(attribute);
            console.log("Botão: " + dataName)
            dataLayer.push({
                "event":"analysis_page_event_buttons",
                "element_name": dataName,
            })
        });
    });
    }

    addEventListenerIterative(
        '.card.card-montadoras',
        'click',
        'data-name'
    )


    // Mapeamento de evento sobre informações de contato
    function contactInformation(eventName,eventType) {

        // Mapeia as informações da linha de contato do arquivo sobre.html
        var form = document.querySelector('.contato');

        // Caso o formulário não exista, este if previnirá erros em páginas onde este evento não ocorre
        if (form && form !== null) {

            // Cria um addEventListener igual a submit para obter os dados quando preenchidos
            form.addEventListener(eventType, function(event) {

                // Valores a partir de cada campo
                var userName = document.getElementById('nome').value
                var userEmail = document.getElementById('email').value
                var userPhone = document.getElementById('telefone').value
                var userAccepted = document.getElementById('aceito').checked

                console.log('Nome:', userName)
                console.log('E-Mail:', userEmail)
                console.log('Telefone:', userPhone)
                console.log('Aceito:', userAccepted)
                
                dataLayer.push({
                    "event": eventName,
                    "user_name": userName,
                    "user_email": userEmail,
                    "user_phone": userPhone,
                    "user_accepted": userAccepted,
                });

            })
        }
    }


    // Submissão de informações de contato
    contactInformation('contact_info','submit')


    // Mapeamento de evento sobre interações de contato
    function contactInteraction(eventName,eventType) {

        var form = document.querySelector('.contato');

        // Variáveis para garantir que somente uma iteração por campo seja enviada como evento por sessão
        // Do contrário, multiplos cliques do usuário gerariam múltiplos eventos e isso não é esperado
        var userNameEventSent = false
        var userEmailEventSent = false 
        var userPhoneEventSent = false 
        
        // Em versões antigas do JavaScript, como a suportada pelo GA4, não é possível declarar diretamente uma função dentro de um event listener
        // Para isso, armazenamos o contexto de função dentro de uma variável e a informamos em addEventListener

        if (form && form !== null) {
            var sendFocusDetails = function(event) {
                
                if (userNameEventSent === false && event.target.id === 'nome') {
                    
                    console.log('Iteração com o campo: ' + event.target.id)

                    dataLayer.push({
                        "event": eventName,
                        "form_id": event.target.id
                    });

                    // Altera a variável para true para que não entre mais nesta condição dentro da sessão
                    userNameEventSent = true

                } else if (userEmailEventSent === false && event.target.id === 'email') {
                    console.log('Iteração com o campo: ' + event.target.id)

                    dataLayer.push({
                        "event": eventName,
                        "form_id": event.target.id
                    });

                    userEmailEventSent = true

                } else if (userPhoneEventSent === false && event.target.id === 'telefone') {
                    console.log('Iteração com o campo: ' + event.target.id)

                    dataLayer.push({
                        "event": eventName,
                        "form_id": event.target.id
                    });

                    userPhoneEventSent = true

                } else {
                    console.log("Evento para o campo " + event.target.id + " já foi enviado nesta sessão")
                }
            }
                
            // Cria um addEventListener igual a focus para obter os dados o usuário interagir
            // Neste caso, o evento precisa ser capturado assim que se inicia, antes de ir ao elemento de destino (target). Para isso, usa-se true como terceiro parâmetro dentro de addEventListener
            // Por padrão, esta variável é false e os eventos somente são capturados quando chegam ao target
            form.addEventListener(eventType, sendFocusDetails, true);
        }
    }


    // Submissão de interações do usuário com os campos do formulário
    contactInteraction('contact_interaction','focus')

    // Mapeamento de evento sobre informações de contato
    // As informações foram adicionadas no dataLayer diretamente via arquivo main.js após exibição do pop up
})


function hashEmail(email) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(email)).then(hashBuffer => {
        let hashArray = Array.from(new Uint8Array(hashBuffer));
        let hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    });
}