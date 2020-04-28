class TransducerError extends Error {}

class Transducer {
    constructor(input, start_state) {
        this.output = [];
        this.input = input;
        this.cur_state = start_state;
    }

    run() {
        for (const symbol of this.input) {
            const method = this['state_'+this.cur_state];
            if (typeof method !== 'function') {
                throw new TransducerError(`No method handler found for state ${this.cur_state}`);
            }
            method.call(this, symbol);
        }
        return this.output;
    }

    transition(new_state) {
        let handler = this[`action_${this.cur_state}_exit`];
        if (typeof handler === 'function') {
            handler();
        }

        handler = this[`action_transition`];
        if (typeof handler === 'function') {
            handler.call(this, this.cur_state, new_state);
        }

        handler = this[`action_${new_state}_enter`];
        if (typeof handler === 'function') {
            handler();
        }

        this.cur_state = new_state;
    }
}

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


// const s = "ls -la 'My Documents' /home /etc";
// const sw = new SplitWords(s);
// console.log(sw.run());


// const sql = "SELECT a, b FROM table WHERE a > 5 ORDER BY b";

class SQL extends Transducer {
    constructor(s) {
        super(s, 'select');
        this.output = {
            'select': [],
            'from': [],
            'where': [],
            'order': [],
        }
    }

    state_select(token) {
        if (token === "SELECT") {
            // noop
        } else if (token === "FROM") {
            this.transition('from');
        } else {
            this.output['select'].push(token);
        }
    }

    state_from(token) {
        if (token === "WHERE") {
            this.transition('where');
        } else if (token === "ORDER") {
            this.transition('order');
        } else {
            this.output['from'].push(token);
        }
    }

    state_where(token) {
        if (token === "ORDER") {
            this.transition('order');
        } else {
            this.output['where'].push(token);
        }
    }

    state_order(token) {
        if (token === "BY") {
            // noop
        } else {
            this.output['order'].push(token);
        }
    }
}

// const ss = new SQL(sql.split(' '));
// console.log(ss.run());
