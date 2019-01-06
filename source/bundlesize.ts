import * as fs from "fs";
import { exec } from "child_process";

const result = (command: string, cb: Function) => {
  exec(command, (err, stdout, stderr) => {
    if (err !== null) {
      return cb(err, null);
    } else if (typeof stderr != "string") {
      return cb(new Error(stderr), null);
    }

    return cb(null, stdout);
  });
};

const getSHA = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    result("git rev-parse HEAD", (err: Error, response: string) => {
      if (!err) {
        resolve(response.trim());
      } else {
        reject(err);
      }
    });
  });
};

const size = fs.statSync("dist/index.js").size;

interface item {
  sha: string;
  size: number;
  date: string;
}

(async () => {
  const file = "output/stats.json";
  const sha = await getSHA();
  const date = new Date().toISOString();

  console.log(`date: ${date}`);
  console.log(`SHA: ${sha}`);
  console.log(`size: ${size}`);

  fs.readFile(file, "utf8", (err: Error, data: string) => {
    if (err) {
      throw err;
    };
    const output: item[] = data ? JSON.parse(data) : [];
    const entry = output.find(e => e.sha === sha) || { sha, size, date };
    const outputWithoutSHA = output.filter(e => e.sha !== sha);
    outputWithoutSHA.push({ ...entry, size, date });
    fs.writeFileSync(file, JSON.stringify(outputWithoutSHA, null, 2));
  });
})();
