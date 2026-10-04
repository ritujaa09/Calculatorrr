const display = document.getElementById("result");
const operators = ["+", "-", "*", "/"];

function appendToResult(value) {
    const current = display.value;
    const last = current.slice(-1);

    if (operators.includes(value)) {
        if (current === "" || current === "Error") {
            if (value !== "-") return;
        } else if (operators.includes(last)) {
            display.value = current.slice(0, -1) + value;
            return;
        }
        display.value = current + value;
        return;
    }

    if (value === ".") {
        const currentNumber = current.split(/[+*/-]/).pop();
        if (currentNumber.includes(".")) return;
    }

    if (current === "0" || current === "Error") {
        display.value = value === "." ? "0." : value;
    } else {
        display.value = current + value;
    }
}

function clearResult() {
    display.value = "0";
}

function calculateResult() {
    const tokens = display.value.match(/\d*\.?\d+|[+*/-]/g);
    if (!tokens || tokens.join("") !== display.value || operators.includes(tokens[tokens.length - 1])) {
        display.value = "Error";
        return;
    }

    let position = 0;

    function parseNumber() {
        if (tokens[position] === "-") {
            position += 1;
            return -parseNumber();
        }
        const number = Number(tokens[position]);
        position += 1;
        return number;
    }

    function parseTerm() {
        let value = parseNumber();
        while (tokens[position] === "*" || tokens[position] === "/") {
            const operator = tokens[position];
            position += 1;
            const next = parseNumber();
            value = operator === "*" ? value * next : value / next;
        }
        return value;
    }

    function parseExpression() {
        let value = parseTerm();
        while (tokens[position] === "+" || tokens[position] === "-") {
            const operator = tokens[position];
            position += 1;
            const next = parseTerm();
            value = operator === "+" ? value + next : value - next;
        }
        return value;
    }

    try {
        const result = parseExpression();
        if (position !== tokens.length || Number.isNaN(result)) throw new Error("Invalid expression");
        display.value = Number.isFinite(result) ? String(Number(result.toPrecision(12))) : "Error";
    } catch {
        display.value = "Error";
    }
}