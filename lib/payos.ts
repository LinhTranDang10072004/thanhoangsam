import { PayOS } from "@payos/node";

export const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID || "f6b622a5-d357-4982-a4d4-10ab0a14557a",
  apiKey: process.env.PAYOS_API_KEY || "52392e55-a253-4b6d-908b-42ecf76645f1",
  checksumKey: process.env.PAYOS_CHECKSUM_KEY || "1eda25f68dff7eff777d051bd473be9026c98719dce4dff350e7f72d7dac74fc",
});
