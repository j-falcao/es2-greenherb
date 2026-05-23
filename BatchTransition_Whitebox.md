# 1. Ambito

Esta analise white-box cobre a transicao de estado de lote executada por `updateBatchStatus` e a validacao privada `assertBatchTransition`.

O fluxo depende do estado atual, do proximo estado, da existencia de perdas registadas e da data real de conclusao. Nao existem `while`, `for` ou `switch` neste trecho.

# 2. Identificacao das decisoes

| ID | Funcao | Expressao original | Condicoes atomicas | Ramo TRUE | Ramo FALSE |
|:--|:--|:--|:--|:--|:--|
| D1 | `assertBatchTransition` | `batch.status === nextStatus` | C1 = expressao completa | retorna sem erro | continua validacao |
| D2 | `assertBatchTransition` | `batch.status === 'concluido'` | C1 = expressao completa | lanca erro 400 | continua validacao |
| D3 | `assertBatchTransition` | `nextStatus === 'comprometido' && batch.losses.length === 0` | C1 = `nextStatus === 'comprometido'`; C2 = `batch.losses.length === 0` | lanca erro 400 | continua validacao |
| D4 | `assertBatchTransition` | `nextStatus === 'concluido' && !actualEndDate` | C1 = `nextStatus === 'concluido'`; C2 = `!actualEndDate` | lanca erro 400 | continua validacao |
| D5 | `assertBatchTransition` | `!allowedTransitions[batch.status] \|\| !allowedTransitions[batch.status].includes(nextStatus)` | C1 = `!allowedTransitions[batch.status]`; C2 = `!allowedTransitions[batch.status].includes(nextStatus)` | lanca erro 400 | aceita transicao |
| D6 | `updateBatchStatus` | `nextStatus === 'concluido' ? requireDate(actualEndDate, 'actualEndDate') : null` | C1 = `nextStatus === 'concluido'` | valida `actualEndDate` | usa `null` |
| D7 | `updateBatchStatus` | `normalizedActualEndDate \|\| batch.actualEndDate` | C1 = `normalizedActualEndDate` | persiste data normalizada | preserva data existente/null |

# 3. MCC / MC/DC

## D3 - Comprometimento exige perdas

Expressao: `nextStatus === 'comprometido' && batch.losses.length === 0`.

| C1 | C2 | Resultado | Teste |
|:--|:--|:--|:--|
| T | T | T | TW-30 |
| T | F | F | TW-31 |
| F | T | F | TW-33 |
| F | F | F | N/A |

| Condicao | Par MC/DC | Evidencia |
|:--|:--|:--|
| C1 | TW-30 / TW-33 | alterar proximo estado altera a decisao |
| C2 | TW-30 / TW-31 | com C1 verdadeiro, perdas registadas alteram a decisao |

## D4 - Conclusao exige data real

Expressao: `nextStatus === 'concluido' && !actualEndDate`.

| C1 | C2 | Resultado | Teste | Nota |
|:--|:--|:--|:--|:--|
| T | T | T | N/A | bloqueado por `requireDate` em `updateBatchStatus` antes de `assertBatchTransition` |
| T | F | F | TW-33, TW-34 | conclusao com data valida |
| F | T | F | TW-28, TW-31 | transicao nao concluida |
| F | F | F | N/A | sem relevancia no fluxo publico |

MC/DC estrito para o ramo TRUE de D4 nao e atingivel via API publica, porque `updateBatchStatus` executa `requireDate(actualEndDate, 'actualEndDate')` quando `nextStatus === 'concluido'`. O teste TW-32 documenta esse bloqueio de validacao publica.

## D5 - Transicao permitida

Expressao: `!allowedTransitions[batch.status] || !allowedTransitions[batch.status].includes(nextStatus)`.

| C1 | C2 | Resultado | Teste | Nota |
|:--|:--|:--|:--|:--|
| T | N/A | T | N/A | estados publicos sao limitados por `BATCH_STATUSES` |
| F | T | T | TW-35 | `comprometido -> ativo` nao permitido |
| F | F | F | TW-33, TW-34 | transicao permitida |

MC/DC operacional cobre C2 por TW-35/TW-34. C1 e inviavel atraves da API publica porque `status` e normalizado por `requireOneOf`.

# 4. Mapeamento dos testes TW

| Teste | Objetivo | Decisoes cobertas | Ramos cobertos | Resultado esperado |
|:--|:--|:--|:--|:--|
| TW-28 | Atualizar para o mesmo estado | D1, D6, D7 | D1 T; D6 F; D7 F | lote permanece `ativo` |
| TW-29 | Bloquear transicao apos conclusao | D2 | TRUE | erro 400 |
| TW-30 | Bloquear comprometido sem perdas | D3 | TRUE | erro 400 |
| TW-31 | Permitir comprometido com perdas | D3, D6, D7 | D3 F; D6 F; D7 F | estado `comprometido` |
| TW-32 | Bloquear conclusao sem data pela API publica | D6 | TRUE com erro em `requireDate` | erro 400 |
| TW-33 | Permitir ativo para concluido | D3, D4, D5, D6, D7 | D3 F; D4 F; D5 F; D6 T; D7 T | estado `concluido` |
| TW-34 | Permitir comprometido para concluido | D4, D5, D6, D7 | D4 F; D5 F; D6 T; D7 T | estado `concluido` |
| TW-35 | Bloquear comprometido para ativo | D5 | TRUE | erro 400 |

# 5. Matriz formal Sprint 5

| ID | Funcao | Decisao | Condicoes | Ramo | Tecnica | Resultado esperado |
|:--|:--|:--|:--|:--|:--|:--|
| TW-28 | `updateBatchStatus` | D1, D6, D7 | mesmo estado | TRUE/FALSE | Branch | sucesso |
| TW-29 | `assertBatchTransition` | D2 | estado atual concluido | TRUE | Branch | erro 400 |
| TW-30 | `assertBatchTransition` | D3 | comprometido sem perdas | TRUE | MCC / MC/DC | erro 400 |
| TW-31 | `assertBatchTransition` | D3 | comprometido com perdas | FALSE | MCC / MC/DC | sucesso |
| TW-32 | `updateBatchStatus` | D6, D4 | conclusao sem data | bloqueio publico | Branch | erro 400 |
| TW-33 | `updateBatchStatus` | D3-D7 | ativo para concluido | FALSE/TRUE | Branch / MC/DC | sucesso |
| TW-34 | `updateBatchStatus` | D4-D7 | comprometido para concluido | FALSE/TRUE | Branch / MC/DC | sucesso |
| TW-35 | `assertBatchTransition` | D5 | transicao nao permitida | TRUE | MCC / MC/DC | erro 400 |

# 6. Resumo de cobertura

| Decision | TRUE covered by | FALSE covered by |
|:--|:--|:--|
| D1 | TW-28 | TW-29, TW-30, TW-33 |
| D2 | TW-29 | TW-30, TW-31, TW-33 |
| D3 | TW-30 | TW-31, TW-33 |
| D4 | N/A via API publica; bloqueado por TW-32 | TW-33, TW-34 |
| D5 | TW-35 | TW-33, TW-34 |
| D6 | TW-32, TW-33, TW-34 | TW-28, TW-31 |
| D7 | TW-33, TW-34 | TW-28, TW-31 |

As decisoes atingiveis pela API publica possuem cobertura TRUE/FALSE. D4 TRUE e D5.C1 sao documentadas como inviaveis atraves da API publica devido a validacao previa em `updateBatchStatus`.
