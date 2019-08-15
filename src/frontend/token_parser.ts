enum TokenType {
    Identifier,
    IntConstant,
    RelOp,
}

// 自动状态机
enum DfsState {
    Initial,
    Id,
    GT,
    GE,
    IntConstant,
}

class Token {
    type: TokenType;
    text: string;
}

let tokens : Token[] = [];

function initToken(ch: string) : DfsState {
    let nextState = DfsState.Initial;
    let token = new Token();

    if (isAlpha(ch)) {
        nextState = DfsState.Id;
        token.type = TokenType.Identifier;
        token.text = append(token.text, ch);
        tokens.push(token);
    } else if (isDigit(ch)) {
        nextState = DfsState.IntConstant;
        token.type = TokenType.IntConstant;
        token.text = append(token.text, ch);
        tokens.push(token);
    } else if (ch === '>') {
        nextState = DfsState.GT;
        token.type = TokenType.RelOp;
        token.text = append(token.text, ch);
        tokens.push(token);
    } else {
        nextState = DfsState.Initial;
    }

    return nextState;
}

function generateTokens(code: string) {
    let index = 0;
    let ch = code[index];

    let nextState = initToken(ch);
    
    while(++index < code.length) {
        ch = code[index];

        let token = tokens[tokens.length-1];
        switch(nextState) {
            case DfsState.Initial:
                nextState = initToken(ch);
                break;
            case DfsState.Id:
                if (isAlpha(ch) || isDigit(ch)) {
                    token.text += ch;
                } else {
                    nextState = initToken(ch);
                }
                break;
            case DfsState.GT:
                if (ch === '=') {
                    token.type = TokenType.RelOp;
                    token.text += ch;
                    nextState = DfsState.GE;
                } else {
                    nextState = initToken(ch);
                }
                break;
            case DfsState.GE:
                nextState = initToken(ch);
                break;
            case DfsState.IntConstant:
                if (isDigit(ch)) {
                    token.text += ch;
                } else {
                    nextState = DfsState.Initial;
                }
                break;
        }
    }
}

function isAlpha(ch: string) : boolean {
    return /[a-zA-Z_]/.test(ch);
}
function isDigit(ch: string) : boolean {
    return /[0-9]/.test(ch);
}
function append(dist : string | undefined | null, source : string) : string {
    if (dist) {
        return dist += source;
    } else {
        return source;
    }
}
function printTokens() {
    tokens.forEach(token => {
        console.log(`${TokenType[token.type]}\t${token.text}`);
    });
}

const code = "age >= 45";
generateTokens(code);
printTokens();
