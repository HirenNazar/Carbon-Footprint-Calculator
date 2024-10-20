const carbonInterfaceApiKey = 'h95UeVgmFDFRTOtyRt8VuA';
const globalWasteEmissionFactor = 0.075; // in kg CO2e per kg waste

function showForm(formId) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.add('hidden'));
    // Show the selected tab content
    document.getElementById(formId).classList.remove('hidden');
}

async function fetchVehicleMakes() {
    try {
        const response = await fetch('https://www.carboninterface.com/api/v1/vehicle_makes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${carbonInterfaceApiKey}`
            }
        });

        const data = await response.json();
        const vehicleMakeSelect = document.getElementById('vehicle-make');
        data.forEach(make => {
            const option = document.createElement('option');
            option.value = make.data.id;
            option.text = make.data.attributes.name;
            vehicleMakeSelect.add(option);
        });
    } catch (error) {
        console.error('Error fetching vehicle makes:', error);
    }
}

async function fetchVehicleModels() {
    const makeId = document.getElementById('vehicle-make').value;
    if (!makeId) return;

    try {
        const response = await fetch(`https://www.carboninterface.com/api/v1/vehicle_makes/${makeId}/vehicle_models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${carbonInterfaceApiKey}`
            }
        });

        const data = await response.json();
        const vehicleModelSelect = document.getElementById('vehicle-model');
        vehicleModelSelect.innerHTML = '<option value="">Select Model</option>';
        data.forEach(model => {
            const option = document.createElement('option');
            option.value = model.data.id;
            option.text = model.data.attributes.name;
            vehicleModelSelect.add(option);
        });
    } catch (error) {
        console.error('Error fetching vehicle models:', error);
    }
}

async function fetchEmissionEstimate(type, parameters) {
    try {
        const response = await fetch('https://www.carboninterface.com/api/v1/estimates', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${carbonInterfaceApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                ...parameters
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} ${errorData.message}`);
        }

        const data = await response.json();
        return data.data.attributes.carbon_kg || 0;
    } catch (error) {
        console.error('Error fetching emission estimate:', error);
        return 0;
    }
}

async function calculateElectricityFootprint() {
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    try {
        const footprint = await fetchEmissionEstimate('electricity', {
            electricity_unit: 'kwh',
            electricity_value: electricity,
            country: 'us',
            state: 'ca'
        });
        document.getElementById('electricityResult').innerText = `Electricity Footprint: ${footprint.toFixed(2)} kg CO₂e`;
    } catch (error) {
        document.getElementById('electricityResult').innerText = `Error: ${error.message}`;
    }
}

async function calculateNaturalGasFootprint() {
    const naturalGas = parseFloat(document.getElementById('natural-gas').value) || 0;
    try {
        const footprint = await fetchEmissionEstimate('natural_gas', {
            volume: naturalGas,
            volume_unit: 'm3'
        });
        document.getElementById('naturalGasResult').innerText = `Natural Gas Footprint: ${footprint.toFixed(2)} kg CO₂e`;
    } catch (error) {
        document.getElementById('naturalGasResult').innerText = `Error: ${error.message}`;
    }
}

async function calculateAirTravelFootprint() {
    const passengers = parseInt(document.getElementById('passengers').value) || 1;
    const departureAirport = document.getElementById('departure-airport').value.trim().toUpperCase();
    const destinationAirport = document.getElementById('destination-airport').value.trim().toUpperCase();
    try {
        const footprint = await fetchEmissionEstimate('flight', {
            passengers: passengers,
            legs: [{
                departure_airport: departureAirport,
                destination_airport: destinationAirport
            }]
        });
        document.getElementById('airTravelResult').innerText = `Air Travel Footprint: ${footprint.toFixed(2)} kg CO₂e`;
    } catch (error) {
        document.getElementById('airTravelResult').innerText = `Error: ${error.message}`;
    }
}

async function calculateVehicleFootprint() {
    const vehicleModelId = document.getElementById('vehicle-model').value;
    const vehicleTravel = parseFloat(document.getElementById('vehicle-travel').value) || 0;
    if (!vehicleModelId) {
        document.getElementById('vehicleTravelResult').innerText = `Please select a vehicle model.`;
        return;
    }
    try {
        const footprint = await fetchEmissionEstimate('vehicle', {
            distance_unit: 'km',
            distance_value: vehicleTravel,
            vehicle_model_id: vehicleModelId
        });
        document.getElementById('vehicleTravelResult').innerText = `Vehicle Travel Footprint: ${footprint.toFixed(2)} kg CO₂e`;
    } catch (error) {
        document.getElementById('vehicleTravelResult').innerText = `Error: ${error.message}`;
    }
}

function calculateWasteFootprint() {
    const waste = parseFloat(document.getElementById('waste').value) || 0;
    const footprint = waste * globalWasteEmissionFactor;
    document.getElementById('wasteResult').innerText = `Waste Footprint: ${footprint.toFixed(2)} kg CO₂e`;
}

// Fetch vehicle makes on page load
fetchVehicleMakes();

// Show the first form on page load
document.addEventListener('DOMContentLoaded', () => {
    showForm('electricityForm');
});