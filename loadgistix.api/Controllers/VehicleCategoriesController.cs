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
    public class VehicleCategoriesController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<VehicleCategoryHub, IVehicleCategoryHubClient> _vehicleCategoryHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public VehicleCategoriesController(IConfiguration config, IHubContext<VehicleCategoryHub, IVehicleCategoryHubClient> vehicleCategoryHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _vehicleCategoryHubContext = vehicleCategoryHubContext;
        }

        // GET: api/VehicleCategories
        [HttpGet]
        public async Task<ProcedureResult> GetVehicleCategory()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new VehicleCategory(), new VehicleCategory(), "vehicleCategory", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/VehicleCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleCategory>> GetVehicleCategory(Guid id)
        {
            VehicleCategory request = new VehicleCategory();
            request.Id = id;
            var vehicleCategory = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new VehicleCategory(), "vehicleCategory", "select-single");

            if (vehicleCategory == null)
            {
                return NotFound();
            }

            return vehicleCategory;
        }

        // PUT: api/VehicleCategories/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutVehicleCategory(VehicleCategory vehicleCategory)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, vehicleCategory, new VehicleCategory(), "vehicleCategory", "update");

            await _vehicleCategoryHubContext.Clients.All.VehicleCategoryUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/VehicleCategories
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostVehicleCategory(VehicleCategory vehicleCategory)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, vehicleCategory, new VehicleCategory(), "vehicleCategory", "insert");

            await _vehicleCategoryHubContext.Clients.All.VehicleCategoryAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteVehicleCategory(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            VehicleCategory request = new VehicleCategory();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new VehicleCategory(), "vehicleCategory", "delete");

            await _vehicleCategoryHubContext.Clients.All.VehicleCategoryDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
