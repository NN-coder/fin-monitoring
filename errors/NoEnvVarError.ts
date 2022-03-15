import chalk from "chalk";

export class NoEnvVarError extends Error {
  constructor(varName: string) {
    super(chalk.redBright(`No ${varName} in environment`));
  }
}
