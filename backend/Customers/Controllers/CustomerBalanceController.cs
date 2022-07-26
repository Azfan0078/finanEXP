using backend.Authenticate.Services;
using backend.Customers.Services;
using backend.Messages;
using backend.Shared.Dtos;
using backend.Shared.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Customers.Controllers
{
  [Route("/Customers/Balance")]
  [ApiController]
  public class CustomerBalanceController : ControllerBase
  {
    private readonly ICustomerBalanceService _customerBalanceService;

    public CustomerBalanceController(ICustomerBalanceService customerBalanceService)
    {
      _customerBalanceService = customerBalanceService;
    }
    [HttpPut("{customerId}")]
    [Authorize]
    public ActionResult<ReturnDto> CalculateCustomerBalance([FromRoute]Guid customerId)
    {
      var Bearertoken = Request.Headers["Authorization"];
      Guid userId = Guid.Parse(TokenService.DeserializeToken(Bearertoken));

      var result = new ReturnDto();

      var calculateCustomerBalanceResult = _customerBalanceService.CalculateCustomerBalance(customerId, userId);
      if(calculateCustomerBalanceResult == ResponseStatus.Ok)
      {
        result.Message = new Message
        {
          error = false,
          message = "Cálculo realizado com sucesso"
        };

        return Ok(result);
      }else if(calculateCustomerBalanceResult == ResponseStatus.BadRequest)
      {
        result.Message = new Message
        {
          error = true,
          message = "Falha ao realizar o cálculo"
        };
        return BadRequest(result);
      }
      throw new Exception("Error Calculate Customer Balance");
    }
  }
}
