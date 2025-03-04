export interface UserSettings {
  id: number
  type: UserSettingsType
  urlpath: string
  urlorigin: string
  accountType?: AccountType
  accountStatus?: AccountStatus
  additionalLabel?: string
  label?: string
}
