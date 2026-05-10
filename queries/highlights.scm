"class" @keyword
"module" @keyword
"function" @keyword
"if" @keyword
"else" @keyword
"switch" @keyword
"case" @keyword
"default" @keyword
"for" @keyword
"do" @keyword
"while" @keyword
"try" @keyword
"catch" @keyword
"finally" @keyword
"throw" @keyword
"return" @keyword
"break" @keyword
"continue" @keyword
"var" @keyword
"const" @keyword
"enum" @keyword
"extends" @keyword
"import" @keyword
"using" @keyword
"as" @keyword
"private" @keyword
"public" @keyword
"protected" @keyword
"hidden" @keyword
"static" @keyword
"new" @keyword
"instanceof" @keyword
"and" @keyword
"or" @keyword
"has" @keyword

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
(number_literal) @number
(float_literal) @number
(long_literal) @number
(double_literal) @number
(char_literal) @string
(boolean_literal) @boolean
(null_literal) @constant.builtin
(nan_literal) @constant.builtin
(symbol_literal) @constant
(me_literal) @keyword
(self_literal) @keyword
(comment) @comment
(doc_comment) @comment.documentation
