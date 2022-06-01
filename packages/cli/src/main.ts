import yargs from "yargs";

function parseArgs(): yargs.Argv {
  return yargs.command("hello", "say hello").demandCommand().help();
}

console.log(parseArgs().argv);
