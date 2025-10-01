// src/hooks/useCart.ts - Adicione este useEffect para sincronização automática
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ItemCardapio } from '@/types'

interface CartItem {
  id: string
  item: ItemCardapio
  quantidade: number
  observacoes?: string
}

interface CartStore {
  items: CartItem[]
  mesaId?: string
  mesaNumero?: number
  addItem: (item: ItemCardapio, quantidade?: number, observacoes?: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantidade: number) => void
  updateObservations: (itemId: string, observacoes: string) => void
  setMesa: (mesaId: string, mesaNumero: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  // Adicione esta função para verificar se tem mesa
  hasMesa: () => boolean
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      mesaId: undefined,
      mesaNumero: undefined,

      addItem: (item, quantidade = 1, observacoes = '') => {
        const existingItem = get().items.find(i => i.item.id === item.id)
        
        if (existingItem) {
          get().updateQuantity(item.id, existingItem.quantidade + quantidade)
        } else {
          set(state => ({
            items: [...state.items, { 
              id: `${item.id}-${Date.now()}`,
              item, 
              quantidade, 
              observacoes 
            }]
          }))
        }
      },

      removeItem: (itemId) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }))
      },

      updateQuantity: (itemId, quantidade) => {
        if (quantidade <= 0) {
          get().removeItem(itemId)
          return
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantidade } : item
          )
        }))
      },

      updateObservations: (itemId, observacoes) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, observacoes } : item
          )
        }))
      },

      setMesa: (mesaId, mesaNumero) => {
        set({ mesaId, mesaNumero })
      },

      clearCart: () => {
        set({ items: [], mesaId: undefined, mesaNumero: undefined })
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => 
          sum + (item.item.preco * item.quantidade), 0
        )
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantidade, 0)
      },

      hasMesa: () => {
        return !!(get().mesaId && get().mesaNumero)
      }
    }),
    {
      name: 'cart-storage',
      // Adicione esta configuração para melhor compatibilidade
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migração da versão 0 para 1
          return {
            ...persistedState,
            mesaNumero: persistedState.mesaNumero || undefined
          }
        }
        return persistedState
      }
    }
  )
)