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
    public class ReviewDriversController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<ReviewDriverHub, IReviewDriverHubClient> _reviewDriverHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ReviewDriversController(IConfiguration config, IHubContext<ReviewDriverHub, IReviewDriverHubClient> reviewDriverHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config; connectionString = config.GetConnectionString("DefaultConnection");
            _reviewDriverHubContext = reviewDriverHubContext;
        }

        [HttpPost("{user}")]
        public async Task<ProcedureResult> GetReviewDriversByUser(IdRequest input)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            ReviewDriver request = new ReviewDriver();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new ReviewDriver(), "reviewDriver", "select-user");

            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewDriver>> GetReviewDriver(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return Unauthorized();
            }

            ReviewDriver request = new ReviewDriver();
            request.Id = id;
            var reviewDriver = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new ReviewDriver(), "reviewDriver", "select-single");

            if (reviewDriver == null)
            {
                return NotFound();
            }

            return reviewDriver;
        }

        [HttpPost]
        public async Task<ProcedureResult> PostReviewDriver(ReviewDriver reviewDriver)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            reviewDriver.Timestamp = DateTime.Now; 
            reviewDriver.UserId = uid;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, reviewDriver, new ReviewDriver(), "reviewDriver", "insert");
            await _reviewDriverHubContext.Clients.All.ReviewDriverAdded(result);

            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
    }
}
