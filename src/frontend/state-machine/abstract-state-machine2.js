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
            throw new Error('must call .setStart() before .run()')
        }

        if (this.endStates.length <= 0) {
            throw new Error('at least one state must be an end state')
        }

        while (true) {
            let [newState, newCargo] = handler(cargo);
            if (this.endStates.includes(newState.toUpperCase())) {
                break;
            } else {
                cargo = newCargo;
                handler = this.handlers[newState.toUpperCase()];
            }
        }
    }
}

function mathFunc(n) {
    return Math.abs(Math.sin(n)) * 31;
}

function onesCounter(val) {
    console.log("ONES State: ");
    let newState;
    while (true) {
        if (val <= 0 || val >= 30) {
            newState = "Out_of_Range";
            break;
        } else if (val >= 20) {
            newState = "Twenties";
            break;
        } else if (val >= 10) {
            newState = "Tens";
            break;
        } else {
            console.log(` @${val.toFixed(2)}+`);
            val = mathFunc(val);
        }
    }
    return [newState, val];
}
function tensCounter(val) {
    console.log("TENS State: ");
    let newState;
    while (true) {
        if (val <= 0 || val >= 30) {
            newState = "Out_of_Range";
            break;
        } else if (val >= 20) {
            newState = "Twenties";
            break;
        } else if (val < 10) {
            newState = "ONES";
            break;
        } else {
            console.log(` #${val.toFixed(2)}+`);
            val = mathFunc(val);
        }
    }
    return [newState, val];
}
function twentiesCounter(val) {
    console.log("TWENTIES State: ");
    let newState;
    while (true) {
        if (val <= 0 || val >= 30) {
            newState = "Out_of_Range";
            break;
        } else if (val < 10) {
            newState = "Ones";
            break;
        } else if (val < 20) {
            newState = "Tens";
            break;
        } else {
            console.log(` $${val.toFixed(2)}+`);
            val = mathFunc(val);
        }
    }
    return [newState, val];
}

const m = new StateMachine();
m.addState("ONES", onesCounter);
m.addState("TENS", tensCounter);
m.addState("TWENTIES", twentiesCounter);
m.addState("OUT_OF_RANGE", null, true);
m.setStart("ONES");
m.run(1);
