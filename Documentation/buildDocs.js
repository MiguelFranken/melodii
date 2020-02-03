const path = require('path');
const fs = require('fs');
const readline = require('readline');
const EventEmitter = require('events');
const controller_path = "../Frontend/src/app/generator/library/controllers";
const path_arr = [controller_path];
const input_path = path.join(__dirname, controller_path);
const output_path = __dirname + '/API.md';

const COMMENT_START = '/**';
const COMMENT_END = '*/';
const NEW_LINE = '\n';
const NEW_LINE2 = NEW_LINE + NEW_LINE;
const TITLE1_CHAR = '# ';
const TITLE2_CHAR = '## ';
const TILTE3_CHAR = '### ';
const CODE_CHAR = '```';

const TITLE = "# API" + NEW_LINE2;
const DESC = "This file lists all possible osc-messages which the server can handle." + NEW_LINE2;
const PATH_START = "Path:" + NEW_LINE + CODE_CHAR + NEW_LINE;
const PATH_END = NEW_LINE + CODE_CHAR + NEW_LINE;
const ARGUMENTS_START = "Arguments:" + NEW_LINE + CODE_CHAR + NEW_LINE;
const ARGUMENTS_END = NEW_LINE + CODE_CHAR + NEW_LINE2;

const HEADER = TITLE + DESC;

const TABLE_START = '<table style="width:100%;text-align:left;">' + NEW_LINE;
const TABLE_END = '</table>' + NEW_LINE2 + NEW_LINE;
const TABLE_ROW_START = '<tr style="vertical-align:top;">' + NEW_LINE;
const TABLE_ROW_END = "</tr>" + NEW_LINE;
const TABLE_COL_START = "<td>";
const TABLE_COL1_START = '<td style="width:15%">';
const TABLE_COL2_START = '<td style="width:30%">';
const TABLE_COL_END = "</td>" + NEW_LINE;
const DETAILS_START = "<details><p>" + NEW_LINE2;
const DETAILS_END = "</p></details>";

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

    function groupExists(str, arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == str) {
                return true;
            }
        }
        return false;
    }

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
                        obj.apiName = rest;
                        break;
                    case 'apiGroup':
                        obj.apiGroup = rest;
                        if (!groupExists(obj.apiGroup, groups)) {
                            groups.push(obj.apiGroup);
                        }
                        break;
                    case 'apiPath':
                        obj.apiPath = rest;
                        break;
                    case 'apiDesc':
                        rest = checkIfUrl(rest);
                        obj.apiDesc = rest;
                        break;
                    case 'apiArgs':
                        rest = splitString(rest, 2);
                        obj.apiArgs.push({ value: rest[0], desc: rest[1] });
                        break;
                    default:

                }
            }
        }
    }
}

function checkIfUrl(str) {
    let result = str;    
    let findAt = str.indexOf('@');
    if (findAt !== -1) {
        let key = str.substring(findAt+1, findAt+4);
        console.log(str);
        if (key === "url") {
            let link = str.substring(findAt+5, str.length);
            let index = str.indexOf(')');
            let lindex = link.indexOf(')');
            link = link.substring(0, lindex);
            let cindex = link.indexOf(',');
            let name = link.substring(0,cindex);
            let url = link.substring(cindex+1, link.length);
            result = str.substring(0,findAt);
            console.log(result);
            result += ' <a href="' + url + '">' + name + '</a> ';
            result += str.substring(index+1, str.length);
        }        
    }
    return result;
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
    function addDetails(element) {
        let details = "";
        details += DETAILS_START;
        details += PATH_START + element.apiPath + PATH_END;
        details += ARGUMENTS_START + "[" + NEW_LINE;
        element.apiArgs.forEach(e => {
            details += "    " + "{ " + e.value + " }," + "  // " + e.desc + "\n";
        });
        details += "]" + ARGUMENTS_END;
        details += DETAILS_END;
        return details;
    }


    console.log(groups);

    var wStream = fs.createWriteStream(output_path);
    wStream.write(HEADER);


    for (let i = 0; i < groups.length; i++) {
        let str = "";
        str += TITLE2_CHAR + groups[i] + NEW_LINE2;
        str += TABLE_START;
        str += TABLE_ROW_START;
        str += TABLE_COL1_START + "Title" + TABLE_COL_END;
        str += TABLE_COL2_START + "Description" + TABLE_COL_END;
        str += TABLE_COL_START + TABLE_COL_END;
        str += TABLE_ROW_END;

        for (let j = 0; j < objarr.length; j++) {
            if (objarr[j].apiGroup == groups[i]) {
                str += TABLE_ROW_START;
                str += TABLE_COL_START + objarr[j].apiName + TABLE_COL_END;
                str += TABLE_COL_START + objarr[j].apiDesc + TABLE_COL_END;
                str += TABLE_COL_START;
                str += addDetails(objarr[j]);
                str += TABLE_COL_END;
                str += TABLE_ROW_END;
            }
        }

        str += TABLE_END;
        wStream.write(str);
    }

    wStream.end();

}

main();


