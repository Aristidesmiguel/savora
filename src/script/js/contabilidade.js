import { collection, query, getDocs, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import firebaseDatabase from "../database/firebase.js";
import functionDataBase from "../database/bancoDeDados.js";

const singOut_button = document.getElementById("singOut");


// Função para buscar produtos e calcular total de produtos e valor total do estoque
async function getProdutosInfo(uid) {
    try {
        const produtosQuery = query(collection(firebaseDatabase.db, "estoques"), where("id", "==", uid));
        const querySnapshot = await getDocs(produtosQuery);

        let totalProdutos = 0;
        let totalValorEstoque = 0;

        querySnapshot.forEach((doc) => {
            const produto = doc.data();
            totalProdutos += 1; // Conta a quantidade de produtos
            totalValorEstoque += produto.preco * produto.quantidade; // Soma o valor total do estoque
        });

        return { totalProdutos, totalValorEstoque };
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return { totalProdutos: 0, totalValorEstoque: 0 };
    }
}

// Aguarda o carregamento do DOM
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const uid = localStorage.getItem("userId"); // Pega o uid do usuário logado
        console.log(uid);
        
        const user = await functionDataBase.getUser(uid);
        const produtosInfo = await getProdutosInfo(uid); // Obtém os dados dos produtos

        const data = {
            card1: {
                totalProdutos: produtosInfo.totalProdutos,
                data: new Date().toLocaleDateString("pt-BR", { timeZone: "UTC" })  
            },
            card2: {
                stockValue: produtosInfo.totalValorEstoque.toLocaleString("pt-BR", { style: "currency", currency: "AOA" }) // Formata o valor em Kz
            },
            card3: {
                totalSaidas: "---", // Ainda não implementado
                totalEntradas: produtosInfo.totalValorEstoque.toLocaleString("pt-BR", { style: "currency", currency: "AOA" }) ,
            },
            userInfo: {
                nome: user?.nome || "---",
                email: user?.email || "---",
                telefone: user?.telefone || "---",
                nomeDoRes: user?.nome_restaurante || "---",
                descricao: user?.descricao || "---"
            }
        };

        // Atualiza o Card 1 (Total de Produtos)
        const card1 = document.querySelectorAll('.card')[0];
        if (card1) {
            card1.innerHTML = `
                <p id="color">${data.card1.totalProdutos}</p>
                <p>Total de produtos</p>
                <p id="color">${data.card1.data}</p>
                <p>Data</p>
            `;
        }

        // Atualiza o Card 2 (Valor Total do Estoque)
        const card2 = document.querySelectorAll('.card')[1];
        if (card2) {
            card2.innerHTML = `
                <p id="color">${data.card2.stockValue}</p>
                <p>Valor no estoque</p>
            `;
        }

        // Atualiza o Card 3 (Entradas e Saídas)
        const card3 = document.querySelectorAll('.card')[2];
        if (card3) {
            card3.innerHTML = `
                <p id="color">${data.card3.totalSaidas}</p>
                <p>Total de saídas</p>
                <p id="color">${data.card3.totalEntradas}</p>
                <p>Total de entradas</p>
            `;
        }

        // Atualiza o Card 4 (Informações do Usuário)
        const card4 = document.querySelectorAll('.card')[3];
        if (card4) {
            card4.innerHTML = `
                <h3 id="color">Informações do Usuário</h3>
                <p><strong id="color">Nome:</strong> ${data.userInfo.nome}</p>
                <p><strong id="color">Email:</strong> ${data.userInfo.email}</p>
                <p><strong id="color">Restaurante:</strong> ${data.userInfo.nomeDoRes}</p>
                <p><strong id="color">Telefone:</strong> ${data.userInfo.telefone}</p>
                <p><strong id="color">Descrição:</strong> ${data.userInfo.descricao}</p>
            `;
        }
    } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
    }
});

const auth = getAuth();

singOut_button.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log('conta encerrada!');
        window.location.href = "../../../../index.html";
      }).catch((error) => {
        console.log('erro ao encerrar a conta!'); 
      });
})
