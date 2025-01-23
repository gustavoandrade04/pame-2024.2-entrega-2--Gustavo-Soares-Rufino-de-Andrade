class Reserva {
    constructor(id, idCliente, status, dataEntrada, dataSaida) {
      this.id = id; 
      this.idCliente = idCliente; 
      this.status = status; 
      this.dataEntrada = dataEntrada; 
      this.dataSaida = dataSaida; 
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
  
    adicionarQuarto(quarto) {
      this.quartos.push(quarto);
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
  }