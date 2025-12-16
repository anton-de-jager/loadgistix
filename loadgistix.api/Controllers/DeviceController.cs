using loadgistix.api.Helpers;
using loadgistix.api.Models;
using Microsoft.AspNetCore.Mvc;

namespace loadgistix.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        public IConfiguration _configuration;
        public string connectionString;

        public DeviceController(IConfiguration config)
        {
            _configuration = config;
            connectionString = config.GetConnectionString("DefaultConnection");
        }

        /// <summary>
        /// Logs device location data. Currently returns success without persisting.
        /// To enable persistence, create the device_log table and usp_action_device_log stored procedure.
        /// </summary>
        [HttpPost("log")]
        public async Task<ProcedureResult> PostDeviceLog(DeviceLog deviceLog)
        {
            // Return success - device logging is non-critical
            // To enable actual logging, uncomment below and create usp_action_device_log stored procedure
            /*
            try
            {
                deviceLog.Id = Guid.NewGuid();
                deviceLog.LogDate = DateTime.UtcNow;
                var result = await DataTypeHelper.ActionStoredProcedureAsync(connectionString, deviceLog, new DeviceLog(), "device_log", "insert");
                return new ProcedureResult { Result = true, Id = result.Id, Data = result };
            }
            catch (Exception ex)
            {
                return new ProcedureResult { Result = false, Data = ex.Message };
            }
            */
            
            deviceLog.Id = Guid.NewGuid();
            deviceLog.LogDate = DateTime.UtcNow;
            return new ProcedureResult { Result = true, Id = deviceLog.Id, Data = deviceLog };
        }
    }
}

