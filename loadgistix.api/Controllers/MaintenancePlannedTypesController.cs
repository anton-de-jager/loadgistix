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
    public class MaintenancePlannedTypesController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<MaintenancePlannedTypeHub, IMaintenancePlannedTypeHubClient> _maintenancePlannedTypeHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MaintenancePlannedTypesController(IConfiguration config, IHubContext<MaintenancePlannedTypeHub, IMaintenancePlannedTypeHubClient> maintenancePlannedTypeHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _maintenancePlannedTypeHubContext = maintenancePlannedTypeHubContext;
        }

        // GET: api/MaintenancePlannedTypes
        [HttpGet]
        public async Task<ProcedureResult> GetMaintenancePlannedType()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new MaintenancePlannedType(), new MaintenancePlannedType(), "maintenancePlannedType", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/MaintenancePlannedTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenancePlannedType>> GetMaintenancePlannedType(Guid id)
        {
            MaintenancePlannedType request = new MaintenancePlannedType();
            request.Id = id;
            var maintenancePlannedType = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new MaintenancePlannedType(), "maintenancePlannedType", "select-single");

            if (maintenancePlannedType == null)
            {
                return NotFound();
            }

            return maintenancePlannedType;
        }

        // PUT: api/MaintenancePlannedTypes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutMaintenancePlannedType(MaintenancePlannedType maintenancePlannedType)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, maintenancePlannedType, new MaintenancePlannedType(), "maintenancePlannedType", "update");

            await _maintenancePlannedTypeHubContext.Clients.All.MaintenancePlannedTypeUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/MaintenancePlannedTypes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostMaintenancePlannedType(MaintenancePlannedType maintenancePlannedType)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, maintenancePlannedType, new MaintenancePlannedType(), "maintenancePlannedType", "insert");

            await _maintenancePlannedTypeHubContext.Clients.All.MaintenancePlannedTypeAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteMaintenancePlannedType(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            MaintenancePlannedType request = new MaintenancePlannedType();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new MaintenancePlannedType(), "maintenancePlannedType", "delete");

            await _maintenancePlannedTypeHubContext.Clients.All.MaintenancePlannedTypeDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
