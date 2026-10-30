const formulario = document.querySelector("#buscar_cidade");
const nome = document.querySelector("#cidade");
const botao = document.querySelector("#buscar");
const mensagem = document.querySelector("#mensagem");
const resultado = document.querySelector("#resultado");

formulario.addEventListener('submit', function(evento){
    evento.preventDefault();

    const termo = nome.value.trim();
    if(termo === ''){
        alert(`Por favor, digite um nome de localidade válido.`);
        return;
    }
    resultado.textContent = '';
    mensagem.textContent = `Buscando localidades...`;
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
        mensagem.textContent = locais.length === 0 ? 'Nenhuma localidade encontrada.':`${locais.length} ocorrências encontradas.`;
        locais.forEach(function(local){
            const item = document.createElement('li');
            const partes = [local.name, local.admin2, local.admin1, local.country].filter(Boolean);
            item.textContent = `${partes.join(', ')} (lat: ${local.latitude}, lon: ${local.longitude})`;
            resultado.appendChild(item);
        });
    }).catch(function(erro){
        mensagem.textContent = `Não foi possível buscar os dados.`;
        console.error(erro);
    }).finally(function(){
        botao.disabled = false;
    });
});