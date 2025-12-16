using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using loadgistix.api.Models;
using loadgistix.api.Helpers;
using PayFast;
using PayFast.AspNetCore;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text;
using System.Net;
using System.Text.Json;
using System.Security.Cryptography;
using loadgistix.api.Hubs;
using loadgistix.api.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayfastController : ControllerBase
    {
        #region Fields

        private readonly PayFastSettings payFastSettings;
        public IConfiguration _configuration;
        public string connectionString;
        private readonly ILogger logger;

        #endregion Fields

        public PayfastController(IConfiguration config, IOptions<PayFastSettings> payFastSettings, ILogger<PayfastController> logger)
        {
            _configuration = config; 
            connectionString = config.GetConnectionString("DefaultConnection");
            this.payFastSettings = payFastSettings.Value;
            this.logger = logger;
        }

        protected const string BaseUrl = "https://api.payfast.co.za/subscriptions/";
        protected const string ApiVersion = "v1";
        protected const string TestMode = "?testing=true";
        protected const string PingResourceUrl = "ping";
        private const string cancelResourceUrl = "cancel";
        private const string pauseResourceUrl = "pause";
        private const string unpauseResourceUrl = "unpause";
        private const string updateResourceUrl = "update";
        private const string fetchResourceUrl = "fetch";

        protected HttpClient GetClient()
        {
            var httpClient = new HttpClient { BaseAddress = new Uri(BaseUrl) };

            httpClient.DefaultRequestHeaders.Clear();
            httpClient.DefaultRequestHeaders.Add("merchant-id", this.payFastSettings.MerchantId);
            httpClient.DefaultRequestHeaders.Add("version", ApiVersion);
            httpClient.DefaultRequestHeaders.Add("timestamp", DateTime.UtcNow.ToString("s"));

            return httpClient;
        }

        /// <summary>
        /// This method will generate the signature for the request
        /// See <a href="https://www.payfast.co.za/documentation/api/#Merchant_Signature_Generation">PayFast API Signature Generation Documentation</a> for more information.
        /// </summary>
        protected string GenerateSignature(HttpClient httpClient, params KeyValuePair<string, string>[] parameters)
        {
            var dictionary = new SortedDictionary<string, string>();

            foreach (var header in httpClient.DefaultRequestHeaders)
            {
                dictionary.Add(key: header.Key, value: header.Value.First());
            }

            foreach (var keyValuePair in parameters)
            {
                dictionary.Add(key: keyValuePair.Key, value: keyValuePair.Value);
            }

            if (!string.IsNullOrWhiteSpace(this.payFastSettings.PassPhrase))
            {
                dictionary.Add(key: "passphrase", value: this.payFastSettings.PassPhrase);
            }

            var stringBuilder = new StringBuilder();
            var last = dictionary.Last();

            foreach (var keyValuePair in dictionary)
            {
                stringBuilder.Append($"{keyValuePair.Key.UrlEncode()}={keyValuePair.Value.UrlEncode()}");

                if (keyValuePair.Key != last.Key)
                {
                    stringBuilder.Append("&");
                }
            }

            httpClient.DefaultRequestHeaders.Add(name: "signature", value: stringBuilder.CreateHash());

            if (parameters.Length > 0)
            {
                var jsonStringBuilder = new StringBuilder();
                jsonStringBuilder.Append("{");

                var lastParameter = parameters.Last();

                foreach (var keyValuePair in parameters)
                {
                    jsonStringBuilder.Append($"\"{keyValuePair.Key}\" : \"{keyValuePair.Value}\"");

                    if (lastParameter.Key != keyValuePair.Key)
                    {
                        jsonStringBuilder.Append(",");
                    }
                }

                jsonStringBuilder.Append("}");

                return jsonStringBuilder.ToString();
            }
            else
            {
                return null;
            }
        }

        [HttpGet("{token}")]
        public async Task<ProcedureResult> Fetch(string token)
        {
            using (var httpClient = this.GetClient())
            {
                var finalUrl = this.payFastSettings.ReturnUrl.IndexOf("loadgistix.com") == -1 ? $"{token}/{fetchResourceUrl}{TestMode}" : $"{token}/{fetchResourceUrl}";

                this.GenerateSignature(httpClient);

                using (var response = await httpClient.GetAsync(finalUrl))
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        return new ProcedureResult { Result = true, Data = response.Deserialize<PayFast.ApiTypes.UpdateResponse>() };
                    }

                    throw new PayFast.Exceptions.ApiResponseException(httpResponseMessage: response);
                }
            }
        }

        [HttpGet("subscription/{id}/{email}/{amount}/{int1}/{int2}/{int3}/{int4}/{int5}/{page}")]
        public async Task<IActionResult> RecurringAsync(string id, string email, double amount, int int1, int int2, int int3, int int4, int int5, string page)
        {
            Subscription request = new Subscription();
            request.UserId = id;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Subscription(), "subscription", "select");

            if (result.Count > 0)
            {
                PayfastRequest payFastRequest = new PayfastRequest();
                //payFastRequest.token = ((Subscription)result[0]).Token.ToString();
                payFastRequest.amount_gross = amount;
                payFastRequest.custom_int1 = int1;
                payFastRequest.custom_int2 = int2;
                payFastRequest.custom_int3 = int3;
                payFastRequest.custom_int4 = int4;
                payFastRequest.custom_int5 = int5;

                string res = "";
                using (var httpClient = this.GetClient())
                {
                    var finalUrl = this.payFastSettings.ReturnUrl.IndexOf("loadgistix.com") == -1 ? $"{payFastRequest.token.Replace("\"", "")}/{updateResourceUrl}{TestMode}" : $"{payFastRequest.token.Replace("\"", "")}/{updateResourceUrl}";

                    var incommingParameters = new List<KeyValuePair<string, string>>();

                    if (payFastRequest.amount_gross > 0)
                    {
                        incommingParameters.Add(new KeyValuePair<string, string>("amount", payFastRequest.amount_gross.ToString().Replace("\"", "")));
                    }

                    if (incommingParameters.Count < 1)
                    {
                        throw new ArgumentException("At least one parameter must be supplied");
                    }

                    var parameterValue = this.GenerateSignature(httpClient, incommingParameters.ToArray());
                    var content = new StringContent(parameterValue, Encoding.UTF8, "application/json");

                    using (var response = await httpClient.PatchAsync(finalUrl, content))
                    {
                        res = await response.Content.ReadAsStringAsync();
                    }
                }
                
                Transaction requestTransaction = new Transaction();
                requestTransaction.UserId = id;
                requestTransaction.Advert = Convert.ToInt32(int3);
                requestTransaction.Tms = Convert.ToInt32(int4);
                requestTransaction.Directory = Convert.ToInt32(int5);
                requestTransaction.Vehicle = Convert.ToInt32(int1);
                requestTransaction.Load = Convert.ToInt32(int2);
                requestTransaction.Amount_gross = Convert.ToDecimal(amount);
                //requestTransaction.Amount_gross = Convert.ToDecimal(payFastNotifyViewModel.amount_gross);
                //requestTransaction.Amount_net = Convert.ToDecimal(payFastNotifyViewModel.amount_net);
                //requestTransaction.Amount_fee = Convert.ToDecimal(payFastNotifyViewModel.amount_fee);
                //requestTransaction.DateBilling = Convert.ToDateTime(payFastNotifyViewModel.billing_date);
                var resultTransaction = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, requestTransaction, new Transaction(), "transaction", "update");

                return Redirect(this.payFastSettings.ReturnUrl + page + "?action=return");
            }
            else
            {
                var recurringRequest = new PayFastRequest(this.payFastSettings.PassPhrase);

                // Merchant Details
                recurringRequest.merchant_id = this.payFastSettings.MerchantId;
                recurringRequest.merchant_key = this.payFastSettings.MerchantKey;
                recurringRequest.return_url = this.payFastSettings.ReturnUrl + page + "?action=return";
                recurringRequest.cancel_url = this.payFastSettings.CancelUrl + page + "?action=cancel";
                recurringRequest.notify_url = this.payFastSettings.NotifyUrl;

                // Buyer Details
                recurringRequest.email_address = email;

                // Transaction Details
                recurringRequest.m_payment_id = id.ToString();
                recurringRequest.amount = amount;
                recurringRequest.item_name = "Loadgistix Subscription";
                recurringRequest.item_description = "Create Subscription";

                // Transaction Options
                recurringRequest.email_confirmation = true;
                recurringRequest.confirmation_address = "admin@loadgistix.com";// "sbtu01@payfast.co.za";

                // Recurring Billing Details
                recurringRequest.subscription_type = SubscriptionType.Subscription;
                recurringRequest.billing_date = DateTime.Now;
                recurringRequest.recurring_amount = amount;
                recurringRequest.frequency = BillingFrequency.Monthly;
                recurringRequest.cycles = 0;
                recurringRequest.custom_int1 = int1;
                recurringRequest.custom_int2 = int2;
                recurringRequest.custom_int3 = int3;
                recurringRequest.custom_int4 = int4;
                recurringRequest.custom_int5 = int5;

                var redirectUrl = $"{this.payFastSettings.ProcessUrl}{recurringRequest.ToString()}";

                return Redirect(redirectUrl);
            }
        }

        [HttpPost("notify")]
        public async Task<IActionResult> Notify([ModelBinder(BinderType = typeof(PayFastNotifyModelBinder))] PayFastNotify payFastNotifyViewModel)
        {
            var referer = Request.Headers["Referer"].ToString();

            payFastNotifyViewModel.custom_int1 = payFastNotifyViewModel.custom_int1 == "" ? "0" : payFastNotifyViewModel.custom_int1;
            payFastNotifyViewModel.custom_int2 = payFastNotifyViewModel.custom_int2 == "" ? "0" : payFastNotifyViewModel.custom_int2;
            payFastNotifyViewModel.custom_int3 = payFastNotifyViewModel.custom_int3 == "" ? "0" : payFastNotifyViewModel.custom_int3;
            payFastNotifyViewModel.custom_int4 = payFastNotifyViewModel.custom_int4 == "" ? "0" : payFastNotifyViewModel.custom_int4;
            payFastNotifyViewModel.custom_int5 = payFastNotifyViewModel.custom_int5 == "" ? "0" : payFastNotifyViewModel.custom_int5;

            payFastNotifyViewModel.SetPassPhrase(this.payFastSettings.PassPhrase);

            var calculatedSignature = payFastNotifyViewModel.GetCalculatedSignature();

            var isValid = payFastNotifyViewModel.signature == calculatedSignature;

            this.logger.LogInformation($"Signature Validation Result: {isValid}");

            // The PayFast Validator is still under developement
            // Its not recommended to rely on this for production use cases
            var payfastValidator = new PayFastValidator(this.payFastSettings, payFastNotifyViewModel, this.HttpContext.Connection.RemoteIpAddress);

            var merchantIdValidationResult = payfastValidator.ValidateMerchantId();

            this.logger.LogInformation($"Merchant Id Validation Result: {merchantIdValidationResult}");

            var ipAddressValidationResult = await payfastValidator.ValidateSourceIp();

            this.logger.LogInformation($"Ip Address Validation Result: {ipAddressValidationResult}");

            string jsonString = JsonSerializer.Serialize(payFastNotifyViewModel);

            // Currently seems that the data validation only works for success
            if (payFastNotifyViewModel.payment_status == PayFastStatics.CompletePaymentConfirmation)
            {
                try
                {
                    var dataValidationResult = await payfastValidator.ValidateData();

                    this.logger.LogInformation($"Data Validation Result: {dataValidationResult}");

                    string userId = payFastNotifyViewModel.m_payment_id;
                    string reference = payFastNotifyViewModel.pf_payment_id.ToString();

                    Subscription request = new Subscription();
                    request.UserId = userId;
                    //request.Token = Guid.Parse(payFastNotifyViewModel.token);
                    //request.Signature = payFastNotifyViewModel.signature;
                    request.Reference = reference;
                    request.Amount_gross = Convert.ToDecimal(payFastNotifyViewModel.amount_gross);
                    request.Amount_net = Convert.ToDecimal(payFastNotifyViewModel.amount_net);
                    request.Amount_fee = Convert.ToDecimal(payFastNotifyViewModel.amount_fee);
                    request.DateStart = Convert.ToDateTime(payFastNotifyViewModel.billing_date);
                    var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Subscription(), "subscription", "insert");

                    Transaction requestTransaction = new Transaction();
                    requestTransaction.UserId = userId;
                    requestTransaction.SubscriptionId = result.Id;
                    requestTransaction.Advert = Convert.ToInt32(payFastNotifyViewModel.custom_int3);
                    requestTransaction.Tms = Convert.ToInt32(payFastNotifyViewModel.custom_int4);
                    requestTransaction.Directory = Convert.ToInt32(payFastNotifyViewModel.custom_int5);
                    requestTransaction.Vehicle = Convert.ToInt32(payFastNotifyViewModel.custom_int1);
                    requestTransaction.Load = Convert.ToInt32(payFastNotifyViewModel.custom_int2);
                    requestTransaction.Amount_gross = Convert.ToDecimal(payFastNotifyViewModel.amount_gross);
                    requestTransaction.Amount_net = Convert.ToDecimal(payFastNotifyViewModel.amount_net);
                    requestTransaction.Amount_fee = Convert.ToDecimal(payFastNotifyViewModel.amount_fee);
                    requestTransaction.DateBilling = Convert.ToDateTime(payFastNotifyViewModel.billing_date);
                    var resultTransaction = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, requestTransaction, new Transaction(), "transaction", "insert");
                }
                catch (Exception exc)
                {
                    string msg = exc.Message;
                }
            }

            if (payFastNotifyViewModel.payment_status == PayFastStatics.CancelledPaymentConfirmation)
            {
                this.logger.LogInformation($"Subscription was cancelled");
            }

            return Ok();
        }
    }
}
