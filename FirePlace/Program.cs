using Microsoft.EntityFrameworkCore;
using FirePlace;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.


//Register services here
builder.Services.AddDbContext<FirePlaceDbContext>(options => options.UseSqlServer(
builder.Configuration.GetConnectionString("DefaultConnection")
));



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Add Cors
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//add cors
app.UseCors(builder =>
builder.AllowAnyOrigin()
.AllowAnyHeader()
.AllowAnyMethod());

app.UseAuthorization();

app.MapControllers();

app.Run();
