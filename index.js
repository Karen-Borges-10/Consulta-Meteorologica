const formulario = document.querySelector("#buscar_cidade");
const nome = document.querySelector("#cidade");
const botao = document.querySelector("#buscar");
const mensagem = document.querySelector("#mensagem");
const resultado = document.querySelector("#resultado");
const dados_clima = document.querySelector("#dados_clima");
const lista_locais = document.querySelector("#locais");

formulario.addEventListener('submit', function(evento){
    evento.preventDefault();

    const termo = nome.value.trim();
    if(termo === ''){
        alert(`Por favor, digite um nome de localidade válido.`);
        return;
    }
    resultado.textContent = '';
    dados_clima.textContent = '';
    lista_locais.hidden = true;
    mensagem.textContent =  locais.length === 1
    ? '1 localidade encontrada.'
    : `${locais.length} localidades encontradas.`;
    botao.disabled = true;
    const parametros = new URLSearchParams({
        name: termo,
        count: 10,
        language: 'pt',
        format: 'json'
    });
    fetch(`https://geocoding-api.open-meteo.com/v1/search?${parametros}`).then(function(resposta){
        console.log(resposta);
        if(!resposta.ok){
            throw new Error(`Erro HTTP:${resposta.status}`);
        }
        return resposta.json();
    }).then(function(dados){
    const locais = dados.results || [];
    console.log(dados);

    if (locais.length === 0) {
        mensagem.textContent = 'Nenhuma localidade encontrada.';
        return;
    }

    mensagem.textContent = `${locais.length} ocorrências encontradas.`;
    lista_locais.hidden = false;

    locais.forEach(function(local){
        const item = document.createElement('li');

        const partes = [
            local.name,
            local.admin2,
            local.admin1,
            local.country
        ].filter(Boolean);

        item.textContent = partes.join(', ');
        item.classList.add('opcao-localidade');

        item.addEventListener('click', function(){
            nome.value = local.name;
            lista_locais.hidden = true;
            consultar_clima(local);
        });

        resultado.appendChild(item);
    });
    }).catch(function(erro){
        mensagem.textContent = `Não foi possível buscar os dados.`;
        console.error(erro);
    }).finally(function(){
        botao.disabled = false;
    });
});

const descricoes_clima ={
    0: 'Céu limpo',
    1: 'Predominantemente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Nevoeiro',
    48: 'Nevoeiro com geada',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    56: 'Chuva congelante leve',
    57: 'Chuva congelante intensa',
    61: 'Chuva fraca',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    66: 'Chuva congelante leve',
    67: 'Chuva congelante forte',
    71: 'Neve fraca',
    73: 'Neve moderada',
    75: 'Neve forte',
    77: 'Grãos de neve',
    80: 'Pancadas de chuva fracas',
    81: 'Pancadas de chuva moderadas',
    82: 'Pancadas de chuva violentas',
    85: 'Pancadas de neve fracas',
    86: 'Pancadas de neve fortes',
    95: 'Tempestade',
    96: 'Tempestade com granizo leve',
    99: 'Tempestade com granizo forte'
}
function consultar_clima(local){

const parametros = new URLSearchParams({
    latitude: local.latitude,
    longitude: local.longitude,
    current: 'temperature_2m,relative_humidity_2m,weather_code',
    timezone: 'auto',
    });
    fetch(`https://api.open-meteo.com/v1/forecast?${parametros}`).then(function(resposta){
        console.log(resposta);
        if(!resposta.ok){
            throw new Error(`Erro HTTP:${resposta.status}`);
        }
        return resposta.json();
    }).then(function(dados){
        const atual = dados.current;
        const unidades = dados.current_units;

        mensagem.textContent = `Dados de ${local.name} - ${atual.time}(${dados.timezone})`;

        dados_clima.textContent = '';

        const itens = [`Temperatura: ${atual.temperature_2m} ${unidades.temperature_2m}`,
            `Umidade relativa: ${atual.relative_humidity_2m} ${unidades.relative_humidity_2m}`,
            `Código do clima: ${atual.weather_code}`,
            `Clima: ${descricoes_clima[atual.weather_code] || `Descrição não disponível`}`,
        ];

        itens.forEach(function(texto){
            const item = document.createElement('li');
            item.textContent = texto;
            dados_clima.appendChild(item);
        });

    }).catch(function(erro){
        mensagem.textContent = `Não foi possível consultar o clima.`;
        console.error(erro);
    });
}
