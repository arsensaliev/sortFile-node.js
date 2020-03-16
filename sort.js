const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const del = require("del");
const util = require("util");
const exists = util.promisify(fs.exists);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const argv = yargs
    .usage("Usage: $0 [option]")
    .help("help")
    .alias("help", "h")
    .version("0.0.1")
    .alias("version", "v")
    .example("$0 --entry ./filesSort --output ./dist -D y/n => Sortings folder")
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
        default: "n"
    })
    .epilog("homework 1").argv;

const source = path.normalize(path.join(__dirname, argv.entry));
const dist = path.normalize(path.join(__dirname, argv.output));
const deleteSource = argv.delete;

(async () => {
    const files = [];
    if (!(await exists(dist))) {
        fs.mkdir(dist, err => {
            if (err) {
                return;
            }
        });
    }
    async function recursiveReading(url) {
        const file = await readdir(url);
        file.forEach(async item => {
            const localUrl = path.join(url, item);
            const state = await stat(localUrl);

            if (state.isDirectory()) {
                recursiveReading(localUrl);
            } else {
                files.push({
                    fileName: path.basename(localUrl),
                    url: localUrl,
                    directory: path.basename(localUrl)[0].toUpperCase()
                });
            }
        });
        sortArray(files);
    }

    function sortArray(arr) {
        arr.sort((a, b) => {
            if (a.directory < b.directory) return -1;
            if (a.directory > b.directory) return 1;
            return 0;
        });
        createFolder(arr);
    }

    function createFolder(arr) {
        arr.forEach(async item => {
            const fileName = item.fileName;
            const fileUrl = item.url;
            const directory = path.join(dist, item.directory);
            if (!(await exists(directory))) {
                fs.mkdir(directory, err => {
                    if (err) {
                        return;
                    }
                });
            }
            sortFile(fileName, fileUrl, directory);
        });
    }

    function sortFile(fileName, fileUrl, directory) {
        const newPath = path.join(directory, fileName);
        fs.link(fileUrl, newPath, err => {
            if (err) {
                console.log(err.message);
                return;
            }
        });
    }

    recursiveReading(source);

    if (deleteSource === "y") {
        const deletedPath = await del([`${source}`]);
        console.log(deletedPath);
    }
})();
