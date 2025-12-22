using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using loadgistix.api.Models;
using loadgistix.api.Helpers;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuoteTrucksController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;

        public QuoteTrucksController(IConfiguration config)
        {
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
        }

        // GET: api/QuoteTrucks
        [HttpGet]
        public async Task<ProcedureResult> GetQuoteTrucks()
        {
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
            QuoteTruck request = new QuoteTruck();
            request.QuoteId = quoteId;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteTruck(), "quoteTruck", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // PUT: api/QuoteTrucks
        [HttpPut]
        public async Task<ProcedureResult> PutQuoteTruck(QuoteTruck quoteTruck)
        {
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, quoteTruck, new QuoteTruck(), "quoteTruck", "update");
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/QuoteTrucks
        [HttpPost]
        public async Task<ProcedureResult> PostQuoteTruck(QuoteTruck quoteTruck)
        {
            if (quoteTruck.Id == null || quoteTruck.Id == Guid.Empty)
            {
                quoteTruck.Id = Guid.NewGuid();
            }
            quoteTruck.CreatedOn = DateTime.UtcNow;
            await DataTypeHelper.ActionStoredProcedureAsync(connectionString, quoteTruck, new QuoteTruck(), "quoteTruck", "insert");
            // Return the input object with the generated ID
            return new ProcedureResult { Result = true, Id = quoteTruck.Id ?? Guid.Empty, Data = quoteTruck };
        }

        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteQuoteTruck(Guid id)
        {
            QuoteTruck request = new QuoteTruck();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteTruck(), "quoteTruck", "delete");

            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
