; highlights.scm
(class_definition name: (identifier) @type.builtin)
(function_definition name: (identifier) @function.builtin)
(funptr_definition name: (identifier) @type.builtin)
(union_definition name: (identifier) @type.builtin)
; todo: union value
(enum_definition name: (identifier) @type.builtin)
(enum_definition value: (identifier) @constant)

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
;  "operator"
  "extends"
    

  "var"
  "const"
;  "late"

  "static"
  "global"

  "private"
  "protect"

  "when"
  "foreach"
  "for"
  "do"
  "while"
  "until"

  "spork"
  "fork"
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

(number) @number
(identifier) @identifier
(type) @type
(comment_statement) @comment

;(function_definition return_type: (type) name: (identifier) (template_definition) (parameter_list) @function)
;(function_definition name: (identifier) @type)
