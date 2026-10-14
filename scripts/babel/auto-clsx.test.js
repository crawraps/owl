import { expect, test } from "bun:test";
import { fileURLToPath } from "node:url";
import { transformSync } from "@babel/core";
import autoClsxPlugin from "./auto-clsx.js";

const filename = fileURLToPath(
  new URL("./fixtures/component.tsx", import.meta.url),
);

function transform(code, sourceFilename = filename) {
  return transformSync(code, {
    filename: sourceFilename,
    configFile: false,
    babelrc: false,
    plugins: [autoClsxPlugin],
    parserOpts: { plugins: ["typescript", "jsx"] },
  }).code;
}

test("injects the CSS module and workspace factory only once", () => {
  const output = transform('cx("root"); cx("active");');
  expect(output).toContain('from "./style.module.css"');
  expect(output).toContain('from "@repo/utils"');
  expect(output.match(/const cx =/g)).toHaveLength(1);
  expect(transform(output)).toBe(output);
});

test("does not inject imports when cx is absent or only a property name", () => {
  expect(transform('const obj = { cx: "root" }; obj.cx;')).not.toContain(
    "import",
  );
});

test("requires a colocated stylesheet when cx is used", () => {
  expect(() =>
    transform(
      'cx("root")',
      fileURLToPath(new URL("./missing/component.tsx", import.meta.url)),
    ),
  ).toThrow("`cx` requires a colocated ./style.module.css file");
});

test.each([
  'import cx from "clsx"; cx("root");',
  'const cx = () => "root";',
  'function example(cx) { return cx("root"); }',
  'cx("root"); function example(cx) { return cx("active"); }',
])("rejects manual cx bindings: %s", (code) => {
  expect(() => transform(code)).toThrow("`cx` is reserved");
});

test("leaves non-TSX files alone", () => {
  expect(
    transform('cx("root")', filename.replace(/\.tsx$/, ".ts")),
  ).not.toContain("import");
});
