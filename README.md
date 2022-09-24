# FinanEXP

Este projeto esta sendo desenvolvido por mim, por motivos puramente acadêmicos, a ideia por trás do projeto é aprender e desenvolver minhas 
habilidades com as tecnologias envolvidas.

## Como rodar

A versão atual apenas permite a utilização do aplicativo em modo desenvolvedor.
Para rodar basta clonar o repositório, ter instalado em sua máquina o postgreSQL
e criar um arquivo chamado ".Settings.cs" na pasta backend e colocar nele:
`
namespace backend
{
  public class Settings
  {
    public static string Secret = "Seu segredo para o JWT token";
    public static string DatabasePassword = "Sua senha do banco de dados";
  }
}
`
Agora é só rodar o backend da forma que preferir e o front end com o comando "ng-serve"
