export default {
  openapi: "3.0.3",
  info: {
    title: "AutoCareNow API",
    version: "1.0.0",
    description: `API para gerenciamento de usuários e ordens de serviço.
- Usuários podem se registrar como **clientes**.
- Existe um usuário **funcionário** (email: \`funcionario@autocarenow.com.br\`, senha: \`123456\`) que recebe \`role: employee\` no token.
- Clientes só podem visualizar/criar/editar/excluir suas próprias ordens.
- Funcionários podem visualizar/criar/editar/excluir todas as ordens e gerenciar usuários.`,
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],
  paths: {
    "/users/register": {
      post: {
        summary: "Registrar novo usuário (role cliente)",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Usuário criado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          "400": {
            description: "Dados inválidos ou email já cadastrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/users/login": {
      post: {
        summary: "Autenticar usuário (cliente ou funcionário)",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login bem-sucedido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          "400": {
            description: "Email ou senha ausentes",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Senha inválida",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/users": {
      get: {
        summary: "Listar todos os usuários (apenas funcionário)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de usuários",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/UserResponse" },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": {
            description: "Acesso negado (não é funcionário)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/users/me": {
      get: {
        summary: "Obter perfil do usuário autenticado",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Dados do usuário",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
        },
      },
    },
    "/users/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID do usuário (24 caracteres hex)",
        },
      ],
      get: {
        summary: "Obter usuário por ID (cliente vê apenas o próprio)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Dados do usuário",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": {
            description:
              "Acesso negado (cliente tentando ver outro usuário)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        summary: "Atualizar usuário (cliente atualiza só a si mesmo)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Usuário atualizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": {
            description:
              "Acesso negado (cliente tentando atualizar outro usuário)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Remover usuário (cliente remove só a si mesmo)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Usuário removido com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Usuário removido com sucesso.",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": {
            description:
              "Acesso negado (cliente tentando remover outro usuário)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/orders": {
      get: {
        summary:
          "Listar todas as ordens (funcionário) ou apenas do cliente autenticado",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de ordens",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/OrderResponse" },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
        },
      },
      post: {
        summary: "Criar nova ordem (cliente ou funcionário)",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Ordem criada com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" },
              },
            },
          },
          "400": {
            description: "Dados insuficientes para criação",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
        },
      },
    },
    "/orders/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID da ordem (24 caracteres hex)",
        },
      ],
      get: {
        summary:
          "Obter ordem por ID (funcionário ou próprio cliente)",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Detalhes da ordem",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": {
            description:
              "Acesso negado (cliente tentando ver ordem alheia)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Ordem não encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        summary: "Atualizar ordem (funcionário ou próprio cliente)",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateOrderRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Ordem atualizada com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" },
              },
            },
          },
          "400": {
            description: "Dados inválidos para atualização",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": {
            description:
              "Acesso negado (cliente tentando atualizar ordem alheia)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Ordem não encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Remover ordem (funcionário ou próprio cliente)",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Ordem removida com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Ordem removida com sucesso.",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/UnauthorizedError" },
          "403": {
            description:
              "Acesso negado (cliente tentando remover ordem alheia)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Ordem não encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Erro ocorrido.",
          },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "João da Silva" },
          email: { type: "string", example: "joao@example.com" },
          password: {
            type: "string",
            format: "password",
            example: "senha123",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "joao@example.com" },
          password: {
            type: "string",
            format: "password",
            example: "senha123",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Login bem-sucedido" },
          token: {
            type: "string",
            description: "JWT para autenticação",
          },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "60d21b4667d0d8992e610c85",
          },
          name: { type: "string", example: "João da Silva" },
          email: { type: "string", example: "joao@example.com" },
          role: {
            type: "string",
            enum: ["client", "employee"],
            example: "client",
          },
        },
      },
      UserResponse: { allOf: [{ $ref: "#/components/schemas/User" }] },
      UpdateUserRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "João da Silva Novo" },
          email: { type: "string", example: "joaonovo@example.com" },
          password: {
            type: "string",
            format: "password",
            example: "senhaNova123",
          },
          role: {
            type: "string",
            enum: ["client", "employee"],
            example: "employee",
          },
        },
      },
      CreateOrderRequest: {
        type: "object",
        required: ["customerName", "vehicle", "services"],
        properties: {
          customerName: { type: "string", example: "Maria Souza" },
          vehicle: { type: "string", example: "Fiat Uno 2010" },
          services: {
            type: "array",
            items: { type: "string" },
            example: ["Troca de óleo", "Alinhamento"],
          },
          status: {
            type: "string",
            enum: ["pending", "in_progress", "completed", "delivered", "cancelled"],
            example: "pending",
          },
        },
      },
      UpdateOrderRequest: {
        type: "object",
        properties: {
          customerName: { type: "string", example: "Maria Souza Atualizado" },
          vehicle: { type: "string", example: "Fiat Uno 2011" },
          services: {
            type: "array",
            items: { type: "string" },
            example: ["Troca de óleo", "Balanceamento"],
          },
          status: {
            type: "string",
            enum: ["pending", "in_progress", "completed", "delivered", "cancelled"],
            example: "in_progress",
          },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "60d21b9567d0d8992e610c90",
          },
          customerName: { type: "string", example: "Maria Souza" },
          vehicle: { type: "string", example: "Fiat Uno 2010" },
          services: {
            type: "array",
            items: { type: "string" },
            example: ["Troca de óleo", "Alinhamento"],
          },
          status: {
            type: "string",
            enum: ["pending", "in_progress", "completed", "delivered", "cancelled"],
            example: "pending",
          },
          createdBy: {
            type: "string",
            example: "60d21b4667d0d8992e610c85",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-06-01T10:30:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-06-02T11:00:00.000Z",
          },
        },
      },
      OrderResponse: { allOf: [{ $ref: "#/components/schemas/Order" }] },
    },
    responses: {
      UnauthorizedError: {
        description: "Falha de autenticação (token ausente ou inválido)",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
  },
};

