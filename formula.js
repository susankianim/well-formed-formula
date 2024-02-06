class Formula {
    constructor(latexStr) {
        this.latexStr = latexStr;
        this.operators = ["\\neg", "\\wedge", "\\vee", "\\rightarrow"];
        this.operatorsPrecedence = {
            "\\neg": 4,
            "\\wedge": 3,
            "\\vee": 2,
            "\\rightarrow": 1
        }
        this.numberOfOperands = {
            "\\neg": 1,
            "\\wedge": 2,
            "\\vee": 2,
            "\\rightarrow": 2
        }
    }

    isWellFormed() {
        let statement = this.tokenize();
        let atoms = [...new Set(statement.filter(x => !this.operators.includes(x)))]
        let grammer = {
            E: [["EArrow", "E"], ["EOr", "E"], ["EAnd", "E"], ["Not", "E"], ["OpenE", "Close"], atoms],
            EArrow: [["E", "Arrow"]],
            EOr: [["E", "Or"]],
            EAnd: [["E", "And"]],
            OpenE: [["Open", "E"]],
            Arrow: [["\\rightarrow"]],
            Or: [["\\vee"]],
            And: [["\\wedge"]],
            Not: [["\\neg"]],
            Open: [["("]],
            Close: [[")"]],
        }
        let n = statement.length;
        let table = [...Array(n)].map(() => [...Array(n)].map(() => []));

        for (let i = 0; i < n; i++) {
            for (let A of Object.keys(grammer)) {
                if (grammer[A].some(x => x.includes(statement[i]))) {
                    table[i][i].push(A)
                }
            }
        }

        for (let l = 1; l < n; l++) {
            for (let i = 0; i < n - l; i++) {
                let j = i + l;
                for (let k = i; k < j; k++) {
                    // for each A -> BC
                    for (let rule of Object.entries(grammer)) {
                        let A = rule[0];
                        for (let [B, C] of rule[1]) {
                            if (table[i][k].includes(B) && table[k + 1][j].includes(C)) {
                                table[i][j].push(A);
                            }
                        }
                    }
                }

            }

        }

        return (table[0][n - 1].includes(Object.keys(grammer)[0]));
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
        return this.operatorsPrecedence[op1] < this.operatorsPrecedence[op2];
    }

    postfix() {
        if (!this.isWellFormed())
            throw new Error("This is not a well-formed formula.");

        let tokensArr = this.tokenize(this.latexStr);
        let operatorsStack = [];
        let output = [];

        for (let i = 0; i < tokensArr.length; i++) {
            let token = tokensArr[i];

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

    getParseTree() {
        let tokensArr = this.postfix();
        let termStack = []

        for (let i = 0; i < tokensArr.length; i++) {
            let token = tokensArr[i];
            let node = {
                symbol: token,
                children: [],
            };
            for (let j = 0; j < this.numberOfOperands[token]; j++) {
                node.children.unshift(termStack.pop());
            }
            termStack.push(node);
        }
        return termStack[0]
    }

    getFormula(node) {
        if (node.symbol == "\\vee") {
            return "(" + this.getFormula(node.children[0]) + " \\vee " + this.getFormula(node.children[1]) + ")";
        } else if (node.symbol == "\\rightarrow") {
            return "(" + this.getFormula(node.children[0]) + " \\rightarrow " + this.getFormula(node.children[1]) + ")";
        } else if (node.symbol == "\\wedge") {
            return "(" + this.getFormula(node.children[0]) + " \\wedge " + this.getFormula(node.children[1]) + ")";
        } else if (node.symbol == "\\neg") {
            return " \\neg " + this.getFormula(node.children[0]);
        } else {
            return node.symbol;
        }
    }

    implFree(node) {
        if (node.symbol == "\\rightarrow") {
            return {
                symbol: "\\vee",
                children: [
                    {
                        symbol: "\\neg",
                        children: [this.implFree(node.children[0])],
                    },
                    this.implFree(node.children[1])
                ],
            };
        } else if (node.symbol == "\\vee") {
            return {
                symbol: "\\vee",
                children: [
                    this.implFree(node.children[0]),
                    this.implFree(node.children[1])
                ],
            };
        } else if (node.symbol == "\\wedge") {
            return {
                symbol: "\\wedge",
                children: [
                    this.implFree(node.children[0]),
                    this.implFree(node.children[1])
                ],
            };
        } else if (node.symbol == "\\neg") {
            return {
                symbol: "\\neg",
                children: [
                    this.implFree(node.children[0]),
                ],
            };
        } else {
            return node
        }
    }

    NNF(node) {
        if (node.symbol == "\\neg" && node.children[0].symbol == "\\neg") {
            return this.NNF(node.children[0].children[0])
        } else if (node.symbol == "\\wedge") {
            return {
                symbol: "\\wedge",
                children: [
                    this.NNF(node.children[0]),
                    this.NNF(node.children[1]),
                ],
            };
        } else if (node.symbol == "\\vee") {
            return {
                symbol: "\\vee",
                children: [
                    this.NNF(node.children[0]),
                    this.NNF(node.children[1]),
                ],
            };
        } else if (node.symbol == "\\neg" && node.children[0].symbol == "\\wedge") {
            return {
                symbol: "\\vee",
                children: [
                    this.NNF({
                        symbol: "\\neg",
                        children: [
                            this.NNF(node.children[0].children[0]),
                        ],
                    }),
                    this.NNF({
                        symbol: "\\neg",
                        children: [
                            this.NNF(node.children[0].children[1]),
                        ],
                    })
                ],
            };
        } else if (node.symbol == "\\neg" && node.children[0].symbol == "\\vee") {
            return {
                symbol: "\\wedge",
                children: [
                    this.NNF({
                        symbol: "\\neg",
                        children: [
                            this.NNF(node.children[0].children[0]),
                        ],
                    }),
                    this.NNF({
                        symbol: "\\neg",
                        children: [
                            this.NNF(node.children[0].children[1]),
                        ],
                    })
                ],
            };
        } else {
            return node;
        }
    }

    distr(node1, node2) {
        if (node1.symbol == "\\wedge") {
            return {
                symbol: "\\wedge",
                children: [
                    this.distr(node1.children[0], node2),
                    this.distr(node1.children[1], node2),
                ],
            }
        } else if (node2.symbol == "\\wedge") {
            return {
                symbol: "\\wedge",
                children: [
                    this.distr(node1, node2.children[0]),
                    this.distr(node1, node2.children[1]),
                ],
            }
        } else {
            return {
                symbol: "\\vee",
                children: [node1, node2],
            };
        }
    }

    CNF(node) {
        if (node.symbol == "\\wedge") {
            return {
                symbol: "\\wedge",
                children: [
                    this.CNF(node.children[0]),
                    this.CNF(node.children[1]),
                ],
            }
        } else if (node.symbol == "\\vee") {
            return this.distr(this.CNF(node.children[0]), this.CNF(node.children[1]));
        } else {
            return node;
        }
    }
}

export { Formula };

