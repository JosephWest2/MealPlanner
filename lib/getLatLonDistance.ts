export default function GetLatLonDistance(lat1 : number, lat2 : number, lon1 : number, lon2 : number) {
    return Math.acos(Math.sin(DegToRad(lat1))*Math.sin(DegToRad(lat2))+Math.cos(DegToRad(lat1))*Math.cos(DegToRad(lat2))*Math.cos(DegToRad(lon2)-DegToRad(lon1)))*3958.8
}

function DegToRad(n : number) {
    return n * (Math.PI/180);
}