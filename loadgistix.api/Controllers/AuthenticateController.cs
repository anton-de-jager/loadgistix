using loadgistix.api.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Text;
using Newtonsoft.Json.Linq;
using loadgistix.api.Models;
using loadgistix.api.Repositories;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthenticateController(
            IUserRepository userRepository,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost("sign-in")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Country, user.Id),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var token = await GenerateAndStoreToken(user);

                return Ok(new
                {
                    accessToken = new JwtSecurityTokenHandler().WriteToken(token),
                    user = user,
                    expiration = token.ValidTo
                });
            }
            return Unauthorized();
        }

        [HttpPost]
        [Route("sign-in-with-token")]
        public async Task<IActionResult> SignInUsingToken([FromBody] RefreshTokenModel model)
        {
            try
            {
                // Check if AccessToken is provided
                if (string.IsNullOrEmpty(model?.AccessToken))
                {
                    return BadRequest("AccessToken is required");
                }

                // Retrieve the token from the model
                var token = model.AccessToken;

                // Validate the token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    RequireExpirationTime = true,
                    ValidateLifetime = true
                }, out var validatedToken);

                // Extract claims from the validated token
                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(x => x.Type == ClaimTypes.Country).Value;

                // Authenticate user (example: retrieve user from database based on userId)
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return BadRequest("User not found");
                }

                // Optionally, generate a new token (e.g., for refreshing tokens)
                var tokenNew = await GenerateAndStoreToken(user);

                // Return a response indicating successful authentication
                return Ok(new {
                    accessToken = new JwtSecurityTokenHandler().WriteToken(tokenNew),
                    user = user,
                    expiration = tokenNew.ValidTo
                });
            }
            catch (Exception ex)
            {
                // Return an error response if token validation fails
                return BadRequest("Invalid token");
            }
        }

        [HttpPost]
        [Route("sign-up")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

            ApplicationUser user = new()
            {
                Email = model.Email,
                UserName = model.Email.Replace("@", ""),
                SecurityStamp = Guid.NewGuid().ToString(),                
                Name = model.Name,
                Company = model.Company,
                ResetToken = "",
                Status = "online",
                Avatar = "",
                EmailConfirmed = true
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            try
            {
                // Validate model
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _userManager.FindByEmailAsync(model.Email);

                if (user != null) {
                    // Retrieve email from the model
                    var email = model.Email;

                    // Generate a reset token (for demonstration purposes, generating a random token)
                    var resetToken = Guid.NewGuid().ToString();

                    // Store the reset token along with the user's email
                    await _userRepository.UpdateResetToken(email, resetToken);

                    // Send email with reset instructions
                    await SendResetEmail(email, resetToken);

                    return Ok("Password reset instructions sent successfully.");
                }
                return Unauthorized();
            }
            catch (Exception ex)
            {
                // Log the exception
                // Return an error response
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            try
            {
                // Validate model
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Retrieve password from the model
                var newPassword = model.Password;

                // Perform any additional validation or verification of the password
                // For demonstration purposes, let's assume the password meets the requirements

                // Update the user's password in the database
                var user = await _userRepository.GetUserByResetTokenAsync(model.Token);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, resetToken, newPassword);

                if (!result.Succeeded)
                {
                    // Handle password reset failure
                    return BadRequest("Failed to reset password.");
                }

                return Ok("Password reset successfully.");
            }
            catch (Exception ex)
            {
                // Log the exception
                // Return an error response
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        private async Task SendResetEmail(string email, string resetToken)
        {
            // Configure SMTP client - Port 25 without SSL (server doesn't support secure connections)
            using (var smtpClient = new SmtpClient("winsvrmail01.hostserv.co.za"))
            {
                smtpClient.Port = 25;
                smtpClient.EnableSsl = false;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential("info@loadgistix.com", "P@szw0rdL");
                smtpClient.Timeout = 30000;

                // Create the email message
                var message = new MailMessage();
                message.From = new MailAddress("info@loadgistix.com", "Loadgistix");
                message.ReplyTo = new MailAddress("info@loadgistix.com");
                message.To.Add(email);
                message.Subject = "Password Reset Instructions";
                message.Body = $"Dear User,\n\nPlease use the following link to reset your password:\n\nhttps://loadgistix.com/reset-password?token={resetToken}";

                // Send the email
                await smtpClient.SendMailAsync(message);
            }
        }

        private string SendEmailTemplate(string subject, string email, string id, string template)
        {
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient smtpClient = new SmtpClient();
                mail.From = new MailAddress("info@loadgistix.com", "Loadgistix");
                mail.ReplyTo = new MailAddress("info@loadgistix.com");
                mail.ReplyToList.Add("info@loadgistix.com");
                mail.To.Add(email);
                mail.Bcc.Add("anton@madproducts.co.za");
                mail.Subject = subject;
                mail.IsBodyHtml = true;
                mail.AlternateViews.Add(Mail_Body(id, email, template));
                // Port 25 without SSL (server doesn't support secure connections)
                smtpClient.Port = 25;
                smtpClient.Host = "winsvrmail01.hostserv.co.za";
                smtpClient.EnableSsl = false;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential("info@loadgistix.com", "P@szw0rdL");
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.Timeout = 30000;
                smtpClient.Send(mail);

                return "OK";
            }
            catch (Exception ex)
            {
                return "ERROR: " + ex.Message;
            }
        }
        private AlternateView Mail_Body(string id, string email, string template)
        {
            var path = Path.Combine(System.IO.Directory.GetCurrentDirectory(), "EmailTemplates");
            var file = Path.Combine(path, template + ".html");

            var imagePath = Path.Combine(path, "images");
            var image = Path.Combine(imagePath, "logo-text.png");

            string html = System.IO.File.ReadAllText(file).Replace("__id__", id).Replace("__email__", email);

            LinkedResource Img = new LinkedResource(image, System.Net.Mime.MediaTypeNames.Image.Jpeg);
            Img.ContentId = "MyImage";
            AlternateView AV = AlternateView.CreateAlternateViewFromString(html, null, System.Net.Mime.MediaTypeNames.Text.Html);
            AV.LinkedResources.Add(Img);

            if (template == "info")
            {
                var imageApp = Path.Combine(imagePath, "app.jpeg");
                LinkedResource ImgApp = new LinkedResource(imageApp, System.Net.Mime.MediaTypeNames.Image.Jpeg);
                ImgApp.ContentId = "ImageApp";
                AV.LinkedResources.Add(ImgApp);
            }
            return AV;
        }

        private async Task<JwtSecurityToken> GenerateAndStoreToken(ApplicationUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Country, user.Id),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var token = GetToken(authClaims);

            // Store the token in AspNetUserTokens
            await _userManager.SetAuthenticationTokenAsync(user, "Bearer", "Access Token", token.ToString());

            return token;
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                //issuer: _configuration["JWT:ValidIssuer"],
                //audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddDays(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }

        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            // Get the current user's claims
            ClaimsPrincipal user = HttpContext.User;

            // Check if the user is authenticated
            if (user.Identity.IsAuthenticated)
            {
                // Get the user's unique identifier (if available)
                string userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // You can access other claims as needed
                // For example, to get the user's email:
                string userEmail = user.FindFirst(ClaimTypes.Email)?.Value;
                string userName = user.FindFirst(ClaimTypes.Name)?.Value;

                // Return the user's information
                return Ok(new
                {
                    UserId = userId,
                    Email = userEmail,
                    Name = userName
                });
            }
            else
            {
                // If the user is not authenticated, return an unauthorized response
                return Unauthorized();
            }
        }
    }
}
