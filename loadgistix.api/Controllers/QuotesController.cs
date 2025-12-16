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
using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuotesController : ControllerBase
    {
        public IConfiguration _configuration; public string connectionString;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public QuotesController(IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config; 
            connectionString = config.GetConnectionString("DefaultConnection");
        }

        // GET: api/Quotes
        [HttpGet]
        public async Task<ProcedureResult> GetQuote()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new QuoteView(), new QuoteView(), "quote", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/Quotes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuoteView>> GetQuote(Guid id)
        {
            QuoteView request = new QuoteView();
            request.Id = id;
            var quote = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteView(), "quote", "select-single");

            if (quote == null)
            {
                return NotFound();
            }

            return quote;
        }

        [HttpGet("SendQuoteRequest/{id}")]
        public async Task<ActionResult<QuoteView>> SendQuoteRequest(Guid id)
        {
            try
            {
                QuoteView request = new QuoteView();
                request.Id = id;
                QuoteView quote = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteView(), "quotes", "select-single");

                QuoteTrailer requestQuoteTrailer = new QuoteTrailer();
                requestQuoteTrailer.QuoteId = id;
                var quoteTrailers = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, requestQuoteTrailer, new QuoteTrailer(), "quoteTrailer", "select");

                QuoteTruck requestQuoteTruck = new QuoteTruck();
                requestQuoteTruck.QuoteId = id;
                var quoteTrucks = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, requestQuoteTruck, new QuoteTruck(), "quoteTruck", "select");

                MailMessage mail = new MailMessage();
                SmtpClient smtpClient = new SmtpClient();
                mail.From = new MailAddress("info@madservices.co.za", "Loadgistix");
                mail.ReplyTo = new MailAddress("info@loadgistix.com");
                mail.ReplyToList.Add("info@loadgistix.com");
                mail.To.Add(quote.Email);
                mail.Bcc.Add("anton@madproducts.co.za");
                mail.Subject = "Loadgistix - QuoteView Request";
                mail.IsBodyHtml = true;
                mail.AlternateViews.Add(Mail_Body(quote, quoteTrucks, quoteTrailers, "insuranceRequest"));
                smtpClient.Port = 587;
                smtpClient.Host = "mail.madservices.co.za";
                //smtpClient.EnableSsl = true;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential("info@madservices.co.za", "P@szw0rd");
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.Send(mail);

                return quote;
            }
            catch (Exception ex)
            {
                return NotFound();
            }
        }
        private AlternateView Mail_Body(QuoteView quote, List<QuoteTruck> quoteTrucks, List<QuoteTrailer> quoteTrailers, string template)
        {
            var path = Path.Combine(System.IO.Directory.GetCurrentDirectory(), "EmailTemplates");
            var file = Path.Combine(path, template + ".html");

            var imagePath = Path.Combine(path, "images");
            var image = Path.Combine(imagePath, "logo-text.png");

            string html = System.IO.File.ReadAllText(file);
            html = html.Replace("!*id*!", "<a target='_blank' alt='' href=\"https://loadgistix.com/quote-generator?id=\" + quote.Id.ToString() + \"");
            html = html.Replace("!*nameFirst*!", quote.NameFirst);
            html = html.Replace("!*nameLast*!", quote.NameLast);
            html = html.Replace("!*email*!", quote.Email);
            html = html.Replace("!*mobileNumber*!", quote.MobileNumber);
            html = html.Replace("!*company*!", quote.Company);
            html = html.Replace("!*businessDescriptionId*!", quote.BusinessDescriptionId.ToString());
            html = html.Replace("!*businessDescription*!", quote.BusinessDescription);
            html = html.Replace("!*ownedRentedId*!", quote.OwnedRentedId.ToString());
            html = html.Replace("!*ownedRentedDescription*!", quote.OwnedRentedDescription);
            html = html.Replace("!*premium*!", quote.Premium.ToString());
            html = html.Replace("!*createdOn*!", quote.CreatedOn.ToPayFastDate());
            html = html.Replace("!*status*!", quote.Status);

            if(quoteTrucks.Count > 0)
            {
                html = html.Replace("!*trucks*!", "<div class=\"section\"><h2>VEHICLE DETAILS</h2><table class=\"quarter-width\"><tr><th>Truck Make</th><th>Truck Model</th><th>Truck Year</th><th>Truck Value</th></tr>!*truck*!</table></div>");

                for (int i = 0; i < quoteTrucks.Count; i++)
                {
                    html = html.Replace("!*truck*!", "<tr><td>!*makeTruck*!</td><td>!*modelTruck*!</td><td>!*yearTruck*!</td><td>!*valueTruck*!</td></tr>!*truck*!");
                    html = html.Replace("!*makeTruck*!", quoteTrucks[i].Make);
                    html = html.Replace("!*modelTruck*!", quoteTrucks[i].Model);
                    html = html.Replace("!*yearTruck*!", quoteTrucks[i].Year.ToString());
                    html = html.Replace("!*valueTruck*!", quoteTrucks[i].Value.ToString());
                }
            }
            else
            {
                html = html.Replace("!*trucks*!", "");
            }
            html = html.Replace("!*truck*!", "");

            if (quoteTrailers.Count > 0)
            {
                html = html.Replace("!*trailers*!", "<div class=\"section\"><h2>VEHICLE DETAILS</h2><table class=\"quarter-width\"><tr><th>Trailer Make</th><th>Trailer Model</th><th>Trailer Year</th><th>Trailer Value</th></tr>!*trailer*!</table></div>");

                for (int i = 0; i < quoteTrailers.Count; i++)
                {
                    html = html.Replace("!*trailer*!", "<tr><td>!*makeTrailer*!</td><td>!*modelTrailer*!</td><td>!*yearTrailer*!</td><td>!*valueTrailer*!</td></tr>!*trailer*!");
                    html = html.Replace("!*makeTrailer*!", quoteTrailers[i].Make);
                    html = html.Replace("!*modelTrailer*!", quoteTrailers[i].Model);
                    html = html.Replace("!*yearTrailer*!", quoteTrailers[i].Year.ToString());
                    html = html.Replace("!*valueTrailer*!", quoteTrailers[i].Value.ToString());
                }
            }
            else
            {
                html = html.Replace("!*trailers*!", "");
            }
            html = html.Replace("!*trailer*!", "");

            LinkedResource Img = new LinkedResource(image, System.Net.Mime.MediaTypeNames.Image.Jpeg);
            Img.ContentId = "MyImage";
            AlternateView AV = AlternateView.CreateAlternateViewFromString(html, null, System.Net.Mime.MediaTypeNames.Text.Html);
            AV.LinkedResources.Add(Img);

            var imageApp = Path.Combine(imagePath, "loadgistix.jpg");
            LinkedResource ImgApp = new LinkedResource(imageApp, System.Net.Mime.MediaTypeNames.Image.Jpeg);
            ImgApp.ContentId = "ImageApp";
            AV.LinkedResources.Add(ImgApp);

            return AV;
        }
    }
}
