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

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AxelsController : ControllerBase
    {
        public IConfiguration _configuration; public string connectionString;
        private readonly IHubContext<AxelHub, IAxelHubClient> _axelHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AxelsController(IConfiguration config, IHubContext<AxelHub, IAxelHubClient> axelHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config; 
            connectionString = config.GetConnectionString("DefaultConnection");
            _axelHubContext = axelHubContext;
        }

        // GET: api/Axels
        [HttpGet]
        public async Task<ProcedureResult> GetAxel()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new Axel(), new Axel(), "axel", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/Axels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Axel>> GetAxel(Guid id)
        {
            Axel request = new Axel();
            request.Id = id;
            var axel = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Axel(), "axel", "select-single");

            if (axel == null)
            {
                return NotFound();
            }

            return axel;
        }

        // GET: api/Axels/5
        [HttpPost("voucher")]
        public async Task<ProcedureResult> GetVoucher(StringRequest voucher)
        {
            Axel request = new Axel();
            request.Description = voucher.Description;
            var axel = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Axel(), "axel", "voucher");

            return new ProcedureResult { Result = true, Data = axel == null ? null : axel.Id };
        }

        // PUT: api/Axels/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutAxel(Axel axel)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, axel, new Axel(), "axel", "update");

            await _axelHubContext.Clients.All.AxelUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/Axels
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostAxel(Axel axel)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, axel, new Axel(), "axel", "insert");

            await _axelHubContext.Clients.All.AxelAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteAxel(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Axel request = new Axel();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Axel(), "axel", "delete");

            await _axelHubContext.Clients.All.AxelDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
