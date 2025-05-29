using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using System.Threading.Tasks;
using WebApplication1.Services;
using System.Diagnostics; // For using Process and ProcessStartInfo

namespace WebApplication1.Controllers
{
    public class PresentationsController : Controller
    {
        private readonly IWebHostEnvironment _environment;
        private readonly PythonService _pythonService;

        public PresentationsController(IWebHostEnvironment environment, PythonService pythonService)
        {
            _environment = environment;
            _pythonService = pythonService;
        }

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                TempData["ErrorMessage"] = "No file selected";
                return RedirectToAction("Presentations", "Home");
            }

            try
            {
                // Ensure directory exists
                string pythonPresentationFolder = @"C:\Smart Control Techniques\Presentation";
                if (!Directory.Exists(pythonPresentationFolder))
                {
                    Directory.CreateDirectory(pythonPresentationFolder);
                }

                // Radical approach: delete and recreate the presentation folder completely
                TempData["ScriptOutput"] += "\nCompletely recreating the presentation directory...";
                try
                {
                    // Save a list of all PowerPoint files (not images)
                    List<string> pptxFiles = new List<string>();
                    if (Directory.Exists(pythonPresentationFolder))
                    {
                        string[] pptxExtensions = { "*.pptx", "*.ppt" };
                        foreach (string ext in pptxExtensions)
                        {
                            string[] files = Directory.GetFiles(pythonPresentationFolder, ext);
                            foreach (string pptFile in files)
                            {
                                // Save file data for later restoration
                                string fileName = Path.GetFileName(pptFile);
                                byte[] fileData = System.IO.File.ReadAllBytes(pptFile);
                                pptxFiles.Add(fileName);
                                TempData["ScriptOutput"] += $"\nSaved PowerPoint file for restoration: {fileName}";
                            }
                        }
                    }

                    // Delete the entire folder if it exists
                    if (Directory.Exists(pythonPresentationFolder))
                    {
                        Directory.Delete(pythonPresentationFolder, true);
                        TempData["ScriptOutput"] += "\nPresentation directory completely removed.";
                    }

                    // Recreate the folder
                    Directory.CreateDirectory(pythonPresentationFolder);
                    TempData["ScriptOutput"] += "\nPresentation directory recreated fresh.";

                    // Restore original PowerPoint files (optional)
                    // We disabled this to remove everything and start from scratch
                    /*
                    foreach (string pptxFile in pptxFiles)
                    {
                        string filePath = Path.Combine(pythonPresentationFolder, pptxFile);
                        System.IO.File.WriteAllBytes(filePath, fileData);
                        TempData["ScriptOutput"] += $"\nRestored PowerPoint file: {pptxFile}";
                    }
                    */
                }
                catch (Exception ex)
                {
                    TempData["ErrorMessage"] += $"\nError recreating presentation directory: {ex.Message}";
                    
                    // Ensure the folder exists in any case
                    if (!Directory.Exists(pythonPresentationFolder))
                    {
                        Directory.CreateDirectory(pythonPresentationFolder);
                    }
                }
                
                // Copy PowerPoint file to Python folder
                string powerPointFilePath = Path.Combine(pythonPresentationFolder, file.FileName);
                using (var stream = new FileStream(powerPointFilePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Run script to convert PowerPoint to images
                string pythonScriptPath = @"C:\Smart Control Techniques\convert.py";
                
                // Check if the script exists and create it if not
                if (!System.IO.File.Exists(pythonScriptPath))
                {
                    CreatePythonConversionScript(pythonScriptPath);
                }
                
                // Run the conversion script convert.py directly
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = "python",
                    Arguments = $"\"{pythonScriptPath}\"",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    WorkingDirectory = @"C:\Smart Control Techniques"
                };

                Process process = new Process { StartInfo = psi };
                process.Start();
                string output = await process.StandardOutput.ReadToEndAsync();
                string error = await process.StandardError.ReadToEndAsync();
                process.WaitForExit();

                // Run main.py automatically if PowerPoint file conversion was successful
                if (process.ExitCode == 0 && !string.IsNullOrEmpty(output) && output.Contains("Conversion complete"))
                {
                    string mainPyPath = Path.Combine(@"C:\Smart Control Techniques", "main.py");
                    if (System.IO.File.Exists(mainPyPath))
                    {
                        // Log that main.py will be run
                        TempData["ScriptOutput"] += "\nStarting main.py presentation viewer...";
                        
                        ProcessStartInfo mainPsi = new ProcessStartInfo
                        {
                            FileName = "python",
                            Arguments = $"\"{mainPyPath}\"",
                            UseShellExecute = true,
                            CreateNoWindow = false,
                            WorkingDirectory = @"C:\Smart Control Techniques"
                        };

                        Process mainProcess = new Process { StartInfo = mainPsi };
                        mainProcess.Start();
                        
                        // We don't wait for the process to complete because main.py will open a graphical window
                        TempData["SuccessMessage"] += "\nPresentation viewer started successfully.";
                    }
                    else
                    {
                        TempData["ErrorMessage"] += "\nCannot find main.py script.";
                    }
                }

                TempData["SuccessMessage"] = "Presentation file uploaded and successfully converted to images";
                return RedirectToAction("AIEvaluationResults", "Home");
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"An error occurred: {ex.Message}";
                return RedirectToAction("Presentations", "Home");
            }
        }

        private void CreatePythonConversionScript(string scriptPath)
        {
            string scriptContent = @"import os
import sys
import glob
from comtypes import client
import time

def convert_pptx_to_images():
    # Find the first PowerPoint file in the folder
    presentation_dir = os.path.join(os.path.dirname(__file__), ""Presentation"")
    if not os.path.exists(presentation_dir):
        print(""Error: Presentation directory does not exist!"")
        return
    
    pptx_files = glob.glob(os.path.join(presentation_dir, ""*.pptx""))
    if not pptx_files:
        pptx_files = glob.glob(os.path.join(presentation_dir, ""*.ppt""))
        if not pptx_files:
            print(""Error: No PowerPoint files found in directory!"")
            return
    
    pptx_file = pptx_files[0]
    print(f""Converting: {pptx_file}"")
    
    # Convert presentation to images using PowerPoint COM
    try:
        powerpoint = client.CreateObject(""PowerPoint.Application"")
        powerpoint.Visible = True
        
        presentation = powerpoint.Presentations.Open(pptx_file)
        
        # Save each slide as an image
        for i in range(1, presentation.Slides.Count + 1):
            image_path = os.path.join(presentation_dir, f""slide_{i:03d}.jpg"")
            presentation.Slides(i).Export(image_path, ""JPG"")
            print(f""Saved slide {i} to {image_path}"")
        
        presentation.Close()
        powerpoint.Quit()
        
        print(""Conversion complete!"")
        return True
    except Exception as e:
        print(f""Error during conversion: {e}"")
        return False

if __name__ == ""__main__"":
    convert_pptx_to_images()
";
            System.IO.File.WriteAllText(scriptPath, scriptContent);
        }
    }
}
