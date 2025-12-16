using loadgistix.api.Helpers;
using loadgistix.api.Models;
using Microsoft.AspNetCore.Mvc;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<VehicleHub, IVehicleHubClient> _vehicleHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public VehiclesController(IConfiguration config, IHubContext<VehicleHub, IVehicleHubClient> vehicleHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _vehicleHubContext = vehicleHubContext;
        }

        [HttpGet]
        public async Task<ProcedureResult> GetVehicles()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Vehicle request = new Vehicle();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Vehicle(), "vehicle", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetVehicle(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return Unauthorized();
            }

            Vehicle request = new Vehicle();
            request.Id = id;
            var vehicle = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Vehicle(), "vehicle", "select-single");

            if (vehicle == null)
            {
                return NotFound();
            }

            return vehicle;
        }

        [HttpPut]
        public async Task<ProcedureResult> PutVehicle(Vehicle vehicle)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            vehicle.UserId = uid;
            vehicle.UserDescription = displayName;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, vehicle, new Vehicle(), "vehicle", "update");

            await _vehicleHubContext.Clients.All.VehicleUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost]
        public async Task<ProcedureResult> PostVehicle(Vehicle vehicle)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            vehicle.UserId = uid;
            vehicle.UserDescription = displayName;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, vehicle, new Vehicle(), "vehicle", "insert");
            

            await _vehicleHubContext.Clients.All.VehicleAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteVehicle(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Vehicle request = new Vehicle();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Vehicle(), "vehicle", "delete");

            await _vehicleHubContext.Clients.All.VehicleDeleted(id);

            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }


        //[Authorize]
        [HttpPost("uploadImage/{filename}"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadAsync(string filename)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Images", "Vehicles");
                var pathToSave = Path.Combine(System.IO.Directory.GetCurrentDirectory(), folderName);
                if (file.Length > 0)
                {
                    var fullPath = Path.Combine(pathToSave, filename + ".jpg");
                    var dbPath = Path.Combine(folderName, filename + ".jpg");
                    using (var stream = new FileStream(fullPath, FileMode.OpenOrCreate))
                    {
                        file.CopyTo(stream);
                        stream.Flush();
                        stream.Close();
                    }
                    Vehicle request = new Vehicle();
                    request.Id = Guid.Parse(filename);
                    request.Avatar = ".jpg";

                    var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Vehicle(), "vehicle", "update-image");

                    await _vehicleHubContext.Clients.All.VehicleUpdated(result);
                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}
