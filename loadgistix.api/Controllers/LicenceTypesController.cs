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
    public class LicenceTypesController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<LicenceTypeHub, ILicenceTypeHubClient> _licenceTypeHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public LicenceTypesController(IConfiguration config, IHubContext<LicenceTypeHub, ILicenceTypeHubClient> licenceTypeHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _licenceTypeHubContext = licenceTypeHubContext;
        }

        // GET: api/LicenceTypes
        [HttpGet]
        public async Task<ProcedureResult> GetLicenceType()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new LicenceType(), new LicenceType(), "licenceType", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/LicenceTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LicenceType>> GetLicenceType(Guid id)
        {
            LicenceType request = new LicenceType();
            request.Id = id;
            var licenceType = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new LicenceType(), "licenceType", "select-single");

            if (licenceType == null)
            {
                return NotFound();
            }

            return licenceType;
        }

        // PUT: api/LicenceTypes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutLicenceType(LicenceType licenceType)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, licenceType, new LicenceType(), "licenceType", "update");

            await _licenceTypeHubContext.Clients.All.LicenceTypeUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/LicenceTypes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostLicenceType(LicenceType licenceType)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, licenceType, new LicenceType(), "licenceType", "insert");

            await _licenceTypeHubContext.Clients.All.LicenceTypeAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteLicenceType(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            LicenceType request = new LicenceType();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new LicenceType(), "licenceType", "delete");

            await _licenceTypeHubContext.Clients.All.LicenceTypeDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
