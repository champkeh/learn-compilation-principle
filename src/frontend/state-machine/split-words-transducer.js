const Transducer = require('./transducer');

const CHAR_QUOTE = "'";
const CHAR_SPACE = " ";

class SplitWords extends Transducer {
    constructor(s) {
        super(s, 'unquoted');
        this.output.push('');
    }

    state_unquoted(c) {
        if (c === CHAR_QUOTE) {
            this.transition('quoted');
        } else if (c === CHAR_SPACE) {
            this.append_word()
        } else {
            this.append_char(c);
        }
    }

    state_quoted(c) {
        if (c === CHAR_QUOTE) {
            this.transition('unquoted');
        } else {
            this.append_char(c);
        }
    }

    append_word() {
        if (this.output[this.output.length-1]) {
            this.output.push('');
        }
    }
    append_char(c) {
        this.output[this.output.length-1] += c;
    }
}


const s = "ls -la 'My Documents' /home /etc";
const sw = new SplitWords(s);
console.log(sw.run());
