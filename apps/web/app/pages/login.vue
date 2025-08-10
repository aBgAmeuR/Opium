<script setup lang="ts">
const { $authClient } = useNuxtApp();

const session = $authClient.useSession();
const showSignIn = ref(true);

watchEffect(() => {
  if (!session?.value.isPending && session?.value.data) {
    navigateTo("/dashboard", { replace: true });
  }
});
</script>

<template>
  <div>
    <Loader v-if="session.isPending" />
    <div v-else-if="!session.data">
      <SignInForm v-if="showSignIn" @switch-to-sign-up="showSignIn = false" />
      <SignUpForm v-else @switch-to-sign-in="showSignIn = true" />
    </div>
  </div>
</template>
