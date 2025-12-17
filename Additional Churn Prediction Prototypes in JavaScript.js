<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>4. k-Nearest Neighbors (k-NN) Churn Prediction</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 40px; background-color: #e6f7ff; }
        .container { max-width: 650px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        h1 { color: #0077b6; text-align: center; border-bottom: 3px solid #0077b6; padding-bottom: 10px; }
        label { display: block; margin-top: 15px; font-weight: bold; color: #333; }
        input[type="number"] { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; }
        button { background-color: #0077b6; color: white; padding: 15px 20px; border: none; border-radius: 6px; cursor: pointer; width: 100%; margin-top: 30px; font-size: 18px; font-weight: bold; }
        button:hover { background-color: #005f93; }
        #result_knn { margin-top: 30px; padding: 25px; border-radius: 8px; font-size: 1.1em; text-align: left; line-height: 1.6; }
        .high-risk { background-color: #ffe0e0; border: 3px solid #cc0000; color: #cc0000; }
        .low-risk { background-color: #e0ffe0; border: 3px solid #009900; color: #008000; }
        .explanation { margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px; font-size: 0.9em; color: #777; text-align: justify; }
    </style>
</head>
<body>

<div class="container">
    <h1>4. k-Nearest Neighbors (k-NN) Churn Prediction Simulation</h1>
    
    <p class="explanation">
        <strong>Method Explanation:</strong> k-NN is a non-parametric instance-based learning algorithm. It classifies a new data point (student) based on the majority class of its 'k' nearest neighbors in the training data. In this simulation, we calculate the Euclidean distance between the new student's profile and several historical "Dropout" and "Retained" prototypes. The closer the distance to a dropout prototype, the higher the risk.
    </p>

    <label for="gpa_norm">1. Normalized GPA (0.0 - 1.0, 0=Low Risk):</label>
    <input type="number" id="gpa_norm" value="0.7" min="0.0" max="1.0" step="0.1">
    
    <label for="attendance_rate">2. Attendance Rate (0.0 - 1.0):</label>
    <input type="number" id="attendance_rate" value="0.8" min="0.0" max="1.0" step="0.1">

    <label for="lms_variance">3. LMS Activity Variance (0.0 - 1.0, 1=Inconsistent):</label>
    <input type="number" id="lms_variance" value="0.5" min="0.0" max="1.0" step="0.1">

    <label for="social_integration_score">4. Social Integration Score (0.0 - 1.0, 0=Isolated):</label>
    <input type="number" id="social_integration_score" value="0.3" min="0.0" max="1.0" step="0.1">

    <label for="debt_load">5. Normalized Debt Load (0.0 - 1.0, 1=High Debt):</label>
    <input type="number" id="debt_load" value="0.7" min="0.0" max="1.0" step="0.1">

    <label for="course_difficulty">6. Avg. Course Difficulty Rating (0.0 - 1.0):</label>
    <input type="number" id="course_difficulty" value="0.6" min="0.0" max="1.0" step="0.1">

    <button onclick="predictChurnKNN()">Predict Risk (k-NN)</button>

    <div id="result_knn">
        Enter student data and click "Predict Risk (k-NN)".
    </div>
</div>

<script>
// --- k-Nearest Neighbors (k-NN) Simulation in JavaScript ---

function euclideanDistance(p1, p2) {
    let sumOfSquares = 0;
    // Features are: GPA (inverted), Attendance (inverted), LMS Variance, Social Integration (inverted), Debt, Difficulty
    for (let i = 0; i < p1.length; i++) {
        sumOfSquares += Math.pow(p1[i] - p2[i], 2);
    }
    return Math.sqrt(sumOfSquares);
}

function predictChurnKNN() {
    // 1. Collect and prepare input data (normalized to 0-1)
    // Note: For distance calculation, low-risk factors (GPA, Attendance, Social) are inverted so that a high value means high risk.
    const input = [
        1.0 - parseFloat(document.getElementById('gpa_norm').value), // 1. Inverted GPA (1.0 = Low GPA = High Risk)
        1.0 - parseFloat(document.getElementById('attendance_rate').value), // 2. Inverted Attendance
        parseFloat(document.getElementById('lms_variance').value), // 3. LMS Variance
        1.0 - parseFloat(document.getElementById('social_integration_score').value), // 4. Inverted Social Integration
        parseFloat(document.getElementById('debt_load').value), // 5. Debt Load
        parseFloat(document.getElementById('course_difficulty').value) // 6. Course Difficulty
    ];

    // 2. Historical Prototypes (Simulated Training Data)
    const prototypes = [
        // High Risk Prototypes (Churn = 1)
        { label: 1, profile: [0.9, 0.8, 0.7, 0.9, 0.8, 0.6], type: "Academic & Financial Failure" }, // Prototype 1 (Dropout)
        { label: 1, profile: [0.5, 0.6, 0.9, 0.7, 0.3, 0.8], type: "Behavioral & Difficulty Strain" }, // Prototype 2 (Dropout)
        { label: 1, profile: [0.8, 0.9, 0.5, 0.9, 0.5, 0.4], type: "Social Isolation & Attendance" }, // Prototype 3 (Dropout)

        // Low Risk Prototypes (Churn = 0)
        { label: 0, profile: [0.1, 0.1, 0.2, 0.2, 0.3, 0.3], type: "Highly Engaged Retainer" }, // Prototype 4 (Retained)
        { label: 0, profile: [0.4, 0.3, 0.3, 0.4, 0.6, 0.7], type: "Average Retainer" } // Prototype 5 (Retained)
    ];

    // 3. Calculate Distances and find the Nearest Neighbors (k=3)
    const distances = prototypes.map(p => ({
        distance: euclideanDistance(input, p.profile),
        label: p.label,
        type: p.type
    }));

    // Sort by distance (closest first)
    distances.sort((a, b) => a.distance - b.distance);

    const k = 3;
    const nearestNeighbors = distances.slice(0, k);

    // 4. Voting (k-NN classification)
    let churnVotes = nearestNeighbors.filter(n => n.label === 1).length;
    let retainVotes = k - churnVotes;

    // 5. Risk Score Derivation (based on distance to churn neighbors)
    // The risk is inversely proportional to the distance to the nearest dropout.
    const nearestDropoutDistance = nearestNeighbors.find(n => n.label === 1)?.distance || 100;
    
    // A function to map distance to risk percentage (closer = higher risk)
    // We use a simple exponential decay for simulation: Risk = 90 * e^(-Distance * 2)
    const rawRiskScore = 90 * Math.exp(-nearestDropoutDistance * 2);
    const riskPercentage = Math.min(rawRiskScore, 95).toFixed(2); // Cap at 95%

    // 6. Output and Detailed Recommendation
    const resultDiv = document.getElementById('result_knn');
    const threshold = 65; 

    let message = `<h2>CHURN PREDICTION RESULT (k-NN SIMULATION)</h2>`;
    message += `<strong>Predicted Churn Probability: ${riskPercentage}%</strong> (Based on distance-based voting)`;
    message += `<p><strong>k-NN Voting Result (k=${k}):</strong> Churn Votes: ${churnVotes}, Retained Votes: ${retainVotes}</p>`;
    
    if (riskPercentage >= threshold) {
        resultDiv.className = 'high-risk';
        message += `<p><strong>CRITICAL RISK: HIGH SIMILARITY TO DROPOUT PROFILES.</strong></p>`;
        
        const closestProfile = nearestNeighbors[0];
        message += `<p><strong>Closest Historical Profile:</strong> This student is most similar to a profile categorized as **'${closestProfile.type}'** (Distance: ${closestProfile.distance.toFixed(3)}).</p>`;

        message += `<h3>PROACTIVE INTERVENTION FOCUS:</h3><ul>`;
        
        // Identify which input factor aligns with the high-risk prototypes
        if (input[0] > 0.7 || input[4] > 0.7) { // Low GPA or High Debt
            message += `<li><strong>Financial/Academic Triage:</strong> The similarity is driven by high financial burden or low academic performance. Direct the student to both Financial Aid and Academic Counseling.</li>`;
        } else if (input[2] > 0.7 || input[3] > 0.7) { // High LMS Variance or Low Social
            message += `<li><strong>Engagement Triage:</strong> The similarity is driven by inconsistent engagement (LMS Variance) and social isolation. Recommend a "Wellness Check" and mandate a meeting with Student Life.</li>`;
        } else {
             message += `<li><strong>Systemic Triage:</strong> The profile exhibits a blend of high-risk factors. Implement the full "Red Alert" retention protocol.</li>`;
        }
        message += `</ul>`;

    } else {
        resultDiv.className = 'low-risk';
        message += `<p><strong>LOW RISK: PROFILE IS CLOSER TO RETAINED PROFILES.</strong></p>`;
        message += `<p><strong>Recommended Action:</strong> Maintain positive reinforcement and utilize data to identify and promote peer-to-peer mentoring opportunities, leveraging the student's stable engagement for community building.</p>`;
    }

    resultDiv.innerHTML = message;
}
</script>

</body>
</html>