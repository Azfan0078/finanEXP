using backend.Categories.Models;
using backend.Customers.Models;
using backend.models;
using backend.Shared.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Transactions.Models
{
  [Table("Transactions")]
  public class Transaction
  {
    [Required]
    public Guid Id { get; set; }

    [MaxLength(100)]
    public string? Description { get; set; }

    [Required]
    public decimal Value { get; set; }

    [Column(TypeName = "Date")]
    [Required]
    public DateTime Date { get; set; }

    [ForeignKey("Category")]
    public Guid? CategoryId { get; set; }
    public virtual Category? Category { get; set; }

    [Required]
    [ForeignKey("Custumer")]
    public Guid ReceiverCustomerId { get; set; }

    public virtual Customer ReceiverCustomer { get; set; }

    [ForeignKey("Custumer")]
    
    public Guid? SenderCustomerId { get; set; }

    public virtual Customer? SenderCustomer { get; set; }

    [Required]
    public TransactionType TransactionType { get; set; }

    [Required]
    [ForeignKey("Users")]
    public Guid UserId { get; set; }
    public virtual User User { get; set; }
  }
}
