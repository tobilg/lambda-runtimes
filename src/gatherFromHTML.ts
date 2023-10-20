import { downloadAsHTML } from "./utils/downloader";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

export interface RuntimeInfo {
  name: string;
  identifier: string;
  sdkVersion: string | null;
  operatingSystem: string | null;
  architectures: string[];
  depracationPhase1Date: string | null;
  depracationPhase2Date: string | null;
}

const run = async () => {
  const html = await downloadAsHTML("https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html");

  const runtimes =  html!.querySelectorAll("#main-col-body > div[class*='table-container'] > div > table:first-child > tr");

  const data: RuntimeInfo[] = Array.from(runtimes).map(tr => {
    const tds = Array.from(tr.getElementsByTagName("td"));
    if (tds.length === 6) {
      return {
        name: tds[0].textContent?.trim() || "",
        identifier: tds[1].textContent?.trim() || "",
        sdkVersion: tds[2].textContent?.trim() || "",
        operatingSystem: tds[3].textContent?.trim() || "",
        architectures: tds[4].textContent?.trim() ? tds[4].textContent?.trim().split(", ") : [],
        depracationPhase1Date: tds[5].textContent?.trim() ? new Date(tds[5].textContent?.trim()).toISOString().substring(0, 10) : null,
        depracationPhase2Date: null,
      } as RuntimeInfo
    } else {
      return {
        name: tds[0].textContent?.trim() || "",
        identifier: tds[1].textContent?.trim() || "",
        sdkVersion: null,
        operatingSystem: tds[2].textContent?.trim() || "",
        architectures: [],
        depracationPhase1Date: tds[3].textContent?.trim() ? new Date(tds[3].textContent?.trim()).toISOString().substring(0, 10) : null,
        depracationPhase2Date: tds[4].textContent?.trim() ? new Date(tds[4].textContent?.trim()).toISOString().substring(0, 10) : null,
      } as RuntimeInfo
    }
  })

  writeFileSync(join(__dirname, "../", "data", "lambdaRuntimes.json"), JSON.stringify(data, null, 2));
}

run();
