/**
 * Help 脚本
 * 显示所有可用命令的帮助信息
 */

const commands: Array<{ name: string; desc: string }> = [
  { name: "lint", desc: "Lint protobuf files using buf" },
  { name: "format", desc: "Format protobuf files using buf" },
  { name: "gen", desc: "Generate code from protobuf using buf" },
  { name: "clean", desc: "Remove generated files" },
  { name: "prepare", desc: "Update buf dependencies" },
  { name: "update", desc: "Update buf dependencies" },
  { name: "help", desc: "Show this help message" },
];

console.log("");
console.log("Usage: pnpm <command>");
console.log("");
console.log("Commands:");

for (const cmd of commands) {
  console.log(`  ${cmd.name.padEnd(12)} ${cmd.desc}`);
}

console.log("");