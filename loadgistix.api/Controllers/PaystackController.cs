using loadgistix.api.Helpers;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using loadgistix.api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using PayFast;
using System.Security.Cryptography;
using System.Text;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaystackController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        public string _key;
        private readonly IHubContext<TransactionHub, ITransactionHubClient> _transactionHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public PaystackController(IConfiguration config, IHubContext<TransactionHub, ITransactionHubClient> transactionHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _key = config.GetSection("paystack_sk").Value;
            _transactionHubContext = transactionHubContext;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Anton");
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> WebhookAsync([FromBody] dynamic eventBody)
        {
            String key = _key;

            string jsonInput = @"{""paystack"":""request"",""body"":""to_string""}";
            String inputString = Convert.ToString(new JValue(jsonInput));
            string ipAddress = HttpContext.Connection.RemoteIpAddress.ToString();
            string ipAddress2 = HttpContext.Request.Headers["X-Forwarded-For"];
            if (ipAddress.Contains("52.31.139.75") || ipAddress.Contains("52.49.173.169") || ipAddress.Contains("52.214.14.220")
                || ipAddress2.Contains("52.31.139.75") || ipAddress2.Contains("52.49.173.169") || ipAddress2.Contains("52.214.14.220"))
            {
                JObject jsonData = JObject.Parse(eventBody.ToString());

                string eventValue = (string)jsonData["event"];

                // Accessing nested data
                JToken data = jsonData["data"];

                if ((string)data["status"] == "success")
                {
                    int amount = (int)data["amount"];
                    int fees = (int)data["fees"];
                    string reference = (string)data["reference"];
                    string createdAt = (string)data["created_at"];
                    JToken plan = data["plan"];
                    string planCode = (string)plan["plan_code"];
                    JToken customer = data["customer"];
                    JToken metadata = data["metadata"];
                    string userId = (string)metadata["userId"];
                    string name = (string)plan["name"];
                    string email = (string)customer["email"];

                    int vehicles = 0;
                    if (name.IndexOf("v11") >= 0)
                    {
                        vehicles = -1;
                    }
                    else
                    {
                        if (name.IndexOf("v10") >= 0)
                        {
                            vehicles = 10;
                        }
                        else
                        {
                            if (name.IndexOf("v5") >= 0)
                            {
                                vehicles = 5;
                            }
                            else
                            {
                                if (name.IndexOf("v1") >= 0)
                                {
                                    vehicles = 1;
                                }
                            }
                        }
                    }
                    int loads = 0;
                    if (name.IndexOf("l11") >= 0)
                    {
                        loads = -1;
                    }
                    else
                    {
                        if (name.IndexOf("l10") >= 0)
                        {
                            loads = 10;
                        }
                        else
                        {
                            if (name.IndexOf("l5") >= 0)
                            {
                                loads = 5;
                            }
                        }
                    }
                    int adverts = 0;
                    if (name.IndexOf("a1") >= 0)
                    {
                        adverts = 1;
                    }
                    int directories = 0;
                    if (name.IndexOf("d1") >= 0)
                    {
                        directories = 1;
                    }
                    int tms = 0;
                    if (name.IndexOf("t1") >= 0)
                    {
                        tms = 1;
                    }

                    Subscription request = new Subscription();
                    request.UserId = userId;
                    request.Reference = reference;
                    request.Amount_gross = Convert.ToDecimal(amount);
                    request.Amount_net = Convert.ToDecimal(amount) - Convert.ToDecimal(fees);
                    request.Amount_fee = Convert.ToDecimal(fees);
                    request.DateStart = Convert.ToDateTime(createdAt);
                    var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Subscription(), "subscription", "insert");

                    Transaction requestTransaction = new Transaction();
                    requestTransaction.UserId = userId;
                    requestTransaction.SubscriptionId = result.Id;
                    requestTransaction.Advert = adverts;
                    requestTransaction.Tms = tms;
                    requestTransaction.Directory = directories;
                    requestTransaction.Vehicle = vehicles;
                    requestTransaction.Load = loads;
                    requestTransaction.Amount_gross = Convert.ToDecimal(amount);
                    requestTransaction.Amount_net = Convert.ToDecimal(amount) - Convert.ToDecimal(fees);
                    requestTransaction.Amount_fee = Convert.ToDecimal(fees);
                    requestTransaction.DateBilling = Convert.ToDateTime(createdAt);
                    var resultTransaction = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, requestTransaction, new Transaction(), "transaction", "insert");

                    await _transactionHubContext.Clients.All.TransactionAdded(resultTransaction);

                    return Ok();
                }
                else
                {
                    return BadRequest();
                }


            }
            else
            {
                return BadRequest();
            }



        }

        [HttpPost("free")]
        public async Task<IActionResult> free(dynamic data)
        {
            int amount = 0;
            int fees = 0;
            string reference = (string)data["userId"] + "_" + DateTime.Now.ToShortDateString();
            string createdAt = DateTime.Now.ToShortDateString();
            string userId = (string)data["userId"];
            string name = (string)data["name"];

            int vehicles = 0;
            if (name.IndexOf("v11") >= 0)
            {
                vehicles = -1;
            }
            else
            {
                if (name.IndexOf("v10") >= 0)
                {
                    vehicles = 10;
                }
                else
                {
                    if (name.IndexOf("v5") >= 0)
                    {
                        vehicles = 5;
                    }
                    else
                    {
                        if (name.IndexOf("v1") >= 0)
                        {
                            vehicles = 1;
                        }
                    }
                }
            }
            int loads = 0;
            if (name.IndexOf("l11") >= 0)
            {
                loads = -1;
            }
            else
            {
                if (name.IndexOf("l10") >= 0)
                {
                    loads = 10;
                }
                else
                {
                    if (name.IndexOf("l5") >= 0)
                    {
                        loads = 5;
                    }
                }
            }
            int adverts = 0;
            if (name.IndexOf("a1") >= 0)
            {
                adverts = 1;
            }
            int directories = 0;
            if (name.IndexOf("d1") >= 0)
            {
                directories = 1;
            }
            int tms = 0;
            if (name.IndexOf("t1") >= 0)
            {
                tms = 1;
            }

            Subscription request = new Subscription();
            request.UserId = userId;
            request.Reference = reference;
            request.Amount_gross = Convert.ToDecimal(amount);
            request.Amount_net = Convert.ToDecimal(amount) - Convert.ToDecimal(fees);
            request.Amount_fee = Convert.ToDecimal(fees);
            request.DateStart = Convert.ToDateTime(createdAt);
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Subscription(), "subscription", "insert");

            Transaction requestTransaction = new Transaction();
            requestTransaction.UserId = userId;
            requestTransaction.SubscriptionId = result.Id;
            requestTransaction.Advert = adverts;
            requestTransaction.Tms = tms;
            requestTransaction.Directory = directories;
            requestTransaction.Vehicle = vehicles;
            requestTransaction.Load = loads;
            requestTransaction.Amount_gross = Convert.ToDecimal(amount);
            requestTransaction.Amount_net = Convert.ToDecimal(amount) - Convert.ToDecimal(fees);
            requestTransaction.Amount_fee = Convert.ToDecimal(fees);
            requestTransaction.DateBilling = Convert.ToDateTime(createdAt);
            var resultTransaction = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, requestTransaction, new Transaction(), "transaction", "insert");

            await _transactionHubContext.Clients.All.TransactionAdded(resultTransaction);

            return Ok();


        }



        [HttpPost("callback")]
        public IActionResult Callback([FromBody] dynamic eventBody)
        {
            String key = _key;
            var eventReceived = eventBody;
            String inputString = Convert.ToString(new JValue(eventReceived));

            String result = "";
            byte[] secretkeyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputString);
            using (var hmac = new HMACSHA512(secretkeyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                result = BitConverter.ToString(hashValue).Replace("-", string.Empty); ;
            }
            Console.WriteLine(result);

            String xpaystackSignature = ""; //put in the request's header value for x-paystack-signature

            if (result.ToLower().Equals(xpaystackSignature))
            {
                // you can trust the event, it came from paystack
                // respond with the http 200 response immediately before attempting to process the response
                //retrieve the request body, and deliver value to the customer
            }
            else
            {
                // this isn't from Paystack, ignore it
            }

            return Ok();
        }
    }
}
