declare module '#app' {
  interface PageMeta {
    /**
     * Controls how the global auth middleware handles this page.
     *
     * - public: available to everyone
     * - guest: available only when signed out
     * - protected: requires an authenticated session
     */
    auth?: 'public' | 'guest' | 'protected'
  }
}

export {}
