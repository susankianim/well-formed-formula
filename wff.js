class WFF {
    constructor(latexStr) {
        this.latexStr = latexStr;
        this.operators = ["\\neg", "\\wedge", "\\vee", "\\rightarrow"];
    }

    tokenize() {
        let str = this.latexStr.replace(/\s/g, "")
            .replaceAll("\\neg", "¬")
            .replaceAll("\\wedge", '∧')
            .replaceAll("\\vee", '∨')
            .replaceAll("\\rightarrow", "⟶");

        const symbole = {
            '¬': "\\neg",
            '∧': "\\wedge",
            '∨': "\\vee",
            '⟶': "\\rightarrow",
        };

        let arr = str.split("").map(x => symbole[x] ? symbole[x] : x);
        return (arr);
    }

    lessPrecedence(op1, op2) {
        if (op2 == "(") return false
        return this.operators.indexOf(op1) > this.operators.indexOf(op2)
    }

    postfix() {
        let tokensArr = this.tokenize(this.latexStr);
        let operatorsStack = [];
        let output = [];
        let i;
        for (i = 0; i < tokensArr.length; i++) {
            let token = tokensArr[i]

            if (this.operators.includes(token)) {
                let topStack;
                while ((topStack = operatorsStack[operatorsStack.length - 1]) && this.lessPrecedence(token, topStack)) {
                    output.push(operatorsStack.pop());
                }
                operatorsStack.push(token)
            } else if (token == '(') {
                operatorsStack.push(token)
            } else if (token == ')') {
                let topStack;
                while ((topStack = operatorsStack[operatorsStack.length - 1]) && topStack != '(') {
                    output.push(operatorsStack.pop());
                }
                operatorsStack.pop()
            } else {
                output.push(token)
            }
        }

        while (operatorsStack.length != 0) {
            output.push(operatorsStack.pop());
        }

        return output
    }

}

let wff = new WFF("( \\neg 𝑝 \\wedge 𝑞 \\rightarrow 𝑝 \\wedge ( 𝑟 \\rightarrow 𝑞))")
console.log(wff.postfix().join(""));
// 𝑝¬𝑞∧𝑝𝑟𝑞⟶∧⟶
// 𝑝\neg𝑞\wedge𝑝𝑟𝑞\rightarrow\wedge\rightarrow
