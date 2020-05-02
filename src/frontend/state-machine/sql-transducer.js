const Transducer = require('./transducer');

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

const sql = "SELECT a, b FROM table WHERE a > 5 ORDER BY b";
const ss = new SQL(sql.split(' '));
console.log(ss.run());
