var ReadLine = require('readline');
var rl = ReadLine.createInterface({input:process.stdin,output:process.stdout});



//BEGIN PARSER

var StringPointer = function(txt) {
  var position = 0;
    var retval = {
        next:function() {
            position++;
        },
        prev:function(){
            position--;
        },
        get:function() {
            return position == txt.length ? null : txt[position];
        }
    };
  return retval;
};


var isDigit = function(character) {
    return (character*1).toString() == character;
};

var isAlpha = function(character) {
  return (character>='a' && character<='z') || (character>='A' && character<='Z');  
};
var isalnum = function(character) {
    return isAlpha(character) || isDigit(character);
}

var expectNumber = function(txt) {
  var retval = '';
    while(txt.get() != null) {
      if(isDigit(txt.get()) || txt.get() == '.') {
          retval+=txt.get();
          txt.next();
      }else {
          return retval;
      }
  }  
  return retval;
};

var Node = function() {  
    return {};
};

var Declaration = function(name,type) {
  var retval = Node();
  retval.name = name;
  retval.type = type;
  return retval;
};

var Function = function() {
    var retval = Node();
    retval.declarations = new Object();
    retval.expressions = new Array();
    return retval;
};

var Module = function() {
  var retval = Function();
  return retval;
};
var Expression = function() {
    return Node();
}
var BinaryExpression = function(op, left, right) {
    var retval = Expression();
    retval.op = op;
    retval.left = left;
    retval.right = right;
    return retval;
};

var expectIdentifier = function(code) {
  var retval = '';
    while(isalnum(code.get())) {
      retval+=code.get();
      
        code.next();
  }  
  return retval;
  
  
};
var isWhitespace = function(char) {
    return (char == ' ' || char == '\t' || char == '\n' || char == '\r');
}
var readWhitespace = function(code) {
    while(true) {
        var char = code.get();
        if(!isWhitespace(char)) {
            break;
        }
        code.next();
    }
    
};
var error = function(code,msg) {
    throw msg;
};



//TODO: Should we call this
//Shananigans



var parseExpression = function(code) {
    readWhitespace(code);
    if(isDigit(code.get())) {
        var retval = expectNumber(code);
        return retval;
    }
};

//Entry-point parser function
var parse = function(code) {
  code = StringPointer(code);
  var retval = Module();
  while(code.get() != null) {
        readWhitespace(code);
        if(isAlpha(code.get())) {
            var id = expectIdentifier(code);
            readWhitespace(code);
            if(isAlpha(code.get())) {
                var name = expectIdentifier(code);
                retval.declarations[name] = Declaration(name,id);
                readWhitespace(code);
                switch(code.get()) {
                    case ';':
                        break;
                    case '=':
                        code.next();
                        retval.expressions.push(BinaryExpression('=',retval.declarations[name],parseExpression(code)));
                        if(code.get() != ';') {
                            error(code,'Expected ;, got '+code.get());
                        }
                        code.next();
                        break;
                    default:
                        error(code,'Expected ;');
                }
                code.next();
                continue;
            }
      }
      if(code.get() == null) {
          error(code,'Unexpected EOF (end-of-file)');
      }
      error(code,'Unexpected token: '+code.get());
      
  }
  return retval;
  
};




//END PARSER


//BEGIN COMPILER

var BinaryWriter = function() {
   var buffer = new Buffer(0);
   return {
       writeInt32:function(value) {
           var b = new Buffer(4);
           b.writeInt32LE(value,0);
           buffer = Buffer.concat([buffer,b],buffer.length+b.length);
       },
       writeString:function(value) {
           var txt = new Buffer(value);
           buffer = Buffer.concat([buffer,txt],buffer.length+txt.length);
       },
       toBinary:function() {
           return buffer;
       }
   };
};


var compile = function(tree) {
    //Emit Main function
    
};
//END COMPILER

var promptUser = function() {
    
    rl.question('> ',function(code){
        var tree = parse(code);
        console.log(tree);
        promptUser();
    });
};
Number.prototype.__Number = true;
promptUser();



