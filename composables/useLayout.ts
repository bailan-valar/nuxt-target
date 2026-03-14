export const useLayout = () => {
  const isMobileMenuOpen = useState<boolean>('mobileMenuOpen', () => false)
  const isSidebarCollapsed = useState<boolean>('sidebarCollapsed', () => false)

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
    if (import.meta.client) {
      if (isMobileMenuOpen.value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
    if (import.meta.client) {
      document.body.style.overflow = ''
    }
  }

  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

  return {
    isMobileMenuOpen,
    isSidebarCollapsed,
    toggleMobileMenu,
    closeMobileMenu,
    toggleSidebar
  }
}
