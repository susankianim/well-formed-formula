class WFF {
    constructor(latexStr) {
        this.latexStr = latexStr;
        this.operators = ["\\neg", "\\wedge", "\\vee", "\\rightarrow"];
        this.operatorsPrecedence = {
            "\\neg": 1,
            "\\wedge": 2,
            "\\vee": 3,
            "\\rightarrow": 4
        }
        this.numberOfOperands = {
            "\\neg": 1,
            "\\wedge": 2,
            "\\vee": 2,
            "\\rightarrow": 2
        }
    }

    tokenize() {
        let str = this.latexStr.replace(/\s/g, "")
            .replaceAll("\\neg", "¬")
            .replaceAll("\\wedge", '∧')
            .replaceAll("\\vee", '∨')
            .replaceAll("\\rightarrow", "⟶");

        const symbol = {
            '¬': "\\neg",
            '∧': "\\wedge",
            '∨': "\\vee",
            '⟶': "\\rightarrow"
        };

        let arr = str.split('').map(x => symbol[x] ? symbol[x] : x);
        return (arr);
    }

    lessPrecedence(op1, op2) {
        if (op2 == "(") return false
        return this.operatorsPrecedence[op1] > this.operatorsPrecedence[op2];
    }

    postfix() {
        let tokensArr = this.tokenize(this.latexStr);
        let operatorsStack = [];
        let output = [];
        let i;

        let indexOfLefParentheses = []
        for (i = 0; i < tokensArr.length; i++) {
            let token = tokensArr[i];

            if (this.operators.includes(token)) {
                let topStack;
                while ((topStack = operatorsStack[operatorsStack.length - 1]) && this.lessPrecedence(token, topStack)) {
                    output.push(operatorsStack.pop());
                }
                operatorsStack.push(token)
            } else if (token == '(') {
                indexOfLefParentheses.push(output.length)
                operatorsStack.push(token)
            } else if (token == ')') {
                let topStack;
                while ((topStack = operatorsStack[operatorsStack.length - 1]) && topStack != '(') {
                    output.push(operatorsStack.pop());
                }
                if (topStack != "(") {
                    throw new Error("Error message: Lack of left parenthesis");
                }
                operatorsStack.pop()
                let from = indexOfLefParentheses.pop()
                let statementInParentheses = output.slice(from)
                this.getParseTree(statementInParentheses);
            } else {
                output.push(token)
            }
        }

        while (operatorsStack.length != 0) {
            let stackOperator = operatorsStack.pop()
            if (stackOperator == "(") {
                throw new Error("Error message: Lack of right parenthesis");
            }
            output.push(stackOperator);
        }
        return output
    }

    getParseTree(tokensArr) {
        if (tokensArr == []) {
            throw new Error("Error message: Empty formula");
        }

        let termStack = []

        for (let i = 0; i < tokensArr.length; i++) {
            let token = tokensArr[i];
            let node;
            if (this.operators.includes(token)) {
                node = {
                    type: "op",
                    symbol: token,
                    children: [],
                };
                for (let j = 0; j < this.numberOfOperands[token]; j++) {
                    if (termStack.length == 0) {
                        throw new Error(`Error message: Lack of operands for operator ${token}`);
                    }
                    node.children.unshift(termStack.pop());
                }
            } else {
                node = {
                    type: "atom",
                    symbol: token,
                    children: null,
                };
            }
            termStack.push(node);
        }
        if (termStack.length == 0) {
            throw new Error("Error message: No term found");
        }
        if (termStack.length > 1) {
            throw new Error("Error message: Lack of operators");
        }
        return termStack[0]
    }
}


// let wff = new WFF("( \\neg p \\wedge q \\rightarrow p \\wedge ( r \\rightarrow q))")
// 𝑝¬𝑞∧𝑝𝑟𝑞⟶∧⟶
// 𝑝\neg𝑞\wedge𝑝𝑟𝑞\rightarrow\wedge\rightarrow
let wff = new WFF("\\neg p \\wedge q")
try {
    console.log(wff.postfix().join(""));
    console.log(JSON.stringify(wff.getParseTree(wff.postfix()), null, 2))
} catch (error) {
    console.log(error.message);
}

