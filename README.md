<h1>ClickMesa 🍽️</h1> 

![ClickMesa](https://img.shields.io/badge/ClickMesa-Restaurant%20Management-blueviolet)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-10.0-orange?logo=firebase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?logo=tailwind-css)

Um sistema completo de cardápio virtual e gestão para restaurantes, permitindo que clientes façam pedidos através de QR Codes e que o restaurante gerencie todo o fluxo de forma eficiente.

## ✨ Funcionalidades

### 🧑‍💻 Para Clientes
- **📱 Acesso via QR Code** - Escaneie o código na mesa para acessar o cardápio
- **🍔 Cardápio Digital** - Visualize produtos por categorias com fotos e descrições
- **🛒 Carrinho Inteligente** - Adicione itens com observações especiais
- **👤 Autenticação Flexível** - Faça login ou continue como visitante
- **📊 Acompanhamento em Tempo Real** - Veja o status do seu pedido
- **🔔 Notificações** - Receba atualizações sobre seu pedido

### 👨‍🍳 Para Restaurantes
- **📊 Dashboard Administrativo** - Visão geral do restaurante
- **👨‍💼 Gestão de Pedidos** - Controle completo do fluxo de pedidos
- **🍳 Interface da Cozinha** - Visualização otimizada para preparo
- **👨‍🍳 Atribuição Automática** - Sistema inteligente de distribuição de pedidos
- **📦 Controle de Estoque** - Gestão de ingredientes e produtos
- **📈 Relatórios** - Analytics e métricas de desempenho
- **🎯 Gestão de Mesas** - Controle de ocupação e status

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior confiabilidade
- **TailwindCSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI elegantes e acessíveis
- **Lucide React** - Ícones modernos e consistentes

### Backend & Banco de Dados
- **Firebase Firestore** - Banco de dados NoSQL em tempo real
- **Firebase Authentication** - Sistema de autenticação
- **Firebase Security Rules** - Regras de segurança robustas

### Funcionalidades Avançadas
- **WebSockets** - Comunicação em tempo real
- **PWA** - Progressive Web App capabilities
- **Responsive Design** - Funciona em todos os dispositivos

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ 
- Conta Firebase
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/clickmesa.git
cd clickmesa
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative Firestore Database e Authentication
   - Configure as regras de segurança (disponíveis em `firebase-rules.txt`)

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```
Edite o `.env.local` com suas configurações do Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.authdomain.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_RESTAURANTE_ID=your_restaurant_id
```

5. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

Acesse: http://localhost:3000

## 📁 Estrutura do Projeto

```
clickmesa/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Painel administrativo
│   ├── (client)/          # Interface do cliente
│   ├── api/               # API Routes
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── admin/            # Componentes administrativos
│   └── client/           # Componentes do cliente
├── lib/                   # Utilidades e configurações
│   ├── firebase.ts       # Configuração Firebase
│   ├── services.ts       # Serviços do Firestore
│   ├── auth.ts           # Autenticação
│   └── utils.ts          # Funções utilitárias
├── types/                 # Definições TypeScript
└── public/               # Arquivos estáticos
```

## 🎯 Fluxo de Trabalho

### 1. Configuração Inicial do Restaurante
1. Cadastre o restaurante no sistema administrativo
2. Configure mesas e gere QR Codes
3. Cadastre funcionários e seus cargos
4. Popule o cardápio com categorias e produtos

### 2. Fluxo do Cliente
1. 📱 Escaneia QR Code na mesa
2. 🍔 Navega pelo cardápio digital
3. 🛒 Adiciona itens ao carrinho
4. ✅ Finaliza o pedido
5. ⏰ Acompanha o status em tempo real
6. 🎉 Recebe o pedido na mesa

### 3. Fluxo do Restaurante
1. 🔔 Cozinha recebe notificação do novo pedido
2. 👨‍🍳 Cozinheiro prepara e atualiza status
3. 📱 Garçom é notificado sobre pedido pronto
4. 🏃 Garçom entrega pedido na mesa
5. ✅ Sistema registra entrega e libera garçom


## 🤝 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

Desenvolvido com ❤️ para revolucionar a experiência em restaurantes!
