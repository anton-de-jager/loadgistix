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
    public class ReturnReasonsController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<ReturnReasonHub, IReturnReasonHubClient> _returnReasonHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ReturnReasonsController(IConfiguration config, IHubContext<ReturnReasonHub, IReturnReasonHubClient> returnReasonHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _returnReasonHubContext = returnReasonHubContext;
        }

        // GET: api/ReturnReasons
        [HttpGet]
        public async Task<ProcedureResult> GetReturnReason()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new ReturnReason(), new ReturnReason(), "returnReason", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/ReturnReasons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReturnReason>> GetReturnReason(Guid id)
        {
            ReturnReason request = new ReturnReason();
            request.Id = id;
            var returnReason = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new ReturnReason(), "returnReason", "select-single");

            if (returnReason == null)
            {
                return NotFound();
            }

            return returnReason;
        }

        // PUT: api/ReturnReasons/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutReturnReason(ReturnReason returnReason)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, returnReason, new ReturnReason(), "returnReason", "update");

            await _returnReasonHubContext.Clients.All.ReturnReasonUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/ReturnReasons
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostReturnReason(ReturnReason returnReason)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, returnReason, new ReturnReason(), "returnReason", "insert");

            await _returnReasonHubContext.Clients.All.ReturnReasonAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteReturnReason(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            ReturnReason request = new ReturnReason();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new ReturnReason(), "returnReason", "delete");

            await _returnReasonHubContext.Clients.All.ReturnReasonDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
