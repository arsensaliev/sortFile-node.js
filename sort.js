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
    const files = fs.readdirSync(base);
    files.forEach(item => {
        let localBase = path.join(base, item);
        let state = fs.statSync(localBase);
        if (state.isDirectory()) {
            readDir(localBase, level + 1);
        } else {
            const fileName = path.basename(localBase);

            fs.link(localBase, path.join(paths.dist, fileName), err => {
                if (err) {
                    console.log(err.message);
                    return;
                }
            });
        }
    });
};

readDir(paths.source, 0);
