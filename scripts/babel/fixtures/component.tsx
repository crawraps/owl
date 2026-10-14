export function Fixture() {
  return <div className={cx("root", "global")} />;
}

export function getClassName(): string {
  return cx("root", "global");
}
