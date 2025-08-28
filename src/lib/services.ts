import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  arrayUnion,
  arrayRemove,
  writeBatch,
  runTransaction,
  increment,
  serverTimestamp,
  startAfter,
  getCountFromServer,
  QueryConstraint,
  DocumentSnapshot
} from 'firebase/firestore'
import { db } from './firebase'
import {
  Restaurant,
  Mesa,
  ItemCardapio,
  Pedido,
  Cliente,
  Funcionario,
  Reserva,
  CategoriaItem,
  ItemPedido,
  ItemEstoque,
  Fornecedor,
  Relatorio
} from '@/types'

const createService = <T extends { id: string }>(collectionName: string) => {
  return {
    create: async (data: Omit<T, 'id'>): Promise<string> => {
      const docRef = await addDoc(collection(db, collectionName), data)
      return docRef.id
    },

    getById: async (id: string): Promise<T | null> => {
      const docRef = doc(db, collectionName, id)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as T) : null
    },

    getAll: async (): Promise<T[]> => {
      const querySnapshot = await getDocs(collection(db, collectionName))
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T))
    },

    update: async (id: string, data: Partial<T>): Promise<void> => {
      const docRef = doc(db, collectionName, id)
      await updateDoc(docRef, data as any)
    },

    delete: async (id: string): Promise<void> => {
      const docRef = doc(db, collectionName, id)
      await deleteDoc(docRef)
    },

    query: async (constraints: QueryConstraint[]): Promise<T[]> => {
      const q = query(collection(db, collectionName), ...constraints)
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T))
    },

    count: async (constraints: QueryConstraint[]): Promise<number> => {
      const q = query(collection(db, collectionName), ...constraints)
      const snapshot = await getCountFromServer(q)
      return snapshot.data().count
    },

    subscribe: (callback: (data: T[]) => void, constraints: QueryConstraint[] = []): (() => void) => {
      const q = query(collection(db, collectionName), ...constraints)
      return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
        const data: T[] = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T))
        callback(data)
      })
    },

    paginate: async (constraints: QueryConstraint[], lastVisible: DocumentSnapshot | null, limitCount: number = 10): Promise<{ data: T[]; lastVisible: DocumentSnapshot | null }> => {
      let q = query(collection(db, collectionName), ...constraints, limit(limitCount))
      if (lastVisible) q = query(q, startAfter(lastVisible))
      const querySnapshot = await getDocs(q)
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null
      return { data: querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T)), lastVisible: lastDoc }
    }
  }
}

export const restaurantService = createService<Restaurant>('restaurantes')
export const mesaService = createService<Mesa>('mesas')
export const itemCardapioService = createService<ItemCardapio>('cardapio')
export const pedidoService = createService<Pedido>('pedidos')
export const clienteService = createService<Cliente>('clientes')
export const funcionarioService = createService<Funcionario>('funcionarios')
export const reservaService = createService<Reserva>('reservas')
export const categoriaService = createService<CategoriaItem>('categorias')
export const estoqueService = createService<ItemEstoque>('estoque')
export const fornecedorService = createService<Fornecedor>('fornecedores')
export const relatorioService = createService<Relatorio>('relatorios')

export const cardapioService = {
  getByRestaurant: async (restaurantId: string): Promise<ItemCardapio[]> => {
    return itemCardapioService.query([
      where('restauranteId', '==', restaurantId),
      where('disponivel', '==', true),
      orderBy('categoria'),
      orderBy('nome')
    ])
  },

  getByCategory: async (restaurantId: string, category: string): Promise<ItemCardapio[]> => {
    return itemCardapioService.query([
      where('restauranteId', '==', restaurantId),
      where('categoria', '==', category),
      where('disponivel', '==', true),
      orderBy('nome')
    ])
  },

  searchItems: async (restaurantId: string, searchTerm: string): Promise<ItemCardapio[]> => {
    const allItems = await itemCardapioService.query([
      where('restauranteId', '==', restaurantId),
      where('disponivel', '==', true)
    ])
    return allItems.filter(item => 
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  },

  toggleAvailability: async (itemId: string, disponivel: boolean): Promise<void> => {
    await itemCardapioService.update(itemId, { disponivel })
  }
}

export const pedidoServices = {
  createNew: async (pedidoData: Omit<Pedido, 'id' | 'hora_criacao'>): Promise<string> => {
    const data = { ...pedidoData, hora_criacao: new Date(), status: 'novo' as const }
    return pedidoService.create(data)
  },

  getByMesa: async (mesaId: string): Promise<Pedido[]> => {
    return pedidoService.query([
      where('mesa_id', '==', mesaId),
      orderBy('hora_criacao', 'desc')
    ])
  },

  getActiveByMesa: async (mesaId: string): Promise<Pedido[]> => {
    return pedidoService.query([
      where('mesa_id', '==', mesaId),
      where('status', 'in', ['novo', 'em_preparo', 'pronto']),
      orderBy('hora_criacao', 'desc')
    ])
  },

  getByStatus: async (restaurantId: string, status: Pedido['status'][]): Promise<Pedido[]> => {
    return pedidoService.query([
      where('restauranteId', '==', restaurantId),
      where('status', 'in', status),
      orderBy('hora_criacao', 'asc')
    ])
  },

  updateStatus: async (pedidoId: string, status: Pedido['status']): Promise<void> => {
    const updateData: Partial<Pedido> = { status }
    if (status === 'entregue') updateData.hora_entrega = new Date()
    return pedidoService.update(pedidoId, updateData)
  },

  updateItemStatus: async (pedidoId: string, itemId: string, status: ItemPedido['status']): Promise<void> => {
    const pedido = await pedidoService.getById(pedidoId)
    if (!pedido) throw new Error('Pedido não encontrado')
    const itensAtualizados = pedido.itens.map(item => item.id === itemId ? { ...item, status } : item)
    const todosProntos = itensAtualizados.every(item => item.status === 'pronto')
    const novoStatusPedido = todosProntos ? 'pronto' : pedido.status
    await pedidoService.update(pedidoId, { itens: itensAtualizados, status: novoStatusPedido })
  },

  assignGarcom: async (pedidoId: string, garcomId: string): Promise<void> => {
    await pedidoService.update(pedidoId, { garcom_id: garcomId })
  },

  addObservation: async (pedidoId: string, observacao: string): Promise<void> => {
    await pedidoService.update(pedidoId, { observacoes: observacao })
  },

  cancelOrder: async (pedidoId: string): Promise<void> => {
    await pedidoService.update(pedidoId, { status: 'cancelado' })
  }
}

export const mesaServices = {
  getByNumber: async (restaurantId: string, numero: number): Promise<Mesa | null> => {
    const mesas = await mesaService.query([
      where('restauranteId', '==', restaurantId),
      where('numero', '==', numero)
    ])
    return mesas.length > 0 ? mesas[0] : null
  },

  updateStatus: async (mesaId: string, status: Mesa['status']): Promise<void> => {
    return mesaService.update(mesaId, { status })
  },

  getAvailable: async (restaurantId: string): Promise<Mesa[]> => {
    return mesaService.query([
      where('restauranteId', '==', restaurantId),
      where('status', '==', 'livre'),
      orderBy('numero')
    ])
  }
}

export const funcionarioServices = {
  getByCargo: async (restaurantId: string, cargo: Funcionario['cargo']): Promise<Funcionario[]> => {
    return funcionarioService.query([
      where('restauranteId', '==', restaurantId),
      where('cargo', '==', cargo),
      orderBy('nome')
    ])
  },

  getGarcomWithLeastWorkload: async (restaurantId: string): Promise<Funcionario | null> => {
    const garcons = await funcionarioService.query([
      where('restauranteId', '==', restaurantId),
      where('cargo', '==', 'garcom')
    ])
    if (garcons.length === 0) return null
    return garcons.sort((a, b) => a.pedidos_atendidos.length - b.pedidos_atendidos.length)[0]
  }
}

export const reservaServices = {
  createReservation: async (reservaData: Omit<Reserva, 'id'>): Promise<string> => {
    const mesa = await mesaService.getById(reservaData.mesa_id)
    if (!mesa || mesa.status !== 'livre') throw new Error('Mesa não disponível para reserva')
    await mesaService.update(reservaData.mesa_id, { status: 'reservada' })
    return reservaService.create(reservaData)
  },

  getByDate: async (restaurantId: string, data: Date): Promise<Reserva[]> => {
    const inicioDia = new Date(data.getFullYear(), data.getMonth(), data.getDate())
    const fimDia = new Date(data.getFullYear(), data.getMonth(), data.getDate() + 1)
    return reservaService.query([
      where('restauranteId', '==', restaurantId),
      where('data_hora', '>=', inicioDia),
      where('data_hora', '<=', fimDia),
      orderBy('data_hora', 'asc')
    ])
  },

  cancelReservation: async (reservaId: string): Promise<void> => {
    const reserva = await reservaService.getById(reservaId)
    if (!reserva) throw new Error('Reserva não encontrada')
    await mesaService.update(reserva.mesa_id, { status: 'livre' })
    await reservaService.update(reservaId, { status: 'cancelada' })
  }
}

export const estoqueServices = {
  getLowStockItems: async (restaurantId: string, threshold: number = 5): Promise<ItemEstoque[]> => {
    return estoqueService.query([
      where('restauranteId', '==', restaurantId),
      where('quantidade', '<=', threshold),
      orderBy('quantidade', 'asc')
    ])
  },

  updateStock: async (itemId: string, quantidade: number): Promise<void> => {
    const item = await estoqueService.getById(itemId)
    if (!item) throw new Error('Item de estoque não encontrado')
    if (item.quantidade + quantidade < 0) throw new Error('Quantidade em estoque não pode ser negativa')
    await estoqueService.update(itemId, { quantidade: item.quantidade + quantidade })
  }
}

export const relatorioServices = {
  generateDailyReport: async (restaurantId: string, data: Date): Promise<string> => {
    const inicioDia = new Date(data.getFullYear(), data.getMonth(), data.getDate())
    const fimDia = new Date(data.getFullYear(), data.getMonth(), data.getDate() + 1)
    const [totalPedidos, pedidosEntregues, revenue] = await Promise.all([
      pedidoService.count([where('restauranteId', '==', restaurantId), where('hora_criacao', '>=', inicioDia), where('hora_criacao', '<', fimDia)]),
      pedidoService.count([where('restauranteId', '==', restaurantId), where('status', '==', 'entregue'), where('hora_entrega', '>=', inicioDia), where('hora_entrega', '<', fimDia)]),
      relatorioServices.getDailyRevenue(restaurantId, data)
    ])
    return relatorioService.create({
      restauranteId: restaurantId,
      tipo: 'diario',
      data: data,
      detalhes: { totalPedidos, pedidosEntregues, revenue },
      gerado_por: 'sistema'
    })
  },

  getDailyRevenue: async (restaurantId: string, data: Date): Promise<number> => {
    const inicioDia = new Date(data.getFullYear(), data.getMonth(), data.getDate())
    const fimDia = new Date(data.getFullYear(), data.getMonth(), data.getDate() + 1)
    const pedidos = await pedidoService.query([
      where('restauranteId', '==', restaurantId),
      where('status', '==', 'entregue'),
      where('hora_entrega', '>=', inicioDia),
      where('hora_entrega', '<', fimDia)
    ])
    return pedidos.reduce((total, pedido) => total + pedido.valor_total, 0)
  }
}

export const realtimeService = {
  subscribeToOrders: (restaurantId: string, callback: (pedidos: Pedido[]) => void): (() => void) => {
    return pedidoService.subscribe(callback, [
      where('restauranteId', '==', restaurantId),
      where('status', 'in', ['novo', 'em_preparo', 'pronto']),
      orderBy('hora_criacao', 'asc')
    ])
  },

  subscribeToTables: (restaurantId: string, callback: (mesas: Mesa[]) => void): (() => void) => {
    return mesaService.subscribe(callback, [
      where('restauranteId', '==', restaurantId),
      orderBy('numero', 'asc')
    ])
  },

  subscribeToOrder: (orderId: string, callback: (pedido: Pedido | null) => void): (() => void) => {
    return onSnapshot(doc(db, 'pedidos', orderId), (doc) => {
      callback(doc.exists() ? { id: doc.id, ...doc.data() } as Pedido : null)
    })
  }
}

export const utilityServices = {
  batchUpdate: async (updates: { collection: string; id: string; data: any }[]): Promise<void> => {
    const batch = writeBatch(db)
    updates.forEach(({ collection, id, data }) => {
      const docRef = doc(db, collection, id)
      batch.update(docRef, data)
    })
    await batch.commit()
  }
}