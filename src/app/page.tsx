'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { restaurantService } from '@/lib/services'
import { Restaurant } from '@/types'
import { Utensils, Users, QrCode, Calendar } from 'lucide-react'

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const allRestaurants = await restaurantService.getAll()
        setRestaurants(allRestaurants)
      } catch (error) {
        console.error('Erro ao carregar restaurantes:', error)
      }
    }

    loadRestaurants()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="container mx-auto py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Utensils className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">ClickMesa</h1>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Sistema Completo para Restaurantes</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gerencie seu restaurante com cardápio digital, pedidos online, reservas e controle completo
          </p>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <QrCode className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Cardápio Digital</CardTitle>
              <CardDescription>
                Acesso via QR code pelas mesas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="client/menu/qr-scanner">Acessar Cardápio</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Calendar className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Reservas</CardTitle>
              <CardDescription>
                Reserve mesas online
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="client/menu/reservation">Fazer Reserva</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Área do Cliente</CardTitle>
              <CardDescription>
                Acesse sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/auth/login">Fazer Login</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Utensils className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Administração</CardTitle>
              <CardDescription>
                Painel de gestão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/admin/dashboard">Acessar Painel</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {restaurants.length > 0 && (
          <section className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">Restaurantes Cadastrados</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="text-center">
                  <CardHeader>
                    <CardTitle>{restaurant.nome}</CardTitle>
                    <CardDescription>{restaurant.endereco}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      CNPJ: {restaurant.cnpj}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Capacidade: {restaurant.capacidade_total} pessoas
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}