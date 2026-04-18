const allowedPattern = /^[0-9+\-*/().,\s%^a-z]+$/i;

const functionMap: Record<string, string> = {
    sin: "Math.sin",
    cos: "Math.cos",
    tan: "Math.tan",
    sqrt: "Math.sqrt",
    log10: "Math.log10",
    log: "Math.log",
};

function normalizePercentages(expression: string) {
    return expression.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
}

function normalizeFunctions(expression: string) {
    return Object.entries(functionMap).reduce(
        (current, [name, replacement]) =>
            current.replace(new RegExp(`\\b${name}\\s*\\(`, "g"), `${replacement}(`),
        expression
    );
}

function normalizeConstants(expression: string) {
    return expression
        .replace(/\bpi\b/gi, "Math.PI")
        .replace(/\be\b/g, "Math.E");
}

export function evaluateSimpleExpression(input: string) {
    const normalized = input.trim().replace(/\s+/g, "");

    if (!normalized) {
        throw new Error("Empty expression");
    }

    if (!allowedPattern.test(normalized)) {
        throw new Error("Unsupported expression");
    }

    const jsExpression = normalizeConstants(
        normalizeFunctions(normalizePercentages(normalized.replace(/\^/g, "**")))
    );

    const result = Function(`"use strict"; return (${jsExpression});`)();

    if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new Error("Invalid result");
    }

    return result;
}
