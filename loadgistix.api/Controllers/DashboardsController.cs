using loadgistix.api.Helpers;
using loadgistix.api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace loadgistix.api.Controllers
{
    [Route("api/dashboard")]
    [Route("api/dashboards")]
    [ApiController]
    public class DashboardsController : ControllerBase
    {
        public IConfiguration _configuration; public string connectionString;

        public DashboardsController(IConfiguration config)
        {
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
        }

        // GET: api/dashboard - For landing page stats (no parameters needed)
        [HttpGet]
        public async Task<ProcedureResult> Get()
        {
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new DashboardRequestInternal(), new Dashboard(), "dashboard", "select-single");
            return new ProcedureResult { Result = true, Data = result };
        }

        // POST: api/dashboard - For admin dashboard with different actions
        [HttpPost]
        public async Task<ProcedureResult> Post(DashboardRequest? request)
        {
            // Determine the action - default to "select-single" for landing page
            var action = string.IsNullOrEmpty(request?.Action) ? "select-single" : request.Action;
            
            // Create internal request with only the userId (action is passed separately)
            var internalRequest = new DashboardRequestInternal
            {
                UserId = !string.IsNullOrEmpty(request?.UserId) ? Guid.Parse(request.UserId) : null
            };
            
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, internalRequest, new Dashboard(), "dashboard", action);
            return new ProcedureResult { Result = true, Data = result };
        }
    }

    // Internal request class - only pass userId to stored procedure (action is passed as separate parameter)
    public class DashboardRequestInternal
    {
        public Guid? UserId { get; set; }
    }

    // External request from frontend
    public class DashboardRequest
    {
        public string? UserId { get; set; }
        public string? Action { get; set; }
    }
}
