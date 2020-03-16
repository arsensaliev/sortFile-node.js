const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const del = require("del");
const util = require("util");
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

fs.exists(dist, data => {
    if (!data) {
        fs.mkdir(dist, err => {
            if (err) {
                console.log(err.message);
                return;
            }
        });
    }
});

function fileSort(url) {
    const file = fs.readdir(url, (err, files) => {
        if (err) {
            console.log(err.message);
            return;
        }
        files.forEach(item => {
            const currentUrl = path.join(url, item);
            fs.stat(currentUrl, (err, state) => {
                if (err) {
                    console.log(err.message);
                    return;
                }

                if (state.isDirectory()) {
                    fileSort(currentUrl);
                } else {
                    const fileName = path.basename(currentUrl);
                    const directory = path.join(
                        dist,
                        fileName[0].toUpperCase()
                    );
                    fs.exists(directory, data => {
                        if (!data) {
                            fs.mkdir(directory, err => {
                                if (err) {
                                    console.log(err.message);
                                    return;
                                }
                                const newPath = path.join(directory, fileName);
                                fs.link(currentUrl, newPath, err => {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                });
                            });
                        }
                    });
                }
            });
        });
    });
}

fileSort(source);

if (deleteSource === "y") {
    const deletedPath = del([`${source}`]);
    deletedPath
        .then(data => console.log(data))
        .catch(error => console.log(error));
}
