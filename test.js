import { Formula } from "./formula.js";
try {
    let latexStr = "( \\neg p \\wedge q \\rightarrow p \\wedge ( r \\rightarrow q))";
    let f = new Formula(latexStr);

    console.log("-----------------------------------");
    console.log("well-formed: " + f.isWellFormed());

    // console.log(JSON.stringify(wff.getParseTree(), null, 2))

    console.log("-----------------------------------");
    console.log("formula: ");
    console.log(f.getFormula());
    console.log("-----------------------------------");
    console.log("implFree: ");
    console.log(f.getFormula("implFree"));
    console.log("-----------------------------------");
    console.log("NNF: ");
    console.log(f.getFormula("NNF"));
    console.log("-----------------------------------");
    console.log("CNF: ");
    console.log(f.getFormula("CNF"));

} catch (error) {
    console.log(error.message);
}