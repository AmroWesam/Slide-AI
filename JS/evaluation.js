/**
 * Slide AI - AI Evaluation Results
 * JavaScript for the AI Evaluation Results page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs functionality
    initializeTabs();
    
    // Initialize copy functionality for feedback link
    initializeCopyLink();
    
    // Setup download report button
    setupDownloadReport();
    
    // Render charts (using canvas drawing since we're not using external libraries)
    renderCharts();
    
    // Initialize the automatic evaluation system
    initializeEvaluationSystem();
});

/**
 * Initialize the tabs functionality
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to current button
            this.classList.add('active');
            
            // Show the corresponding panel
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Initialize copy to clipboard functionality for feedback link
 */
function initializeCopyLink() {
    const copyButton = document.querySelector('.copy-link');
    const feedbackLink = document.querySelector('.feedback-link input');
    
    if (copyButton && feedbackLink) {
        copyButton.addEventListener('click', function() {
            // Select the text field
            feedbackLink.select();
            feedbackLink.setSelectionRange(0, 99999); // For mobile devices
            
            // Copy the text inside the text field
            document.execCommand('copy');
            
            // Alert the copied text
            const originalIcon = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                this.innerHTML = originalIcon;
            }, 2000);
        });
    }
}

/**
 * Setup download report functionality
 */
function setupDownloadReport() {
    const downloadButton = document.getElementById('download-report');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Report download functionality will be implemented soon.');
        });
    }
}

/**
 * Render charts using canvas
 */
function renderCharts() {
    // Render gesture usage chart
    renderGestureChart();
    
    // Render voice command usage chart
    renderVoiceChart();
    
    // Render engagement over time chart
    renderEngagementChart();
}

/**
 * Render the gesture usage chart
 */
function renderGestureChart() {
    const canvas = document.getElementById('gestureChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    
    // Data for the chart
    const data = [
        { label: 'Swipe Left', value: 42, color: '#4e43e0' },
        { label: 'Swipe Right', value: 28, color: '#7b68ee' },
        { label: 'Pinch', value: 15, color: '#ff6b6b' },
        { label: 'Point', value: 15, color: '#FFC107' }
    ];
    
    // Draw pie chart
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    let total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;
    
    // Draw slices
    data.forEach(item => {
        const sliceAngle = 2 * Math.PI * item.value / total;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // Draw labels
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + labelRadius * Math.cos(midAngle);
        const labelY = centerY + labelRadius * Math.sin(midAngle);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, labelX, labelY);
        
        startAngle += sliceAngle;
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    // Draw title in center
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Gesture Usage', centerX, centerY);
}

/**
 * Render the voice command usage chart
 */
function renderVoiceChart() {
    const canvas = document.getElementById('voiceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    
    // Data for the chart
    const data = [
        { label: 'Next Slide', value: 18, color: '#4e43e0' },
        { label: 'Previous', value: 12, color: '#7b68ee' },
        { label: 'Zoom', value: 6, color: '#ff6b6b' },
        { label: 'Other', value: 8, color: '#FFC107' }
    ];
    
    // Draw bar chart
    const barWidth = (canvas.width - 60) / data.length;
    const maxValue = Math.max(...data.map(item => item.value));
    const scaleFactor = (canvas.height - 60) / maxValue;
    
    // Draw bars
    data.forEach((item, index) => {
        const barHeight = item.value * scaleFactor;
        const x = 30 + index * barWidth;
        const y = canvas.height - 30 - barHeight;
        
        // Draw bar
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y, barWidth - 10, barHeight);
        
        // Draw label
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + (barWidth - 10) / 2, canvas.height - 15);
        
        // Draw value
        ctx.fillStyle = '#333';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(item.value, x + (barWidth - 10) / 2, y - 5);
    });
    
    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(20, canvas.height - 20);
    ctx.lineTo(canvas.width - 20, canvas.height - 20);
    ctx.stroke();
}

/**
 * Render the engagement over time chart
 */
function renderEngagementChart() {
    const canvas = document.getElementById('engagementChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    
    // Data for the chart (engagement percentage over time)
    const data = [
        { time: '0:00', value: 70 },
        { time: '2:00', value: 82 },
        { time: '4:00', value: 75 },
        { time: '6:00', value: 90 },
        { time: '8:00', value: 95 },
        { time: '10:00', value: 85 },
        { time: '12:00', value: 92 },
        { time: '14:00', value: 78 },
        { time: '15:24', value: 88 }
    ];
    
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Scale factors
    const xScale = chartWidth / (data.length - 1);
    const yScale = chartHeight / 100;
    
    // Draw grid lines
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
        const y = padding + chartHeight - i * 10 * yScale;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#999';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${i * 10}%`, padding - 5, y + 3);
    }
    
    // Draw x-axis labels
    data.forEach((point, index) => {
        const x = padding + index * xScale;
        
        ctx.fillStyle = '#999';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(point.time, x, canvas.height - padding + 15);
    });
    
    // Draw line chart
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight - data[0].value * yScale);
    
    for (let i = 1; i < data.length; i++) {
        const x = padding + i * xScale;
        const y = padding + chartHeight - data[i].value * yScale;
        ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = '#4e43e0';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw points
    data.forEach((point, index) => {
        const x = padding + index * xScale;
        const y = padding + chartHeight - point.value * yScale;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#4e43e0';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Add area under the line
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight - data[0].value * yScale);
    
    for (let i = 1; i < data.length; i++) {
        const x = padding + i * xScale;
        const y = padding + chartHeight - data[i].value * yScale;
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.closePath();
    
    ctx.fillStyle = 'rgba(78, 67, 224, 0.1)';
    ctx.fill();
}

// Add window resize handler to redraw charts when window size changes
window.addEventListener('resize', function() {
    // Delay execution to avoid too many calls during resize
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(function() {
        renderCharts();
    }, 200);
});

/**
 * Initialize the automatic evaluation system
 */
function initializeEvaluationSystem() {
    // Calculate scores for each criterion and update the UI
    calculateScores();
    
    // Animate the score displays
    animateScores();
    
    // Update quality ratings based on scores
    updateQualityRatings();
    
    // Update the summary text based on the scores
    updateSummaryText();
    
    // Set up the score circle animation
    setupScoreCircle();
}

/**
 * Calculate scores for each evaluation criterion
 * The total score is out of 100 points, distributed across six criteria
 */
function calculateScores() {
    // Evaluation data with random variations to simulate real evaluation
    const evaluationData = {
        // Content Quality (20 points): 0-20
        content: {
            score: 17,  // Out of 20
            accuracy: 9,    // Out of 10
            organization: 8,  // Out of 10
            relevance: 9      // Out of 10
        },
        
        // Formatting (15 points): 0-15
        formatting: {
            score: 12,  // Out of 15
            consistency: 8,   // Out of 10
            color: 7,         // Out of 10
            typography: 8     // Out of 10
        },
        
        // Smart Control (15 points): 0-15
        control: {
            score: 13,  // Out of 15
            gesture: 8,       // Out of 10
            voice: 9,         // Out of 10
            fluidity: 7       // Out of 10
        },
        
        // Visual Clarity (15 points): 0-15
        visual: {
            score: 12,  // Out of 15
            image: 9,         // Out of 10
            text: 8,          // Out of 10
            density: 7        // Out of 10
        },
        
        // Slide Navigation (15 points): 0-15
        navigation: {
            score: 13,  // Out of 15
            flow: 8,          // Out of 10
            transition: 7,    // Out of 10
            timing: 9         // Out of 10
        },
        
        // Language Usage (20 points): 0-20
        language: {
            score: 18,  // Out of 20
            clarity: 8,       // Out of 10
            grammar: 9,       // Out of 10
            communication: 8  // Out of 10
        }
    };
    
    // Store data in a global variable for access by other functions
    window.evaluationData = evaluationData;
    
    // Calculate total score
    const totalScore = 
        evaluationData.content.score + 
        evaluationData.formatting.score + 
        evaluationData.control.score + 
        evaluationData.visual.score + 
        evaluationData.navigation.score + 
        evaluationData.language.score;
    
    // Store the total score
    window.totalScore = totalScore;
    
    // Update the overall score display (static number, animation comes later)
    document.getElementById('overall-score').textContent = totalScore;
    document.getElementById('final-score').textContent = totalScore;
    
    // Determine and set the grade
    const grade = getGrade(totalScore);
    const gradeElement = document.getElementById('score-grade');
    gradeElement.textContent = grade.letter;
    gradeElement.className = `grade grade-${grade.letter.toLowerCase()}`;
    
    // Update individual criterion scores
    updateCriterionScore('content', evaluationData.content.score, 20);
    updateCriterionScore('formatting', evaluationData.formatting.score, 15);
    updateCriterionScore('control', evaluationData.control.score, 15);
    updateCriterionScore('visual', evaluationData.visual.score, 15);
    updateCriterionScore('navigation', evaluationData.navigation.score, 15);
    updateCriterionScore('language', evaluationData.language.score, 20);
}

/**
 * Update the score display for a specific criterion
 */
function updateCriterionScore(criterionId, score, maxScore) {
    const scoreElement = document.getElementById(`${criterionId}-score`);
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

/**
 * Animate the scores to create a dynamic effect
 */
function animateScores() {
    // Animate the criterion progress bars
    animateCriterionProgress('content', window.evaluationData.content.score, 20);
    animateCriterionProgress('formatting', window.evaluationData.formatting.score, 15);
    animateCriterionProgress('control', window.evaluationData.control.score, 15);
    animateCriterionProgress('visual', window.evaluationData.visual.score, 15);
    animateCriterionProgress('navigation', window.evaluationData.navigation.score, 15);
    animateCriterionProgress('language', window.evaluationData.language.score, 20);
}

/**
 * Animate the progress bar for a specific criterion
 */
function animateCriterionProgress(criterionId, score, maxScore) {
    const progressElement = document.getElementById(`${criterionId}-progress`);
    if (progressElement) {
        // Calculate percentage width
        const percentage = (score / maxScore) * 100;
        
        // Use setTimeout to create a slight delay for visual effect
        setTimeout(() => {
            progressElement.style.width = `${percentage}%`;
        }, 500);
    }
}

/**
 * Set up the circular progress indicator for the overall score
 */
function setupScoreCircle() {
    const scoreCircle = document.getElementById('score-circle');
    if (scoreCircle) {
        const circumference = 2 * Math.PI * 45; // 2πr where r=45 (from the SVG)
        scoreCircle.style.strokeDasharray = circumference;
        
        // Calculate the dashoffset based on the score percentage
        const scorePercentage = window.totalScore / 100;
        const dashOffset = circumference - (circumference * scorePercentage);
        
        // Animate the circle filling
        setTimeout(() => {
            scoreCircle.style.strokeDashoffset = dashOffset;
        }, 500);
    }
}

/**
 * Determine the letter grade based on the score
 */
function getGrade(score) {
    if (score >= 90) {
        return { letter: 'A', description: 'Excellent' };
    } else if (score >= 80) {
        return { letter: 'B', description: 'Very Good' };
    } else if (score >= 70) {
        return { letter: 'C', description: 'Good' };
    } else if (score >= 60) {
        return { letter: 'D', description: 'Fair' };
    } else {
        return { letter: 'F', description: 'Poor' };
    }
}

/**
 * Convert numeric score to quality rating
 */
function getQualityRating(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) {
        return { text: 'Excellent', class: 'excellent' };
    } else if (percentage >= 80) {
        return { text: 'Very Good', class: 'very-good' };
    } else if (percentage >= 70) {
        return { text: 'Good', class: 'good' };
    } else if (percentage >= 60) {
        return { text: 'Fair', class: 'fair' };
    } else {
        return { text: 'Poor', class: 'poor' };
    }
}

/**
 * Update quality ratings for each sub-criterion
 */
function updateQualityRatings() {
    const data = window.evaluationData;
    
    // Content quality metrics
    updateMetricRating('content-accuracy', data.content.accuracy, 10);
    updateMetricRating('content-organization', data.content.organization, 10);
    updateMetricRating('content-relevance', data.content.relevance, 10);
    
    // Formatting metrics
    updateMetricRating('format-consistency', data.formatting.consistency, 10);
    updateMetricRating('format-color', data.formatting.color, 10);
    updateMetricRating('format-typography', data.formatting.typography, 10);
    
    // Control metrics
    updateMetricRating('control-gesture', data.control.gesture, 10);
    updateMetricRating('control-voice', data.control.voice, 10);
    updateMetricRating('control-fluidity', data.control.fluidity, 10);
    
    // Visual metrics
    updateMetricRating('visual-image', data.visual.image, 10);
    updateMetricRating('visual-text', data.visual.text, 10);
    updateMetricRating('visual-density', data.visual.density, 10);
    
    // Navigation metrics
    updateMetricRating('nav-flow', data.navigation.flow, 10);
    updateMetricRating('nav-transition', data.navigation.transition, 10);
    updateMetricRating('nav-timing', data.navigation.timing, 10);
    
    // Language metrics
    updateMetricRating('lang-clarity', data.language.clarity, 10);
    updateMetricRating('lang-grammar', data.language.grammar, 10);
    updateMetricRating('lang-communication', data.language.communication, 10);
}

/**
 * Update a specific metric with its quality rating
 */
function updateMetricRating(id, score, maxScore) {
    const element = document.getElementById(id);
    if (element) {
        const rating = getQualityRating(score, maxScore);
        element.textContent = rating.text;
        element.className = `metric-value ${rating.class}`;
    }
}

/**
 * Update the summary text based on the evaluation scores
 */
function updateSummaryText() {
    const data = window.evaluationData;
    const totalScore = window.totalScore;
    const grade = getGrade(totalScore);
    
    // Identify strongest and weakest areas
    const scores = [
        { name: 'content', score: data.content.score / 20, label: 'Content Quality' },
        { name: 'formatting', score: data.formatting.score / 15, label: 'Formatting' },
        { name: 'control', score: data.control.score / 15, label: 'Smart Control' },
        { name: 'visual', score: data.visual.score / 15, label: 'Visual Clarity' },
        { name: 'navigation', score: data.navigation.score / 15, label: 'Slide Navigation' },
        { name: 'language', score: data.language.score / 20, label: 'Language Usage' }
    ];
    
    // Sort to find strongest and weakest
    scores.sort((a, b) => b.score - a.score);
    const strongest = scores[0];
    const secondStrongest = scores[1];
    const weakest = scores[scores.length - 1];
    
    // Generate a personalized summary
    let summary = `Your presentation received an overall grade of ${grade.letter} (${totalScore}/100), which is ${grade.description.toLowerCase()}. `;
    summary += `Your strongest areas are ${strongest.label} and ${secondStrongest.label}, `;
    summary += `while ${weakest.label} could use some improvement. `;
    
    // Add specific recommendations based on scores
    if (data.content.score < 15) {
        summary += 'Consider enhancing your content with more relevant information and better organization. ';
    }
    
    if (data.formatting.score < 12) {
        summary += 'Improve your slide formatting with more consistent design and better color harmony. ';
    }
    
    if (data.control.score < 12) {
        summary += 'Practice using gesture and voice controls more effectively for smoother presentations. ';
    }
    
    if (data.visual.score < 12) {
        summary += 'Enhance visual clarity by improving image quality and text readability. ';
    }
    
    if (data.navigation.score < 12) {
        summary += 'Work on slide transitions and logical flow between different sections. ';
    }
    
    if (data.language.score < 15) {
        summary += 'Focus on improving language clarity and communication effectiveness. ';
    }
    
    // Add a positive closing note
    summary += 'With targeted improvements in these areas, your next presentation will be even more effective.';
    
    // Update the summary text
    document.getElementById('evaluation-summary-text').textContent = summary;
}
