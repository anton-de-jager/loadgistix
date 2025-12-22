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
    public class QuoteTrucksController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public QuoteTrucksController(IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
        }

        // GET: api/QuoteTrucks
        [HttpGet]
        public async Task<ProcedureResult> GetQuoteTrucks()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new QuoteTruck(), new QuoteTruck(), "quoteTruck", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/QuoteTrucks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuoteTruck>> GetQuoteTruck(Guid id)
        {
            QuoteTruck request = new QuoteTruck();
            request.Id = id;
            var quoteTruck = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteTruck(), "quoteTruck", "select-single");

            if (quoteTruck == null)
            {
                return NotFound();
            }

            return quoteTruck;
        }

        // GET: api/QuoteTrucks/byQuote/5
        [HttpGet("byQuote/{quoteId}")]
        public async Task<ProcedureResult> GetQuoteTrucksByQuote(Guid quoteId)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            QuoteTruck request = new QuoteTruck();
            request.QuoteId = quoteId;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteTruck(), "quoteTruck", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // PUT: api/QuoteTrucks
        [HttpPut]
        public async Task<ProcedureResult> PutQuoteTruck(QuoteTruck quoteTruck)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, quoteTruck, new QuoteTruck(), "quoteTruck", "update");
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/QuoteTrucks
        [HttpPost]
        public async Task<ProcedureResult> PostQuoteTruck(QuoteTruck quoteTruck)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, quoteTruck, new QuoteTruck(), "quoteTruck", "insert");
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteQuoteTruck(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            QuoteTruck request = new QuoteTruck();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteTruck(), "quoteTruck", "delete");

            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}

