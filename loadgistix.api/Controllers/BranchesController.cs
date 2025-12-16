using Microsoft.AspNetCore.Mvc;
using loadgistix.api.Models; 
using loadgistix.api.Helpers;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchesController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<BranchHub, IBranchHubClient> _branchHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BranchesController(IConfiguration config, IHubContext<BranchHub, IBranchHubClient> branchHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config; 
            connectionString = config.GetConnectionString("DefaultConnection");
            _branchHubContext = branchHubContext;
        }

        [HttpGet]
        public async Task<ProcedureResult> GetBranch()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Branch request = new Branch();
            request.UserId = uid;
            request.UserDescription = displayName;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Branch(), "branch", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Branch>> GetBranch(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return Unauthorized();
            }

            Branch request = new Branch();
            request.Id = id;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Branch(), "branch", "select-single");

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        [HttpPut]
        public async Task<ProcedureResult> PutBranch(Branch branch)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, branch, new Branch(), "branch", "update");

            await _branchHubContext.Clients.All.BranchUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost]
        public async Task<ProcedureResult> PostBranch(Branch branch)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            branch.UserId = uid;
            branch.UserDescription = displayName;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, branch, new Branch(), "branch", "insert");

            await _branchHubContext.Clients.All.BranchAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteBranch(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Branch request = new Branch();
            request.Id = id;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Branch(), "branch", "delete");

            await _branchHubContext.Clients.All.BranchDeleted(id);
            return new ProcedureResult { Result = true, Data = result };
        }
    }
}
