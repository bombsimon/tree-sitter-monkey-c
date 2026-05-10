module.exports = grammar({
  name: "monkey_c",

  extras: ($) => [/\s/, $.comment, $.doc_comment],

  word: ($) => $.identifier,

  conflicts: ($) => [
    [$.type_primary, $.generic_type],
    [$.block, $.dictionary],
    [$.type_item, $.nullable_type],
  ],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.annotation,
        $.import_statement,
        $.use_statement,
        $.enum_declaration,
        $.module_declaration,
        $.class_declaration,
        $.function_declaration,
        $.variable_declaration,
        $.if_statement,
        $.for_statement,
        $.while_statement,
        $.do_while_statement,
        $.switch_statement,
        $.try_statement,
        $.throw_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.expression_statement,
        $.block,
        ";",
      ),

    annotation: ($) => seq("(:", $.identifier, ")"),

    import_statement: ($) =>
      seq(
        "import",
        field("module", $.qualified_identifier),
        optional(seq("as", field("alias", $.identifier))),
        ";",
      ),

    use_statement: ($) =>
      seq(
        "using",
        field("module", $.qualified_identifier),
        optional(seq("as", field("alias", $.identifier))),
        ";",
      ),

    class_declaration: ($) =>
      seq(
        optional(choice("private", "public", "protected")),
        "class",
        field("name", $.identifier),
        optional(seq("extends", field("superclass", $.type_name))),
        field("body", $.class_body),
      ),

    module_declaration: ($) =>
      seq(
        optional(choice("private", "public", "protected")),
        "module",
        field("name", $.identifier),
        field("body", $.class_body),
      ),

    class_body: ($) => seq("{", repeat($._class_member), "}"),

    _class_member: ($) =>
      choice(
        $.annotation,
        $.enum_declaration,
        $.function_declaration,
        $.variable_declaration,
        $.class_declaration,
        ";",
      ),

    enum_declaration: ($) =>
      seq("enum", optional($.comment), "{", repeat($.enum_member), "}"),

    enum_member: ($) => seq($.identifier, "=", $.expression, ","),

    function_declaration: ($) =>
      seq(
        optional(choice("private", "public", "protected", "hidden", "static")),
        "function",
        optional(field("name", $.identifier)),
        field("parameters", $.formal_parameters),
        optional(field("return_type", $.type_hint)),
        field("body", $.block),
      ),

    formal_parameters: ($) =>
      seq(
        "(",
        optional(
          seq($.parameter, repeat(seq(",", $.parameter)), optional(",")),
        ),
        ")",
      ),

    parameter: ($) =>
      seq(field("name", $.identifier), optional(field("type", $.type_hint))),

    variable_declaration: ($) =>
      seq(
        optional(choice("private", "public", "protected", "hidden")),
        optional("static"),
        choice("var", "const"),
        field("name", $.identifier),
        optional(field("type", $.type_hint)),
        optional(seq("=", field("value", $.expression))),
        ";",
      ),

    type_hint: ($) => seq("as", field("type", $.type)),

    type: ($) => prec.left(seq($.type_item, repeat(seq("or", $.type_item)))),

    type_item: ($) => choice($.nullable_type, $.type_primary),
    nullable_type: ($) => seq($.type_primary, "?"),

    type_primary: ($) =>
      choice(
        $.generic_type,
        $.type_name,
        $.bracket_type,
        $.dictionary_type,
        $.method_type,
      ),

    generic_type: ($) =>
      prec.right(seq($.type_name, "<", $.type, repeat(seq(",", $.type)), ">")),

    bracket_type: ($) =>
      seq("[", optional(seq($.type, repeat(seq(",", $.type)))), "]"),

    dictionary_type: ($) =>
      seq(
        "{",
        optional(
          seq(
            $.dictionary_type_entry,
            repeat(seq(",", $.dictionary_type_entry)),
            optional(","),
          ),
        ),
        "}",
      ),

    dictionary_type_entry: ($) => seq($.symbol_key, $.type_hint),

    method_type: ($) =>
      seq("(", "Method", $.formal_parameters, optional($.type_hint), ")"),

    if_statement: ($) =>
      seq(
        "if",
        "(",
        field("condition", $.expression),
        ")",
        field("consequence", $.block),
        optional(
          seq("else", field("alternative", choice($.if_statement, $.block))),
        ),
      ),

    for_statement: ($) =>
      seq(
        "for",
        "(",
        optional(
          field(
            "initializer",
            choice($.variable_declaration_no_semicolon, $.expression),
          ),
        ),
        ";",
        optional(field("condition", $.expression)),
        ";",
        optional(field("update", $.expression)),
        ")",
        field("body", $.block),
      ),

    variable_declaration_no_semicolon: ($) =>
      seq(
        choice("var", "const"),
        $.identifier,
        optional($.type_hint),
        optional(seq("=", $.expression)),
      ),

    while_statement: ($) =>
      seq(
        "while",
        "(",
        field("condition", $.expression),
        ")",
        field("body", $.block),
      ),
    do_while_statement: ($) =>
      seq(
        "do",
        field("body", $.block),
        "while",
        "(",
        field("condition", $.expression),
        ")",
        ";",
      ),

    switch_statement: ($) =>
      seq(
        "switch",
        "(",
        field("value", $.expression),
        ")",
        "{",
        repeat(field("case", $.switch_case)),
        optional(field("default", $.default_case)),
        "}",
      ),
    switch_case: ($) =>
      seq(
        "case",
        field("pattern", $.case_pattern),
        ":",
        repeat(field("body", $._statement)),
      ),
    case_pattern: ($) => choice($.expression, seq("instanceof", $.type)),
    default_case: ($) => seq("default", ":", repeat($._statement)),

    try_statement: ($) =>
      seq(
        "try",
        field("body", $.block),
        repeat1(
          seq(
            "catch",
            "(",
            field("exception", $.identifier),
            ")",
            field("handler", $.block),
          ),
        ),
        optional(seq("finally", field("finally", $.block))),
      ),

    return_statement: ($) =>
      seq("return", optional(field("value", $.expression)), ";"),
    throw_statement: ($) => seq("throw", field("value", $.expression), ";"),
    break_statement: ($) => seq("break", ";"),
    continue_statement: ($) => seq("continue", ";"),

    block: ($) => seq("{", repeat($._statement), "}"),

    expression_statement: ($) => seq($.expression, ";"),

    expression: ($) =>
      choice(
        $.assignment_expression,
        $.ternary_expression,
        $.binary_expression,
        $.unary_expression,
        $.new_expression,
        $.call_expression,
        $.member_expression,
        $.subscript_expression,
        $.cast_expression,
        $.instanceof_expression,
        $.array,
        $.dictionary,
        $.parenthesized_expression,
        $.symbol_literal,
        $.symbol_reference,
        $.me_literal,
        $.self_literal,
        $.nan_literal,
        $.identifier,
        $.number_literal,
        $.long_literal,
        $.double_literal,
        $.float_literal,
        $.string_literal,
        $.char_literal,
        $.boolean_literal,
        $.null_literal,
      ),

    parenthesized_expression: ($) => seq("(", $.expression, ")"),

    assignment_expression: ($) =>
      prec.right(
        1,
        seq(
          field(
            "left",
            choice($.identifier, $.member_expression, $.subscript_expression),
          ),
          choice(
            "=",
            "+=",
            "-=",
            "*=",
            "/=",
            "%=",
            "<<=",
            ">>=",
            "&=",
            "|=",
            "^=",
          ),
          field("right", $.expression),
        ),
      ),

    binary_expression: ($) =>
      choice(
        ...[
          ["||", 2],
          ["or", 2],
          ["&&", 3],
          ["and", 3],
          ["==", 4],
          ["!=", 4],
          ["<", 5],
          ["<=", 5],
          [">", 5],
          [">=", 5],
          ["<<", 5],
          [">>", 5],
          ["&", 5],
          ["|", 5],
          ["^", 5],
          ["has", 5],
          ["+", 6],
          ["-", 6],
          ["*", 7],
          ["/", 7],
          ["%", 7],
        ].map(([operator, precedence]) =>
          prec.left(
            precedence,
            seq(
              field("left", $.expression),
              field("operator", operator),
              field("right", $.expression),
            ),
          ),
        ),
      ),

    unary_expression: ($) =>
      choice(
        prec.right(8, seq(choice("!", "-", "+", "~"), $.expression)),
        prec.left(
          11,
          seq(
            choice($.identifier, $.member_expression, $.subscript_expression),
            choice("++", "--"),
          ),
        ),
        prec.right(
          11,
          seq(
            choice("++", "--"),
            choice($.identifier, $.member_expression, $.subscript_expression),
          ),
        ),
      ),

    ternary_expression: ($) =>
      prec.right(
        1,
        seq(
          field("condition", $.expression),
          "?",
          field("consequence", $.expression),
          ":",
          field("alternative", $.expression),
        ),
      ),

    call_expression: ($) =>
      prec(
        9,
        seq(
          field(
            "function",
            choice(
              $.identifier,
              $.member_expression,
              $.subscript_expression,
              $.symbol_reference,
            ),
          ),
          field("arguments", $.arguments),
        ),
      ),

    new_expression: ($) =>
      prec.right(
        8,
        seq(
          "new",
          field(
            "constructor",
            choice(
              $.identifier,
              $.member_expression,
              $.symbol_reference,
              $.type_name,
              $.array,
              $.dictionary,
            ),
          ),
          optional(field("arguments", $.arguments)),
        ),
      ),

    arguments: ($) =>
      seq(
        "(",
        optional(
          seq($.expression, repeat(seq(",", $.expression)), optional(",")),
        ),
        ")",
      ),

    member_expression: ($) =>
      prec.left(
        10,
        seq(
          field(
            "object",
            choice(
              $.identifier,
              $.symbol_reference,
              $.call_expression,
              $.subscript_expression,
              $.parenthesized_expression,
              $.member_expression,
            ),
          ),
          ".",
          field("property", $.identifier),
        ),
      ),

    subscript_expression: ($) =>
      prec.left(
        10,
        seq(
          field(
            "object",
            choice(
              $.identifier,
              $.symbol_reference,
              $.call_expression,
              $.member_expression,
              $.subscript_expression,
              $.parenthesized_expression,
            ),
          ),
          "[",
          field("index", $.expression),
          "]",
        ),
      ),

    cast_expression: ($) =>
      prec.right(
        8,
        seq(field("value", $.expression), field("type", $.type_hint)),
      ),

    instanceof_expression: ($) =>
      prec.left(
        5,
        seq(field("left", $.expression), "instanceof", field("right", $.type)),
      ),

    array: ($) =>
      seq(
        "[",
        optional(
          seq($.expression, repeat(seq(",", $.expression)), optional(",")),
        ),
        "]",
      ),

    dictionary: ($) =>
      seq(
        "{",
        optional(
          seq(
            $.dictionary_entry,
            repeat(seq(",", $.dictionary_entry)),
            optional(","),
          ),
        ),
        "}",
      ),

    dictionary_entry: ($) =>
      seq(field("key", $.expression), "=>", field("value", $.expression)),

    type_name: ($) => choice($.identifier, $.qualified_identifier),
    qualified_identifier: ($) =>
      seq($.identifier, repeat1(seq(".", $.identifier))),
    symbol_reference: ($) => seq("$", ".", $.identifier),
    symbol_literal: ($) => seq(":", $.identifier),
    symbol_key: ($) => seq(":", $.identifier),
    me_literal: ($) => "me",
    self_literal: ($) => "self",
    nan_literal: ($) => "NaN",

    identifier: ($) => /[A-Za-z_][A-Za-z0-9_]*/,

    number_literal: ($) => token(/\d+/),
    long_literal: ($) => token(/\d+[lL]/),
    double_literal: ($) => token(/\d+\.\d+[dD]/),
    float_literal: ($) => token(/\d+\.\d+/),

    string_literal: ($) =>
      token(seq('"', repeat(choice(/[^"\\\n]/, /\\./)), '"')),
    char_literal: ($) => token(seq("'", choice(/[^'\\\n]/, /\\./), "'")),

    boolean_literal: ($) => choice("true", "false"),
    null_literal: ($) => "null",

    comment: ($) =>
      token(
        choice(seq("//", /[^\n]*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
      ),

    doc_comment: ($) => token(seq("//!", /[^\n]*/)),
  },
});
