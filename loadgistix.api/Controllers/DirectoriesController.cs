using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using loadgistix.api.Models; using loadgistix.api.Helpers;
using System.IO;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectoriesController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<DirectoryHub, IDirectoryHubClient> _directoryHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public DirectoriesController(IConfiguration config, IHubContext<DirectoryHub, IDirectoryHubClient> directoryHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config; 
            connectionString = config.GetConnectionString("DefaultConnection");
            _directoryHubContext = directoryHubContext;
        }

        // GET: api/Directories
        //[Authorize]
        [HttpGet]
        public async Task<ProcedureResult> GetDirectory()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Models.Directory request = new Models.Directory();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Models.Directory(), "directory", "select");
           
            return new ProcedureResult { Result = true, Data = result };
        }

        // POST: api/Directories/all
        [HttpPost("all")]
        public async Task<ProcedureResult> GetDirectoriesAll()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Models.Directory request = new Models.Directory();
            request.UserId = uid;
            request.UserDescription = displayName;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Models.Directory(), "directory", "select");
            return new ProcedureResult { Result = true, Data = result };
        }


        [HttpPost("available")]
        async public Task<ProcedureResult> GetDirectoriesAvailable(DirectoriesAvailableRequest request)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            List<KeyValuePair<string, object>> parms = new List<KeyValuePair<string, object>>();
            parms.Add(new KeyValuePair<string, object>("directoryCategories", request.DirectoryCategories != null ? request.DirectoryCategories.Replace(" ", "") : ""));
            parms.Add(new KeyValuePair<string, object>("lat", request.Lat != null ? request.Lat : 0));
            parms.Add(new KeyValuePair<string, object>("lon", request.Lon != null ? request.Lon : 0));
            parms.Add(new KeyValuePair<string, object>("distance", request.Distance != null ? request.Distance : 0));
            var result = await DataTypeHelper.GetFromStoredProcedureAsync(connectionString, new Models.Directory(), "usp_action_directories_available", parms);

            return new ProcedureResult { Result = true, Data = result };
        }
        //// POST: api/Directories/all
        //[HttpPost("available")]
        //public async Task<ProcedureResult> GetDirectoriesAvailable()
        //{
        //    var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        //    var token = authHeader?.Split(' ')[1];

        //    if (token == null)
        //    {
        //        return new ProcedureResult { Result = false, Data = "Unauthorised" };
        //    }

        //    var decodedToken = await FirebaseAdmin.Auth.FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);

        //    var uid = decodedToken.Uid;
        //    var displayName = decodedToken.Claims.FirstOrDefault(c => c.Key == "name").Value?.ToString() ?? "";

        //    var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new Models.Directory(), new Models.Directory(), "directory", "select-available");
        //    return new ProcedureResult { Result = true, Data = result };
        //}

        // POST: api/Directories/category/5
        [HttpPost("category/{directoryCategoryId}/{startIndex}")]
        public async Task<ProcedureResult> GetDirectoriesAvailable(Guid directoryCategoryId, int startIndex)
        {
            List<KeyValuePair<string, object>> parms = new List<KeyValuePair<string, object>>();
            parms.Add(new KeyValuePair<string, object>("categoryId", directoryCategoryId));
            parms.Add(new KeyValuePair<string, object>("startIndex", startIndex));
            parms.Add(new KeyValuePair<string, object>("rows", 10));
            var result = await DataTypeHelper.GetFromStoredProcedureAsync(connectionString, new Models.Directory(), "usp_action_directory_by_category", parms);

            return new ProcedureResult { Result = true, Data = result };
        }

        // POST: api/Directories/category/5
        [HttpPost("distance")]
        public async Task<ProcedureResult> GetDirectoriesByDistance(DirectoryRequest request)
        {
            List<KeyValuePair<string, object>> parms = new List<KeyValuePair<string, object>>();
            parms.Add(new KeyValuePair<string, object>("lat", request.Lat != null ? request.Lat : 0));
            parms.Add(new KeyValuePair<string, object>("lon", request.Lon != null ? request.Lon : 0));
            parms.Add(new KeyValuePair<string, object>("distance", request.Distance != null ? request.Distance : 0));
            var result = await DataTypeHelper.GetFromStoredProcedureAsync(connectionString, new Models.Directory(), "usp_action_directory_by_distance", parms);

            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/Directories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Models.Directory>> GetDirectory(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return Unauthorized();
            }

            Models.Directory request = new Models.Directory();
            request.Id = id;
            var directory = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Models.Directory(), "directory", "select-single");

            if (directory == null)
            {
                return NotFound();
            }

            return directory;
        }

        // PUT: api/Directories/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        //[Authorize]
        [HttpPut]
        public async Task<ProcedureResult> PutDirectory(Models.Directory directory)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, directory, new Models.Directory(), "directory", "update");
            await _directoryHubContext.Clients.All.DirectoryUpdated(result);

            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/Directories
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        //[Authorize]
        [HttpPost]
        public async Task<ProcedureResult> PostDirectory(Models.Directory directory)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            directory.UserId = uid;
            directory.UserDescription = displayName;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, directory, new Models.Directory(), "directory", "insert");
            await _directoryHubContext.Clients.All.DirectoryAdded(result);

            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // DELETE: api/Directories/5
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteDirectory(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Models.Directory request = new Models.Directory();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Models.Directory(), "directory", "delete");
            await _directoryHubContext.Clients.All.DirectoryDeleted(id);

            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }

        [HttpPost("uploadImage/{filename}"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadAsync(string filename)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Images", "Directories");
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
                    Models.Directory request = new Models.Directory();
                    request.Id = Guid.Parse(filename);
                    request.Avatar = ".jpg";

                    var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Models.Directory(), "directory", "update-image");

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
