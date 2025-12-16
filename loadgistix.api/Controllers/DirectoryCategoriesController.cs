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
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectoryCategoriesController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<DirectoryCategoryHub, IDirectoryCategoryHubClient> _directoryCategoryHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public DirectoryCategoriesController(IConfiguration config, IHubContext<DirectoryCategoryHub, IDirectoryCategoryHubClient> directoryCategoryHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config; 
            connectionString = config.GetConnectionString("DefaultConnection");
            _directoryCategoryHubContext = directoryCategoryHubContext;
        }

        // GET: api/DirectoryCategories
        [HttpGet]
        public async Task<ProcedureResult> GetDirectoryCategory()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new DirectoryCategory(), new DirectoryCategory(), "directoryCategory", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // POST: api/DirectoryCategories/all
        [HttpPost("available")]
        public async Task<ProcedureResult> GetDirectoryCategoriesAll(int distance)
        {
            DirectoryCategory directoryCategory = new DirectoryCategory();
            directoryCategory.DirectoryCount = distance;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, directoryCategory, new DirectoryCategory(), "directoryCategory", "available");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/DirectoryCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DirectoryCategory>> GetDirectoryCategory(Guid id)
        {
            DirectoryCategory request = new DirectoryCategory();
            request.Id = id;
            var directoryCategory = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new DirectoryCategory(), "directoryCategory", "select-single");

            if (directoryCategory == null)
            {
                return NotFound();
            }

            return directoryCategory;
        }

        // PUT: api/DirectoryCategories/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutDirectoryCategory(DirectoryCategory directoryCategory)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, directoryCategory, new DirectoryCategory(), "directoryCategory", "update");
            await _directoryCategoryHubContext.Clients.All.DirectoryCategoryUpdated(result);

            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/DirectoryCategories
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostDirectoryCategory(DirectoryCategory directoryCategory)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, directoryCategory, new DirectoryCategory(), "directoryCategory", "insert");
            await _directoryCategoryHubContext.Clients.All.DirectoryCategoryAdded(result);

            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteDirectoryCategory(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            DirectoryCategory request = new DirectoryCategory();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new DirectoryCategory(), "directoryCategory", "delete");
            await _directoryCategoryHubContext.Clients.All.DirectoryCategoryDeleted(id);

            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
