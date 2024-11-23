import axios from "axios";
import prisma from "../DB/db.config.js";

const WEBEX_API_URL = "https://webexapis.com/v1/telephony/config/numbers";

// Fetch Webex data and save to DB
export const fetchWebexData = async () => {
  try {
    const response = await axios.get(WEBEX_API_URL, {
      headers: {
        Authorization: `Bearer ${process.env.WEBEX_API_TOKEN}`,
      },
    });

    const phoneNumbers = response.data.phoneNumbers || [];

    await prisma.$transaction(async (prisma) => {
      // Clear old data
      await prisma.webexPhoneNumber.deleteMany();

      // Save new data
      await prisma.webexPhoneNumber.createMany({
        data: phoneNumbers.map((item) => ({
          phoneNumber: item.phoneNumber,
          extension: item.extension,
          esn: item.esn,
          state: item.state,
          phoneNumberType: item.phoneNumberType,
          mainNumber: item.mainNumber,
          includedTelephonyTypes: item.includedTelephonyTypes,
          tollFreeNumber: item.tollFreeNumber,
          locationId: item.location?.id,
          locationName: item.location?.name,
          ownerId: item.owner?.id,
          ownerType: item.owner?.type,
          ownerFirstName: item.owner?.firstName,
          ownerLastName: item.owner?.lastName,
          isServiceNumber: item.isServiceNumber,
        })),
      });
    });

    console.log("Webex data synced successfully!");
    return true;
  } catch (error) {
    if (error.response) {
      // HTTP error from Webex API
      console.error(
        `Failed to sync Webex data: ${error.response.status} - ${error.response.data.message || "Unknown error"}`
      );
    } else {
      // Other errors (e.g., network or token issues)
      console.error(`Failed to sync Webex data: ${error.message}`);
    }
    throw error;
  }
};
