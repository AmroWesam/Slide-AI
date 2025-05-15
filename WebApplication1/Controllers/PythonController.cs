using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    public class PythonController : Controller
    {
        private readonly PythonService _pythonService;

        public PythonController(PythonService pythonService)
        {
            _pythonService = pythonService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> RunApiScript()
        {
            // Execute the Python API script
            string result = await _pythonService.ExecutePythonScriptAsync("api.py");
            ViewBag.Result = result;
            return View("Result");
        }

        [HttpGet]
        public async Task<IActionResult> RunMainScript()
        {
            // Execute the main Python script
            string result = await _pythonService.ExecutePythonScriptAsync("main.py");
            ViewBag.Result = result;
            return View("Result");
        }

        [HttpGet]
        public IActionResult StartApiServer()
        {
            // Start the API server as a separate process
            int processId = _pythonService.StartPythonProcess("api.py");
            ViewBag.Message = processId > 0 
                ? $"API server started successfully with process ID: {processId}" 
                : "Failed to start API server";
            return View("Message");
        }
    }
}
