import { downloadAsHTML } from "./utils/downloader";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

interface RuntimeInfo {
  name: string;
  identifier: string;
  sdkVersion: string | null;
  operatingSystem: string | null;
  architectures: string[];
  depracationPhase1Date: string | null;
  depracationPhase2Date: string | null;
}

const run = async () => {
  const html = await downloadAsHTML("https://raw.githubusercontent.com/awsdocs/aws-lambda-developer-guide/main/doc_source/lambda-runtimes.md");

  const supportedRuntimes = html!.querySelectorAll("table:first-of-type > tbody > tr");

  const supportedRuntimesData: RuntimeInfo[] = Array.from(supportedRuntimes).map(tr => ({
    name: tr.childNodes[1].textContent?.trim() || "",
    identifier: tr.childNodes[3].textContent?.trim() || "",
    sdkVersion: tr.childNodes[5].textContent?.trim() || "",
    operatingSystem: tr.childNodes[7].textContent?.trim() || "",
    architectures: tr.childNodes[9].textContent?.trim() ? tr.childNodes[9].textContent?.trim().split(", ") : [],
    depracationPhase1Date: tr.childNodes[11].textContent?.trim() ? new Date(tr.childNodes[11].textContent?.trim()).toISOString().substring(0, 10) : null,
    depracationPhase2Date: null,
  }));

  const deprecatedRuntimes = html!.querySelectorAll("table:last-of-type > tbody > tr");

  const deprecatedRuntimesData: RuntimeInfo[] = Array.from(deprecatedRuntimes).map(tr => ({
    name: tr.childNodes[1].textContent?.trim() || "",
    identifier: tr.childNodes[3].textContent?.trim() || "",
    sdkVersion: null,
    operatingSystem: tr.childNodes[5].textContent?.trim() || "",
    architectures: [],
    depracationPhase1Date: tr.childNodes[7].textContent?.trim() ? new Date(tr.childNodes[7].textContent?.trim()).toISOString().substring(0, 10) : null,
    depracationPhase2Date: tr.childNodes[9].textContent?.trim() ? new Date(tr.childNodes[9].textContent?.trim()).toISOString().substring(0, 10) : null,
  }));

  const data = supportedRuntimesData.concat(deprecatedRuntimesData);
  
  writeFileSync(join(__dirname, "../", "data", "lambdaRuntimes.json"), JSON.stringify(data, null, 2));
}

run();
