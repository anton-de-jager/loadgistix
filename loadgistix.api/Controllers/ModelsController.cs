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
    public class ModelsController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;
        private readonly IHubContext<ModelHub, IModelHubClient> _modelHubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ModelsController(IConfiguration config, IHubContext<ModelHub, IModelHubClient> modelHubContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
            _modelHubContext = modelHubContext;
        }

        // GET: api/Models
        [HttpGet]
        public async Task<ProcedureResult> GetModel()
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, new Model(), new Model(), "model", "select");
            return new ProcedureResult { Result = true, Data = result };
        }

        // GET: api/Models/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Model>> GetModel(Guid id)
        {
            Model request = new Model();
            request.Id = id;
            var model = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Model(), "model", "select-single");

            if (model == null)
            {
                return NotFound();
            }

            return model;
        }

        // PUT: api/Models/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ProcedureResult> PutModel(Model model)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, model, new Model(), "model", "update");

            await _modelHubContext.Clients.All.ModelUpdated(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }

        // POST: api/Models
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ProcedureResult> PostModel(Model model)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, model, new Model(), "model", "insert");

            await _modelHubContext.Clients.All.ModelAdded(result);
            return new ProcedureResult { Result = true, Id = result.Id, Data = result };
        }
        
        [HttpPost("delete/{id}")]
        public async Task<ProcedureResult> DeleteModel(Guid id)
        {
            var uid = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Country);
            var displayName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

            if (uid == null)
            {
                return new ProcedureResult { Result = false, Data = "Unauthorised" };
            }

            Model request = new Model();
            request.Id = id;
            string message = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, request, new Model(), "model", "delete");

            await _modelHubContext.Clients.All.ModelDeleted(id);
            return new ProcedureResult { Result = message == "Success" ? true : false, Id = id, Message = message };
        }
    }
}
