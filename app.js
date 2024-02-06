import { Formula } from "./formula.js";
try {
    let formulaStr = "( \\neg p \\wedge q \\rightarrow p \\wedge ( r \\rightarrow q))";
    let f = new Formula(formulaStr);

    console.log("-----------------------------------");
    console.log("well-formed: " + f.isWellFormed());

    // console.log(JSON.stringify(wff.getParseTree(), null, 2))

    console.log("-----------------------------------");
    console.log("CNF: ");
    console.log(f.getCnfFormula());

} catch (error) {
    console.log(error.message);
}
