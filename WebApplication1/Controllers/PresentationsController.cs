using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using System.Threading.Tasks;
using WebApplication1.Services;
using System.Diagnostics; // لاستخدام Process و ProcessStartInfo

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
                TempData["ErrorMessage"] = "لم يتم اختيار ملف";
                return RedirectToAction("Presentations", "Home");
            }

            try
            {
                // التأكد من وجود المجلد
                string pythonPresentationFolder = @"C:\Smart Control Techniques\Presentation";
                if (!Directory.Exists(pythonPresentationFolder))
                {
                    Directory.CreateDirectory(pythonPresentationFolder);
                }

                // نهج جذري: حذف وإعادة إنشاء مجلد العرض بالكامل
                TempData["ScriptOutput"] += "\nCompletely recreating the presentation directory...";
                try
                {
                    // حفظ قائمة بجميع ملفات PowerPoint (غير الصور)
                    List<string> pptxFiles = new List<string>();
                    if (Directory.Exists(pythonPresentationFolder))
                    {
                        string[] pptxExtensions = { "*.pptx", "*.ppt" };
                        foreach (string ext in pptxExtensions)
                        {
                            string[] files = Directory.GetFiles(pythonPresentationFolder, ext);
                            foreach (string pptFile in files)
                            {
                                // حفظ بيانات الملف للاستعادة لاحقًا
                                string fileName = Path.GetFileName(pptFile);
                                byte[] fileData = System.IO.File.ReadAllBytes(pptFile);
                                pptxFiles.Add(fileName);
                                TempData["ScriptOutput"] += $"\nSaved PowerPoint file for restoration: {fileName}";
                            }
                        }
                    }

                    // حذف المجلد بالكامل إذا كان موجودًا
                    if (Directory.Exists(pythonPresentationFolder))
                    {
                        Directory.Delete(pythonPresentationFolder, true);
                        TempData["ScriptOutput"] += "\nPresentation directory completely removed.";
                    }

                    // إعادة إنشاء المجلد
                    Directory.CreateDirectory(pythonPresentationFolder);
                    TempData["ScriptOutput"] += "\nPresentation directory recreated fresh.";

                    // إعادة ملفات PowerPoint الأصلية (اختياري)
                    // قمنا بإلغاء تفعيل هذا حتى نزيل كل شيء وتبدأ من الصفر
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
                    
                    // ضمان وجود المجلد على أي حال
                    if (!Directory.Exists(pythonPresentationFolder))
                    {
                        Directory.CreateDirectory(pythonPresentationFolder);
                    }
                }
                
                // نسخ ملف PowerPoint إلى مجلد Python
                string powerPointFilePath = Path.Combine(pythonPresentationFolder, file.FileName);
                using (var stream = new FileStream(powerPointFilePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // تشغيل سكربت تحويل البوربوينت إلى صور
                string pythonScriptPath = @"C:\Smart Control Techniques\convert.py";
                
                // التحقق من وجود السكربت وإنشائه إذا لم يكن موجودًا
                if (!System.IO.File.Exists(pythonScriptPath))
                {
                    CreatePythonConversionScript(pythonScriptPath);
                }
                
                // تشغيل سكربت التحويل convert.py مباشرة
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

                // تشغيل main.py تلقائياً إذا نجح تحويل ملف PowerPoint
                if (process.ExitCode == 0 && !string.IsNullOrEmpty(output) && output.Contains("Conversion complete"))
                {
                    string mainPyPath = Path.Combine(@"C:\Smart Control Techniques", "main.py");
                    if (System.IO.File.Exists(mainPyPath))
                    {
                        // سجل أنه سيتم تشغيل main.py
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
                        
                        // لا ننتظر انتهاء العملية لأن main.py سيفتح نافذة رسومية
                        TempData["SuccessMessage"] += "\nPresentation viewer started successfully.";
                    }
                    else
                    {
                        TempData["ErrorMessage"] += "\nCannot find main.py script.";
                    }
                }

                TempData["SuccessMessage"] = "تم رفع ملف العرض التقديمي وتحويله إلى صور بنجاح";
                return RedirectToAction("Presentations", "Home");
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"حدث خطأ: {ex.Message}";
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
    # العثور على أول ملف PowerPoint في المجلد
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
    
    # تحويل العرض التقديمي إلى صور باستخدام PowerPoint COM
    try:
        powerpoint = client.CreateObject(""PowerPoint.Application"")
        powerpoint.Visible = True
        
        presentation = powerpoint.Presentations.Open(pptx_file)
        
        # حفظ كل شريحة كصورة
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
