import fs from "node:fs";
import path from "node:path";

export default function autoClsxPlugin({ types: t }) {
  return {
    name: "auto-clsx",
    visitor: {
      Program(programPath, state) {
        const filename = state.filename;
        if (!filename?.endsWith(".tsx")) return;
        let needsClsx = false;
        let hasCxBinding = false;

        programPath.traverse({
          Identifier(idPath) {
            if (idPath.node.name !== "cx") return;
            if (
              !idPath.isReferencedIdentifier() &&
              !idPath.isBindingIdentifier()
            )
              return;

            const binding = idPath.scope.getBinding("cx");
            if (binding) {
              hasCxBinding ||= !isAutomaticSmartClsxBinding(binding);
              return;
            }

            needsClsx = true;
          },
        });

        if (hasCxBinding) {
          throw programPath.buildCodeFrameError(
            "`cx` is reserved for the automatic smart-clsx binding",
          );
        }

        if (needsClsx) {
          const stylePath = path.join(
            path.dirname(filename),
            "style.module.css",
          );
          if (!fs.existsSync(stylePath)) {
            throw programPath.buildCodeFrameError(
              "`cx` requires a colocated ./style.module.css file",
            );
          }

          const styleIdentifier =
            programPath.scope.generateUidIdentifier("auto_style");
          const createSmartClsxIdentifier =
            programPath.scope.generateUidIdentifier("createSmartClsx");
          const styleImport = t.importDeclaration(
            [t.importDefaultSpecifier(styleIdentifier)],
            t.stringLiteral("./style.module.css"),
          );

          const smartClsxImport = t.importDeclaration(
            [
              t.importSpecifier(
                createSmartClsxIdentifier,
                t.identifier("createSmartClsx"),
              ),
            ],
            t.stringLiteral("@repo/utils"),
          );

          const clsxDecl = t.variableDeclaration("const", [
            t.variableDeclarator(
              t.identifier("cx"),
              t.callExpression(createSmartClsxIdentifier, [styleIdentifier]),
            ),
          ]);

          programPath.unshiftContainer("body", clsxDecl);
          programPath.unshiftContainer("body", smartClsxImport);
          programPath.unshiftContainer("body", styleImport);
        }
      },
    },
  };
}

function isAutomaticSmartClsxBinding(binding) {
  if (!binding.path.isVariableDeclarator()) return false;

  const initializer = binding.path.get("init");
  if (!initializer.isCallExpression()) return false;

  const callee = initializer.get("callee");
  if (!callee.isIdentifier()) return false;

  const importBinding = callee.scope.getBinding(callee.node.name);
  if (!importBinding?.path.isImportSpecifier()) return false;

  const importDeclaration = importBinding.path.parentPath;
  return (
    importDeclaration.isImportDeclaration() &&
    importDeclaration.node.source.value === "@repo/utils" &&
    importBinding.path.node.imported.name === "createSmartClsx"
  );
}
