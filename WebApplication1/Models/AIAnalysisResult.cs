using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public class AIAnalysisResult
    {
        public int OverallScore { get; set; }
        public string Grade { get; set; }
        public string PresentationTitle { get; set; }
        public DateTime AnalysisDate { get; set; } = DateTime.Now;
        
        // Main evaluation categories
        public ContentAnalysis ContentQuality { get; set; } = new ContentAnalysis();
        public DesignAnalysis Design { get; set; } = new DesignAnalysis();
        public PresenterAnalysis PresenterPerformance { get; set; } = new PresenterAnalysis();
        
        // General feedback and recommendations
        public Dictionary<string, int> CriteriaScores { get; set; } = new Dictionary<string, int>();
        public List<string> GeneralFeedback { get; set; } = new List<string>();
        public List<string> Improvements { get; set; } = new List<string>();
        
        // Slide statistics
        public int TotalSlides { get; set; }
        public int AverageWordsPerSlide { get; set; }
        public int TotalWords { get; set; }
        public int EstimatedPresentationMinutes { get; set; }
    }
    
    public class ContentAnalysis
    {
        public int Score { get; set; }
        public string Grade { get; set; }
        
        // Content structure evaluation
        public bool HasClearIntroduction { get; set; }
        public bool HasClearConclusion { get; set; }
        public int LogicalFlowScore { get; set; } // 1-10
        public int ClarityScore { get; set; } // 1-10
        
        // Content quality metrics
        public int InformationDensityScore { get; set; } // 1-10 (lower is better for presentations)
        public int RelevanceScore { get; set; } // 1-10
        public int EngagementScore { get; set; } // 1-10
        
        // Text analysis
        public bool HasExcessiveText { get; set; }
        public List<string> SlidesWithTooMuchText { get; set; } = new List<string>();
        public List<string> ContentFeedback { get; set; } = new List<string>();
        public List<string> ContentImprovements { get; set; } = new List<string>();
    }
    
    public class DesignAnalysis
    {
        public int Score { get; set; }
        public string Grade { get; set; }
        
        // Visual design evaluation
        public int ColorHarmonyScore { get; set; } // 1-10
        public int TypographyScore { get; set; } // 1-10
        public int LayoutConsistencyScore { get; set; } // 1-10
        public int VisualAppealScore { get; set; } // 1-10
        
        // Design elements
        public bool HasEffectiveImages { get; set; }
        public bool HasCleanLayout { get; set; }
        public bool HasConsistentTheme { get; set; }
        public bool HasLegibleText { get; set; }
        
        // Detailed feedback
        public List<string> ColorFeedback { get; set; } = new List<string>();
        public List<string> LayoutFeedback { get; set; } = new List<string>();
        public List<string> DesignImprovements { get; set; } = new List<string>();
    }
    
    public class PresenterAnalysis
    {
        public int Score { get; set; }
        public string Grade { get; set; }
        
        // Presentation delivery
        public int PaceScore { get; set; } // 1-10
        public int ClarityScore { get; set; } // 1-10
        public int EngagementScore { get; set; } // 1-10
        public int VoiceModulationScore { get; set; } // 1-10
        
        // Speaking metrics
        public int EstimatedWordsPerMinute { get; set; }
        public bool IsSpeakingTooFast { get; set; }
        public bool IsSpeakingTooSlow { get; set; }
        
        // Presenter notes analysis
        public bool HasAdequatePresenterNotes { get; set; }
        public bool PresenterNotesAlignWithSlides { get; set; }
        
        // Detailed feedback
        public List<string> DeliveryFeedback { get; set; } = new List<string>();
        public List<string> PresenterImprovements { get; set; } = new List<string>();
    }
}
