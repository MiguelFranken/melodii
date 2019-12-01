const path = require('path');
const fs = require('fs');
const readline = require('readline');
const EventEmitter = require('events');
const src_path = "Generator/src/music/controllers";
const test_path = "testfolder";
const input_path = path.join(__dirname, test_path);
const output_path = __dirname + '/API.md';
const COMMENT_START = '/**';
const COMMENT_END = '*/';
const COMMENT_LINE = '*';

class MyEmitter extends EventEmitter { }

const myEmitter = new MyEmitter();
myEmitter.on('createMarkdown', () => {

});


/**
 * TODO
 * endungen fon files beachten
 * index.js auschließen
 */
var groups = [];
var objarr = [];

function main() {
    readDir();
}

async function readDir() {
    let files = fs.readdirSync(input_path);

    for (let i = 0; i < files.length; i++) {
        await filesHandler(files[i]);
    }
    createMarkdownFile();
}

async function filesHandler(file) {
    const fileStream = fs.createReadStream(input_path + '/' + file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    var found_comment = false;
    let obj = {};
    for await (const line of rl) {
        if (line.indexOf(COMMENT_START) != -1) {
            found_comment = true;
            obj = {};            
            obj.apiArgs = [];
        } else if (line.indexOf(COMMENT_END) != -1) {
            found_comment = false;
            objarr.push(obj);
        } else if (found_comment) {
            let findAt = line.indexOf('@');
            if (findAt != -1) {
                let str = line.substring(findAt + 1, line.length);
                let index = str.indexOf(" ");
                let apiword = str.substring(0, index);
                var rest = str.substring(index + 1, str.length);
                switch (apiword) {
                    case 'apiName':
                        let a = splitString(rest, 2);
                        obj.apiName = a[0];
                        obj.apiDesc = a[1];
                        break;
                    case 'apiGroup':
                        obj.apiGroup = rest;
                        groups.push(obj.apiGroup);
                        break;
                    case 'apiPath':
                        obj.apiPath = rest;
                        break;
                    case 'apiDesc':
                        obj.apiDesc = rest;
                        break;
                    case 'apiArgs':
                        rest = splitString(rest, 2);
                        obj.apiArgs.push({value: rest[0], desc: rest[1]});
                        break;
                    default:
                        continue;
                }
            }
        }
    }
}

function splitString(str, splits) {
    let string = str;
    let counter = 0;
    let array = [];
    let index_b = 0;
    let index_e = 0;
    for (let i = 0; i < splits - 1; i++) {
        let index_e = string.indexOf(" ");
        if (index_e == -1) break;
        let substring = string.substring(index_b, index_e);
        array.push(substring);
        string = string.substring(index_e + 1, string.length);
    }
    array.push(string);
    return array;
}

function createMarkdownFile() {
    const title = "# API\n\n";
    const desc = "This file lists all possible osc-messages which the server can handle.\n\n";

    var data = title + desc;

    groups.forEach(group => {
        let str = "## " + group + "\n";
        str += "\n";
        str += "### ";
        objarr.forEach(element => {
            if (element.apiGroup == group) {
                str += element.apiName + "\n";
                str += "<details><summary>";
                str += element.apiDesc;
                str += "</summary>\n";
                str += "<p>\n\n";
                str += "```\n" + element.apiPath + "\n```\n";
                str += "Arguments: \n";
                str += "```\n" + "[" + "\n";
                console.log(element.apiArgs);
                element.apiArgs.forEach(e => {
                    str += "    " + "{ " + e.value + " }," + "  // " + e.desc + "\n";
                });
                str += "]" + "\n```\n\n";
                str += "</p>\n"                
                str += "</details>\n\n";
                
            }
        });
        data += str;
    });

    fs.writeFileSync(output_path, data);
}

function groupExists(group) {
    groups.forEach(element => {
        if (element == group) return true;
    });
    return false;
}

main();


