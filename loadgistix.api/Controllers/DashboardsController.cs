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

        [HttpPost]
        public async Task<ProcedureResult> Get(DashboardRequest request)
        {
            var action = string.IsNullOrEmpty(request.Action) ? "select-single" : request.Action;
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Dashboard(), "dashboard", action);

            return new ProcedureResult { Result = true, Data = result };
        }
    }

    public class DashboardRequest
    {
        public string? UserId { get; set; }
        public string? Action { get; set; }
    }
}
