# Owl

Bun-managed Turborepo containing a Capacitor Android application and a shared React UI package.

## Prerequisites

- Bun 1.4+ and Node.js 22+
- Java 21, Android SDK (API 35), and ADB for Android preview. Set `ANDROID_HOME` or `ANDROID_SDK_ROOT` to your SDK directory.
- Connect/pair your phone using remote ADB before preview. Exactly one device must appear as `device` in `adb devices`.

## Commands

- `bun run dev --filter=mobile`: builds prerequisite libraries, starts their watchers, and serves the mobile app at `http://127.0.0.1:3000`. Development assets are written to `apps/mobile/dist` and updated on edits; compilation does not stay only in memory.
- `bun run build --filter=mobile`: builds the selected app and its prerequisite libraries. Use `--filter=@repo/ui` or `--filter=@repo/utils` to select a package. These commands use Turbo's native filtering; omitting the filter runs all matching workspace tasks.
- `bun run preview --filter=mobile`: checks the running dev server, forwards phone port 3000 using `adb reverse`, syncs/builds the debug APK, then installs and launches it. It does not rebuild the web app or start another server.
- `bun run lint`: applies safe Biome lint fixes; warnings do not fail the command.
- `bun run format`: formats files in place using Biome.
- `bun test scripts` and `bun run --cwd packages/utils vitest run`: script and utility tests.

## Live Android development

Run these in separate terminals, after connecting your phone with ADB:

```sh
bun run dev --filter=mobile
# Wait for the first compilation, then in another terminal:
bun run preview --filter=mobile
```

Preview points the Android WebView at `http://localhost:3000`; ADB forwards both HTTP and HMR WebSocket traffic to your computer. Keep dev running. Later web edits hot-reload without reinstalling the APK; native/plugin changes require another preview run. Some edits cause a full page reload rather than preserving React state.

Preview fails on missing/multiple/unready devices, missing disk assets, an unavailable server, port-forwarding errors, or deployment errors. It does not automate ADB pairing or connection. The dev server uses a strict localhost port and will not silently move to another port.

Capacitor uses `apps/mobile/capacitor.config.json` so its CLI works without TypeScript's old compiler API. Preview temporarily patches the generated native configuration and restores it afterward; only debug builds allow cleartext HTTP. There is no `CAPACITOR_SERVER_URL` override. Avoid running a production build for the same app while dev is running, since both write to its `dist` directory.
