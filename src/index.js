

function read_code() {
    let code_raw = document.getElementById('code').innerText;
    let sanatized = code_prepare.sanatize(code_raw);
    let code2comp = code_prepare.analize_sintax(sanatized)
    
   console.table(code2comp)
   console.table(compiler(code2comp))
   
}