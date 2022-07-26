using backend;
using backend.Authenticate.Services;
using backend.Categories.Services;
using backend.Contexts;
using backend.Customers.Services;
using backend.Shared.Users.Services;
using backend.Transactions.Services;
using backend.Users.PerfilPhotos.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.

builder.Services.AddControllers();

var key = Encoding.ASCII.GetBytes(Settings.Secret);

builder.Services.AddAuthentication(x =>
{
  x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
  x.RequireHttpsMetadata = false;
  x.SaveToken = true;
  x.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = new SymmetricSecurityKey(key),
    ValidateIssuer = false,
    ValidateAudience = false,
    ClockSkew = TimeSpan.Zero,

  };
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<IUserDatabaseService, UserDatabaseService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IAuthUserService, AuthUserService>();
builder.Services.AddScoped<IPerfilPhotoService, PerfilPhotoService>();
builder.Services.AddScoped<ICategoriesService, CategoriesService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ICustomerBalanceService, CustomerBalanceService>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddCors(options =>
{
  options.AddPolicy("corsPolicy", build =>
  {
    build.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
  });

});

builder.Services.AddDbContext<FinEXPDatabaseContext>(options => options.UseNpgsql($"Server={Settings.DatabaseHost};Port={Settings.DatabasePort};Pooling=true;Database={Settings.DatabaseName};User Id={Settings.DatabaseUser};Password={Settings.DatabasePassword};"));
var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors("corsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
