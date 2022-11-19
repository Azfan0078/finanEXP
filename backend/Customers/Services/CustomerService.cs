using backend.Contexts;
using backend.Customers.Dtos;
using backend.Customers.Models;
using backend.Shared.Classes;
using backend.Shared.Enums;

namespace backend.Customers.Services
{
  public class CustomerService : ICustomerService
  {
    private readonly FinEXPDatabaseContext _context;

    public CustomerService(FinEXPDatabaseContext context)
    {
      _context = context;
    }
    public ResponseStatus CreateCustomer(Customer customer)
    {
      var customerFromDatabase = GetCustomerByName(customer);

      if (customerFromDatabase == null)
      {
        customer.TransferValue = 0;
        customer.ActualBalance = customer.InitialBalance;
        _context.Customers.Add(customer);
        SaveChanges();
        return ResponseStatus.Ok;
      }
      else
      {
        return ResponseStatus.AlreadyExists;
      }

    }

    public bool SaveChanges()
    {
      return _context.SaveChanges() >= 0;
    }

    public Customer? GetCustomerByName(Customer newCustomer)
    {
      return _context.Customers.FirstOrDefault(customer =>
        customer.UserId == newCustomer.UserId
        && customer.Name == newCustomer.Name
      );
    }
    public ResponseStatus<List<Customer>> GetAllCustomers(Guid userId, GetAllFilter? filter)
    {
      var customers = new List<Customer>();
      if (filter == null)
      {
        customers = _context.Customers.Where(customer => customer.UserId == userId).ToList();
      }
      else
      {
        customers = _context.Customers.Where(customer => customer.UserId == userId
         && filter.CustomersIds.Contains(customer.Id)).ToList();
      }


      if (customers != null)
      {
        return new ResponseStatus<List<Customer>> { Status = ResponseStatus.Ok, Content = customers };
      }

      return new ResponseStatus<List<Customer>>
      {
        Status = ResponseStatus.NotFound,
      };

    }

    public ResponseStatus<Customer> GetCustomerById(Guid id, Guid userId)
    {
      var customer = _context.Customers.FirstOrDefault(customer => customer.Id == id && customer.UserId == userId);
      if (customer != null)
      {

        return new ResponseStatus<Customer> { Status = ResponseStatus.Ok, Content = customer };

      }

      return new ResponseStatus<Customer>
      {
        Status = ResponseStatus.NotFound,
      };
    }

    public ResponseStatus UpdateCustomer(Guid id, Customer newCustomer)
    {
      var verifyExistingCustomer = GetCustomerByName(newCustomer);

      if (verifyExistingCustomer == null || verifyExistingCustomer.Id == id)
      {
        var userFromDataBase = GetCustomerById(id, newCustomer.UserId);

        userFromDataBase.Content.InitialBalance = newCustomer.InitialBalance;
        userFromDataBase.Content.Name = newCustomer.Name;
        userFromDataBase.Content.Type = newCustomer.Type;

        _context.Customers.Update(userFromDataBase.Content);
        SaveChanges();
        return ResponseStatus.Ok;
      }
      else
      {
        return ResponseStatus.AlreadyExists;
      }
      return ResponseStatus.BadRequest;
    }
    public ResponseStatus BatchUpdateCustomer(List<Customer> customers)
    {
      foreach (var customer in customers)
      {
        _context.Customers.Update(customer);
      }
      SaveChanges();

      return ResponseStatus.Ok;
    }
    public ResponseStatus DeleteCustomer(Guid id, Guid userId)
    {
      var getCustomerByIdResult = GetCustomerById(id, userId);
      if (getCustomerByIdResult.Status == ResponseStatus.Ok)
      {
        _context.Customers.Remove(getCustomerByIdResult.Content);
        SaveChanges();
        return ResponseStatus.Ok;
      }
      return ResponseStatus.BadRequest;
    }
  }
}

