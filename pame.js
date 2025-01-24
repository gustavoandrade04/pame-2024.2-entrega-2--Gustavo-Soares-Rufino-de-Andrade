const readline = require('readline');
const fs = require('fs');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
    // Quarto CCE
    this.quartos.push(new Quarto("CCE", "Quarto com vista para a parte interna do hotel, aconchegante e simples, um só cômodo", 1, 350, 12));
    this.quartos.push(new Quarto("CCE", "Quarto com vista para a parte interna do hotel, aconchegante e simples, um só cômodo", 2, 450, 15));
    this.quartos.push(new Quarto("CCE", "Quarto com vista para a parte interna do hotel, aconchegante e simples, um só cômodo", 3, 550, 10));

    // Quarto PRO
    this.quartos.push(new Quarto("PRO", "Quarto com vista para a praia, aconchegante, com banheira e com mini closet embutido", 1, 600, 10));
    this.quartos.push(new Quarto("PRO", "Quarto com vista para a praia, aconchegante, com banheira e com mini closet embutido", 2, 700, 10));
    this.quartos.push(new Quarto("PRO", "Quarto com vista para a praia, aconchegante, com banheira e com mini closet embutido", 3, 850, 10));

    // Quarto Presidencial
    this.quartos.push(new Quarto("Presidencial", "Quarto para um verdadeiro fluxer, 2 cômodos, cozinha, closet, hidromassagem e uma vista única para o mar", 1, 1000, 5));
    this.quartos.push(new Quarto("Presidencial", "Quarto para um verdadeiro fluxer, 2 cômodos, cozinha, closet, hidromassagem e uma vista única para o mar", 2, 1200, 5));
    this.quartos.push(new Quarto("Presidencial", "Quarto para um verdadeiro fluxer, 2 cômodos, cozinha, closet, hidromassagem e uma vista única para o mar", 3, 1500, 5));
  }

  listarQuartosDisponiveis() {
    console.log("\n[Quartos Disponíveis]");
    const quartosAgrupados = {};

    // Agrupar quartos por tipo e quantidade de camas
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
      // Somar a quantidade disponível
      quartosAgrupados[key].quantidadeDisponivel += quarto.quantidadeDisponivel;
    });

    // Exibir apenas uma entrada para cada agrupamento
    Object.values(quartosAgrupados).forEach((info, index) => {
      if (info.quantidadeDisponivel > 0) {
        console.log(
          `${index + 1}. Tipo: ${info.nome}, Descrição: ${info.descricao}, Número de Camas: ${info.quantidadeCamas}, Preço: R$${info.precoPorNoite}, Disponíveis: ${info.quantidadeDisponivel}`
        );
      }
    });
  }

  

  reservarQuarto(idCliente, tipoQuarto, numeroCamas, dataEntrada, dataSaida) {
    // Encontrar um quarto disponível com base no tipo e no número de camas
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
  
    // Criar uma nova reserva
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
  
    // Reduzir a quantidade disponível do quarto
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
console.log("Clientes cadastrados:", sistema.clientes); // Verificar se o cliente foi adicionado.

}

async function loginCliente(sistema) {
  console.log("\n[Login de Cliente]");

  const email = await perguntar("Digite seu e-mail: ");
  const senha = await perguntar("Digite sua senha: ");

  const cliente = sistema.buscarClientePorEmailSenha(email, senha);

  if (cliente) {
    console.log(`\nBem-vindo, ${cliente.nome}! Login realizado com sucesso.`);

    console.log("\nO que você gostaria de fazer?");
    console.log("1. Fazer uma nova reserva");
    console.log("2. Consultar minhas reservas");

    const escolha = await perguntar("Escolha uma opção (1/2): ");

    if (escolha === "1") {
      await reservarQuartoCliente(sistema, cliente); // Chama o fluxo de reserva
    } else if (escolha === "2") {
      await consultarReservasCliente(sistema, cliente); // Chama o fluxo de consulta de reservas
    } else {
      console.log("\nOpção inválida. Tente novamente.");
    }
  } else {
    console.log("\nLogin falhou. Verifique suas credenciais e tente novamente.");
  }
}
async function consultarReservasCliente(sistema, cliente) {
  console.log("\n[Consultando Reservas]");

  // Filtra as reservas do cliente logado
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

      // Calcular o valor total da reserva
      const quartoReservado = sistema.quartos.find(q => q.nome === reserva.tipoQuarto && q.quantidadeCamas === reserva.numeroCamas);
      const numeroNoites = calcularNumeroDeNoites(reserva.dataEntrada, reserva.dataSaida);
      const valorTotal = quartoReservado.precoPorNoite * numeroNoites;
      console.log(`- Valor Total: R$ ${valorTotal.toFixed(2)}`);
    });
  }
}

// Função para calcular o número de noites entre a entrada e a saída
function calcularNumeroDeNoites(dataEntrada, dataSaida) {
  const [diaEntrada, mesEntrada, anoEntrada] = dataEntrada.split("/").map(num => parseInt(num, 10));
  const [diaSaida, mesSaida, anoSaida] = dataSaida.split("/").map(num => parseInt(num, 10));

  const entrada = new Date(anoEntrada, mesEntrada - 1, diaEntrada);
  const saida = new Date(anoSaida, mesSaida - 1, diaSaida);
  
  const diferencia = saida - entrada;
  return diferencia / (1000 * 3600 * 24); // Converte milissegundos para dias
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
    // Adicione aqui as funcionalidades específicas para funcionários
  } else {
    console.log("\nLogin falhou. Verifique suas credenciais e tente novamente.");
  }
}


async function reservarQuartoCliente(sistema, cliente) {
  console.log("\n[Reserva de Quarto]");
  console.log("Aqui estão os tipos de quartos disponíveis:");

  // Exibir apenas os tipos de quartos disponíveis (sem repetir a quantidade de camas)
  const tiposDeQuartosDisponiveis = [...new Set(sistema.quartos.map(quarto => quarto.nome))];

  tiposDeQuartosDisponiveis.forEach((tipo, index) => {
    console.log(`${index + 1}. Tipo: ${tipo}`);
  });

  // Passo 1: Escolher o tipo de quarto
  const escolhaTipoQuarto = parseInt(await perguntar("Escolha o tipo de quarto (1 para CCE, 2 para PRO, 3 para Presidencial): "), 10);
  const tipoQuartoEscolhido = tiposDeQuartosDisponiveis[escolhaTipoQuarto - 1];

  // Filtra os quartos do tipo escolhido
  const quartosTipoEscolhido = sistema.quartos.filter(quarto => quarto.nome === tipoQuartoEscolhido && quarto.quantidadeDisponivel > 0);

  if (quartosTipoEscolhido.length === 0) {
    console.log("\nDesculpe, não há quartos disponíveis desse tipo.");
    return;
  }

  // Passo 2: Escolher o número de camas (dentre os disponíveis para o tipo escolhido)
  console.log("\nEscolha o número de camas disponíveis para o quarto:", tipoQuartoEscolhido);
  
  const numerosCamasDisponiveis = [...new Set(quartosTipoEscolhido.map(quarto => quarto.quantidadeCamas))]; // Obtém os números de camas únicos

  // Exibir as opções de número de camas disponíveis
  numerosCamasDisponiveis.forEach((quantidade, index) => {
    console.log(`${index + 1}. Número de camas: ${quantidade}`);
  });

  const numeroCamasEscolhido = parseInt(await perguntar("Escolha o número de camas: "), 10);

  if (!numerosCamasDisponiveis.includes(numeroCamasEscolhido)) {
    console.log("\nOpção de número de camas inválida. Tente novamente.");
    return;
  }

  // Passo 3: Escolher as datas de entrada e saída
  const dataEntrada = await perguntar("Digite a data de entrada (DD/MM/AAAA): ");
  const dataSaida = await perguntar("Digite a data de saída (DD/MM/AAAA): ");

  // Passo 4: Reservar o quarto
  sistema.reservarQuarto(cliente.id, tipoQuartoEscolhido, numeroCamasEscolhido, dataEntrada, dataSaida);

  // Calcular o valor total da reserva
  const quartoReservado = sistema.quartos.find(q => q.nome === tipoQuartoEscolhido && q.quantidadeCamas === numeroCamasEscolhido);
  const numeroNoites = calcularNumeroDeNoites(dataEntrada, dataSaida);
  const valorTotal = quartoReservado.precoPorNoite * numeroNoites;

  console.log(`\nReserva realizada com sucesso!`);
  console.log(`Valor total da sua reserva: R$ ${valorTotal.toFixed(2)}`);
}





async function main() {
  const sistema = new Sistema();
  sistema.carregarDados();

  console.log("Bem-vindo ao Sistema do Hotel!");

  while (true) {
    console.log("\nVocê é:");
    console.log("1. Cliente");
    console.log("2. Funcionário");
    console.log("3. Sair do Programa");

    const tipoUsuario = await perguntar("Escolha uma opção (1/2/3): ");

    if (tipoUsuario === "3") {
      console.log("Saindo do programa. Até logo!");
      rl.close();
      sistema.salvarDados();
      break;
    }

    if (tipoUsuario === "1") {
      await fluxoCliente(sistema);
    } else if (tipoUsuario === "2") {
      await fluxoFuncionario(sistema);
    } else {
      console.log("\nOpção inválida. Tente novamente.");
    }
  }
}

async function fluxoCliente(sistema) {
  console.log("\nVocê já tem uma conta?");
  console.log("1. Sim, quero fazer login");
  console.log("2. Não, quero me cadastrar");

  const escolhaConta = await perguntar("Escolha uma opção (1/2): ");

  if (escolhaConta === "1") {
    await loginCliente(sistema);
  } else if (escolhaConta === "2") {
    await cadastroCliente(sistema);
  } else {
    console.log("\nOpção inválida. Tente novamente.");
  }
}

async function fluxoFuncionario(sistema) {
  console.log("\n[Área de Funcionários]");
  console.log("1. Login");
  console.log("2. Cadastro");

  const escolhaFuncionario = await perguntar("Escolha uma opção (1/2): ");

  if (escolhaFuncionario === "1") {
    await loginFuncionario(sistema);
  } else if (escolhaFuncionario === "2") {
    await cadastroFuncionario(sistema);
  } else {
    console.log("\nOpção inválida. Tente novamente.");
  }
}


main();

