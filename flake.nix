{
  description = "Bun + Playwright dev shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            bun
            jdk21
            aapt
          ];

          shellHook = ''
            export ANDROID_HOME="$HOME/.local/android/sdk"
            export PATH="$HOME/.local/android/sdk/emulator:$PATH"
            export PATH="$HOME/.local/android/sdk/platform-tools:$PATH"

            export PATH="node_modules/.bin:$PATH"
          '';
        };
      }
    );
}
