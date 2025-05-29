using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebApplication1.Services;
using System.IO;
using System;

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
        
        [HttpPost]
        public async Task<IActionResult> ConvertPresentation()
        {
            try
            {
                // Execute the conversion script to convert PowerPoint to images
                string result = await _pythonService.ExecutePythonScriptAsync("convert.py");
                
                // Verify that images were created in the correct path
                string presentationPath = Path.Combine("C:\\Smart Control Techniques", "Presentation");
                bool imagesCreated = Directory.Exists(presentationPath) && 
                                     Directory.GetFiles(presentationPath, "*.jpg").Length > 0 || 
                                     Directory.GetFiles(presentationPath, "*.png").Length > 0;
                
                return Json(new { success = imagesCreated, message = result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        
        [HttpPost]
        public IActionResult StartPresentation()
        {
            try
            {
                // Start the Python script asynchronously without waiting for completion
                System.Threading.Tasks.Task.Run(() => {
                    try {
                        string scriptPath = Path.Combine("C:\\Smart Control Techniques", "main.py");
                        if (System.IO.File.Exists(scriptPath))
                        {
                            _pythonService.StartPythonProcess("main.py");
                        }
                    }
                    catch (System.Exception) {
                        // Suppress any exceptions to ensure they don't block the user experience
                    }
                });
                
                // Always return success to ensure immediate redirect
                return Json(new { success = true });
            }
            catch (System.Exception)
            {
                // Even if there's an error, return success to ensure the user experience is not blocked
                return Json(new { success = true });
            }
        }
    }
}
