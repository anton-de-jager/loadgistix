using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using loadgistix.api.Models;
using loadgistix.api.Helpers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IO;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertsController : ControllerBase
    {
        public IConfiguration _configuration; public string connectionString;
        private readonly IHubContext<AdvertHub, IAdvertHubClient> _advertHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AdvertsController(IConfiguration config, IHubContext<AdvertHub, IAdvertHubClient> advertHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _advertHubContext = advertHubContext;
        }

        // GET: api/Adverts
        //[Authorize]
        [HttpGet]
        public async Task<ProcedureResult> GetAdvert()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Advert request = new Advert();
            request.UserId = uid;
            request.UserDescription = displayName;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Advert(), "advert", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/Adverts/user
        [HttpPost("available")]
        public async Task<ProcedureResult> GetAdvertsAvailable()
        {
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new Advert(), new Advert(), "advert", "select-available");

            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/Adverts/5
        //[Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Advert>> GetAdvert(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return Unauthorized();
            }

            Advert request = new Advert();
            request.Id = id;
            var advert = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Advert(), "advert", "select-single");

            if (advert == null)
            {
                return NotFound();
            }

            return advert;
        }

        // PUT: api/Adverts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        //[Authorize]
        [HttpPut]
        public async Task<ProcedureResult> PutAdvert(Advert advert)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, advert, new Advert(), "advert", "update");
            await _advertHubContext.Clients.All.AdvertUpdated(result);

            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/Adverts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        //[Authorize]
        [HttpPost]
        public async Task<ProcedureResult> PostAdvert(Advert advert)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            advert.UserId = uid;
            advert.UserDescription = displayName;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, advert, new Advert(), "advert", "insert");
            await _advertHubContext.Clients.All.AdvertAdded(result);

            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // DELETE: api/Adverts/5
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteAdvert(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Advert request = new Advert();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Advert(), "advert", "delete");
            await _advertHubContext.Clients.All.AdvertDeleted(id);

            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }

        //[Authorize]
        [HttpPost("uploadImage/{filename}"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadAsync(string filename)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Images", "Adverts");
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
                    Advert request = new Advert();
                    request.Id = Guid.Parse(filename);
                    request.Avatar = ".jpg";

                    var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Advert(), "advert", "update-image");

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
