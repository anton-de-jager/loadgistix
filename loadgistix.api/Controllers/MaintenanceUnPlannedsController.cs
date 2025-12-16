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
    public class MaintenanceUnPlannedsController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<MaintenanceUnPlannedHub, IMaintenanceUnPlannedHubClient> _maintenanceUnPlannedHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MaintenanceUnPlannedsController(IConfiguration config, IHubContext<MaintenanceUnPlannedHub, IMaintenanceUnPlannedHubClient> maintenanceUnPlannedHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _maintenanceUnPlannedHubContext = maintenanceUnPlannedHubContext;
        }

        // GET: api/MaintenanceUnPlanneds
        [HttpGet]
        public async Task<ProcedureResult> GetMaintenanceUnPlanned()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new MaintenanceUnPlanned(), new MaintenanceUnPlanned(), "maintenanceUnPlanned", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/MaintenanceUnPlanneds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceUnPlanned>> GetMaintenanceUnPlanned(Guid id)
        {
            MaintenanceUnPlanned request = new MaintenanceUnPlanned();
            request.Id = id;
            var maintenanceUnPlanned = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new MaintenanceUnPlanned(), "maintenanceUnPlanned", "select-single");

            if (maintenanceUnPlanned == null)
            {
                return NotFound();
            }

            return maintenanceUnPlanned;
        }

        // PUT: api/MaintenanceUnPlanneds/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutMaintenanceUnPlanned(MaintenanceUnPlanned maintenanceUnPlanned)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, maintenanceUnPlanned, new MaintenanceUnPlanned(), "maintenanceUnPlanned", "update");

            await _maintenanceUnPlannedHubContext.Clients.All.MaintenanceUnPlannedUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/MaintenanceUnPlanneds
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostMaintenanceUnPlanned(MaintenanceUnPlanned maintenanceUnPlanned)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, maintenanceUnPlanned, new MaintenanceUnPlanned(), "maintenanceUnPlanned", "insert");

            await _maintenanceUnPlannedHubContext.Clients.All.MaintenanceUnPlannedAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteMaintenanceUnPlanned(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            MaintenanceUnPlanned request = new MaintenanceUnPlanned();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new MaintenanceUnPlanned(), "maintenanceUnPlanned", "delete");

            await _maintenanceUnPlannedHubContext.Clients.All.MaintenanceUnPlannedDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
