
/*
  by: lucieudo.roberto@gmail.com 2023
  dont remove credits
*/


const neander = {
    ac  : 0,
    wait_operand : false,
    last_command : false,
    
    h2d : h => parseInt(h, 16),
    d2h: d => (+d).toString(16),
    
    ula : function(byte) {
        
       opcode = (this.wait_operand) ? this.last_command : byte
        
        switch(opcode) {
            case 0: return 'sem operação'; break;
            
            case 1: // sta
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return true
                } else {
                    RAM[byte] = this.d2h(this.ac);
                    this.last_command = false
                    this.wait_operand = false
                    return 'acumulador => ram'
                }
            break;
            
            case 2: // lda 
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return true
                }else {
                    this.ac = this.h2d(RAM[byte]);
                    this.last_command = false
                    this.wait_operand = false
                    return 'acumulador <= ram'
                }
            break;
            
            case 3: // add
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return true
                } else {
                    this.ac += this.h2d(RAM[byte]);
                    this.last_command = false
                    this.wait_operand = false
                    return 'acumulador + ram'
                }
            break;
            
            case 4: // or
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return true
                } else {
                    this.ac = ( this.ac | this.h2d(RAM[byte]) )
                    this.last_command = false
                    this.wait_operand = false
                    return 'acumulador | ram'
                }
            break;
            
            case 5: // and
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return true
                } else {
                    this.ac = (this.ac & this.h2d(RAM[byte]))
                    this.last_command = false
                    this.wait_operand = false
                    return 'acumulador & ram'
                }
            break;
            
            case 6: // not
                this.ac = ~ this.ac;
                return 'acumulador <>'
            break;
            
            case 8: // jmp
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return true
                } else {
                    this.last_command = false
                    this.wait_operand = false
                    return this.h2d(RAM[byte])
                }
            break;
            
            case 9: // jn
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return true
                } else {
                    this.last_command = false
                    this.wait_operand = false
                    if (this.ac < 0) return this.h2d(RAM[byte]);
                    return 'próximo passo';
                }
            break;
            
            case 10: // jz
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return true
                } else {
                    this.last_command = false
                    this.wait_operand = false
                    if ( this.ac == 0 ) return this.h2d(RAM[byte]);
                    return 'próximo passo';
                }
            break;
            
            case 11: // jnz
                if (this.wait_operand == false) {
                    this.wait_operand = true;
                    this.last_command = byte;
                    return true
                } else {
                    this.last_command = false
                    this.wait_operand = false
                    if (this.ac != 0) return this.h2d(RAM[byte]);
                    return 'próximo passo';
                }
            break;
            
            case 15: // hlt
                return 'stop'
            break;
            case 16: // label
                return 'ponto de referência'
            break;
        }
    }
    
}