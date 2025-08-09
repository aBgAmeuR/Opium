export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $authClient } = useNuxtApp()
  const session = $authClient.useSession()
  if (session.value.isPending) return
  const email = session.value.data?.user?.email
  if (!email || email !== 'admin@admin.com') {
    return navigateTo('/login')
  }
})


