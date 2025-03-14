export default defineAppConfig({
  connect: {
    core: {
      login: {
        redirectPath: '',
        idps: ['bcsc', 'bceid', 'idir']
      },
      header: {
        options: { // display/hide items
          localeSelect: true,
          unauthenticated: {
            whatsNew: true,
            loginMenu: true,
            createAccount: true
          },
          authenticated: {
            notifications: true,
            accountOptionsMenu: true
          }
        }
      },
      plugin: {
        authApi: {
          errorRedirect: {
            401: '/'
          }
        },
        payApi: {
          errorRedirect: {
            401: '/'
          }
        }
      }
    }
  },
  // https://ui3.nuxt.dev/getting-started/theme#design-system
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'gray'
    },
    breadcrumb: {
      slots: {
        separatorIcon: 'text-white'
      },
      variants: {
        active: {
          true: {
            link: 'text-white font-medium'
          },
          false: {
            link: 'text-white underline font-medium'
          }
        }
      },
      compoundVariants: [
        {
          disabled: false,
          active: false,
          to: true,
          class: {
            link: 'hover:text-white hover:underline transition-colors'
          }
        }
      ]
    },
    button: {
      slots: {
        base: 'cursor-pointer'
      },
      variants: {
        color: {
          white: 'text-white text-sm tracking-wide dark:text-white hover:bg-white/[0.1] focus-visible:ring-2 focus-visible:ring-white transition-colors duration-300 ease-in-out'
        },
        size: {
          sm: {
            base: 'px-7 py-0.5 text-sm gap-2.5',
            leadingIcon: 'size-4',
            leadingAvatarSize: '3xs',
            trailingIcon: 'size-4'
          },
          md: {
            base: 'px-7 py-1.5 text-sm gap-2.5',
            leadingIcon: 'size-5',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-5'
          },
          lg: {
            base: 'px-7 py-1.75 text-sm gap-2.5',
            leadingIcon: 'size-5',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-5'
          },
          xl: {
            base: 'px-7 py-2.5 text-base gap-2.5',
            leadingIcon: 'size-5',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-5'
          }
        }
      }
    },
    card: {
      slots: {
        root: 'rounded-sm'
      }
    },
    dropdownMenu: {
      slots: {
        content: 'min-w-32 max-h-[75dvh] w-min bg-(--ui-bg) shadow-lg rounded-[calc(var(--ui-radius)*1.5)] ring ring-(--ui-border) divide-y divide-(--ui-border) overflow-y-auto scroll-py-1 data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
        group: 'p-0 isolate',
        item: 'group relative w-full flex items-center select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-none data-disabled:cursor-not-allowed data-disabled:opacity-75 cursor-pointer',
        separator: '-mx-0 my-0 h-px bg-(--ui-border)'
      },
      variants: {
        color: {
          primary: '',
          secondary: '',
          success: '',
          info: '',
          warning: '',
          error: '',
          neutral: ''
        },
        active: {
          true: {
            item: 'text-bcGovColor-activeBlue before:bg-bcGovGray-100',
            itemLeadingIcon: 'text-(--ui-text)'
          },
          false: {
            item: 'text-(--ui-text) data-highlighted:text-bcGovColor-activeBlue data-[state=open]:text-(--ui-text-highlighted) data-highlighted:before:bg-bcGovGray-100 data-[state=open]:before:bg-(--ui-bg-elevated)/50 transition-colors before:transition-colors',
            itemLeadingIcon: 'text-bcGovGray-700 group-data-highlighted:text-bcGovColor-activeBlue group-data-[state=open]:text-(--ui-text) transition-colors'
          }
        },
        size: {
          md: {
            label: 'px-4 py-3 text-sm gap-1.5',
            item: 'px-4 py-3 text-sm gap-1.5',
            itemLeadingIcon: 'size-5',
            itemLeadingAvatarSize: '2xs',
            itemTrailingIcon: 'size-5',
            itemTrailingKbds: 'gap-0.5',
            itemTrailingKbdsSize: 'md'
          }
        }
      },
      compoundVariants: [
        {
          color: 'primary',
          active: false,
          class: {
            item: 'text-(--ui-primary) data-highlighted:text-(--ui-primary) data-highlighted:before:bg-(--ui-primary)/10 data-[state=open]:before:bg-(--ui-primary)/10',
            itemLeadingIcon: 'text-(--ui-primary) group-data-highlighted:text-(--ui-primary) group-data-[state=open]:text-(--ui-primary)'
          }
        },
        {
          color: 'primary',
          active: true,
          class: {
            item: 'text-(--ui-primary) before:bg-(--ui-primary)/10',
            itemLeadingIcon: 'text-(--ui-primary)'
          }
        }
      ]
    },
    icons: {
      arrowLeft: 'i-mdi-arrow-left',
      arrowRight: 'i-mdi-arrow-right',
      check: 'i-mdi-check',
      chevronDoubleLeft: 'i-mdi-chevron-double-left',
      chevronDoubleRight: 'i-mdi-chevron-double-right',
      chevronDown: 'i-mdi-menu-down',
      chevronLeft: 'i-mdi-menu-left',
      chevronRight: 'i-mdi-menu-right',
      chevronUp: 'i-mdi-menu-up',
      close: 'i-mdi-close',
      ellipsis: 'i-mdi-dots-horizontal',
      external: 'i-mdi-open-in-new',
      folder: 'i-mdi-folder',
      folderOpen: 'i-mdi-folder-open',
      loading: 'i-mdi-loading',
      minus: 'i-mdi-minus',
      plus: 'i-mdi-plus',
      search: 'i-mdi-magnify'
    },
    input: {
      variants: {
        size: {
          bcGovLg: {
            base: 'px-2.5 pb-1.5 pt-5 text-base gap-1.5',
            leading: 'ps-2.5',
            trailing: 'pe-2.5',
            leadingIcon: 'size-5',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-5'
          }
        },
        variant: {
          bcGov: 'peer rounded-t-sm rounded-b-none bg-bcGovGray-100 focus:ring-0 focus:outline-none focus:shadow-bcGovInput text-bcGovGray-900'
        }
      },
      defaultVariants: {
        size: 'bcGovLg',
        color: 'primary',
        variant: 'bcGov'
      }
    },
    modal: {
      variants: {
        fullscreen: {
          false: {
            content: 'rounded-sm'
          }
        }
      }
    },
    select: {
      slots: {
        content: 'rounded-sm',
        group: 'px-0 py-2',
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200', //  group-data-[state=open]:text-blue-500 group-data-focus:text-blue-500 // TODO: icon colour when focused
        item: 'my-0.75 text-bcGovGray-900 before:rounded-none data-highlighted:text-blue-500 data-highlighted:before:bg-blue-50 data-[state=checked]:text-blue-500',
        itemLeadingIcon: 'group-data-[state=checked]:text-blue-500 group-data-highlighted:text-blue-500 text-bcGovGray-900'
      },
      variants: {
        size: {
          bcGov: {
            base: 'px-0 py-0 text-base gap-1.5',
            leading: 'ps-2.5',
            trailing: 'pe-2.5',
            leadingIcon: 'size-5',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-5',
            label: 'p-1.5 text-xs gap-1.5',
            item: 'py-1.5 px-4 text-sm gap-3',
            itemLeadingIcon: 'size-5',
            itemLeadingAvatarSize: '2xs',
            itemLeadingChip: 'size-5',
            itemLeadingChipSize: 'md',
            itemTrailingIcon: 'size-5'
          }
        },
        variant: {
          bcGov: 'peer rounded-t-sm rounded-b-none bg-bcGovGray-100 focus:ring-0 focus:outline-none data-[state=open]:shadow-bcGovInput focus:shadow-bcGovInput text-bcGovGray-900'
        }
      },
      defaultVariants: {
        size: 'bcGov',
        color: 'primary',
        variant: 'bcGov'
      }
    },
    selectMenu: {
      variants: {
        size: {
          bcGov: {
            base: 'px-2.5 py-1.5 text-sm gap-1.5',
            leading: 'ps-2.5',
            trailing: 'pe-2.5',
            leadingIcon: 'size-5',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-5',
            label: 'p-1.5 text-xs gap-1.5',
            item: 'p-1.5 text-sm gap-1.5',
            itemLeadingIcon: 'size-5',
            itemLeadingAvatarSize: '2xs',
            itemLeadingChip: 'size-5',
            itemLeadingChipSize: 'md',
            itemTrailingIcon: 'size-5'
          }
        },
        variant: {
          bcGov: 'rounded-t-sm rounded-b-none bg-bcGovGray-100 focus:ring-0 focus:outline-none focus:shadow-bcGovInput text-bcGovGray-900'
        }
      },
      defaultVariants: {
        size: 'bcGov',
        color: 'primary',
        variant: 'bcGov'
      }
    },
    textarea: {
      variants: {
        size: {
          bcGovLg: {
            base: 'px-2.5 pb-1.5 pt-5 text-base gap-1.5',
            leading: 'ps-2.5',
            trailing: 'pe-2.5',
            leadingIcon: 'size-5',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-5'
          }
        },
        variant: {
          bcGov: 'peer rounded-t-sm rounded-b-none bg-bcGovGray-100 focus:ring-0 focus:outline-none focus:shadow-bcGovInput text-bcGovGray-900'
        }
      },
      defaultVariants: {
        size: 'bcGovLg',
        color: 'primary',
        variant: 'bcGov'
      }
    },
    toast: {
      slots: {
        root: 'bg-bcGovGray-700 ring-bcGovGray-700 ring-none',
        title: 'text-white',
        description: 'text-white',
        progress: 'hidden',
        close: 'hidden'
      }
    },
    tooltip: {
      slots: {
        content: 'bg-bcGovGray-700 ring-bcGovGray-700 text-white ring-none',
        arrow: 'fill-gray-700'
      }
    }
  }
})

// export default defineAppConfig({
//   connect: {
//     core: {
//       login: {
//         redirectPath: '',
//         idps: ['bcsc', 'bceid', 'idir']
//       },
//       header: {
//         options: { // display/hide items
//           localeSelect: true,
//           unauthenticated: {
//             whatsNew: false,
//             loginMenu: true,
//             createAccount: true
//           },
//           authenticated: {
//             notifications: true,
//             accountOptionsMenu: true
//           }
//         }
//       },
//       plugin: {
//         authApi: {
//           errorRedirect: {
//             401: '/'
//           }
//         },
//         payApi: {
//           errorRedirect: {
//             401: '/'
//           }
//         }
//       }
//     }
//   },
//   ui: {
//     primary: 'blue',
//     gray: 'bcGovGray',
//     accordion: {
//       wrapper: 'divide-y',
//       container: 'border-gray-400',
//       item: {
//         color: 'text-gray-700'
//       },
//       default: {
//         class: 'm-0 p-3 text-gray-900 font-bold bg-white hover:bg-gray-200 rounded-none'
//       }
//     },
//     alert: {
//       rounded: 'rounded',
//       inner: 'pt-2',
//       color: {
//         yellow: {
//           solid: 'bg-yellow-400 text-gray-900',
//           soft: 'bg-yellow-50 text-gray-900'
//         }
//       },
//       default: {
//         closeButton: {
//           icon: 'i-heroicons-x-mark-20-solid',
//           variant: 'link',
//           padded: false
//         }
//       }
//     },
//     button: {
//       rounded: 'rounded',
//       size: {
//         bcGov: 'text-sm'
//       },
//       padding: {
//         bcGov: 'px-7 py-3'
//       },
//       gap: {
//         bcGov: 'gap-x-2.5'
//       },
//       square: {
//         bcGov: 'p-1.5'
//       },
//       icon: {
//         size: {
//           bcGov: 'h-5 w-5'
//         }
//       },
//       color: {
//         white: {
//           header: 'text-white text-sm tracking-wide dark:text-white hover:bg-white/[0.1] dark:bg-gray-900 dark:hover:bg-gray-800/75 focus-visible:ring-2 focus-visible:ring-white dark:focus-visible:ring-white transition-colors duration-300 ease-in-out',
//           solid: 'shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-white'
//         }
//       },
//       variant: {
//         header: 'text-{color}-500 tracking-wide text-base hover:text-{color}-600 disabled:text-{color}-500 dark:text-white dark:hover:text-blue-300 dark:disabled:text-{color}-400 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-white',
//         solid: 'shadow-sm text-white dark:text-gray-900 bg-{color}-500 hover:bg-{color}-600 disabled:bg-{color}-500 dark:bg-[#E0E7ED] dark:hover:bg-bcGovGray-500 dark:disabled:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-white',
//         outline: 'ring-1 ring-inset ring-current text-{color}-500 dark:text-[#E0E7ED] hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-[#E0E7ED]/25 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-white',
//         notification_close_btn: 'text-white hover:opacity-90 underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-white'
//       }
//       // default: {
//       //   size: 'bcGov'
//       // }
//     },
//     card: {
//       rounded: 'rounded'
//     },
//     checkbox: {
//       wrapper: 'flex items-start',
//       base: 'mt-1 mr-2 cursor-pointer',
//       border: 'border-gray-500 cursor-pointer',
//       label: 'text-base text-bcGovColor-midGray font-normal'
//     },
//     chip: {
//       base: 'absolute rounded-full ring-0 dark:ring-gray-900 flex items-center justify-center text-white dark:text-gray-900 font-medium whitespace-nowrap'
//     },
//     container: {
//       strategy: 'override',
//       base: 'mx-auto',
//       padding: 'px-4 sm:px-6 lg:px-8',
//       constrained: 'max-w-bcGovLg'
//     },
//     divider: {
//       border: {
//         base: 'flex border-bcGovGray-500 dark:border-gray-300/50'
//       }
//     },
//     dropdown: {
//       container: 'overflow-clip rounded shadow-md',
//       rounded: 'rounded',
//       padding: 'py-0 px-0',
//       width: 'min-w-[250px]',
//       height: 'max-h-[75dvh]',
//       item: {
//         rounded: 'rounded-none',
//         base: 'flex items-center gap-2 w-full hover:text-bcGovColor-activeBlue hover:bg-bcGovColor-gray1',
//         padding: 'px-4 py-3',
//         disabled: 'cursor-default font-semibold opacity-100 hover:bg-white pt-0',
//         active: 'bg-bcGovColor-gray1 text-bcGovColor-activeBlue',
//         icon: {
//           base: 'flex-shrink-0 size-4 text-bcGovColor-activeBlue',
//           active: 'text-bcGovColor-activeBlue',
//           inactive: 'text-bcGovColor-midGray'
//         }
//       }
//     },
//     formGroup: {
//       label: { base: 'block text-base font-bold py-3 text-gray-900' },
//       help: 'mt-2 text-xs text-gray-700 dark:text-gray-400',
//       error: 'text-red-600'
//     },
//     input: {
//       base: 'relative text-gray-900 border-0 border-b-[1px] border-gray-500 ring-0 focus:ring-0',
//       placeholder: 'placeholder-gray-700',
//       rounded: 'rounded-none rounded-t', // rounded-t-md?
//       size: {
//         sm: 'h-[40px]',
//         lg: 'h-[56px]'
//       },
//       color: {
//         gray: {
//           outline: 'bg-gray-100 ring-0 hover:bg-gray-200 hover:border-gray-600 ' +
//             'focus:border-primary-500 focus:border-b-2 focus:ring-0'
//         },
//         primary: {
//           outline: 'bg-primary-50 ring-0 border-primary-500 hover:bg-gray-200 focus:border-b-2 focus:ring-0'
//         },
//         red: {
//           outline: 'bg-gray-100 ring-0 border-red-600 hover:bg-gray-200 ' +
//             'focus:border-red-600 focus:border-b-2 focus:ring-0'
//         }
//       },
//       icon: {
//         base: 'text-gray-700',
//         color: 'text-{color}-500',
//         trailing: {
//           padding: {
//             sm: 'px-0 pr-2.5',
//             md: 'px-0 pr-2.5',
//             lg: 'px-0 pr-2.5',
//             xl: 'px-0 pr-2.5'
//           }
//         }
//       },
//       trailing: {
//         padding: {
//           sm: 'pe-7',
//           md: 'pe-7',
//           lg: 'pe-7',
//           xl: 'pe-7'
//         }
//       },
//       default: {
//         size: 'lg',
//         color: 'gray',
//         variant: 'outline'
//       }
//     },
//     // input: {
//     //   base: 'bg-gray-100 hover:bg-gray-200 border-b-[1px] focus:border-b-2 focus:ring-0',
//     //   rounded: 'rounded-none rounded-t',
//     //   variant: {
//     //     bcGovLg: 'h-[56px] border-gray-700 placeholder-gray-700 focus:border-primary-500 focus:placeholder-primary-500',
//     //     bcGovSm: 'h-[42px] border-gray-700 placeholder-gray-700 focus:border-primary-500 focus:placeholder-primary-500',
//     //     error: 'h-[56px] border-red-500 focus:border-red-500 placeholder-red-500 focus:placeholder-red-500',
//     //     primary: 'border-primary-500 placeholder-primary-500 border-b-2'
//     //   }
//     // },
//     modal: {
//       base: 'xs:min-w-[90vw] md:min-w-[720px] text-gray-700'
//     },
//     notification: {
//       title: 'text-sm font-medium text-white',
//       description: 'mt-1 text-sm leading-4 text-white',
//       background: 'bg-gray-700',
//       rounded: 'rounded',
//       ring: 'ring-0',
//       progress: {
//         base: 'hidden',
//         background: 'bg-{color}-500 dark:bg-{color}-400'
//       },
//       default: {
//         closeButton: {
//           color: 'white',
//           variant: 'notification_close_btn'
//         }
//       }
//     },
//     notifications: {
//       position: 'bottom-0 left-1/2 -translate-x-1/2'
//     },
//     radio: {
//       base: 'h-5 w-5 mt-[3px]',
//       inner: 'ms-1',
//       label: 'cursor-pointer text-base'
//     },
//     select: {
//       base: 'bg-white border-b-[1px] border-gray-500 ring-0 focus:border-b-2 focus:ring-0',
//       rounded: 'rounded-none rounded-t', // rounded-t-md ??
//       size: {
//         sm: 'h-[40px]',
//         lg: 'h-[56px]'
//       },
//       color: {
//         gray: {
//           outline: 'bg-gray-100 ring-0 hover:bg-gray-200 hover:border-gray-600 ' +
//             'focus:border-primary-500 focus:border-b-2 focus:ring-0',
//           none: 'ring-0 hover:border-gray-600 focus:border-primary-500 focus:border-b-2 focus:ring-0'
//         },
//         primary: {
//           outline: 'bg-primary-50 ring-0 border-primary-500 hover:bg-gray-200 focus:border-b-2 focus:ring-0',
//           none: 'ring-0 border-primary-500 focus:border-b-2 focus:ring-0'
//         },
//         red: {
//           outline: 'ring-0 border-red-600 hover:bg-gray-200 ' +
//             'focus:border-red-600 focus:border-b-2 focus:ring-0'
//         }
//       },
//       icon: {
//         base: 'text-gray-700',
//         trailing: {
//           padding: {
//             '2xs': 'px-0 pr-2',
//             xs: 'px-0 pr-2.5',
//             sm: 'px-0 pr-2.5'
//           }
//         }
//       },
//       trailing: {
//         padding: {
//           '2xs': 'pe-6',
//           xs: 'pe-6',
//           sm: 'pe-7'
//         }
//       },
//       default: {
//         size: 'lg',
//         color: 'gray',
//         variant: 'outline'
//       }
//     },
//     selectMenu: {
//       label: 'text-gray-700',
//       rounded: 'rounded-none',
//       width: 'min-w-max',
//       padding: 'p-0',
//       ring: 'ring-0',
//       option: {
//         padding: 'px-3 py-2',
//         rounded: 'rounded-none',
//         active: 'text-primary-500',
//         selected: 'text-primary-500 bg-gray-100',
//         icon: {
//           active: 'text-primary-500'
//         },
//         selectedIcon: {
//           base: 'text-primary-500'
//         }
//       }
//     },
//     table: {
//       wrapper: 'relative overflow-x-auto h-[512px]',
//       divide: 'divide-y divide-gray-300 dark:divide-gray-300/50',
//       tbody: 'divide-y divide-gray-200 dark:divide-gray-300/50',
//       thead: 'sticky top-0 bg-white z-10',
//       th: {
//         color: 'text-bcGovColor-darkGray dark:text-white'
//       },
//       td: {
//         base: 'whitespace-normal max-w-96 align-top',
//         padding: 'px-4 py-4',
//         color: 'text-bcGovColor-midGray',
//         font: '',
//         size: 'text-sm'
//       }
//     },
//     textarea: {
//       base: 'bg-gray-100 hover:bg-gray-200 border-b-[1px] focus:border-b-2 h-20 focus:ring-0 text-gray-900',
//       rounded: 'rounded-none rounded-t',
//       variant: {
//         bcGov: 'border-gray-700 placeholder-gray-700 focus:border-primary-500 focus:placeholder-primary-500',
//         error: 'border-red-500 focus:border-red-500 placeholder-red-500 focus:placeholder-red-500'
//       }
//     },
//     tooltip: {
//       wrapper: 'relative inline-flex max-h-min',
//       container: 'z-20 group min-h-fit opacity-90',
//       background: 'bg-gray-700',
//       color: 'text-white',
//       ring: 'ring-0',
//       rounded: 'rounded',
//       base: 'h-auto px-2 py-1 text-sm font-normal relative whitespace-normal',
//       arrow: {
//         base: 'before:w-3 before:h-3',
//         ring: 'before:ring-0',
//         background: 'before:bg-gray-700',
//         rounded: 'before:rounded-none'
//       }
//     }
//   }
// })
