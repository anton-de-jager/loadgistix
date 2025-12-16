using loadgistix.api.Helpers;
using loadgistix.api.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdpGroupsController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PdpGroupsController(IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public async Task<ProcedureResult> GetPdpGroups()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new PdpGroup(), new PdpGroup(), "pdp_group", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PdpGroup>> GetPdpGroup(Guid id)
        {
            PdpGroup request = new PdpGroup();
            request.Id = id;
            var pdpGroup = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new PdpGroup(), "pdp_group", "select-single");

            if (pdpGroup == null)
            {
                return NotFound();
            }

            return pdpGroup;
        }

        [HttpPut]
        public async Task<ProcedureResult> PutPdpGroup(PdpGroup pdpGroup)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, pdpGroup, new PdpGroup(), "pdp_group", "update");
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost]
        public async Task<ProcedureResult> PostPdpGroup(PdpGroup pdpGroup)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            pdpGroup.UserId = uid;
            pdpGroup.UserDescription = displayName;

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, pdpGroup, new PdpGroup(), "pdp_group", "insert");
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeletePdpGroup(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            PdpGroup request = new PdpGroup();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new PdpGroup(), "pdp_group", "delete");

            return new ProcedureResult { Result = message == "Success", Id = id, Message = message };
        }
    }
}

