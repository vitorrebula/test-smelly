const { UserService } = require('../src/userService');

let userService;

beforeEach(() => {
  userService = new UserService();
  userService._clearDB();
});

// ─────────────────────────────────────────────
// Criação de usuário
// ─────────────────────────────────────────────

describe('createUser', () => {
  test('deve retornar um objeto com id definido ao criar usuário', () => {
    // Arrange
    const nome = 'Fulano';
    const email = 'fulano@teste.com';
    const idade = 25;

    // Act
    const usuario = userService.createUser(nome, email, idade);

    // Assert
    expect(usuario.id).toBeDefined();
  });

  test('deve retornar o nome correto ao criar usuário', () => {
    // Arrange
    const nome = 'Fulano';

    // Act
    const usuario = userService.createUser(nome, 'fulano@teste.com', 25);

    // Assert
    expect(usuario.nome).toBe(nome);
  });

  test('deve criar usuário com status "ativo" por padrão', () => {
    // Arrange & Act
    const usuario = userService.createUser('Fulano', 'fulano@teste.com', 25);

    // Assert
    expect(usuario.status).toBe('ativo');
  });

  test('deve criar usuário com isAdmin false por padrão', () => {
    // Arrange & Act
    const usuario = userService.createUser('Fulano', 'fulano@teste.com', 25);

    // Assert
    expect(usuario.isAdmin).toBe(false);
  });

  test('deve criar usuário administrador quando isAdmin for true', () => {
    // Arrange & Act
    const admin = userService.createUser('Admin', 'admin@teste.com', 30, true);

    // Assert
    expect(admin.isAdmin).toBe(true);
  });

  test('deve lançar erro ao criar usuário com menos de 18 anos', () => {
    // Arrange
    const criarMenor = () =>
      userService.createUser('Menor', 'menor@email.com', 17);

    // Act + Assert
    expect(criarMenor).toThrow('O usuário deve ser maior de idade.');
  });

  test('deve lançar erro ao criar usuário sem nome', () => {
    // Arrange
    const criarSemNome = () =>
      userService.createUser('', 'email@teste.com', 25);

    // Act + Assert
    expect(criarSemNome).toThrow('Nome, email e idade são obrigatórios.');
  });

  test('deve lançar erro ao criar usuário sem email', () => {
    // Arrange
    const criarSemEmail = () =>
      userService.createUser('Fulano', '', 25);

    // Act + Assert
    expect(criarSemEmail).toThrow('Nome, email e idade são obrigatórios.');
  });
});

// ─────────────────────────────────────────────
// Busca de usuário
// ─────────────────────────────────────────────

describe('getUserById', () => {
  test('deve retornar o usuário correto ao buscar pelo id', () => {
    // Arrange
    const criado = userService.createUser('Fulano', 'fulano@teste.com', 25);

    // Act
    const encontrado = userService.getUserById(criado.id);

    // Assert
    expect(encontrado.nome).toBe('Fulano');
  });

  test('deve retornar null ao buscar id inexistente', () => {
    // Arrange
    const idInexistente = 'id-que-nao-existe';

    // Act
    const resultado = userService.getUserById(idInexistente);

    // Assert
    expect(resultado).toBeNull();
  });
});

// ─────────────────────────────────────────────
// Desativação de usuário
// ─────────────────────────────────────────────

describe('deactivateUser', () => {
  test('deve retornar true ao desativar um usuário comum', () => {
    // Arrange
    const usuario = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuario.id);

    // Assert
    expect(resultado).toBe(true);
  });

  test('deve alterar o status do usuário comum para "inativo"', () => {
    // Arrange
    const usuario = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    userService.deactivateUser(usuario.id);
    const atualizado = userService.getUserById(usuario.id);

    // Assert
    expect(atualizado.status).toBe('inativo');
  });

  test('deve retornar false ao tentar desativar um administrador', () => {
    // Arrange
    const admin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(admin.id);

    // Assert
    expect(resultado).toBe(false);
  });

  test('deve manter o status do administrador como "ativo" após tentativa de desativação', () => {
    // Arrange
    const admin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    userService.deactivateUser(admin.id);
    const atualizado = userService.getUserById(admin.id);

    // Assert
    expect(atualizado.status).toBe('ativo');
  });

  test('deve retornar false ao tentar desativar id inexistente', () => {
    // Arrange
    const idInexistente = 'id-que-nao-existe';

    // Act
    const resultado = userService.deactivateUser(idInexistente);

    // Assert
    expect(resultado).toBe(false);
  });
});

// ─────────────────────────────────────────────
// Relatório de usuários
// ─────────────────────────────────────────────

describe('generateUserReport', () => {
  test('deve retornar mensagem de lista vazia quando não há usuários', () => {
    // Arrange — banco limpo pelo beforeEach

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });

  test('deve incluir o cabeçalho no relatório quando há usuários', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('--- Relatório de Usuários ---');
  });

  test('deve incluir o nome do usuário no relatório', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Alice');
  });

  test('deve incluir o status do usuário no relatório', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('ativo');
  });

  test('deve listar todos os usuários cadastrados no relatório', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('Bob');
  });
});