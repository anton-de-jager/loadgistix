using loadgistix.api.Helpers;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System.Security.Claims;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoadsController : Controller
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<BidHub, IBidHubClient> _bidHubContext;
        private readonly IHubContext<LoadHub, ILoadHubClient> _loadHubContext;
        private readonly IHubContext<LoadDestinationHub, ILoadDestinationHubClient> _loadDestinationHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LoadsController(IConfiguration config, IHubContext<LoadHub, ILoadHubClient> loadHubContext, IHubContext<LoadDestinationHub, ILoadDestinationHubClient> loadDestinationHubContext, IHubContext<BidHub, IBidHubClient> bidHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _bidHubContext = bidHubContext;
            _loadHubContext = loadHubContext;
            _loadDestinationHubContext = loadDestinationHubContext;
        }


        [HttpGet]
        public async Task<ProcedureResult> GetLoads()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            //await SendMessageAsync(uid, "Test", "body", "", "dRCdtWRhOFZjXmNzu56QV5:APA91bEwzR2wZVmcdHFNyg-BtnFUhM9WAD-MQqh-MTQgA8kEaia3xT3yKVlALHu0DYIwzdxCPc6AkA217THukyC_6mGlHwfHCsCKC1RDqjkTNd_LI-VepK5ej2eX4k1S7BfgwMNpo0yw");

            Load request = new Load();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Load(), "load", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpPost("id/{id}")]
        public async Task<ProcedureResult> GetLoadsById(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Load request = new Load();
            request.UserId = uid;
            request.Id = id;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Load(), "load", "select-by-id");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("route")]
        public async Task<ProcedureResult> GetLoadDestinations()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Load request = new Load();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Load(), "load", "select-route");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("route/{id}")]
        public async Task<ProcedureResult> GetLoadDestination(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Load request = new Load();
            request.Id = id;
            var result = await DataTypeHelper.GetStringFromStoredProcedureAsync(connectionString, "[dbo].[usp_action_load]", request, "select-route-only");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("user")]
        public async Task<ProcedureResult> GetLoadsByUserId()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Load request = new Load();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Load(), "load", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpPost("available")]
        async public Task<ProcedureResult> GetLoadsAvailable(LoadsAvailableRequest request)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            List<KeyValuePair<string, object>> parms = new List<KeyValuePair<string, object>>();
            parms.Add(new KeyValuePair<string, object>("userId", uid));
            parms.Add(new KeyValuePair<string, object>("input", request.Input != null ? request.Input.Replace("null", "0").Replace("undefined", "0") : ""));
            parms.Add(new KeyValuePair<string, object>("distance", request.Distance != null ? request.Distance : 0));
            parms.Add(new KeyValuePair<string, object>("origin", request.Origin != null ? request.Origin : 0));
            parms.Add(new KeyValuePair<string, object>("destination", request.Destination != null ? request.Destination : 0));
            parms.Add(new KeyValuePair<string, object>("lat", request.Lat != null ? request.Lat : 0));
            parms.Add(new KeyValuePair<string, object>("lon", request.Lon != null ? request.Lon : 0));
            parms.Add(new KeyValuePair<string, object>("weight", request.Weight != null ? request.Weight : 0));
            parms.Add(new KeyValuePair<string, object>("volumeCm", request.VolumeCm != null ? request.VolumeCm : 0));
            parms.Add(new KeyValuePair<string, object>("volumeLt", request.VolumeLt != null ? request.VolumeLt : 0));
            var result = await DataTypeHelper.GetFromStoredProcedureAsync(connectionString, new Load(), "usp_action_loads_available", parms);

            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpPost("bid")]
        public async Task<ProcedureResult> GetBidsFromLoad(IdRequest input)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Load request = new Load();
            request.UserId = uid;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Load(), "load", "select");

            // SignalR notification
            //await _hubContext.Clients.All.LoadAdded(result);

            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Load>> GetLoad(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return Unauthorized();
            }

            Load request = new Load();
            request.Id = id;
            var load = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Load(), "load", "select-single");

            if (load == null)
            {
                return NotFound();
            }

            return load;
        }

        [HttpPut]
        public async Task<ProcedureResult> PutLoad(LoadUpdate loadUpdate)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            loadUpdate.Load.UserId = uid;
            loadUpdate.Load.UserDescription = displayName;
            loadUpdate.Load.Note = loadUpdate.Load.Note == null ? "" : loadUpdate.Load.Note;

            List<dynamic> resultDestinations = new List<dynamic>();
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, loadUpdate.Load, new Load(), "load", "update");
            var originatingAddressLabel = loadUpdate.Load.OriginatingAddressLabel;
            var originatingAddressLat = loadUpdate.Load.OriginatingAddressLat;
            var originatingAddressLon = loadUpdate.Load.OriginatingAddressLon;

            result.OriginatingAddressLabel = loadUpdate.Load.OriginatingAddressLabel;
            result.OriginatingAddressLat = loadUpdate.Load.OriginatingAddressLat;
            result.OriginatingAddressLon = loadUpdate.Load.OriginatingAddressLon;

            foreach (var route in loadUpdate.LoadDestination.OrderBy(x => x.Pos))
            {
                LoadDestination loadDestination = new LoadDestination();
                loadDestination.UserId = uid;
                loadDestination.LoadId = result.Id;
                loadDestination.Pos = route.Pos;
                loadDestination.OriginatingAddressLabel = originatingAddressLabel;
                loadDestination.OriginatingAddressLat = originatingAddressLat;
                loadDestination.OriginatingAddressLon = originatingAddressLon;
                loadDestination.DestinationAddressLabel = route.DestinationAddressLabel;
                loadDestination.DestinationAddressLat = route.DestinationAddressLat;
                loadDestination.DestinationAddressLon = route.DestinationAddressLon;
                resultDestinations.Add(await DataTypeHelper.ActionStoredProcedureAsync(connectionString, loadDestination, new LoadDestination(), "loadDestination", "insert"));
                originatingAddressLabel = route.DestinationAddressLabel;
                originatingAddressLat = route.DestinationAddressLat;
                originatingAddressLon = route.DestinationAddressLon;

                if (result.LoadDestinationId == Guid.Empty)
                {
                    result.LoadDestinationId = resultDestinations[0].Id;
                }

                result.DestinationAddressLabel = route.DestinationAddressLabel;
                result.DestinationAddressLat = route.DestinationAddressLat;
                result.DestinationAddressLon = route.DestinationAddressLon;
            }

            //foreach(dynamic resultDestination in resultDestinations)
            //{
            //    await _loadDestinationHubContext.Clients.All.LoadDestinationUpdated(resultDestination);
            //}
            await _loadHubContext.Clients.All.LoadUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost]
        public async Task<ProcedureResult> PostLoad(LoadUpdate loadUpdate)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            loadUpdate.Load.UserId = uid;
            loadUpdate.Load.UserDescription = displayName;
            loadUpdate.Load.Note = loadUpdate.Load.Note == null ? "" : loadUpdate.Load.Note;

            List<dynamic> resultDestinations = new List<dynamic>();
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, loadUpdate.Load, new Load(), "load", "insert");
            var originatingAddressLabel = loadUpdate.Load.OriginatingAddressLabel;
            var originatingAddressLat = loadUpdate.Load.OriginatingAddressLat;
            var originatingAddressLon = loadUpdate.Load.OriginatingAddressLon;

            result.OriginatingAddressLabel = loadUpdate.Load.OriginatingAddressLabel;
            result.OriginatingAddressLat = loadUpdate.Load.OriginatingAddressLat;
            result.OriginatingAddressLon = loadUpdate.Load.OriginatingAddressLon;

            foreach (var route in loadUpdate.LoadDestination.OrderBy(x => x.Pos))
            {
                LoadDestination loadDestination = new LoadDestination();
                loadDestination.UserId = uid;
                loadDestination.LoadId = result.Id;
                loadDestination.Pos = route.Pos;
                loadDestination.OriginatingAddressLabel = originatingAddressLabel;
                loadDestination.OriginatingAddressLat = originatingAddressLat;
                loadDestination.OriginatingAddressLon = originatingAddressLon;
                loadDestination.DestinationAddressLabel = route.DestinationAddressLabel;
                loadDestination.DestinationAddressLat = route.DestinationAddressLat;
                loadDestination.DestinationAddressLon = route.DestinationAddressLon;
                resultDestinations.Add(await DataTypeHelper.ActionStoredProcedureAsync(connectionString, loadDestination, new LoadDestination(), "loadDestination", "insert"));
                originatingAddressLabel = route.DestinationAddressLabel;
                originatingAddressLat = route.DestinationAddressLat;
                originatingAddressLon = route.DestinationAddressLon;

                if (result.LoadDestinationId == Guid.Empty)
                {
                    result.LoadDestinationId = resultDestinations[0].Id;
                }
                result.DestinationAddressLabel = route.DestinationAddressLabel;
                result.DestinationAddressLat = route.DestinationAddressLat;
                result.DestinationAddressLon = route.DestinationAddressLon;
            }

            //result.route = null;


            //foreach (dynamic resultDestination in resultDestinations)
            //{
            //    await _loadDestinationHubContext.Clients.All.LoadDestinationAdded(resultDestination);
            //}
            await _loadHubContext.Clients.All.LoadAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost("status")]
        public async Task<ProcedureResult> UpdateStatus(LoadUpdate loadUpdate)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            //Load request = new Load();
            loadUpdate.Load.UserId = uid;
            if(loadUpdate.LoadDestination.Count() > 0)
            {
                loadUpdate.LoadDestination[0].UserId = uid;
            }
            //request.Id = input.Id;
            //request.Status = input.Description;

            BidLoadDestination result = DataTypeHelper.UpdateStatus(connectionString, loadUpdate);
            result.load.Status = result.bid.StatusLoad;
            await _loadHubContext.Clients.All.LoadUpdated(result.load);
            //await _loadDestinationHubContext.Clients.All.LoadDestinationUpdated(result.loadDestination);
            await _bidHubContext.Clients.All.BidUpdated(result.bid);

            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteLoad(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Load request = new Load();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Load(), "load", "delete");

            await _loadHubContext.Clients.All.LoadDeleted(id);

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
