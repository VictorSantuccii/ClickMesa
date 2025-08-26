export interface Restaurant {
    id: string
    nome: string
    cnpj: string
    endereco: string
    telefone: string
    capacidade_total: number
    horario_funcionamento: string
  }
  
  export interface Mesa {
    id: string
    numero: number
    status: 'livre' | 'ocupada' | 'aguardando_limpeza' | 'reservada'
    capacidade: number
    restauranteId: string
  }
  
  export interface CategoriaItem {
    id: string
    nome: string
    ordem: number
    restauranteId: string
  }
  
  export interface ItemCardapio {
    id: string
    nome: string
    categoria: string
    preco: number
    descricao?: string
    tempo_preparo_estimado: number
    disponivel: boolean
    imagem_url?: string
    ingredientes?: string[]
    restauranteId: string
  }
  
  export interface Cliente {
    id: string
    nome: string
    telefone: string
    email: string
    preferencias: string[]
    historico_pedidos: string[]
    avaliacao_media: number
  }
  
  export interface Pedido {
    id: string
    cliente_id: string
    mesa_id: string
    garcom_id?: string
    status: 'novo' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado'
    valor_total: number
    hora_criacao: Date
    hora_entrega?: Date
    itens: ItemPedido[]
    observacoes?: string
    restauranteId: string
  }
  
  export interface ItemPedido {
    id: string
    pedido_id: string
    item_id: string
    quantidade: number
    preco_unitario: number
    observacoes?: string
    status: 'pendente' | 'preparando' | 'pronto' | 'entregue'
  }
  
  export interface Funcionario {
    id: string
    nome: string
    cargo: 'garcom' | 'cozinheiro' | 'gerente' | 'caixa'
    turno: 'manha' | 'tarde' | 'noite'
    horario_entrada: string
    horario_saida: string
    mesas_atendidas: string[]
    pedidos_atendidos: string[]
    total_avaliacoes: number
    avaliacao_media: number
    restauranteId: string
    user_id?: string
  }
  
  export interface Reserva {
    id: string
    cliente_id: string
    mesa_id: string
    data_hora: Date
    numero_pessoas: number
    status: 'ativa' | 'concluida' | 'cancelada'
    observacoes?: string
    restauranteId: string
  }