; highlights.scm
(class_definition name: (identifier) @type)
(function_definition name: (identifier) @function)
(funptr_definition name: (identifier) @type.builtin)
(union_definition name: (identifier) @type.builtin)
; todo: union value
(enum_definition name: (identifier) @type.builtin)
(enum_definition value: (identifier) @constant)

(import_statement name: (identifier) @constant)
(ifdef_statement name: (identifier) @constant)
(ifndef_statement name: (identifier) @constant)
(undef_statement name: (identifier) @constant)
(include_statement name: (include_path) @string)

[
  "fun"
  "class"
  "struct"
  "funptr"
  "locale"
  "trait"
  "primitive"
  "typedef"
  "distinct"
  "union"
  "enum"
  "new"
  "operator"
  "extends"
    
  "match"
  "case"
  
  "var"
  "const"
  "late"

  "static"
  "global"

  "private"
  "protect"

  "when"
  "foreach"
  "repeat"
  "for"
  "do"
  "while"
  "until"

  "return"
  "spork"
  "fork"

  "if"
  "else"
  ] @keyword

[
  "#import"
  "#include"
  "#define"
  "#undef"
  "#ifdef"
  "#ifndef"
  "#else"
  "#endif"
] @keyword

[
  "{"
  "}"
  ";"
  ","
  ":["
  "["
  "]"
] @punctuation.delimiter

(operator) @operator
(flag) @keyword
(number) @number
(identifier) @identifier
(type) @type
(line_comment) @comment
(block_comment) @comment

;(function_definition return_type: (type) name: (identifier) (template_definition) (parameter_list) @function)
;(function_definition name: (identifier) @type)
