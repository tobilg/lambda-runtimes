import { mkdirp } from "mkdirp";
import { writeFileSync } from "node:fs";
import { isBefore } from "date-fns";
import lambdaRuntimes from "../data/lambdaRuntimes.json";
import { RuntimeInfo } from "../src/gatherFromHTML";

const rootFolder = "files";
const runtimesPath = `${rootFolder}/runtimes.json`;

mkdirp.sync(rootFolder);

const lrs = lambdaRuntimes as unknown as RuntimeInfo[];

type Result = Boolean | null | string;

const createResult = (result: Result): string => {
  return JSON.stringify({
    "result": result,
  })
}

// Write runtimes route
writeFileSync(runtimesPath, JSON.stringify(lrs, null, 2), { encoding: "utf-8" });

lrs.forEach(lr => {
  mkdirp.sync(`${rootFolder}/is/${lr.identifier}`);
  mkdirp.sync(`${rootFolder}/will/${lr.identifier}/be`);
  mkdirp.sync(`${rootFolder}/when/will/${lr.identifier}/be`);

  const depracationDate = lr.depracationDate ? new Date(lr.depracationDate) : null;
  // const blockFunctionCreateDate = lr.blockFunctionCreateDate ? new Date(lr.blockFunctionCreateDate) : null;
  // const blockFunctionUpdateDate = lr.blockFunctionUpdateDate ? new Date(lr.blockFunctionUpdateDate) : null;
  const currentDate = new Date();

  const isPath = `${rootFolder}/is/${lr.identifier}/deprecated.json`;
  const willPath = `${rootFolder}/will/${lr.identifier}/be/deprecated.json`;
  const whenPath = `${rootFolder}/when/will/${lr.identifier}/be/deprecated.json`;

  writeFileSync(isPath, createResult(!(depracationDate && isBefore(currentDate, depracationDate))), { encoding: "utf-8" });
  writeFileSync(willPath, createResult(!!depracationDate), { encoding: "utf-8" });
  writeFileSync(whenPath, createResult(depracationDate ? depracationDate?.toISOString() : null), { encoding: "utf-8" });
})

