async function fetchIPAndDeviceInfo() {
    try {
        // Fetch public IP and location
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        document.getElementById('public-ip').textContent = data.ip;
        document.getElementById('location').textContent = `${data.city}, ${data.region}, ${data.country_name}`;

        // Get User-Agent string
        const userAgent = navigator.userAgent;
        document.getElementById('device-info').textContent = userAgent;

        // Fetch local IP address using WebRTC
        const localIP = await getLocalIP();
        document.getElementById('local-ip').textContent = localIP;

        // Fetch detailed device info using DeviceAtlas
        const deviceInfo = await fetchDeviceInfo(userAgent);
        document.getElementById('device-details').textContent = deviceInfo;

    } catch (error) {
        console.error('Error fetching IP and device data:', error);
    }
}

function getLocalIP() {
    return new Promise((resolve, reject) => {
        const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        if (!RTCPeerConnection) {
            reject('WebRTC not supported by browser');
        }
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel('');
        pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(error => reject(error));
        pc.onicecandidate = (ice) => {
            if (!ice || !ice.candidate || !ice.candidate.candidate) return;
            const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate)[1];
            resolve(myIP);
            pc.onicecandidate = null;
        };
    });
}

async function fetchDeviceInfo(userAgent) {
    // Replace with your DeviceAtlas API endpoint and key
    const apiUrl = `https://api.deviceatlas.com/deviceinfo?userAgent=${encodeURIComponent(userAgent)}&apiKey=YOUR_API_KEY`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    // Process the data to extract relevant details
    return `${data.vendor} ${data.model}`;
}
