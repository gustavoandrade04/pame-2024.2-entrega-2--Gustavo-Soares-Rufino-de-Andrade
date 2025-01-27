const readline = require('readline'); // Declare a constante readline apenas uma vez
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const fs = require('fs');  // Importação do módulo fs

class Reserva {
  constructor(id, idCliente, status, dataEntrada, dataSaida, tipoQuarto, numeroCamas) {
    this.id = id;
    this.idCliente = idCliente;
    this.status = status;
    this.dataEntrada = dataEntrada;
    this.dataSaida = dataSaida;
    this.tipoQuarto = tipoQuarto;
    this.numeroCamas = numeroCamas;
  }
}

class Funcionario {
  constructor(id, nomeUsuario, cpf, email, senha) {
    this.id = id;
    this.nomeUsuario = nomeUsuario;
    this.cpf = cpf;
    this.email = email;
    this.senha = senha;
  }
}

class Cliente {
  constructor(id, nome, dataNascimento, cpf, email, senha) {
    this.id = id;
    this.nome = nome;
    this.dataNascimento = dataNascimento;
    this.cpf = cpf;
    this.email = email;
    this.senha = senha;
  }
}

class Quarto {
  constructor(nome, descricao, quantidadeCamas, precoPorNoite, quantidadeDisponivel) {
    this.nome = nome;
    this.descricao = descricao;
    this.quantidadeCamas = quantidadeCamas;
    this.precoPorNoite = precoPorNoite;
    this.quantidadeDisponivel = quantidadeDisponivel;
  }
}

class Sistema {
  constructor() {
    this.reservas = [];
    this.funcionarios = [];
    this.clientes = [];
    this.quartos = [];
    this.configurarQuartos();
  }
  salvarDados() {
    const dados = {
      reservas: this.reservas,
      funcionarios: this.funcionarios,
      clientes: this.clientes,
      quartos: this.quartos,
    };
    fs.writeFileSync('sistema.json', JSON.stringify(dados, null, 2));
    console.log("\nDados salvos com sucesso!");
  }
  
  carregarDados() {
    if (fs.existsSync('sistema.json')) {
      const dados = JSON.parse(fs.readFileSync('sistema.json', 'utf8'));
      this.reservas = dados.reservas || [];
      this.funcionarios = dados.funcionarios || [];
      this.clientes = dados.clientes || [];
      this.quartos = dados.quartos || [];
      console.log("\nDados carregados com sucesso!");
    } else {
      console.log("\nNenhum dado encontrado. Iniciando sistema vazio.");
    }
  }
  

  adicionarReserva(reserva) {
    this.reservas.push(reserva);
  }

  adicionarFuncionario(funcionario) {
    this.funcionarios.push(funcionario);
  }

  adicionarCliente(cliente) {
    this.clientes.push(cliente);
  }

  listarReservas() {
    return this.reservas;
  }

  listarFuncionarios() {
    return this.funcionarios;
  }

  listarClientes() {
    return this.clientes;
  }

  listarQuartos() {
    return this.quartos;
  }

  buscarClientePorEmailSenha(email, senha) {
    console.log("Procurando cliente com email:", email, "e senha:", senha);
    const clienteEncontrado = this.clientes.find(cliente => cliente.email === email && cliente.senha === senha);
    console.log("Cliente encontrado:", clienteEncontrado);
    return clienteEncontrado;
    
  }
  

  gerarIdCliente() {
    return this.clientes.length + 1;
  }

  gerarIdReserva() {
    return this.reservas.length + 1;
  }

  configurarQuartos() {
    
    this.quartos.push(new Quarto("CCE", "Quarto com vista para a parte interna do hotel, aconchegante e simples, um só cômodo", 1, 350, 12));
    this.quartos.push(new Quarto("CCE", "Quarto com vista para a parte interna do hotel, aconchegante e simples, um só cômodo", 2, 450, 15));
    this.quartos.push(new Quarto("CCE", "Quarto com vista para a parte interna do hotel, aconchegante e simples, um só cômodo", 3, 550, 10));

    
    this.quartos.push(new Quarto("PRO", "Quarto com vista para a praia, aconchegante, com banheira e com mini closet embutido", 1, 600, 10));
    this.quartos.push(new Quarto("PRO", "Quarto com vista para a praia, aconchegante, com banheira e com mini closet embutido", 2, 700, 10));
    this.quartos.push(new Quarto("PRO", "Quarto com vista para a praia, aconchegante, com banheira e com mini closet embutido", 3, 850, 10));

    
    this.quartos.push(new Quarto("Presidencial", "Quarto para um verdadeiro fluxer, 2 cômodos, cozinha, closet, hidromassagem e uma vista única para o mar", 1, 1000, 5));
    this.quartos.push(new Quarto("Presidencial", "Quarto para um verdadeiro fluxer, 2 cômodos, cozinha, closet, hidromassagem e uma vista única para o mar", 2, 1200, 5));
    this.quartos.push(new Quarto("Presidencial", "Quarto para um verdadeiro fluxer, 2 cômodos, cozinha, closet, hidromassagem e uma vista única para o mar", 3, 1500, 5));
  }

  listarQuartosDisponiveis() {
    console.log("\n[Quartos Disponíveis]");
    const quartosAgrupados = {};

    
    this.quartos.forEach((quarto) => {
      const key = `${quarto.nome}-${quarto.quantidadeCamas}`;
      if (!quartosAgrupados[key]) {
        quartosAgrupados[key] = {
          nome: quarto.nome,
          descricao: quarto.descricao,
          quantidadeCamas: quarto.quantidadeCamas,
          precoPorNoite: quarto.precoPorNoite,
          quantidadeDisponivel: 0,
        };
      }
      
      quartosAgrupados[key].quantidadeDisponivel += quarto.quantidadeDisponivel;
    });

    
    Object.values(quartosAgrupados).forEach((info, index) => {
      if (info.quantidadeDisponivel > 0) {
        console.log(
          `${index + 1}. Tipo: ${info.nome}, Descrição: ${info.descricao}, Número de Camas: ${info.quantidadeCamas}, Preço: R$${info.precoPorNoite}, Disponíveis: ${info.quantidadeDisponivel}`
        );
      }
    });
  }

  

  reservarQuarto(idCliente, tipoQuarto, numeroCamas, dataEntrada, dataSaida) {
   
    const quarto = this.quartos.find(
      (q) =>
        q.nome === tipoQuarto &&
        q.quantidadeCamas === numeroCamas &&
        q.quantidadeDisponivel > 0
    );
  
    if (!quarto) {
      console.log("\nDesculpe, não há quartos disponíveis para essa opção.");
      return;
    }
  
    
    const idReserva = this.gerarIdReserva();
    const novaReserva = new Reserva(
      idReserva,
      idCliente,
      "Confirmada",
      dataEntrada,
      dataSaida,
      tipoQuarto,
      numeroCamas
    );
    this.adicionarReserva(novaReserva);
  
    
    quarto.quantidadeDisponivel -= 1;
    console.log("\nReserva realizada com sucesso! ID da reserva:", idReserva);
  }
}
function perguntar(mensagem) {
  return new Promise((resolve) => rl.question(mensagem, resolve));
}

async function cadastroCliente(sistema) {
  console.log("\n[Cadastro de Cliente]");

  const nome = await perguntar("Digite seu nome: ");
  const cpf = await perguntar("Digite seu CPF: ");
  const email = await perguntar("Digite seu e-mail: ");
  const dataNascimento = await perguntar("Digite sua data de nascimento (DD/MM/AAAA): ");
  const senha = await perguntar("Digite uma senha: ");

  const id = sistema.gerarIdCliente();
  const novoCliente = new Cliente(id, nome, dataNascimento, cpf, email, senha);

  sistema.adicionarCliente(novoCliente);
console.log("\nCadastro realizado com sucesso! Seu ID é:", id);
console.log("Clientes cadastrados:", sistema.clientes); 

}

async function loginCliente(sistema) {
  console.log("\n[Login de Cliente]");

  const email = await perguntar("Digite seu e-mail: ");
  const senha = await perguntar("Digite sua senha: ");

  const cliente = sistema.buscarClientePorEmailSenha(email, senha);

  if (cliente) {
    console.log("\nBem-vindo, " + cliente.nome + "! Login realizado com sucesso.");

    console.log("\nO que você gostaria de fazer?");
    console.log("1. Fazer uma nova reserva");
    console.log("2. Consultar minhas reservas");

    const escolha = await perguntar("Escolha uma opção (1/2): ");

    if (escolha === "1") {
      await reservarQuartoCliente(sistema, cliente);
    } else if (escolha === "2") {
      await consultarReservasCliente(sistema, cliente);
      if (sistema.reservas.filter(reserva => reserva.idCliente === cliente.id).length === 0) {
        console.log("Você não tem reservas. Deslogando...");
        return;  // Desloga o cliente
      }
    } else {
      console.log("\nOpção inválida. Tente novamente.");
    }
  } else {
    console.log("\nLogin falhou. Verifique suas credenciais e tente novamente.");
  }
}
const prompt = require("prompt-sync")();

let usuarios = [];
let reservas = [];
let usuarioLogado = null;
// Função para validar CPF
function validarCPF(cpf) {
  return /^\d{11}$/.test(cpf);
}

// Função para validar e-mail
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Função para validar datas (check-in e check-out)
function validarDatas(checkIn, checkOut) {
  const dataCheckIn = new Date(checkIn);
  const dataCheckOut = new Date(checkOut);

  return (
    !isNaN(dataCheckIn) &&
    !isNaN(dataCheckOut) &&
    dataCheckIn < dataCheckOut &&
    dataCheckIn >= new Date()
  );
}

async function consultarReservasCliente(sistema, cliente) {
  console.log("\n[Consultando Reservas]");

  
  const reservasCliente = sistema.reservas.filter(reserva => reserva.idCliente === cliente.id);

  if (reservasCliente.length === 0) {
    console.log("\nVocê ainda não tem reservas.");
  } else {
    reservasCliente.forEach((reserva, index) => {
      console.log(`\nReserva ${index + 1}:`);
      console.log(`- Tipo de Quarto: ${reserva.tipoQuarto}`);
      console.log(`- Número de Camas: ${reserva.numeroCamas}`);
      console.log(`- Data de Entrada: ${reserva.dataEntrada}`);
      console.log(`- Data de Saída: ${reserva.dataSaida}`);
      console.log(`- Status: ${reserva.status}`);

      
      const quartoReservado = sistema.quartos.find(q => q.nome === reserva.tipoQuarto && q.quantidadeCamas === reserva.numeroCamas);
      const numeroNoites = calcularNumeroDeNoites(reserva.dataEntrada, reserva.dataSaida);
      const valorTotal = quartoReservado.precoPorNoite * numeroNoites;
      console.log(`- Valor Total: R$ ${valorTotal.toFixed(2)}`);
    });
  }
}


function calcularNumeroDeNoites(dataEntrada, dataSaida) {
  const [diaEntrada, mesEntrada, anoEntrada] = dataEntrada.split("/").map(num => parseInt(num, 10));
  const [diaSaida, mesSaida, anoSaida] = dataSaida.split("/").map(num => parseInt(num, 10));

  const entrada = new Date(anoEntrada, mesEntrada - 1, diaEntrada);
  const saida = new Date(anoSaida, mesSaida - 1, diaSaida);
  
  const diferencia = saida - entrada;
  return diferencia / (1000 * 3600 * 24);
}
function validarCPF(cpf) {
  return /^\d{11}$/.test(cpf);
}

function validarEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function validarData(data) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = data.match(regex);
  if (!match) return false;
  const [_, dia, mes, ano] = match;
  const dataNascimento = new Date(`${ano}-${mes}-${dia}`);
  return dataNascimento instanceof Date && !isNaN(dataNascimento);
}

async function gerenciarReserva(sistema, cliente) {
  console.log("\n[Gerenciamento de Reserva]");

  if (!cliente.reserva) {
    console.log("Você não possui nenhuma reserva ativa.");
    return;
  }

  const reservaAtual = cliente.reserva;

  console.log("\n[Resumo da Reserva Atual]");
  console.log(`Tipo de quarto: ${reservaAtual.quarto.tipo}`);
  console.log(`Descrição: ${reservaAtual.quarto.descricao}`);
  console.log(`Quantidade de camas: ${reservaAtual.quarto.quantidadeCamas}`);
  console.log(`Check-in: ${reservaAtual.checkIn}`);
  console.log(`Check-out: ${reservaAtual.checkOut}`);
  console.log(`Valor total: R$${reservaAtual.valorTotal.toFixed(2)}`);

  const acao = await perguntar("\nO que você deseja fazer?\n1 - Alterar Reserva\n2 - Cancelar Reserva\nEscolha uma opção: ");

  if (acao === "1") {
    await alterarReserva(sistema, cliente);
  } else if (acao === "2") {
    cancelarReserva(sistema, cliente);
  } else {
    console.log("\nOpção inválida. Retornando ao menu principal.");
  }
}

async function alterarReserva(sistema, cliente) {
  console.log("\n[Alteração da Reserva]");

  const quartos = [
    new Quarto("CCE", "Quarto com vista para a parte interna do hotel, aconchegante e simples, um só cômodo", 1, 350, 12),
    new Quarto("CCE", "Quarto com vista para a parte interna do hotel, aconchegante e simples, um só cômodo", 2, 450, 15),
    new Quarto("CCE", "Quarto com vista para a parte interna do hotel, aconchegante e simples, um só cômodo", 3, 550, 10),

    new Quarto("PRO", "Quarto com vista para a praia, aconchegante, com banheira e com mini closet embutido", 1, 600, 10),
    new Quarto("PRO", "Quarto com vista para a praia, aconchegante, com banheira e com mini closet embutido", 2, 700, 10),
    new Quarto("PRO", "Quarto com vista para a praia, aconchegante, com banheira e com mini closet embutido", 3, 850, 10),

    new Quarto("Presidencial", "Quarto para um verdadeiro fluxer, 2 cômodos, cozinha, closet, hidromassagem e uma vista única para o mar", 1, 1000, 5),
    new Quarto("Presidencial", "Quarto para um verdadeiro fluxer, 2 cômodos, cozinha, closet, hidromassagem e uma vista única para o mar", 2, 1200, 5),
    new Quarto("Presidencial", "Quarto para um verdadeiro fluxer, 2 cômodos, cozinha, closet, hidromassagem e uma vista única para o mar", 3, 1500, 5),
  ];

  console.log("\nOpções de quartos disponíveis:");
  quartos.forEach((quarto, index) => {
    console.log(`${index + 1} - ${quarto.tipo} (${quarto.descricao}) - Camas: ${quarto.quantidadeCamas} - R$${quarto.precoPorNoite}/noite - Disponibilidade: ${quarto.disponibilidade}`);
  });

  const escolhaQuarto = parseInt(await perguntar("\nEscolha o novo quarto pelo número correspondente: "));
  if (escolhaQuarto <= 0 || escolhaQuarto > quartos.length) {
    console.log("Opção de quarto inválida.");
    return;
  }

  const quartoEscolhido = quartos[escolhaQuarto - 1];

  const novoCheckIn = await perguntar("Digite a nova data de check-in (DD/MM/AAAA): ");
  const novoCheckOut = await perguntar("Digite a nova data de check-out (DD/MM/AAAA): ");

  const dataCheckIn = new Date(novoCheckIn.split('/').reverse().join('-'));
  const dataCheckOut = new Date(novoCheckOut.split('/').reverse().join('-'));

  if (dataCheckOut <= dataCheckIn) {
    console.log("Data de check-out deve ser após a data de check-in.");
    return;
  }

  const totalDias = Math.ceil((dataCheckOut - dataCheckIn) / (1000 * 60 * 60 * 24));
  const novoValorTotal = totalDias * quartoEscolhido.precoPorNoite;

  console.log("\n[Resumo da Nova Reserva]");
  console.log(`Tipo de quarto: ${quartoEscolhido.tipo}`);
  console.log(`Descrição: ${quartoEscolhido.descricao}`);
  console.log(`Quantidade de camas: ${quartoEscolhido.quantidadeCamas}`);
  console.log(`Check-in: ${novoCheckIn}`);
  console.log(`Check-out: ${novoCheckOut}`);
  console.log(`Total de noites: ${totalDias}`);
  console.log(`Valor total: R$${novoValorTotal.toFixed(2)}`);

  const confirmar = await perguntar("\nDeseja confirmar as alterações? (S/N): ");
  if (confirmar.toLowerCase() === "s") {
    cliente.reserva = {
      quarto: quartoEscolhido,
      checkIn: novoCheckIn,
      checkOut: novoCheckOut,
      valorTotal: novoValorTotal,
    };
    console.log("\nAlteração realizada com sucesso!");
  } else {
    console.log("\nAlteração cancelada.");
  }
}

function cancelarReserva(sistema, cliente) {
  console.log("\n[Cancelamento da Reserva]");
  const confirmar = prompt("\nTem certeza de que deseja cancelar a reserva? (S/N): ");
  if (confirmar.toLowerCase() === "s") {
    cliente.reserva = null;
    console.log("\nReserva cancelada com sucesso.");
  } else {
    console.log("\nCancelamento abortado.");
  }
}



async function cadastroFuncionario(sistema) {
  console.log("\n[Cadastro de Funcionário]");

  const nomeUsuario = await perguntar("Digite seu nome: ");
  const cpf = await perguntar("Digite seu CPF: ");
  const email = await perguntar("Digite seu e-mail: ");
  const senha = await perguntar("Digite uma senha: ");
  const senhaHotel = await perguntar("Digite a senha do hotel para concluir o cadastro: ");

  if (senhaHotel !== "fluxo") {
    console.log("\nSenha do hotel incorreta. Cadastro cancelado.");
    return;
  }

  const id = sistema.funcionarios.length + 1;
  const novoFuncionario = new Funcionario(id, nomeUsuario, cpf, email, senha);

  sistema.adicionarFuncionario(novoFuncionario);
  console.log("\nCadastro de funcionário realizado com sucesso! Seu ID é:", id);
}
async function loginFuncionario(sistema) {
  console.log("\n[Login de Funcionário]");

  const email = await perguntar("Digite seu e-mail: ");
  const senha = await perguntar("Digite sua senha: ");
  const senhaHotel = await perguntar("Digite a senha do hotel: ");

  if (senhaHotel !== "fluxo") {
    console.log("\nSenha do hotel incorreta. Login cancelado.");
    return;
  }

  const funcionario = sistema.funcionarios.find(f => f.email === email && f.senha === senha);

  if (funcionario) {
    console.log(`\nBem-vindo, ${funcionario.nomeUsuario}! Login realizado com sucesso.`);
    console.log("\n[Área de Funcionários]");
    
  } else {
    console.log("\nLogin falhou. Verifique suas credenciais e tente novamente.");
  }
}


async function reservarQuartoCliente(sistema, cliente) {
  console.log("\n[Reserva de Quarto]");

  const tiposDeQuartosDisponiveis = [...new Set(sistema.quartos.map(quarto => quarto.nome))];

  tiposDeQuartosDisponiveis.forEach((tipo, index) => {
    console.log(`${index + 1}. Tipo: ${tipo}`);
  });

  const escolhaTipoQuarto = parseInt(await perguntar("Escolha o tipo de quarto (1 para CCE, 2 para PRO, 3 para Presidencial ou 0 para voltar): "), 10);

  if (escolhaTipoQuarto === 0) return; // Se voltar, retorna à seleção de tipo de quarto.

  const tipoQuartoEscolhido = tiposDeQuartosDisponiveis[escolhaTipoQuarto - 1];

  const quartosTipoEscolhido = sistema.quartos.filter(quarto => quarto.nome === tipoQuartoEscolhido && quarto.quantidadeDisponivel > 0);

  if (quartosTipoEscolhido.length === 0) {
    console.log("\nDesculpe, não há quartos disponíveis desse tipo.");
    return;
  }

  console.log("\nEscolha o número de camas disponíveis para o quarto:", tipoQuartoEscolhido);

  const numerosCamasDisponiveis = [...new Set(quartosTipoEscolhido.map(quarto => quarto.quantidadeCamas))]; 

  numerosCamasDisponiveis.forEach((quantidade, index) => {
    console.log(`${index + 1}. Número de camas: ${quantidade}`);
  });

  const numeroCamasEscolhido = parseInt(await perguntar("Escolha o número de camas (ou 0 para voltar): "), 10);

  if (numeroCamasEscolhido === 0) return; // Voltar à escolha de tipo de quarto

  if (!numerosCamasDisponiveis.includes(numeroCamasEscolhido)) {
    console.log("\nOpção de número de camas inválida. Tente novamente.");
    return;
  }

  const dataEntrada = await perguntar("Digite a data de entrada (DD/MM/AAAA): ");
  const dataSaida = await perguntar("Digite a data de saída (DD/MM/AAAA): ");

  const numeroNoites = calcularNumeroDeNoites(dataEntrada, dataSaida);
  if (numeroNoites <= 0) {
    console.log("\nData de saída deve ser posterior à data de entrada.");
    return;
  }

  sistema.reservarQuarto(cliente.id, tipoQuartoEscolhido, numeroCamasEscolhido, dataEntrada, dataSaida);
}

const sistema = new Sistema();
sistema.carregarDados();

// Menu inicial
function menuInicial() {
  console.log("\n=== Bem-vindo ao Sistema de Reservas ===");
  console.log("1. Cadastro");
  console.log("2. Login");
  console.log("3. Sair");

  const opcao = prompt("Escolha uma opção: ");

  switch (opcao) {
    case "1":
      cadastrarUsuario();
      break;
    case "2":
      login();
      break;
    case "3":
      console.log("Saindo do sistema...");
      process.exit();
    default:
      console.log("Opção inválida. Tente novamente.");
      menuInicial();
  }
}

// Cadastro de usuário
function cadastrarUsuario() {
  console.log("\n=== Cadastro de Usuário ===");
  const nome = prompt("Nome: ");
  const cpf = prompt("CPF (somente números): ");

  if (!validarCPF(cpf)) {
    console.log("CPF inválido. Tente novamente.");
    return cadastrarUsuario();
  }

  const email = prompt("E-mail: ");
  if (!validarEmail(email)) {
    console.log("E-mail inválido. Tente novamente.");
    return cadastrarUsuario();
  }

  const senha = prompt("Senha: ");
  usuarios.push({ nome, cpf, email, senha });
  console.log("Usuário cadastrado com sucesso!");
  menuInicial();
}

// Login de usuário
function login() {
  console.log("\n=== Login ===");
  const email = prompt("E-mail: ");
  const senha = prompt("Senha: ");

  const usuario = usuarios.find(
    (u) => u.email === email && u.senha === senha
  );

  if (usuario) {
    usuarioLogado = usuario;
    console.log(`Bem-vindo, ${usuario.nome}!`);
    menuUsuarioLogado();
  } else {
    console.log("E-mail ou senha inválidos. Tente novamente.");
    login();
  }
}

// Menu do usuário logado
function menuUsuarioLogado() {
  console.log("\n=== Menu Principal ===");
  console.log("1. Fazer Reserva");
  console.log("2. Consultar Reservas");
  console.log("3. Alterar Reserva");
  console.log("4. Cancelar Reserva");
  console.log("5. Sair");

  const opcao = prompt("Escolha uma opção: ");

  switch (opcao) {
    case "1":
      fazerReserva();
      break;
    case "2":
      consultarReservas();
      break;
    case "3":
      alterarReserva();
      break;
    case "4":
      cancelarReserva();
      break;
    case "5":
      usuarioLogado = null;
      console.log("Logout realizado com sucesso.");
      menuInicial();
      break;
    default:
      console.log("Opção inválida. Tente novamente.");
      menuUsuarioLogado();
  }
}

// Fazer uma reserva
function fazerReserva() {
  console.log("\n=== Fazer Reserva ===");
  const hotel = prompt("Nome do hotel: ");
  const checkIn = prompt("Data de check-in (YYYY-MM-DD): ");
  const checkOut = prompt("Data de check-out (YYYY-MM-DD): ");

  if (!validarDatas(checkIn, checkOut)) {
    console.log("Datas inválidas. Certifique-se de que estão no formato correto e que a data de check-out seja após a de check-in.");
    return fazerReserva();
  }

  reservas.push({
    usuario: usuarioLogado.email,
    hotel,
    checkIn,
    checkOut,
  });

  console.log("Reserva realizada com sucesso!");
  menuUsuarioLogado();
}

// Consultar reservas
function consultarReservas() {
  console.log("\n=== Consultar Reservas ===");
  const reservasUsuario = reservas.filter(
    (reserva) => reserva.usuario === usuarioLogado.email
  );

  if (reservasUsuario.length === 0) {
    console.log("Nenhuma reserva encontrada.");
  } else {
    reservasUsuario.forEach((reserva, index) => {
      console.log(
        `${index + 1}. Hotel: ${reserva.hotel}, Check-in: ${reserva.checkIn}, Check-out: ${reserva.checkOut}`
      );
    });
  }

  menuUsuarioLogado();
}

// Alterar uma reserva
function alterarReserva() {
  console.log("\n=== Alterar Reserva ===");
  const reservasUsuario = reservas.filter(
    (reserva) => reserva.usuario === usuarioLogado.email
  );

  if (reservasUsuario.length === 0) {
    console.log("Nenhuma reserva encontrada.");
    return menuUsuarioLogado();
  }

  reservasUsuario.forEach((reserva, index) => {
    console.log(
      `${index + 1}. Hotel: ${reserva.hotel}, Check-in: ${reserva.checkIn}, Check-out: ${reserva.checkOut}`
    );
  });

  const indice = parseInt(prompt("Digite o número da reserva que deseja alterar: ")) - 1;

  if (indice < 0 || indice >= reservasUsuario.length) {
    console.log("Reserva inválida.");
    return alterarReserva();
  }

  const reserva = reservasUsuario[indice];
  const novoHotel = prompt(`Novo nome do hotel (${reserva.hotel}): `) || reserva.hotel;
  const novoCheckIn = prompt(`Nova data de check-in (${reserva.checkIn}): `) || reserva.checkIn;
  const novoCheckOut = prompt(`Nova data de check-out (${reserva.checkOut}): `) || reserva.checkOut;

  if (!validarDatas(novoCheckIn, novoCheckOut)) {
    console.log("Datas inválidas. Tente novamente.");
    return alterarReserva();
  }

  reserva.hotel = novoHotel;
  reserva.checkIn = novoCheckIn;
  reserva.checkOut = novoCheckOut;

  console.log("Reserva alterada com sucesso!");
  menuUsuarioLogado();
}

// Cancelar uma reserva
function cancelarReserva() {
  console.log("\n=== Cancelar Reserva ===");
  const reservasUsuario = reservas.filter(
    (reserva) => reserva.usuario === usuarioLogado.email
  );

  if (reservasUsuario.length === 0) {
    console.log("Nenhuma reserva encontrada.");
    return menuUsuarioLogado();
  }

  reservasUsuario.forEach((reserva, index) => {
    console.log(
      `${index + 1}. Hotel: ${reserva.hotel}, Check-in: ${reserva.checkIn}, Check-out: ${reserva.checkOut}`
    );
  });

  const indice = parseInt(prompt("Digite o número da reserva que deseja cancelar: ")) - 1;

  if (indice < 0 || indice >= reservasUsuario.length) {
    console.log("Reserva inválida.");
    return cancelarReserva();
  }

  reservas = reservas.filter((reserva, i) => i !== reservas.indexOf(reservasUsuario[indice]));

  console.log("Reserva cancelada com sucesso!");
  menuUsuarioLogado();
}

// Inicia o sistema
menuInicial();



