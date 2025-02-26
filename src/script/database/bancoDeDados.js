import { doc, getDoc, collection, query, getDocs, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import firebaseDatabase from "../database/firebase.js"; 

const getUser = async (uid) => {
    try {
        const userRef = doc(firebaseDatabase.db, "usuarios", uid); // Referência ao documento do usuário
        const userSnap = await getDoc(userRef); // Obtém os dados do Firestore

        if (userSnap.exists()) {
            const userData = userSnap.data(); // Extrai os dados
            console.log("Usuário encontrado:", userData);
            return userData; // Retorna os dados do usuário
        } else {
            console.log("Usuário não encontrado.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return null;
    }
};

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
        return { totalProdutos: 0, totalValorEstoque: 0,  };
    }
}

const functionDataBase = {
    getUser,
    getProdutosInfo
}

export default functionDataBase
