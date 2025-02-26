const router_navigate = document.getElementById('nav_bar_router')

const user_router = [
    {
        nome: 'Contabilidade',
        push: '../../src/pages/contalibidade.html'
    },
    {
        nome: 'Saídas',
        push: '../../src/pages/saidas.html'
    },
    {
        nome: 'Cadastro de Produtos',
        push: '../../src/pages/produtos.html'
    },
]

const router_error = '../../src/pages/naoEncontado.html'

const navigate_user = () => {
    user_router.forEach(rotas => {
        const a = document.createElement('a')
        a.textContent = rotas.nome
        if (!a || !rotas) {
            a.setAttribute('href', router_error)
        } else {
            a.setAttribute('href', rotas.push)
        }	
        router_navigate.append(a)
    })
}

navigate_user()