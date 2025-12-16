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
    public class MaintenanceUnPlannedTypesController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<MaintenanceUnPlannedTypeHub, IMaintenanceUnPlannedTypeHubClient> _maintenanceUnPlannedTypeHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MaintenanceUnPlannedTypesController(IConfiguration config, IHubContext<MaintenanceUnPlannedTypeHub, IMaintenanceUnPlannedTypeHubClient> maintenanceUnPlannedTypeHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _maintenanceUnPlannedTypeHubContext = maintenanceUnPlannedTypeHubContext;
        }

        // GET: api/MaintenanceUnPlannedTypes
        [HttpGet]
        public async Task<ProcedureResult> GetMaintenanceUnPlannedType()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new MaintenanceUnPlannedType(), new MaintenanceUnPlannedType(), "maintenanceUnPlannedType", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/MaintenanceUnPlannedTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceUnPlannedType>> GetMaintenanceUnPlannedType(Guid id)
        {
            MaintenanceUnPlannedType request = new MaintenanceUnPlannedType();
            request.Id = id;
            var maintenanceUnPlannedType = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new MaintenanceUnPlannedType(), "maintenanceUnPlannedType", "select-single");

            if (maintenanceUnPlannedType == null)
            {
                return NotFound();
            }

            return maintenanceUnPlannedType;
        }

        // PUT: api/MaintenanceUnPlannedTypes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutMaintenanceUnPlannedType(MaintenanceUnPlannedType maintenanceUnPlannedType)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, maintenanceUnPlannedType, new MaintenanceUnPlannedType(), "maintenanceUnPlannedType", "update");

            await _maintenanceUnPlannedTypeHubContext.Clients.All.MaintenanceUnPlannedTypeUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/MaintenanceUnPlannedTypes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostMaintenanceUnPlannedType(MaintenanceUnPlannedType maintenanceUnPlannedType)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, maintenanceUnPlannedType, new MaintenanceUnPlannedType(), "maintenanceUnPlannedType", "insert");

            await _maintenanceUnPlannedTypeHubContext.Clients.All.MaintenanceUnPlannedTypeAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteMaintenanceUnPlannedType(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            MaintenanceUnPlannedType request = new MaintenanceUnPlannedType();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new MaintenanceUnPlannedType(), "maintenanceUnPlannedType", "delete");

            await _maintenanceUnPlannedTypeHubContext.Clients.All.MaintenanceUnPlannedTypeDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
