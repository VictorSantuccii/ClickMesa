// src/hooks/useCartSync.ts
'use client'

import { useEffect } from 'react'
import { useMesa } from '@/contexts/MesaContext'
import { useCart } from './useCart'

export function useCartSync() {
  const { mesaId, mesaNumero } = useMesa()
  const { setMesa: setCartMesa, mesaId: cartMesaId } = useCart()

  useEffect(() => {
    if (mesaId && mesaNumero && mesaId !== cartMesaId) {
      setCartMesa(mesaId, mesaNumero)
    }
  }, [mesaId, mesaNumero, cartMesaId, setCartMesa])

  return { mesaId, mesaNumero }
}