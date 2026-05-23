# 1. Ambito

Esta analise white-box cobre a decisao do motor de automacao em `decideRuleAction` e a validacao temporal de `isRecentMeasurement`.

O fluxo combina modo manual/automatico, regra ativa e medicao recente. Nao existem `while`, `for` ou `switch` nas funcoes analisadas.

# 2. Identificacao das decisoes

| ID | Funcao | Expressao original | Condicoes atomicas | Ramo TRUE | Ramo FALSE |
|:--|:--|:--|:--|:--|:--|
| D1 | `isRecentMeasurement` | `!measurement \|\| !measurement.measuredAt` | C1 = `!measurement`; C2 = `!measurement.measuredAt` | retorna `false` | valida data |
| D2 | `isRecentMeasurement` | `Number.isNaN(measuredAt.getTime())` | C1 = expressao completa | retorna `false` | calcula idade |
| D3 | `isRecentMeasurement` | `ageMilliseconds >= 0 && ageMilliseconds <= maxAgeMinutes * 60 * 1000` | C1 = `ageMilliseconds >= 0`; C2 = `ageMilliseconds <= maxAgeMinutes * 60 * 1000` | medicao recente | medicao nao recente |
| D4 | `decideRuleAction` | `rule && rule.enabled` | C1 = `rule`; C2 = `rule.enabled` | regra ativa | regra inativa |
| D5 | `decideRuleAction` | `!ruleActive \|\| !recentMeasurement` | C1 = `!ruleActive`; C2 = `!recentMeasurement` | retorna `skip` | decide executar/sugerir |
| D6 | `decideRuleAction` | `automaticMode ? 'execute' : 'suggest'` | C1 = `automaticMode` | retorna `execute` | retorna `suggest` |

# 3. MCC / MC/DC

## D1 - Existencia de medicao

Expressao: `!measurement || !measurement.measuredAt`.

| C1 | C2 | Resultado | Teste |
|:--|:--|:--|:--|
| T | N/A | T | TW-42 |
| F | T | T | TW-43 |
| F | F | F | TW-36 |

| Condicao | Par MC/DC | Evidencia |
|:--|:--|:--|
| C1 | TW-42 / TW-36 | existencia da medicao altera o resultado |
| C2 | TW-43 / TW-36 | com medicao existente, `measuredAt` altera o resultado |

## D3 - Recencia temporal

Expressao: `ageMilliseconds >= 0 && ageMilliseconds <= maxAgeMinutes * 60 * 1000`.

| C1 | C2 | Resultado | Teste |
|:--|:--|:--|:--|
| T | T | T | TW-36 |
| T | F | F | TW-40 |
| F | T | F | TW-41 |
| F | F | F | N/A |

| Condicao | Par MC/DC | Evidencia |
|:--|:--|:--|
| C1 | TW-36 / TW-41 | medicao futura altera o resultado |
| C2 | TW-36 / TW-40 | medicao antiga altera o resultado |

## D4 - Regra ativa

Expressao: `rule && rule.enabled`.

| C1 | C2 | Resultado | Teste |
|:--|:--|:--|:--|
| F | N/A | falsy | TW-39 |
| T | F | false | TW-38 |
| T | T | true | TW-36 |

| Condicao | Par MC/DC | Evidencia |
|:--|:--|:--|
| C1 | TW-39 / TW-36 | existencia da regra altera o resultado |
| C2 | TW-38 / TW-36 | com regra existente, `enabled` altera o resultado |

## D5 - Skip por regra/medicao

Expressao: `!ruleActive || !recentMeasurement`.

| C1 | C2 | Resultado | Teste |
|:--|:--|:--|:--|
| T | F | T | TW-38 |
| F | T | T | TW-40 |
| F | F | F | TW-36 |

| Condicao | Par MC/DC | Evidencia |
|:--|:--|:--|
| C1 | TW-36 / TW-38 | regra inativa altera a decisao para `skip` |
| C2 | TW-36 / TW-40 | medicao antiga altera a decisao para `skip` |

## D6 - Execucao ou sugestao

Expressao: `automaticMode ? 'execute' : 'suggest'`.

| C1 | Resultado | Teste |
|:--|:--|:--|
| T | `execute` | TW-36 |
| F | `suggest` | TW-37 |

# 4. Mapeamento dos testes TW

| Teste | Objetivo | Decisoes cobertas | Ramos cobertos | Resultado esperado |
|:--|:--|:--|:--|:--|
| TW-36 | Automatico, regra ativa, medicao recente | D1, D3, D4, D5, D6 | caminhos TRUE validos; D5 F; D6 T | `execute` |
| TW-37 | Manual, regra ativa, medicao recente | D5, D6 | D5 F; D6 F | `suggest` |
| TW-38 | Regra inativa | D4, D5 | D4 F; D5 T | `skip` |
| TW-39 | Regra ausente | D4, D5 | D4 F; D5 T | `skip` |
| TW-40 | Medicao antiga | D3, D5 | D3 F; D5 T | `skip` |
| TW-41 | Medicao futura | D3, D5 | D3 F; D5 T | `skip` |
| TW-42 | Medicao ausente | D1, D5 | D1 T; D5 T | `skip` |
| TW-43 | `measuredAt` ausente | D1, D5 | D1 T; D5 T | `skip` |
| TW-44 | `measuredAt` invalido | D2, D5 | D2 T; D5 T | `skip` |
| TW-45 | Modo omitido usa repositorio | D5, D6 | D5 F; D6 T | `execute` |

# 5. Matriz formal Sprint 5

| ID | Funcao | Decisao | Condicoes | Ramo | Tecnica | Resultado esperado |
|:--|:--|:--|:--|:--|:--|:--|
| TW-36 | `decideRuleAction` | D1, D3, D4, D5, D6 | automatico, ativa, recente | TRUE/FALSE base | MCC / MC/DC | `execute` |
| TW-37 | `decideRuleAction` | D6 | manual | FALSE | Branch / MC/DC | `suggest` |
| TW-38 | `decideRuleAction` | D4, D5 | regra inativa | FALSE/TRUE | MCC / MC/DC | `skip` |
| TW-39 | `decideRuleAction` | D4, D5 | regra ausente | FALSE/TRUE | MCC / MC/DC | `skip` |
| TW-40 | `isRecentMeasurement` | D3, D5 | medicao antiga | FALSE/TRUE | MCC / MC/DC | `skip` |
| TW-41 | `isRecentMeasurement` | D3, D5 | medicao futura | FALSE/TRUE | MCC / MC/DC | `skip` |
| TW-42 | `isRecentMeasurement` | D1, D5 | medicao ausente | TRUE | MCC / MC/DC | `skip` |
| TW-43 | `isRecentMeasurement` | D1, D5 | `measuredAt` ausente | TRUE | MCC / MC/DC | `skip` |
| TW-44 | `isRecentMeasurement` | D2, D5 | data invalida | TRUE | Branch | `skip` |
| TW-45 | `decideRuleAction` | D5, D6 | modo default do repositorio | FALSE/TRUE | Branch | `execute` |

# 6. Resumo de cobertura

| Decision | TRUE covered by | FALSE covered by |
|:--|:--|:--|
| D1 | TW-42, TW-43 | TW-36 |
| D2 | TW-44 | TW-36 |
| D3 | TW-36 | TW-40, TW-41 |
| D4 | TW-36 | TW-38, TW-39 |
| D5 | TW-38, TW-39, TW-40, TW-42 | TW-36, TW-37, TW-45 |
| D6 | TW-36, TW-45 | TW-37 |

Todas as decisoes D1-D6 possuem cobertura TRUE/FALSE. As decisoes compostas D1, D3, D4 e D5 possuem evidencia MCC/MC/DC; D6 cobre a escolha ternaria entre `execute` e `suggest`.
