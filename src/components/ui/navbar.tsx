'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="w-full bg-black text-white font-montserrat">
      <div className="container mx-auto flex items-center justify-between py-4 px-2">
        <Link href="/" className="text-2xl font-bold tracking-tight">ClickMesa</Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/client" className="hover:text-primary transition">Início</Link>
          <Link href="/client/restaurante" className="hover:text-primary transition">Restaurantes</Link>
          <Link href="/client/pedido" className="hover:text-primary transition">Meus Pedidos</Link>
          <Link href="/admin/dashboard" className="hover:text-primary transition">Admin</Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menu">
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-neutral-800 px-4 pb-4 animate-fade-in-down">
          <Link href="/client" className="block py-2" onClick={() => setOpen(false)}>Início</Link>
          <Link href="/client/restaurante" className="block py-2" onClick={() => setOpen(false)}>Restaurantes</Link>
          <Link href="/client/pedido" className="block py-2" onClick={() => setOpen(false)}>Meus Pedidos</Link>
          <Link href="/admin/dashboard" className="block py-2" onClick={() => setOpen(false)}>Admin</Link>
        </div>
      )}
    </nav>
  )
}
