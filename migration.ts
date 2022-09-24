import { exec } from "child_process";
const command = process.argv[2];

const getName = () => {
  const name = process.argv[3];

  if (!name) {
    throw new Error("Name is required");
  }

  return name;
};

const script = `yarn typeorm -d data-source.ts`;

try {
  switch (command) {
    case "generate":
      exec(`${script} migration:generate src/migrations/${getName()}`);
      break;
    case "run":
      exec(`${script} migration:run`);
      break;
    case "create":
      exec(`${script} migration:create src/migrations/${getName()}`);
      break;
    case "revert":
      exec(`${script} migration:revert`);
      break;
    default:
      throw new Error(
        "Invalid migration command. Ex: generate, run, create, revert"
      );
  }
} catch (error) {
  console.error(error);
}
