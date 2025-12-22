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

        // GET: api/dashboard
        [HttpGet]
        public async Task<ProcedureResult> Get()
        {
            // Dashboard stats don't require input parameters
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new Dashboard(), new Dashboard(), "dashboard", "select-single");
            return new ProcedureResult { Result = true, Data = result };
        }

        // POST: api/dashboard (for backwards compatibility with frontend)
        [HttpPost]
        public async Task<ProcedureResult> Post(DashboardRequest? request)
        {
            // Dashboard stats don't require input parameters - ignore the request body
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new Dashboard(), new Dashboard(), "dashboard", "select-single");
            return new ProcedureResult { Result = true, Data = result };
        }
    }

    public class DashboardRequest
    {
        public string? UserId { get; set; }
        public string? Action { get; set; }
    }
}
