const fs = require("./fs.js");
const Mustache = require("mustache");
const translate = require("./../info/translate.js");

// 路徑怪
const statFile = "./scripts/stats.json";
// 路徑怪
const template = {
    prefix: "./scripts/templates",
    file: {
        table: `table`,
    },
};
const tableTemplate = `${template.prefix}/${template.file.table}.mustache`;

async function getStats() {
    const stats = await fs.readFile(statFile);
    return JSON.parse(stats);
}

function getTranslateObj(randomItem, lang = "zh") {
    return Object.keys(randomItem).reduce((acc, key) => {
        return {
            ...acc,
            [key]: translate[lang][key] || key,
        };
    }, {});
}

/**
 *  依照 singleItem 的 key 與 翻譯文字來生成 table head (還有第二行)
 *  @param {Object} singleItem (Stats 陣列中的隨意一個物件)
 *  @returns {String} Table head
 *  eg:
 *      name | score
 *      ---  | ---
 */
async function generateTableHeadByStats(singleItem, lang = "zh") {
    const translatedObj = getTranslateObj(singleItem, lang);
    const template = await fs.readFile(tableTemplate);
    const tableHead = Mustache.render(template, translatedObj);
    return tableHead + "\n" + generateTableSeparateLine(translatedObj);
}

function generateTableSeparateLine(targetObj) {
    return Array.from(Object.keys(targetObj)).fill("---").join("|");
}

async function generateTableBody(stats = []) {
    const template = await fs.readFile(tableTemplate);
    return stats
        .map(stat => {
            return Mustache.render(template, stat);
        })
        .join("\n");
}

exports.default = async function () {
    const { stats } = await getStats();
    const tableBody = await generateTableBody(stats);
    const tableHead = await generateTableHeadByStats(stats[0]);
    // * 換行符號
    return tableHead + "\n" + tableBody;
};
