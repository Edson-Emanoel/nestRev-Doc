/*
* DTO - Data Transfer Object (Objeto de Tranferência de Dados, um padrão de projeto)
*     - Valida dados, transforma dados.
*     - Ele representa quais dados e em que formatos de uma determinada camada aceita e trabalha 
*/

export class CreateTaskDto {
    readonly name: string;
    readonly description: string;
    readonly completed: boolean;
}