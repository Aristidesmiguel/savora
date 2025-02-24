import { collection, addDoc, onSnapshot, query, deleteDoc, doc, updateDoc, getDoc, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import firebaseDatabase from "../database/firebase.js";

// Configuração do Firebase


// Elementos do DOM
const modalAdicionar = document.getElementById('modalAdicionar');
const modalExcluir = document.getElementById('modalExcluir');
const adicionarProdutoBtn = document.getElementById('adicionarProdutoBtn');
const closeModal = document.getElementById('closeModal');
const closeModalExcluir = document.getElementById('closeModalExcluir');
const produtoName = document.getElementById('nomeProduto');
const quantidade = document.getElementById('quantidadeProduto');
const preco = document.getElementById('precoProduto');
const data = document.getElementById('dataProduto');
const adicionarProduto = document.getElementById('adicionarProduto');
const estoqueLista = document.getElementById('estoqueLista');
const mensagemDiv = document.getElementById('mensagem');
const confirmarExcluir = document.getElementById("confirmarExcluir");
const cancelarExcluir = document.getElementById("cancelarExcluir");

let produtoParaExcluir = null;
let editandoProdutoId = null;


// Funções de modal
function abrirModal(modal) {
  if (modal) {
    modal.style.display = "flex";
  } else {
    console.log('Elemento HTML não encontrado!');
    
  }
}

function fecharModal(modal) {
  if (modal) {
    modal.style.display = "none";
  } else {
    console.log('Elemento HTML não encontrado!');
    
  }
}

function limparCamposModalAdicionar() {
  produtoName.value = "";
  quantidade.value = "";
  preco.value = "";
  data.value = "";
}

fecharModal(modalAdicionar);
fecharModal(modalExcluir);

// Exibir mensagens de feedback
function exibirMensagem(texto, tipo) {
  mensagemDiv.textContent = texto;
  mensagemDiv.className = `mensagem ${tipo}`;
  mensagemDiv.style.display = "block";
  setTimeout(() => mensagemDiv.style.display = "none", 3000);
}

// Editar produto
async function editarProduto(id) {
  try {
    const docRef = doc(firebaseDatabase.db, "estoques", id);
    const produtoSnap = await getDoc(docRef);
    if (produtoSnap.exists()) {
      const produto = produtoSnap.data();
      produtoName.value = produto.nome || "";
      quantidade.value = produto.quantidade || "";
      preco.value = produto.preco || "";
      data.value = produto.data || "";
      editandoProdutoId = id;
      abrirModal(modalAdicionar);
      exibirMensagem("Pronto para editar o produto!", "info");
    } else {
      exibirMensagem("Produto não encontrado!", "erro");
    }
  } catch (error) {
    exibirMensagem("Erro ao carregar o produto para edição.", "erro");
    console.error("Erro ao editar: ", error);
  }
}

adicionarProdutoBtn.addEventListener('click', () => {
  limparCamposModalAdicionar(); // Garante que os campos estejam vazios
  editandoProdutoId = null; // Garante que você não entre em modo de edição
  abrirModal(modalAdicionar);
});

const uid = localStorage.getItem("userId");

// Salvar ou editar produto no Firestore
async function salvarProdutoNoFirestore() {
  const nomeProduto = produtoName.value.trim();
  const quantidadeProduto = Number(quantidade.value);
  const precoProduto = Number(preco.value);
  const dataProduto = data.value;


  if (!nomeProduto || isNaN(quantidadeProduto) || quantidadeProduto <= 0 || isNaN(precoProduto) || precoProduto <= 0 || !dataProduto) {
    exibirMensagem("Preencha todos os campos corretamente!", "erro");
    return;
  }

  try {
    if (editandoProdutoId) {
      await updateDoc(doc(firebaseDatabase.db, "estoques", editandoProdutoId), {
        id: uid,
        nome: nomeProduto,
        quantidade: quantidadeProduto,
        preco: precoProduto,
        data: dataProduto
      });
      exibirMensagem("Produto atualizado com sucesso!", "sucesso");
      editandoProdutoId = null;
    } else {
      await addDoc(collection(firebaseDatabase.db, "estoques"), {
        id: uid,
        nome: nomeProduto,
        quantidade: quantidadeProduto,
        preco: precoProduto,
        data: dataProduto,
        dataDeCriacao: new Date().toISOString()
      });
      exibirMensagem("Produto adicionado com sucesso!", "sucesso");
    }
    fecharModal(modalAdicionar);
    limparCamposModalAdicionar();
  } catch (error) {
    exibirMensagem("Erro ao salvar o produto!", "erro");
    console.error("Erro ao salvar: ", error);
  }
}

// Excluir produto
confirmarExcluir.addEventListener("click", async () => {
  if (produtoParaExcluir) {
    try {
      await deleteDoc(doc(firebaseDatabase.db, "estoques", produtoParaExcluir));
      exibirMensagem("Produto excluído com sucesso!", "sucesso");
      fecharModal(modalExcluir);
      produtoParaExcluir = null;
    } catch (error) {
      exibirMensagem("Erro ao excluir o produto!", "erro");
    }
  }
});

// Renderizar produtos
function renderizarProdutos() {
  const produtosQuery = query(collection(firebaseDatabase.db, "estoques"), where("id", "==", uid));
  onSnapshot(produtosQuery, (snapshot) => {
    estoqueLista.innerHTML = '';
    let contador = 1;
    snapshot.forEach((doc) => {
      const produto = doc.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${contador++}</td>
        <td>${produto.nome}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.preco.toFixed(2)}</td>
        <td>${produto.data}</td>
        <td>
          <button class="btn-edit" data-id="${doc.id}"><img src="../image/add.png"/></button>
          <button class="btn-delete" data-id="${doc.id}"><img src="../image/delete.png"/></button>
        </td>`;
      estoqueLista.appendChild(tr);
      tr.querySelector('.btn-edit').addEventListener('click', () => editarProduto(doc.id));
      tr.querySelector('.btn-delete').addEventListener('click', () => {
        produtoParaExcluir = doc.id;
        abrirModal(modalExcluir);
      });
    });
  });
}

console.log(modalAdicionar);


// Eventos de clique
adicionarProdutoBtn.addEventListener('click', () => abrirModal(modalAdicionar));
closeModal.addEventListener('click', () => fecharModal(modalAdicionar));
closeModalExcluir.addEventListener('click', () => fecharModal(modalExcluir));
cancelarExcluir.addEventListener('click', () => fecharModal(modalExcluir));
adicionarProduto.addEventListener('click', salvarProdutoNoFirestore);

// Iniciar
renderizarProdutos();
