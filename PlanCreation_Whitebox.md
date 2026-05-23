# 1. Ambito

Esta analise white-box cobre exclusivamente a funcionalidade de criacao de planos e os helpers diretamente executados por `createPlan`: `isValidDateString`, `addDays`, `validatePlanType`, `validateInterval`, `normalizeEnvironmentLimits`, `validatePontualAuthorization`, `requireNumber`, `requireNumberInRange` e `requireIntegerInRange`.

`addDays` e coberto por statement/result coverage, mas nao possui decisao logica propria. No fluxo analisado nao existem estruturas `while`, `for` ou `switch`. Tambem nao existe `else` sintatico; os ramos FALSE correspondem ao caminho de continuacao apos `if`, aos ramos alternativos de ternarios e ao resultado falso de operadores logicos.

# 2. Identificacao das decisoes

| ID | Funcao | Expressao original | Condicoes atomicas | Ramo TRUE | Ramo FALSE |
|:--|:--|:--|:--|:--|:--|
| D1 | `isValidDateString` | `typeof value !== 'string' \|\| !/^\d{4}-\d{2}-\d{2}$/.test(value)` | C1 = `typeof value !== 'string'`; C2 = `!/^\d{4}-\d{2}-\d{2}$/.test(value)` | retorna `false` por tipo/formato invalido | continua para construir `Date` |
| D2 | `isValidDateString` | `!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value` | C1 = `!Number.isNaN(date.getTime())`; C2 = `date.toISOString().slice(0, 10) === value` | retorna `true` para data valida | retorna `false` para data invalida/impossivel |
| D3 | `validatePlanType` | `!PLAN_TYPES.includes(type)` | C1 = `!PLAN_TYPES.includes(type)` | lanca erro 400 | aceita tipo de plano |
| D4 | `validateInterval` | `min > max` | C1 = `min > max` | lanca erro 400 | retorna `{ min, max }` |
| D5 | `validatePontualAuthorization` | `type !== 'pontual'` | C1 = `type !== 'pontual'` | retorna `null` antecipadamente | exige autorizacao pontual |
| D6 | `validatePontualAuthorization` | `technicalResponsibleAuthorization !== true` | C1 = `technicalResponsibleAuthorization !== true` | lanca erro 403 | cria autorizacao |
| D7 | `validatePontualAuthorization` | `user.id ? String(user.id) : null` | C1 = `user.id` | `authorizedBy = String(user.id)` | `authorizedBy = null` |
| D8 | `createPlan` | `!herb` | C1 = `!herb` | lanca erro 404 | continua validacao |
| D9 | `createPlan` | `!isValidDateString(startDate)` | C1 = `!isValidDateString(startDate)` | lanca erro 400 | continua fluxo |
| D10 | `createPlan` | `cycleDurationDays === undefined ? herb.harvestDays : cycleDurationDays` | C1 = `cycleDurationDays === undefined` | usa `herb.harvestDays` | usa valor explicito |
| D11 | `createPlan` | `notes \|\| null` | C1 = `notes` | persiste `notes` | persiste `null` |
| D12 | `createPlan` | `user && user.id ? user.id : userId` | C1 = `user`; C2 = `user.id` | auditoria usa `user.id` | auditoria usa `userId` |
| D13 | `createPlan` | `user && user.username` | C1 = `user`; C2 = `user.username` | propaga `username` | resultado falsy, normalizado para `null` |
| D14 | `requireNumber` | `!Number.isFinite(number)` | C1 = `!Number.isFinite(number)` | lanca erro 400 | retorna numero |
| D15 | `requireNumberInRange` | `number < min \|\| number > max` | C1 = `number < min`; C2 = `number > max` | lanca erro 400 | retorna numero no intervalo |
| D16 | `requireIntegerInRange` | `!Number.isInteger(number)` | C1 = `!Number.isInteger(number)` | lanca erro 400 | retorna inteiro |

# 3. MCC / MC/DC

## D1 - Tipo/formato de data

Expressao: `typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)`.

| C1 | C2 | Resultado | Teste | Nota |
|:--|:--|:--|:--|:--|
| T | T | T | N/A | combinacao logica; C2 nao e avaliada por curto-circuito |
| T | F | T | TW-03 | entrada `null`; C2 nao e avaliada |
| F | T | T | TW-04 | string com formato invalido |
| F | F | F | TW-01 | string no formato `YYYY-MM-DD` |

| Condicao | Par MC/DC | Evidencia |
|:--|:--|:--|
| C1 | TW-01 / TW-03 | `F,F -> F` contra `T,F -> T` |
| C2 | TW-01 / TW-04 | `F,F -> F` contra `F,T -> T` |

## D2 - Validade semantica da data

Expressao: `!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value`.

| C1 | C2 | Resultado | Teste | Nota |
|:--|:--|:--|:--|:--|
| T | T | T | TW-01 | data valida |
| T | F | F | TW-05 | data com rollover (`2026-02-30`) |
| F | T | F | N/A | inviavel: com `Date` invalido, C2 nao e avaliada |
| F | F | F | TW-06 | `Date` invalido (`2026-13-01`); C2 nao e avaliada |

| Condicao | Par MC/DC | Evidencia |
|:--|:--|:--|
| C1 | TW-01 / TW-06 | `T,T -> T` contra `F,F -> F`, respeitando curto-circuito |
| C2 | TW-01 / TW-05 | `T,T -> T` contra `T,F -> F` |

## D12 - Utilizador de auditoria

Expressao: `user && user.id ? user.id : userId`.

| C1 `user` | C2 `user.id` | Resultado | Teste |
|:--|:--|:--|:--|
| F | N/A | usa `userId` | TW-01 |
| T | F | usa `userId` | TW-11 |
| T | T | usa `user.id` | TW-08 |

| Condicao | Par MC/DC | Evidencia |
|:--|:--|:--|
| C1 | TW-01 / TW-08 | a existencia de `user` permite alterar o resultado para `user.id` |
| C2 | TW-11 / TW-08 | com C1 verdadeiro, `user.id` altera o resultado |

## D13 - Username de auditoria

Expressao: `user && user.username`.

| C1 `user` | C2 `user.username` | Resultado | Teste |
|:--|:--|:--|:--|
| F | N/A | falsy, normalizado para `null` | TW-01 |
| T | F | falsy, normalizado para `null` | TW-11 |
| T | T | username propagado | TW-08 |

| Condicao | Par MC/DC | Evidencia |
|:--|:--|:--|
| C1 | TW-01 / TW-08 | `user` altera o resultado de falsy para username |
| C2 | TW-11 / TW-08 | com C1 verdadeiro, `user.username` altera o resultado |

## D15 - Intervalo numerico

Expressao: `number < min || number > max`.

| C1 | C2 | Resultado | Teste | Nota |
|:--|:--|:--|:--|:--|
| T | T | T | N/A | inviavel para limites coerentes |
| T | F | T | TW-12, TW-18 | valor abaixo do minimo |
| F | T | T | TW-13, TW-19 | valor acima do maximo |
| F | F | F | TW-14, TW-01 | valor dentro do intervalo |

| Condicao | Par MC/DC | Evidencia |
|:--|:--|:--|
| C1 | TW-14 / TW-12 | `F,F -> F` contra `T,F -> T` |
| C2 | TW-14 / TW-13 | `F,F -> F` contra `F,T -> T` |

# 4. Mapeamento dos testes TW

| Teste | Objetivo | Decisoes cobertas | Ramos cobertos | Resultado esperado |
|:--|:--|:--|:--|:--|
| TW-01 | Criar plano regular com defaults | D1, D2, D3, D4, D5, D8-D16 | D1 F; D2 T; D3 F; D4 F; D5 T; D8 F; D9 F; D10 T; D11 F; D12 F; D13 F; D14 F; D15 F; D16 F | plano criado com limites default e auditoria sem username |
| TW-02 | Rejeitar erva inexistente | D8 | TRUE | erro 404 |
| TW-03 | Rejeitar `startDate` nao string | D1, D9 | D1 TRUE; D9 TRUE | erro 400 |
| TW-04 | Rejeitar formato de data invalido | D1, D9 | D1 TRUE; D9 TRUE | erro 400 |
| TW-05 | Rejeitar data com rollover | D2, D9 | D2 FALSE; D9 TRUE | erro 400 |
| TW-06 | Rejeitar `Date` invalido | D2, D9 | D2 FALSE; D9 TRUE | erro 400 |
| TW-07 | Rejeitar tipo invalido | D3 | TRUE | erro 400 |
| TW-08 | Cobrir ciclo explicito, notas e user de auditoria | D10, D11, D12, D13 | D10 F; D11 T; D12 T; D13 T | plano criado; auditoria usa `user.id` e `username` |
| TW-09 | Criar plano pontual autorizado | D5, D6, D7 | D5 F; D6 F; D7 T | plano pontual com `authorizedBy` |
| TW-10 | Rejeitar pontual sem autorizacao | D5, D6 | D5 F; D6 T | erro 403 |
| TW-11 | Cobrir user id e username falsy | D7, D12, D13 | D7 F; D12 F; D13 F | plano criado; `authorizedBy: null`; auditoria usa fallback |
| TW-12 | Rejeitar limite abaixo do minimo | D14, D15 | D14 F; D15 TRUE | erro 400 |
| TW-13 | Rejeitar limite acima do maximo | D14, D15 | D14 F; D15 TRUE | erro 400 |
| TW-14 | Aceitar limite ambiental nos extremos | D4, D14, D15 | D4 F; D14 F; D15 F | plano criado |
| TW-15 | Rejeitar intervalo invertido | D4 | TRUE | erro 400 |
| TW-16 | Rejeitar valor ambiental nao numerico | D14 | TRUE | erro 400 |
| TW-17 | Rejeitar ciclo nao inteiro | D16 | TRUE | erro 400 |
| TW-18 | Rejeitar ciclo abaixo do minimo | D15 | TRUE | erro 400 |
| TW-19 | Rejeitar ciclo acima do maximo | D15 | TRUE | erro 400 |

# 5. Matriz formal Sprint 5

| ID | Funcao | Decisao | Condicoes | Ramo | Tecnica | Resultado esperado |
|:--|:--|:--|:--|:--|:--|:--|
| TW-01 | `createPlan` / helpers | D1, D2, D3, D4, D5, D8-D16 | entrada regular valida | TRUE/FALSE base conforme mapeamento | Statement / Branch / MC/DC base | plano criado |
| TW-02 | `createPlan` | D8 | `!herb` | TRUE | Branch | erro 404 |
| TW-03 | `isValidDateString`, `createPlan` | D1, D9 | D1.C1 TRUE | TRUE | MCC / MC/DC | erro 400 |
| TW-04 | `isValidDateString`, `createPlan` | D1, D9 | D1.C1 FALSE; D1.C2 TRUE | TRUE | MCC / MC/DC | erro 400 |
| TW-05 | `isValidDateString`, `createPlan` | D2, D9 | D2.C1 TRUE; D2.C2 FALSE | FALSE | MCC / MC/DC | erro 400 |
| TW-06 | `isValidDateString`, `createPlan` | D2, D9 | D2.C1 FALSE | FALSE | MCC / MC/DC | erro 400 |
| TW-07 | `validatePlanType` | D3 | D3.C1 TRUE | TRUE | Branch | erro 400 |
| TW-08 | `createPlan` | D10, D11, D12, D13 | ciclo explicito; notas; user truthy | D10 F; D11 T; D12 T; D13 T | Branch / MC/DC | plano criado |
| TW-09 | `validatePontualAuthorization` | D5, D6, D7 | pontual autorizado | D5 F; D6 F; D7 T | Branch | plano criado |
| TW-10 | `validatePontualAuthorization` | D5, D6 | autorizacao ausente | D5 F; D6 T | Branch | erro 403 |
| TW-11 | `validatePontualAuthorization`, `createPlan` | D7, D12, D13 | user id e username falsy | D7 F; D12 F; D13 F | Branch / MC/DC | plano criado |
| TW-12 | `requireNumberInRange` | D15 | D15.C1 TRUE | TRUE | MCC / MC/DC | erro 400 |
| TW-13 | `requireNumberInRange` | D15 | D15.C2 TRUE | TRUE | MCC / MC/DC | erro 400 |
| TW-14 | `validateInterval`, `requireNumberInRange` | D4, D15 | intervalo valido nos extremos | FALSE | MCC / MC/DC | plano criado |
| TW-15 | `validateInterval` | D4 | `min > max` | TRUE | Branch | erro 400 |
| TW-16 | `requireNumber` | D14 | D14.C1 TRUE | TRUE | Branch | erro 400 |
| TW-17 | `requireIntegerInRange` | D16 | D16.C1 TRUE | TRUE | Branch | erro 400 |
| TW-18 | `requireNumberInRange` | D15 | D15.C1 TRUE no ciclo | TRUE | Branch / MCC | erro 400 |
| TW-19 | `requireNumberInRange` | D15 | D15.C2 TRUE no ciclo | TRUE | Branch / MCC | erro 400 |

# 6. Resumo de cobertura

| Decision | TRUE covered by | FALSE covered by |
|:--|:--|:--|
| D1 | TW-03, TW-04 | TW-01, TW-05, TW-06 |
| D2 | TW-01 | TW-05, TW-06 |
| D3 | TW-07 | TW-01, TW-08, TW-09 |
| D4 | TW-15 | TW-01, TW-14 |
| D5 | TW-01, TW-08 | TW-09, TW-10, TW-11 |
| D6 | TW-10 | TW-09, TW-11 |
| D7 | TW-09 | TW-11 |
| D8 | TW-02 | TW-01 |
| D9 | TW-03, TW-04, TW-05, TW-06 | TW-01 |
| D10 | TW-01 | TW-08 |
| D11 | TW-08 | TW-01 |
| D12 | TW-08 | TW-01, TW-11 |
| D13 | TW-08 | TW-01, TW-11 |
| D14 | TW-16 | TW-01, TW-14 |
| D15 | TW-12, TW-13, TW-18, TW-19 | TW-01, TW-14 |
| D16 | TW-17 | TW-01, TW-08 |

Todas as decisoes D1-D16 possuem cobertura TRUE/FALSE. As decisoes compostas D1, D2, D12, D13 e D15 possuem evidencia MCC/MC/DC. Nao existem `while`, `for` ou `switch` no fluxo analisado.
