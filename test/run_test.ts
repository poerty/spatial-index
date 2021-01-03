import fs from 'fs';

function describeFilesInFolder(suiteDir, suite) {
  if (fs.lstatSync(suiteDir).isDirectory()) {
    describe(suite, () => {
      for (const file of fs.readdirSync(suiteDir)) {
        const dir = `${suiteDir}/${file}`;
        if (fs.lstatSync(dir).isFile() && /\.ts/.test(dir)) {
          require(dir);
        } else if (fs.lstatSync(dir).isDirectory()) {
          describeFilesInFolder(dir, file);
        }
      }
    });
  }
}

for (const suite of fs.readdirSync(__dirname)) {
  const suiteDir = `${__dirname}/${suite}`;
  describeFilesInFolder(suiteDir, suite);
}
