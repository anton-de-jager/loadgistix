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
    public class QuoteTrailersController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;

        public QuoteTrailersController(IConfiguration config)
        {
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
        }

        // GET: api/QuoteTrailers
        [HttpGet]
        public async Task<ProcedureResult> GetQuoteTrailers()
        {
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new QuoteTrailer(), new QuoteTrailer(), "quoteTrailer", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/QuoteTrailers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuoteTrailer>> GetQuoteTrailer(Guid id)
        {
            QuoteTrailer request = new QuoteTrailer();
            request.Id = id;
            var quoteTrailer = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteTrailer(), "quoteTrailer", "select-single");

            if (quoteTrailer == null)
            {
                return NotFound();
            }

            return quoteTrailer;
        }

        // GET: api/QuoteTrailers/byQuote/5
        [HttpGet("byQuote/{quoteId}")]
        public async Task<ProcedureResult> GetQuoteTrailersByQuote(Guid quoteId)
        {
            QuoteTrailer request = new QuoteTrailer();
            request.QuoteId = quoteId;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteTrailer(), "quoteTrailer", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // PUT: api/QuoteTrailers
        [HttpPut]
        public async Task<ProcedureResult> PutQuoteTrailer(QuoteTrailer quoteTrailer)
        {
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, quoteTrailer, new QuoteTrailer(), "quoteTrailer", "update");
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/QuoteTrailers
        [HttpPost]
        public async Task<ProcedureResult> PostQuoteTrailer(QuoteTrailer quoteTrailer)
        {
            if (quoteTrailer.Id == null || quoteTrailer.Id == Guid.Empty)
            {
                quoteTrailer.Id = Guid.NewGuid();
            }
            quoteTrailer.CreatedOn = DateTime.UtcNow;
            await DataTypeHelper.ActionStoredProcedureAsync(connectionString, quoteTrailer, new QuoteTrailer(), "quoteTrailer", "insert");
            // Return the input object with the generated ID
            return new ProcedureResult { Result = true, Id = quoteTrailer.Id ?? Guid.Empty, Data = quoteTrailer };
        }

        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteQuoteTrailer(Guid id)
        {
            QuoteTrailer request = new QuoteTrailer();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteTrailer(), "quoteTrailer", "delete");

            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
