const XLSX = require("xlsx");
const readline = require("readline-sync")
const fs = require("fs")

const fileName = "usuarios.xlsx"

// Cria uma planilha caso não exista
function criarPlanilha() {
    if (fs.existsSync(fileName)) {
        return ;
    }
    const data = [
        {ID : 1, Nome : "Alice", Idade : 25, Email: "alice@email.com"},
        {ID : 2, Nome : "Roberto", Idade : 28, Email: "Roberto@email.com"},
        {ID : 3, Nome : "elisson", Idade : 22, Email: "elisson@email.com"},
    ]

    salvarPlanilha(data)
}

function salvarPlanilha(usuarios) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(usuarios);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
    XLSX.writeFile(workbook, fileName)
}

function lerPlanilha() {
    const workbook = XLSX.readFile(fileName);
    const worksheet = workbook.Sheets["Usuarios"];
    return XLSX.utils.sheet_to_json(worksheet);
}

function criarUsuario() {
    const data = lerPlanilha();
    const id = data.length > 0 ? data[data.length -1].ID +1 : 1;
    const nome = readline.question('Digite o nome: ')
    const idade = parseInt(readline.question('Digite a idade: '))
    const email = readline.question('Digite o e-mail: ')
    
    const user = {
        ID : id,
        Idade : idade,
        Nome : nome,
        Email : email
    }

    data.push(user)
    salvarPlanilha(data)
    console.log('Usuário criado com sucesso!')
}

function listarUsuarios() {
    const data = lerPlanilha();
    console.log('\nLista de Usuários');
    console.table(data);
}

function atualizarUsuario() {
    const data = lerPlanilha();
    const id = parseInt(readline.question('Digite o ID do usuário a ser atualizado: '))

    const usuario = data.find(user => user.ID === id);
    if (!usuario) {
        console.log('Usuário não encontrado.')
        return ;
    }

    usuario.Nome = readline.question(`Novo nome (${usuario.Nome}): `) || usuario.Nome;
    usuario.Idade = parseInt(readline.question(`Novo Idade (${usuario.Idade}): `)) || usuario.Idade;
    usuario.Email = readline.question(`Novo Email (${usuario.Email}): `) || usuario.Email;

    salvarPlanilha(data);
    console.log('Usuário atualizado com sucesso!');
}

function deletarUsuario() {
    let data = lerPlanilha();
    const id = parseInt(readline.question("Digite o ID do usuário a ser deletado: "));

    const novoData = data.filter(user => user.ID !== id);
    if (novoData.length === data.length) {
        console.log("Usuário não encontrado!\n");
        return;
    }

    salvarPlanilha(novoData);
    console.log("Usuário deletado com sucesso!\n");
}

function menu() {
    criarPlanilha();

    let rodando = true;
    while (rodando) {
        console.log(`
            1. Criar Usuário
            2. Listar Usuários
            3. Atualizar Usuário
            4. Deletar Usuário
            5. Sair
            `)
    const opcao = readline.question('Escolha uma opcao: ')

    switch (opcao) {
        case '1':
            criarUsuario();
            break
        case '2':
            listarUsuarios();
            break
        case '3':
            atualizarUsuario();
            break
        case '4':
            deletarUsuario();
            break
        case '5':
            rodando = false;
            console.log('Tchauzinho...')
            break
        default:
            console.log('Opção inválida! Tente novamente! \n')
    }
}
}


menu()