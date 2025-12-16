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
    public class BodyLoadsController : ControllerBase
    {
        public IConfiguration _configuration; public string connectionString;
        private readonly IHubContext<BodyLoadHub, IBodyLoadHubClient> _bodyLoadHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BodyLoadsController(IConfiguration config, IHubContext<BodyLoadHub, IBodyLoadHubClient> bodyLoadHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config; 
            connectionString = config.GetConnectionString("DefaultConnection");
            _bodyLoadHubContext = bodyLoadHubContext;
        }

        // GET: api/BodyLoads
        [HttpGet]
        public async Task<ProcedureResult> GetBodyLoad()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new BodyLoad(), new BodyLoad(), "bodyLoad", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/BodyLoads/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BodyLoad>> GetBodyLoad(Guid id)
        {
            BodyLoad request = new BodyLoad();
            request.Id = id;
            var bodyLoad = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new BodyLoad(), "bodyLoad", "select-single");

            if (bodyLoad == null)
            {
                return NotFound();
            }

            return bodyLoad;
        }

        // PUT: api/BodyLoads/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutBodyLoad(BodyLoad bodyLoad)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, bodyLoad, new BodyLoad(), "bodyLoad", "update");

            await _bodyLoadHubContext.Clients.All.BodyLoadUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/BodyLoads
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostBodyLoad(BodyLoad bodyLoad)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, bodyLoad, new BodyLoad(), "bodyLoad", "insert");

            await _bodyLoadHubContext.Clients.All.BodyLoadAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteBodyLoad(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            BodyLoad request = new BodyLoad();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new BodyLoad(), "bodyLoad", "delete");

            await _bodyLoadHubContext.Clients.All.BodyLoadDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
