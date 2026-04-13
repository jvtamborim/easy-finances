# Vue + Firebase + Pinia (Aulas)

Este projeto foi feito para ensinar, passo a passo, como usar:
- Firebase (Auth + Firestore)
- Pinia (estado global)
- Vue Router (rotas protegidas)

Tudo esta comentado no codigo, de forma coloquial, para facilitar.

---

## Dependencias

Instale as dependencias dentro da pasta do projeto:

```
npm install
npm install pinia vue-router firebase
```

---

## Como rodar

```
npm run dev
```

---

## Aula 1 — Alicerce (Firebase centralizado)

**Objetivo:** criar um unico arquivo de configuracao do Firebase.

Arquivos:
- `src/firebase/config.js`

O que o aluno precisa fazer:
1. Ir no console do Firebase
2. Criar um app Web
3. Copiar o `firebaseConfig`
4. Colar no `config.js`

Por que isso e importante:
- Evita configurar Firebase em cada tela
- Centraliza tudo em um lugar

---

## Aula 2 — Fiacao (Pinia)

**Objetivo:** guardar o usuario logado em um lugar global.

Arquivos:
- `src/stores/authStore.js`
- `src/main.js`

Conceitos:
- `user` fica salvo no Pinia
- `authIsReady` evita "piscar" telas protegidas
- `onAuthStateChanged` espera o Firebase responder antes de montar o app

---

## Aula 3 — Portas (Vue Router + guarda)

**Objetivo:** proteger telas que exigem login.

Arquivos:
- `src/router/index.js`

Conceitos:
- `meta.requiresAuth` marca rota protegida
- `beforeEach` bloqueia quando nao tem usuario

---

## Aula 4 — Armario (Firestore CRUD)

**Objetivo:** salvar e ler dados do Firestore.

Arquivos:
- `src/views/DashboardView.vue`

Conceitos:
- `addDoc` (Create)
- `onSnapshot` (Read em tempo real)
- Sempre salvar `userId` (dono do dado)

---

## Telas do projeto

- `src/views/HomeView.vue` → tela inicial e status do login
- `src/views/LoginView.vue` → login e cadastro
- `src/views/DashboardView.vue` → tela protegida com Firestore

---

## Dicas para o professor

- Mostre o fluxo completo: **Configurar → Autenticar → Proteger → Persistir**
- Peça para o aluno testar a guarda tentando abrir `/dashboard` sem login
- Explique o motivo do `userId` no Firestore (seguranca e privacidade)

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
