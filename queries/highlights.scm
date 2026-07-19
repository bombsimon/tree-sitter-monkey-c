"class" @keyword
"module" @keyword
"function" @keyword
"interface" @keyword
"enum" @keyword
"typedef" @keyword
"extends" @keyword

"if" @keyword.conditional
"else" @keyword.conditional
"switch" @keyword.conditional
"case" @keyword.conditional
"default" @keyword.conditional

"for" @keyword.repeat
"do" @keyword.repeat
"while" @keyword.repeat

"try" @keyword.exception
"catch" @keyword.exception
"finally" @keyword.exception
"throw" @keyword.exception

"return" @keyword.return
"break" @keyword
"continue" @keyword

"var" @keyword
"const" @keyword
"as" @keyword

"import" @keyword.import
"using" @keyword.import

;; Modifiers
(modifier) @keyword.modifier

;; Operator-like keywords
"new" @keyword.operator
"instanceof" @keyword.operator
"and" @keyword.operator
"or" @keyword.operator
"has" @keyword.operator

;; Operators
[
  "+" "-" "*" "/" "%"
  "=" "==" "!=" "<" ">" "<=" ">="
  "&&" "||" "!"
  "&" "|" "^" "~" "<<" ">>"
  "++" "--"
  "+=" "-=" "*=" "/=" "%="
  "&=" "|=" "^=" "<<=" ">>="
  "=>"
] @operator

;; Punctuation
["(" ")" "[" "]" "{" "}"] @punctuation.bracket
["." "," ";" ":"] @punctuation.delimiter

;; Annotations like (:glance)
(annotation) @attribute

;; Declarations and names
(class_declaration name: (identifier) @type)
(module_declaration name: (identifier) @type)
(function_declaration name: (identifier) @function)
(parameter name: (identifier) @parameter)
(variable_declaration name: (identifier) @variable)
(variable_declaration_no_semicolon (identifier) @variable)

;; Type names
(type_name (identifier) @type)
(type_name (qualified_identifier) @type)

;; Constructor calls: `new Foo()`
(new_expression constructor: (identifier) @constructor)
(new_expression constructor: (type_name (identifier) @constructor))
(new_expression constructor: (symbol_reference (identifier) @constructor))

;; Interface members
(interface_method name: (identifier) @function.method)
(interface_variable name: (identifier) @variable)

;; Member access
(member_expression property: (identifier) @property)

;; Function/method calls
(call_expression
  function: (identifier) @function.call)

(call_expression
  function: (member_expression
    property: (identifier) @function.method.call))

(call_expression
  function: (symbol_reference
    (identifier) @function.call))

(string_literal) @string
(char_literal) @character
(number_literal) @number
(hex_literal) @number
(float_literal) @number.float
(long_literal) @number
(double_literal) @number.float
(boolean_literal) @boolean
(null_literal) @constant.builtin
(nan_literal) @constant.builtin
(symbol_literal) @constant

;; `me` and `self` are values, not keywords
(me_literal) @variable.builtin
(self_literal) @variable.builtin

(comment) @comment
(doc_comment) @comment.documentation
