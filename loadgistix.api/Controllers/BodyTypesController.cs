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
    public class BodyTypesController : ControllerBase
    {
        public IConfiguration _configuration; 
        public string connectionString;
        private readonly IHubContext<BodyTypeHub, IBodyTypeHubClient> _bodyTypeHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BodyTypesController(IConfiguration config, IHubContext<BodyTypeHub, IBodyTypeHubClient> bodyTypeHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config; 
            connectionString = config.GetConnectionString("DefaultConnection");
            _bodyTypeHubContext = bodyTypeHubContext;
        }

        // GET: api/BodyTypes
        [HttpGet]
        public async Task<ProcedureResult> GetBodyType()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new BodyType(), new BodyType(), "bodyType", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/BodyTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BodyType>> GetBodyType(Guid id)
        {
            BodyType request = new BodyType();
            request.Id = id;
            var bodyType = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new BodyType(), "bodyType", "select-single");

            if (bodyType == null)
            {
                return NotFound();
            }

            return bodyType;
        }

        // PUT: api/BodyTypes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutBodyType(BodyType bodyType)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, bodyType, new BodyType(), "bodyType", "update");

            await _bodyTypeHubContext.Clients.All.BodyTypeUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/BodyTypes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostBodyType(BodyType bodyType)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, bodyType, new BodyType(), "bodyType", "insert");

            await _bodyTypeHubContext.Clients.All.BodyTypeAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteBodyType(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            BodyType request = new BodyType();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new BodyType(), "bodyType", "delete");

            await _bodyTypeHubContext.Clients.All.BodyTypeDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
