import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import firebaseDatabase from "../database/firebase.js";

const user_email_login = document.getElementById("user_email");
const user_password_login = document.getElementById("user_password");
const loginButton = document.getElementById("loginButton");

const auth = getAuth(firebaseDatabase.app)

const login = (auth, email, password) => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        console.log("Login realizado com sucesso", user); 
        if (user) {
            window.location.href = "../pages/contalibidade.html";
        }
    }).catch((error) => {
        console.log("Erro ao fazer login: " + error.message); // Exibe uma mensagem de erro detalhada
    })
}

loginButton.addEventListener("click", () => {
    login(auth, user_email_login.value, user_password_login.value);
});

//Essa é a parte responsável por fazer o login do usuário.
