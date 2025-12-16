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
    public class VehicleTypesController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<VehicleTypeHub, IVehicleTypeHubClient> _vehicleTypeHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public VehicleTypesController(IConfiguration config, IHubContext<VehicleTypeHub, IVehicleTypeHubClient> vehicleTypeHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _vehicleTypeHubContext = vehicleTypeHubContext;
        }

        // GET: api/VehicleTypes
        [HttpGet]
        public async Task<ProcedureResult> GetVehicleType()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new VehicleType(), new VehicleType(), "vehicleType", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/VehicleTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleType>> GetVehicleType(Guid id)
        {
            VehicleType request = new VehicleType();
            request.Id = id;
            var vehicleType = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new VehicleType(), "vehicleType", "select-single");

            if (vehicleType == null)
            {
                return NotFound();
            }

            return vehicleType;
        }

        // PUT: api/VehicleTypes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutVehicleType(VehicleType vehicleType)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, vehicleType, new VehicleType(), "vehicleType", "update");

            await _vehicleTypeHubContext.Clients.All.VehicleTypeUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/VehicleTypes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostVehicleType(VehicleType vehicleType)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, vehicleType, new VehicleType(), "vehicleType", "insert");

            await _vehicleTypeHubContext.Clients.All.VehicleTypeAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteVehicleType(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            VehicleType request = new VehicleType();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new VehicleType(), "vehicleType", "delete");

            await _vehicleTypeHubContext.Clients.All.VehicleTypeDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
