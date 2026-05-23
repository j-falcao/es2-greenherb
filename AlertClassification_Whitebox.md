# 1. Ambito

Esta analise white-box cobre a classificacao de alertas ambientais em `classifyMeasurementAlert` e o helper diretamente envolvido `countMeasurementViolations`.

Nao existem `while`, `for` ou `switch` neste fluxo. O teste `TW-20` cobre o retorno antecipado por sensor nao confiavel; `TW-21` a `TW-27` cobrem classificacao por quantidade e tipo de violacoes ambientais.

# 2. Identificacao das decisoes

| ID | Funcao | Expressao original | Condicoes atomicas | Ramo TRUE | Ramo FALSE |
|:--|:--|:--|:--|:--|:--|
| D1 | `classifyMeasurementAlert` | `!sensorOK` | C1 = `!sensorOK` | retorna `informativo` com `sensor_unreliable` | calcula violacoes ambientais |
| D2 | `countMeasurementViolations` | `measurement.temperature < environmentLimits.temperature.min` | C1 = expressao completa | adiciona `temperature_below_min` | nao adiciona violacao |
| D3 | `countMeasurementViolations` | `measurement.temperature > environmentLimits.temperature.max` | C1 = expressao completa | adiciona `temperature_above_max` | nao adiciona violacao |
| D4 | `countMeasurementViolations` | `measurement.humidity < environmentLimits.humidity.min` | C1 = expressao completa | adiciona `humidity_below_min` | nao adiciona violacao |
| D5 | `countMeasurementViolations` | `measurement.humidity > environmentLimits.humidity.max` | C1 = expressao completa | adiciona `humidity_above_max` | nao adiciona violacao |
| D6 | `countMeasurementViolations` | `measurement.luminosity < environmentLimits.luminosity.min` | C1 = expressao completa | adiciona `luminosity_below_min` | nao adiciona violacao |
| D7 | `countMeasurementViolations` | `measurement.luminosity > environmentLimits.luminosity.max` | C1 = expressao completa | adiciona `luminosity_above_max` | nao adiciona violacao |
| D8 | `classifyMeasurementAlert` | `violations.length === 0` | C1 = expressao completa | retorna `informativo` sem violacoes | segue para classificacao aviso/critico |
| D9 | `classifyMeasurementAlert` | `violations.length === 1 ? 'aviso' : 'critico'` | C1 = `violations.length === 1` | retorna `aviso` | retorna `critico` |

# 3. MCC / MC/DC

As decisoes D1-D9 sao de condicao unica. Assim, MCC coincide com branch coverage para cada decisao; a evidencia MC/DC e demonstrada por pares TRUE/FALSE que alteram diretamente o resultado da decisao.

| Decisao | Par TRUE/FALSE | Evidencia |
|:--|:--|:--|
| D1 | TW-20 / TW-21 | `sensorOK` altera o caminho entre retorno antecipado e contagem ambiental |
| D2 | TW-24 / TW-21 | temperatura abaixo do minimo altera a lista de violacoes |
| D3 | TW-22 / TW-21 | temperatura acima do maximo altera a lista de violacoes e o tipo para `aviso` |
| D4 | TW-23 / TW-21 | humidade abaixo do minimo participa na classificacao `critico` |
| D5 | TW-25 / TW-21 | humidade acima do maximo altera a lista de violacoes |
| D6 | TW-26 / TW-21 | luminosidade abaixo do minimo altera a lista de violacoes |
| D7 | TW-27 / TW-21 | luminosidade acima do maximo altera a lista de violacoes |
| D8 | TW-21 / TW-22 | zero violacoes retorna `informativo`; uma violacao segue para classificacao |
| D9 | TW-22 / TW-23 | uma violacao retorna `aviso`; multiplas violacoes retornam `critico` |

# 4. Mapeamento dos testes TW

| Teste | Objetivo | Decisoes cobertas | Ramos cobertos | Resultado esperado |
|:--|:--|:--|:--|:--|
| TW-20 | Classificar sensor nao confiavel | D1 | TRUE | `informativo`, `sensor_unreliable` |
| TW-21 | Classificar sem violacoes | D1-D9 | D1 F; D2-D8 F/T base; D9 N/A | `informativo`, `violations: []` |
| TW-22 | Classificar uma violacao | D3, D8, D9 | D3 T; D8 F; D9 T | `aviso` |
| TW-23 | Classificar multiplas violacoes | D3, D4, D8, D9 | D3 T; D4 T; D8 F; D9 F | `critico` |
| TW-24 | Detetar temperatura abaixo do minimo | D2 | TRUE | `temperature_below_min` |
| TW-25 | Detetar humidade acima do maximo | D5 | TRUE | `humidity_above_max` |
| TW-26 | Detetar luminosidade abaixo do minimo | D6 | TRUE | `luminosity_below_min` |
| TW-27 | Detetar luminosidade acima do maximo | D7 | TRUE | `luminosity_above_max` |

# 5. Matriz formal Sprint 5

| ID | Funcao | Decisao | Condicoes | Ramo | Tecnica | Resultado esperado |
|:--|:--|:--|:--|:--|:--|:--|
| TW-20 | `classifyMeasurementAlert` | D1 | `!sensorOK` | TRUE | Branch / MC/DC | `informativo` |
| TW-21 | `classifyMeasurementAlert` | D1-D9 | medicao nominal | FALSE/base | Branch | `informativo` |
| TW-22 | `classifyMeasurementAlert` | D3, D8, D9 | uma violacao | TRUE/FALSE | Branch / MC/DC | `aviso` |
| TW-23 | `classifyMeasurementAlert` | D3, D4, D8, D9 | multiplas violacoes | TRUE/FALSE | Branch / MC/DC | `critico` |
| TW-24 | `countMeasurementViolations` | D2 | temperatura baixa | TRUE | Branch | violacao registada |
| TW-25 | `countMeasurementViolations` | D5 | humidade alta | TRUE | Branch | violacao registada |
| TW-26 | `countMeasurementViolations` | D6 | luminosidade baixa | TRUE | Branch | violacao registada |
| TW-27 | `countMeasurementViolations` | D7 | luminosidade alta | TRUE | Branch | violacao registada |

# 6. Resumo de cobertura

| Decision | TRUE covered by | FALSE covered by |
|:--|:--|:--|
| D1 | TW-20 | TW-21, TW-22, TW-23 |
| D2 | TW-24 | TW-21 |
| D3 | TW-22, TW-23 | TW-21 |
| D4 | TW-23 | TW-21 |
| D5 | TW-25 | TW-21 |
| D6 | TW-26 | TW-21 |
| D7 | TW-27 | TW-21 |
| D8 | TW-21 | TW-22, TW-23 |
| D9 | TW-22 | TW-23 |

Todas as decisoes D1-D9 possuem cobertura TRUE/FALSE. Como todas sao decisoes de condicao unica, a cobertura de ramos fornece a evidencia MCC/MC/DC aplicavel.
