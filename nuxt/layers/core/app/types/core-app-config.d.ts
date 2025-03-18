export type LoginConfig = {
  redirectPath: string
  idps: Array<'bcsc' | 'bceid' | 'idir'>
}

export type HeaderOptions = {
  localeSelect: boolean,
  unauthenticated: {
    whatsNew: boolean,
    loginMenu: boolean,
    createAccount: boolean
  },
  authenticated: {
    notifications: boolean,
    accountOptionsMenu: boolean
  }
}

export type ConnectAppConfig = {
  connect: {
    core: {
      login: LoginConfig,
      header: {
        options: HeaderOptions
      },
      footer: {
        versions: string[]
      },
      plugin: {
        authApi: {
          errorRedirect: {
            401: string
          }
        },
        payApi: {
          errorRedirect: {
            401: string
          }
        }
      }
    }
  }
}

declare module '@nuxt/schema' {
  interface AppConfigInput extends ConnectAppConfig {}
}

declare module 'nuxt/schema' {
  interface AppConfig extends ConnectAppConfig {}
}

export {}