using Ben.Diagnostics;
using loadgistix.api.Auth;
using loadgistix.api.Hubs;
using loadgistix.api.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PayFast;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;

// Add services to the container.

// For Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

// For Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Adding Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})

// Adding Jwt Bearer
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        //ValidAudience = configuration["JWT:ValidAudience"],
        //ValidIssuer = configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.Services.Configure<PayFastSettings>(configuration.GetSection("PayFastSettings"));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Loadgistix API", Version = "v1", Description = "Logistics management API" });
    // Additional Swagger configuration as needed
});

builder.Services.AddSignalR();
builder.Services.AddSingleton<AdvertHub>();
builder.Services.AddSingleton<AxelHub>();
builder.Services.AddSingleton<BidHub>();
builder.Services.AddSingleton<BodyLoadHub>();
builder.Services.AddSingleton<BodyTypeHub>();
builder.Services.AddSingleton<BranchHub>();
builder.Services.AddSingleton<CompanyTypeHub>();
builder.Services.AddSingleton<DirectoryCategoryHub>();
builder.Services.AddSingleton<DirectoryHub>();
builder.Services.AddSingleton<DriverHub>();
builder.Services.AddSingleton<FuelHub>();
builder.Services.AddSingleton<LicenceTypeHub>();
builder.Services.AddSingleton<LoadHub>();
builder.Services.AddSingleton<LoadDestinationHub>();
builder.Services.AddSingleton<LoadTypeHub>();
builder.Services.AddSingleton<MaintenancePlannedHub>();
builder.Services.AddSingleton<MaintenancePlannedTypeHub>();
builder.Services.AddSingleton<MaintenanceUnPlannedHub>();
builder.Services.AddSingleton<MaintenanceUnPlannedTypeHub>();
builder.Services.AddSingleton<MakeHub>();
builder.Services.AddSingleton<ModelHub>();
builder.Services.AddSingleton<PdpHub>();
builder.Services.AddSingleton<ReturnReasonHub>();
builder.Services.AddSingleton<ReviewDriverHub>();
builder.Services.AddSingleton<ReviewLoadHub>();
builder.Services.AddSingleton<StockProblemHub>();
builder.Services.AddSingleton<TransactionHub>();
builder.Services.AddSingleton<UserHub>();
builder.Services.AddSingleton<VehicleCategoryHub>();
builder.Services.AddSingleton<VehicleHub>();
builder.Services.AddSingleton<VehicleTypeHub>();

builder.Services.AddScoped<IUserRepository, UserRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
// Enable Swagger in all environments for API testing
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Loadgistix API V1");
    // Additional Swagger UI configuration as needed
});

app.UseHttpsRedirection();

app.UseRouting();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Blocking detection disabled - Microsoft.Data.SqlClient has some internal blocking during
// connection pool initialization and retry logic setup. These are one-time costs.
// The actual database operations are fully async.
// app.UseBlockingDetection();

app.UseCors("AllowOrigin");

app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(System.IO.Directory.GetCurrentDirectory(), @"Images")),
    RequestPath = new PathString("/Images")
});

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");
    endpoints.MapHub<AdvertHub>("/hubs/advertHub");
    endpoints.MapHub<AxelHub>("/hubs/axelHub");
    endpoints.MapHub<BidHub>("/hubs/bidHub");
    endpoints.MapHub<BodyLoadHub>("/hubs/bodyLoadHub");
    endpoints.MapHub<BodyTypeHub>("/hubs/bodyTypeHub");
    endpoints.MapHub<BranchHub>("/hubs/branchHub");
    endpoints.MapHub<CompanyTypeHub>("/hubs/companyTypeHub");
    endpoints.MapHub<DirectoryCategoryHub>("/hubs/directoryCategoryHub");
    endpoints.MapHub<DirectoryHub>("/hubs/directoryHub");
    endpoints.MapHub<DriverHub>("/hubs/driverHub");
    endpoints.MapHub<FuelHub>("/hubs/fuelHub");
    endpoints.MapHub<LicenceTypeHub>("/hubs/licenceTypeHub");
    endpoints.MapHub<LoadHub>("/hubs/loadHub");
    endpoints.MapHub<LoadDestinationHub>("/hubs/loadDestinationHub");
    endpoints.MapHub<LoadTypeHub>("/hubs/loadTypeHub");
    endpoints.MapHub<MaintenancePlannedHub>("/hubs/maintenancePlannedHub");
    endpoints.MapHub<MaintenancePlannedTypeHub>("/hubs/maintenancePlannedTypeHub");
    endpoints.MapHub<MaintenanceUnPlannedHub>("/hubs/maintenanceUnPlannedHub");
    endpoints.MapHub<MaintenanceUnPlannedTypeHub>("/hubs/maintenanceUnPlannedTypeHub");
    endpoints.MapHub<MakeHub>("/hubs/makeHub");
    endpoints.MapHub<ModelHub>("/hubs/modelHub");
    endpoints.MapHub<PdpHub>("/hubs/pdpHub");
    endpoints.MapHub<ReturnReasonHub>("/hubs/returnReasonHub");
    endpoints.MapHub<ReviewDriverHub>("/hubs/reviewDriverHub");
    endpoints.MapHub<ReviewLoadHub>("/hubs/reviewLoadHub");
    endpoints.MapHub<StockProblemHub>("/hubs/stockProblemHub");
    endpoints.MapHub<TransactionHub>("/hubs/transactionHub");
    endpoints.MapHub<UserHub>("/hubs/userHub");
    endpoints.MapHub<VehicleCategoryHub>("/hubs/vehicleCategoryHub");
    endpoints.MapHub<VehicleHub>("/hubs/vehicleHub");
    endpoints.MapHub<VehicleTypeHub>("/hubs/vehicleTypeHub");
});

app.MapControllers();

app.Run();