const s = "ls -la 'My Documents' /home /etc";

const STATE_UNQUOTED = 1;
const STATE_QUOTED = 2;

const CHAR_QUOTE = "'";
const CHAR_SPACE = " ";

const words = [];
let cur_state = STATE_UNQUOTED;
let cur_word = '';

for (const char of s) {
    if (cur_state === STATE_QUOTED) {
        if (char === CHAR_QUOTE) {
            words.push(cur_word);
            cur_word = '';
            cur_state = STATE_UNQUOTED;
        } else {
            cur_word += char;
        }
    } else if (cur_state === STATE_UNQUOTED) {
        if (char === CHAR_QUOTE) {
            cur_state = STATE_QUOTED;
        } else if (char === CHAR_SPACE) {
            if (cur_word) {
                words.push(cur_word);
            }
            cur_word = '';
        } else {
            cur_word += char;
        }
    }
}
words.push(cur_word);

console.log(words);
