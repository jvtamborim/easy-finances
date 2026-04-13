<template>
  <div class="app-container">
    <header class="header">
      <h1>EASY FINANCES</h1>
      <div class="glow-line"></div>
    </header>

    <main v-if="currentView !== 'dashboard'" class="auth-section">
      <div class="card bg-dark-gray auth-card highlight-border">
        <h2>{{ currentView === 'login' ? 'ACESSO AO SISTEMA' : 'NOVO REGISTRO' }}</h2>
        
        <form @submit.prevent="currentView === 'login' ? handleLogin() : handleRegister()" class="auth-form">
          <div class="input-group">
            <input type="text" v-model="authForm.username" placeholder="Usuário" required />
          </div>
          <div class="input-group">
            <input type="password" v-model="authForm.password" placeholder="Senha" required />
          </div>
          <p v-if="authError" class="error-text">{{ authError }}</p>
          <button type="submit" class="btn-submit">
            {{ currentView === 'login' ? 'ENTRAR' : 'CADASTRAR' }}
          </button>
        </form>

        <div class="auth-toggle">
          <a href="#" @click.prevent="toggleAuthView" class="text-cyan">
            {{ currentView === 'login' ? 'Não possui conta? Registre-se.' : 'Já possui conta? Faça Login.' }}
          </a>
        </div>
      </div>
    </main>

    <main v-else class="main-app">
      
      <nav class="top-menu bg-dark-gray">
        <div class="tabs">
          <button 
            :class="{ active: activeTab === 'overview' }" 
            @click="activeTab = 'overview'"
          >
            📊 Resumo
          </button>
          <button 
            :class="{ active: activeTab === 'transactions' }" 
            @click="activeTab = 'transactions'"
          >
            📋 Histórico
          </button>
        </div>
        <div class="user-actions">
          <button @click="showModal = true" class="btn-action">+ NOVA TRANSAÇÃO</button>
          <span class="user-name">{{ currentUser }}</span>
          <button @click="handleLogout" class="btn-logout">Sair</button>
        </div>
      </nav>

      <div class="tab-content">
        
        <template v-if="activeTab === 'overview'">
          <section class="summary-cards">
            <div class="card bg-dark-gray">
              <h3>RECEITAS</h3>
              <p class="value text-cyan">R$ {{ totalIncome.toFixed(2) }}</p>
            </div>
            <div class="card bg-dark-gray">
              <h3>DESPESAS</h3>
              <p class="value text-purple">R$ {{ totalExpense.toFixed(2) }}</p>
            </div>
            <div class="card bg-black highlight-border">
              <h3>SALDO TOTAL</h3>
              <p class="value" :class="balance >= 0 ? 'text-cyan' : 'text-purple'">
                R$ {{ balance.toFixed(2) }}
              </p>
            </div>
          </section>

          <div class="reports-grid mt-2">
            
            <section class="category-section">
              <h2>DESPESAS POR CATEGORIA</h2>
              <div class="category-list" v-if="expensesByCategory.length > 0">
                <div v-for="item in expensesByCategory" :key="item.name" class="category-card bg-dark-gray">
                  <div class="cat-header">
                    <span class="cat-icon-small">{{ getCategoryIcon(item.name) }}</span>
                    <span class="chart-cat-name">{{ item.name }}</span>
                    <span class="chart-cat-value text-purple">R$ {{ item.total.toFixed(2) }}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill fill-purple" :style="{ width: item.percentage + '%' }"></div>
                  </div>
                </div>
              </div>
              <p v-else class="empty-text bg-dark-gray card">Sem despesas registadas.</p>
            </section>

            <section class="category-section">
              <h2>RECEITAS POR CATEGORIA</h2>
              <div class="category-list" v-if="incomesByCategory.length > 0">
                <div v-for="item in incomesByCategory" :key="item.name" class="category-card bg-dark-gray">
                  <div class="cat-header">
                    <span class="cat-icon-small">{{ getCategoryIcon(item.name) }}</span>
                    <span class="chart-cat-name">{{ item.name }}</span>
                    <span class="chart-cat-value text-cyan">R$ {{ item.total.toFixed(2) }}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill fill-cyan" :style="{ width: item.percentage + '%' }"></div>
                  </div>
                </div>
              </div>
              <p v-else class="empty-text bg-dark-gray card">Sem receitas registadas.</p>
            </section>

          </div>

          <section class="top-expenses-section mt-2 bg-dark-gray">
            <h2>🚨 TOP 3 MAIORES DESPESAS</h2>
            <ul v-if="topExpenses.length > 0" class="top-list">
              <li v-for="(t, index) in topExpenses" :key="t.id" class="top-item">
                <span class="top-rank">#{{ index + 1 }}</span>
                <span class="top-desc">{{ t.description }}</span>
                <span class="cat-badge">{{ getCategoryIcon(t.category) }} {{ t.category }}</span>
                <span class="top-amt text-purple">R$ {{ t.amount.toFixed(2) }}</span>
              </li>
            </ul>
            <p v-else class="empty-text">Ainda não há despesas para análise.</p>
          </section>

        </template>

        <template v-if="activeTab === 'transactions'">
          <section class="list-section bg-dark-gray">
            <h2>HISTÓRICO COMPLETO DE TRANSAÇÕES</h2>
            <ul v-if="transactions.length > 0" class="transaction-list">
              <li v-for="t in transactions" :key="t.id" class="transaction-item" :class="t.type">
                <div class="item-info">
                  <span class="desc">{{ t.description }}</span>
                  <span class="cat-badge">
                    {{ getCategoryIcon(t.category) }} {{ t.category }}
                  </span>
                </div>
                <div class="item-actions">
                  <span class="amt">R$ {{ t.amount.toFixed(2) }}</span>
                  <button class="btn-delete" @click="removeTransaction(t.id)" title="Excluir">×</button>
                </div>
              </li>
            </ul>
            <p v-else class="empty-text">Nenhum registo encontrado.</p>
          </section>
        </template>

      </div>
    </main>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content bg-dark-gray highlight-border">
        <div class="modal-header">
          <h2>REGISTRAR TRANSAÇÃO</h2>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        
        <form @submit.prevent="addTransaction" class="transaction-form">
          <div class="input-group full-width">
            <input type="text" v-model="transactionForm.description" placeholder="Descrição (ex: Supermercado, Salário)" required />
          </div>
          
          <div class="input-group full-width">
            <input type="number" v-model="transactionForm.amount" placeholder="Valor (R$)" step="0.01" min="0.01" required />
          </div>
          
          <div class="input-group full-width">
            <select v-model="transactionForm.type" @change="updateDefaultCategory">
              <option value="expense">Despesa (Saída)</option>
              <option value="income">Receita (Entrada)</option>
            </select>
          </div>

          <div class="input-group full-width">
            <select v-model="transactionForm.category" required>
              <option value="" disabled>Selecione a Categoria</option>
              <option v-for="cat in availableCategories" :key="cat" :value="cat">
                {{ getCategoryIcon(cat) }} {{ cat }}
              </option>
            </select>
          </div>

          <button type="submit" class="btn-submit full-width mt-1">SALVAR REGISTRO</button>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// --- ESTADO DE AUTENTICAÇÃO E NAVEGAÇÃO ---
const currentView = ref('login');
const currentUser = ref(null);
const authForm = ref({ username: '', password: '' });
const authError = ref('');
const activeTab = ref('overview');

// Estado do Modal
const showModal = ref(false);

// --- ESTADO FINANCEIRO ---
const transactions = ref([]);

const categoryIcons = {
  'Alimentação': '🍔', 'Moradia': '🏠', 'Transporte': '🚗', 
  'Saúde': '💊', 'Educação': '📚', 'Lazer': '🎮', 'Contas': '🧾',
  'Salário': '💰', 'Freelance': '💻', 'Investimentos': '📈', 
  'Rendimentos': '🏦', 'Outros': '📌'
};

const categoryOptions = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Rendimentos', 'Outros'],
  expense: ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Contas', 'Outros']
};

const transactionForm = ref({ 
  description: '', amount: '', type: 'expense', category: 'Alimentação' 
});

const getCategoryIcon = (categoryName) => categoryIcons[categoryName] || '📌';
const availableCategories = computed(() => categoryOptions[transactionForm.value.type]);

const updateDefaultCategory = () => {
  transactionForm.value.category = availableCategories.value[0];
};

const closeModal = () => {
  showModal.value = false;
  // Reseta o formulário ao fechar
  transactionForm.value = { description: '', amount: '', type: 'expense', category: 'Alimentação' };
};

// --- LÓGICA DE AUTENTICAÇÃO ---
const toggleAuthView = () => {
  currentView.value = currentView.value === 'login' ? 'register' : 'login';
  authError.value = '';
};

const handleRegister = () => {
  const users = JSON.parse(localStorage.getItem('sys_users') || '{}');
  if (users[authForm.value.username]) {
    authError.value = 'Utilizador já existe!';
    return;
  }
  users[authForm.value.username] = { password: authForm.value.password, transactions: [] };
  localStorage.setItem('sys_users', JSON.stringify(users));
  authError.value = '';
  currentView.value = 'login';
  authForm.value = { username: '', password: '' };
  alert('Registo concluído! Inicie sessão.');
};

const handleLogin = () => {
  const users = JSON.parse(localStorage.getItem('sys_users') || '{}');
  const user = users[authForm.value.username];
  if (!user || user.password !== authForm.value.password) {
    authError.value = 'Credenciais inválidas!';
    return;
  }
  currentUser.value = authForm.value.username;
  transactions.value = user.transactions || [];
  currentView.value = 'dashboard';
  activeTab.value = 'overview';
  authError.value = '';
  authForm.value = { username: '', password: '' };
};

const handleLogout = () => {
  currentUser.value = null;
  transactions.value = [];
  currentView.value = 'login';
};

// --- LÓGICA FINANCEIRA ---
const saveTransactions = () => {
  if (!currentUser.value) return;
  const users = JSON.parse(localStorage.getItem('sys_users') || '{}');
  if (users[currentUser.value]) {
    users[currentUser.value].transactions = transactions.value;
    localStorage.setItem('sys_users', JSON.stringify(users));
  }
};

const totalIncome = computed(() => transactions.value.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0));
const totalExpense = computed(() => transactions.value.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0));
const balance = computed(() => totalIncome.value - totalExpense.value);

// Gráfico Despesas
const expensesByCategory = computed(() => {
  if (totalExpense.value === 0) return [];
  const expenses = transactions.value.filter(t => t.type === 'expense');
  const categoryTotals = {};
  expenses.forEach(t => categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount);
  return Object.entries(categoryTotals)
    .map(([name, total]) => ({ name, total, percentage: (total / totalExpense.value) * 100 }))
    .sort((a, b) => b.total - a.total);
});

// Gráfico Receitas
const incomesByCategory = computed(() => {
  if (totalIncome.value === 0) return [];
  const incomes = transactions.value.filter(t => t.type === 'income');
  const categoryTotals = {};
  incomes.forEach(t => categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount);
  return Object.entries(categoryTotals)
    .map(([name, total]) => ({ name, total, percentage: (total / totalIncome.value) * 100 }))
    .sort((a, b) => b.total - a.total);
});

// Top Maiores Despesas
const topExpenses = computed(() => {
  const expenses = transactions.value.filter(t => t.type === 'expense');
  return expenses.sort((a, b) => b.amount - a.amount).slice(0, 3);
});

const addTransaction = () => {
  if (transactionForm.value.description && transactionForm.value.amount > 0 && transactionForm.value.category) {
    transactions.value.push({
      id: Date.now(),
      description: transactionForm.value.description,
      amount: parseFloat(transactionForm.value.amount),
      type: transactionForm.value.type,
      category: transactionForm.value.category
    });
    saveTransactions();
    closeModal(); // Fecha e limpa o modal
  }
};

const removeTransaction = (id) => {
  transactions.value = transactions.value.filter(t => t.id !== id);
  saveTransactions();
};
</script>

<style>
/* Reset Básico */
:root {
  --bg-color: #0a0a0a;
  --card-bg: #141414;
  --text-main: #e0e0e0;
  --cyan-blue: #00d2ff;
  --purple: #8e2de2;
  --danger: #ff0044;
  --font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { background-color: var(--bg-color); }
body { background-color: var(--bg-color); color: var(--text-main); font-family: var(--font-family); min-height: 100vh; margin: 0; }
.app-container { max-width: 1000px; margin: 0 auto; padding: 2rem; min-height: 100vh; }

/* Cabeçalho */
.header { text-align: center; margin-bottom: 2rem; }
.header h1 { font-size: 2rem; letter-spacing: 3px; color: #fff; font-weight: 800; }
.glow-line { height: 4px; width: 100%; margin-top: 12px; background: linear-gradient(90deg, var(--cyan-blue), var(--purple)); box-shadow: 0 0 10px rgba(0, 210, 255, 0.5), 0 0 20px rgba(142, 45, 226, 0.5); border-radius: 2px; }

/* Globais e Espaçamentos */
.bg-dark-gray { background-color: var(--card-bg); }
.bg-black { background-color: #000; }
.highlight-border { border: 1px solid rgba(0, 210, 255, 0.3); box-shadow: 0 0 15px rgba(0, 210, 255, 0.15); }
.text-cyan { color: var(--cyan-blue); }
.text-purple { color: var(--purple); }
.mt-1 { margin-top: 1rem; }
.mt-2 { margin-top: 2rem; }

/* MENU SUPERIOR */
.top-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-bottom: 2px solid #222;
  flex-wrap: wrap;
  gap: 1rem;
}
.tabs { display: flex; gap: 1rem; }
.tabs button {
  background: transparent; border: none; color: #888; font-size: 1rem; font-weight: 600; padding: 0.5rem 1rem; cursor: pointer; border-radius: 6px; transition: all 0.3s;
}
.tabs button:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
.tabs button.active { color: var(--cyan-blue); background: rgba(0, 210, 255, 0.1); box-shadow: inset 0 -2px 0 var(--cyan-blue); }

.user-actions { display: flex; align-items: center; gap: 1rem; }
.btn-action { background: linear-gradient(45deg, var(--cyan-blue), var(--purple)); color: #fff; font-weight: bold; padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; box-shadow: 0 0 10px rgba(0,210,255,0.3); transition: 0.3s; }
.btn-action:hover { transform: scale(1.05); }
.user-name { font-weight: bold; color: var(--cyan-blue); margin-left: 0.5rem; }
.btn-logout { background: transparent; border: 1px solid var(--danger); color: var(--danger); padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; transition: 0.3s; font-size: 0.85rem;}
.btn-logout:hover { background: var(--danger); color: #fff; }

/* Resumo (Cards Topo) */
.summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
.card { padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); }
.card h3 { font-size: 0.85rem; color: #888; margin-bottom: 0.5rem; letter-spacing: 1.5px; }
.value { font-size: 2rem; font-weight: 700; }

/* RELATÓRIOS GRID */
.reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
.category-section h2 { font-size: 1rem; color: #aaa; margin-bottom: 1rem; border-bottom: 1px solid #222; padding-bottom: 0.5rem; letter-spacing: 1px; }
.category-list { display: flex; flex-direction: column; gap: 0.8rem; }
.category-card { padding: 1rem; border-radius: 8px; border-left: 3px solid #444; display: flex; flex-direction: column; gap: 0.5rem; }
.category-card:hover { background-color: #1a1a1a; border-left-color: var(--cyan-blue); }
.cat-header { display: flex; align-items: center; justify-content: space-between; }
.cat-icon-small { font-size: 1.2rem; margin-right: 0.5rem; }
.chart-cat-name { flex: 1; color: #ccc; font-weight: 500; }
.chart-cat-value { font-weight: bold; }
.progress-track { width: 100%; height: 6px; background-color: #222; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.8s ease-out; }
.fill-purple { background: var(--purple); box-shadow: 0 0 8px rgba(142, 45, 226, 0.6); }
.fill-cyan { background: var(--cyan-blue); box-shadow: 0 0 8px rgba(0, 210, 255, 0.6); }

/* TOP DESPESAS */
.top-expenses-section { padding: 1.5rem; border-radius: 8px; border-top: 4px solid var(--danger); }
.top-expenses-section h2 { font-size: 1rem; color: #fff; margin-bottom: 1rem; }
.top-list { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; }
.top-item { display: flex; align-items: center; background: #000; padding: 1rem; border-radius: 6px; }
.top-rank { font-size: 1.2rem; font-weight: 900; color: #444; margin-right: 1rem; width: 30px;}
.top-desc { flex: 1; font-weight: 600; font-size: 1.1rem; }
.top-amt { font-weight: bold; font-size: 1.2rem; margin-left: 1rem; }

/* MODAL DE TRANSAÇÃO */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { width: 90%; max-width: 450px; padding: 2rem; border-radius: 12px; position: relative; animation: slideIn 0.3s ease-out; }
@keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.modal-header h2 { font-size: 1.2rem; color: var(--cyan-blue); }
.btn-close { background: none; border: none; color: #888; font-size: 2rem; cursor: pointer; line-height: 1; transition: 0.2s;}
.btn-close:hover { color: var(--danger); }

/* Formulário (Modal) */
.transaction-form { display: flex; flex-wrap: wrap; gap: 1rem; }
.full-width { flex: 1 1 100%; }
input, select { width: 100%; padding: 0.9rem; border: 1px solid #2a2a2a; background-color: #0a0a0a; color: #fff; border-radius: 4px; outline: none; font-size: 1rem; }
input:focus, select:focus { border-color: var(--cyan-blue); box-shadow: 0 0 8px rgba(0, 210, 255, 0.3); }
.btn-submit { padding: 1rem; background: linear-gradient(45deg, var(--purple), var(--cyan-blue)); color: #fff; font-weight: bold; font-size: 1rem; border: none; border-radius: 4px; cursor: pointer; letter-spacing: 1px; transition: opacity 0.3s; }
.btn-submit:hover { opacity: 0.85; }

/* Lista de Transações (Histórico) */
.list-section { padding: 1.5rem; border-radius: 8px; }
.list-section h2 { font-size: 1.1rem; color: #aaa; margin-bottom: 1.5rem; border-bottom: 1px solid #222; padding-bottom: 0.8rem; letter-spacing: 1px; }
.transaction-list { list-style: none; }
.transaction-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; margin-bottom: 0.8rem; background-color: #0a0a0a; border-radius: 4px; border-right: 4px solid transparent; }
.transaction-item.income { border-right-color: var(--cyan-blue); }
.transaction-item.expense { border-right-color: var(--purple); }
.item-info { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
.desc { font-weight: 500; font-size: 1.05rem; }
.cat-badge { font-size: 0.75rem; background-color: #222; padding: 0.3rem 0.6rem; border-radius: 4px; width: fit-content; color: #ccc; }
.item-actions { display: flex; align-items: center; gap: 1rem; }
.amt { font-weight: bold; }
.btn-delete { background: none; border: none; color: #444; font-size: 1.5rem; cursor: pointer; }
.btn-delete:hover { color: var(--danger); }
.empty-text { text-align: center; color: #555; font-style: italic; padding: 1rem 0; }

/* Autenticação */
.auth-section { display: flex; justify-content: center; align-items: center; margin-top: 2rem; min-height: calc(100vh - 120px); }
.auth-card { width: 100%; max-width: 400px; padding: 2.5rem 2rem; }
.auth-card h2 { text-align: center; margin-bottom: 1.5rem; color: #fff; }
.auth-form { display: flex; flex-direction: column; gap: 1rem; }
.error-text { color: var(--danger); font-size: 0.9rem; text-align: center; }
.auth-toggle { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; }
.auth-toggle a { text-decoration: none; }
.auth-toggle a:hover { opacity: 0.7; }
</style>