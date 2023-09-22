import axios from "axios";

export async function checkStatus(): Promise<boolean> {
    try{
        const res = await axios.post("/api/status");
        const { status } = res.data;
        
        return status
    }
    catch{
        return false
    }
}
