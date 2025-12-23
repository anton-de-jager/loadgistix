using loadgistix.api.Helpers;
using loadgistix.api.Models;
using Microsoft.AspNetCore.Mvc;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.Net.Http.Headers;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<UserHub, IUserHubClient> _userHubContext;
        public UsersController(IConfiguration config, IHubContext<UserHub, IUserHubClient> userHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _userHubContext = userHubContext;
        }

        [HttpPut]
        public async Task<ProcedureResult> PutUser(User user)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, user, new User(), "user", "update");
            
            // Only notify if result is not null
            if (result != null)
            {
                await _userHubContext.Clients.All.UserUpdated(result);
                return new ProcedureResult { Result = true, Id = result.Id, Data = result };
            }
            
            // If result is null, return the input user as fallback
            return new ProcedureResult { Result = true, Id = user.Id ?? Guid.Empty, Data = user };
        }

        //[Authorize]
        [HttpPost("uploadImage/{filename}"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadAsync(string filename)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Images", "Users");
                var pathToSave = Path.Combine(System.IO.Directory.GetCurrentDirectory(), folderName);
                
                // Ensure directory exists
                if (!System.IO.Directory.Exists(pathToSave))
                {
                    System.IO.Directory.CreateDirectory(pathToSave);
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
                    User request = new User();
                    request.Id = Guid.Parse(filename);
                    request.Avatar = ".jpg";

                    var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new User(), "user", "update-image");

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
