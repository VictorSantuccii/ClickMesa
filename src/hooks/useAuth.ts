// src/hooks/useAuth.ts
'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User as UserType } from '@/types'

// Interface para o contexto de autenticação
interface AuthContextType {
  user: FirebaseUser | null
  userData: UserType | null
  loading: boolean
  signOut: () => Promise<void>
}

// Criar o contexto com valor padrão
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signOut: async () => {}
})

// Provider de autenticação
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<Omit<AuthContextType, 'signOut'>>({
    user: null,
    userData: null,
    loading: true
  })

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setState(prev => ({ ...prev, user: firebaseUser }))
      
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const unsubscribeUser = onSnapshot(userDocRef, (document) => {
          if (document.exists()) {
            const userData = document.data() as Omit<UserType, 'id'>
            setState(prev => ({ 
              ...prev, 
              userData: { id: document.id, ...userData },
              loading: false 
            }))
          } else {
            setState(prev => ({ ...prev, userData: null, loading: false }))
          }
        })

        return unsubscribeUser
      } else {
        setState(prev => ({ ...prev, userData: null, loading: false }))
        return undefined
      }
    })

    return () => unsubscribeAuth()
  }, [])

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      throw error
    }
  }

  const contextValue: AuthContextType = {
    ...state,
    signOut
  }

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  )
}

// Hook para usar o contexto de autenticação
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
