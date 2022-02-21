const inquirer = require("inquirer");
const figlet = require("figlet");
const clear = require("clear");
const ora = require("ora");
const { promisify } = require("util");
const download = promisify(require("git-pull-or-clone"));
const { resolve } = require("path");
const fs = require("fs");
const { spawn, log } = require("./utils");
const chalk = require("chalk");

//仓库地址
const repo = "git@github.com:yuanguandong/react-keyevent.git";

//清屏
clear();
//打印logo
log(
  figlet.textSync("WIDGET", {
    horizontalLayout: "fitted",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  }),
  "green"
);

//主流程
const main = async () => {
  // 项⽬名称
  const answer = await inquirer.prompt([
    {
      type: "input",
      message: "DirName:",
      name: "name",
      default: "widgets", // 默认值
    },
  ]);
  const dir = resolve(`./${answer.name}`);
  const process = ora(chalk["gray"](`${dir} loading.....`));
  process.start();
  try {
    await download(repo, dir);
    process.succeed();
    log(`✅ Download Success`);
  } catch (e) {
    log(e, "red");
    process.fail();
  }
  tool(answer.name, dir);
};

//工具方法
const actions = {
  install: async ({ dir, name }) => {
    log("installing....", "gray");
    await spawn("pnpm", ["install"], { cwd: `${name}/` });
    log("✅ Installed");
  },
  run: async ({ dir, name }) => {
    const isFile = fs.existsSync(`${dir}/node_modules`);
    if (isFile) {
      const res = await spawn("pnpm", ["run", "test"], { cwd: `${name}/` });
      return;
    } else {
      log("Not Installed", "red");
    }
  },
  exit: async ({ dir, name }) => {
    const isFile = fs.existsSync(`${dir}/node_modules`);
    if (isFile) {
      log("🖐  Bye Bye!", "yellow");
    }
    return;
  },
};

//工具箱
async function tool(name, dir) {
  const answer = await inquirer.prompt([
    {
      type: "rawlist",
      message: "Action",
      name: "operation",
      choices: Object.keys(actions),
    },
  ]);
  const res = await actions[answer.operation]({ dir, name });
  if (!res) {
    return;
  }
  tool(name, dir);
}

main();

module.exports = { main, tool };
