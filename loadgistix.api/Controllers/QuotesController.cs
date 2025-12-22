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
        public async Task<ActionResult<ProcedureResult>> GetQuote(Guid id)
        {
            try
            {
                // Use simple request with just Id to avoid "too many arguments" error
                var request = new QuoteRequest { Id = id };
                dynamic quoteResult = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteView(), "quote", "select-single");

                // Check if result is an error string
                if (quoteResult is string errorMessage)
                {
                    return Ok(new ProcedureResult { Result = false, Message = $"Database error: {errorMessage}" });
                }

                QuoteView quote = quoteResult as QuoteView;
                if (quote == null)
                {
                    return Ok(new ProcedureResult { Result = false, Message = $"Quote not found for ID: {id}" });
                }

                return Ok(new ProcedureResult { Result = true, Data = quote });
            }
            catch (Exception ex)
            {
                return Ok(new ProcedureResult { Result = false, Message = $"Error: {ex.Message}" });
            }
        }

        // POST: api/Quotes
        [HttpPost]
        public async Task<ProcedureResult> PostQuote(Quote quote)
        {
            try
            {
                if (quote.Id == null || quote.Id == Guid.Empty)
                {
                    quote.Id = Guid.NewGuid();
                }
                quote.CreatedOn = DateTime.UtcNow;
                quote.Status = "Pending";

                await DataTypeHelper.ActionStoredProcedureAsync(connectionString, quote, new Quote(), "quote", "insert");
                // Return the input object with the generated ID
                return new ProcedureResult { Result = true, Id = quote.Id ?? Guid.Empty, Data = quote };
            }
            catch (Exception ex)
            {
                return new ProcedureResult { Result = false, Message = ex.Message };
            }
        }

        // PUT: api/Quotes (ID in body)
        [HttpPut]
        public async Task<ProcedureResult> PutQuote(Quote quote)
        {
            try
            {
                var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, quote, new Quote(), "quote", "update");
                return new ProcedureResult { Result = true, Data = result };
            }
            catch (Exception ex)
            {
                return new ProcedureResult { Result = false, Message = ex.Message };
            }
        }

        // PUT: api/Quotes/5 (ID in URL)
        [HttpPut("{id}")]
        public async Task<ProcedureResult> PutQuoteById(Guid id, Quote quote)
        {
            try
            {
                quote.Id = id;
                var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, quote, new Quote(), "quote", "update");
                return new ProcedureResult { Result = true, Data = result };
            }
            catch (Exception ex)
            {
                return new ProcedureResult { Result = false, Message = ex.Message };
            }
        }

        [HttpGet("SendQuoteRequest/{id}")]
        public async Task<ActionResult<ProcedureResult>> SendQuoteRequest(Guid id)
        {
            try
            {
                Console.WriteLine($"=== SendQuoteRequest START ===");
                Console.WriteLine($"Quote ID: {id}");
                
                // Use simple request with just Id to avoid "too many arguments" error
                var request = new QuoteRequest { Id = id };
                Console.WriteLine($"Fetching quote from database...");
                dynamic quoteResult = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteView(), "quote", "select-single");
                Console.WriteLine($"Quote result type: {quoteResult?.GetType()?.Name ?? "null"}");

                // Check if result is an error string
                if (quoteResult is string errorMessage)
                {
                    Console.WriteLine($"ERROR: Database returned error string: {errorMessage}");
                    return Ok(new ProcedureResult { Result = false, Message = $"Database error: {errorMessage}" });
                }

                QuoteView quote = quoteResult as QuoteView;
                if (quote == null)
                {
                    Console.WriteLine($"ERROR: Quote is null after cast");
                    return Ok(new ProcedureResult { Result = false, Message = $"Quote not found for ID: {id}" });
                }
                
                Console.WriteLine($"Quote found: Id={quote.Id}, Email={quote.Email}, NameFirst={quote.NameFirst}, Company={quote.Company}, Premium={quote.Premium}");
                
                if (string.IsNullOrEmpty(quote.Email))
                {
                    Console.WriteLine($"ERROR: Email is empty");
                    return Ok(new ProcedureResult { Result = false, Message = $"Email is missing for quote ID: {id}. Quote data: NameFirst={quote.NameFirst}, NameLast={quote.NameLast}" });
                }

                // Use simple request with just QuoteId
                Console.WriteLine($"Fetching trailers for quote...");
                var requestQuoteTrailer = new QuoteItemRequest { QuoteId = id };
                dynamic trailersResult = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, requestQuoteTrailer, new QuoteTrailer(), "quoteTrailer", "select");
                List<QuoteTrailer> quoteTrailers = trailersResult is string ? new List<QuoteTrailer>() : trailersResult as List<QuoteTrailer> ?? new List<QuoteTrailer>();
                Console.WriteLine($"Found {quoteTrailers.Count} trailers");

                Console.WriteLine($"Fetching trucks for quote...");
                var requestQuoteTruck = new QuoteItemRequest { QuoteId = id };
                dynamic trucksResult = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, requestQuoteTruck, new QuoteTruck(), "quoteTruck", "select");
                List<QuoteTruck> quoteTrucks = trucksResult is string ? new List<QuoteTruck>() : trucksResult as List<QuoteTruck> ?? new List<QuoteTruck>();
                Console.WriteLine($"Found {quoteTrucks.Count} trucks");

                Console.WriteLine($"Building email...");
                MailMessage mail = new MailMessage();
                SmtpClient smtpClient = new SmtpClient();
                mail.From = new MailAddress("info@loadgistix.com", "Loadgistix");
                mail.ReplyTo = new MailAddress("info@loadgistix.com");
                mail.ReplyToList.Add("info@loadgistix.com");
                mail.To.Add(quote.Email);
                mail.Bcc.Add("anton@madproducts.co.za");
                mail.Subject = "Loadgistix - Quote Request";
                mail.IsBodyHtml = true;
                
                Console.WriteLine($"Building email body from template...");
                mail.AlternateViews.Add(Mail_Body(quote, quoteTrucks, quoteTrailers, "insuranceRequest"));
                
                // Port 25 without SSL (server doesn't support secure connections)
                smtpClient.Port = 25;
                smtpClient.Host = "winsvrmail01.hostserv.co.za";
                smtpClient.EnableSsl = false;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential("info@loadgistix.com", "P@szw0rdL");
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.Timeout = 30000; // 30 second timeout
                
                Console.WriteLine($"Sending email to {quote.Email} via {smtpClient.Host}:{smtpClient.Port}...");
                smtpClient.Send(mail);
                Console.WriteLine($"=== SendQuoteRequest SUCCESS ===");

                return Ok(new ProcedureResult { Result = true, Data = quote, Message = "Quote email sent successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"=== SendQuoteRequest ERROR ===");
                Console.WriteLine($"Exception Type: {ex.GetType().Name}");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return Ok(new ProcedureResult { Result = false, Message = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("SendContactRequest/{id}")]
        public async Task<ActionResult<ProcedureResult>> SendContactRequest(Guid id)
        {
            try
            {
                Console.WriteLine($"=== SendContactRequest START ===");
                Console.WriteLine($"Quote ID: {id}");

                // Fetch the quote
                var request = new QuoteRequest { Id = id };
                dynamic quoteResult = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new QuoteView(), "quote", "select-single");

                if (quoteResult is string errorMessage)
                {
                    return Ok(new ProcedureResult { Result = false, Message = $"Database error: {errorMessage}" });
                }

                QuoteView quote = quoteResult as QuoteView;
                if (quote == null)
                {
                    return Ok(new ProcedureResult { Result = false, Message = $"Quote not found for ID: {id}" });
                }

                Console.WriteLine($"Quote found: {quote.NameFirst} {quote.NameLast}, Email: {quote.Email}");

                // Send contact request email to insurance team
                MailMessage mail = new MailMessage();
                SmtpClient smtpClient = new SmtpClient();
                mail.From = new MailAddress("info@loadgistix.com", "Loadgistix Quote System");
                mail.ReplyTo = new MailAddress(quote.Email ?? "noreply@loadgistix.com");
                mail.To.Add("insurance@loadgistix.com");
                mail.Subject = $"🚛 Contact Request - Quote {id.ToString().Substring(0, 8).ToUpper()}";
                mail.IsBodyHtml = true;
                
                // Build email body
                var createdDate = quote.CreatedOn ?? DateTime.UtcNow;
                string refNumber = $"LGX-{createdDate:yyyyMMdd}-{quote.Id.ToString().Substring(0, 8).ToUpper()}";
                
                mail.Body = $@"
                <html>
                <body style='font-family: Arial, sans-serif; padding: 20px;'>
                    <h2 style='color: #1976D2;'>📞 Contact Request Received</h2>
                    <p>A customer has requested to be contacted regarding their insurance quote.</p>
                    
                    <div style='background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                        <h3 style='margin-top: 0; color: #333;'>Quote Details</h3>
                        <table style='width: 100%; border-collapse: collapse;'>
                            <tr>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>Reference:</strong></td>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{refNumber}</td>
                            </tr>
                            <tr>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>Name:</strong></td>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{quote.NameFirst} {quote.NameLast}</td>
                            </tr>
                            <tr>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>Email:</strong></td>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd;'><a href='mailto:{quote.Email}'>{quote.Email}</a></td>
                            </tr>
                            <tr>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>Mobile:</strong></td>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd;'><a href='tel:{quote.MobileNumber}'>{quote.MobileNumber}</a></td>
                            </tr>
                            <tr>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>Company:</strong></td>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{quote.Company}</td>
                            </tr>
                            <tr>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd;'><strong>Annual Premium:</strong></td>
                                <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #1976D2;'>R{quote.Premium:N2}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p style='background: #e8f5e9; padding: 15px; border-radius: 8px; color: #2e7d32;'>
                        <strong>⚡ Action Required:</strong> Please contact this customer within 24 hours.
                    </p>
                    
                    <p style='color: #666; font-size: 12px; margin-top: 30px;'>
                        This is an automated message from the Loadgistix Quote System.
                    </p>
                </body>
                </html>";

                // Port 25 without SSL (server doesn't support secure connections)
                smtpClient.Port = 25;
                smtpClient.Host = "winsvrmail01.hostserv.co.za";
                smtpClient.EnableSsl = false;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential("info@loadgistix.com", "P@szw0rdL");
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.Timeout = 30000; // 30 second timeout

                Console.WriteLine($"Sending contact request email to insurance@loadgistix.com via {smtpClient.Host}:{smtpClient.Port}...");
                smtpClient.Send(mail);
                Console.WriteLine($"=== SendContactRequest SUCCESS ===");

                // Update quote status to "Contact Requested"
                quote.Status = "Contact Requested";
                await DataTypeHelper.ActionStoredProcedureAsync(connectionString, quote, new Quote(), "quote", "update");

                return Ok(new ProcedureResult { Result = true, Message = "Contact request sent successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"=== SendContactRequest ERROR ===");
                Console.WriteLine($"Exception: {ex.Message}");
                return Ok(new ProcedureResult { Result = false, Message = $"Error: {ex.Message}" });
            }
        }

        private AlternateView Mail_Body(QuoteView quote, List<QuoteTruck> quoteTrucks, List<QuoteTrailer> quoteTrailers, string template)
        {
            var path = Path.Combine(System.IO.Directory.GetCurrentDirectory(), "EmailTemplates");
            var file = Path.Combine(path, template + ".html");

            var imagePath = Path.Combine(path, "images");
            var image = Path.Combine(imagePath, "logo-text.png");

            // Helper function to format currency as South African Rand
            string FormatZAR(double? value) => value.HasValue ? $"R{value.Value:N2}" : "R0.00";
            
            // Calculate totals for the quote
            double totalTruckValue = quoteTrucks.Sum(t => t.Value ?? 0);
            double totalTrailerValue = quoteTrailers.Sum(t => t.Value ?? 0);
            double totalAssetValue = totalTruckValue + totalTrailerValue;
            double monthlyPremium = (quote.Premium ?? 0) / 12;

            string html = System.IO.File.ReadAllText(file);
            
            // Handle nullable dates
            var createdDate = quote.CreatedOn ?? DateTime.UtcNow;
            
            // Reference number - generate a readable format: LGX-YYYYMMDD-XXXX (first 8 chars of GUID)
            string refNumber = $"LGX-{createdDate:yyyyMMdd}-{quote.Id.ToString().Substring(0, 8).ToUpper()}";
            html = html.Replace("!*referenceNumber*!", refNumber);
            html = html.Replace("!*id*!", quote.Id.ToString());
            
            // Contact details
            html = html.Replace("!*nameFirst*!", quote.NameFirst ?? "");
            html = html.Replace("!*nameLast*!", quote.NameLast ?? "");
            html = html.Replace("!*email*!", quote.Email ?? "");
            html = html.Replace("!*mobileNumber*!", quote.MobileNumber ?? "");
            
            // Business details
            html = html.Replace("!*company*!", quote.Company ?? "");
            html = html.Replace("!*businessDescription*!", quote.BusinessDescription ?? "");
            html = html.Replace("!*ownedRentedDescription*!", quote.OwnedRentedDescription ?? "");
            
            // Financial details - formatted as ZAR
            html = html.Replace("!*totalAssetValue*!", FormatZAR(totalAssetValue));
            html = html.Replace("!*annualPremium*!", FormatZAR(quote.Premium));
            html = html.Replace("!*monthlyPremium*!", FormatZAR(monthlyPremium));
            
            // Date
            html = html.Replace("!*createdOn*!", createdDate.ToString("yyyy-MM-dd"));
            html = html.Replace("!*validUntil*!", createdDate.AddDays(30).ToString("yyyy-MM-dd"));

            // Vehicle details table - email-safe inline styles
            if(quoteTrucks.Count > 0)
            {
                var trucksHtml = new System.Text.StringBuilder();
                // Header
                trucksHtml.Append("<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background-color: #1976D2; border-radius: 6px 6px 0 0;\">");
                trucksHtml.Append("<tr><td style=\"padding: 12px 15px;\"><strong style=\"color: #ffffff; font-size: 14px;\">VEHICLE DETAILS</strong></td></tr></table>");
                // Table
                trucksHtml.Append("<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"1\" style=\"border-color: #e0e0e0; border-collapse: collapse;\">");
                trucksHtml.Append("<tr>");
                trucksHtml.Append("<td width=\"25%\" style=\"background-color: #f5f5f5; padding: 12px 15px; font-weight: 600; color: #555555; font-size: 12px; text-transform: uppercase; border: 1px solid #e0e0e0;\">Make</td>");
                trucksHtml.Append("<td width=\"25%\" style=\"background-color: #f5f5f5; padding: 12px 15px; font-weight: 600; color: #555555; font-size: 12px; text-transform: uppercase; border: 1px solid #e0e0e0;\">Model</td>");
                trucksHtml.Append("<td width=\"25%\" style=\"background-color: #f5f5f5; padding: 12px 15px; font-weight: 600; color: #555555; font-size: 12px; text-transform: uppercase; border: 1px solid #e0e0e0;\">Year</td>");
                trucksHtml.Append("<td width=\"25%\" style=\"background-color: #f5f5f5; padding: 12px 15px; font-weight: 600; color: #555555; font-size: 12px; text-transform: uppercase; text-align: right; border: 1px solid #e0e0e0;\">Insured Value</td>");
                trucksHtml.Append("</tr>");
                
                foreach (var truck in quoteTrucks)
                {
                    trucksHtml.Append("<tr>");
                    trucksHtml.Append($"<td style=\"padding: 12px 15px; border: 1px solid #e0e0e0;\">{truck.Make}</td>");
                    trucksHtml.Append($"<td style=\"padding: 12px 15px; border: 1px solid #e0e0e0;\">{truck.Model}</td>");
                    trucksHtml.Append($"<td style=\"padding: 12px 15px; border: 1px solid #e0e0e0;\">{truck.Year}</td>");
                    trucksHtml.Append($"<td style=\"padding: 12px 15px; text-align: right; font-weight: 600; border: 1px solid #e0e0e0;\">{FormatZAR(truck.Value)}</td>");
                    trucksHtml.Append("</tr>");
                }
                
                trucksHtml.Append("<tr style=\"background-color: #e3f2fd;\">");
                trucksHtml.Append("<td colspan=\"3\" style=\"padding: 12px 15px; border: 1px solid #e0e0e0; border-top: 2px solid #1976D2;\"><strong>Total Vehicle Value</strong></td>");
                trucksHtml.Append($"<td style=\"padding: 12px 15px; text-align: right; font-weight: 600; border: 1px solid #e0e0e0; border-top: 2px solid #1976D2;\"><strong>{FormatZAR(totalTruckValue)}</strong></td>");
                trucksHtml.Append("</tr></table>");
                html = html.Replace("!*trucks*!", trucksHtml.ToString());
            }
            else
            {
                html = html.Replace("!*trucks*!", "");
            }

            // Trailer details table - email-safe inline styles
            if (quoteTrailers.Count > 0)
            {
                var trailersHtml = new System.Text.StringBuilder();
                // Header
                trailersHtml.Append("<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"background-color: #1976D2; border-radius: 6px 6px 0 0;\">");
                trailersHtml.Append("<tr><td style=\"padding: 12px 15px;\"><strong style=\"color: #ffffff; font-size: 14px;\">TRAILER DETAILS</strong></td></tr></table>");
                // Table
                trailersHtml.Append("<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"1\" style=\"border-color: #e0e0e0; border-collapse: collapse;\">");
                trailersHtml.Append("<tr>");
                trailersHtml.Append("<td width=\"25%\" style=\"background-color: #f5f5f5; padding: 12px 15px; font-weight: 600; color: #555555; font-size: 12px; text-transform: uppercase; border: 1px solid #e0e0e0;\">Make</td>");
                trailersHtml.Append("<td width=\"25%\" style=\"background-color: #f5f5f5; padding: 12px 15px; font-weight: 600; color: #555555; font-size: 12px; text-transform: uppercase; border: 1px solid #e0e0e0;\">Type</td>");
                trailersHtml.Append("<td width=\"25%\" style=\"background-color: #f5f5f5; padding: 12px 15px; font-weight: 600; color: #555555; font-size: 12px; text-transform: uppercase; border: 1px solid #e0e0e0;\">Year</td>");
                trailersHtml.Append("<td width=\"25%\" style=\"background-color: #f5f5f5; padding: 12px 15px; font-weight: 600; color: #555555; font-size: 12px; text-transform: uppercase; text-align: right; border: 1px solid #e0e0e0;\">Insured Value</td>");
                trailersHtml.Append("</tr>");
                
                foreach (var trailer in quoteTrailers)
                {
                    trailersHtml.Append("<tr>");
                    trailersHtml.Append($"<td style=\"padding: 12px 15px; border: 1px solid #e0e0e0;\">{trailer.Make}</td>");
                    trailersHtml.Append($"<td style=\"padding: 12px 15px; border: 1px solid #e0e0e0;\">{trailer.Model}</td>");
                    trailersHtml.Append($"<td style=\"padding: 12px 15px; border: 1px solid #e0e0e0;\">{trailer.Year}</td>");
                    trailersHtml.Append($"<td style=\"padding: 12px 15px; text-align: right; font-weight: 600; border: 1px solid #e0e0e0;\">{FormatZAR(trailer.Value)}</td>");
                    trailersHtml.Append("</tr>");
                }
                
                trailersHtml.Append("<tr style=\"background-color: #e3f2fd;\">");
                trailersHtml.Append("<td colspan=\"3\" style=\"padding: 12px 15px; border: 1px solid #e0e0e0; border-top: 2px solid #1976D2;\"><strong>Total Trailer Value</strong></td>");
                trailersHtml.Append($"<td style=\"padding: 12px 15px; text-align: right; font-weight: 600; border: 1px solid #e0e0e0; border-top: 2px solid #1976D2;\"><strong>{FormatZAR(totalTrailerValue)}</strong></td>");
                trailersHtml.Append("</tr></table>");
                html = html.Replace("!*trailers*!", trailersHtml.ToString());
            }
            else
            {
                html = html.Replace("!*trailers*!", "");
            }

            // Embed logo as inline image (not attachment) - use PNG content type
            LinkedResource Img = new LinkedResource(image, "image/png");
            Img.ContentId = "MyImage";
            Img.TransferEncoding = System.Net.Mime.TransferEncoding.Base64;
            
            AlternateView AV = AlternateView.CreateAlternateViewFromString(html, null, System.Net.Mime.MediaTypeNames.Text.Html);
            AV.LinkedResources.Add(Img);

            return AV;
        }
    }

    // Simple request class with only Id to avoid "too many arguments" error
    public class QuoteRequest
    {
        public Guid? Id { get; set; }
    }

    // Simple request class for quote items (trucks/trailers)
    public class QuoteItemRequest
    {
        public Guid? QuoteId { get; set; }
    }
}
