'use client'

import React from 'react'

export function Footer() {
  return (
    <footer className="w-full bg-black text-white font-montserrat py-6 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        <span className="text-sm">&copy; {new Date().getFullYear()} ClickMesa. Todos os direitos reservados.</span>
        <div className="flex gap-4 text-xs">
          <a href="/sobre" className="hover:text-primary transition">Sobre</a>
          <a href="/contato" className="hover:text-primary transition">Contato</a>
          <a href="/privacidade" className="hover:text-primary transition">Privacidade</a>
        </div>
      </div>
    </footer>
  )
}
