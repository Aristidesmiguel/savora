const navbar = document.getElementById('navbar_router')



const router = [
    {
        nome: 'Login',
        push: '../../src/pages/login.html'
    },
    {
        nome: 'Cadastra-se',
        push: '../../src/pages/singUp.html'
    }
]

const navigate = () => {
    const ul = document.createElement('ul')
    router.forEach(rotas => {
        const a = document.createElement('a')
        const li = document.createElement('li')
        ul.append(li)
        li.append(a)
        a.textContent = rotas.nome
        a.setAttribute('href', rotas.push)
        navbar.append(ul)
    })
}

navigate()

