import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import functionDataBase from "../database/bancoDeDados.js";
import firebaseDatabase from "../database/firebase.js";

const salvarSaida = document.getElementById('salvar');
const formSaida = document.getElementById('tbody');
const descricao = document.getElementById('descricao');
const valor = document.getElementById('valor');

console.log(descricao.value);


const uid = localStorage.getItem("userId");

// Recupera os dados do localStorage ou inicializa um array vazio
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
const produto = functionDataBase.getProdutosInfo(uid);


    
console.log(produto, uid);
const produtoRef = doc(firebaseDatabase.db, "estoques", uid); 
    const produtoSnap = await getDoc(produtoRef);
    console.log(produtoSnap.data());
async function start()  {
    const n = Number(valor.value);

    
    

    produto.then(data => {
        if (descricao.value.trim() === "" || isNaN(n) || n <= 0 || n > data.totalValorEstoque) {
            alert("erro!");
            return;
        }
    
        const item = itemObject();
        estoque.push(item);
        data.totalValorEstoque -= n;
        console.log(data.totalValorEstoque);
        localStorage.setItem("estoque", JSON.stringify(estoque));
        
        addRowToTable(item);

        
        descricao.value = "";
        valor.value = "";
    })
   
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

function itemObject() {
    return {
        uid: uid,
        id: estoque.length,
        description: descricao.value,
        valor: Number(valor.value),
        data: new Date().toLocaleDateString(),
    };
}

salvarSaida.addEventListener('click', start);

// Carrega os dados ao iniciar a página
getData();

