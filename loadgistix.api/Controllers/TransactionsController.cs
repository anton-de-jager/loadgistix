using loadgistix.api.Helpers;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : Controller
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<TransactionHub, ITransactionHubClient> _transactionHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public TransactionsController(IConfiguration config, IHubContext<TransactionHub, ITransactionHubClient> transactionHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config; 
            connectionString = config.GetConnectionString("DefaultConnection");
            _transactionHubContext = transactionHubContext;
        }

        [HttpGet]
        public async Task<ProcedureResult> GetTransactions()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Transaction request = new Transaction();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Transaction(), "transaction", "select-current");
            return new ProcedureResult { Result = true, Data = result };
        }
    }
}
