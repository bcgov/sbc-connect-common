declare module '#app' {
  interface PageMeta {
    breadcrumbs?: ConnectBreadcrumb[]
    hideBreadcrumbs: boolean | undefined
  }
}

export {}