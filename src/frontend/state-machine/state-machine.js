class StateMachine {
    constructor() {
        this.handlers = Object.create(null);
        this.startState = null;
        this.endStates = [];
    }

    addState(name, handler, isEndState = false) {
        name = name.toUpperCase();
        this.handlers[name] = handler;
        if (isEndState) {
            this.endStates.push(name);
        }
    }

    setStart(name) {
        this.startState = name.toUpperCase();
    }

    run(cargo) {
        let handler = this.handlers[this.startState];
        if (typeof handler !== 'function') {
            throw new Error('must call .setStart() before .run()');
        }

        if (this.endStates.length <= 0) {
            throw new Error('at least one state must be an end state');
        }

        while (true) {
            try {
                let [newState, newCargo] = handler(cargo);
                if (this.endStates.includes(newState.toUpperCase())) {
                    break;
                } else {
                    cargo = newCargo;
                    handler = this.handlers[newState.toUpperCase()];
                }
            } catch (e) {
                throw new Error('state handler ' + handler + ' fault: ' + e.message);
            }
        }
    }
}

module.exports = StateMachine;
