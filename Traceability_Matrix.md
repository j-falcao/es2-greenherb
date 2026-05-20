# Matriz

| ID    | Ficheiro                         | Requisito / Regra   | Endpoint(s)                | Nível   | Técnica Aplicada                 | Resultado Esperado                                                                  | Pré-condições                             |
|:------|:---------------------------------|:--------------------|:---------------------------|:--------|:---------------------------------|:------------------------------------------------------------------------------------|:------------------------------------------|
| TU-01 | authService.unit.test.js         | RF-02, RN-05, RN-06 | N/A — AuthService          | Unidade | Particionamento de Equivalência  | Login válido devolve accessToken, refreshToken e user com role; tokens incluem role | Utilizador Responsavel existente          |
| TU-02 | authService.unit.test.js         | RF-02, RN-05        | N/A — AuthService          | Unidade | Particionamento de Equivalência  | Rejeita password incorreta com statusCode 401                                       | Utilizador existente                      |
| TU-03 | authService.unit.test.js         | RF-02, RN-05        | N/A — AuthService          | Unidade | Particionamento de Equivalência  | Rejeita utilizador inexistente com statusCode 401                                   | Repositório sem esse utilizador           |
| TU-04 | authService.unit.test.js         | RF-02, RN-01        | N/A — AuthService          | Unidade | Valores Limite / Classe Inválida | Rejeita username null com statusCode 400                                            | Username null                             |
| TU-05 | authService.unit.test.js         | RF-02, RN-01        | N/A — AuthService          | Unidade | Valores Limite / Classe Inválida | Rejeita username vazio com statusCode 400                                           | Username vazio                            |
| TU-06 | authService.unit.test.js         | RF-02, RN-01        | N/A — AuthService          | Unidade | Particionamento de Equivalência  | Rejeita username com caracteres inválidos com statusCode 400                        | Username 'ana green!'                     |
| TU-07 | authService.unit.test.js         | RF-02, RN-02        | N/A — AuthService          | Unidade | Valores Limite / Classe Inválida | Rejeita password null com statusCode 400                                            | Password null                             |
| TU-08 | authService.unit.test.js         | RF-02, RN-02        | N/A — AuthService          | Unidade | Valores Limite / Classe Inválida | Rejeita password vazia com statusCode 400                                           | Password vazia                            |
| TU-09 | authService.unit.test.js         | RF-02, RN-01, RN-02 | N/A — AuthService          | Unidade | Valores Limite / Classe Inválida | Rejeita username e password vazios com statusCode 400                               | Username e password vazios                |
| TU-10 | authService.unit.test.js         | RF-03, RN-06        | N/A — AuthService          | Unidade | Particionamento de Equivalência  | Refresh token válido gera novo accessToken que inclui role                          | Refresh token válido                      |
| TU-11 | authService.unit.test.js         | RF-03               | N/A — AuthService          | Unidade | Particionamento de Equivalência  | Rejeita refresh token inválido                                                      | Refresh token inválido                    |
| TU-12 | userService.unit.test.js         | RF-01, RN-04, RN-06 | N/A — UserService          | Unidade | Particionamento de Equivalência  | Cria utilizador com role default Tecnico; passwordHash não é exposta publicamente   | Username disponível                       |
| TU-13 | userService.unit.test.js         | RF-01, RN-03        | N/A — UserService          | Unidade | Particionamento de Equivalência  | Rejeita username duplicado com statusCode 409                                       | Username já existente                     |
| TU-14 | userService.unit.test.js         | RF-01, RN-01        | N/A — UserService          | Unidade | Valores Limite / Classe Inválida | Rejeita username null com statusCode 400                                            | Username null                             |
| TU-15 | userService.unit.test.js         | RF-01, RN-01        | N/A — UserService          | Unidade | Valores Limite / Classe Inválida | Rejeita username vazio com statusCode 400                                           | Username vazio                            |
| TU-16 | userService.unit.test.js         | RF-01, RN-01        | N/A — UserService          | Unidade | Particionamento de Equivalência  | Rejeita username com espaços/caracteres inválidos com statusCode 400                | Username 'ana green!'                     |
| TU-17 | userService.unit.test.js         | RF-01, RN-01        | N/A — UserService          | Unidade | Particionamento de Equivalência  | Rejeita username com hífen com statusCode 400                                       | Username 'ana-green'                      |
| TU-18 | userService.unit.test.js         | RF-01, RN-01        | N/A — UserService          | Unidade | Particionamento de Equivalência  | Rejeita username com ponto com statusCode 400                                       | Username 'ana.green'                      |
| TU-19 | userService.unit.test.js         | RF-01, RN-02        | N/A — UserService          | Unidade | Valores Limite / Classe Inválida | Rejeita password null com statusCode 400                                            | Password null                             |
| TU-20 | userService.unit.test.js         | RF-01, RN-02        | N/A — UserService          | Unidade | Valores Limite / Classe Inválida | Rejeita password vazia com statusCode 400                                           | Password vazia                            |
| TU-21 | userService.unit.test.js         | RF-01, RN-06        | N/A — UserService          | Unidade | Particionamento de Equivalência  | Cria utilizador com role Tecnico                                                    | Role válida Tecnico                       |
| TU-22 | userService.unit.test.js         | RF-01, RN-06        | N/A — UserService          | Unidade | Particionamento de Equivalência  | Cria utilizador com role Responsavel                                                | Role válida Responsavel                   |
| TU-23 | userService.unit.test.js         | RF-01, RN-06        | N/A — UserService          | Unidade | Particionamento de Equivalência  | Cria utilizador com role Administrador                                              | Role válida Administrador                 |
| TU-24 | userService.unit.test.js         | RF-01, RN-06        | N/A — UserService          | Unidade | Particionamento de Equivalência  | Rejeita role inválida com statusCode 400                                            | Role inválida                             |
| TU-25 | herbService.unit.test.js         | RF-04, RN-07        | N/A — HerbService          | Unidade | Particionamento de Equivalência  | Importa ervas válidas de CSV                                                        | CSV válido com campos obrigatórios        |
| TU-26 | herbService.unit.test.js         | RF-04               | N/A — HerbService          | Unidade | Particionamento de Equivalência  | Lista ervas importadas                                                              | Catálogo com ervas previamente importadas |
| TU-27 | herbService.unit.test.js         | RF-04               | N/A — HerbService          | Unidade | Valores Limite / Classe Inválida | Rejeita importação vazia                                                            | CSV vazio                                 |
| TU-28 | herbService.unit.test.js         | RF-04, RN-07        | N/A — HerbService          | Unidade | Particionamento de Equivalência  | Rejeita erva sem name                                                               | CSV com name vazio                        |
| TU-29 | herbService.unit.test.js         | RF-04, RN-08        | N/A — HerbService          | Unidade | Particionamento de Equivalência  | Rejeita erva sem wateringFrequencyDays                                              | CSV sem campo obrigatório                 |
| TU-30 | herbService.unit.test.js         | RF-04, RN-08        | N/A — HerbService          | Unidade | Particionamento de Equivalência  | Rejeita erva sem harvestDays                                                        | CSV sem campo obrigatório                 |
| TU-31 | herbService.unit.test.js         | RF-04, RN-09        | N/A — HerbService          | Unidade | Particionamento de Equivalência  | Rejeita nomes de ervas duplicados com statusCode 409                                | Erva já importada                         |
| TU-32 | herbService.unit.test.js         | RF-04               | N/A — HerbService          | Unidade | Particionamento de Equivalência  | Importa CSV delimitado por ponto e vírgula                                          | CSV separado por ';'                      |
| TU-33 | planService.unit.test.js         | RF-05               | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Cria plano regular para erva e utilizador existentes                                | HerbId válido e userId válido             |
| TU-34 | planService.unit.test.js         | RF-05, RN-11        | N/A — PlanService          | Unidade | Valores Limite / Cálculo de Data | Calcula expectedHarvestDate a partir de startDate + harvestDays                     | Plano válido                              |
| TU-35 | planService.unit.test.js         | RF-05, RN-10        | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Rejeita herbId desconhecido com statusCode 404                                      | HerbId inexistente                        |
| TU-36 | planService.unit.test.js         | RF-05, RN-11        | N/A — PlanService          | Unidade | Valores Limite / Classe Inválida | Rejeita startDate null com statusCode 400                                           | startDate null                            |
| TU-37 | planService.unit.test.js         | RF-05, RN-11        | N/A — PlanService          | Unidade | Valores Limite / Classe Inválida | Rejeita startDate vazia com statusCode 400                                          | startDate vazia                           |
| TU-38 | planService.unit.test.js         | RF-05, RN-11        | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Rejeita formato de data inválido com statusCode 400                                 | startDate '13-05-2026'                    |
| TU-39 | planService.unit.test.js         | RF-05, RN-11        | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Rejeita data impossível com statusCode 400                                          | startDate '2026-02-30'                    |
| TU-40 | planService.unit.test.js         | RF-05, RN-12        | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Cria plano do tipo regular                                                          | Tipo válido regular                       |
| TU-41 | planService.unit.test.js         | RF-05, RN-12        | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Cria plano do tipo emergencia                                                       | Tipo válido emergencia                    |
| TU-42 | planService.unit.test.js         | RF-05, RN-12, RN-24 | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Cria plano do tipo pontual com autorização explícita                                | Tipo válido pontual e autorização explícita |
| TU-43 | planService.unit.test.js         | RF-05, RN-12        | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Rejeita tipo de plano inválido com statusCode 400                                   | Tipo inválido 'weekly'                    |
| TU-44 | userService.unit.test.js         | RF-06, RN-04        | N/A — UserService          | Unidade | Particionamento de Equivalência  | Lista utilizadores públicos sem passwordHash                                        | Utilizador existente                      |
| TU-45 | userService.unit.test.js         | RF-06, RN-06        | N/A — UserService          | Unidade | Particionamento de Equivalência  | Atualiza role de utilizador                                                          | Utilizador existente e role válida        |
| TU-46 | userService.unit.test.js         | RF-06               | N/A — UserService          | Unidade | Particionamento de Equivalência  | Rejeita atualização de role para utilizador inexistente com statusCode 404          | UserId inexistente                        |
| TU-47 | herbService.unit.test.js         | RF-04               | N/A — HerbService          | Unidade | Particionamento de Equivalência  | Obtém erva importada por id                                                          | Erva existente                            |
| TU-48 | herbService.unit.test.js         | RF-04               | N/A — HerbService          | Unidade | Particionamento de Equivalência  | Devolve undefined para herbId inexistente                                            | HerbId inexistente                        |
| TU-49 | planService.unit.test.js         | RF-05               | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Lista planos criados                                                                 | Plano existente                           |
| TU-50 | planService.unit.test.js         | RF-05               | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Obtém plano por id                                                                   | Plano existente                           |
| TU-51 | planService.unit.test.js         | RF-05               | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Rejeita planId inexistente com statusCode 404                                        | PlanId inexistente                        |
| TU-52 | batchService.unit.test.js        | RF-07, RN-13, RN-14 | N/A — BatchService         | Unidade | Particionamento de Equivalência  | Cria lote para plano existente com estado inicial ativo                              | PlanId válido                             |
| TU-53 | batchService.unit.test.js        | RF-07               | N/A — BatchService         | Unidade | Particionamento de Equivalência  | Lista lotes e obtém lote por id                                                      | Lote existente                            |
| TU-54 | batchService.unit.test.js        | RF-07, RN-13        | N/A — BatchService         | Unidade | Particionamento de Equivalência  | Rejeita criação de lote para plano inexistente com statusCode 404                   | PlanId inexistente                        |
| TU-55 | batchService.unit.test.js        | RF-07, RN-14        | N/A — BatchService         | Unidade | Particionamento de Equivalência  | Atualiza estado do lote                                                              | Lote existente e estado válido            |
| TU-56 | batchService.unit.test.js        | RF-07, RN-14        | N/A — BatchService         | Unidade | Particionamento de Equivalência  | Rejeita estado inválido de lote com statusCode 400                                  | Estado inválido                           |
| TU-57 | batchService.unit.test.js        | RF-07, RN-37        | N/A — BatchService         | Unidade | Particionamento de Equivalência  | Adiciona divisões, perdas e calcula produtividade ao lote                            | Lote existente                            |
| TU-58 | taskService.unit.test.js         | RF-08, RN-15        | N/A — TaskService          | Unidade | Particionamento de Equivalência  | Cria tarefa para lote existente com estado pendente                                  | BatchId válido                            |
| TU-59 | taskService.unit.test.js         | RF-08               | N/A — TaskService          | Unidade | Particionamento de Equivalência  | Lista tarefas e obtém tarefa por id                                                  | Tarefa existente                          |
| TU-60 | taskService.unit.test.js         | RF-08, RN-16        | N/A — TaskService          | Unidade | Particionamento de Equivalência  | Atualiza estado da tarefa                                                            | Tarefa existente e estado válido          |
| TU-61 | taskService.unit.test.js         | RF-08, RN-15        | N/A — TaskService          | Unidade | Particionamento de Equivalência  | Rejeita criação de tarefa para lote inexistente com statusCode 404                  | BatchId inexistente                       |
| TU-62 | taskService.unit.test.js         | RF-08, RN-15        | N/A — TaskService          | Unidade | Particionamento de Equivalência  | Rejeita tipo de tarefa inválido com statusCode 400                                  | Tipo inválido                             |
| TU-63 | measurementService.unit.test.js  | RF-09, RN-17        | N/A — MeasurementService   | Unidade | Particionamento de Equivalência  | Cria medição ambiental para lote existente                                           | BatchId válido e valores numéricos        |
| TU-64 | measurementService.unit.test.js  | RF-09               | N/A — MeasurementService   | Unidade | Particionamento de Equivalência  | Lista medições e obtém medição por id                                                | Medição existente                         |
| TU-65 | measurementService.unit.test.js  | RF-09, RN-17        | N/A — MeasurementService   | Unidade | Particionamento de Equivalência  | Rejeita medição para lote inexistente com statusCode 404                            | BatchId inexistente                       |
| TU-66 | measurementService.unit.test.js  | RF-09, RN-17        | N/A — MeasurementService   | Unidade | Particionamento de Equivalência  | Rejeita valores ambientais inválidos com statusCode 400                             | Temperatura inválida                      |
| TU-67 | alertService.unit.test.js        | RF-10, RN-18        | N/A — AlertService         | Unidade | Particionamento de Equivalência  | Cria alerta ativo                                                                    | Tipo e mensagem válidos                   |
| TU-68 | alertService.unit.test.js        | RF-10               | N/A — AlertService         | Unidade | Particionamento de Equivalência  | Lista alertas e obtém alerta por id                                                  | Alerta existente                          |
| TU-69 | alertService.unit.test.js        | RF-10               | N/A — AlertService         | Unidade | Particionamento de Equivalência  | Resolve alerta                                                                       | Alerta existente                          |
| TU-70 | alertService.unit.test.js        | RF-10, RN-19        | N/A — AlertService         | Unidade | Particionamento de Equivalência  | Ignora alerta com justificação                                                       | Alerta existente e justificação válida    |
| TU-71 | alertService.unit.test.js        | RF-10, RN-19        | N/A — AlertService         | Unidade | Valores Limite / Classe Inválida | Rejeita ignorar alerta sem justificação com statusCode 400                          | Justificação vazia                        |
| TU-72 | automationService.unit.test.js   | RF-11, RN-20        | N/A — AutomationService    | Unidade | Particionamento de Equivalência  | Cria regra de automação ativa                                                        | Regra válida                              |
| TU-73 | automationService.unit.test.js   | RF-11               | N/A — AutomationService    | Unidade | Particionamento de Equivalência  | Lista regras e obtém regra por id                                                    | Regra existente                           |
| TU-74 | automationService.unit.test.js   | RF-11               | N/A — AutomationService    | Unidade | Particionamento de Equivalência  | Atualiza regra de automação                                                          | Regra existente                           |
| TU-75 | automationService.unit.test.js   | RF-11, RN-21        | N/A — AutomationService    | Unidade | Particionamento de Equivalência  | Obtém modo manual e altera para automático                                           | Modo válido automatico                    |
| TU-76 | automationService.unit.test.js   | RF-11, RN-21        | N/A — AutomationService    | Unidade | Particionamento de Equivalência  | Rejeita modo de automação inválido com statusCode 400                               | Modo inválido                             |
| TU-77 | reportService.unit.test.js       | RF-12               | N/A — ReportService        | Unidade | Particionamento de Equivalência  | Exporta relatório CSV                                                               | Recurso reportável existente              |
| TU-78 | reportService.unit.test.js       | RF-12, RN-22        | N/A — ReportService        | Unidade | Particionamento de Equivalência  | Rejeita relatório Excel com statusCode 501                                          | Formato excel                             |
| TU-79 | reportService.unit.test.js       | RF-12, RN-23        | N/A — ReportService        | Unidade | Particionamento de Equivalência  | Rejeita recurso desconhecido de relatório com statusCode 400                        | Recurso desconhecido                      |
| TU-80 | auditService.unit.test.js        | RF-13               | N/A — AuditService         | Unidade | Particionamento de Equivalência  | Regista entrada de auditoria                                                         | Operação relevante                        |
| TU-81 | auditService.unit.test.js        | RF-13               | N/A — AuditService         | Unidade | Particionamento de Equivalência  | Lista entradas de auditoria                                                          | Entrada de auditoria existente            |
| TU-82 | planService.unit.test.js         | RF-05, RN-24        | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Rejeita plano pontual sem autorização explícita                                      | Tipo pontual sem autorização explícita     |
| TU-83 | planService.unit.test.js         | RF-05, RN-25        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Rejeita temperatura mínima abaixo do limite                                          | temperature.min = 17                      |
| TU-84 | planService.unit.test.js         | RF-05, RN-25        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita temperatura mínima no limite inferior                                         | temperature.min = 18                      |
| TU-85 | planService.unit.test.js         | RF-05, RN-25        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita temperatura nominal interior                                                  | temperature.max = 23                      |
| TU-86 | planService.unit.test.js         | RF-05, RN-25        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita temperatura máxima no limite superior                                         | temperature.max = 28                      |
| TU-87 | planService.unit.test.js         | RF-05, RN-25        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Rejeita temperatura máxima acima do limite                                           | temperature.max = 29                      |
| TU-88 | planService.unit.test.js         | RF-05, RN-26        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Rejeita humidade mínima abaixo do limite                                             | humidity.min = 39                         |
| TU-89 | planService.unit.test.js         | RF-05, RN-26        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita humidade mínima no limite inferior                                            | humidity.min = 40                         |
| TU-90 | planService.unit.test.js         | RF-05, RN-26        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita humidade nominal interior                                                     | humidity.max = 60                         |
| TU-91 | planService.unit.test.js         | RF-05, RN-26        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita humidade máxima no limite superior                                            | humidity.max = 80                         |
| TU-92 | planService.unit.test.js         | RF-05, RN-26        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Rejeita humidade máxima acima do limite                                              | humidity.max = 81                         |
| TU-93 | planService.unit.test.js         | RF-05, RN-27        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Rejeita luminosidade mínima abaixo do limite                                         | luminosity.min = 4999                     |
| TU-94 | planService.unit.test.js         | RF-05, RN-27        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita luminosidade mínima no limite inferior                                        | luminosity.min = 5000                     |
| TU-95 | planService.unit.test.js         | RF-05, RN-27        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita luminosidade nominal interior                                                 | luminosity.max = 15000                    |
| TU-96 | planService.unit.test.js         | RF-05, RN-27        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita luminosidade máxima no limite superior                                        | luminosity.max = 25000                    |
| TU-97 | planService.unit.test.js         | RF-05, RN-27        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Rejeita luminosidade máxima acima do limite                                          | luminosity.max = 25001                    |
| TU-98 | planService.unit.test.js         | RF-05, RN-28        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Rejeita duração de ciclo abaixo do limite                                            | cycleDurationDays = 0                     |
| TU-99 | planService.unit.test.js         | RF-05, RN-28        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita duração de ciclo no limite inferior                                           | cycleDurationDays = 1                     |
| TU-100 | planService.unit.test.js        | RF-05, RN-28        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita duração de ciclo nominal interior                                             | cycleDurationDays = 90                    |
| TU-101 | planService.unit.test.js        | RF-05, RN-28        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Aceita duração de ciclo no limite superior                                           | cycleDurationDays = 365                   |
| TU-102 | planService.unit.test.js        | RF-05, RN-28        | N/A — PlanService          | Unidade | Análise de Valores Limite        | Rejeita duração de ciclo acima do limite                                             | cycleDurationDays = 366                   |
| TU-103 | measurementService.unit.test.js | RF-09, RF-10, RN-29, RN-30 | N/A — MeasurementService   | Unidade | Particionamento de Equivalência  | Gera alerta Aviso quando uma medição viola limites do plano                          | Uma violação ambiental                    |
| TU-104 | measurementService.unit.test.js | RF-09, RF-10, RN-29, RN-30 | N/A — MeasurementService   | Unidade | Particionamento de Equivalência  | Gera alerta Crítico quando várias medições violam limites do plano                   | Duas violações ambientais                 |
| TU-105 | measurementService.unit.test.js | RF-09, RF-10, RN-29, RN-31 | N/A — MeasurementService   | Unidade | Particionamento de Equivalência  | Gera alerta Informativo para dados de sensor não confiáveis                          | sensorOK = false                          |
| TU-106 | alertService.unit.test.js       | RF-10, RN-19, RN-32 | N/A — AlertService         | Unidade | Análise de Valores Limite        | Rejeita justificação para ignorar abaixo do limite                                   | 9 caracteres                              |
| TU-107 | alertService.unit.test.js       | RF-10, RN-19, RN-32 | N/A — AlertService         | Unidade | Análise de Valores Limite        | Aceita justificação para ignorar no limite inferior                                  | 10 caracteres                             |
| TU-108 | alertService.unit.test.js       | RF-10, RN-19, RN-32 | N/A — AlertService         | Unidade | Análise de Valores Limite        | Aceita justificação para ignorar nominal interior                                    | 250 caracteres                            |
| TU-109 | alertService.unit.test.js       | RF-10, RN-19, RN-32 | N/A — AlertService         | Unidade | Análise de Valores Limite        | Aceita justificação para ignorar no limite superior                                  | 500 caracteres                            |
| TU-110 | alertService.unit.test.js       | RF-10, RN-19, RN-32 | N/A — AlertService         | Unidade | Análise de Valores Limite        | Rejeita justificação para ignorar acima do limite                                    | 501 caracteres                            |
| TU-111 | alertService.unit.test.js       | RF-10, RN-30, RN-31 | N/A — AlertService         | Unidade | Cobertura de Condições Múltiplas / MC/DC | Classifica como Informativo sem violação e sensor OK                         | Sem violação, sensorOK true               |
| TU-112 | alertService.unit.test.js       | RF-10, RN-30, RN-31 | N/A — AlertService         | Unidade | Cobertura de Condições Múltiplas / MC/DC | Classifica como Aviso com uma violação e sensor OK                            | Uma violação, sensorOK true               |
| TU-113 | alertService.unit.test.js       | RF-10, RN-30, RN-31 | N/A — AlertService         | Unidade | Cobertura de Condições Múltiplas / MC/DC | Classifica como Crítico com várias violações e sensor OK                      | Duas violações, sensorOK true             |
| TU-114 | alertService.unit.test.js       | RF-10, RN-30, RN-31 | N/A — AlertService         | Unidade | Cobertura de Condições Múltiplas / MC/DC | Classifica como Informativo quando o sensor não está OK                       | sensorOK false                            |
| TU-115 | batchService.unit.test.js       | RF-07, RN-14, RN-33 | N/A — BatchService         | Unidade | Cobertura de Condições Múltiplas | Rejeita conclusão de lote sem data real                                              | status concluido sem actualEndDate        |
| TU-116 | batchService.unit.test.js       | RF-07, RN-14, RN-34 | N/A — BatchService         | Unidade | Cobertura de Condições Múltiplas | Rejeita lote comprometido sem perdas registadas                                      | Sem perdas registadas                     |
| TU-117 | batchService.unit.test.js       | RF-07, RN-14, RN-34 | N/A — BatchService         | Unidade | Cobertura de Condições Múltiplas | Permite lote comprometido quando existem perdas registadas                           | Perdas registadas                         |
| TU-118 | automationService.unit.test.js  | RF-11, RN-21, RN-35 | N/A — AutomationService    | Unidade | Cobertura de Condições Múltiplas / MC/DC | Decide executar quando modo é automático, regra ativa e medição recente       | automatico, enabled, medição recente      |
| TU-119 | automationService.unit.test.js  | RF-11, RN-21, RN-35 | N/A — AutomationService    | Unidade | Cobertura de Condições Múltiplas / MC/DC | Decide sugerir quando modo é manual, regra ativa e medição recente            | manual, enabled, medição recente          |
| TU-120 | automationService.unit.test.js  | RF-11, RN-21, RN-35 | N/A — AutomationService    | Unidade | Cobertura de Condições Múltiplas / MC/DC | Decide ignorar quando a regra está inativa                                    | automatico, disabled, medição recente     |
| TU-121 | automationService.unit.test.js  | RF-11, RN-21, RN-35 | N/A — AutomationService    | Unidade | Cobertura de Condições Múltiplas / MC/DC | Decide ignorar quando a medição não é recente                                  | automatico, enabled, medição antiga       |
| TU-122 | authMiddleware.unit.test.js     | RF-06, RN-06, RN-36 | N/A — AuthMiddleware       | Unidade | Particionamento de Equivalência  | Permite utilizador com perfil autorizado                                             | Role Responsavel autorizado               |
| TU-123 | authMiddleware.unit.test.js     | RF-06, RN-06, RN-36 | N/A — AuthMiddleware       | Unidade | Particionamento de Equivalência  | Rejeita utilizador sem perfil autorizado                                             | Role Tecnico não autorizado               |
| TU-124 | planService.unit.test.js        | RF-05, RN-24        | N/A — PlanService          | Unidade | Particionamento de Equivalência  | Cria plano pontual para Tecnico quando existe autorização explícita                  | Tipo pontual, user Tecnico e autorização explícita |
| TU-125 | alertService.unit.test.js       | RF-10, RN-18        | N/A — AlertService         | Unidade | Particionamento de Equivalência  | Cria alerta do tipo Informativo                                                       | Tipo informativo e mensagem válida        |
| TU-126 | alertService.unit.test.js       | RF-10, RN-18        | N/A — AlertService         | Unidade | Particionamento de Equivalência  | Rejeita classificação de alerta inválida                                             | Tipo inválido 'urgente'                   |
| TU-127 | authMiddleware.unit.test.js     | RF-02, RN-05, RN-36 | N/A — AuthMiddleware       | Unidade | Particionamento de Equivalência  | Rejeita pedido sem token de autorização                                               | Authorization header ausente              |
| TU-128 | authMiddleware.unit.test.js     | RF-06, RN-06, RN-36 | N/A — AuthMiddleware       | Unidade | Particionamento de Equivalência  | Rejeita perfil de utilizador desconhecido                                             | Role Visitante                            |
| TU-129 | batchService.unit.test.js       | RF-07, RN-14        | N/A — BatchService         | Unidade | Cobertura de Condições Múltiplas | Rejeita transição de estado após lote concluído                                       | Lote com estado concluido                 |



# Legenda

| Código   | Descrição                                                                   |
|:---------|:----------------------------------------------------------------------------|
| RF-01    | Registo de utilizadores                                                     |
| RF-02    | Autenticação/login                                                          |
| RF-03    | Renovação de token                                                          |
| RF-04    | Gestão do catálogo de ervas aromáticas                                      |
| RF-05    | Gestão de planos de cultivo                                                 |
| RF-06    | Gestão de utilizadores e perfis                                             |
| RF-07    | Gestão de lotes de cultivo                                                  |
| RF-08    | Gestão de tarefas operacionais                                              |
| RF-09    | Registo e consulta de medições ambientais                                   |
| RF-10    | Gestão de alertas                                                           |
| RF-11    | Gestão de automação e modo manual/automático                                |
| RF-12    | Exportação de relatórios                                                    |
| RF-13    | Consulta e registo de logs de auditoria                                     |
| RN-01    | Username deve ser válido                                                    |
| RN-02    | Password obrigatória                                                        |
| RN-03    | Username único                                                              |
| RN-04    | Password armazenada encriptada e não exposta na resposta pública            |
| RN-05    | Apenas credenciais válidas autenticam                                       |
| RN-06    | Perfil/role do utilizador deve ser válido e propagado nos tokens            |
| RN-07    | Nome da erva obrigatório                                                    |
| RN-08    | Campos obrigatórios da erva devem existir                                   |
| RN-09    | Nomes de ervas duplicados não são permitidos                                |
| RN-10    | Plano deve referenciar uma erva existente                                   |
| RN-11    | Data de início deve ser válida e permite calcular data prevista de colheita |
| RN-12    | Tipo de plano deve ser válido: regular, emergencia ou pontual               |
| RN-13    | Lote deve referenciar um plano existente                                    |
| RN-14    | Estado do lote deve ser válido e respeitar transições: ativo, concluido ou comprometido |
| RN-15    | Tarefa deve referenciar um lote existente e ter tipo válido                 |
| RN-16    | Estado da tarefa deve ser válido                                            |
| RN-17    | Medição deve referenciar um lote existente e conter valores numéricos       |
| RN-18    | Alerta deve ter tipo e mensagem válidos                                     |
| RN-19    | Ignorar alerta exige justificação                                           |
| RN-20    | Regra de automação deve ter nome, trigger e action                          |
| RN-21    | Modo de automação deve ser manual ou automatico                             |
| RN-22    | Exportação Excel ainda não está implementada                                |
| RN-23    | Relatório deve referenciar um recurso exportável conhecido                  |
| RN-24    | Plano pontual exige autorização explícita do Responsavel Técnico             |
| RN-25    | Intervalo de temperatura do plano deve respeitar [18, 28]                   |
| RN-26    | Intervalo de humidade do plano deve respeitar [40, 80]                      |
| RN-27    | Intervalo de luminosidade do plano deve respeitar [5000, 25000]             |
| RN-28    | Duração do ciclo do plano deve respeitar [1, 365] dias                      |
| RN-29    | Medições ambientais fora dos limites do plano geram alertas automaticamente |
| RN-30    | Alertas ambientais devem ser classificados como Informativo, Aviso ou Crítico |
| RN-31    | Dados de sensor não confiáveis devem gerar alerta Informativo               |
| RN-32    | Justificação para ignorar alerta deve ter entre 10 e 500 caracteres         |
| RN-33    | Conclusão de lote exige data real de conclusão                              |
| RN-34    | Lote só pode ficar comprometido quando existem perdas registadas            |
| RN-35    | Motor de automação decide executar, sugerir ou ignorar por modo, regra ativa e medição recente |
| RN-36    | Endpoints e operações protegidas devem respeitar perfis autorizados         |
| RN-37    | Produtividade do lote deve considerar produção, perdas e tempo real face ao planeado |



# Cobertura inversa

| Requisito/Regra   | Casos de Teste                                                                            |
|:------------------|:------------------------------------------------------------------------------------------|
| RF-01             | TU-12, TU-13, TU-14, TU-15, TU-16, TU-17, TU-18, TU-19, TU-20, TU-21, TU-22, TU-23, TU-24 |
| RF-02             | TU-01, TU-02, TU-03, TU-04, TU-05, TU-06, TU-07, TU-08, TU-09, TU-127                     |
| RF-03             | TU-10, TU-11                                                                              |
| RF-04             | TU-25, TU-26, TU-27, TU-28, TU-29, TU-30, TU-31, TU-32, TU-47, TU-48                      |
| RF-05             | TU-33, TU-34, TU-35, TU-36, TU-37, TU-38, TU-39, TU-40, TU-41, TU-42, TU-43, TU-49, TU-50, TU-51, TU-82, TU-83, TU-84, TU-85, TU-86, TU-87, TU-88, TU-89, TU-90, TU-91, TU-92, TU-93, TU-94, TU-95, TU-96, TU-97, TU-98, TU-99, TU-100, TU-101, TU-102, TU-124 |
| RF-06             | TU-44, TU-45, TU-46, TU-122, TU-123, TU-128                                               |
| RF-07             | TU-52, TU-53, TU-54, TU-55, TU-56, TU-57, TU-115, TU-116, TU-117, TU-129                   |
| RF-08             | TU-58, TU-59, TU-60, TU-61, TU-62                                                         |
| RF-09             | TU-63, TU-64, TU-65, TU-66, TU-103, TU-104, TU-105                                        |
| RF-10             | TU-67, TU-68, TU-69, TU-70, TU-71, TU-103, TU-104, TU-105, TU-106, TU-107, TU-108, TU-109, TU-110, TU-111, TU-112, TU-113, TU-114, TU-125, TU-126 |
| RF-11             | TU-72, TU-73, TU-74, TU-75, TU-76, TU-118, TU-119, TU-120, TU-121                          |
| RF-12             | TU-77, TU-78, TU-79                                                                       |
| RF-13             | TU-80, TU-81                                                                              |
| RN-01             | TU-04, TU-05, TU-06, TU-09, TU-14, TU-15, TU-16, TU-17, TU-18                             |
| RN-02             | TU-07, TU-08, TU-09, TU-19, TU-20                                                         |
| RN-03             | TU-13                                                                                     |
| RN-04             | TU-12, TU-44                                                                              |
| RN-05             | TU-01, TU-02, TU-03, TU-127                                                               |
| RN-06             | TU-01, TU-10, TU-12, TU-21, TU-22, TU-23, TU-24, TU-45, TU-122, TU-123, TU-128             |
| RN-07             | TU-25, TU-28                                                                              |
| RN-08             | TU-29, TU-30                                                                              |
| RN-09             | TU-31                                                                                     |
| RN-10             | TU-35                                                                                     |
| RN-11             | TU-34, TU-36, TU-37, TU-38, TU-39                                                         |
| RN-12             | TU-40, TU-41, TU-42, TU-43                                                                |
| RN-13             | TU-52, TU-54                                                                              |
| RN-14             | TU-52, TU-55, TU-56, TU-115, TU-116, TU-117, TU-129                                       |
| RN-15             | TU-58, TU-61, TU-62                                                                       |
| RN-16             | TU-60                                                                                     |
| RN-17             | TU-63, TU-65, TU-66                                                                       |
| RN-18             | TU-67, TU-125, TU-126                                                                     |
| RN-19             | TU-70, TU-71, TU-106, TU-107, TU-108, TU-109, TU-110                                      |
| RN-20             | TU-72                                                                                     |
| RN-21             | TU-75, TU-76                                                                              |
| RN-22             | TU-78                                                                                     |
| RN-23             | TU-79                                                                                     |
| RN-24             | TU-42, TU-82, TU-124                                                                       |
| RN-25             | TU-83, TU-84, TU-85, TU-86, TU-87                                                        |
| RN-26             | TU-88, TU-89, TU-90, TU-91, TU-92                                                        |
| RN-27             | TU-93, TU-94, TU-95, TU-96, TU-97                                                        |
| RN-28             | TU-98, TU-99, TU-100, TU-101, TU-102                                                     |
| RN-29             | TU-103, TU-104, TU-105                                                                    |
| RN-30             | TU-103, TU-104, TU-111, TU-112, TU-113, TU-114                                           |
| RN-31             | TU-105, TU-111, TU-112, TU-113, TU-114                                                   |
| RN-32             | TU-106, TU-107, TU-108, TU-109, TU-110                                                   |
| RN-33             | TU-115                                                                                    |
| RN-34             | TU-116, TU-117                                                                            |
| RN-35             | TU-118, TU-119, TU-120, TU-121                                                           |
| RN-36             | TU-122, TU-123, TU-127, TU-128                                                           |
| RN-37             | TU-57                                                                                     |



# Tabelas de decisão e MC/DC

## Classificação de alertas ambientais

Expressão exercitada: `sensorOK === false ? Informativo : violations.length === 0 ? Informativo : violations.length === 1 ? Aviso : Critico`.

Condições atómicas:

| Condição | Descrição |
|:---------|:----------|
| C1 | Sensor OK |
| C2 | Existe pelo menos uma violação ambiental |
| C3 | Existe mais do que uma violação ambiental |

Tabela MC/DC reduzida:

| C1 | C2 | C3 | Resultado esperado | Caso |
|:---|:---|:---|:-------------------|:-----|
| T | F | F | Informativo | TU-111 |
| T | T | F | Aviso | TU-112 |
| T | T | T | Critico | TU-113 |
| F | F | F | Informativo | TU-114 |

Justificação: TU-111/TU-112 demonstram o efeito de C2; TU-112/TU-113 demonstram o efeito de C3; TU-111/TU-114 demonstram que C1 altera o caminho lógico mesmo mantendo ausência de violações.

## Validação de plano pontual

Expressão exercitada: `type === 'pontual' && technicalResponsibleAuthorization !== true`.

Condições atómicas:

| Condição | Descrição |
|:---------|:----------|
| C1 | Tipo do plano é pontual |
| C2 | Autorização explícita está presente |
| C3 | Parâmetros do plano são válidos |

Tabela MC/DC reduzida:

| C1 | C2 | C3 | Resultado esperado | Caso |
|:---|:---|:---|:-------------------|:-----|
| F | F | T | Aceita plano regular/emergencia | TU-40, TU-41 |
| T | T | T | Aceita plano pontual | TU-42, TU-124 |
| T | F | T | Rejeita plano pontual | TU-82 |
| T | T | F | Rejeita parâmetros inválidos | TU-83, TU-87, TU-98, TU-102 |

Justificação: C1 altera a necessidade de autorização; C2 altera diretamente o resultado para planos pontuais; C3 é exercitada pelos limites ambientais e de duração.

## Transição de estado de lote

Expressões exercitadas: `batch.status === 'concluido'`, `nextStatus === 'comprometido' && losses.length === 0`, `nextStatus === 'concluido' && !actualEndDate`.

Condições atómicas:

| Condição | Descrição |
|:---------|:----------|
| C1 | Estado atual é concluido |
| C2 | Próximo estado é comprometido |
| C3 | Existem perdas registadas |
| C4 | Próximo estado é concluido |
| C5 | Existe data real de conclusão |

Tabela MC/DC reduzida:

| C1 | C2 | C3 | C4 | C5 | Resultado esperado | Caso |
|:---|:---|:---|:---|:---|:-------------------|:-----|
| F | F | F | T | T | Aceita conclusão | TU-55 |
| F | F | F | T | F | Rejeita conclusão sem data | TU-115 |
| F | T | F | F | F | Rejeita comprometido sem perdas | TU-116 |
| F | T | T | F | F | Aceita comprometido com perdas | TU-117 |
| T | T | T | F | F | Rejeita transição após concluído | TU-129 |

Justificação: TU-55/TU-115 isolam o efeito de C5; TU-116/TU-117 isolam C3; TU-117/TU-129 exercitam o bloqueio por C1.

## Decisão do motor de automação

Expressão exercitada: `ruleActive && recentMeasurement ? (automaticMode ? execute : suggest) : skip`.

Condições atómicas:

| Condição | Descrição |
|:---------|:----------|
| C1 | Modo automático |
| C2 | Regra ativa |
| C3 | Medição recente |

Tabela MC/DC reduzida:

| C1 | C2 | C3 | Resultado esperado | Caso |
|:---|:---|:---|:-------------------|:-----|
| T | T | T | Executar | TU-118 |
| F | T | T | Sugerir | TU-119 |
| T | F | T | Ignorar | TU-120 |
| T | T | F | Ignorar | TU-121 |

Justificação: TU-118/TU-119 isolam C1; TU-118/TU-120 isolam C2; TU-118/TU-121 isolam C3.
