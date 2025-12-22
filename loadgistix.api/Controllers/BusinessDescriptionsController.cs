using loadgistix.api.Helpers;
using loadgistix.api.Models;
using Microsoft.AspNetCore.Mvc;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessDescriptionsController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;

        public BusinessDescriptionsController(IConfiguration config)
        {
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
        }

        // GET: api/BusinessDescriptions
        [HttpGet]
        public async Task<ProcedureResult> GetBusinessDescriptions()
        {
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new BusinessDescription(), new BusinessDescription(), "businessDescription", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/BusinessDescriptions/5
        [HttpGet("{id}")]
        public async Task<ProcedureResult> GetBusinessDescription(Guid id)
        {
            BusinessDescription request = new BusinessDescription { Id = id };
            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new BusinessDescription(), "businessDescription", "select-single");
            return new ProcedureResult { Result = true, Data = result };
        }
    }
}

