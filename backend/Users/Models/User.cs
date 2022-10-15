using backend.Customers.Models;
using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.models
{
  [Table("Users")]
  public class User
  {
    [Key]
    public Guid ID { get; set; }

    [Required]
    [MaxLength(256)]
    public string name { get; set; } = "";

    
    [Required]
    [MaxLength(256)]
    public string email { get; set; } = "";

    [Required]
    [MaxLength(250)]
    public string password { get; set; } = "";

    public Byte[]? perfilPhoto { get; set; }

    public List<Customer> Customers { get; set; }

  }
}