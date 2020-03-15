const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const del = require("del");
const util = require("util");

const paths = { source: null, dist: null };

const argv = yargs
    .usage("Usage: $0 [option]")
    .help("help")
    .alias("help", "h")
    .version("0.0.1")
    .alias("version", "v")
    .example("$0 --entry ./filesSort --output ./dist -D => Sortings folder")
    .option("entry", {
        alias: "e",
        describe: "Путь к читаемой директории",
        demandOption: true
    })
    .option("output", {
        alias: "o",
        describe: "Путь куда выложить",
        default: "./output/"
    })
    .option("delete", {
        alias: "D",
        describe: "Удалять ли ?",
        default: false
    })
    .epilog("homework 1").argv;

paths.source = path.normalize(path.join(__dirname, argv.entry));
paths.dist = path.normalize(path.join(__dirname, argv.output));

if (!fs.existsSync(paths.dist)) {
    fs.mkdirSync(paths.dist);
}
const readDir = (base, level) => {
    const arr = [];
    const files = fs.readdirSync(base);
    files.forEach(item => {
        let localBase = path.join(base, item);
        let state = fs.statSync(localBase);
        if (state.isDirectory()) {
            readDir(localBase);
        } else {
            const fileName = path.basename(localBase).toLowerCase();
            arr.push(fileName[0]);
            arr.forEach(element => {
                const place = path.join(paths.dist, element);
                if (!fs.existsSync(place, exists => exists)) {
                    fs.mkdirSync(place);
                    fs.linkSync(localBase, path.join(place, fileName));
                }
            });
        }
    });
};

readDir(paths.source, 0);
