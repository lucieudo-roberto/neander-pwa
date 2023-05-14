
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
    lbl :  0b00010000, lbm :  0b10000000,
}

const dec2x = d => (+d).toString(16);


function compiler(raw_code) {
    let output = []
    
    for ( let line of raw_code) {
      
       let line_raw = line.split(" ");
        
       if (line_raw.length == 2 ) {
           output.push(dec2x(opcodes[line_raw[0]]),dec2x(line_raw[1]))
       }else {
           output.push(dec2x(opcodes[line]))
       }
    }
    return output.length > 1 ? output : false;
}