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
    public class ReviewLoadsController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<ReviewLoadHub, IReviewLoadHubClient> _reviewLoadHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ReviewLoadsController(IConfiguration config, IHubContext<ReviewLoadHub, IReviewLoadHubClient> reviewLoadHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config; connectionString = config.GetConnectionString("DefaultConnection");
            _reviewLoadHubContext = reviewLoadHubContext;
        }

        [HttpPost("{user}")]
        public async Task<ProcedureResult> GetReviewLoadsByUser(IdRequest input)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            ReviewLoad request = new ReviewLoad();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new ReviewLoad(), "reviewLoad", "select-user");

            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewLoad>> GetReviewLoad(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return Unauthorized();
            }

            ReviewLoad request = new ReviewLoad();
            request.Id = id;
            var reviewLoad = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new ReviewLoad(), "reviewLoad", "select-single");

            if (reviewLoad == null)
            {
                return NotFound();
            }

            return reviewLoad;
        }

        [HttpPost]
        public async Task<ProcedureResult> PostReviewLoad(ReviewLoad reviewLoad)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            reviewLoad.Timestamp = DateTime.Now; ;
            reviewLoad.UserId = uid;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, reviewLoad, new ReviewLoad(), "reviewLoad", "insert");
            await _reviewLoadHubContext.Clients.All.ReviewLoadAdded(result);

            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
    }
}
