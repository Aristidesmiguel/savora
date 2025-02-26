import functionDataBase from "../database/bancoDeDados.js";

const salvarSaida = document.getElementById('salvar');
const formSaida = document.getElementById('tbody');
const descricao = document.getElementById('descricao');
const valor = document.getElementById('valor');

console.log(descricao.value);


const uid = localStorage.getItem("userId");

// Recupera os dados do localStorage ou inicializa um array vazio
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
const produto = await functionDataBase.getProdutosInfo(uid);
let userId = JSON.parse(localStorage.getItem("user"))
;
    
console.log(produto, uid);


async function start()  {
    const n = Number(valor.value);
    let estoqueTotal = produto.totalValorEstoque; 
        if (descricao.value.trim() === "" || isNaN(n) || n <= 0) {
            alert("erro!");
            return;
        }
        estoqueTotal -= n;
        produto.totalValorEstoque = estoqueTotal; 
        const item = itemObject(n);
        estoque.push(item);
        console.log(estoqueTotal);
        localStorage.setItem('totalEstoque', estoqueTotal)
        localStorage.setItem("estoque", JSON.stringify(estoque));
        
        addRowToTable(item);

        
        descricao.value = "";
        valor.value = "";  
}

function getData() {
    formSaida.innerHTML = ""; // Limpa a tabela antes de adicionar os itens
    if (estoque.length === 0) {
        formSaida.innerHTML = "<tr><td colspan='3'>Sem saídas encontradas!</td></tr>";
    } else {
        estoque.forEach(addRowToTable);
    }
}

function addRowToTable(item) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${item.description}</td>
        <td>${item.valor.toFixed(2)} Kz</td>
        <td>${item.data}</td>`;
    formSaida.appendChild(tr);
}

function itemObject(n) {
    return {
        uid: uid === null ? userId : uid,
        id: estoque.length,
        description: descricao.value,
        valor: n,
        data: new Date().toLocaleDateString(),
    };
}

salvarSaida.addEventListener('click', start);

// Carrega os dados ao iniciar a página
getData();

