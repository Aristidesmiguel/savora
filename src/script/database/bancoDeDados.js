import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

const functionDataBase = {
    getUser,
}

export default functionDataBase
