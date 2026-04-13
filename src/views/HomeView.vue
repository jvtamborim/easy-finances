<script setup>
/**
 * HomeView.vue — Tela Inicial
 *
 * Propósito: exibir uma tela de boas-vindas simples que mostra
 * o estado de autenticação do usuário em tempo real.
 *
 * Conceitos demonstrados neste componente:
 * 
 *  - Pinia: lendo estado de uma store (authStore)
 *  - computed(): derivar dados reativos a partir do estado
 */

// "computed" cria uma propriedade reativa derivada.
// Ela recalcula automaticamente quando a dependência muda.
import { computed } from 'vue'

// Importa a store de autenticação (Pinia).
// A store centraliza o estado de login para toda a aplicação.
import { useAuthStore } from '../stores/authStore'

// Obtém a instância da store. A partir daqui temos acesso
// a authStore.user, authStore.login(), authStore.logout() etc.
const authStore = useAuthStore()

// Propriedade computada: retorna o e-mail do usuário logado.
// O operador ?. (optional chaining) evita erro se user for null.
// O operador || define um valor padrão caso o e-mail não exista.
const userEmail = computed(() => authStore.user?.email || 'Nenhum usuario logado')
</script>

<template>
  <!--
    <section class="card"> — container visual da tela.
    O estilo "card" provavelmente vem de um CSS global do projeto.
  -->
  <section class="card">

    <!-- Título da página com ícone do Font Awesome -->
    <h1><i class="fa-solid fa-house"></i> Inicio</h1>

    <!-- Breve descrição das tecnologias usadas no projeto -->
    <p>Este projeto mostra Pinia + Router + Firebase.</p>

    <p>
      <strong>Status:</strong>

      <!--
        Renderização condicional inline com operador ternário.
        authStore.user é null quando deslogado, ou um objeto quando logado.
        Vue avalia essa expressão de forma reativa:
        qualquer mudança em authStore.user atualiza o DOM automaticamente.
      -->
      {{ authStore.user ? 'Logado' : 'Deslogado' }}

      <!--
        Exibe o e-mail entre parênteses usando a computed "userEmail".
        "muted" é uma classe CSS para texto em cor discreta/cinza.
      -->
      <span class="muted">({{ userEmail }})</span>
    </p>

    
    <p class="muted">
      Dica: tente acessar o Dashboard sem logar para ver a guarda em acao.
    </p>

  </section>
</template>