// src/lib/apiClient.ts
import ky from "ky";

const apiClient = ky.create({
  prefixUrl: "http://localhost:3000", // TODO: Use env var later or default
  headers: {
    "Content-Type": "application/json",
  },
  // You can add hooks for logging, error handling, etc. here
  // hooks: {
  //   beforeRequest: [
  //     request => {
  //       console.log('Starting request:', request.method, request.url);
  //     }
  //   ],
  //   afterResponse: [
  //     async (_request, _options, response) => {
  //       if (!response.ok) {
  //         const body = await response.json(); // Or .text() depending on error format
  //         console.error('API Error Response:', body);
  //         // You could throw a custom error here if needed
  //       }
  //       return response; // Important: return the response
  //     }
  //   ]
  // }
});

export default apiClient;
