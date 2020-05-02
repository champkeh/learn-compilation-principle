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

module.exports = Transducer;
