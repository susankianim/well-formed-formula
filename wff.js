class WFF {
    constructor(latexInfixStatement) {
        this.operators = { not: "¬", and: "∧", or: "∨", arrow: "⟶" };
        this.infixStatement = this.ConvertFromLatex(latexInfixStatement)
        this.postfixStatement = this.postfix(this.infixStatement)
    }

    getOperator(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    lessPrecedence(op1, op2) {
        if (op2 == "(") return false
        return Object.keys(this.operators).indexOf(op1) > Object.keys(this.operators).indexOf(op2)
    }

    ConvertFromLatex(latexStatement) {
        return latexStatement.replace(/\s/g, "")
            .replaceAll("\\wedge", this.operators.and)
            .replaceAll("\\vee", this.operators.or)
            .replaceAll("\\rightarrow", this.operators.arrow)
            .replaceAll("\\neg", this.operators.not);
    }

    postfix(str) {
        let operatorsStack = [];
        let output = [];
        let i;
        for (i = 0; i < str.length; i++) {
            let c = str[i]

            let operator = this.getOperator(this.operators, c)
            if (operator) {
                let topStack = operatorsStack[operatorsStack.length - 1];
                while (topStack && this.lessPrecedence(operator, topStack)) {
                    output.push(operatorsStack.pop());
                    topStack = operatorsStack[operatorsStack.length - 1];
                }
                operatorsStack.push(operator)
            } else if (c == '(') {
                operatorsStack.push(c)
            } else if (c == ')') {
                let topStack = operatorsStack[operatorsStack.length - 1];
                while (topStack && topStack != '(') {
                    output.push(operatorsStack.pop());
                    topStack = operatorsStack[operatorsStack.length - 1];
                }
                operatorsStack.pop()
            } else {
                output.push(c)
            }
        }

        while (operatorsStack.length != 0) {
            output.push(operatorsStack.pop());
        }

        return output
    }

}

let wff = new WFF("( \\neg 𝑝 \\wedge 𝑞 \\rightarrow 𝑝 \\wedge ( 𝑟 \\rightarrow 𝑞))")
console.log(wff.postfixStatement.map(x => wff.operators[x] ? wff.operators[x] : x).join(""));
// 𝑝¬𝑞∧𝑝𝑟𝑞⟶∧⟶
