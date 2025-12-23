using loadgistix.api.Helpers;
using loadgistix.api.Models;
using Microsoft.AspNetCore.Mvc;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace drivergistix_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriversController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<DriverHub, IDriverHubClient> _driverHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public DriversController(IConfiguration config, IHubContext<DriverHub, IDriverHubClient> driverHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _driverHubContext = driverHubContext;
        }

        [HttpGet]
        public async Task<ProcedureResult> GetDrivers()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Driver request = new Driver();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Driver(), "driver", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Driver>> GetDriver(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return Unauthorized();
            }

            Driver request = new Driver();
            request.Id = id;
            var driver = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Driver(), "driver", "select-single");

            if (driver == null)
            {
                return NotFound();
            }

            return driver;
        }

        [HttpPut]
        public async Task<ProcedureResult> PutDriver(Driver driver)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            driver.UserId = uid;
            driver.UserDescription = displayName;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, driver, new Driver(), "driver", "update");

            await _driverHubContext.Clients.All.DriverUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost]
        public async Task<ProcedureResult> PostDriver(Driver driver)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            driver.UserId = uid;
            driver.UserDescription = displayName;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, driver, new Driver(), "driver", "insert");
            await _driverHubContext.Clients.All.DriverAdded(result);

            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteDriver(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Driver request = new Driver();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Driver(), "driver", "delete");

            await _driverHubContext.Clients.All.DriverDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }


        //[Authorize]
        [HttpPost("uploadImage/{filename}"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadAsync(string filename)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Images", "Drivers");
                var pathToSave = Path.Combine(System.IO.Directory.GetCurrentDirectory(), folderName);
                
                // Ensure directory exists
                if (!Directory.Exists(pathToSave))
                {
                    Directory.CreateDirectory(pathToSave);
                }
                
                if (file.Length > 0)
                {
                    var fullPath = Path.Combine(pathToSave, filename + ".jpg");
                    var dbPath = Path.Combine(folderName, filename + ".jpg");
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                        stream.Flush();
                        stream.Close();
                    }
                    Driver request = new Driver();
                    request.Id = Guid.Parse(filename);
                    request.Avatar = ".jpg";

                    var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Driver(), "driver", "update-image");

                    await _driverHubContext.Clients.All.DriverUpdated(result);
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


        //[Authorize]
        [HttpPost("uploadImagePdp/{filename}"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadPdpAsync(string filename)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Images", "Pdps");
                var pathToSave = Path.Combine(System.IO.Directory.GetCurrentDirectory(), folderName);
                
                // Ensure directory exists
                if (!Directory.Exists(pathToSave))
                {
                    Directory.CreateDirectory(pathToSave);
                }
                
                if (file.Length > 0)
                {
                    var fullPath = Path.Combine(pathToSave, filename + ".jpg");
                    var dbPath = Path.Combine(folderName, filename + ".jpg");
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                        stream.Flush();
                        stream.Close();
                    }
                    Driver request = new Driver();
                    request.Id = Guid.Parse(filename);
                    request.AvatarPdp = ".jpg";

                    var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Driver(), "driver", "update-image-pdp");

                    await _driverHubContext.Clients.All.DriverUpdated(result);
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
