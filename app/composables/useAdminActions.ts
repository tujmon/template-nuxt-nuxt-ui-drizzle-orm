import { authClient } from '~/utils/auth-client'

export interface AdminUser {
  id: string
  name: string
  email: string
  role?: string
  banned?: boolean
  banReason?: string
  image?: string | null
}

export const useAdminActions = () => {
  const toast = useToast()
  
  const users = ref<AdminUser[]>([])
  const totalUsers = ref(0)
  const currentPage = ref(1)
  const limit = 10
  const searchQuery = ref('')
  const loading = ref(false)

  const handleError = (title: string, err: unknown) => {
    const description = err instanceof Error ? err.message : 'Erro inesperado'
    toast.add({ title, description, color: 'error' })
  }

  const fetchUsers = async () => {
    loading.value = true
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit,
          offset: (currentPage.value - 1) * limit,
          searchValue: searchQuery.value || undefined,
          searchField: 'name'
        }
      })

      if (error) {
        toast.add({ title: 'Erro ao carregar usuários', description: error.message, color: 'error' })
      } else if (data) {
        users.value = data.users as unknown as AdminUser[]
        totalUsers.value = data.total ?? data.users.length
      }
    } catch (err: unknown) {
      handleError('Erro inesperado', err)
    } finally {
      loading.value = false
    }
  }

  let searchTimeout: NodeJS.Timeout
  const triggerSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      currentPage.value = 1
      fetchUsers()
    }, 400)
  }

  const changeRole = async (user: AdminUser, newRole: string) => {
    try {
      const { error } = await authClient.admin.setRole({ userId: user.id, role: newRole as 'user' | 'admin' })
      if (error) {
        toast.add({ title: 'Erro ao alterar cargo', description: error.message, color: 'error' })
      } else {
        toast.add({ title: 'Cargo alterado com sucesso', description: `O usuário ${user.name} agora é ${newRole}.`, color: 'success' })
        await fetchUsers()
      }
    } catch (err: unknown) {
      handleError('Erro de conexão', err)
    }
  }

  const unbanUser = async (user: AdminUser) => {
    try {
      const { error } = await authClient.admin.unbanUser({ userId: user.id })
      if (error) {
        toast.add({ title: 'Erro ao desbanir usuário', description: error.message, color: 'error' })
      } else {
        toast.add({ title: 'Usuário desbanido', description: `O acesso do usuário ${user.name} foi restabelecido.`, color: 'success' })
        await fetchUsers()
      }
    } catch (err: unknown) {
      handleError('Erro ao desbanir', err)
    }
  }

  const impersonateUser = async (user: AdminUser) => {
    try {
      const { error } = await authClient.admin.impersonateUser({ userId: user.id })
      if (error) {
        toast.add({ title: 'Erro ao impersonar usuário', description: error.message, color: 'error' })
      } else {
        toast.add({
          title: 'Impersonation iniciada',
          description: `Você está navegando como ${user.name}.`,
          color: 'success'
        })
        await navigateTo('/dashboard')
      }
    } catch (err: unknown) {
      handleError('Erro ao impersonar usuário', err)
    }
  }

  return {
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
  }
}
