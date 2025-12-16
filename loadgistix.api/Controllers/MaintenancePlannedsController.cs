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
    public class MaintenancePlannedsController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<MaintenancePlannedHub, IMaintenancePlannedHubClient> _maintenancePlannedHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MaintenancePlannedsController(IConfiguration config, IHubContext<MaintenancePlannedHub, IMaintenancePlannedHubClient> maintenancePlannedHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _maintenancePlannedHubContext = maintenancePlannedHubContext;
        }

        // GET: api/MaintenancePlanneds
        [HttpGet]
        public async Task<ProcedureResult> GetMaintenancePlanned()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new MaintenancePlanned(), new MaintenancePlanned(), "maintenancePlanned", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/MaintenancePlanneds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenancePlanned>> GetMaintenancePlanned(Guid id)
        {
            MaintenancePlanned request = new MaintenancePlanned();
            request.Id = id;
            var maintenancePlanned = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new MaintenancePlanned(), "maintenancePlanned", "select-single");

            if (maintenancePlanned == null)
            {
                return NotFound();
            }

            return maintenancePlanned;
        }

        // PUT: api/MaintenancePlanneds/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutMaintenancePlanned(MaintenancePlanned maintenancePlanned)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, maintenancePlanned, new MaintenancePlanned(), "maintenancePlanned", "update");

            await _maintenancePlannedHubContext.Clients.All.MaintenancePlannedUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/MaintenancePlanneds
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostMaintenancePlanned(MaintenancePlanned maintenancePlanned)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, maintenancePlanned, new MaintenancePlanned(), "maintenancePlanned", "insert");

            await _maintenancePlannedHubContext.Clients.All.MaintenancePlannedAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteMaintenancePlanned(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            MaintenancePlanned request = new MaintenancePlanned();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new MaintenancePlanned(), "maintenancePlanned", "delete");

            await _maintenancePlannedHubContext.Clients.All.MaintenancePlannedDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
