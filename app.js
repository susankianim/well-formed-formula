import { Formula } from "./formula.js";
// try {
//     let latexStr = "( \\neg p \\wedge q \\rightarrow p \\wedge ( r \\rightarrow q))";
//     let f = new Formula(latexStr);

//     console.log("-----------------------------------");
//     console.log("well-formed: " + f.isWellFormed());

//     // console.log(JSON.stringify(wff.getParseTree(), null, 2))

//     console.log("-----------------------------------");
//     console.log("CNF: ");
//     console.log(f.getCnfFormula());

// } catch (error) {
//     console.log(error.message);
// }

function solve(latexStr) {
    try {
        let f = new Formula(latexStr);
        let isWellFormed = f.isWellFormed();
        let cnfFormula;
        if (isWellFormed) {
            cnfFormula = f.getCnfFormula()
        }
        return { isWellFormed, cnfFormula }
    } catch (error) {
        console.log(error);
    }
}

function update({ isWellFormed, cnfFormula }) {
    try {
        let isWellFormedContainer = document.getElementById("isWellFormed-container");
        if (isWellFormed) {
            isWellFormedContainer.innerHTML = "This formula is well-formed, and here is its CNF:";
            let cnfFormulaContainer = document.getElementById("cnfFormula-container");
            cnfFormulaContainer.innerHTML = cnfFormula;
        } else {
            isWellFormedContainer.innerHTML = "This formula is not well-formed.";
        }

    } catch (e) {
        console.log(e);
    }
}

window.addEventListener("load", event => {
    let form = document.querySelector("#frmMain");
    form.addEventListener("submit", (event) => {
        try {
            let latexStr = form.latexStr.value;

            let { isWellFormed, cnfFormula } = solve(latexStr);
            update({ isWellFormed, cnfFormula })
        } catch (e) {
            console.log(e);
        }
    });
});
