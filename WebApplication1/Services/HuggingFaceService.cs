using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using WebApplication1.Models;
using System.Collections.Generic;

namespace WebApplication1.Services
{
    public class HuggingFaceService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public HuggingFaceService(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
            _apiKey = _configuration["HuggingFace:ApiKey"];
            
            // Set the API base address
            _httpClient.BaseAddress = new Uri("https://api-inference.huggingface.co/models/");
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<AIAnalysisResult> AnalyzePresentationAsync(string presentationText)
        {
            try
            {
                // Use a versatile text model
                var model = "gpt2";
                
                // Prepare prompt text with specific instructions for comprehensive analysis
                var prompt = $@"Analyze the following PowerPoint presentation content and provide a comprehensive evaluation including content quality, formatting, color choices, word count, and presenter performance.
                
Presentation Content:
{presentationText}

Provide a detailed analysis with the following structure:

1. Overall Evaluation:
   - Overall score (0-100)
   - Letter grade (A, B, C, D, F)
   - Total slide count estimation
   - Average words per slide
   - Total word count
   - Estimated presentation length in minutes

2. Content Quality Analysis:
   - Content score (0-100)
   - Content grade (A-F)
   - Structure evaluation (introduction, conclusion, logical flow)
   - Information density score (1-10, lower is better for presentations)
   - Content clarity score (1-10)
   - Identify slides with excessive text
   - Specific content improvement suggestions

3. Design Analysis:
   - Design score (0-100)
   - Design grade (A-F)
   - Color harmony score (1-10)
   - Typography score (1-10)
   - Layout consistency score (1-10)
   - Visual appeal score (1-10)
   - Assessment of images effectiveness
   - Layout quality assessment
   - Specific design improvement suggestions

4. Presenter Performance Analysis:
   - Performance score (0-100)
   - Performance grade (A-F)
   - Speaking pace assessment
   - Clarity of delivery score (1-10)
   - Audience engagement score (1-10)
   - Voice modulation score (1-10)
   - Estimated words per minute
   - Assessment of presenter notes if available
   - Specific presenter improvement suggestions

Format the response as a detailed JSON object.
";

                // Prepare data
                var payload = new
                {
                    inputs = prompt,
                    parameters = new
                    {
                        max_length = 2000,  // Increase text length to accommodate detailed analysis
                        temperature = 0.7,
                        return_full_text = false
                    }
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

                // Send request
                var response = await _httpClient.PostAsync(model, content);
                response.EnsureSuccessStatusCode();

                var responseBody = await response.Content.ReadAsStringAsync();
                
                // Process received data - in case of JSON parsing failure, use default values
                try
                {
                    var aiResponse = JsonDocument.Parse(responseBody).RootElement;
                    var jsonOutput = aiResponse[0].GetProperty("generated_text").GetString();
                    
                    // Try to extract JSON from text
                    int startIdx = jsonOutput.IndexOf('{');
                    int endIdx = jsonOutput.LastIndexOf('}');
                    
                    if (startIdx >= 0 && endIdx > startIdx)
                    {
                        var jsonPart = jsonOutput.Substring(startIdx, endIdx - startIdx + 1);
                        var resultData = JsonSerializer.Deserialize<JsonElement>(jsonPart);
                        
                        // Create AIAnalysisResult object and fill it with received data
                        var result = new AIAnalysisResult
                        {
                            OverallScore = GetPropertyValue(resultData, "overallScore", 75),
                            Grade = GetPropertyValue(resultData, "grade", "C"),
                            PresentationTitle = ExtractTitle(presentationText),
                            TotalSlides = GetPropertyValue(resultData, "totalSlides", EstimateTotalSlides(presentationText)),
                            AverageWordsPerSlide = GetPropertyValue(resultData, "averageWordsPerSlide", EstimateWordsPerSlide(presentationText)),
                            TotalWords = GetPropertyValue(resultData, "totalWords", CountTotalWords(presentationText)),
                            EstimatedPresentationMinutes = GetPropertyValue(resultData, "estimatedMinutes", EstimatePresentationLength(presentationText)),
                            GeneralFeedback = GetStringArray(resultData, "generalFeedback"),
                            Improvements = GetStringArray(resultData, "improvements"),
                            CriteriaScores = ExtractCriteriaScores(resultData)
                        };
                        
                        // Fill content analysis
                        if (resultData.TryGetProperty("contentAnalysis", out var contentData))
                        {
                            result.ContentQuality = new ContentAnalysis
                            {
                                Score = GetPropertyValue(contentData, "score", 75),
                                Grade = GetPropertyValue(contentData, "grade", "C"),
                                HasClearIntroduction = GetPropertyValue(contentData, "hasClearIntroduction", true),
                                HasClearConclusion = GetPropertyValue(contentData, "hasClearConclusion", true),
                                LogicalFlowScore = GetPropertyValue(contentData, "logicalFlowScore", 7),
                                ClarityScore = GetPropertyValue(contentData, "clarityScore", 7),
                                InformationDensityScore = GetPropertyValue(contentData, "informationDensityScore", 6),
                                RelevanceScore = GetPropertyValue(contentData, "relevanceScore", 8),
                                EngagementScore = GetPropertyValue(contentData, "engagementScore", 7),
                                HasExcessiveText = GetPropertyValue(contentData, "hasExcessiveText", false),
                                SlidesWithTooMuchText = GetStringArray(contentData, "slidesWithTooMuchText"),
                                ContentFeedback = GetStringArray(contentData, "contentFeedback"),
                                ContentImprovements = GetStringArray(contentData, "contentImprovements")
                            };
                        }
                        else
                        {
                            result.ContentQuality = CreateDefaultContentAnalysis();
                        }
                        
                        // Fill design analysis
                        if (resultData.TryGetProperty("designAnalysis", out var designData))
                        {
                            result.Design = new DesignAnalysis
                            {
                                Score = GetPropertyValue(designData, "score", 70),
                                Grade = GetPropertyValue(designData, "grade", "C"),
                                ColorHarmonyScore = GetPropertyValue(designData, "colorHarmonyScore", 7),
                                TypographyScore = GetPropertyValue(designData, "typographyScore", 7),
                                LayoutConsistencyScore = GetPropertyValue(designData, "layoutConsistencyScore", 6),
                                VisualAppealScore = GetPropertyValue(designData, "visualAppealScore", 7),
                                HasEffectiveImages = GetPropertyValue(designData, "hasEffectiveImages", true),
                                HasCleanLayout = GetPropertyValue(designData, "hasCleanLayout", true),
                                HasConsistentTheme = GetPropertyValue(designData, "hasConsistentTheme", true),
                                HasLegibleText = GetPropertyValue(designData, "hasLegibleText", true),
                                ColorFeedback = GetStringArray(designData, "colorFeedback"),
                                LayoutFeedback = GetStringArray(designData, "layoutFeedback"),
                                DesignImprovements = GetStringArray(designData, "designImprovements")
                            };
                        }
                        else
                        {
                            result.Design = CreateDefaultDesignAnalysis();
                        }
                        
                        // Fill presenter performance analysis
                        if (resultData.TryGetProperty("presenterAnalysis", out var presenterData))
                        {
                            result.PresenterPerformance = new PresenterAnalysis
                            {
                                Score = GetPropertyValue(presenterData, "score", 70),
                                Grade = GetPropertyValue(presenterData, "grade", "C"),
                                PaceScore = GetPropertyValue(presenterData, "paceScore", 7),
                                ClarityScore = GetPropertyValue(presenterData, "clarityScore", 7),
                                EngagementScore = GetPropertyValue(presenterData, "engagementScore", 7),
                                VoiceModulationScore = GetPropertyValue(presenterData, "voiceModulationScore", 6),
                                EstimatedWordsPerMinute = GetPropertyValue(presenterData, "estimatedWordsPerMinute", 130),
                                IsSpeakingTooFast = GetPropertyValue(presenterData, "isSpeakingTooFast", false),
                                IsSpeakingTooSlow = GetPropertyValue(presenterData, "isSpeakingTooSlow", false),
                                HasAdequatePresenterNotes = GetPropertyValue(presenterData, "hasAdequatePresenterNotes", true),
                                PresenterNotesAlignWithSlides = GetPropertyValue(presenterData, "presenterNotesAlignWithSlides", true),
                                DeliveryFeedback = GetStringArray(presenterData, "deliveryFeedback"),
                                PresenterImprovements = GetStringArray(presenterData, "presenterImprovements")
                            };
                        }
                        else
                        {
                            result.PresenterPerformance = CreateDefaultPresenterAnalysis();
                        }
                        
                        return result;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error parsing AI response: {ex.Message}");
                }
                
                // In case of data analysis failure, use default values
                return CreateDefaultAnalysis(presentationText);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error analyzing presentation: {ex.Message}");
                return CreateDefaultAnalysis(presentationText);
            }
        }
        
        // Helper functions
        private int GetPropertyValue(JsonElement element, string propertyName, int defaultValue)
        {
            if (element.TryGetProperty(propertyName, out var property) && property.ValueKind == JsonValueKind.Number)
            {
                return property.GetInt32();
            }
            return defaultValue;
        }
        
        private string GetPropertyValue(JsonElement element, string propertyName, string defaultValue)
        {
            if (element.TryGetProperty(propertyName, out var property) && property.ValueKind == JsonValueKind.String)
            {
                return property.GetString();
            }
            return defaultValue;
        }
        
        private List<string> GetStringArray(JsonElement element, string propertyName)
        {
            var result = new List<string>();
            if (element.TryGetProperty(propertyName, out var property) && property.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in property.EnumerateArray())
                {
                    if (item.ValueKind == JsonValueKind.String)
                    {
                        result.Add(item.GetString());
                    }
                }
            }
            
            // If the list is empty, add default values
            if (result.Count == 0)
            {
                if (propertyName == "feedback")
                {
                    result.Add("The presentation is well organized");
                    result.Add("The content is useful and appropriate for the target audience");
                }
                else if (propertyName == "improvements")
                {
                    result.Add("Visual elements could be improved to better attract attention");
                    result.Add("Add more examples to illustrate key points");
                }
            }
            
            return result;
        }
        
        private string ExtractTitle(string text)
        {
            // Try to extract a title from the text
            var lines = text.Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);
            if (lines.Length > 0)
            {
                return lines[0].Trim();
            }
            return "Presentation";
        }
        
        private bool GetPropertyValue(JsonElement element, string propertyName, bool defaultValue)
        {
            if (element.TryGetProperty(propertyName, out var property) && property.ValueKind == JsonValueKind.True || property.ValueKind == JsonValueKind.False)
            {
                return property.GetBoolean();
            }
            return defaultValue;
        }
        
        private Dictionary<string, int> ExtractCriteriaScores(JsonElement element)
        {
            var result = new Dictionary<string, int>
            {
                { "Content", 75 },
                { "Design", 75 },
                { "Presenter Performance", 75 },
                { "Overall Structure", 75 },
                { "Color Usage", 70 },
                { "Text Density", 70 }
            };
            
            if (element.TryGetProperty("criteriaScores", out var scores) && scores.ValueKind == JsonValueKind.Object)
            {
                foreach (var property in scores.EnumerateObject())
                {
                    var name = property.Name switch
                    {
                        "content" => "Content",
                        "design" => "Design",
                        "presenter" => "Presenter Performance",
                        "structure" => "Overall Structure",
                        "colors" => "Color Usage",
                        "textDensity" => "Text Density",
                        _ => property.Name
                    };
                    
                    if (property.Value.ValueKind == JsonValueKind.Number)
                    {
                        result[name] = property.Value.GetInt32();
                    }
                }
            }
            
            return result;
        }
        
        private int EstimateTotalSlides(string presentationText)
        {
            // Estimate number of slides based on text sections
            var slideCount = presentationText.Split(new[] { "Slide", "---", "===" }, StringSplitOptions.RemoveEmptyEntries).Length;
            return Math.Max(slideCount, 1);
        }
        
        private int CountTotalWords(string presentationText)
        {
            // Count total words in the text
            return presentationText.Split(new[] { ' ', '\n', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries).Length;
        }
        
        private int EstimateWordsPerSlide(string presentationText)
        {
            int totalWords = CountTotalWords(presentationText);
            int totalSlides = EstimateTotalSlides(presentationText);
            return totalSlides > 0 ? totalWords / totalSlides : totalWords;
        }
        
        private int EstimatePresentationLength(string presentationText)
        {
            // Estimate duration in minutes (assuming 130 words per minute)
            int totalWords = CountTotalWords(presentationText);
            return (int)Math.Ceiling(totalWords / 130.0);
        }
        
        private ContentAnalysis CreateDefaultContentAnalysis()
        {
            return new ContentAnalysis
            {
                Score = 75,
                Grade = "C",
                HasClearIntroduction = true,
                HasClearConclusion = true,
                LogicalFlowScore = 7,
                ClarityScore = 7,
                InformationDensityScore = 6,
                RelevanceScore = 8,
                EngagementScore = 7,
                HasExcessiveText = false,
                ContentFeedback = new List<string>
                {
                    "Content is well organized",
                    "Key points are clear and understandable"
                },
                ContentImprovements = new List<string>
                {
                    "Reduce the amount of text on each slide",
                    "Use more bullet points instead of paragraphs"
                }
            };
        }
        
        private DesignAnalysis CreateDefaultDesignAnalysis()
        {
            return new DesignAnalysis
            {
                Score = 70,
                Grade = "C",
                ColorHarmonyScore = 7,
                TypographyScore = 7,
                LayoutConsistencyScore = 6,
                VisualAppealScore = 7,
                HasEffectiveImages = true,
                HasCleanLayout = true,
                HasConsistentTheme = true,
                HasLegibleText = true,
                ColorFeedback = new List<string>
                {
                    "Color harmony is acceptable",
                    "Using contrasting colors helps with text readability"
                },
                LayoutFeedback = new List<string>
                {
                    "Slide formatting is consistent",
                    "Element distribution on the slide is logical"
                },
                DesignImprovements = new List<string>
                {
                    "Use a more vibrant color scheme for headings",
                    "Increase contrast between text color and background",
                    "Use high-quality images instead of standard graphics"
                }
            };
        }
        
        private PresenterAnalysis CreateDefaultPresenterAnalysis()
        {
            return new PresenterAnalysis
            {
                Score = 70,
                Grade = "C",
                PaceScore = 7,
                ClarityScore = 7,
                EngagementScore = 7,
                VoiceModulationScore = 6,
                EstimatedWordsPerMinute = 130,
                IsSpeakingTooFast = false,
                IsSpeakingTooSlow = false,
                HasAdequatePresenterNotes = true,
                PresenterNotesAlignWithSlides = true,
                DeliveryFeedback = new List<string>
                {
                    "Delivery pace is appropriate",
                    "Voice tone is clear and understandable"
                },
                PresenterImprovements = new List<string>
                {
                    "Vary voice tone to increase interest",
                    "Use pauses to emphasize important points",
                    "Add more interaction with the audience"
                }
            };
        }
        
        private AIAnalysisResult CreateDefaultAnalysis(string presentationText)
        {
            return new AIAnalysisResult
            {
                OverallScore = 75,
                Grade = "C",
                PresentationTitle = ExtractTitle(presentationText),
                TotalSlides = EstimateTotalSlides(presentationText),
                AverageWordsPerSlide = EstimateWordsPerSlide(presentationText),
                TotalWords = CountTotalWords(presentationText),
                EstimatedPresentationMinutes = EstimatePresentationLength(presentationText),
                CriteriaScores = new Dictionary<string, int>
                {
                    { "Content", 75 },
                    { "Design", 70 },
                    { "Presenter Performance", 70 },
                    { "Overall Structure", 75 },
                    { "Color Usage", 70 },
                    { "Text Density", 65 }
                },
                GeneralFeedback = new List<string>
                {
                    "The presentation is well organized",
                    "The content is useful and appropriate for the target audience"
                },
                Improvements = new List<string>
                {
                    "Visual elements could be improved to better attract attention",
                    "Reduce the amount of text on slides",
                    "Use more effective images and visual elements"
                },
                ContentQuality = CreateDefaultContentAnalysis(),
                Design = CreateDefaultDesignAnalysis(),
                PresenterPerformance = CreateDefaultPresenterAnalysis()
            };
        }
    }
}
