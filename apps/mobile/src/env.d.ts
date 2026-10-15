/// <reference types="@rsbuild/core/types" />

declare const cx: ReturnType<typeof import('@repo/utils').createSmartClsx>

interface RsbuildTypeOptions {
  strictImportMetaEnv: true
}

type AppEnvVariables = Readonly<import('@repo/env').EnvOutput<typeof import('../env').envSchema>>

interface ImportMetaEnv extends AppEnvVariables {
  readonly APP_ENV: import('@repo/env').AppEnv
}
