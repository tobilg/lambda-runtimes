import { downloadAsHTML } from "./utils/downloader";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

export interface RuntimeInfo {
  name: string;
  identifier: string;
  sdkVersion: string | null;
  operatingSystem: string | null;
  deprecationDate: string | null;
  blockFunctionCreateDate: string | null;
  blockFunctionUpdateDate: string | null;
}

const formatDate = (dateString: string): string | null => {
  if (["Not scheduled", "N/A"].includes(dateString)) {
    return null;
  } else {
    const d = new Date(dateString);
    return new Date(d.getTime() - (d.getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
  }
}

const run = async () => {
  const html = await downloadAsHTML("https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html");

  const runtimes =  html!.querySelectorAll("#main-col-body > div[class*='table-container'] > div > table:first-child > tr");

  // @ts-ignore
  const data: RuntimeInfo[] = Array.from(runtimes).map(tr => {
    const tds = Array.from(tr.getElementsByTagName("td"));
    if (tds.length === 7) {
      return {
        name: tds[0].textContent?.trim() || "",
        identifier: tds[1].textContent?.trim() || "",
        sdkVersion: tds[2].textContent?.trim() || "",
        operatingSystem: tds[3].textContent?.trim() || "",
        deprecationDate: tds[4].textContent?.trim() ? new Date(tds[4].textContent!.trim()).toISOString().substring(0, 10) : null,
        blockFunctionCreateDate: tds[5].textContent?.trim() ? formatDate(tds[5].textContent!.trim()) : null,
        blockFunctionUpdateDate: tds[6].textContent?.trim() ? formatDate(tds[6].textContent!.trim()) : null,
      } as RuntimeInfo
    } else if (tds.length === 6) {
      return {
        name: tds[0].textContent?.trim() || "",
        identifier: tds[1].textContent?.trim() || "",
        sdkVersion: null,
        operatingSystem: tds[2].textContent?.trim() || "",
        deprecationDate: tds[3].textContent?.trim() ? formatDate(tds[3].textContent!.trim()) : null,
        blockFunctionCreateDate: tds[4].textContent?.trim() ? formatDate(tds[4].textContent!.trim()) : null,
        blockFunctionUpdateDate: tds[5].textContent?.trim() ? formatDate(tds[5].textContent!.trim()) : null,
      } as RuntimeInfo
    } else {
      return null;
    }
  }).filter((runtimeInfo) => runtimeInfo);

  writeFileSync(join(__dirname, "../", "data", "lambdaRuntimes.json"), JSON.stringify(data.sort((a, b) => a.identifier > b.identifier ? 0 : -1), null, 2));
}

run();
