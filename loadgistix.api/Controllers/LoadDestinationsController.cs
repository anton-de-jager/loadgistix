using loadgistix.api.Helpers;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System.Security.Claims;

namespace loadDestinationgistix_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoadDestinationsController : Controller
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<BidHub, IBidHubClient> _bidHubContext;
        private readonly IHubContext<LoadDestinationHub, ILoadDestinationHubClient> _loadDestinationHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LoadDestinationsController(IConfiguration config, IHubContext<LoadDestinationHub, ILoadDestinationHubClient> loadDestinationHubContext, IHubContext<BidHub, IBidHubClient> bidHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _bidHubContext = bidHubContext;
            _loadDestinationHubContext = loadDestinationHubContext;
        }


        [HttpGet]
        public async Task<ProcedureResult> GetLoadDestinations()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            LoadDestination request = new LoadDestination();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new LoadDestination(), "loadDestination", "select");
            return new ProcedureResult { Result = true, Data = result };
        }
        

        [HttpPost("id")]
        public async Task<ProcedureResult> GetLoadDestinationsById(IdRequest input)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            LoadDestination request = new LoadDestination();
            request.LoadId = input.Id;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new LoadDestination(), "loadDestination", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("route")]
        public async Task<ProcedureResult> GetLoadDestinationDestinations()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            LoadDestination request = new LoadDestination();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new LoadDestination(), "loadDestination", "select-route");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("route/{id}")]
        public async Task<ProcedureResult> GetLoadDestinationDestination(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            LoadDestination request = new LoadDestination();
            request.Id = id;
            var result = await DataTypeHelper.GetStringFromStoredProcedureAsync(connectionString, "[dbo].[usp_action_loadDestination]", request, "select-route-only");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("user")]
        public async Task<ProcedureResult> GetLoadDestinationsByUserId()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            LoadDestination request = new LoadDestination();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new LoadDestination(), "loadDestination", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpPost("bid")]
        public async Task<ProcedureResult> GetBidsFromLoadDestination(IdRequest input)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            LoadDestination request = new LoadDestination();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new LoadDestination(), "loadDestination", "select");

            // SignalR notification
            //await _hubContext.Clients.All.LoadDestinationAdded(result);

            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LoadDestination>> GetLoadDestination(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return Unauthorized();
            }

            LoadDestination request = new LoadDestination();
            request.Id = id;
            var loadDestination = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new LoadDestination(), "loadDestination", "select-single");

            if (loadDestination == null)
            {
                return NotFound();
            }

            return loadDestination;
        }

        [HttpPut]
        public async Task<ProcedureResult> PutLoadDestination(LoadDestination loadDestination)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            loadDestination.UserId = uid;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, loadDestination, new LoadDestination(), "loadDestination", "update");
            
            await _loadDestinationHubContext.Clients.All.LoadDestinationUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost]
        public async Task<ProcedureResult> PostLoadDestination(LoadDestination loadDestination)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            loadDestination.UserId = uid;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, loadDestination, new LoadDestination(), "loadDestination", "insert");
           
            //await _loadDestinationHubContext.Clients.All.LoadDestinationAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteLoadDestination(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            LoadDestination request = new LoadDestination();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new LoadDestination(), "loadDestination", "delete");

            await _loadDestinationHubContext.Clients.All.LoadDestinationDeleted(id);

            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }

        //async Task SendMessageAsync(string userId, string title, string body, string data, string token)
        //{
        //    UserRecord userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(userId);
        //    // This registration token comes from the client FCM SDKs.
        //    var registrationToken = token;


        //    var message = new Message
        //    {
        //        Notification = new Notification()
        //        {
        //            Title = title,
        //            Body = body,
        //        },
        //        Android = new AndroidConfig()
        //        {
        //            Notification = new AndroidNotification()
        //            {
        //                Icon = "bid-accepted",
        //                Color = "#2196F3",
        //            },
        //        },
        //        Token = registrationToken
        //    };


        //    // Send a message to the device corresponding to the provided
        //    // registration token.
        //    string response = await _messaging.SendAsync(message);
        //    // Response is a message ID string.
        //    Console.WriteLine("Successfully sent message: " + response);
        //}
    }
}
