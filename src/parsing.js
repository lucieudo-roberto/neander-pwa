
/*
  by: lucieudo.roberto@gmail.com 2023
  dont remove credits
*/


const comds = {
    nop:1,sta:6,lda:2,add:7,
    and:3,not:8,jmp:4,hlt:9,
    equ:5,atb:0,jn:10,jz:11,
    or:12
}

const analize = {
    _toker : function (code) {
        let _code = code.toLowerCase().split('\n')
        let _tode = _code.map(x => x.trim() );
        return _tode;
    },
   
    parsing: function (text) {
        
        let out  = []
        let inp = this._toker(text); // tokeniza todo o códico
        let vars = {}
        
        const regEx_binCM = /^([a-z]{1,3}[\ ]{1,20}[\w]{1,20})/gm
        const regEx_terCM = /^([\w]{1,20}[\ ]{1,20}[a-z]{1,3}[\ ]{1,20}[\w]{1,20})/gm
        const regEx_unaCM = /^(?![^:]*:)[a-z]{2,3}/gm
        const regEx_labCM = /^(:[\w]{1,20})/
    
        /* limpando dados desnessesários do códico
           e filtrando os comandos com regEX */
                console.table(out)

        for ( let x=0; x<inp.length; x++ ) {
            if (inp[x].match(regEx_terCM) !== null){out.push(inp[x].match(regEx_terCM)[0]); continue;}
            if (inp[x].match(regEx_binCM) !== null){out.push(inp[x].match(regEx_binCM)[0]); continue;}
            if (inp[x].match(regEx_unaCM) !== null){out.push(inp[x].match(regEx_unaCM)[0]); continue;}
            if (inp[x].match(regEx_labCM) !== null){out.push(inp[x].match(regEx_labCM)[0]); continue;}
        }
        
        console.table(out)
        
        /* analizando a sintax do códico */
        for ( let x=0; x<out.length; x++) {
            let code_line = out[x].split(' ').filter(Boolean)
            
            switch(code_line.length){
                case 3:
                    /* Esse bloco ñ contém funções do neander 
                       São comandos que ajuda no apredizado, o último
                       é uma invenção minha, uma forma mais fácil de atribuir
                       um valor a um endereço de memoria.
                       
                       funções ternárias podem ser analizadas aquí, antes
                       de serem desenvolvidas no compilador. 
                    */
                    if ( comds[code_line[1]] == undefined ) return `erro: ln:${x+1}, cm:[${code_line[1]}], comando inválido`;
                    
                    if (code_line[1] == 'equ') {
                        // label equ end
                        if (code_line[2] > MXD || code_line[2] < 0 ) return `erro: ln:${x+1}, vl:[${code_line[2]}], valor inválido`;
                        if ( vars[code_line[0]] == undefined ) {
                             vars[code_line[0]] = parseInt(code_line[2])
                        }else {
                            return `erro: ln:${x+1}, vl:[${code_line[0]}], variavel duplicada`;
                        }
                    }
                    
                    if (code_line[1] == 'atb') {
                        // val atb end
                        if (code_line[0] > 255 || code_line[0] < 0) return `erro: ln:${x+1}, vl:[${code_line[0]}], valor inválido`;
                        
                        if (isNaN(code_line[2])) {
                            if ( vars[code_line[2]] == undefined ) {
                                return `erro: ln:${x+1}, vl:[${code_line[2]}], variavel não iniciada`
                            }
                        }else {
                            if (code_line[2] > MXD || code_line[0] < 0) return `erro: ln:${x+1}, vl:[${code_line[0]}], valor inválido`;
                        }
                    }
                break;
                
                case 2:
                    /* 
                       funções binárias podem ser testadas aquí, 
                       o códico só testa o seguinte: se o comando existe,
                       teste o valor do operando, se ele for um label ou um
                       valor direto, teste se seu valor está entre 0 e 255.
                    */
                    
                    if ( comds[code_line[0]] == undefined ) return `erro: ln:${x+1}, cm:[${code_line[0]}], comando inválido`;
                    
                    if (isNaN(code_line[1])) {
                        if (vars[code_line[1]] == undefined) {
                            return `erro: ln:${x+1}, vl:[${code_line[1]}], variavel não iniciada`
                        }
                    }
                    if (parseInt(code_line[1]) > MXD || parseInt(code_line[1]) < 0 ) return `erro: ln:${x+1}, vl:[${code_line[1]}], valor inválido`;
                break;
                
                case 1:
                    // nop, hlt
                    if (code_line[0][0] != ':') {
                        if (comds[code_line[0]] == undefined) return `erro: ln:${x+1}, cm:[${code_line[0]}], comando inválido`;
                    }else {
                        if (vars[code_line[0].substr(1,)] == undefined ) {
                            vars[code_line[0].substr(1,)] = x
                        }else {
                            return `erro: ln:${x+1}, vl:[${code_line[0]}], rotulo duplicado`;
                        }
                    }
                break;
                
            }
        }
        
        console.table(out)
        return out;
    }
}