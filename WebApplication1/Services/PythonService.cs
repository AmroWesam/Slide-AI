using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace WebApplication1.Services
{
    public class PythonService
    {
        private readonly ILogger<PythonService> _logger;
        private readonly string _pythonProjectPath;
        private readonly string _pythonExecutablePath;

        public PythonService(ILogger<PythonService> logger)
        {
            _logger = logger;
            _pythonProjectPath = "C:\\Smart Control Techniques";
            
            // Default Python paths - update these as needed for your environment
            _pythonExecutablePath = "python"; // Assumes Python is in PATH
            // Alternatively use full path like: "C:\\Program Files\\Python311\\python.exe"
        }

        /// <summary>
        /// Executes a Python script and returns the output
        /// </summary>
        /// <param name="scriptName">Name of the script file in the Python project directory</param>
        /// <param name="arguments">Command line arguments to pass to the script</param>
        /// <returns>Output from the Python script</returns>
        public async Task<string> ExecutePythonScriptAsync(string scriptName, string arguments = "")
        {
            try
            {
                string scriptPath = Path.Combine(_pythonProjectPath, scriptName);
                
                if (!File.Exists(scriptPath))
                {
                    _logger.LogError($"Python script not found: {scriptPath}");
                    return $"Error: Script not found: {scriptPath}";
                }

                var startInfo = new ProcessStartInfo
                {
                    FileName = _pythonExecutablePath,
                    Arguments = $"\"{scriptPath}\" {arguments}",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    WorkingDirectory = _pythonProjectPath
                };

                _logger.LogInformation($"Executing Python script: {scriptPath} with arguments: {arguments}");

                using var process = new Process { StartInfo = startInfo };
                process.Start();

                // Read output and error asynchronously
                string output = await process.StandardOutput.ReadToEndAsync();
                string error = await process.StandardError.ReadToEndAsync();

                await process.WaitForExitAsync();

                if (!string.IsNullOrEmpty(error))
                {
                    _logger.LogError($"Python script error: {error}");
                    return $"Error: {error}";
                }

                return output;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing Python script");
                return $"Exception: {ex.Message}";
            }
        }

        /// <summary>
        /// Starts a Python script as a separate process without waiting for completion
        /// </summary>
        /// <param name="scriptName">Name of the script file in the Python project directory</param>
        /// <param name="arguments">Command line arguments to pass to the script</param>
        /// <returns>Process ID of the started Python process</returns>
        public int StartPythonProcess(string scriptName, string arguments = "")
        {
            try
            {
                string scriptPath = Path.Combine(_pythonProjectPath, scriptName);
                
                if (!File.Exists(scriptPath))
                {
                    _logger.LogError($"Python script not found: {scriptPath}");
                    return -1;
                }

                var startInfo = new ProcessStartInfo
                {
                    FileName = _pythonExecutablePath,
                    Arguments = $"\"{scriptPath}\" {arguments}",
                    UseShellExecute = true,
                    WorkingDirectory = _pythonProjectPath
                };

                _logger.LogInformation($"Starting Python process: {scriptPath} with arguments: {arguments}");

                using var process = Process.Start(startInfo);
                return process?.Id ?? -1;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting Python process");
                return -1;
            }
        }
    }
}
