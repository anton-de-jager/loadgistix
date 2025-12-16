using Microsoft.AspNetCore.Mvc;
using loadgistix.api.Models; using loadgistix.api.Helpers;
using Microsoft.AspNetCore.SignalR;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using System.Security.Claims;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BidsController : ControllerBase
    {
        public IConfiguration _configuration; public string connectionString;
        private readonly IHubContext<BidHub, IBidHubClient> _bidHubContext;
        private readonly IHubContext<LoadHub, ILoadHubClient> _loadHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BidsController(IConfiguration config, IHubContext<BidHub, IBidHubClient> bidHubContext, IHubContext<LoadHub, ILoadHubClient> loadHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config; connectionString = config.GetConnectionString("DefaultConnection");
            _bidHubContext = bidHubContext;
            _loadHubContext = loadHubContext;
        }

        [HttpGet]
        public async Task<ProcedureResult> GetBid()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Bid request = new Bid();
            request.UserId = uid;
            request.UserDescription = displayName;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Bid(), "bid", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpPost("load")]
        public async Task<ProcedureResult> GetBidByLoadId(IdRequest input)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Bid request = new Bid();
            request.LoadId = input.Id;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Bid(), "bid", "select-load");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("open/{loadId}")]
        public async Task<ProcedureResult> GetOpenBidsByLoadId(Guid loadId)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Bid request = new Bid();
            request.LoadId = loadId;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Bid(), "bid", "select-load-open");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Bid>> GetBid(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return Unauthorized();
            }

            Bid request = new Bid();
            request.Id = id;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Bid(), "bid", "select-single");

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        [HttpPut]
        public async Task<ProcedureResult> PutBid(Bid bid)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            BidLoad result = await DataTypeHelper.ActionStoredProcedureBidLoadAsync(connectionString, bid, "bid", "update");
            await _loadHubContext.Clients.All.LoadUpdated(result.load);
            await _bidHubContext.Clients.All.BidUpdated(result.bid);

            return new ProcedureResult { Result = true, Data = result.bid };
        }

        [HttpPost]
        public async Task<ProcedureResult> PostBid(Bid bid)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            bid.UserId = uid;
            bid.UserDescription = displayName;

            BidLoad result = await DataTypeHelper.ActionStoredProcedureBidLoadAsync(connectionString, bid, "bid", "insert");
            await _loadHubContext.Clients.All.LoadUpdated(result.load);
            await _bidHubContext.Clients.All.BidAdded(result.bid);

            return new ProcedureResult { Result = true, Data = result.bid };
        }

        [HttpPost("accept")]
        public async Task<ProcedureResult> AcceptBid(Bid bid)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            BidLoad result = await DataTypeHelper.AcceptBidAsync(connectionString, bid);
            await _loadHubContext.Clients.All.LoadUpdated(result.load);
            await _bidHubContext.Clients.All.BidUpdated(result.bid);

            return new ProcedureResult { Result = true, Id = bid.Id.Value, Data = result.bid };
        }

        [HttpPost("decline")]
        public async Task<ProcedureResult> DeclineBid(Bid bid)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            bid.UserId = uid;
            bid.UserDescription = displayName;

            BidLoad result = await DataTypeHelper.DeclineBidAsync(connectionString, bid);
            await _loadHubContext.Clients.All.LoadUpdated(result.load);
            await _bidHubContext.Clients.All.BidUpdated(result.bid);

            return new ProcedureResult { Result = true, Id = bid.Id.Value, Data = result.bid };
        }

        [HttpPost("accept/{id}")]
        public async Task<ProcedureResult> AcceptBid(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Bid bid = new Bid();
            bid.Id = id;
            bid.UserId = uid;
            bid.UserDescription = displayName;

            BidLoad result = await DataTypeHelper.AcceptBidAsync(connectionString, bid);
            await _loadHubContext.Clients.All.LoadUpdated(result.load);
            await _bidHubContext.Clients.All.BidUpdated(result.bid);

            return new ProcedureResult { Result = true, Id = bid.Id.Value, Data = result.bid };
        }

        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteBid(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Load request = new Load();
            request.Id = id;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Load(), "bid", "delete");
            await _bidHubContext.Clients.All.BidDeleted(id);
            await _loadHubContext.Clients.All.LoadUpdated(result);

            return new ProcedureResult { Result = true, Data = result };
        }
    }
}
