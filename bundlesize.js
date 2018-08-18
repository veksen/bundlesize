const fs = require("fs");
const { exec } = require("child_process");

const result = function(command, cb) {
  const child = exec(command, (err, stdout, stderr) => {
    if (err !== null) {
      return cb(new Error(err), null);
    } else if (typeof stderr != "string") {
      return cb(new Error(stderr), null);
    }

    return cb(null, stdout);
  });
};

const getSHA = async () => {
  return new Promise((resolve, reject) => {
    result("git rev-parse HEAD", (err, response) => {
      if (!err) {
        resolve(response.trim());
      } else {
        reject(err);
      }
    });
  });
};

const size = fs.statSync("dist/index.js").size;

(async () => {
  const file = "output/stats.json";
  const sha = await getSHA();
  const date = new Date().toISOString();

  console.log(`date: ${date}`);
  console.log(`SHA: ${sha}`);
  console.log(`size: ${size}`);

  fs.readFile(file, "utf8", (err, data) => {
    const output = data ? JSON.parse(data) : [];
    const entry = output.find(e => e.sha === sha) || { sha, size, date };
    const outputWithoutSHA = output.filter(e => e.sha !== sha);
    outputWithoutSHA.push({ ...entry, size, date });
    fs.writeFileSync(file, JSON.stringify(outputWithoutSHA, null, 2));
  });
})();
