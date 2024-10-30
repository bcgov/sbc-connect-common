export default {
  btn: {
    appVersion: {
      show: 'Show App Version',
      hide: 'Hide App Version'
    },
    bcRegHome: 'BC Registries Home',
    createAccount: 'Create Account',
    editProfile: 'Edit Profile',
    logout: 'Log out',
    login: 'Log in',
    accountInfo: 'Account Info',
    teamMembers: 'Team Members',
    transactions: 'Transactions',
    notifications: {
      main: 'Notifications',
      aria: 'Notifications, {count} New'
    },
    accountOptionsMenu: 'Account Options Menu',
    whatsNew: "What's New",
    mainMenu: 'Main menu',
    next: 'Next',
    previous: 'Previous',
    submitAndPay: 'Submit & Pay',
    back: 'Back',
    fileNowNoFee: 'File Now (no fee)',
    reviewConfirm: 'Review and Confirm',
    save: 'Save',
    saveExit: 'Save and Resume Later'
  },
  currency: {
    cad: 'CAD',
    usd: 'USD'
  },
  label: {
    accountSettings: 'Account Settings',
    bcRegOLServices: 'BC Registries and Online Services',
    switchAccount: 'Switch Account',
    selectLoginMethod: 'Select log in method',
    bcsc: 'BC Services Card',
    bceid: 'BCeID',
    idir: 'IDIR',
    note: 'Note',
    optional: 'Optional',
    birthdate: 'Birthdate',
    competency: 'Competency',
    citizenship: 'Citizenship',
    citizenshipPR: 'Citizenship/Permanent Residency',
    emailAddress: 'Email Address',
    emailAddressOpt: 'Email Address (Optional)',
    firstName: 'First Name',
    middleName: 'Middle Name',
    middleNameOpt: 'Middle Name (Optional)',
    lastName: 'Last Name',
    fullName: 'Full Legal Name',
    preferredName: 'Preferred Name',
    state: 'State',
    street: 'Street Address',
    streetAdditional: 'Additional Street Address (Optional)',
    country: 'Country',
    line1: 'Address Line 1',
    line2: 'Address Line 2 (Optional)',
    city: 'City',
    region: 'Region',
    regionOpt: 'Region (Optional)',
    postalCode: 'Postal Code',
    zipCode: 'Zip Code',
    code: 'Code',
    locationDescription: 'Location Description (Optional)',
    phone: {
      countryCode: 'Country code',
      number: 'Phone Number',
      extension: 'Extension (Optional)'
    }
  },
  notifications: {
    none: 'No Notifications',
    teamMemberApproval: '{count} team member requires approval to access this account. | {count} team members require approval to access this account.'
  },
  text: {
    preferredName: {
      checkbox: 'This individual also has an another name they prefer to use',
      note: 'Preferred name refers to the name that an individual chooses to use and be addressed by, which may differ from their legal or given name.',
      hint: 'Example: William Smith may prefer to go by Bill Smith to their acquaintances'
    },
    streetHint: 'Street address, PO box, rural route, or general delivery address'
  },
  feeSummary: {
    title: 'Fee Summary',
    total: 'Total Fees',
    noFee: 'No Fee',
    priorityFees: 'Priority Fees',
    futureEffectiveFees: 'Future Effective Fees',
    serviceFees: 'Service Fee',
    itemLabels: {
      BCANN: 'BC Annual Report',
      PLATREG_SM: 'Platform Registration Fee',
      PLATREG_LG: 'Platform Registration Fee',
      REGSIGIN: 'Significant Individual Change',
      RENTAL_FEE: 'Registration Fee',
      PLACEHOLDER: 'Placeholder (Replace Me)', // each project using the connect fee widget should change the placeholder filingTypeCode
      TEST: 'This is test entry',
      undefined: 'Item Fee'
    }
  },
  validation: {
    required: 'Required',
    address: {
      country: 'Please select a country',
      street: 'Please enter a street address',
      city: 'Please enter a city',
      region: 'Please select a region',
      postalCode: 'Please enter a postal code',
      requiredBC: {
        region: 'Please enter a BC address',
        country: 'Please enter a BC, Canada address'
      }
    },
    business: {
      legalName: 'Please enter the business legal name',
      jurisdiction: 'Please enter the business home jusrisdiction',
      cpbc: 'Please enter the CPBC number'
    },
    email: 'Please enter a valid email',
    name: {
      first: 'Please enter a first name',
      last: 'Please enter a last name',
      full: 'Please enter a full legal name'
    },
    phone: {
      code: 'Please select a country code',
      number: 'Please enter a phone number'
    },
    position: 'Please enter the position or job title for the representative',
    step: {
      false: 'Step did not pass validation',
      true: 'Step successfully validated'
    }
  },
  ConnectFooter: {
    navLabel: 'Useful Links', // <nav> aria-label
    home: 'Home',
    releaseNotes: 'Release Notes',
    disclaimer: 'Disclaimer',
    privacy: 'Privacy',
    ally: 'Accessibility',
    copyright: 'Copyright',
    bcApp: 'A BC Online Application'
  },
  ConnectHeader: {
    title: 'Service BC Connect',
    logoBtnLabel: 'Home', // <img> link aria-label
    navLabel: 'Main Navigation', // <nav> aria-label
    homeLink: 'Home'
  },
  ConnectBCGovLogo: {
    alt: 'Government of British Columbia Logo' // <img> alt
  },
  ConnectLocaleSelect: {
    // aria-label
    label: 'Select a Language, current language: English'
  },
  ConnectBreadcrumb: {
    default: 'Service BC Connect',
    backBtn: 'Go Back',
    arialabel: 'Breadcrumb'
  },
  test: {
    i18nBold: {
      strong: 'This should have {boldStart} bold {boldEnd} text',
      strongWithProps: 'This should have {boldStart} bold {boldEnd} text and allow a {prop}',
      italic: 'Italic test {italicStart} goes here {italicEnd}.'
    }
  }
}
