const comecar_btn = document.getElementById('comecar')
const cadastrar_btn = document.getElementById('cadastrar')

const user = localStorage.getItem('user')
const user_local = JSON.parse(user)

comecar_btn.addEventListener('click', () => {
    if (user_local) {
        location.href = '../../src/pages/contalibidade.html'
    } else {
        alert('Tens que iniciar secção primeiro')
    }
})

cadastrar_btn.addEventListener('click', () => {
    if (user_local) {
        location.href = '../../src/pages/contalibidade.html'
    } else {
       location.href = '../../src/pages/singUp.html'
    }
})

