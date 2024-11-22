document.addEventListener('DOMContentLoaded', () => {
    const accountForm = document.getElementById('account-form');
    const uploadSection = document.getElementById('upload-section');
    const uploadButton = document.getElementById('upload-btn');
    const analysisSection = document.getElementById('analysis-section');
    const insightsDiv = document.getElementById('insights');

    let chart1, chart2;

    // Mock user authentication
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Account created successfully!');
        document.getElementById('account-section').classList.add('hidden');
        uploadSection.classList.remove('hidden');
    });

    // File upload and analysis
    uploadButton.addEventListener('click', () => {
        const fileInput = document.getElementById('spreadsheet');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please upload a file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result;
            const parsedData = parseCSV(csvData);

            displayCharts(parsedData);
            displayInsights(parsedData);
        };
        reader.readAsText(file);
    });

    function parseCSV(data) {
        const rows = data.split('\n').slice(1); 
        return rows.map(row => {
            const [date, bought, sold, wasted] = row.split(',');
            return { date, bought: +bought, sold: +sold, wasted: +wasted };
        });
    }

   
    function displayCharts(data) {
        const labels = data.map(item => item.date);
        const boughtData = data.map(item => item.bought);
        const soldData = data.map(item => item.sold);
        const wastedData = data.map(item => item.wasted);

        const ctx1 = document.getElementById('chart1').getContext('2d');
        chart1 = new Chart(ctx1, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'Bought', data: boughtData, borderColor: 'blue', fill: false },
                    { label: 'Sold', data: soldData, borderColor: 'green', fill: false },
                    { label: 'Wasted', data: wastedData, borderColor: 'red', fill: false }
                ]
            }
        });

        const ctx2 = document.getElementById('chart2').getContext('2d');
        chart2 = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: 'Waste %', data: wastedData.map((w, i) => (w / boughtData[i]) * 100), backgroundColor: 'orange' }
                ]
            }
        });

        analysisSection.classList.remove('hidden');
    }

    // Display insights
    function displayInsights(data) {
        const totalWaste = data.reduce((acc, item) => acc + item.wasted, 0);
        const totalBought = data.reduce((acc, item) => acc + item.bought, 0);
        const wastePercent = ((totalWaste / totalBought) * 100).toFixed(2);

        insightsDiv.innerHTML = `
            <p>Total Waste: ${totalWaste} units</p>
            <p>Total Bought: ${totalBought} units</p>
            <p>Waste Percentage: ${wastePercent}%</p>
            <p><strong>Recommendation:</strong> Consider reducing purchase amounts on dates with high waste percentages.</p>
        `;
    }
});
