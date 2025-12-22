using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using loadgistix.api.Models;
using loadgistix.api.Helpers;
using System.Security.Claims;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OwnedRentedsController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public OwnedRentedsController(IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
        }

        // GET: api/OwnedRenteds - No auth required for lookup data
        [HttpGet]
        public async Task<ProcedureResult> GetOwnedRenteds()
        {
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new OwnedRented(), new OwnedRented(), "ownedRented", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/OwnedRenteds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OwnedRented>> GetOwnedRented(Guid id)
        {
            OwnedRented request = new OwnedRented();
            request.Id = id;
            var ownedRented = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new OwnedRented(), "ownedRented", "select-single");

            if (ownedRented == null)
            {
                return NotFound();
            }

            return ownedRented;
        }

        // PUT: api/OwnedRenteds
        [HttpPut]
        public async Task<ProcedureResult> PutOwnedRented(OwnedRented ownedRented)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, ownedRented, new OwnedRented(), "ownedRented", "update");
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/OwnedRenteds
        [HttpPost]
        public async Task<ProcedureResult> PostOwnedRented(OwnedRented ownedRented)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, ownedRented, new OwnedRented(), "ownedRented", "insert");
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteOwnedRented(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            OwnedRented request = new OwnedRented();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new OwnedRented(), "ownedRented", "delete");

            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}

