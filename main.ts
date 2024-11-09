import "reflect-metadata";
import {
  BaseCommand,
  args,
  Kernel,
  ListLoader,
  HelpCommand,
} from "@adonisjs/ace";

class Demo extends BaseCommand {
  public static commandName = "demo";

  @args.string({ description: "first arg" })
  declare first_arg: string;

  @args.string({ description: "second arg" })
  declare second_arg: string;

  public async run() {
    this.logger.info(`Hello from demo command`);
  }
}

const kernel = Kernel.create();
kernel.addLoader(new ListLoader([Demo]));

kernel.defineFlag("help", {
  type: "boolean",
  description: HelpCommand.description,
});
kernel.on("help", async (command, $kernel, parsed) => {
  parsed.args.unshift(command.commandName);
  const help = new HelpCommand($kernel, parsed, kernel.ui, kernel.prompt);
  await help.exec();
  return $kernel.shortcircuit();
});

await kernel.handle(process.argv.splice(2));
