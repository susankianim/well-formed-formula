import { Formula } from "./formula.js";
try {
    let f = new Formula("( \\neg p \\wedge q \\rightarrow p \\wedge ( r \\rightarrow q))");
    console.log("-----------------------------------");
    console.log("well-formed: " + f.isWellFormed());
    // console.log(JSON.stringify(wff.getParseTree(), null, 2))
    
    console.log("-----------------------------------");
    let tree = f.getParseTree();
    let implFreeTree = f.implFree(tree);
    let nnfTree = f.NNF(implFreeTree);
    let cnfTree = f.CNF(nnfTree)

    // console.log(f.getFormula(tree));
    // console.log(f.getFormula(implFreeTree));
    // console.log(f.getFormula(nnfTree));
    
    console.log("CNF: ");
    console.log(f.getFormula(cnfTree));

} catch (error) {
    console.log(error.message);
}