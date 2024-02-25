module.exports = grammar({
  name: 'gwion',

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.class_definition,
      $.structure_definition,
      $.function_definition,
      $.funptr_definition,
      $.trait_definition,
      $.union_definition,
      $.enum_definition,
      $.typedef_definition,
      $.primitive_definition,
      $.extend_definition,
      $.statement_list
      // TODO: other kinds of definitions
    ),

    class_definition: $ => seq(
      'class',
      field('name', $.identifier),
      field('template_definition', optional($.template_definition)),
      seq('{',
      repeat($._definition),
      '}')
    ),

    structure_definition: $ => seq(
      'struct',
      field('name', $.identifier),
      seq('{',
      repeat($._definition),
      '}')
    ),

    function_definition: $ => seq(
      'fun',
      field('return_type', $.type),
      field('name', $.identifier),
      optional($.template_definition),
      $.parameter_list,
      seq('{',
      optional($.statement_list),
      '}')
    ),

    funptr_definition: $ => seq(
      'funptr',
       field('return_type', $.type),
      field('name', $.identifier),
      optional($.template_definition),
      ';'
    ),

    typedef_definition: $ => seq(
      choice('typedef', 'distinct'),
      optional($.flag),
      $.type,
      field('name', $.identifier),
      optional($.template_definition),
      optional($.when),
      ';'
    ),
     
    enum_definition: $ => seq(
      'enum',
       optional($.flag),
      field('name', $.identifier),
      '{',
      commasep1(field('value', $.identifier)),
      optional(','),
      '}'
    ),    

    union_definition: $ => seq(
      'union',
      optional($.flag),
      field('name', $.identifier),
      '{',
       repeat1(seq($.type, field('value', $.identifier), ';')),
      '}'

    ),

    primitive_definition: $ => seq(
      'primitive',
      optional($.flag),
      field('name', $.identifier),
      $.number,
      ';'
    ),

    locale_definition: $ => seq(
      'locale',
      optional('global'),
      field('name', $.identifier),
      $.parameter_list,
      '{',
      repeat($.statement),
      '}',
    ),

    trait_definition: $ => seq(
      'trait',
      optional('global'),
      field('name', $.identifier),
      // TODO: traits
      '{',
      repeat($._definition),
      '}',
    ),

    extend_definition: $ => seq(
      'extends',
      $.type,
      ':',
      commasep1($.identifier),
      ';'
    ),

    comment_statement: $ => seq('#!', /(\\+(.|\r?\n)|[^\\\n])*/),

    // todo
    foreach_statement: $ => seq('foreach',
      '(',
      optional(seq(field('index', $.identifier), ',')),
      field('name', $.identifier),
      ':',
      $._expression,
      ')',
      $.statement
    ),

    import_statement: $ => seq('#import', $.identifier, /\n/),
    ifdef_statement: $ => seq('#ifdef', $.identifier, /\n/),
    ifndef_statement: $ => seq('#ifndef', $.identifier, /\n/),
    undef_statement: $ => seq('#undef', $.identifier, /\n/),
    else_statement: $ => seq('#else'),
    endif_statement: $ => seq('#endif'),
    define_statement: $ => seq('#define',/(\\+(.|\r?\n)|[^\\\n])*/, /\n/),

    // shall we define path instead of regex? 
    include_statement: $ => seq('#include', '<', /\.\/[a-zA-Z0-9\-]/  , '>', /\n/),
    

    // todo
    for_statement: $ => seq('for'),

    // todo
    loop_statement: $ => seq(
      choice('while', 'until')
    ),

    // todo
    doloop_statement: $ => seq(
      'do',
    ),


   xork_statement: $ => seq(
      choice('spork', 'fork')
   ),

    when: $ => seq('when', $._expression),

    parameter_list: $ => seq(
      '(',
       commasep(repeat($.parameter)),
       // todo: defaults
      ')'
    ),

    parameter: $ => seq(
      optional($.flag),
      $.type,
      field('name', $.identifier),
    ),

    type: $ => seq(
      optional(choice('late', 'const')),
      repeat('&'),
      field('name', $.identifier),
      optional($.template_definition),
      optional($.td_array),
      optional('?'),
      // todo: refs
    ),

    td_array: $ => repeat1(seq(
      '[',
optional($._expression),
      ']'
    )),

    litteral_array: $ => repeat1(seq(
      '[',
         dotsep($._expression),
      ']'
    )),

expressions: $ => dotsep1($._expression),

    statement_list: $ => prec.right(repeat1($.statement)),

    statement: $ => choice(
      $._expression_statement,
      $.foreach_statement,
      $.for_statement,
      $.xork_statement,
      $.loop_statement,
      $.comment_statement,
      // todo: other kinds of statements
    ),


    _expression_statement: $ => seq(
      $._expression,
      ';'
    ),

    _expression: $ => choice(
      $.identifier,
      $.number,
      $.decl_expression,
      $.dot_expression,
      $.prefix_expression,
      $.postfix_expression,
      $.gack_expression,
      $.new_expression

      // todo: other kinds of expressions
    ),

    decl_expression:   $ => seq(
      "var",
      $.type,
      field('name', $.identifier)
    ),

    prefix_expression: $ => prec(4, seq(
      prec.left($.operator),
      $._expression
    )),

    postfix_expression: $ => prec(5, seq(
      $._expression,
      $.operator,
    )),

    dot_expression: $ => prec(85, seq(
      prec.left(15, repeat1(seq($.identifier, '.'))),
      prec.left(10, $.identifier)
    )),

    gack_expression: $ => seq(
       '<<<',
       commasep1($._expression),
       '>>>'
    ),

    new_expression: $ => seq(
      'new',
      $.type
    ),
    // todo vararg
    template_definition: $ => seq(
      ':[',
       commasep1(
         choice(
           $.type,
           seq('const', $.type, $.identifier))),
       ']'
    ),

    storage_flag: $ => choice('static', 'global'),
    access_flag:  $ => choice('private', 'protect'),
    flag:    $ => choice(
      $.storage_flag,
      $.access_flag,
      seq($.storage_flag, $.access_flag)
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z_0-9]*/,

    number: $ => /\d+/,

    operator: $ => /[\?:\$@\+\-\*/%~<>\^|&\!=]{3,}/
  }
});


/**
 * creates a rule to optionally match one or more of the rules separated by a comma
 *
 * @param {rule} rule
 *
 * @return {choicerule}
 *
 */
function commasep(rule) {
  return optional(commasep1(rule));
}

/**
 * creates a rule to match one or more of the rules separated by a comma
 *
 * @param {rule} rule
 *
 * @return {seqrule}
 *
 */
function commasep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
/**
 * creates a rule to optionally match one or more of the rules separated by a comma
 *
 * @param {rule} rule
 *
 * @return {choicerule}
 *
 */
function dotsep(rule) {
  return optional(dotsep1(rule));
}

/**
 * creates a rule to match one or more of the rules separated by a comma
 *
 * @param {rule} rule
 *
 * @return {seqrule}
 *
 */
function dotsep1(rule) {
  return seq(rule, repeat(seq('.', rule)));
}
