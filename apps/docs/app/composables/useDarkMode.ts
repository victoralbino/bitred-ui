import { useColorMode } from '@vueuse/core';
import { computed } from 'vue';

export function useDarkMode() {
  const mode = useColorMode({
    attribute: 'class',
    modes: {
      light: '',
      dark: 'dark',
    },
  });

  const isDark = computed(() => mode.value === 'dark');

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark';
  }

  function setDark() {
    mode.value = 'dark';
  }

  function setLight() {
    mode.value = 'light';
  }

  return {
    mode,
    isDark,
    toggle,
    setDark,
    setLight,
  };
}
