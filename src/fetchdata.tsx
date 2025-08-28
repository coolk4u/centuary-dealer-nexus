import { useEffect, useState } from "react";
import axios from "axios";

interface OpportunityRecord {
  Id: string;
  Name: string;
  StageName?: string;
  CloseDate?: string;
}

const FetchData = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Get Access Token
  const getAccessToken = async () => {
    const salesforceUrl =
      "https://centuaryindia-dev-ed.develop.my.salesforce.com/services/oauth2/token";
    const clientId =
      "3MVG9nSH73I5aFNh79L8JaABhoZboVvF44jJMEaVNpVy6dzgmTzE_e3R7T2cRQXEJR7gj6wXjRebPYvPGbn1h";
    const clientSecret =
      "18AFFC6E432CC5A9D48D2CECF6386D59651E775DF127D9AC171D28F8DC7C01B9";

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    try {
      const response = await axios.post(salesforceUrl, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setAccessToken(response.data.access_token);
      console.log("✅ Access Token:", response.data.access_token);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : "Unknown error occurred";
      
      console.error("❌ Error fetching access token:", errorMessage);
      setError("Failed to fetch access token.");
    }
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const query = `SELECT Id, Name, StageName, CloseDate FROM Opportunity`;
        const encodedQuery = encodeURIComponent(query);
        const queryUrl = `https://centuaryindia-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

        const response = await axios.get(queryUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const records: OpportunityRecord[] = response.data.records;

        if (records && records.length > 0) {
          console.log("📦 Fetched Opportunities:", records);
          console.table(records);
        } else {
          console.log("ℹ️ No opportunity records found.");
        }
      } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err) 
          ? err.response?.data?.message || err.message 
          : "Unknown error occurred";
        
        console.error("❌ Error fetching data:", errorMessage);
        setError("Failed to fetch data from Salesforce.");
      }
    };

    fetchData();
  }, [accessToken]);

  return null; // No UI
};

export default FetchData;