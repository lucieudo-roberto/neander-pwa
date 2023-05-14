
/*
  by: lucieudo.roberto@gmail.com 2023
  dont remove credits
*/


const neander = {
    ac  : 0,
    wait_operand : false,
    last_command : false,
    
    h2d : h => parseInt(h, 16),
    d2h : d => (+d).toString(16),
    
    run : function(byte) {
        
       opcode = (this.wait_operand) ? this.last_command : byte
        
        switch(opcode) {
            
            
            case 1: // sta
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return 10
                } else {
                    this.last_command = false
                    this.wait_operand = false
                    return 'a2r'
                }
            break;
            
            case 2: // lda 
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return 10
                }else {
                    this.last_command = false
                    this.wait_operand = false
                    return 'r2a'
                }
            break;
            
            case 3: // add
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return 10
                } else {
                    this.last_command = false
                    this.wait_operand = false
                    return 'aAr'
                }
            break;
            
            case 4: // or
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return 10
                } else {
                    this.last_command = false
                    this.wait_operand = false
                    return 'aOr'
                }
            break;
            
            case 5: // and
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return 10
                } else {
                    this.ac = (this.ac & this.h2d(RAM[byte]))
                    this.last_command = false
                    this.wait_operand = false
                    return 'aEr'
                }
            break;
            
            case 6: // not
                this.ac = ~ this.ac;
                return 30
            break;
            
            case 8: // jmp
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return 10
                } else {
                    this.last_command = false
                    this.wait_operand = false
                    return 'jmp'
                }
            break;
            
            case 9: // jn
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return 10
                } else {
                    this.last_command = false
                    this.wait_operand = false
                    if (this.ac < 0) return 'jmp';
                    return 10;
                }
            break;
            
            case 10: // jz
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return 10
                } else {
                    this.last_command = false
                    this.wait_operand = false
                    if ( this.ac == 0 ) return 'jmp';
                    return 10;
                }
            break;
            
            case 11: // jnz
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return 10
                } else {
                    this.last_command = false
                    this.wait_operand = false
                    if (this.ac != 0) return 'jmp';
                    return 10;
                }
            break;
            
            case 0:   return 20; break;
            case 15:  return 40; break;
            case 16:  return 60; break;
            case 128: return 50; break;
        }
    }
    
}