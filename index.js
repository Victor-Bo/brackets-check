const fs = require("fs");

input_file = fs.createReadStream("input.txt");

const bracket_chars = {
    "(": ")",
    "{": "}",
    "[": "]",
    "<": ">"
}

// List of opening brackets to check whether it corresponds with closing one
let last_brackets = [];

let line,position,line_text;
input_file.on("data", function (chunk) {
    line = 1;
    position = 0;
    line_text = "";
    const data = chunk.toString();
    // For the characters in the chunk
    for (let i = 0; i < data.length; i++) {
        if (data[i] == "\n") {
            line++;
            position = 0;
            line_text = "";
        } else {
            position++;
            line_text += data[i];
            // If the character is in Object.keys(bracket_chars)
            for (let j = 0; j < Object.keys(bracket_chars).length; j++) {
                if (data[i] == Object.keys(bracket_chars)[j]) {
                    last_brackets.push(data[i]);
                }
            }
            // If the character is in Object.values(bracket_chars)
            for (let k = 0; k < Object.values(bracket_chars).length; k++) {
                if (data[i] == Object.values(bracket_chars)[k]) {
                    if (data[i] == bracket_chars[last_brackets[last_brackets.length-1]]) {
                        last_brackets.pop();
                    } else {
                        console.log(line_text);
                        console.log(" ".repeat(position-1) + "^")
                        console.log("Problem at line " + line + ", character " + position);
                        console.log("Expected: " + bracket_chars[last_brackets[last_brackets.length-1]]);
                        console.log("Found: " + data[i]);
                        process.exit()
                    }
                }
            }   
        }
    }
});

input_file.on("end", function() {
    // EOF
    if (last_brackets.length > 0) {
        console.log(line_text);
        console.log(" ".repeat(position-1) + "^");
        console.log("Problem at line " + line + ", character " + position);
        console.log("Expected: " + last_brackets[last_brackets.length-1]);
        console.log("Found: EOF");
        process.exit();
    }
});