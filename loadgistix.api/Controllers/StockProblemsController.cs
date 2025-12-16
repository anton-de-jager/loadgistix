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
    public class StockProblemsController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<StockProblemHub, IStockProblemHubClient> _stockProblemHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public StockProblemsController(IConfiguration config, IHubContext<StockProblemHub, IStockProblemHubClient> stockProblemHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _stockProblemHubContext = stockProblemHubContext;
        }

        // GET: api/StockProblems
        [HttpGet]
        public async Task<ProcedureResult> GetStockProblem()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new StockProblem(), new StockProblem(), "stockProblem", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/StockProblems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StockProblem>> GetStockProblem(Guid id)
        {
            StockProblem request = new StockProblem();
            request.Id = id;
            var stockProblem = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new StockProblem(), "stockProblem", "select-single");

            if (stockProblem == null)
            {
                return NotFound();
            }

            return stockProblem;
        }

        // PUT: api/StockProblems/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutStockProblem(StockProblem stockProblem)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, stockProblem, new StockProblem(), "stockProblem", "update");

            await _stockProblemHubContext.Clients.All.StockProblemUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/StockProblems
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostStockProblem(StockProblem stockProblem)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, stockProblem, new StockProblem(), "stockProblem", "insert");

            await _stockProblemHubContext.Clients.All.StockProblemAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteStockProblem(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            StockProblem request = new StockProblem();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new StockProblem(), "stockProblem", "delete");

            await _stockProblemHubContext.Clients.All.StockProblemDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
