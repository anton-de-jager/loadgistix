using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;

namespace loadgistix.api.Auth
{
    public class JwtVerifier
    {
        private readonly string _secret;
        private readonly HttpClient _httpClient;

        public JwtVerifier(string secret)
        {
            _secret = secret;
            _httpClient = new HttpClient();
        }

        public bool VerifyToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Convert.FromBase64String(_secret)),
                    ValidateIssuer = false, // Modify as needed
                    ValidateAudience = false, // Modify as needed
                    RequireExpirationTime = true,
                    ValidateLifetime = true
                };

                SecurityToken validatedToken;
                tokenHandler.ValidateToken(token, validationParameters, out validatedToken);

                return true; // Token is valid
            }
            catch (Exception ex)
            {
                // Token validation failed
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return false;
            }
        }

        public string GetClaimFromToken(string token, string claim)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = (JwtSecurityToken)tokenHandler.ReadToken(token);

                // Retrieve the userId claim from the token payload
                var response = jwtToken.Claims.First(c => c.Type == claim).Value;

                return response;
            }
            catch (Exception ex)
            {
                // Token parsing failed
                Console.WriteLine($"Token parsing failed: {ex.Message}");
                return null;
            }
        }

        public async Task<Guid> PostAndGetUserIdAsync(string apiUrl, string requestBody)
        {
            try
            {
                // Send the HTTP POST request
                var response = await _httpClient.PostAsync(apiUrl, new StringContent(requestBody));

                // Ensure a successful response
                response.EnsureSuccessStatusCode();

                // Read the response content as string
                string responseBody = await response.Content.ReadAsStringAsync();

                // Extract the userId from the response (assuming it's in JSON format)
                string userId = ExtractUserIdFromResponse(responseBody);

                return Guid.Parse(userId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred: {ex.Message}");
                return Guid.Empty;
            }
        }

        private string ExtractUserIdFromResponse(string responseBody)
        {
            dynamic responseObject = JsonConvert.DeserializeObject(responseBody);
            string userId = responseObject.userId;

            return userId;
        }
    }
}
