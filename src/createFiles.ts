import { mkdirp } from "mkdirp";
import { writeFileSync } from "node:fs";
import { isBefore } from "date-fns";
import lambdaRuntimes from "../data/lambdaRuntimes.json";
import { RuntimeInfo } from "../src/gatherFromHTML";

const rootFolder = "files";

mkdirp.sync(rootFolder);

const lrs = lambdaRuntimes as unknown as RuntimeInfo[];

lrs.forEach(lr => {
  mkdirp.sync(`${rootFolder}/is/${lr.identifier}`);
  mkdirp.sync(`${rootFolder}/will/${lr.identifier}/be`);

  const depracationPhase1Date = lr.depracationPhase1Date ? new Date(lr.depracationPhase1Date) : null;
  const depracationPhase2Date = lr.depracationPhase2Date ? new Date(lr.depracationPhase2Date) : null;
  const currentDate = new Date();

  const isPath = `${rootFolder}/is/${lr.identifier}/deprecated`;
  const willPath = `${rootFolder}/will/${lr.identifier}/be/deprecated`;
  
  if (!depracationPhase1Date && !depracationPhase2Date) {
    writeFileSync(isPath, "false", { encoding: "utf-8" });
    writeFileSync(willPath, "false", { encoding: "utf-8" });
  } else if (!depracationPhase1Date && depracationPhase2Date) {
    writeFileSync(isPath, "true", { encoding: "utf-8" });
    writeFileSync(willPath, "false", { encoding: "utf-8" });
  } else if (depracationPhase1Date && isBefore(currentDate, depracationPhase1Date)) {
    console.log(`Runtime '${lr.identifier}' will be deprecated at '${depracationPhase1Date}'`);
    writeFileSync(isPath, "false", { encoding: "utf-8" });
    writeFileSync(willPath, "true", { encoding: "utf-8" });
  } else if (depracationPhase1Date && !isBefore(currentDate, depracationPhase1Date)) {
    writeFileSync(isPath, "true", { encoding: "utf-8" });
    writeFileSync(willPath, "false", { encoding: "utf-8" });
  } else if (depracationPhase2Date && isBefore(currentDate, depracationPhase2Date)) {
    writeFileSync(isPath, "true", { encoding: "utf-8" });
    writeFileSync(willPath, "false", { encoding: "utf-8" });
  }
})

