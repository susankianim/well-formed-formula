import { Formula } from "./formula.js";
function solve(latexStr) {
    try {
        let f = new Formula(latexStr);
        let isWellFormed = f.isWellFormed();
        let cnfFormula;
        if (isWellFormed) {
            cnfFormula = f.getFormula("CNF")
        }
        return { isWellFormed, cnfFormula }
    } catch (error) {
        console.log(error);
    }
}

function update({ isWellFormed, cnfFormula }) {
    try {
        let isWellFormedContainer = document.getElementById("isWellFormed-container");
        let cnfFormulaContainer = document.getElementById("cnfFormula-container");
        if (isWellFormed) {
            isWellFormedContainer.innerHTML = "This formula is well-formed, and here is its CNF:";
            cnfFormulaContainer.innerHTML = cnfFormula;
        } else {
            isWellFormedContainer.innerHTML = "This formula is not well-formed.";
            cnfFormulaContainer.innerHTML = '';
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
