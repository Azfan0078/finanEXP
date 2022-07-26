using System.Text;

namespace backend.Shared.Dtos
{
  public class UserReadDto
  {
    public Guid Id { get; set; }

    public string Name { get; set; } = "";

    public string Email { get; set; } = "";

    public string? PerfilPhotoId { get; set; }

  }
}
