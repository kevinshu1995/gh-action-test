const fs = require("./scripts/utils/fs.js");
const generateTableByStats = require("./scripts/utils/generateTable");

const controlFile = "./README.md";

// console.log(process.argv.slice(2));
main();

async function main() {
    const table = await generateTableByStats.default();
    const readme = await fs.readFile(controlFile);
    const replacedContent = replaceContentInTags(readme, table);
    await fs.writeFile(controlFile, replacedContent);
    console.log(replacedContent);
}

/**
 * 需注意只替換第一組
 * @param {String} originContent
 * @param {String} replaceContent
 * @returns
 */
function replaceContentInTags(originContent = "", replaceContent = "") {
    const keyStart = "table:start";
    const keyEnd = "table:end";
    const tagStart = "<!--";
    const tagEnd = "-->";

    const pattern = `(${tagStart}\\s*${keyStart}\\s*${tagEnd})[\\s|\\S]*(${tagStart}\\s*${keyEnd}\\s*${tagEnd})`;
    const regex = new RegExp(pattern);
    return originContent.replace(regex, `$1${"\n" + replaceContent + "\n"}$2`);
}
