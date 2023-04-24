
/*
  by: lucieudo.roberto@gmail.com 2023
  dont remove credits
*/


const opcodes = {
    nop :  0b00000000, sta :  0b00000001,
    lda :  0b00000010, add :  0b00000011,
    and :  0b00000101, not :  0b00000110,
    jmp :  0b00001000, hlt :  0b00001111,
    jn  :  0b00001001, jz  :  0b00001010,
    or  :  0b00000100, jnz :  0b00001011,
    lbl :  0b00010000
}


const _dec2x = d => (+d).toString(16);

    
/*
   Esse compilador é bem simples,
   ele recebe um array já analizado e tokenizado
   e converte cada commando para o binário. 
   
   em sua última etapa, ele converte todos os valores
   para a base 16.

*/

function compiler(_code) {
    
    let output = new Array(MXD).fill(0)
    let outpos = 0
    let varglb = {}
    let fixBug = 0;
    
    for ( let i=0; i<_code.length; i++ ) {
        let code = _code [i].split(' ');
        switch (code.length) {
            case 3:
                switch(code[1]) {
                    case 'equ':
                           varglb[code[0]] = code[2]
                    break;
                    
                    case 'atb':
                        let end = (varglb[code[2]] == undefined) ? code[2] : varglb[code[2]];
                        output[end] = code[0]
                    break
                }
                fixBug +=3;
            break;
            
            case 2:
                output[outpos] = opcodes[code[0]]
                outpos+=1;
               
                let val = (varglb[code[1]] == undefined) ? code[1] : varglb[code[1]];
                output[outpos] = val;
                outpos +=1;
                fixBug+=2
            break;
            
            case 1:
                 console.log(fixBug)
                 if ( code[0].charAt(0) == ':') {
                     varglb[code[0].substr(1,)] = fixBug
                     output[fixBug] = opcodes.lbl;
                 }else {
                     output[outpos]= opcodes[code[0]]
                 }
                 
                 fixBug+=1;
                 outpos+=1;
            break;
        }
    }
    
    for ( let x=0; x<output.length; x++ ) {
        output[x] = _dec2x(output[x])
    }
    return output
}