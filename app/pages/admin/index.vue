<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { useAdminActions, type AdminUser } from '~/composables/useAdminActions'
import CreateUserModal from '~/components/admin/CreateUserModal.vue'
import BanUserModal from '~/components/admin/BanUserModal.vue'

definePageMeta({
  auth: 'protected',
  middleware: 'admin' as any // eslint-disable-line @typescript-eslint/no-explicit-any
})

useSeoMeta({
  title: 'Painel Admin — Administração de Usuários',
  robots: 'noindex, nofollow'
})

const {
  users,
  totalUsers,
  currentPage,
  limit,
  searchQuery,
  loading,
  fetchUsers,
  triggerSearch,
  changeRole,
  unbanUser,
  impersonateUser
} = useAdminActions()

// Modals state
const banModalOpen = ref(false)
const selectedUserForBan = ref<AdminUser | null>(null)
const createUserModalOpen = ref(false)

const openBanModal = (user: AdminUser) => {
  selectedUserForBan.value = user
  banModalOpen.value = true
}

// Table columns
const columns: ColumnDef<AdminUser>[] = [
  { accessorKey: 'name', header: 'Nome' },
  { accessorKey: 'email', header: 'E-mail' },
  { accessorKey: 'role', header: 'Cargo' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'actions', header: 'Ações' }
]

// Dropdown actions generator
const getActions = (row: AdminUser) => [[
  {
    label: row.role === 'admin' ? 'Tornar Usuário Comum' : 'Tornar Administrador',
    icon: row.role === 'admin' ? 'i-lucide-user' : 'i-lucide-shield-check',
    onSelect: () => changeRole(row, row.role === 'admin' ? 'user' : 'admin')
  },
  {
    label: 'Impersonar Usuário',
    icon: 'i-lucide-log-in',
    onSelect: () => impersonateUser(row)
  },
  {
    label: row.banned ? 'Desbanir Usuário' : 'Banir Usuário',
    icon: row.banned ? 'i-lucide-circle-check' : 'i-lucide-ban',
    onSelect: () => row.banned ? unbanUser(row) : openBanModal(row)
  }
]]

// Initial fetch
onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-highlighted">Administração de Usuários</h1>
        <p class="text-sm text-muted">Gerencie usuários, cargos, banimentos e simule sessões utilizando o Better Auth.</p>
      </div>
      <UButton
        color="success"
        icon="i-lucide-user-plus"
        class="w-auto shrink-0"
        @click="createUserModalOpen = true"
      >
        Novo Usuário
      </UButton>
    </div>

    <!-- Filters and Table Card -->
    <UCard class="bg-elevated border-muted" :ui="{ body: 'p-0' }">
      <template #header>
        <div class="flex items-center justify-between gap-4 p-4">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Buscar por nome ou e-mail..."
            class="max-w-xs w-full"
            color="neutral"
            @input="triggerSearch"
          />
          <div class="text-xs text-muted">
            Total de usuários: <span class="font-bold text-highlighted">{{ totalUsers }}</span>
          </div>
        </div>
      </template>

      <!-- Users Table -->
      <UTable
        :data="users"
        :columns="columns"
        :loading="loading"
        class="relative overflow-x-auto"
        :ui="{ 
          td: 'text-toned',
          th: 'text-muted'
        }"
      >
        <!-- Custom Name / Avatar Slot -->
        <template #name-cell="{ row }">
          <div class="flex items-center space-x-3">
            <UAvatar :alt="row.original.name" :src="row.original.image || undefined" size="sm" />
            <div class="font-medium text-highlighted">{{ row.original.name }}</div>
          </div>
        </template>

        <!-- Custom Role Badge -->
        <template #role-cell="{ row }">
          <UBadge
            :color="row.original.role === 'admin' ? 'success' : 'neutral'"
            variant="solid"
            size="xs"
            class="capitalize font-mono"
          >
            {{ row.original.role || 'user' }}
          </UBadge>
        </template>

        <!-- Status Column -->
        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.banned ? 'error' : 'success'"
            variant="soft"
            size="xs"
          >
            {{ row.original.banned ? 'Banido' : 'Ativo' }}
          </UBadge>
        </template>

        <!-- Action Dropdown Column -->
        <template #actions-cell="{ row }">
          <UDropdownMenu :items="getActions(row.original)" :content="{ align: 'end' }">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-ellipsis"
            />
          </UDropdownMenu>
        </template>
      </UTable>

      <!-- Pagination Footer -->
      <template v-if="totalUsers > limit" #footer>
        <div class="flex justify-center p-4">
          <UPagination
            v-model="currentPage"
            :page-count="limit"
            :total="totalUsers"
            show-first
            show-last
          />
        </div>
      </template>
    </UCard>

    <!-- Create User Modal Component -->
    <CreateUserModal
      v-model="createUserModalOpen"
      @created="fetchUsers"
    />

    <!-- Ban User Confirmation Modal Component -->
    <BanUserModal
      v-model="banModalOpen"
      :user="selectedUserForBan"
      @banned="fetchUsers"
    />
  </div>
</template>
