import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import firebaseDatabase from "../database/firebase.js";

const user_name = document.getElementById("user_name");
const user_email = document.getElementById("user_email");
const user_password = document.getElementById("user_password");
const user_password_confirm = document.getElementById("user_password_confirm");
const user_tel = document.getElementById("user_tel");
const name_restaurant = document.getElementById("name_restaurant");
const cadastrar = document.getElementById("cadastrar");
const textarea = document.getElementById("textarea");

const auth = getAuth();

// Função para verificar os campos antes do cadastro
const verificarCampos = async () => {
    const nome = user_name.value.trim();
    const email = user_email.value.trim();
    const senha = user_password.value.trim();
    const senhaConfirm = user_password_confirm.value.trim();
    const tel = user_tel.value.trim();
    const restaurant = name_restaurant.value.trim();
    const descricao = textarea.value.trim();

    if (!nome || !email || !senha || !tel || !restaurant) {
        alert("Preencha todos os campos!");
        return;
    }

    if (senha !== senhaConfirm) {
        alert("As senhas não conferem!");
        return;
    }

    try {
        cadastrar.textContent = 'cadastrando...'
        // Criar usuário no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const uid = userCredential.user.uid;
        console.log("Usuário criado:", uid);
        localStorage.setItem("userId", uid);
        // Criar objeto do usuário
        const userData = userObject(uid, nome, email, tel, restaurant, descricao);
        
        // Salvar no Firestore com o UID como chave
        await addUser(uid, userData);
        console.log("Usuário salvo no Firestore!");
    } catch (error) {
        console.error("Erro ao criar usuário:", error.message);
        cadastrar.textContent = 'cadastrar'
    }
};

// Função para adicionar usuário ao Firestore
const addUser = async (uid, userData) => {
    try {
        await setDoc(doc(firebaseDatabase.db, "usuarios", uid), userData);
        console.log("Usuário cadastrado com sucesso!");
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.href = "../pages/contalibidade.html";
    } catch (error) {
        console.error("Erro ao adicionar usuário ao Firestore:", error);
    }
};

// Função para estruturar o objeto do usuário
const userObject = (id, nome, email, telefone, nome_restaurante, descricao) => {
    return {
        id, // Agora o ID vem do Firebase Authentication
        nome,
        email,
        telefone,
        nome_restaurante,
        descricao
    };
};

const usuario_local = localStorage.getItem('user');
console.log(usuario_local); 

// Evento de clique para cadastrar usuário
cadastrar.addEventListener("click", () => {
    verificarCampos();
});
